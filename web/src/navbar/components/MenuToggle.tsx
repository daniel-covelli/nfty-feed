import React from 'react';
import { Box, MenuIcon } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';

interface MenuToggleProps {
  toggle: () => any;
  isOpen: Boolean;
}

export const MenuToggle: React.FC<MenuToggleProps> = ({ toggle, isOpen }) => {
  return (
  //   <Box display={{ base: 'block', md: 'none' }} onClick={toggle}>
  //     {isOpen ? <CloseIcon /> : <MenuIcon />}
  //   </Box>
  );
};
