import React, { useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Text,
  Box,
  Center,
  Spinner,
  HStack,
  VStack,
  Divider
} from '@chakra-ui/react';
import { useGetLikesLazyQuery } from '../../generated/graphql';
import { LinkableAvatar } from '../shared/LinkableAvatar';
import { Size } from '../shared/ClickableAvatar';
import { LinkableText } from '../shared/LinkableText';
import Moment from 'react-moment';

interface PostLikesModalProps {
  isOpen: boolean;
  setOpen: any;
  postId: number;
}

export const PostLikesModal: React.FC<PostLikesModalProps> = ({
  isOpen,
  setOpen,
  postId
}) => {
  const [getLikes, { data: likes, loading }] = useGetLikesLazyQuery({
    variables: { postId }
  });

  useEffect(() => {
    if (isOpen) {
      getLikes();
    }
  }, [isOpen]);

  const onClose = () => {
    setOpen(false);
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} size='sm'>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontSize='md'>Likes</ModalHeader>
        <ModalCloseButton
          _focus={{
            boxShadow: 'none'
          }}
        />
        <Divider />
        {loading ? (
          <Box height='400px' maxH='90vh'>
            <Center>
              <Spinner color='gray.500' />
            </Center>
          </Box>
        ) : (
          <Box
            px='10px'
            pt='5px'
            pb='5px'
            height='400px'
            maxH='90vh'
            overflow='scroll'>
            {likes ? (
              likes.getLikes.length === 0 ? (
                <Center>
                  <VStack pt='30px'>
                    <Text color='gray.500'>No likes on this post yet</Text>
                    <Text color='gray.500'>¯\_₍⸍⸌̣ʷ̣̫⸍̣⸌₎_/¯</Text>
                  </VStack>
                </Center>
              ) : (
                likes.getLikes.map((like) => (
                  <HStack spacing={3} pb='5px' key={like.id}>
                    <LinkableAvatar
                      profilePhoto={like.owner.profileImageId}
                      first={like.owner.first}
                      last={like.owner.last}
                      size={Size.SM}
                      route={`/at/${like.owner.username}`}
                    />
                    <VStack spacing={0}>
                      <Box w='175px' float='left'>
                        <LinkableText
                          route={`/at/${like.owner.username}`}
                          size={Size.SM}
                          bold={true}
                          text={like.owner.username}
                          color='black'
                        />
                      </Box>

                      <Box w='175px' float='left'>
                        <Text fontSize='xs' isTruncated>
                          {like.owner.first} {like.owner.last}
                        </Text>
                      </Box>
                    </VStack>

                    <Box w='100%' float={'right'}>
                      <Text
                        float={'right'}
                        pt='4px'
                        fontSize='10px'
                        color='gray.500'
                        textTransform='uppercase'>
                        <b>
                          <Moment fromNow date={like.createdAt} />
                        </b>
                      </Text>
                    </Box>
                  </HStack>
                ))
              )
            ) : null}
          </Box>
        )}
      </ModalContent>
    </Modal>
  );
};
