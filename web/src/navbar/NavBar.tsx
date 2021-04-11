import React, { useState } from 'react';
import { Flex, Container } from '@chakra-ui/react';
import { MenuLinks } from './components/MenuLinks';
import { MenuToggle } from './components/MenuToggle';
import { Logo } from './components/Logo';

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <Flex
      as='nav'
      align='center'
      justify='space-between'
      wrap='wrap'
      w='100%'
      mb={8}
      p={4}
      pos='fixed'
      borderBottom='1px'
      borderColor='gray.200'
      bg={['white', 'white', 'white', 'white']}
      color={['primary.500', 'primary.500', 'primary.700', 'primary.700']}>
      <Logo
        w='100px'
        color={['primary.500', 'primary.500', 'primary.500', 'primary.500']}
      />

      <MenuToggle toggle={toggle} isOpen={isOpen} />
      <MenuLinks isOpen={isOpen} />
    </Flex>
  );
};
