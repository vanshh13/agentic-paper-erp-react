import authRoutes from './auth-routes'
import mainRoutes from './main-routes'
import salesRoutes from './sales-routes'
import purchaseRoutes from './purchase-routes'
import inventoryRoutes from './inventory-routes'
import logisticsRoutes from './logistics-routes'
import adminRoutes from './admin-routes'
import chatScreenRoutes from './automatic-intelligence-routes'
import userRoutes from './user-rotues'
import Login from '../../pages/auth/login';

const routes = [
  ...authRoutes,
  ...mainRoutes,
  ...salesRoutes,
  ...purchaseRoutes,
  ...inventoryRoutes,
  ...logisticsRoutes,
  ...adminRoutes,
  ...chatScreenRoutes,
  ...userRoutes,
  {
    key: 'root-redirect',
    path: '/',
    redirectTo: '/auth/login',
  },
  {
    key: 'catch-all',
    path: '*',
    redirectTo: '/auth/login',
  },
  
]

export const routeGroups = {
  publicNoLayout: routes.filter(
    r => !r.isProtected && !r.isLayout
  ),

  publicLayout: routes.filter(
    r => !r.isProtected && r.isLayout
  ),

  protectedLayout: routes.filter(
    r => r.isProtected && r.isLayout
  ),

  protectedNoLayout: routes.filter(
    r => r.isProtected && !r.isLayout
  ),
}

export default routes
