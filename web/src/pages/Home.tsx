import React from 'react';
import { useUsersQuery } from '../generated/graphql';
import { Box, UnorderedList, ListItem, Text, Link } from '@chakra-ui/react';
import { Link as ReactLink } from 'react-router-dom';

interface HomeProps {}

export const Home: React.FC<HomeProps> = () => {
  const { data } = useUsersQuery({ fetchPolicy: 'network-only' });

  if (!data) {
    return <div>loading...</div>;
  }
  return (
    <div>
      <Box textStyle='h1'>home page</Box>
      <Text>users:</Text>
      <UnorderedList>
        {data.users.map((x) => (
          <ListItem key={x.id}>
            id: {x.id}, email: {x.email},{' '}
            <Link as={ReactLink} to={`at/${x.id}`} color='teal.500'>
              link
            </Link>
          </ListItem>
        ))}
      </UnorderedList>
    </div>
  );
};
