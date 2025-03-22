import LogoutHandler from '@/components/Auth/LogoutHandler';
import MainLayout from '@/components/Layout/MainLayout';
import SimpleLayout from '@/components/Layout/SimpleLayout';
import ChildPage from '@/pages/ChildPage';
import GoogleCallback from '@/pages/GoogleCallback';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import MembershipPage from '@/pages/MembershipPage';
import GrowthChartPage from '@/pages/GrowthChartPage';
import DoctorRequestPage from '@/pages/DoctorRequestPage'; // Import trang Doctor'@/components/Child/ChildCard';
import ChildDetail from '@/components/Child/ChildDetail';
const routes = [
  {
    layout: MainLayout,
    data: [
      {
        path: '/',
        isIndex: true,
        component: DoctorRequestPage, // Trang mặc định là DoctorRequestPage
        title: 'Doctor Requests',
      },
      {
        path: '/plans',
        component: MembershipPage,
        title: 'Membership',
      },
      {
        path: '/children',
        component: ChildPage,
        title: 'Child Management',
        shouldLogin: true,
      },
      {
        path: '/children/:childId',         // Route mới cho trang Child details
        component: ChildDetail,
        title: 'Child Detail',
      },
      {
        path: '/growth-charts',
        component: GrowthChartPage,
        title: 'Growth Charts',
      },
      {
        path: '/growth-charts/:childId',
        component: GrowthChartPage,
        title: 'Growth Charts',
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
      {
        path: '/logout',
        component: LogoutHandler,
        title: 'Logout',
      },
      {
        path: 'auth/google/callback',
        component: GoogleCallback,
        title: 'Google Authentication',
      },
    ],
  },
];

export default routes;
