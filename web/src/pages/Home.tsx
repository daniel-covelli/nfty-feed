import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  useUsersQuery,
  useMeQuery,
  useGetTopPostsAdminLazyQuery,
  useGetTopPostsLazyQuery,
  GetTopPostsAdminQuery
} from '../generated/graphql';
import {
  Text,
  useMediaQuery,
  Link,
  Avatar,
  Box,
  Flex,
  Center,
  HStack,
  VStack
} from '@chakra-ui/react';
import { Link as ReactLink } from 'react-router-dom';

import { LoadingContent } from '../components/home/LoadingContent';
import { Post } from '../components/home/Post';

interface HomeProps {}

export const Home: React.FC<HomeProps> = () => {
  const [admin, setAdmin] = useState<boolean>(false);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [dataToLoad, setDataToLoad] = useState<boolean>(true);
  const [postsLoading, setPostsLoading] = useState<boolean>(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const { data, loading } = useUsersQuery();
  const [getTopPosts, { data: postsNotAdmin, loading: postsLoadingNotAdmin }] =
    useGetTopPostsLazyQuery();
  const [getTopPostsAdmin, { data: postsAdmin, loading: postsLoadingAdmin }] =
    useGetTopPostsAdminLazyQuery();
  const { data: me, loading: meLoading } = useMeQuery();
  // const [isSmall] = useMediaQuery('(max-width: 670px)');
  const [isNotDesktop] = useMediaQuery('(max-width: 1024px)');
  const loader = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const request = async () => {
      setPostsLoading(true);
      if (me && me.me) {
        setLoggedIn(true);
      }
      if (me && me.me && me.me.admin) {
        setAdmin(true);
        return getTopPostsAdmin({ variables: { page: page } });
      }
      if (me) {
        return getTopPosts({ variables: { page: page } });
      }
    };
    request();
  }, [me]);

  useEffect(() => {
    if (postsAdmin && postsAdmin.getTopPostsAdmin && dataToLoad && me) {
      if (postsAdmin.getTopPostsAdmin.length < 4) {
        setDataToLoad(false);
      }
      if (postsAdmin.getTopPostsAdmin.length === 5) {
        return setPosts((posts) => [postsAdmin.getTopPostsAdmin[0], ...posts]);
      }
      setPosts((posts) => [...posts, ...postsAdmin.getTopPostsAdmin]);
      setPostsLoading(false);
    }
  }, [postsAdmin]);

  useEffect(() => {
    if (postsNotAdmin && postsNotAdmin.getTopPosts) {
      if (postsNotAdmin.getTopPosts.length < 4) {
        setDataToLoad(false);
      }
      if (postsNotAdmin.getTopPosts.length === 5) {
        setPosts((posts) => [postsNotAdmin.getTopPosts[0], ...posts]);
      }

      setPosts((posts) => [...posts, ...postsNotAdmin.getTopPosts]);
      setPostsLoading(false);
    }
  }, [postsNotAdmin]);

  useEffect(() => {
    if (page > 1 && dataToLoad) {
      admin
        ? getTopPostsAdmin({ variables: { page: page } })
        : getTopPosts({ variables: { page: page } });
    }
  }, [page]);

  const handleObserver = useCallback<IntersectionObserverCallback>((entries) => {
    const target = entries[0];
    if (target.isIntersecting && dataToLoad) {
      setPage((prev) => prev + 1);
    }
  }, []);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: '800px',
      threshold: 0
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
  }, []);

  return (
    <>
      {!loading && !postsLoading && !meLoading && posts && me ? (
        <>
          {!isNotDesktop ? (
            <Flex>
              <Box w="100%" maxW="600px">
                {posts.map(
                  (post) =>
                    post.id && (
                      <Post
                        key={post.id}
                        post={post}
                        admin={admin}
                        loggedIn={loggedIn}
                        profileId={me.me?.profile ? me.me.profile.id : -1}
                      />
                    )
                )}
                {!dataToLoad ? (
                  <Center pb="40px">
                    <Text color="gray.500">No more posts</Text>
                  </Center>
                ) : null}
              </Box>
              {!isNotDesktop ? (
                <Box pl="80px">
                  <Box position="fixed">
                    <Text>
                      <b>Users</b>
                    </Text>
                    <Box
                      h="400px"
                      w="300px"
                      overflow="scroll"
                      style={{ overscrollBehaviorY: 'contain' }}>
                      {data?.users.map((x) => (
                        <HStack pb="10px" key={x.id}>
                          <Link
                            as={ReactLink}
                            _focus={{
                              boxShadow: 'none'
                            }}
                            to={`at/${x.profile ? x.profile.username : x.id}`}>
                            {x.profile ? (
                              <Avatar
                                name={`${x.profile.first} ${x.profile.last}`}
                                size="xs"
                                src={x.profile.profileImageId ? `${x.profile.profileImageId}` : ''}
                              />
                            ) : (
                              <Avatar size="xs" />
                            )}
                          </Link>
                          <Link
                            as={ReactLink}
                            to={`at/${x.profile ? x.profile.username : x.id}`}
                            _focus={{
                              boxShadow: 'none'
                            }}>
                            <Text fontSize="sm">
                              {process.env.REACT_APP_ENVIRONMENT === 'development'
                                ? x.email
                                : x.profile
                                  ? x.profile.username
                                  : ''}
                            </Text>
                          </Link>
                        </HStack>
                      ))}
                    </Box>

                    <Text fontSize="10px" pt="20px">
                      Created by{' '}
                      <Link
                        color="teal.500"
                        href="https://github.com/daniel-covelli/nfty-feed"
                        isExternal>
                        Daniel Covelli
                      </Link>{' '}
                      👨‍💻
                    </Text>
                  </Box>
                </Box>
              ) : null}
            </Flex>
          ) : (
            <Center>
              <Box w="100%" maxW="600px">
                {posts.map((post) =>
                  post.id ? (
                    <Post
                      key={post.id}
                      post={post}
                      admin={admin}
                      loggedIn={loggedIn}
                      profileId={me.me?.profile ? me.me.profile.id : -1}
                    />
                  ) : null
                )}
              </Box>
            </Center>
          )}
        </>
      ) : (
        <LoadingContent />
      )}
      {dataToLoad ? <Box ref={loader} height="96px" /> : null}
    </>
  );
};
