import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, Observable } from '@apollo/client';
import { getAccessToken, setAccessToken } from './accessToken';
import { jwtDecode } from 'jwt-decode';
import { TokenRefreshLink } from 'apollo-link-token-refresh';

const cache = new InMemoryCache({});

const requestLink = new ApolloLink(
  (operation, forward) =>
    new Observable((observer) => {
      let handle: any;
      Promise.resolve(operation)
        .then((operation) => {
          const accessToken = getAccessToken();
          if (accessToken) {
            operation.setContext({
              headers: {
                authorization: `bearer ${accessToken}`
              }
            });
          }
        })
        .then(() => {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer)
          });
        })
        .catch(observer.error.bind(observer));

      return () => {
        if (handle) handle.unsubscribe();
      };
    })
);

const link = ApolloLink.from([
  new TokenRefreshLink({
    accessTokenField: 'accessToken',
    isTokenValidOrUndefined: async () => {
      const token = getAccessToken();

      if (!token) {
        return true;
      }

      try {
        const { exp } = jwtDecode(token);
        if (exp && Date.now() >= exp * 1000) {
          return false;
        } else {
          return true;
        }
      } catch {
        return false;
      }
    },
    fetchAccessToken: () => {
      return fetch(
        `${
          process.env.NODE_ENV === 'production'
            ? 'https://blooming-scrubland-30700.herokuapp.com/graphql'
            : `${process.env.REACT_APP_SERVER_URL}`
        }/refresh_token`,
        {
          method: 'POST',
          credentials: 'include'
        }
      );
    },
    handleFetch: (accessToken) => {
      setAccessToken(accessToken);
    },
    handleError: (err) => {
      console.warn('Your refresh token is invalid. Try to relogin');
      console.error(err);
    }
  }),
  requestLink,
  new HttpLink({
    uri: `${
      process.env.NODE_ENV === 'production'
        ? 'https://blooming-scrubland-30700.herokuapp.com/graphql'
        : `${process.env.REACT_APP_SERVER_URL}/graphql`
    }`,
    credentials: 'include'
  })
]);

export const client = new ApolloClient({
  link: link,
  cache
});
