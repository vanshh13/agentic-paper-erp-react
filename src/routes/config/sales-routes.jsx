import Customers from '../../pages/customers/customers';
import SalesOrders from '../../pages/sales-orders/sales-orders';
import Quotations from '../../pages/quotations/quotations';
import Inquiry from '../../pages/inquiry/inquiry';

const salesRoutes = [
  {
    path: '/customers',
    element: Customers,
    isProtected: true,
    title: 'Customers',
    isSidebar: true,
    category: 'sales',
    isLayout: true,
  },
  {
    path: '/sales-orders',
    element: SalesOrders,
    isProtected: true,
    title: 'Sales Orders',
    isSidebar: true,
    category: 'sales',
    isLayout: true,
  },
  {
    path: '/quotations',
    element: Quotations,
    isProtected: true,
    title: 'Quotations',
    isSidebar: true,
    category: 'sales',
    isLayout: true,
  },
  {
    path: '/inquiry',
    element: Inquiry,
    isProtected: true,
    title: 'Inquiry',
    isSidebar: true,
    category: 'sales',
    isLayout: true,
  },
];

export default salesRoutes;