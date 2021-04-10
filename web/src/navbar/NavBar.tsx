import React from 'react';

import { Box, Stack, Link, Text, Button, Flex } from '@chakra-ui/react';
import { Link as ReactLink } from 'react-router-dom';
import { ArrowForwardIcon, CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import { setAccessToken } from '../accessToken';
import { useMeQuery, useLogoutMutation } from '../generated/graphql';

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = (props) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggle = () => setIsOpen(!isOpen);

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
    <Flex
      as='nav'
      align='center'
      justify='space-between'
      wrap='wrap'
      w='100%'
      mb={8}
      p={8}
      bg={['primary.500', 'primary.500', 'transparent', 'transparent']}
      color={['primary.500', 'primary.500', 'primary.700', 'primary.700']}>
      <Box
        w='100px'
        color={['primary.500', 'primary.500', 'primary.500', 'primary.500']}>
        <Link as={ReactLink} to='/'>
          <Text fontSize='lg' fontWeight='bold'>
            NftyFeed
          </Text>
        </Link>
      </Box>

      <Box display={{ base: 'block', md: 'none' }} onClick={toggle}>
        {isOpen ? <CloseIcon /> : <HamburgerIcon />}
      </Box>
      <Box
        display={{ base: isOpen ? 'block' : 'none', md: 'block' }}
        flexBasis={{ base: '100%', md: 'auto' }}>
        <Stack
          spacing={8}
          align='center'
          justify={['center', 'space-between', 'flex-end', 'flex-end']}
          direction={['column', 'row', 'row', 'row']}
          pt={[4, 4, 0, 0]}>
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
    </Flex>
  );
};
