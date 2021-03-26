import React from 'react';
import { Link } from 'react-router-dom';

interface HomeProps {}

export const Home: React.FC<HomeProps> = ({}) => {
  return (
    <div>
      <div>
        <Link to='/register'>register</Link>
      </div>
      <div>
        <Link to='/login'>login</Link>
      </div>
    </div>
  );
};
