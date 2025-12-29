import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, Package, ShoppingCart, FileText, Truck, MessageSquare, Menu, X, Tag, DollarSign, TruckIcon, FileCheck, ClipboardList, CheckSquare } from 'lucide-react'
import { useState } from 'react'

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/', badge: null },
    { label: 'Inquiries', icon: MessageSquare, path: '/inquiry', badge: '5' },
    { label: 'Rules', icon: FileCheck, path: '/rules', badge: null },
    { label: 'Purchases', icon: ShoppingCart, path: '/purchase-orders', badge: '3' },
    { label: 'Sales', icon: DollarSign, path: '/sales-orders', badge: '8' },
    { label: 'Stock', icon: Package, path: '/stock', badge: '12' },
    { label: 'Products', icon: Package, path: '/products', badge: null },
    { label: 'Price Lists', icon: Tag, path: '/price-lists', badge: null },
    { label: 'Customers', icon: Users, path: '/customers', badge: null },
    { label: 'Vendors', icon: Users, path: '/vendors', badge: null },
    { label: 'Transporters', icon: TruckIcon, path: '/transporters', badge: null },
    { label: 'Quotations', icon: FileText, path: '/quotations', badge: null },
    { label: 'Dispatch', icon: Truck, path: '/dispatch', badge: null },
    { label: 'GRN', icon: ClipboardList, path: '/grn', badge: '2' },
    { label: 'Approvals', icon: CheckSquare, path: '/approvals', badge: '4' },
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
        className="lg:hidden fixed top-3 left-3 z-[60] bg-indigo-600 text-white p-2 rounded-lg shadow-xl hover:bg-indigo-700 transition-colors active:scale-95"
        aria-label="Toggle menu"
        title="Toggle sidebar menu"
      >
        {isOpen ? <X size={20} className="w-5 h-5" /> : <Menu size={20} className="w-5 h-5" />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:sticky top-0 left-0 
          h-screen w-60 
          bg-[oklch(0.15_0_0)] border-r border-[oklch(0.25_0_0)]
          transform transition-transform duration-300 ease-in-out
          z-50 lg:z-0
          flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Sidebar Header */}
        <div className="flex-shrink-0 p-4 border-b border-[oklch(0.25_0_0)] flex items-center gap-3">
          <div className="w-8 h-8 flex-shrink-0 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            RP
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold text-[oklch(0.92_0_0)] truncate">Rahul Papers</h2>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1 min-h-0">
          {menuItems.map((item) => {
            const IconComponent = item.icon
            const active = isActive(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm relative group
                  ${active
                    ? 'bg-indigo-600 text-white font-medium shadow-lg shadow-indigo-900/40'
                    : 'text-[oklch(0.75_0_0)] hover:bg-[oklch(0.20_0_0)] hover:text-[oklch(0.92_0_0)]'
                  }
                `}
              >
                <IconComponent size={18} className="flex-shrink-0 min-w-[18px]" />
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge && (
                  <span className={`flex-shrink-0 px-1.5 py-0.5 rounded text-xs font-semibold whitespace-nowrap ${
                    active ? 'bg-white/20 text-white' : 'bg-[oklch(0.25_0_0)] text-[oklch(0.85_0_0)]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="flex-shrink-0 p-3 border-t border-[oklch(0.25_0_0)] bg-[oklch(0.12_0_0)]">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 flex-shrink-0 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
              AM
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[oklch(0.90_0_0)] truncate">Admin User</p>
              <p className="text-xs text-[oklch(0.60_0_0)] truncate">admin@paperco.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
