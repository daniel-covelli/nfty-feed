import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, Observable } from '@apollo/client';
import { jwtDecode } from 'jwt-decode';
import { TokenRefreshLink } from 'apollo-link-token-refresh';
import { onError } from '@apollo/client/link/error';

const cache = new InMemoryCache({});

// const requestLink = new ApolloLink(
//   (operation, forward) =>
//     new Observable((observer) => {
//       let handle: any;
//       Promise.resolve(operation)
//         .then((operation) => {
//           const accessToken = getAccessToken();
//           if (accessToken) {
//             operation.setContext({
//               headers: {
//                 authorization: `bearer ${accessToken}`
//               }
//             });
//           }
//         })
//         .then(() => {
//           handle = forward(operation).subscribe({
//             next: observer.next.bind(observer),
//             error: observer.error.bind(observer),
//             complete: observer.complete.bind(observer)
//           });
//         })
//         .catch(observer.error.bind(observer));

//       return () => {
//         if (handle) handle.unsubscribe();
//       };
//     })
// );

const errorLink = onError(({ graphQLErrors }) => {
  if (!graphQLErrors) {
    return;
  }
  const hasUnauthorizedError = graphQLErrors.some(error => error.extensions?.code === 'UNAUTHENTICATED');
  if (hasUnauthorizedError) {
    window.location.href = `/login`;
  }
});

const link = new HttpLink({
  uri: `${process.env.REACT_APP_SERVER_URL}/graphql`,
  credentials: 'include'
})

export const client = new ApolloClient({
  link: errorLink.concat(link),
  cache
});
