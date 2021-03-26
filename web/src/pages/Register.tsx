import React, { useState } from 'react';
import { useRegisterMutation } from '../generated/graphql';

interface RegisterProps {}

export const Register: React.FC<RegisterProps> = ({}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [register] = useRegisterMutation();

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        console.log('form submitted');
        console.log(email, password);
        const response = await register({ variables: { email, password } });
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
      <button type='submit'>register</button>
    </form>
  );
};
