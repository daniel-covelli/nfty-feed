import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { Bye } from './pages/Bye';
import { NavBar } from './navbar/NavBar';
import { Container } from '@chakra-ui/react';

const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <NavBar />
      <Container maxW='container.lg' p='85px 20px 0 20px'>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/register' component={Register} />
          <Route exact path='/bye' component={Bye} />
          <Route exact path='/login' component={Login} />
        </Switch>
      </Container>
    </BrowserRouter>
  );
};

export default Routes;
