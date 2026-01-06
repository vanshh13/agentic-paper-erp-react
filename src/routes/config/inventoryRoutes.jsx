import ProductsList from '../../pages/Products/products-list';
import ProductCreateEdit from '../../pages/Products/ProductCreateEdit';
import Stock from '../../pages/Stock/Stock';
import PriceLists from '../../pages/PriceLists/PriceLists';
import ProductView from '../../pages/Products/ProductView';

const inventoryRoutes = [
	{
		path: '/productsList',
		element: ProductsList,
		isProtected: true,
		title: 'Products List',
		icon: 'box',
		isSidebar: true,
		category: 'inventory',
		isLayout: true,
	},
	{
		path: '/productsList/add',
		element: ProductCreateEdit,
		isProtected: true,
		title: 'Add Product',
		category: 'inventory',
		isLayout: true,
	},
	{
		path: '/productsList/edit/:id',
		element: ProductCreateEdit,
		isProtected: true,
		title: 'Edit Product',
		category: 'inventory',
		isLayout: true,
    	clickable: false, 
    
	},
	{
  		path: '/productsList/view/:id',
  		element: ProductView,
		isProtected: true,
		title: 'View Product',
		category: 'inventory',
		isLayout: true,
    	clickable: false, 
    },
	{
		path: '/stock',
		element: Stock,
		isProtected: true,
		title: 'Stock',
		isSidebar: true,
		category: 'inventory',
		isLayout: true,
	},
	{
		path: '/price-lists',
		element: PriceLists,
		isProtected: true,
		title: 'Price Lists',
		isSidebar: true,
		category: 'inventory',
		isLayout: true,
	},
];

export default inventoryRoutes;