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
  Td,
  Container,
  useBreakpointValue,
  useMediaQuery
} from '@chakra-ui/react';
import { Link as ReactLink } from 'react-router-dom';
import { ExternalLinkIcon } from '@chakra-ui/icons';

interface HomeProps {}

export const Home: React.FC<HomeProps> = () => {
  const { data } = useUsersQuery();
  const [isSmall] = useMediaQuery('(max-width: 670px)');

  console.log('ISMOBIL', isSmall);

  if (!data) {
    return <div>loading...</div>;
  }
  return (
    <>
      <Box textStyle='h1'>home page</Box>
      <Text>users:</Text>

      {!isSmall ? (
        <Table variant='simple' size='sm'>
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
      ) : (
        <Table variant='simple' size='sm'>
          <Thead>
            <Th>Avatar</Th>
            <Th>Username</Th>
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
                <Td>
                  <b>
                    {x.profile ? (
                      <Text isTruncated maxW='110px'>
                        {x.profile.username}
                      </Text>
                    ) : (
                      'no username'
                    )}
                  </b>
                </Td>
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
      )}
    </>
  );
};
