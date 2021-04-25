import React from 'react';
import { Box } from '@chakra-ui/react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

interface CropperProps {
  image: string;
  cropData: string;
  setCropper: any;
}

export const CropperComponenet: React.FC<CropperProps> = ({
  image,
  setCropper
}) => {
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
        minCropBoxWidth={10}
        background={false}
        responsive={true}
        checkOrientation={true} // https://github.com/fengyuanchen/cropperjs/issues/671
        onInitialized={(instance) => {
          setCropper(instance);
        }}
      />
    </Box>
  );
};
