import React from 'react';
import { Box, Text, Link } from '@chakra-ui/react';
import { Link as ReactLink } from 'react-router-dom';

interface LogoProps {
  paddingLeft: string;
  color: string[];
}

export const Logo: React.FC<LogoProps> = (props) => {
  return (
    <Box {...props}>
      <Text
        fontSize='xl'
        fontWeight='extrabold'
        bgGradient='linear(to-l, #7928CA,#FF0080)'
        bgClip='text'>
        <Link
          as={ReactLink}
          to='/'
          _focus={{
            boxShadow: 'none'
          }}>
          NftyFeed
        </Link>
      </Text>
    </Box>
  );
};
