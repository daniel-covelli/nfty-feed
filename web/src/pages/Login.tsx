import React, { useState } from 'react';
import { useLoginMutation, MeDocument, MeQuery } from '../generated/graphql';
import { RouteComponentProps } from 'react-router-dom';
import { setAccessToken } from '../accessToken';
import { Input, Button, FormControl } from '@chakra-ui/react';

export const Login: React.FC<RouteComponentProps> = ({ history }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login] = useLoginMutation();

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const response = await login({
          variables: { email, password },
          update: (store, { data }) => {
            if (!data) {
              return null;
            }
            store.writeQuery<MeQuery>({
              query: MeDocument,
              data: {
                __typename: 'Query',
                me: data.login.user
              }
            });
          }
        });

        if (response && response.data) {
          setAccessToken(response.data.login.accessToken);
        }

        history.push('/');
      }}>
      <Input
        value={email}
        placeholder='email'
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />

      <Input
        type='password'
        value={password}
        placeholder='password'
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />

      <Button type='submit' colorScheme='teal' variant='solid' size='sm'>
        login
      </Button>
    </form>
  );
};
