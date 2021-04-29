import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { Bye } from './pages/Bye';
import { NavBar } from './components/navbar/NavBar';
import { Container } from '@chakra-ui/react';
import { Profile } from './pages/Profile';

const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <NavBar />
      <Container maxW='container.lg' p='75px 20px 0 20px' h='90vh'>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/register' component={Register} />
          <Route exact path='/bye' component={Bye} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/at/:id' component={Profile} />
        </Switch>
      </Container>
    </BrowserRouter>
  );
};

export default Routes;
