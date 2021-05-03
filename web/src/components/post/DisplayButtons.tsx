import React from 'react';
import { IconButton } from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';

interface DisplayButtonsProps {
  onDelete: any;
  onEdit: any;
}

export const DisplayButtons: React.FC<DisplayButtonsProps> = ({
  onDelete,
  onEdit
}) => {
  return (
    <>
      <IconButton
        position='absolute'
        right='5px'
        top='5px'
        variant='outline'
        backgroundColor='white'
        colorScheme='red'
        aria-label='Delete Photo'
        icon={<DeleteIcon />}
        size='sm'
        onClick={onDelete}
        _focus={{
          boxShadow: 'none'
        }}
      />
      <IconButton
        position='absolute'
        right='5px'
        top='41px'
        variant='outline'
        backgroundColor='white'
        aria-label='Delete Photo'
        icon={<EditIcon />}
        size='sm'
        onClick={onEdit}
        _focus={{
          boxShadow: 'none'
        }}
      />
    </>
  );
};
