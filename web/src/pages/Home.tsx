import React, { useEffect } from 'react';
import {
  useUsersQuery,
  useGetTopPostsQuery,
  useMeQuery,
  useGetTopPostsAdminLazyQuery,
  useGetTopPostsLazyQuery
} from '../generated/graphql';
import {
  Text,
  useMediaQuery,
  Table,
  Thead,
  Th,
  Tr,
  Tbody,
  Link,
  Td,
  Avatar,
  Wrap,
  WrapItem,
  Box
} from '@chakra-ui/react';
import { Link as ReactLink } from 'react-router-dom';

import { LoadingContent } from '../components/home/LoadingContent';
import { Post } from '../components/home/Post';

interface HomeProps {}

export const Home: React.FC<HomeProps> = () => {
  const { data, loading } = useUsersQuery();
  const [
    getTopPosts,
    { data: postsNotAdmin, loading: postsLoading }
  ] = useGetTopPostsLazyQuery();
  const [
    getTopPostsAdmin,
    { data: postsAdmin, loading: postsLoadingAdmin }
  ] = useGetTopPostsAdminLazyQuery();
  const { data: me, loading: meLoading } = useMeQuery();

  const [isSmall] = useMediaQuery('(max-width: 670px)');

  let admin: boolean = false;
  let loggedIn: boolean;
  if (me) {
    loggedIn = me.me ? true : false;
  }
  if (me && me.me) {
    admin = me.me.admin === 1;
  }

  useEffect(() => {
    if (me && me.me) {
      {
        me.me.admin ? getTopPostsAdmin() : getTopPosts();
      }
    } else {
      getTopPosts();
    }
  }, [me]);

  let posts: any;
  if (postsNotAdmin && postsNotAdmin.getTopPosts) {
    posts = postsNotAdmin.getTopPosts;
  }
  if (postsAdmin && postsAdmin.getTopPostsAdmin) {
    posts = postsAdmin.getTopPostsAdmin;
  }

  return (
    <>
      {!loading &&
      !postsLoading &&
      !meLoading &&
      !postsLoadingAdmin &&
      posts &&
      me ? (
        <>
          <Box w='100%' maxW='600px'>
            {posts.map((post) => (
              <Post
                key={post.id}
                post={post}
                admin={admin}
                loggedIn={loggedIn}
                profileId={me.me ? me.me.profile.id : -1}
              />
            ))}
          </Box>
          {!isSmall ? (
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
                    <Td>
                      <Link
                        as={ReactLink}
                        _focus={{
                          boxShadow: 'none'
                        }}
                        to={`at/${x.profile ? x.profile.username : x.id}`}>
                        {x.profile ? (
                          <b>
                            <Text maxW='110px'>{x.email}</Text>
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
          )}
        </>
      ) : (
        <LoadingContent />
      )}
    </>
  );
};

// {post.type === 1 ? (
//   <Icon as={IoSync} color='gray.500' h={5} w={5} />
// ) : (
//   <Icon as={IoFingerPrint} color='gray.500' h={5} w={5} />
// )}
