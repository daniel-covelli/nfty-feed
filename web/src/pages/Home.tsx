import React from 'react';
import { useUsersQuery } from '../generated/graphql';
import {
  Box,
  Text,
  Link,
  Avatar,
  Table,
  Thead,
  Th,
  Tbody,
  Tr,
  Td,
  useMediaQuery,
  Spinner
} from '@chakra-ui/react';
import { Link as ReactLink } from 'react-router-dom';
import { ExternalLinkIcon } from '@chakra-ui/icons';

interface HomeProps {}

export const Home: React.FC<HomeProps> = () => {
  const { data, loading } = useUsersQuery();
  const [isSmall] = useMediaQuery('(max-width: 670px)');

  return (
    <>
      <Box textStyle='h1'>home page</Box>
      <Text>users:</Text>
      {!loading ? (
        !isSmall ? (
          <Table size='sm'>
            <Thead>
              <Tr>
                <Th>Avatar</Th>
                <Th>Id</Th>
                <Th>Username</Th>
                <Th>Email</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.users.map((x) => (
                <Tr key={x.id}>
                  <Td>
                    <Link
                      as={ReactLink}
                      _focus={{
                        boxShadow: 'none'
                      }}
                      to={`at/${x.profile ? x.profile.username : x.id}`}>
                      {x.profile ? (
                        <Avatar
                          name={`${x.profile.first} ${x.profile.last}`}
                          size='sm'
                          src={
                            x.profile.profileImageId
                              ? `${x.profile.profileImageId}`
                              : ''
                          }
                        />
                      ) : (
                        <Avatar size='sm' />
                      )}
                    </Link>
                  </Td>
                  <Td>{x.id}</Td>
                  <Td>
                    <Link
                      as={ReactLink}
                      _focus={{
                        boxShadow: 'none'
                      }}
                      to={`at/${x.profile ? x.profile.username : x.id}`}>
                      <b>
                        {x.profile ? (
                          <Text>{x.profile.username}</Text>
                        ) : (
                          'no username'
                        )}
                      </b>
                    </Link>
                  </Td>
                  <Td>{x.email ? x.email : 'no email'}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        ) : (
          <Table variant='simple' size='sm'>
            <Thead>
              <Tr>
                <Th>Avatar</Th>
                <Th>Username</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.users.map((x) => (
                <Tr key={x.id}>
                  <Td>
                    <Link
                      as={ReactLink}
                      _focus={{
                        boxShadow: 'none'
                      }}
                      to={`at/${x.profile ? x.profile.username : x.id}`}>
                      {x.profile ? (
                        <Avatar
                          name={`${x.profile.first} ${x.profile.last}`}
                          size='sm'
                          src={
                            x.profile.profileImageId
                              ? `${x.profile.profileImageId}`
                              : ''
                          }
                        />
                      ) : (
                        <Avatar size='sm' />
                      )}
                    </Link>
                  </Td>
                  <Td>
                    <Link
                      as={ReactLink}
                      _focus={{
                        boxShadow: 'none'
                      }}
                      to={`at/${x.profile ? x.profile.username : x.id}`}>
                      {x.profile ? (
                        <b>
                          <Text isTruncated maxW='110px'>
                            {x.profile.username}
                          </Text>
                        </b>
                      ) : (
                        'no username'
                      )}
                    </Link>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )
      ) : (
        <Spinner size='sm' />
      )}
    </>
  );
};
