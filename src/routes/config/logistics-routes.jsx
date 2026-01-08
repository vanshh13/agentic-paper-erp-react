import Transporters from '../../pages/transporters/transporters';
import Dispatch from '../../pages/dispatch/dispatch';

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