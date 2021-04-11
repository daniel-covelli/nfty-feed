import React from 'react';
import { Stack, Box, Button, Text, Link, Spinner } from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import { setAccessToken } from '../../accessToken';
import { Link as ReactLink } from 'react-router-dom';
import { useMeQuery, useLogoutMutation } from '../../generated/graphql';

interface MenuLinksProps {
  isOpen: boolean;
  paddingRight: string;
  toggle: () => any;
}

export const MenuLinks: React.FC<MenuLinksProps> = ({
  isOpen,
  toggle,
  paddingRight
}) => {
  const { data, loading } = useMeQuery();
  const [logout, { client }] = useLogoutMutation();

  let body: any = null;

  if (loading) {
    body = <Spinner size='sm' />;
  } else if (data && data.me) {
    body = `Hello, ${data.me.email}!`;
  }

  return (
    <Box
      paddingRight={paddingRight}
      zIndex={1000}
      display={{ base: isOpen ? 'block' : 'none', md: 'block' }}
      flexBasis={{ base: '100%', md: 'auto' }}>
      <Stack
        spacing={6}
        align='center'
        justify={['center', 'space-between', 'flex-end', 'flex-end']}
        direction={['column', 'row', 'row', 'row']}
        pt={[4, 4, 0, 0]}>
        <Text color='gray.500' isTruncated>
          {body}
        </Text>

        <Link
          as={ReactLink}
          to='/bye'
          onClick={toggle}
          _focus={{
            boxShadow: 'none'
          }}>
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
        ) : (
          <>
            <Link
              as={ReactLink}
              to='/register'
              onClick={toggle}
              _focus={{
                boxShadow: 'none'
              }}>
              <Button
                display='block'
                size='sm'
                colorScheme='pink'
                variant='ghost'
                _focus={{
                  boxShadow: 'none'
                }}>
                Register
              </Button>
            </Link>
            <Link
              as={ReactLink}
              to='/login'
              onClick={toggle}
              _focus={{
                boxShadow: 'none'
              }}>
              <Button
                size='sm'
                colorScheme='pink'
                display='block'
                variant='solid'
                _focus={{
                  boxShadow: 'none'
                }}>
                Login
              </Button>
            </Link>
          </>
        )}
      </Stack>
    </Box>
  );
};
