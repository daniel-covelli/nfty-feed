import React from 'react';
import { Link } from 'react-router-dom';
import { useMeQuery, useLogoutMutation } from './generated/graphql';
import { setAccessToken } from './accessToken';

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = () => {
  const { data, loading } = useMeQuery();
  const [logout, { client }] = useLogoutMutation();

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
      <div>
        {!loading && data && data.me ? (
          <button
            onClick={async () => {
              await logout();
              setAccessToken('');
              await client!.resetStore();
            }}>
            logout
          </button>
        ) : null}
      </div>
      {body}
    </header>
  );
};
