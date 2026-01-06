import ChatScreenUI from '../../pages/automatic-intelligence/chat-screen-ui'

const chatScreenRoutes = [
    {
      path: '/chat',
      element: ChatScreenUI,
      isProtected: true,
      title: 'Chat',
      isSidebar: true,
      category: 'chat',
      isLayout: true,
    }
  ];
  
  export default chatScreenRoutes;