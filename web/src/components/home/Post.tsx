import React, { useState, useEffect } from 'react';
import Moment from 'react-moment';
import {
  Box,
  VStack,
  IconButton,
  Icon,
  LinkOverlay,
  Image,
  HStack,
  Flex,
  Spacer,
  Center,
  Text,
  Button,
  Avatar,
  Badge,
  Spinner,
  Skeleton,
  Link
} from '@chakra-ui/react';
import { IoEllipsisHorizontal } from 'react-icons/io5';
import { LinkableAvatar } from '../shared/LinkableAvatar';
import { LinkableText } from '../shared/LinkableText';
import { Size } from '../shared/ClickableAvatar';
import { AiFillFire, AiOutlineFire } from 'react-icons/ai';
import { PostModal } from './PostModal';
import { ContentModal } from './ContentModal';
import { PostButton } from './PostButton';

import {
  useInvisibleMutation,
  useVisibleMutation,
  useRemoveMutation,
  useReaddMutation,
  useLikeMutation,
  useUnlikeMutation,
  useLikedByCurrentProfileQuery,
  GetLikesQuery,
  GetLikesDocument
} from '../../generated/graphql';
import { PostLikesModal } from '../post/PostLikesModal';

interface PostProps {
  post: any;
  admin: boolean;
  loggedIn: boolean;
  profileId: number;
}

export const Post: React.FC<PostProps> = ({ post, admin, loggedIn, profileId }) => {
  const [makeInvisible, { loading: loadingInvisible }] = useInvisibleMutation();
  const [makeVisible, { loading: loadingVisible }] = useVisibleMutation();
  const [like] = useLikeMutation();
  const [unlike] = useUnlikeMutation();
  const [removePost, { loading: loadingRemove }] = useRemoveMutation();
  const [readdPost, { loading: loadingReadd }] = useReaddMutation();
  const { data: likedByUser, loading: likedLoading } = useLikedByCurrentProfileQuery({
    variables: { profileId: profileId, postId: post.id }
  });
  const [liked, setLiked] = useState<boolean>(false);
  const [oppacity, setOppacity] = useState(0);
  const [open, setOpen] = useState(false);
  const [likesModal, setLikesModal] = useState(false);
  const [contentModal, setContentModal] = useState(false);
  const [likes, setLikes] = useState(post.numberOfLikes);
  const [visible, setVisible] = useState(post.visibility === 1);
  const [present, setPresent] = useState(post.removed === 1);

  useEffect(() => {
    if (likedByUser) {
      setLiked(likedByUser.likedByCurrentProfile);
    }
  }, [likedByUser]);

  const onLike = async () => {
    setLiked(!liked);
    setLikes(likes + 1);
    await like({
      variables: { postId: parseFloat(post.id) },
      update: async (store, { data }) => {
        // store.writeQuery<GetLikesQuery>({
        //   query: GetLikesDocument,
        //   variables: { postId: parseFloat(post.id) },
        //   data: {
        //     __typename: 'Query',
        //     getLikes: data?.like.likes
        //   }
        // });
      }
    });
  };

  const onUnlike = async () => {
    setLiked(!liked);
    setLikes(likes - 1);
    await unlike({
      variables: { postId: parseFloat(post.id) },
      update: async (store, { data }) => {
        // store.writeQuery<GetLikesQuery>({
        //   query: GetLikesDocument,
        //   variables: { postId: parseFloat(post.id) },
        //   data: {
        //     __typename: 'Query',
        //     getLikes: data.unlike.likes
        //   }
        // });
      }
    });
  };

  const closeModal = () => {
    setOpen(false);
  };

  const contentModalToggle = () => {
    setContentModal(!contentModal);
  };

  const onDoubleLike = async () => {
    if (liked) {
      await unlike({ variables: { postId: parseFloat(post.id) } });
      setLikes(likes - 1);
    } else {
      await like({ variables: { postId: parseFloat(post.id) } });
      setLikes(likes + 1);
    }

    setLiked(!liked);
    if (!liked) {
      setOppacity(1);
      setTimeout(() => {
        setOppacity(0);
      }, 600);
    }
  };

  const makeInvisibleOnClick = async () => {
    await makeInvisible({
      variables: { postId: parseFloat(post.id) },
      fetchPolicy: 'no-cache'
    });
    setVisible(false);
  };

  const makeVisibleOnClick = async () => {
    await makeVisible({
      variables: { postId: parseFloat(post.id) },
      fetchPolicy: 'no-cache'
    });
    setVisible(true);
  };

  const removeOnClick = async () => {
    await removePost({
      variables: { postId: parseFloat(post.id) },
      fetchPolicy: 'no-cache'
    });
    setPresent(false);
  };

  const readdOnClick = async () => {
    await readdPost({
      variables: { postId: parseFloat(post.id) },
      fetchPolicy: 'no-cache'
    });
    setPresent(true);
  };

  const openLikesModal = () => {
    setLikesModal(true);
  };

  return (
    <Box key={post.id} mb="60px" border="1px" borderColor="gray.200">
      <VStack spacing="5px">
        {admin || profileId === post.owner.id ? (
          <Flex w="100%" px="5px" pt="5px">
            {admin ? (
              <Box>
                <Text>
                  Post: {post.id} Visibility: {post.visibility} Removed: {post.removed}
                </Text>
                <HStack>
                  {!visible ? (
                    <Button size="sm" isLoading={loadingVisible} onClick={makeVisibleOnClick}>
                      make visible
                    </Button>
                  ) : (
                    <Button size="sm" isLoading={loadingInvisible} onClick={makeInvisibleOnClick}>
                      make invisible
                    </Button>
                  )}
                  {!present ? (
                    <Button size="sm" isLoading={loadingReadd} onClick={readdOnClick}>
                      readd post
                    </Button>
                  ) : (
                    <Button size="sm" isLoading={loadingRemove} onClick={removeOnClick}>
                      remove post
                    </Button>
                  )}

                  {!visible ? <Badge colorScheme="red">Invisible</Badge> : null}
                  {!present ? <Badge colorScheme="red">Removed</Badge> : null}
                </HStack>
              </Box>
            ) : null}

            <Spacer />
            <Box pt={admin ? '24px' : '0px'}>
              {profileId === post.owner.id ? (
                <IconButton
                  isDisabled
                  borderRadius="20px"
                  aria-label="edit"
                  icon={<Icon as={IoEllipsisHorizontal} fontSize="20px" />}
                  size="sm"
                  _focus={{
                    boxShadow: 'none'
                  }}
                />
              ) : null}
            </Box>
          </Flex>
        ) : null}

        <Box w="100%">
          <LinkOverlay
            onDoubleClick={loggedIn ? onDoubleLike : undefined}
            key={post.id}
            _hover={{ cursor: loggedIn ? 'pointer' : 'auto' }}>
            <Center>
              <Icon
                as={AiFillFire}
                fontSize="80px"
                color="gray.200"
                position="absolute"
                transition="0.3s"
                opacity={oppacity}
              />
              <Image
                src={post.media}
                fallback={
                  <div
                    style={{
                      height: '400px',
                      width: '598px',
                      maxWidth: '100%',
                      backgroundColor: '#EDF2F7'
                    }}
                  />
                }
              />
            </Center>
          </LinkOverlay>
        </Box>
        <Flex w="100%" pt="3px" px="5px" pb="5px">
          <VStack spacing={0} align="start">
            <HStack pt="2px">
              {loggedIn ? (
                <LinkableAvatar
                  profilePhoto={post.owner.profileImageId}
                  first={post.owner.first}
                  last={post.owner.last}
                  size={Size.SM}
                  route={`/at/${post.owner.username}`}
                />
              ) : (
                <Avatar
                  src={post.owner.profileImageId}
                  name={`${post.owner.first} ${post.owner.last}`}
                  size="sm"
                />
              )}
              {loggedIn ? (
                <Box pb="3px">
                  <LinkableText
                    color={'black'}
                    text={post.owner.username}
                    route={loggedIn ? `/at/${post.owner.username}` : '/'}
                    size={Size.SM}
                    bold={true}
                  />
                </Box>
              ) : (
                <Text size={Size.SM}>
                  <b>{post.owner.username}</b>
                </Text>
              )}
            </HStack>
            <Text pt="4px" fontSize="10px" color="gray.500" textTransform="uppercase">
              <b>
                <Moment fromNow date={post.createdAt} />
              </b>
            </Text>
          </VStack>

          <Spacer />
          <VStack spacing={0} align="flex-end">
            <HStack spacing={4}>
              {/* <Box pb='18px'>
            <PostButton
              isDisabled={true}
              loggedIn={loggedIn}
              onClick={null}
              icon={<Icon as={AiOutlineLink} h={6} w={6} />}
            />
          </Box> */}
              {/* <Box pb='18px'>
            <PostButton
              isDisabled={true}
              loggedIn={loggedIn}
              onClick={openModal}
              icon={<Icon as={AiOutlineInfoCircle} h={6} w={6} />}
            />
          </Box> */}
              {/* <Box pb='18px'>
            <PostButton
              isDisabled={false}
              loggedIn={loggedIn}
              onClick={contentModalToggle}
              icon={<Icon as={AiOutlineExpand} h={6} w={6} />}
            />
          </Box> */}
              {likedLoading ? (
                <Box mt="8px" mb="6px">
                  <Spinner color="gray.400" size="xs" />
                </Box>
              ) : liked ? (
                <PostButton
                  isDisabled={false}
                  loggedIn={loggedIn}
                  onClick={onUnlike}
                  icon={
                    <Box zIndex={12} mt="8px" mb="6px">
                      <svg viewBox="0 0 1024 1024" height="24px" width="24px">
                        <defs>
                          <linearGradient id="gradient" gradientTransform="rotate(90)">
                            <stop offset="5%" stopColor="red" />
                            <stop offset="80%" stopColor="orange" />
                          </linearGradient>
                        </defs>
                        <path
                          fill="url(#gradient)"
                          d="M834.1 469.2A347.49 347.49 0 0 0 751.2 354l-29.1-26.7a8.09 8.09 0 0 0-13 3.3l-13 37.3c-8.1 23.4-23 47.3-44.1 70.8-1.4 1.5-3 1.9-4.1 2-1.1.1-2.8-.1-4.3-1.5-1.4-1.2-2.1-3-2-4.8 3.7-60.2-14.3-128.1-53.7-202C555.3 171 510 123.1 453.4 89.7l-41.3-24.3c-5.4-3.2-12.3 1-12 7.3l2.2 48c1.5 32.8-2.3 61.8-11.3 85.9-11 29.5-26.8 56.9-47 81.5a295.64 295.64 0 0 1-47.5 46.1 352.6 352.6 0 0 0-100.3 121.5A347.75 347.75 0 0 0 160 610c0 47.2 9.3 92.9 27.7 136a349.4 349.4 0 0 0 75.5 110.9c32.4 32 70 57.2 111.9 74.7C418.5 949.8 464.5 959 512 959s93.5-9.2 136.9-27.3A348.6 348.6 0 0 0 760.8 857c32.4-32 57.8-69.4 75.5-110.9a344.2 344.2 0 0 0 27.7-136c0-48.8-10-96.2-29.9-140.9z"
                        />
                      </svg>
                    </Box>
                  }
                />
              ) : likedLoading ? (
                <Skeleton width="20px" height="5px" />
              ) : (
                <Box mt="6px" mb="6px">
                  <PostButton
                    isDisabled={false}
                    loggedIn={loggedIn}
                    onClick={onLike}
                    icon={<Icon as={AiOutlineFire} h="24px" w="24px" />}
                  />
                </Box>
              )}

              {/* <Text fontSize='xs' color={loggedIn ? 'gray.700' : 'gray.400'}>
                  <b>{likes}</b>
                </Text> */}
            </HStack>
            <Text fontSize="10px" color={loggedIn ? 'black' : 'gray.400'}>
              <b>
                <Link
                  onClick={loggedIn ? openLikesModal : undefined}
                  _hover={{ textDecoration: !loggedIn ? 'none' : 'underline' }}>
                  {likes} like{likes > 1 || likes === 0 ? 's' : null}
                </Link>
              </b>
            </Text>
          </VStack>
        </Flex>
      </VStack>
      <PostLikesModal isOpen={likesModal} setOpen={setLikesModal} postId={post.id} />
      <PostModal open={open} onClose={closeModal} post={post} />
      <ContentModal isOpen={contentModal} onClose={contentModalToggle} mediaUrl={post.media} />
    </Box>
  );
};
