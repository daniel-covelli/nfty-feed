import React from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = ({}) => {
  return (
    <header>
      <div>
        <Link to='/'>home</Link>
      </div>
      <div>
        <Link to='/register'>register</Link>
      </div>
      <div>
        <Link to='/login'>login</Link>
      </div>
      <div>
        <Link to='/bye'>bye</Link>
      </div>
    </header>
  );
};
