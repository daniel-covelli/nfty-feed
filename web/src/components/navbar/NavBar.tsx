import React, { useRef, useState } from 'react';
import { Flex, useOutsideClick } from '@chakra-ui/react';
import { MenuLinks } from './MenuLinks';
import { MenuToggle } from './MenuToggle';
import { Logo } from './Logo';

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const toggle = () => setIsOpen(!isOpen);

  useOutsideClick({
    ref: ref,
    handler: () => setIsOpen(false)
  });
  return (
    <Flex
      ref={ref}
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      w="100%"
      mb={8}
      px={4}
      py={2}
      pos="fixed"
      zIndex={100}
      borderBottom="1px"
      borderColor="gray.200"
      bg={['white', 'white', 'white', 'white']}
      color={['primary.500', 'primary.500', 'primary.700', 'primary.700']}>
      <Logo
        paddingLeft="calc(50vw - 507px)"
        color={['primary.500', 'primary.500', 'primary.500', 'primary.500']}
      />
      <MenuToggle toggle={toggle} isOpen={isOpen} />
      <MenuLinks
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        toggle={toggle}
        paddingRight="calc(50vw - 507px)"
      />
    </Flex>
  );
};
