import Rules from '../../pages/rules/rules';
import Approvals from '../../pages/approvals/approvals';
import UserList from '../../pages/user-list/user-list';
import UserDetailForm from '../../components/user/user-detail-form';
import Settings from '../../pages/settings/settings';

const adminRoutes = [
  {
    path: '/rules',
    element: Rules,
    isProtected: true,
    title: 'Rules',
    isSidebar: true,
    isLayout: true,
  },  
  {
    path: '/approvals',
    element: Approvals,
    isProtected: true,
    title: 'Approvals',
    isSidebar: true,
    isLayout: true,
  },
  {
    path: '/users',
    element: UserList,
    isProtected: true,
    title: 'Users',
    isSidebar: true,
    isLayout: true,
  },
  {
    path: '/users/:userId',
    element: UserDetailForm,
    isProtected: true,
    title: 'UserDetails',
    isSidebar: true,
    isLayout: true,
  },
   {
    path: '/users/:userId',
    element: UserDetailForm,
    isProtected: true,
    title: 'User Details Form',
    isSidebar: true,
    category: 'admin',
    isLayout: true,
  },
  {
    path: '/settings',
    element: Settings,
    isProtected: true,
    title: 'Settings',
    isSidebar: true,
    isLayout: true,
  },
];

export default adminRoutes;