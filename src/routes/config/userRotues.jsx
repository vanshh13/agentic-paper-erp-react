import UserList from '../../pages/UserList/UserList'

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