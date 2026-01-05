import UserList from '../../pages/UserList/UserList'

const userRoutes = [
    {
      path: 'users',
      element: UserList,
      isProtected: true,
      title: 'Login',
      isSidebar: true,
      category: 'user',
      isLayout: true,
    }
  ];
  
  export default userRoutes;