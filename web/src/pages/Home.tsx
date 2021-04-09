import React from 'react';
import { useUsersQuery } from '../generated/graphql';
import { Box } from '@chakra-ui/react';

interface HomeProps {}

export const Home: React.FC<HomeProps> = () => {
  const { data } = useUsersQuery({ fetchPolicy: 'network-only' });

  if (!data) {
    return <div>loading...</div>;
  }
  return (
    <div>
      <Box textStyle='h1'>home page</Box>
      <div>users:</div>
      <ul>
        {data.users.map((x) => (
          <li key={x.id}>
            id: {x.id}, email: {x.email}
          </li>
        ))}
      </ul>
    </div>
  );
};
