import React from 'react';
import { Stack, Box, Button, Text, Link } from '@chakra-ui/react';
import { MenuItem } from './MenuItem';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import { setAccessToken } from '../../accessToken';
import { Link as ReactLink } from 'react-router-dom';
import { useMeQuery, useLogoutMutation } from '../../generated/graphql';

interface MenuLinksProps {
  isOpen: Boolean;
}

export const MenuLinks: React.FC<MenuLinksProps> = ({ isOpen }) => {
  const { data, loading } = useMeQuery();
  const [logout, { client }] = useLogoutMutation();

  let body: any = null;

  if (loading) {
    body = 'loading...';
  } else if (data && data.me) {
    body = `You are loggin as: ${data.me.email}`;
  } else {
    body = 'not logged in';
  }

  return (
    <Box
      display={{ base: isOpen ? 'block' : 'none', md: 'block' }}
      flexBasis={{ base: '100%', md: 'auto' }}>
      <Stack
        spacing={8}
        align='center'
        justify={['center', 'space-between', 'flex-end', 'flex-end']}
        direction={['column', 'row', 'row', 'row']}
        pt={[4, 4, 0, 0]}>
        <Link as={ReactLink} to='/'>
          <Text display='block'>Home</Text>
        </Link>
        <Link as={ReactLink} to='/register'>
          <Text display='block'>Register</Text>
        </Link>
        <Link as={ReactLink} to='/login'>
          <Text display='block'>Login</Text>
        </Link>
        <Link as={ReactLink} to='/bye'>
          <Text display='block'>Bye</Text>
        </Link>
        {!loading && data && data.me ? (
          <Button
            rightIcon={<ArrowForwardIcon />}
            size='sm'
            colorScheme='red'
            variant='outline'
            onClick={async () => {
              await logout();
              setAccessToken('');
              await client!.resetStore();
            }}>
            logout
          </Button>
        ) : null}
        <Text color='gray.500' isTruncated>
          {body}
        </Text>
      </Stack>
    </Box>
  );
};
