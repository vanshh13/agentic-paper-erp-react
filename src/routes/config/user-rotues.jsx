import UserList from '../../pages/user-list/user-list'

const userRoutes = [
    {
      path: 'users',
      element: UserList,
      isProtected: true,
      title: 'Login',
      isSidebar: true,
      isLayout: true,
    }
  ];
  
  export default userRoutes;