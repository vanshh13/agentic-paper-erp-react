import Home from '../../pages/home/home';
import Dashboard from '../../pages/dashboard/dashboard';
import Profile from '../../pages/profile/profile';

const mainRoutes = [
  {
    path: '/dashboard',
    element: Dashboard,
    isProtected: true,
    title: 'Dashboard',
    isSidebar: true,
    isLayout: true,
  },
  {
    path: '/home',
    element: Home,
    isProtected: true,
    title: 'Home',
    isSidebar: true,
    isLayout: true,
  },
  {
    path: '/profile',
    element: Profile,
    isProtected: true,
    title: 'Profile',
    isSidebar: true,
    isLayout: true,
  },
];

export default mainRoutes;