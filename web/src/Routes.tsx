import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/' render={() => <div>hi</div>} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
