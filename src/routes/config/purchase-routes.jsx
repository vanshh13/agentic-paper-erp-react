import PurchaseOrders from '../../pages/purchase/purchase-orders';
import Vendors from '../../pages/vendors/vendors';
import GRN from '../../pages/grn/grn';
import PurchaseOrderDetail from '../../components/purchase/purchase-order-detail';

const purchaseRoutes = [
  {
    path: '/purchase-orders',
    element: PurchaseOrders,
    isProtected: true,
    title: 'Purchase Orders',
    isSidebar: true,
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