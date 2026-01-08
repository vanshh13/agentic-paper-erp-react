import PurchaseOrders from '../../pages/Purchase/PurchaseOrders';
import Vendors from '../../pages/Vendors/Vendors';
import GRN from '../../pages/GRN/GRN';

const purchaseRoutes = [
  {
    path: '/purchase-orders',
    element: PurchaseOrders,
    isProtected: true,
    title: 'Purchase Orders',
    isSidebar: true,
    isLayout: true,
  },
  {
    path: '/vendors',
    element: Vendors,
    isProtected: true,
    title: 'Vendors',
    isSidebar: true,
    isLayout: true,
  },
  {
    path: '/grn',
    element: GRN,
    isProtected: true,
    title: 'GRN',
    isSidebar: true,
    isLayout: true,
    },
];

export default purchaseRoutes;