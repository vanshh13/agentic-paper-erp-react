import Login from '../../pages/auth/login';
import Register from '../../pages/auth/register';

const authRoutes = [
  {
    path: '/auth/login',
    element: Login,
    isProtected: false,
    title: 'Login',
    isSidebar: false,
    category: 'auth',
    isLayout: false,
  },
  {
    path: '/auth/register',
    element: Register,
    isProtected: false,
    title: 'Register',
    isSidebar: true,
    category: 'auth',
    isLayout: false,
  },
];

export default authRoutes;