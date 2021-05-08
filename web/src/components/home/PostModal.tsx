import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Text,
  ModalFooter,
  Button
} from '@chakra-ui/react';

interface PostModalProps {
  open: boolean;
  onClose: any;
  post: any;
}

export const PostModal: React.FC<PostModalProps> = ({
  open,
  onClose,
  post
}) => {
  return (
    <Modal isOpen={open} onClose={onClose} size='sm'>
      <ModalOverlay />
      <ModalContent bgColor='#38125e'>
        <ModalHeader color='white'>
          {post.title ? post.title : `${post.owner.username}'s post`}
        </ModalHeader>

        <ModalBody>
          <Text color='white'>This is text bruv</Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme='whiteAlpha' mr={3} onClick={onClose} size='sm'>
            Close
          </Button>
          <Button colorScheme='whiteAlpha' variant='ghost' size='sm'>
            Secondary Action
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
