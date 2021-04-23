import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from '@chakra-ui/react';
import { CropperComponenet } from './CropperComponenet';

interface CropperModalProps {
  open: boolean;
  image: string;
  setOpen: any;
  cropData: string;
  setCropData: any;
  setCroppedFile: any;
}

export const CropperModal: React.FC<CropperModalProps> = ({
  open,
  image,
  setOpen,
  cropData,
  setCropData,
  setCroppedFile
}) => {
  const [cropper, setCropper] = useState<any>();

  const getCropData = () => {
    if (typeof cropper !== 'undefined') {
      setCropData(cropper.getCroppedCanvas().toDataURL('image/png'));
      cropper.getCroppedCanvas().toBlob((blob) => {
        setCroppedFile(new File([blob], 'cropped-file.png'));
      });
    }
    setOpen(false);
  };

  return (
    <Modal onClose={() => setOpen(false)} size={'xl'} isOpen={open}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Profile Image</ModalHeader>
        <ModalBody w='100%'>
          <CropperComponenet
            image={image}
            cropData={cropData}
            setCropper={setCropper}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={() => setOpen(false)}
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
