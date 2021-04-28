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
        right='1'
        top='1'
        variant='outline'
        backgroundColor='white'
        colorScheme='red'
        aria-label='Delete Photo'
        icon={<DeleteIcon />}
        size='xs'
        onClick={onDelete}
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
        onClick={onEdit}
        _focus={{
          boxShadow: 'none'
        }}
      />
    </>
  );
};
