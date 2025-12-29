import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, Package, ShoppingCart, FileText, Truck, BarChart3, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { label: 'Customers', icon: Users, path: '/customers' },
    { label: 'Products', icon: Package, path: '/products' },
    { label: 'Sales Orders', icon: ShoppingCart, path: '/sales-orders' },
    { label: 'Purchase Orders', icon: FileText, path: '/purchase-orders' },
    { label: 'Inquiry', icon: BarChart3, path: '/inquiry' },
    { label: 'Quotations', icon: Truck, path: '/quotations' },
  ]

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-primary text-gray-900 p-2 rounded-lg shadow-lg"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed md:sticky top-0 left-0 
          w-64 h-screen 
          bg-gray-900 text-white 
          overflow-y-auto 
          transform transition-transform duration-300 ease-in-out
          z-40
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-primary">ERP Menu</h2>
          <p className="text-sm text-gray-400 mt-1">Navigation</p>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon
            const active = isActive(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${active
                    ? 'bg-primary text-gray-900 font-bold shadow-lg'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-primary'
                  }
                `}
              >
                <IconComponent size={20} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700 bg-gray-800">
          <p className="text-xs text-gray-400 text-center">
            Version 1.0.0
          </p>
        </div>
      </aside>
    </>
  )
}
