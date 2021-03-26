import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { useHelloQuery } from './generated/graphql';

const App: React.FC = () => {
  const { data, loading } = useHelloQuery();

  if (loading || !data) {
    return <div>loading...</div>;
  }

  return (
    <div>
      Should say "hi!"
      <p>{data.hello}</p>
    </div>
  );
};

export default App;
