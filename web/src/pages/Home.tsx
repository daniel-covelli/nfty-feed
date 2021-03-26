import React from 'react';
import { Link } from 'react-router-dom';
import { useUsersQuery } from '../generated/graphql';

interface HomeProps {}

export const Home: React.FC<HomeProps> = ({}) => {
  const {} = useUsersQuery({ fetchPolicy: 'network-only' });
  return <div>home page</div>;
};
