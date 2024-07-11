import { RouteObject } from 'react-router-dom';
import { App } from './App';
import Layout from './components/shared/Layout';
import { Bye } from './pages/Bye';
import ErrorPage from './pages/Error';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Profile } from './pages/Profile';
import { Register } from './pages/Register';
import { validateUser } from './utils/validate-user';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    loader: validateUser
  },
  {
    path: '/home',
    element: (
      <Layout>
        <Home />
      </Layout>
    )
  },
  {
    path: 'register',
    element: (
      <Layout>
        <Register />
      </Layout>
    )
  },
  {
    path: 'bye',
    element: (
      <Layout>
        <Bye />
      </Layout>
    )
  },
  {
    path: 'login',
    element: (
      <Layout>
        <Login />
      </Layout>
    )
  },
  {
    path: '/at/:id',
    element: (
      <Layout>
        <Profile />
      </Layout>
    )
  },
  {
    path: '/error',
    element: <ErrorPage />
  }
];
