import React from 'react';
import { Box } from '@chakra-ui/react';

interface PostButtonProps {
  isDisabled: boolean;
  icon: any;
  loggedIn: boolean;
  onClick: any;
}

export const PostButton: React.FC<PostButtonProps> = ({
  isDisabled,
  icon,
  loggedIn,
  onClick
}) => {
  return (
    <Box
      color={isDisabled ? 'gray.400' : loggedIn ? 'gray.900' : 'gray.400'}
      _hover={{ cursor: isDisabled ? 'auto' : loggedIn ? 'pointer' : 'auto' }}
      onClick={isDisabled ? null : loggedIn ? onClick : null}>
      {icon}
    </Box>
  );
};
