import MainLayout from '@/components/Layout/MainLayout';
import SimpleLayout from '@/components/Layout/SimpleLayout';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';

const routes = [
  {
    layout: MainLayout,
    data: [
      {
        path: '/',
        isIndex: true,
        component: HomePage,
        title: 'Home',
      },
    ],
  },
  {
    layout: SimpleLayout,
    data: [
      {
        path: '/login',
        component: LoginPage,
        title: 'Login',
      },
    ],
  },
];

export default routes;
