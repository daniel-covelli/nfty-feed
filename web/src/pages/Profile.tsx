import React, { useState, useEffect } from 'react';
import {
  Text,
  Box,
  SkeletonCircle,
  SkeletonText,
  Link,
  HStack,
  Container,
  Grid,
  GridItem,
  Wrap,
  WrapItem,
  Flex,
  Button,
  Avatar,
  AspectRatio,
  Heading,
  useMediaQuery,
  VStack,
  Spacer,
  Center,
  ButtonGroup,
  IconButton,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  Spinner
} from '@chakra-ui/react';
import {
  useGetUserQuery,
  useLogoutMutation,
  useGetActiveFollowersLazyQuery,
  useGetActiveFollowingLazyQuery,
  useSubscribeMutation,
  GetActiveFollowersDocument,
  GetActiveFollowersQuery,
  useMeQuery,
  useExistingSubscriptionLazyQuery,
  ExistingSubscriptionDocument,
  ExistingSubscriptionQuery,
  useUnSubscribeMutation
} from '../generated/graphql';
import { Link as ReactLink } from 'react-router-dom';
import { SettingsIcon } from '@chakra-ui/icons';
import { setAccessToken } from '../accessToken';

import { RouteComponentProps } from 'react-router-dom';

interface ProfileProps {}

export const Profile: React.FC<RouteComponentProps> = ({ history }) => {
  const [settingsModal, openSettingsModal] = useState(false);
  const [subscriptionModal, openSubscriptionModal] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [isMobile] = useMediaQuery('(max-width: 520px)');

  const [
    unsubscribe,
    { loading: unsubscribeLoading }
  ] = useUnSubscribeMutation();
  const [subscribe, { loading: subscribeLoading }] = useSubscribeMutation();
  const [logout, { client }] = useLogoutMutation();
  const { data, loading, error } = useGetUserQuery({
    variables: { path: window.location.href }
  });

  const [getFollowers, { data: followers }] = useGetActiveFollowersLazyQuery();
  const [getFollowing, { data: following }] = useGetActiveFollowingLazyQuery();
  const [
    getExistingSubscription,
    { data: existingSubscription, loading: existingSubscriptionLoading }
  ] = useExistingSubscriptionLazyQuery();

  useEffect(() => {
    if (data) {
      getFollowers({ variables: { userId: data.getUser.user.id } });
      getFollowing({ variables: { userId: data.getUser.user.id } });
      getExistingSubscription({ variables: { userId: data.getUser.user.id } });
    }
  }, [data]);

  if (loading) {
    return (
      <Box padding='6'>
        <SkeletonCircle size='10' />
        <SkeletonText mt='4' noOfLines={4} spacing='4' />
      </Box>
    );
  }

  if (error) {
    console.log('ERROR MESSAGE', error.message);
    if (error.message === 'not authenticated') {
      return (
        <Text>
          To access this page please{' '}
          <Link as={ReactLink} to={`/register`} color='teal.500'>
            register
          </Link>{' '}
          or{' '}
          <Link as={ReactLink} to={`/login`} color='teal.500'>
            login
          </Link>
          .
        </Text>
      );
    }

    return (
      <HStack>
        <Text>🥴</Text>
        <Text>Looks like this user doesnt exist...</Text>
      </HStack>
    );
  }

  let subscriptionDisplay = <Spinner size='sm' />;
  if (existingSubscription && existingSubscription.existingSubscription) {
    subscriptionDisplay = (
      <Button
        size='xs'
        w='100%'
        variant='outline'
        onClick={() => openSubscriptionModal(true)}>
        Following
      </Button>
    );
  } else if (
    existingSubscription &&
    !existingSubscription.existingSubscription
  ) {
    subscriptionDisplay = (
      <Button
        isLoading={subscribeLoading}
        size='xs'
        w='100%'
        variant='solid'
        colorScheme='pink'
        onClick={async () => {
          const response = await subscribe({
            variables: {
              userIdWhoIsBeingFollowed: data.getUser.user.id
            },
            update: (store, { data }) => {
              const old = store.readQuery<GetActiveFollowersQuery>({
                query: GetActiveFollowersDocument,
                variables: {
                  userId: data.subscribe.followingId
                }
              });
              if (!data || !old) {
                return null;
              }
              store.writeQuery<GetActiveFollowersQuery>({
                query: GetActiveFollowersDocument,
                data: {
                  __typename: 'Query',
                  getActiveFollowers: [
                    ...old.getActiveFollowers,
                    data.subscribe
                  ]
                },
                variables: {
                  userId: data.subscribe.followingId
                }
              });
              store.writeQuery<ExistingSubscriptionQuery>({
                query: ExistingSubscriptionDocument,
                data: {
                  __typename: 'Query',
                  existingSubscription: true
                },
                variables: {
                  userId: data.subscribe.followingId
                }
              });
            }
          });
          console.log('RESPONSE', response);
        }}>
        Follow
      </Button>
    );
  }

  return (
    <>
      <Container maxW='container.md' p='0'>
        <Box mb='20px'>
          <Grid
            templateColumns='repeat(9, 1fr)'
            maxH='250px'
            h='100%'
            pb='10px'>
            <GridItem colSpan={3}>
              <Box pb='10px' pr='10px'>
                <AspectRatio maxW='150px' w='100%' ratio={1 / 1}>
                  <Avatar
                    size='full'
                    fontSize='60px'
                    name={
                      data.getUser.user.profile
                        ? `${data.getUser.user.profile.first} ${data.getUser.user.profile.last}`
                        : null
                    }
                    src=''
                  />
                </AspectRatio>
              </Box>
            </GridItem>
            <GridItem colSpan={6}>
              <Box pl='10px' pb='10px'>
                <Wrap>
                  <WrapItem maxW='100%' display='inline-block'>
                    <Box w='100%' pr='10px'>
                      <Heading size={isMobile ? 'md' : 'lg'}>
                        {data.getUser.user.profile
                          ? data.getUser.user.profile.username
                          : 'No username'}
                      </Heading>
                    </Box>
                  </WrapItem>
                  <WrapItem w='100%' maxW={isMobile ? '100%' : '100px'}>
                    <Center w='100%' h='100%'>
                      {data.getUser.me ? (
                        <ButtonGroup
                          w='100%'
                          pt='3px'
                          size='xs'
                          variant='outline'>
                          <Button w='100%' isDisabled>
                            Edit Profile
                          </Button>
                          <IconButton
                            aria-label='Settings'
                            icon={<SettingsIcon />}
                            onClick={() => openSettingsModal(true)}
                          />
                        </ButtonGroup>
                      ) : (
                        subscriptionDisplay
                      )}
                    </Center>
                  </WrapItem>
                </Wrap>
              </Box>

              {!isMobile ? (
                <Box maxW='300px' w='100%' pl='10px'>
                  <VStack spacing={2} align='stretch'>
                    <Box>
                      <Flex>
                        <Box>
                          <Text size='md'>
                            <b>0</b> posts
                          </Text>
                        </Box>
                        <Spacer />
                        <Box>
                          <Text size='md'>
                            <Link>
                              <b>
                                {followers
                                  ? followers.getActiveFollowers.length
                                  : 0}
                              </b>{' '}
                              followers
                            </Link>
                          </Text>
                        </Box>
                        <Spacer />
                        <Box>
                          <Text size='md'>
                            <Link>
                              <b>
                                {following
                                  ? following.getActiveFollowing.length
                                  : 0}
                              </b>{' '}
                              following
                            </Link>
                          </Text>
                        </Box>
                      </Flex>
                    </Box>
                    <Box>
                      <Text fontSize='md' isTruncated>
                        {data.getUser.user.profile
                          ? `${data.getUser.user.profile.first} ${data.getUser.user.profile.last}`
                          : 'No name'}
                      </Text>
                    </Box>
                    <Box>
                      <Text fontSize='sm' noOfLines={4}>
                        {data.getUser.user.profile
                          ? data.getUser.user.profile.bio
                          : null}
                      </Text>
                    </Box>
                  </VStack>
                </Box>
              ) : null}
            </GridItem>
          </Grid>
          {isMobile ? (
            <Box maxW='300px' w='100%'>
              <VStack spacing={2} align='stretch'>
                <Box>
                  <Text fontSize='sm' isTruncated>
                    <b>
                      {data.getUser.user.profile
                        ? `${data.getUser.user.profile.first} ${data.getUser.user.profile.last}`
                        : 'No name'}
                    </b>
                  </Text>
                </Box>

                <Box>
                  <Text fontSize='sm' noOfLines={4}>
                    {data.getUser.user.profile
                      ? data.getUser.user.profile.bio
                      : null}
                  </Text>
                </Box>
                <Box>
                  <Flex>
                    <Box>
                      <Text size='sm'>
                        <b>0</b> posts
                      </Text>
                    </Box>
                    <Spacer />
                    <Box>
                      <Text size='sm'>
                        <Link>
                          <b>
                            {followers
                              ? followers.getActiveFollowers.length
                              : 0}
                          </b>{' '}
                          followers
                        </Link>
                      </Text>
                    </Box>
                    <Spacer />
                    <Box>
                      <Text size='sm'>
                        <Link>
                          <b>
                            {following
                              ? following.getActiveFollowing.length
                              : 0}
                          </b>{' '}
                          following
                        </Link>
                      </Text>
                    </Box>
                  </Flex>
                </Box>
              </VStack>
            </Box>
          ) : null}
        </Box>
      </Container>

      <hr />
      <Modal
        isOpen={settingsModal}
        onClose={() => openSettingsModal(false)}
        size='xs'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Profile Settings</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb='20px'>
            <Center>
              <VStack w='100%' maxW='200px'>
                <Button w='100%' variant='outline' isDisabled>
                  Notifications
                </Button>
                <Button
                  isLoading={logoutLoading}
                  w='100%'
                  variant='outline'
                  colorScheme='red'
                  onClick={async () => {
                    setLogoutLoading(true);
                    await logout();
                    setAccessToken('');
                    history.push('/');
                    await client!.resetStore();
                    setLogoutLoading(false);
                  }}>
                  Log Out
                </Button>
              </VStack>
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={subscriptionModal}
        onClose={() => openSubscriptionModal(false)}
        size='xs'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Unfollow</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Center>
              <VStack w='100%' maxW='200px'>
                <Box mb='15px'>
                  <Avatar
                    size='2xl'
                    fontSize='60px'
                    name={
                      data.getUser.user.profile
                        ? `${data.getUser.user.profile.first} ${data.getUser.user.profile.last}`
                        : null
                    }
                    src=''
                  />
                </Box>
                <Text pb='15px' fontSize='sm'>
                  Unfollow @{data.getUser.user.profile.username}?
                </Text>

                <Button
                  isLoading={unsubscribeLoading}
                  w='100%'
                  variant='outline'
                  colorScheme='red'
                  onClick={async () => {
                    await unsubscribe({
                      variables: { userId: data.getUser.user.id },
                      update: (store, { data }) => {
                        const old = store.readQuery<GetActiveFollowersQuery>({
                          query: GetActiveFollowersDocument,
                          variables: {
                            userId: data.unSubscribe.followingId
                          }
                        });
                        if (!data || !old) {
                          return null;
                        }
                        store.writeQuery<GetActiveFollowersQuery>({
                          query: GetActiveFollowersDocument,
                          data: {
                            __typename: 'Query',
                            getActiveFollowers: old.getActiveFollowers.filter(
                              (user) => user.id != data.unSubscribe.id
                            )
                          },
                          variables: {
                            userId: data.unSubscribe.followingId
                          }
                        });
                        store.writeQuery<ExistingSubscriptionQuery>({
                          query: ExistingSubscriptionDocument,
                          data: {
                            __typename: 'Query',
                            existingSubscription: false
                          },
                          variables: {
                            userId: data.unSubscribe.followingId
                          }
                        });
                      }
                    });
                    openSubscriptionModal(false);
                  }}>
                  Unsubscribe
                </Button>
                <Button
                  w='100%'
                  variant='outline'
                  onClick={() => openSubscriptionModal(false)}>
                  Cancel
                </Button>
              </VStack>
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

{
  /* <Box py='10px'>
        <Text>Me?: {data.getUser.me ? 'True' : 'False'}</Text>
        <Text>Id: {data.getUser.user['id']}</Text>
        <Text>Email: {data.getUser.user['email']}</Text>
        {data.getUser.user.profile ? (
          <>
            <Text>Username: {data.getUser.user.profile.username}</Text>
            <Text>Number: {data.getUser.user.profile.phone}</Text>
            <Text>First: {data.getUser.user.profile.first}</Text>
            <Text>Last: {data.getUser.user.profile.last}</Text>
            <Text>Bio: {data.getUser.user.profile.bio}</Text>
          </>
        ) : (
          <Text>Profile: no profile</Text>
        )}
      </Box> */
}
