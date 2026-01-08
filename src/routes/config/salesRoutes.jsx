import Customers from '../../pages/Customers/Customers';
import SalesOrders from '../../pages/SalesOrders/SalesOrders';
import Quotations from '../../pages/Quotations/Quotations';
import Inquiry from '../../pages/Inquiry/Inquiry';

const salesRoutes = [
  {
    path: '/customers',
    element: Customers,
    isProtected: true,
    title: 'Customers',
    isSidebar: true,
    isLayout: true,
  },
  {
    path: '/sales-orders',
    element: SalesOrders,
    isProtected: true,
    title: 'Sales Orders',
    isSidebar: true,
    isLayout: true,
  },
  {
    path: '/quotations',
    element: Quotations,
    isProtected: true,
    title: 'Quotations',
    isSidebar: true,
    isLayout: true,
  },
  {
    path: '/inquiry',
    element: Inquiry,
    isProtected: true,
    title: 'Inquiry',
    isSidebar: true,
    isLayout: true,
  },
];

export default salesRoutes;