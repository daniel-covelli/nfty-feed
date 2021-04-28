import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Button
} from '@chakra-ui/react';
import { CropperComponenet } from './CropperComponenet';

interface CropperModalProps {
  open: boolean;
  imageToBeCropped: string;
  setOpen: any;
  cropData: string;
  setCropData: any;
  onClose: any;
}

export const CropperModal: React.FC<CropperModalProps> = ({
  open,
  imageToBeCropped,
  setOpen,
  cropData,
  setCropData,
  onClose
}) => {
  const [cropper, setCropper] = useState<any>();

  const getCropData = async () => {
    if (typeof cropper !== 'undefined') {
      const dataUrl = await cropper.getCroppedCanvas().toDataURL();
      setCropData(dataUrl);
    }
    setOpen(false);
  };

  return (
    <Modal onClose={onClose} size={'xl'} isOpen={open}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Profile Image</ModalHeader>
        <CropperComponenet
          image={imageToBeCropped}
          cropData={cropData}
          cropper={cropper}
          setCropper={setCropper}
        />
        <ModalFooter>
          <Button
            onClick={onClose}
            mr={3}
            variant='outline'
            size='sm'
            colorScheme='red'>
            Close
          </Button>
          <Button onClick={getCropData} size='sm' variant='outline'>
            Crop Image
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
