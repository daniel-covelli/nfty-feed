import React from 'react';
import { Box, Icon } from '@chakra-ui/react';
import { IoClose, IoMenu } from 'react-icons/io5';

interface MenuToggleProps {
  toggle: () => any;
  isOpen: Boolean;
}

export const MenuToggle: React.FC<MenuToggleProps> = ({ toggle, isOpen }) => {
  return (
    <Box display={{ base: 'block', md: 'none' }} onClick={toggle}>
      {isOpen ? (
        <Icon as={IoClose} fontSize='22px' color='gray.700' />
      ) : (
        <Icon as={IoMenu} fontSize='22px' color='gray.700' />
      )}
    </Box>
  );
};
