import { Outlet, RouteObject } from 'react-router-dom';
import { App } from './App';
import ErrorPage from './pages/Error';

import { Login } from './pages/Login';
import Layout from './components/shared/Layout';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import middleware from './utils/middleware';

export const routes: RouteObject[] = [
  {
    path: '/',
    loader: middleware.rerouteIfNotLoggedIn,
    children: [
      { index: true, element: <App /> },
      {
        element: (
          <Layout>
            <Outlet />
          </Layout>
        ),
        children: [
          {
            path: '/at/:id',
            element: <Profile />
          }
        ]
      }
    ]
  },
  {
    loader: middleware.rerouteIfLoggedIn,
    element: (
      <Layout>
        <Outlet />
      </Layout>
    ),
    children: [
      {
        path: 'register',
        element: <Register />
      },
      {
        path: 'login',
        element: <Login />
      }
    ]
  },

  {
    path: '/error',
    element: <ErrorPage />
  }
];
