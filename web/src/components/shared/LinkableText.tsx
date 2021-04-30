import React from 'react';
import { Link, Text } from '@chakra-ui/react';
import { Size } from './ClickableAvatar';
import { Link as ReactLink } from 'react-router-dom';

interface LinkableTextProps {
  route: string;
  size: Size;
  bold: boolean;
  text: string;
}

export const LinkableText: React.FC<LinkableTextProps> = ({
  route,
  size,
  bold,
  text
}) => {
  return (
    <Link
      as={ReactLink}
      to={route}
      _focus={{
        boxShadow: 'none'
      }}
      _hover={{ textDecoration: 'none' }}>
      <Text size={size}>{bold ? <b>{text}</b> : { text }}</Text>
    </Link>
  );
};
