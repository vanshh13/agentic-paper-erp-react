import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function RootLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-dark to-darkalt text-white shadow-lg sticky top-0 z-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary tracking-wider">📊 ERP System</h1>
          
          <button 
            className="md:hidden text-white p-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <nav className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row gap-6 md:gap-8 absolute md:static top-16 md:top-0 left-0 right-0 md:left-auto md:right-auto bg-darkalt md:bg-transparent p-4 md:p-0`}>
            <Link to="/" className="text-white font-medium hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
            <Link to="/home" className="text-white font-medium hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/customers" className="text-white font-medium hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>Customers</Link>
            <Link to="/products" className="text-white font-medium hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>Products</Link>
            <Link to="/sales-orders" className="text-white font-medium hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>Sales Orders</Link>
            <Link to="/purchase-orders" className="text-white font-medium hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>Purchase Orders</Link>
            <Link to="/quotations" className="text-white font-medium hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>Quotations</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-6 border-t border-primary mt-auto">
        <p>&copy; 2024 ERP System. All rights reserved.</p>
      </footer>
    </div>
  )
}