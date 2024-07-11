import { createRoot } from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import { ChakraProvider, Container } from '@chakra-ui/react';
import theme from './theme/theme';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './routes';
import { client } from './apollo';
import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev';

const router = createBrowserRouter(routes);

if (process.env.NODE_ENV === 'development') {
  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}

createRoot(document.getElementById('root')!).render(
  <ApolloProvider client={client}>
    <ChakraProvider theme={theme}>
      <RouterProvider router={router} />
    </ChakraProvider>
  </ApolloProvider>
);
