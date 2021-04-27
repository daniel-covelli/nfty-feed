import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import { Box, IconButton, Spinner, Link, useToast } from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';

interface DropzoneComponentProps {
  setOpen: any;
  setImage: any;
  setOriginalData: any;
  initialDisplayImage: string;
}

export const DropzoneComponent: React.FC<DropzoneComponentProps> = ({
  setOpen,
  setImage,
  setOriginalData,
  initialDisplayImage
}) => {
  const [imageLoading, setImageLoading] = useState(false);
  const [displayImage, setDisplayImage] = useState(initialDisplayImage);
  const toast = useToast();
  return (
    <Box position='relative'>
      {displayImage ? (
        <>
          <IconButton
            position='absolute'
            right='1'
            top='1'
            variant='outline'
            backgroundColor='white'
            colorScheme='red'
            aria-label='Delete Photo'
            icon={<DeleteIcon />}
            size='xs'
            onClick={() => setDisplayImage('')}
            _focus={{
              boxShadow: 'none'
            }}
          />
          <IconButton
            position='absolute'
            right='1'
            bottom='1'
            variant='outline'
            backgroundColor='white'
            aria-label='Edit Photo'
            icon={<EditIcon />}
            size='xs'
            onClick={() => setOpen(true)}
            _focus={{
              boxShadow: 'none'
            }}
          />
        </>
      ) : null}
      <Dropzone
        maxFiles={1}
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
              setImage([e.target.result]);
              setOriginalData([e.target.result]);
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
