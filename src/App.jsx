import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import RootLayout from './layout/RootLayout'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Customers from './pages/Customers'
import Products from './pages/Products'
import SalesOrders from './pages/SalesOrders'
import PurchaseOrders from './pages/PurchaseOrders'
import Quotations from './pages/Quotations'
import Inquiry from './pages/Inquiry'
import Rules from './pages/Rules'
import Stock from './pages/Stock'
import PriceLists from './pages/PriceLists'
import Vendors from './pages/Vendors'
import Transporters from './pages/Transporters'
import Dispatch from './pages/Dispatch'
import GRN from './pages/GRN'
import Approvals from './pages/Approvals'
import Settings from './pages/Settings'
import Login from './pages/auth/login'
import Register from './pages/auth/register'

function App() {
  return (
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
          <Route path="/products" element={<Products />} />
          <Route path="/sales-orders" element={<SalesOrders />} />
          <Route path="/purchase-orders" element={<PurchaseOrders />} />
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
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
