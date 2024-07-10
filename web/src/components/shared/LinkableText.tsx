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
  onClick?: () => void;
}

export const LinkableText: React.FC<LinkableTextProps> = ({
  route,
  size,
  bold,
  text,
  color,
  onClick
}) => {
  return (
    <Link
      onClick={onClick}
      as={ReactLink}
      to={route}
      _focus={{
        boxShadow: 'none'
      }}>
      <Text color={color} size={size} isTruncated>
        {bold ? <b>{text}</b> : text}
      </Text>
    </Link>
  );
};
