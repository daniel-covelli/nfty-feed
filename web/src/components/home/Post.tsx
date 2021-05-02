import React, { useState, useEffect } from 'react';
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
  Spinner
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
  GetTopPostsAdminDocument,
  GetTopPostsAdminQuery,
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
      <Text>
        Post: {post.id} Visibility: {post.visibility} Removed: {post.removed}
      </Text>
      <VStack spacing='5px'>
        <Flex w='100%' px='5px' pt='5px'>
          <Box>
            {admin ? (
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
            ) : null}
          </Box>
          <Spacer />
          <Box>
            {profileId === post.owner.id ? (
              <IconButton
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

        <Box>
          <LinkOverlay
            onDoubleClick={loggedIn ? onDoubleLike : null}
            key={post.id}
            _hover={{ cursor: loggedIn ? 'pointer' : 'auto' }}>
            <Center>
              <Icon
                as={AiFillFire}
                fontSize='60px'
                color='gray.200'
                position='absolute'
                transition='0.3s'
                opacity={oppacity}
              />
              <Image src={post.media} />
            </Center>
          </LinkOverlay>
        </Box>

        <Flex w='100%' pt='3px' px='5px' pb='5px'>
          <Box>
            <HStack pt='4px'>
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
          </Box>
          <Spacer />

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

            <VStack spacing={0}>
              {liked ? (
                <PostButton
                  isDisabled={false}
                  loggedIn={loggedIn}
                  onClick={onUnlike}
                  icon={<Icon as={AiFillFire} h={6} w={6} color='orange' />}
                />
              ) : (
                <PostButton
                  isDisabled={false}
                  loggedIn={loggedIn}
                  onClick={onLike}
                  icon={<Icon as={AiOutlineFire} h={6} w={6} />}
                />
              )}

              <Text fontSize='xs' color={loggedIn ? 'gray.700' : 'gray.400'}>
                <b>{likes}</b>
              </Text>
            </VStack>
          </HStack>
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
