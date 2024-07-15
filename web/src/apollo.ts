import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { LoaderFunction, redirect } from 'react-router-dom';
import { MeDocument, MeQueryResult } from './generated/graphql';

const cache = new InMemoryCache({});

const link = new HttpLink({
  uri: `${process.env.REACT_APP_SERVER_URL}/graphql`,
  credentials: 'include'
});

export const client = new ApolloClient({
  link,
  cache
});
