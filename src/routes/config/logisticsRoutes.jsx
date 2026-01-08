import Transporters from '../../pages/Transporters/Transporters';
import Dispatch from '../../pages/Dispatch/Dispatch';

const logisticsRoutes = [
  {
    path: '/transporters',
    element: Transporters,
    isProtected: true,
    title: 'Transporters',
    isSidebar: true,
    isLayout: true,
  },
  {
    path: '/dispatch',
    element: Dispatch,
    isProtected: true,
    title: 'Dispatch',
    isSidebar: true,
    isLayout: true,
  },
];

export default logisticsRoutes;