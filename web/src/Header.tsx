import React from 'react';
import { Link, Button } from '@chakra-ui/react';
import { Link as ReactLink } from 'react-router-dom';
import { useMeQuery, useLogoutMutation } from './generated/graphql';
import { setAccessToken } from './accessToken';
import { Text } from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = () => {
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
    <header>
      <div>
        <Link as={ReactLink} color='teal.500' to='/'>
          home
        </Link>
      </div>
      <div>
        <Link as={ReactLink} color='teal.500' to='/register'>
          register
        </Link>
      </div>
      <div>
        <Link as={ReactLink} color='teal.500' to='/login'>
          login
        </Link>
      </div>
      <div>
        <Link as={ReactLink} color='teal.500' to='/bye'>
          bye
        </Link>
      </div>
      <div>
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
      </div>
      <Text color='gray.500' isTruncated>
        {body}
      </Text>
    </header>
  );
};
