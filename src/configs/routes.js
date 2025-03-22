import LogoutHandler from '@/components/Auth/LogoutHandler';
import MainLayout from '@/components/Layout/MainLayout';
import SimpleLayout from '@/components/Layout/SimpleLayout';
import ChildPage from '@/pages/ChildPage';
import GoogleCallback from '@/pages/GoogleCallback';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import MembershipPage from '@/pages/MembershipPage';
import GrowthChartPage from '@/pages/GrowthChartPage';
import DoctorRequestPage from '@/pages/DoctorRequestPage';
import ChildDetail from '@/components/Child/ChildDetail';

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
      {
        path: '/doctor/requests',
        component: DoctorRequestPage,
        title: 'Doctor Requests',
        shouldLogin: true,
        role: 2
      },
      {
        path: '/doctor/consultations',
        component: DoctorRequestPage, // Thay bằng ConsultationPage khi có
        title: 'Consultations',
        shouldLogin: true,
        role: 2
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
        role: 1
      },
      {
        path: '/children/:childId',
        component: ChildDetail,
        title: 'Child Detail',
        shouldLogin: true,
        role: 1
      },
      {
        path: '/growth-charts',
        component: GrowthChartPage,
        title: 'Growth Charts',
        shouldLogin: true,
        role: 1
      },
      {
        path: '/growth-charts/:childId',
        component: GrowthChartPage,
        title: 'Growth Charts',
        shouldLogin: true,
        role: 1
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