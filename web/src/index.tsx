import { createRoot } from 'react-dom/client';
import { getAccessToken, setAccessToken } from './accessToken';
import { App } from './App';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink, Observable } from 'apollo-link';
import { TokenRefreshLink } from 'apollo-link-token-refresh';
import { jwtDecode } from 'jwt-decode';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme/theme';

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
            : `${process.env.REACT_APP_SERVER_URL}/graphql`
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
  }) as any,
  onError(({ graphQLErrors, networkError }) => {
    console.log('GRAPHQL ERROR', graphQLErrors);
    console.log('NETWORK ERROR', networkError);
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

const client = new ApolloClient({
  link: link as any,
  defaultOptions: {
    mutate: { errorPolicy: 'ignore' }
  },
  cache
});
const root = createRoot(document.getElementById('root')!);
root.render(
  <ApolloProvider client={client}>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </ApolloProvider>
);
