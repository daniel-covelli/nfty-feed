import React, { useRef } from 'react';
import Dropzone from 'react-dropzone';
import { Box, Text, useToast } from '@chakra-ui/react';

interface PostDropzoneProps {
  setImage: any;
  editImage: boolean;
  mobile: boolean;
  setEditImage: any;
}

export const PostDropzone: React.FC<PostDropzoneProps> = ({
  setImage,
  editImage,
  mobile,
  setEditImage
}) => {
  const toast = useToast();
  const dropzoneRef = useRef(null);

  const onDrop = (f) => {
    console.log('ON DROP');
    const file = f[0];
    const input = file['name'];
    const lastIndex = input.lastIndexOf('.');
    const fileType = input.substring(lastIndex + 1);
    if (fileType === 'HEIC') {
      toast({
        title: `File format is not supported, try using a .JPG or .PNG file...`,
        status: 'error',
        position: 'top',
        variant: 'subtle',
        isClosable: true
      });
    } else {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = (e) => {
        setImage([e.target.result]);
      };
    }
  };

  const dropzone = dropzoneRef.current;
  if (editImage) {
    if (dropzone) {
      dropzone.open();
    }
    setEditImage(false);
  }

  return (
    <Dropzone
      ref={dropzoneRef}
      multiple={false}
      onDrop={(file) => onDrop(file)}>
      {({ getRootProps, getInputProps }) => (
        <Box
          style={{
            maxHeight: '90vh',
            width: '100%',
            borderWidth: '2px',
            outlineColor: 'transparent'
          }}
          {...getRootProps()}>
          <input {...getInputProps()} />
          <Box
            style={{
              width: '100%',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundColor: '#F7FAFC',
              height: `${mobile ? '50vh' : '150px'}`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer'
            }}
            __hover={{ boxShadow: 'grey' }}>
            <Text color='pink.500'>
              <b>Select an image</b>
            </Text>
          </Box>
        </Box>
      )}
    </Dropzone>
  );
};
