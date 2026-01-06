import PurchaseOrders from '../../pages/Purchase/PurchaseOrders';
import Vendors from '../../pages/Vendors/Vendors';
import GRN from '../../pages/GRN/GRN';
import PurchaseOrderDetail from '../../components/purchase/PurchaseOrderDetail';

const purchaseRoutes = [
  {
    path: '/purchase-orders',
    element: PurchaseOrders,
    isProtected: true,
    title: 'Purchase Orders',
    isSidebar: true,
    category: 'purchase',
    isLayout: true,
  },{
    path: "/purchase-orders/:poId", 
    element: PurchaseOrderDetail,
    isProtected: true,
    title: 'Purchase Order Detail',
    isSidebar:  true,
    category: 'purchase',
    isLayout: true,
},
  {
    path: '/vendors',
    element: Vendors,
    isProtected: true,
    title: 'Vendors',
    isSidebar: true,
    category: 'purchase',
    isLayout: true,
  },
  {
    path: '/grn',
    element: GRN,
    isProtected: true,
    title: 'GRN',
    isSidebar: true,
    category: 'purchase',
    isLayout: true,
    },
];

export default purchaseRoutes;