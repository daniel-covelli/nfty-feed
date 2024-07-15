import { LoaderFunction, redirect } from 'react-router-dom';
import { MeDocument, MeQueryResult } from '../generated/graphql';
import { client } from '../apollo';

const rerouteIfNotLoggedIn: LoaderFunction = async ({ request }) => {
  try {
    const { error } = await client.query<MeQueryResult>({ query: MeDocument });
    if (error?.graphQLErrors) {
      return redirect('/login');
    }
    return null;
  } catch (error) {
    return redirect('/login');
  }
};

const rerouteIfLoggedIn: LoaderFunction = async ({ request }) => {
  try {
    await client.query<MeQueryResult>({ query: MeDocument });

    return redirect('/');
  } catch (error) {
    return null;
  }
};

const middleware = { rerouteIfNotLoggedIn, rerouteIfLoggedIn };

export default middleware;
