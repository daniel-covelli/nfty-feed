import React, { PropsWithChildren } from 'react';
import { Flex } from '@chakra-ui/react';

export const NavBarContainer: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      w="100%"
      mb={8}
      p={8}
      bg={['primary.500', 'primary.500', 'transparent', 'transparent']}
      color={['white', 'white', 'primary.700', 'primary.700']}>
      {children}
    </Flex>
  );
};
