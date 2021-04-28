import React, { useState, useEffect } from 'react';
import Dropzone from 'react-dropzone';
import { Box, Spinner, Link, useToast } from '@chakra-ui/react';
import { DisplayButtons } from '../shared/DisplayButtons';

interface DropzoneComponentProps {
  setOpen: any;
  setOriginalData: any;
  initialDisplayImage: string;
  setCroppedImage: any;
}

export const DropzoneComponent: React.FC<DropzoneComponentProps> = ({
  setOpen,
  setOriginalData,
  initialDisplayImage,
  setCroppedImage
}) => {
  const [imageLoading, setImageLoading] = useState(false);
  const [displayImage, setDisplayImage] = useState('');

  useEffect(() => {
    setDisplayImage(initialDisplayImage);
  }, [initialDisplayImage]);

  const onDelete = () => {
    setCroppedImage('');
    setOriginalData('');
    setDisplayImage('');
  };

  const onEdit = () => {
    setOpen(true);
  };

  const toast = useToast();

  return (
    <Box position='relative'>
      {displayImage ? (
        <DisplayButtons onDelete={onDelete} onEdit={onEdit} />
      ) : null}
      <Dropzone
        multiple={false}
        noClick={displayImage ? true : false}
        noDrag={displayImage ? true : false}
        onDrop={(files) => {
          setImageLoading(true);
          const file = files[0];
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
              setOriginalData(e.target.result);
            };
            setOpen(true);
          }

          setImageLoading(false);
        }}>
        {({ getRootProps, getInputProps }) => (
          <Box
            style={{
              borderWidth: '2px',
              borderColor: `${displayImage ? 'lightGrey' : 'grey'}`,
              borderStyle: `${displayImage ? 'solid' : 'dashed'}`,
              borderRadius: '100px',
              outlineColor: 'transparent'
            }}
            {...getRootProps()}
            __hover={{ boxShadow: 'grey' }}>
            <input {...getInputProps()} />
            <Box
              style={{
                backgroundImage: `url(${displayImage ? displayImage : null})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundColor: '#f0f0f0',
                height: '120px',
                width: '120px',
                borderRadius: '100px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: `${displayImage ? 'auto' : 'pointer'}`,
                borderStyle: 'dotted'
              }}
              __hover={{ boxShadow: 'grey' }}>
              {!displayImage ? (
                imageLoading ? (
                  <Spinner size='sm' />
                ) : (
                  <Link>
                    <b>add image</b>
                  </Link>
                )
              ) : null}
            </Box>
          </Box>
        )}
      </Dropzone>
    </Box>
  );
};
