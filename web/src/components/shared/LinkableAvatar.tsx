import React from 'react';
import { Size } from './ClickableAvatar';
import { Avatar, Link } from '@chakra-ui/react';
import { Link as ReactLink } from 'react-router-dom';

interface LinkableAvatarProps {
  onClick?: any;
  profilePhoto: string;
  first: string;
  last: string;
  size: Size;
  route: string;
}

export const LinkableAvatar: React.FC<LinkableAvatarProps> = ({
  onClick,
  profilePhoto,
  first,
  last,
  size,
  route
}) => {
  return (
    <Link
      as={ReactLink}
      to={route}
      _focus={{
        boxShadow: 'none'
      }}
      _hover={{ textDecoration: 'none' }}>
      <Avatar size={size} name={`${first} ${last}`} src={profilePhoto} />
    </Link>
  );
};
