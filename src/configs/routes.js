import MainLayout from '@/components/Layout/MainLayout';
import HomePage from '@/pages/HomePage';

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
];

export default routes;
