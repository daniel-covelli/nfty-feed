import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

const App: React.FC = () => {
  const { data, loading } = useQuery(gql`
    {
      hello
    }
  `);

  if (loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      NOTHING YET
      <p>{JSON.stringify(data)}</p>
    </div>
  );
};

export default App;
