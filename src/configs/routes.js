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
import ChildDetail from '@/pages/ChildDetailPage';
import ConsultationPage from '@/pages/ConsultationPage';
import ConsultationChatPage from '@/pages/ConsultationChatPage';
import ListDoctorPage from '@/pages/ListDoctorPage';
import MyRequestPage from '@/pages/MyRequestPage';
import FAQ from '@/pages/FAQ';
import AboutUs from '@/pages/AboutUs';
import BlogPage from '@/pages/BlogPage';
import BlogDetail from '@/pages/BlogDetail';
import SignUpPage from '@/pages/SignUpPage';
import NoPermission from '@/pages/NoPermission';
import EmailVerificationPage from '@/pages/EmailVerificationPage';
import RequestDetailPage from '@/pages/RequestDetailPage';
const routes = [
  {
    layout: MainLayout,
    data: [
      {
        path: '/',
        isIndex: true,
        component: HomePage,
        title: 'Home',
        allowAdmin: true,
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
        path: '/email-verification',
        component: EmailVerificationPage,
        title: 'Email Verification',
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
        role: 0,
      },
      {
        path: '/children/:childId',
        component: ChildDetail,
        title: 'Child Detail',
        shouldLogin: true,
        // role: 0,
      },
      {
        path: '/growth-charts',
        component: GrowthChartPage,
        title: 'Growth Charts',
        shouldLogin: true,
        role: 0,
      },
      {
        path: '/growth-charts/:childId',
        component: GrowthChartPage,
        title: 'Growth Charts',
        shouldLogin: true,
        role: 0,
      },
      {
        path: '/consultations',
        component: ConsultationPage,
        title: 'Consultations',
        shouldLogin: true,
      },
      {
        path: '/consultation-chat/:consultationId',
        component: ConsultationChatPage,
        title: 'Consultation Chat Detail',
        shouldLogin: true,
      },
      {
        path: '/contact',
        component: ListDoctorPage,
        title: 'Contact',
        shouldLogin: true,
        role: 0,
      },
      {
        path: '/user/requests',
        component: MyRequestPage,
        title: 'My Requests',
        shouldLogin: true,
        role: 0,
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
      {
        path: '/blog/:blogId',
        component: BlogDetail,
        title: 'Blog',
        shouldLogin: false,
      },
      {
        path: 'requests/:requestId',
        component: RequestDetailPage,
        title: 'Request Detail',
        shouldLogin: true,
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
      {
        path: '/register',
        component: SignUpPage,
        title: 'Sign Up',
      },
      {
        path: '/no-permission',
        component: NoPermission,
        title: 'Access Denied',
      },
    ],
  },
];

export default routes;
