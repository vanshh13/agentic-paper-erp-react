import Home from '../../pages/Home/Home';
import Dashboard from '../../pages/Dashboard/Dashboard';
import Profile from '../../pages/Profile/Profile';

const mainRoutes = [
  {
    path: '/dashboard',
    element: Dashboard,
    isProtected: true,
    title: 'Dashboard',
    isSidebar: true,
    category: 'main',
    isLayout: true,
  },
  {
    path: '/home',
    element: Home,
    isProtected: true,
    title: 'Home',
    isSidebar: true,
    category: 'main',
    isLayout: true,
  },
  {
    path: '/profile',
    element: Profile,
    isProtected: true,
    title: 'Profile',
    isSidebar: false,
    category: 'main',
    isLayout: true,
  },
];

export default mainRoutes;