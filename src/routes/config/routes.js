import authRoutes from './auth-routes'
import mainRoutes from './mainRoutes'
import salesRoutes from './salesRoutes'
import purchaseRoutes from './purchaseRoutes'
import inventoryRoutes from './inventoryRoutes'
import logisticsRoutes from './logisticsRoutes'
import adminRoutes from './adminRoutes'
import chatScreenRoutes from './automatic-intelligenceRoutes'
import userRoutes from './userRotues'
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
