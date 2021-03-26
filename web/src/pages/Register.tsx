import React, { useState } from 'react';

interface RegisterProps {}

export const Register: React.FC<RegisterProps> = ({}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <form>
      <div>
        <input
          value={email}
          placeholder='email'
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          value={password}
          placeholder='password'
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      </div>
    </form>
  );
};
