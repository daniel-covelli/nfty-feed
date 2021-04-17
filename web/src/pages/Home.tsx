import React from 'react';
import { useUsersQuery } from '../generated/graphql';
import {
  Box,
  UnorderedList,
  ListItem,
  Text,
  Link,
  Avatar,
  Stack,
  Table,
  Thead,
  Th,
  Tbody,
  Tr,
  Td
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
    <>
      <Box textStyle='h1'>home page</Box>
      <Text>users:</Text>
      <Table variant='simple'>
        <Thead>
          <Th>Avatar</Th>
          <Th>Id</Th>
          <Th>Username</Th>
          <Th>Email</Th>
          <Th>Link</Th>
        </Thead>
        <Tbody>
          {data.users.map((x) => (
            <Tr key={x.id}>
              <Td>
                {x.profile ? (
                  <Avatar
                    name={`${x.profile.first} ${x.profile.last}`}
                    size='sm'
                  />
                ) : (
                  <Avatar src='https://bit.ly/broken-link' size='sm' />
                )}
              </Td>
              <Td>{x.id}</Td>
              <Td>
                <b>{x.profile ? x.profile.username : 'no username'}</b>
              </Td>
              <Td>{x.email ? x.email : 'no email'}</Td>
              <Td>
                <Link
                  as={ReactLink}
                  to={`at/${x.profile ? x.profile.username : x.id}`}
                  color='teal.500'>
                  <ExternalLinkIcon ml='6px' mb='3px' />
                </Link>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  );
};
