import React from 'react';
import { Link } from 'react-router-dom';
import { useUsersQuery } from '../generated/graphql';

interface HomeProps {}

export const Home: React.FC<HomeProps> = ({}) => {
  const { data } = useUsersQuery({ fetchPolicy: 'network-only' });

  if (!data) {
    return <div>loading</div>;
  }
  return (
    <div>
      home page
      <div>users:</div>
      <ul>
        {data.users.map((x) => (
          <li key={x.id}>
            {x.id}, {x.email}
          </li>
        ))}
      </ul>
    </div>
  );
};
