import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  Center,
  Image
} from '@chakra-ui/react';

interface ContentModalProps {
  mediaUrl: string;
  isOpen: boolean;
  onClose: any;
}

export const ContentModal: React.FC<ContentModalProps> = ({
  mediaUrl,
  onClose,
  isOpen
}) => {
  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent padding={0} width='0'>
        <Center>
          <Image src={mediaUrl} maxW='95vw' maxH='95vh' />
        </Center>
      </ModalContent>
    </Modal>
  );
};
