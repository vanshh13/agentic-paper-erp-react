import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SidebarProvider } from './contexts/SidebarContext'
import RootLayout from './layout/RootLayout'
import Home from './pages/Home/Home'
import Dashboard from './pages/Dashboard/Dashboard'
import Customers from './pages/Customers/Customers'
import SalesOrders from './pages/SalesOrders/SalesOrders'
import PurchaseOrders from './pages/Purchase/PurchaseOrders'
import Quotations from './pages/Quotations/Quotations'
import Inquiry from './pages/Inquiry/Inquiry'
import Rules from './pages/Rules/Rules'
import Stock from './pages/Stock/Stock'
import PriceLists from './pages/PriceLists/PriceLists'
import Products from './pages/Products/Products'
import Vendors from './pages/Vendors/Vendors'
import Transporters from './pages/Transporters/Transporters'
import Dispatch from './pages/Dispatch/Dispatch'
import GRN from './pages/GRN/GRN'
import Approvals from './pages/Approvals/Approvals'
import Settings from './pages/Settings/Settings'
import Login from './pages/auth/login'
import Register from './pages/auth/register'
import UserList from './pages/UserList/UserList'

function App() {
  return (
    <SidebarProvider>
      <BrowserRouter>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<Navigate to="/auth/login" replace />} />

        {/* Auth routes */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />

        {/* Protected routes */}
        <Route element={<RootLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/home" element={<Home />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/sales-orders" element={<SalesOrders />} />
          <Route path="/purchase-orders" element={<PurchaseOrders />} />
          <Route path="/products" element={<Products />} />
          <Route path="/inquiry" element={<Inquiry />} />
          <Route path="/quotations" element={<Quotations />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/price-lists" element={<PriceLists />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/transporters" element={<Transporters />} />
          <Route path="/dispatch" element={<Dispatch />} />
          <Route path="/grn" element={<GRN />} />
          <Route path="/approvals" element={<Approvals />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </SidebarProvider>
  )
}

export default App
