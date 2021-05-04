import React, { useRef } from 'react';
import { Box, Text, IconButton, Tooltip } from '@chakra-ui/react';
import { EmailIcon } from '@chakra-ui/icons';

interface SendInvitationLinkProps {
  invitations: number;
  onClick: any;
}

export const SendInvitationLink: React.FC<SendInvitationLinkProps> = ({
  invitations,
  onClick
}) => {
  return (
    <Box postion='relative'>
      {0 > 0 ? (
        <Box
          zIndex={10}
          position='absolute'
          border='1px'
          ml='18.5px'
          borderColor='white'
          bgColor='pink.600'
          color='white'
          lineHeight='0'
          pt='6px'
          pl='3.05px'
          w='14px'
          h='14px'
          borderRadius='50px'>
          <Text fontSize='9px'>
            <b>{invitations}</b>
          </Text>
        </Box>
      ) : null}
      <IconButton
        isDisabled
        borderRadius='20px'
        aria-label='notifications'
        icon={<EmailIcon fontSize='20px' />}
        colorScheme='pink'
        variant='ghost'
        size='sm'
        onClick={onClick}
        _focus={{
          boxShadow: 'none'
        }}
      />
    </Box>
  );
};
