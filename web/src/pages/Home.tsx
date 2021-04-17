import React from 'react';
import { useUsersQuery } from '../generated/graphql';
import {
  Box,
  UnorderedList,
  ListItem,
  Text,
  Link,
  Avatar,
  Stack
} from '@chakra-ui/react';
import { Link as ReactLink } from 'react-router-dom';
import { ExternalLinkIcon } from '@chakra-ui/icons';

interface HomeProps {}

export const Home: React.FC<HomeProps> = () => {
  const { data } = useUsersQuery();

  if (!data) {
    return <div>loading...</div>;
  }
  return (
    <div>
      <Stack direction='column' spacing='10px'>
        <Box textStyle='h1'>home page</Box>
        <Text>users:</Text>
        {data.users.map((x) => (
          <Box key={x.id}>
            <Stack direction='row'>
              {x.profile ? (
                <Avatar
                  name={`${x.profile.first} ${x.profile.last}`}
                  size='sm'
                />
              ) : (
                <Avatar src='https://bit.ly/broken-link' size='sm' />
              )}
              <Box pt='3px'>
                id: {x.id},{' '}
                <b>{x.profile ? x.profile.username : 'no username'}</b>, email:{' '}
                {x.email}
                <Link
                  as={ReactLink}
                  to={`at/${x.profile ? x.profile.username : x.id}`}
                  color='teal.500'>
                  <ExternalLinkIcon ml='3px' mb='3px' />
                </Link>
              </Box>
            </Stack>
          </Box>
        ))}
      </Stack>
    </div>
  );
};
