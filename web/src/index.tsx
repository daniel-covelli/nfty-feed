import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import { App } from './App';
import { getAccessToken } from './accessToken';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink, Observable } from 'apollo-link';
import { TokenRefreshLink } from 'apollo-link-token-refresh';

const cache = new InMemoryCache({});

const requestLink = new ApolloLink(
  (operation, forward) =>
    new Observable((observer) => {
      let handle: any;
      Promise.resolve(operation)
        .then((operation) => {
          const accessToken = getAccessToken();
          console.log('ACCESS TOKEN', accessToken);
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

const client = new ApolloClient({
  link: ApolloLink.from([
    new TokenRefreshLink({
      isTokenValidOrUndefined: () => {
        const accessToken = getAccessToken();
        if (!accessToken) {
          return true;
        }
        try {
        } catch {}
      },
      fetchAccessToken: () => {
        return fetch(getEndpoint('getAccessTokenPath'), {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            'refresh-token': getRefreshToken()
          }
        });
      },
      handleFetch: (accessToken) => {
        const accessTokenDecrypted = jwtDecode(accessToken);
        setAccessToken(accessToken);
        setExpiresIn(parseExp(accessTokenDecrypted.exp).toString());
      },
      handleResponse: (operation, accessTokenField) => (response) => {
        // here you can parse response, handle errors, prepare returned token to
        // further operations
        // returned object should be like this:
        // {
        //    access_token: 'token string here'
        // }
      },
      handleError: (err) => {
        // full control over handling token fetch Error
        console.warn('Your refresh token is invalid. Try to relogin');
        console.error(err);

        // your custom action here
        user.logout();
      }
    }),
    onError(({ graphQLErrors, networkError }) => {
      console.log('GQL ERROR', graphQLErrors);
      console.log('NETWORK ERROR', networkError);
    }),
    requestLink,
    new HttpLink({
      uri: 'http://localhost:4000/graphql',
      credentials: 'include'
    })
  ]),
  cache
});

cache.writeData({
  data: {
    isConnected: true
  }
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);
