import React from 'react';
import { Link, Text } from '@chakra-ui/react';
import { Size } from './ClickableAvatar';
import { Link as ReactLink } from 'react-router-dom';

interface LinkableTextProps {
  route: string;
  size: Size;
  bold: boolean;
  color: string;
  text: string;
}

export const LinkableText: React.FC<LinkableTextProps> = ({
  route,
  size,
  bold,
  text,
  color
}) => {
  return (
    <Link
      as={ReactLink}
      to={route}
      _focus={{
        boxShadow: 'none'
      }}>
      <Text color={color} size={size} isTruncated>
        {bold ? <b>{text}</b> : { text }}
      </Text>
    </Link>
  );
};
