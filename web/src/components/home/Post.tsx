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
  Link,
  Divider
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
  useUnlikeMutation
} from '../../generated/graphql';

interface PostProps {
  post: any;
  admin: boolean;
  loggedIn: boolean;
  profileId: number;
}

export const Post: React.FC<PostProps> = ({
  post,
  admin,
  loggedIn,
  profileId
}) => {
  const [makeInvisible, { loading: loadingInvisible }] = useInvisibleMutation();
  const [makeVisible, { loading: loadingVisible }] = useVisibleMutation();
  const [like] = useLikeMutation();
  const [unlike] = useUnlikeMutation();
  const [removePost, { loading: loadingRemove }] = useRemoveMutation();
  const [readdPost, { loading: loadingReadd }] = useReaddMutation();
  const [liked, setLiked] = useState(false);
  const [oppacity, setOppacity] = useState(0);
  const [open, setOpen] = useState(false);
  const [contentModal, setContentModal] = useState(false);
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    setLikes(post.likes.length);
    if (profileId !== -1) {
      const likedByCurrentUser = post.likes.some(
        (like) => like.owner.id === profileId
      );
      setLiked(likedByCurrentUser);
    }
  }, []);

  const onLike = async () => {
    setLiked(!liked);
    setLikes(likes + 1);
    await like({ variables: { postId: parseFloat(post.id) } });
  };

  const onUnlike = async () => {
    setLiked(!liked);
    setLikes(likes - 1);
    await unlike({ variables: { postId: parseFloat(post.id) } });
  };

  const openModal = () => {
    setOpen(true);
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
      variables: { postId: parseFloat(post.id) }
    });
  };

  const makeVisibleOnClick = async () => {
    await makeVisible({
      variables: { postId: parseFloat(post.id) }
    });
  };

  const removeOnClick = async () => {
    await removePost({
      variables: { postId: parseFloat(post.id) }
    });
  };

  const readdOnClick = async () => {
    await readdPost({
      variables: { postId: parseFloat(post.id) }
    });
  };

  return (
    <Box key={post.id} mb='60px' border='1px' borderColor='gray.200'>
      <VStack spacing='5px'>
        {admin || profileId === post.owner.id ? (
          <Flex w='100%' px='5px' pt='5px'>
            <Box>
              {admin ? (
                <>
                  <Text>
                    Post: {post.id} Visibility: {post.visibility} Removed:{' '}
                    {post.removed}
                  </Text>
                  <HStack>
                    {post.visibility === 1 ? (
                      <Button
                        size='sm'
                        isLoading={loadingInvisible}
                        onClick={makeInvisibleOnClick}>
                        make invisible
                      </Button>
                    ) : (
                      <Button
                        size='sm'
                        isLoading={loadingVisible}
                        onClick={makeVisibleOnClick}>
                        make visible
                      </Button>
                    )}
                    {post.removed === 1 ? (
                      <Button
                        size='sm'
                        isLoading={loadingRemove}
                        onClick={removeOnClick}>
                        remove post
                      </Button>
                    ) : (
                      <Button
                        size='sm'
                        isLoading={loadingReadd}
                        onClick={readdOnClick}>
                        readd post
                      </Button>
                    )}

                    {post.visibility === 0 ? (
                      <Badge colorScheme='red'>Invisible</Badge>
                    ) : null}
                    {post.removed === 0 ? (
                      <Badge colorScheme='red'>Removed</Badge>
                    ) : null}
                  </HStack>
                </>
              ) : null}
            </Box>
            <Spacer />
            <Box pt='24px'>
              {profileId === post.owner.id ? (
                <IconButton
                  isDisabled
                  borderRadius='20px'
                  aria-label='edit'
                  icon={<Icon as={IoEllipsisHorizontal} fontSize='20px' />}
                  size='sm'
                  _focus={{
                    boxShadow: 'none'
                  }}
                />
              ) : null}
            </Box>
          </Flex>
        ) : null}

        <Box w='100%'>
          <LinkOverlay
            onDoubleClick={loggedIn ? onDoubleLike : null}
            key={post.id}
            _hover={{ cursor: loggedIn ? 'pointer' : 'auto' }}>
            <Center>
              <Icon
                as={AiFillFire}
                fontSize='80px'
                color='gray.200'
                position='absolute'
                transition='0.3s'
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
        <Flex w='100%' pt='3px' px='5px' pb='5px'>
          <VStack spacing={0} align='start'>
            <HStack pt='2px'>
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
                  size='sm'
                />
              )}
              {loggedIn ? (
                <Box pb='3px'>
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
            <Text
              pt='4px'
              fontSize='10px'
              color='gray.500'
              textTransform='uppercase'>
              <b>
                <Moment fromNow date={post.createdAt} />
              </b>
            </Text>
          </VStack>

          <Spacer />
          <VStack spacing={0} align='flex-end'>
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

              {liked ? (
                <PostButton
                  isDisabled={false}
                  loggedIn={loggedIn}
                  onClick={onUnlike}
                  icon={
                    <Box zIndex={12} my='7px'>
                      <svg viewBox='0 0 1024 1024' height='24px' width='24px'>
                        <defs>
                          <linearGradient
                            id='gradient'
                            gradientTransform='rotate(90)'>
                            <stop offset='5%' stop-color='red' />
                            <stop offset='80%' stop-color='orange' />
                          </linearGradient>
                        </defs>
                        <path
                          fill='url(#gradient)'
                          d='M834.1 469.2A347.49 347.49 0 0 0 751.2 354l-29.1-26.7a8.09 8.09 0 0 0-13 3.3l-13 37.3c-8.1 23.4-23 47.3-44.1 70.8-1.4 1.5-3 1.9-4.1 2-1.1.1-2.8-.1-4.3-1.5-1.4-1.2-2.1-3-2-4.8 3.7-60.2-14.3-128.1-53.7-202C555.3 171 510 123.1 453.4 89.7l-41.3-24.3c-5.4-3.2-12.3 1-12 7.3l2.2 48c1.5 32.8-2.3 61.8-11.3 85.9-11 29.5-26.8 56.9-47 81.5a295.64 295.64 0 0 1-47.5 46.1 352.6 352.6 0 0 0-100.3 121.5A347.75 347.75 0 0 0 160 610c0 47.2 9.3 92.9 27.7 136a349.4 349.4 0 0 0 75.5 110.9c32.4 32 70 57.2 111.9 74.7C418.5 949.8 464.5 959 512 959s93.5-9.2 136.9-27.3A348.6 348.6 0 0 0 760.8 857c32.4-32 57.8-69.4 75.5-110.9a344.2 344.2 0 0 0 27.7-136c0-48.8-10-96.2-29.9-140.9z'
                        />
                      </svg>
                    </Box>
                  }
                />
              ) : (
                <Box mt='6px' mb='6px'>
                  <PostButton
                    isDisabled={false}
                    loggedIn={loggedIn}
                    onClick={onLike}
                    icon={<Icon as={AiOutlineFire} h='24px' w='24px' />}
                  />
                </Box>
              )}

              {/* <Text fontSize='xs' color={loggedIn ? 'gray.700' : 'gray.400'}>
                  <b>{likes}</b>
                </Text> */}
            </HStack>
            <Text fontSize='10px' color={loggedIn ? 'black' : 'gray.400'}>
              <b>
                {likes}{' '}
                <Link
                  onClick={
                    loggedIn ? () => console.log('likes clicked') : null
                  }>
                  like{likes > 1 || likes === 0 ? 's' : null}
                </Link>
              </b>
            </Text>
          </VStack>
        </Flex>
      </VStack>

      <PostModal open={open} onClose={closeModal} post={post} />
      <ContentModal
        isOpen={contentModal}
        onClose={contentModalToggle}
        mediaUrl={post.media}
      />
    </Box>
  );
};
