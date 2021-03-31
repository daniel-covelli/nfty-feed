import React, { useState } from 'react';
import { useLoginMutation, MeDocument } from '../generated/graphql';
import { RouteComponentProps } from 'react-router-dom';
import { setAccessToken } from '../accessToken';

interface LoginProps {}

export const Login: React.FC<RouteComponentProps> = ({ history }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login] = useLoginMutation();

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        console.log('form submitted');

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
          console.log('LOGIN ACCESS TOKEN', response.data.login.accessToken);
          setAccessToken(response.data.login.accessToken);
        }

        history.push('/');
      }}>
      <div>
        <input
          value={email}
          placeholder='email'
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </div>
      <div>
        <input
          type='password'
          value={password}
          placeholder='password'
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      </div>
      <button type='submit'>login</button>
    </form>
  );
};
