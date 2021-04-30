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
  Avatar
} from '@chakra-ui/react';
import { IoEllipsisHorizontal } from 'react-icons/io5';
import { LinkableAvatar } from '../shared/LinkableAvatar';
import { LinkableText } from '../shared/LinkableText';
import { Size } from '../shared/ClickableAvatar';
import {
  AiFillFire,
  AiOutlineFire,
  AiOutlineInfoCircle,
  AiOutlineLink,
  AiOutlineExpand
} from 'react-icons/ai';
import { PostModal } from './PostModal';
import { ContentModal } from './ContentModal';
import { PostButton } from './PostButton';

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
  const [liked, setLiked] = useState(false);
  const [oppacity, setOppacity] = useState(0);
  const [open, setOpen] = useState(false);
  const [contentModal, setContentModal] = useState(false);

  const likes = post.likes.length;

  const onLike = () => {
    setLiked(!liked);
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

  const onDoubleLike = () => {
    setLiked(!liked);
    if (!liked) {
      setOppacity(1);
      setTimeout(() => {
        setOppacity(0);
      }, 600);
    }
  };

  return (
    <Box key={post.id} pb='60px'>
      post id: {post.id}
      <VStack spacing='5px'>
        <Flex w='100%'>
          <Box>
            {admin ? (
              <HStack>
                <Button size='sm'>make invisible</Button>
                <Button size='sm'>remove</Button>
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

        <Flex w='100%' pt='4px'>
          <Box>
            <HStack pt='3px'>
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
                  onClick={onLike}
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
