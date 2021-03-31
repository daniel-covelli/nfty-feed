import React from 'react';
import { Link } from 'react-router-dom';
import { useMeQuery } from './generated/graphql';

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = ({}) => {
  const { data, loading } = useMeQuery({ fetchPolicy: 'network-only' });

  let body: any = null;

  if (loading) {
    body = <div>loading...</div>;
  } else if (data && data.me) {
    body = <div>You are loggin as: {data.me.email}</div>;
  } else {
    body = <div>not logged in</div>;
  }
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
      {body}
    </header>
  );
};
