import LogoutHandler from '@/components/Auth/LogoutHandler';
import MainLayout from '@/components/Layout/MainLayout';
import SimpleLayout from '@/components/Layout/SimpleLayout';
import ChildPage from '@/pages/ChildPage';
import GoogleCallback from '@/pages/GoogleCallback';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import MembershipPage from '@/pages/MembershipPage';
import GrowthChartPage from '@/pages/GrowthChartPage';
import ProfilePage from '@/pages/ProfilePage';
import DoctorRequestPage from '@/pages/DoctorRequestPage';
import ChildDetail from '@/components/Child/ChildDetail';
import ConsultationPage from '@/pages/ConsultationPage';
import ConsultationChatPage from '@/pages/ConsultationChatPage';
import ListDoctorPage from '@/pages/ListDoctorPage';
import MyRequestPage from '@/pages/MyRequestPage';
import FAQ from '@/pages/FAQ';
import AboutUs from '@/pages/AboutUs';
import BlogPage from '@/pages/BlogPage';
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
        role: 2,
      },
      {
        path: '/plans',
        component: MembershipPage,
        title: 'Membership',
      },
      {
        path: '/profile',
        component: ProfilePage,
        title: 'Profile',
        shouldLogin: true,
      },
      {
        path: '/children',
        component: ChildPage,
        title: 'Child Management',
        shouldLogin: true,
        role: 1,
      },
      {
        path: '/children/:childId',
        component: ChildDetail,
        title: 'Child Detail',
        shouldLogin: true,
        role: 1,
      },
      {
        path: '/growth-charts',
        component: GrowthChartPage,
        title: 'Growth Charts',
        shouldLogin: true,
        role: 1,
      },
      {
        path: '/growth-charts/:childId',
        component: GrowthChartPage,
        title: 'Growth Charts',
        shouldLogin: true,
        role: 1,
      },
      {
        path: '/consultations',
        component: ConsultationPage,
        title: 'Consultations',
      },
      {
        path: '/consultation-chat/:consultationId',
        component: ConsultationChatPage,
        title: 'Consultation Chat Detail',
      },
      {
        path: '/contact',
        component: ListDoctorPage,
        title: 'Contact',
      },
      {
        path: '/user/requests',
        component: MyRequestPage,
        title: 'My Requests',
        shouldLogin: true,
      },
      {
        path: '/faqs',
        component: FAQ,
        title: 'FAQ',
      },
      {
        path: '/about',
        component: AboutUs,
        title: 'About',
      },
      {
        path: '/blog',
        component: BlogPage,
        title: 'Blogs',
        shouldLogin: false,
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
