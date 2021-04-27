import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Button,
  Text
} from '@chakra-ui/react';
import { CropperComponenet } from './CropperComponenet';

interface CropperModalProps {
  open: boolean;
  image: string;
  setOpen: any;
  cropData: string;
  setCropData: any;
}

export const CropperModal: React.FC<CropperModalProps> = ({
  open,
  image,
  setOpen,
  cropData,
  setCropData
}) => {
  const [cropper, setCropper] = useState<any>();

  const getCropData = async () => {
    console.log('START GET CROP DATA METHOD');
    if (typeof cropper !== 'undefined') {
      // console.log('CROPPER', cropper);
      // cropper.getCroppedCanvas().toBlob((blob) => {
      //   setCroppedFile([new File([blob], 'cropped-file.png')]);
      // });

      const dataUrl = await cropper.getCroppedCanvas().toDataURL();
      setCropData(dataUrl);
    }
    setOpen(false);
  };

  return (
    <Modal onClose={() => setOpen(false)} size={'xl'} isOpen={open}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Profile Image</ModalHeader>
        <CropperComponenet
          image={image}
          cropData={cropData}
          cropper={cropper}
          setCropper={setCropper}
        />
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
