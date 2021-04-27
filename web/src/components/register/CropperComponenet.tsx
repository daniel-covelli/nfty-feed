import React, { useRef } from 'react';
import { Box, Button } from '@chakra-ui/react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

interface CropperProps {
  image: string;
  cropData: string;
  setCropper: any;
  cropper: any;
}

export const CropperComponenet: React.FC<CropperProps> = ({
  image,
  setCropper,
  cropper
}) => {
  const onRotate = () => {
    cropper.rotate(90);
  };
  return (
    <Box style={{ width: '100%' }}>
      <Cropper
        style={{ height: '350px', width: '100%' }}
        initialAspectRatio={1}
        preview='.img-preview'
        src={image}
        viewMode={1}
        aspectRatio={1}
        guides={true}
        dragMode='move'
        autoCropArea={0.6}
        minCropBoxHeight={10}
        cropBoxResizable={false}
        cropBoxMovable={false}
        minCropBoxWidth={10}
        background={false}
        responsive={true}
        rotatable={true}
        checkOrientation={true} // https://github.com/fengyuanchen/cropperjs/issues/671
        onInitialized={(instance) => {
          setCropper(instance);
        }}
      />
      <Button
        onClick={onRotate}
        position='absolute'
        size='sm'
        top={20}
        right={4}
        zIndex={10}
        _focus={{
          boxShadow: 'none'
        }}>
        Rotate
      </Button>
    </Box>
  );
};
