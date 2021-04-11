import React from 'react';
import { Box, Text, Link } from '@chakra-ui/react';
import { Link as ReactLink } from 'react-router-dom';

interface LogoProps {
  w: string;
  color: string[];
}

export const Logo: React.FC<LogoProps> = (props) => {
  return (
    <Box {...props}>
      <Link as={ReactLink} to='/'>
        <Text
          fontSize='lg'
          fontWeight='extrabold'
          bgGradient='linear(to-l, #7928CA,#FF0080)'
          bgClip='text'>
          NftyFeed
        </Text>
      </Link>
    </Box>
  );
};
