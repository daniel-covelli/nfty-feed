import React from 'react';
import { Link, Text } from '@chakra-ui/react';
import { Link as ReactLink } from 'react-router-dom';

interface MenuItemProps {
  to: string;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  children,
  to = '/',
  ...rest
}) => {
  return (
    <Link as={ReactLink} to={to}>
      <Text display='block' {...rest}>
        {children}
      </Text>
    </Link>
  );
};
