import React from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import { Home } from './pages/Home';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { Bye } from './pages/Bye';

const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <div>
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
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/register' component={Register} />
          <Route exact path='/bye' component={Bye} />
          <Route exact path='/login' component={Login} />
        </Switch>
      </div>
    </BrowserRouter>
  );
};

export default Routes;
