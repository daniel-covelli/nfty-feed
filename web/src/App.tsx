import React, { useState, useEffect } from 'react';
import Routes from './Routes';

interface AppProps {}

export const App: React.FC<AppProps> = ({}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:4000/refresh_token', {
      credentials: 'include'
    }).then(async (x) => {
      const data = x.json();
      console.log(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div>loading...</div>;
  }

  return <Routes />;
};
