import React from 'react';
import Dropzone from 'react-dropzone';
import { Box, position, IconButton, Spinner, Link } from '@chakra-ui/react';
import { SettingsIcon, DeleteIcon } from '@chakra-ui/icons';

interface DropzoneComponentProps {
  cropData: string;
  imageLoading: boolean;
  setCropData: any;
  setOpen: any;
  setImageLoading: any;
  setImage: any;
}

export const DropzoneComponent: React.FC<DropzoneComponentProps> = ({
  cropData,
  setImageLoading,
  imageLoading,
  setCropData,
  setOpen,
  setImage
}) => {
  return (
    <Box position='relative'>
      {cropData ? (
        <>
          <IconButton
            position='absolute'
            right='1'
            bottom='1'
            aria-label='Edit Photo'
            icon={<SettingsIcon />}
            size='xs'
            onClick={() => setOpen(true)}
            _focus={{
              boxShadow: 'none'
            }}
          />
          <IconButton
            position='absolute'
            right='1'
            top='1'
            colorScheme='red'
            aria-label='Delete Photo'
            icon={<DeleteIcon />}
            size='xs'
            onClick={() => setCropData('')}
            _focus={{
              boxShadow: 'none'
            }}
          />
        </>
      ) : null}
      <Dropzone
        noClick={cropData ? true : false}
        noDrag={cropData ? true : false}
        onDrop={(files) => {
          setImageLoading(true);
          const file = files[0];
          console.log('FILE', file);
          const reader = new FileReader();
          const url = reader.readAsDataURL(file);
          reader.onloadend = () => {
            setImage([reader.result]);
          };
          setImageLoading(false);
          setOpen(true);
        }}>
        {({ getRootProps, getInputProps }) => (
          <Box
            style={{
              borderWidth: '2px',
              borderColor: `${cropData ? 'lightGrey' : 'grey'}`,
              borderStyle: `${cropData ? 'solid' : 'dashed'}`,
              borderRadius: '100px',
              outlineColor: 'transparent'
            }}
            {...getRootProps()}
            __hover={{ boxShadow: 'grey' }}>
            <input {...getInputProps()} />
            <Box
              style={{
                backgroundImage: `url(${cropData ? cropData : null})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundColor: 'lightgrey',
                height: '120px',
                width: '120px',
                borderRadius: '100px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: `${cropData ? 'auto' : 'pointer'}`,
                borderStyle: 'dotted'
              }}
              __hover={{ boxShadow: 'grey' }}>
              {!cropData ? (
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
