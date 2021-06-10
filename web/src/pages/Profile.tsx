import React, { useState, useEffect } from 'react';
import {
  Text,
  Box,
  SkeletonCircle,
  Skeleton,
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
  Spinner,
  FormControl,
  Input,
  Textarea,
  useToast,
  Image
} from '@chakra-ui/react';
import {
  useGetUserQuery,
  useLogoutMutation,
  useGetActiveFollowersLazyQuery,
  useGetActiveFollowingLazyQuery,
  useSubscribeMutation,
  GetActiveFollowersDocument,
  GetActiveFollowersQuery,
  useExistingSubscriptionLazyQuery,
  ExistingSubscriptionDocument,
  ExistingSubscriptionQuery,
  useUnSubscribeMutation,
  useEditProfileMutation,
  GetUserDocument,
  GetUserQuery,
  useGetUsersPostsLazyQuery,
  GetFollowersDataDocument,
  GetFollowersDataQuery
} from '../generated/graphql';
import { Link as ReactLink } from 'react-router-dom';
import { SettingsIcon } from '@chakra-ui/icons';
import { setAccessToken } from '../accessToken';

import { RouteComponentProps } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { DropzoneComponent } from '../components/profile/DropzoneComponenet';
import { CropperModal } from '../components/register/CropperModal';
import { PostsLoading } from '../components/profile/PostsLoading';
import { SubscriptionModal } from '../components/profile/SubscriptionModal';

export const Profile: React.FC<RouteComponentProps> = ({ history }) => {
  const [settingsModal, openSettingsModal] = useState(false);
  const [subscriptionModal, openSubscriptionModal] = useState(false);
  const [editModal, openEditModal] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [croppedImage, setCroppedImage] = useState('');
  const [originalImage, setOriginalImage] = useState('');
  const [cropperModalOpen, setCropperModalOpen] = useState(false);
  const [profilePhotoModalOpen, setProfilePhotoModalOpen] = useState(false);
  const [followersModal, setFollowersModal] = useState(false);

  const [isMobile] = useMediaQuery('(max-width: 520px)');

  const [
    unsubscribe,
    { loading: unsubscribeLoading }
  ] = useUnSubscribeMutation();
  const toast = useToast();
  const [subscribe, { loading: subscribeLoading }] = useSubscribeMutation();
  const [edit, { loading: editLoading }] = useEditProfileMutation();
  const [logout, { client }] = useLogoutMutation();

  const { data, loading, error } = useGetUserQuery({
    variables: { path: window.location.href }
  });
  const [
    getPosts,
    { data: posts, loading: postsLoading }
  ] = useGetUsersPostsLazyQuery();
  const [getFollowers, { data: followers }] = useGetActiveFollowersLazyQuery();
  const [getFollowing, { data: following }] = useGetActiveFollowingLazyQuery();
  const [
    getExistingSubscription,
    { data: existingSubscription }
  ] = useExistingSubscriptionLazyQuery();

  useEffect(() => {
    if (data) {
      getFollowers({ variables: { userId: data.getUser.user.id } });
      getFollowing({ variables: { userId: data.getUser.user.id } });
      getExistingSubscription({ variables: { userId: data.getUser.user.id } });
      setCroppedImage(data.getUser.user.profile.profileImageId);
      setOriginalImage(data.getUser.user.profile.ogProfileImageId);
      getPosts({ variables: { profileId: data.getUser.user.profile.id } });
    }
  }, [data]);

  const onEditModalClose = () => {
    setCroppedImage(data.getUser.user.profile.profileImageId);
    setOriginalImage(data.getUser.user.profile.ogProfileImageId);
    openEditModal(false);
  };

  const onCropperModalClose = () => {
    setOriginalImage(data.getUser.user.profile.ogProfileImageId);
    setCropperModalOpen(false);
  };

  if (loading) {
    return (
      <>
        <Box padding='6'>
          <HStack spacing={'30px'}>
            <SkeletonCircle size='100px' />
            <Skeleton w='calc(100% - 100px - 30px)' h='100px' />
          </HStack>
        </Box>
        <hr />
        <PostsLoading />
      </>
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
        size='sm'
        w='100%'
        variant='outline'
        onClick={() => openSubscriptionModal(true)}
        _focus={{
          boxShadow: 'none'
        }}>
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
        size='sm'
        w='100%'
        variant='solid'
        colorScheme='pink'
        _focus={{
          boxShadow: 'none'
        }}
        onClick={async () => {
          await subscribe({
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

              const oldFollowersData = store.readQuery<GetFollowersDataQuery>({
                query: GetFollowersDataDocument,
                variables: {
                  userId: data.subscribe.followingId
                }
              });

              // console.log(
              //   'OLD FOLLOWING DATA',
              //   oldFollowersData.getFollowersData
              // );
              if (!data || !old) {
                return null;
              }
              // if (oldFollowersData) {
              //   store.writeQuery<GetFollowersDataQuery>({
              //     query: GetFollowersDataDocument,
              //     data: {
              //       __typename: 'Query',
              //       getFollowersData: oldFollowersData.getFollowersData.unshift({profile: {...data.user.profile }})
              //     },
              //     variables: {
              //       userId: data.subscribe.followingId
              //     }
              //   });
              // }
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
                  <Box
                    as='button'
                    onClick={() => {
                      setProfilePhotoModalOpen(true);
                    }}>
                    <Avatar
                      size='full'
                      fontSize='60px'
                      name={
                        data.getUser.user.profile
                          ? `${data.getUser.user.profile.first} ${data.getUser.user.profile.last}`
                          : null
                      }
                      src={
                        data.getUser.user.profile.profileImageId
                          ? `${data.getUser.user.profile.profileImageId}`
                          : ''
                      }
                    />
                  </Box>
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
                  <WrapItem w='100%' maxW={isMobile ? '100%' : '150px'}>
                    <Center w='100%' h='100%'>
                      {data.getUser.me ? (
                        <ButtonGroup
                          size={isMobile ? 'sm' : 'sm'}
                          w='100%'
                          pt='3px'
                          variant='outline'>
                          <Button
                            w='100%'
                            onClick={() => openEditModal(true)}
                            _focus={{
                              boxShadow: 'none'
                            }}>
                            Edit Profile
                          </Button>
                          <IconButton
                            aria-label='Settings'
                            icon={<SettingsIcon />}
                            _focus={{
                              boxShadow: 'none'
                            }}
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
                            <b>{posts ? posts.getUsersPosts.length : 0}</b>{' '}
                            posts
                          </Text>
                        </Box>
                        <Spacer />
                        <Box>
                          <Text size='md'>
                            <Link onClick={() => setFollowersModal(true)}>
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
                        <Box float='right'>
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
            <Box w='100%'>
              <VStack spacing={2} align='stretch' w='100%'>
                <Box>
                  <Text fontSize='md' isTruncated>
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
                        <Link onClick={() => setFollowersModal(true)}>
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
      {/* {posts.map((post) =>
                  post ? (
                    <Post
                      key={post.id}
                      post={post}
                      admin={admin}
                      loggedIn={loggedIn}
                      profileId={me.me ? me.me.profile.id : -1}
                    />
                  ) : null
                )} */}

      {postsLoading ? (
        <PostsLoading />
      ) : posts ? (
        posts.getUsersPosts.length == 0 ? (
          <Center>
            <VStack pt='60px'>
              <Text color='gray.500'>No posts yet</Text>
              <Text color='gray.500'>¯\_₍⸍⸌̣ʷ̣̫⸍̣⸌₎_/¯</Text>
            </VStack>
          </Center>
        ) : (
          <Wrap pt='10px' pl='1px'>
            {posts.getUsersPosts.map((post) =>
              post ? (
                <WrapItem key={post.id} maxW='47.5%'>
                  <Image
                    src={post.media}
                    w='190px'
                    h='190px'
                    objectFit='cover'
                  />
                </WrapItem>
              ) : null
            )}
          </Wrap>
        )
      ) : null}

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
                    src={
                      data.getUser.user.profile.profileImageId
                        ? `${data.getUser.user.profile.profileImageId}`
                        : ''
                    }
                  />
                </Box>
                <Text pb='15px' fontSize='sm' isTruncated>
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
                        const oldFollowers = store.readQuery<
                          GetFollowersDataQuery
                        >({
                          query: GetFollowersDataDocument,
                          variables: {
                            userId: data.unSubscribe.followingId
                          }
                        });

                        const oldFollowersMe = store.readQuery<
                          GetFollowersDataQuery
                        >({
                          query: GetFollowersDataDocument,
                          variables: {
                            userId: data.unSubscribe.userId
                          }
                        });

                        if (!data || !old) {
                          return null;
                        }

                        if (oldFollowersMe) {
                          store.writeQuery<GetFollowersDataQuery>({
                            query: GetFollowersDataDocument,
                            data: {
                              __typename: 'Query',
                              getFollowersData: oldFollowersMe.getFollowersData.map(
                                (follower) =>
                                  follower.userId ===
                                  data.unSubscribe.followingId
                                    ? { ...follower, following: false }
                                    : follower
                              )
                            },
                            variables: {
                              userId: data.unSubscribe.userId
                            }
                          });
                        }

                        if (oldFollowers) {
                          store.writeQuery<GetFollowersDataQuery>({
                            query: GetFollowersDataDocument,
                            data: {
                              __typename: 'Query',
                              getFollowersData: oldFollowers.getFollowersData.filter(
                                (follower) =>
                                  follower.userId !== data.unSubscribe.userId
                              )
                            },
                            variables: {
                              userId: data.unSubscribe.followingId
                            }
                          });
                        }

                        store.writeQuery<GetActiveFollowersQuery>({
                          query: GetActiveFollowersDocument,
                          data: {
                            __typename: 'Query',
                            getActiveFollowers: old.getActiveFollowers.filter(
                              (user) => user.id !== data.unSubscribe.id
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
                  Unfollow
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
      {data.getUser.me ? (
        <Modal
          isOpen={editModal}
          onClose={onEditModalClose} // onEditModalClose
          size='xs'>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Profile</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <>
                <Center>
                  <Formik
                    initialValues={{
                      username: data.getUser.user.profile.username,
                      first: data.getUser.user.profile.first,
                      last: data.getUser.user.profile.last,
                      bio: data.getUser.user.profile.bio
                    }}
                    onSubmit={async ({ username, first, last, bio }) => {
                      const { data } = await edit({
                        variables: {
                          profileImage: croppedImage,
                          ogProfileImage: originalImage,
                          username,
                          first,
                          last,
                          bio
                        },
                        update: (store, { data }) => {
                          store.writeQuery<GetUserQuery>({
                            query: GetUserDocument,
                            data: {
                              __typename: 'Query',
                              getUser: {
                                __typename: 'UserResponse',
                                me: true,
                                user: data.editProfile.user
                              }
                            },
                            variables: { path: window.location.href }
                          });
                        }
                      });
                      if (!data.editProfile.res) {
                        toast({
                          title: data.editProfile.message,
                          duration: 3000,
                          status: 'error',
                          position: 'top',
                          variant: 'subtle',
                          isClosable: true
                        });
                      } else {
                        toast({
                          title: `Profile sucessfully updated`,
                          duration: 3000,
                          status: 'success',
                          position: 'bottom',
                          variant: 'subtle',
                          isClosable: true
                        });
                        if (data.editProfile.message === 'refresh') {
                          history.push(
                            `/at/${data.editProfile.user.profile.username}`
                          );
                        }
                        openEditModal(false);
                      }
                    }}>
                    <Form>
                      <Center pb='10px'>
                        <DropzoneComponent
                          setOpen={setCropperModalOpen}
                          setOriginalData={setOriginalImage}
                          initialDisplayImage={croppedImage ? croppedImage : ''}
                          setCroppedImage={setCroppedImage}
                        />
                      </Center>
                      <Box pb='10px'>
                        <Field id='username' name='username'>
                          {({ field }) => (
                            <FormControl>
                              <Text fontSize='xs'>Username</Text>
                              <Input
                                {...field}
                                id='username'
                                w='250px'
                                placeholder='username'
                              />
                            </FormControl>
                          )}
                        </Field>
                      </Box>
                      <Box pb='10px'>
                        <Field id='first' name='first'>
                          {({ field }) => (
                            <FormControl>
                              <Text fontSize='xs'>First</Text>
                              <Input
                                {...field}
                                id='first'
                                placeholder='first'
                              />
                            </FormControl>
                          )}
                        </Field>
                      </Box>
                      <Box pb='10px'>
                        <Field id='last' name='last'>
                          {({ field }) => (
                            <FormControl>
                              <Text fontSize='xs'>Last</Text>
                              <Input {...field} id='last' placeholder='last' />
                            </FormControl>
                          )}
                        </Field>
                      </Box>
                      <Box pb='10px'>
                        <Field id='bio' name='bio'>
                          {({ field }) => (
                            <FormControl>
                              <Text fontSize='xs'>Bio</Text>
                              <Textarea {...field} id='bio' placeholder='bio' />
                            </FormControl>
                          )}
                        </Field>
                      </Box>
                      <Box pb='10px' float='right'>
                        <Button
                          isLoading={editLoading}
                          type='submit'
                          colorScheme='pink'
                          variant='outline'
                          size='sm'
                          _focus={{
                            boxShadow: 'none'
                          }}>
                          edit profile
                        </Button>
                      </Box>
                    </Form>
                  </Formik>
                </Center>
                <CropperModal
                  imageToBeCropped={originalImage ? originalImage : ''}
                  open={cropperModalOpen}
                  setOpen={setCropperModalOpen}
                  cropData={croppedImage}
                  setCropData={setCroppedImage}
                  onClose={onCropperModalClose}
                />
              </>
            </ModalBody>
          </ModalContent>
        </Modal>
      ) : null}
      <Modal
        onClose={() => setProfilePhotoModalOpen(false)}
        isOpen={profilePhotoModalOpen}
        isCentered>
        <ModalOverlay />
        <ModalContent padding={0} width='0'>
          <Center>
            <Avatar
              padding={0}
              margin={0}
              size='full'
              h='400px'
              width='400px'
              maxH='90vw'
              maxW='90vw'
              fontSize='60px'
              name={
                data.getUser.user.profile
                  ? `${data.getUser.user.profile.first} ${data.getUser.user.profile.last}`
                  : null
              }
              src={
                data.getUser.user.profile.profileImageId
                  ? `${data.getUser.user.profile.profileImageId}`
                  : ''
              }
            />
          </Center>
        </ModalContent>
      </Modal>
      <SubscriptionModal
        isOpen={followersModal}
        setOpen={setFollowersModal}
        userId={data.getUser.user.id}
      />
    </>
  );
};

// {
//   /* <Box py='10px'>
//         <Text>Me?: {data.getUser.me ? 'True' : 'False'}</Text>
//         <Text>Id: {data.getUser.user['id']}</Text>
//         <Text>Email: {data.getUser.user['email']}</Text>
//         {data.getUser.user.profile ? (
//           <>
//             <Text>Username: {data.getUser.user.profile.username}</Text>
//             <Text>Number: {data.getUser.user.profile.phone}</Text>
//             <Text>First: {data.getUser.user.profile.first}</Text>
//             <Text>Last: {data.getUser.user.profile.last}</Text>
//             <Text>Bio: {data.getUser.user.profile.bio}</Text>
//           </>
//         ) : (
//           <Text>Profile: no profile</Text>
//         )}
//       </Box> */
// }

// {
//   __typename: 'User',
//   id: data.editProfile.user.id,
//   email: data.editProfile.user.email,
//   profile: {
//     __typename: 'Profile',
//     id: data.editProfile.user.profile.id,
//     first: data.editProfile.user.profile.first,
//     last: data.editProfile.user.profile.last,
//     username:
//       data.editProfile.user.profile.username,
//     bio: data.editProfile.user.profile.bio,
//     phone: data.editProfile.user.profile.phone
//   }
// }
