import React from 'react';
import { Box, Avatar } from '@chakra-ui/react';

export enum Size {
  SM = 'sm',
  XS = 'xs',
  FULL = 'full'
}

interface ClickableAvatarProps {
  onClick: any;
  profilePhoto: string;
  first: string;
  last: string;
  size: Size;
}

export const ClickableAvatar: React.FC<ClickableAvatarProps> = ({
  onClick,
  profilePhoto,
  first,
  last,
  size
}) => {
  return (
    <Box as='button' onClick={onClick}>
      <Avatar size={size} name={`${first} ${last}`} src={profilePhoto} />
    </Box>
  );
};
