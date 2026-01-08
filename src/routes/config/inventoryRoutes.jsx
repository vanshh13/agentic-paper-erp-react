import Products from '../../pages/Products/Products';
import Stock from '../../pages/Stock/Stock';
import PriceLists from '../../pages/PriceLists/PriceLists';

const inventoryRoutes = [
  {
    path: '/products',
    element: Products,
    isProtected: true,
    title: 'Products',
    icon: 'box',
    isSidebar: true,
    isLayout: true,
  },
  {
    path: '/stock',
    element: Stock,
    isProtected: true,
    title: 'Stock',
    isSidebar: true,
    isLayout: true,
  },
  {
    path: '/price-lists',
    element: PriceLists,
    isProtected: true,
    title: 'Price Lists',
    isSidebar: true,
    isLayout: true,
  },
];

export default inventoryRoutes;