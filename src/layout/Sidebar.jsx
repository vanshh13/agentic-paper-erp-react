import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, Package, ShoppingCart, FileText, Truck, MessageSquare, Menu, X, Tag, DollarSign, TruckIcon, FileCheck, ClipboardList, CheckSquare, Settings, LogOut, ChevronUp, ChevronDown } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const [isAccountOpen, setIsAccountOpen] = useState(false)
  const [isHighlighted, setIsHighlighted] = useState(false)
  const location = useLocation()
  const navigate = useNavigate();
  const footerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', badge: null },
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
    return location.pathname.startsWith(path)
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      {!isOpen &&
      (<button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-3 left-3 z-[60] bg-indigo-600 text-white p-2 rounded-lg shadow-xl hover:bg-indigo-700 transition-colors active:scale-95"
        aria-label="Toggle menu"
        title="Toggle sidebar menu"
      >
        { <Menu size={20} className="w-5 h-5" />}
      </button>
      )
      }
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          ${isOpen ? 'lg:static' : 'fixed'} top-0 left-0 
          h-screen w-60 
          bg-[oklch(0.15_0_0)] border-r border-[oklch(0.25_0_0)]
          transform transition-transform duration-300 ease-in-out
          z-50
          flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
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
          <button
            onClick={() => setIsOpen(false)}
            className="hidden lg:flex p-1 hover:bg-[oklch(0.20_0_0)] rounded text-[oklch(0.75_0_0)] hover:text-[oklch(0.92_0_0)]"
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
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


        {/* My Account Section */}
       {isAccountOpen && (
         <div className="card-surface backdrop-blur-sm flex-shrink-0 border border-gray-200/50 pt-3 px-3 rounded-lg shadow-lg mx-2 mb-2">
           <p className="text-xs font-semibold text-white-600 uppercase tracking-wider px-3 mb-2">My Account</p>
           <div className="space-y-1 mb-3">
             <Link
               to="/settings"
               onClick={() => setIsOpen(false)}
               className={`
                 flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm
                 ${location.pathname === '/settings'
                   ? 'bg-indigo-600 text-white font-medium shadow-lg shadow-indigo-900/40'
                   : 'text-[oklch(0.75_0_0)] hover:bg-[oklch(0.20_0_0)] hover:text-[oklch(0.92_0_0)]'
                 }
               `}
             >
               <Settings size={18} className="flex-shrink-0 min-w-[18px]" />
               <span className="flex-1 truncate">Settings</span>
             </Link>
             <button
               onClick={() => {
                 // Handle logout logic here
                 navigate('/auth/login');
                 setIsOpen(false)
               }}
               className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300"
             >
               <LogOut size={18} className="flex-shrink-0 min-w-[18px]" />
               <span className="flex-1 truncate text-left">Logout</span>
             </button>
           </div>
         </div>
       )}

        {/* Sidebar Footer */}
        <div ref={footerRef} className={`flex-shrink-0 p-2 border-t border-[oklch(0.25_0_0)] bg-[oklch(0.12_0_0)] cursor-pointer hover:bg-[oklch(0.15_0_0)] transition-colors rounded-t-lg ${isHighlighted ? 'ring-2 ring-white' : ''}`} onClick={() => {
          setIsAccountOpen(!isAccountOpen);
          if (isAccountOpen) {
            setIsHighlighted(true);
          } else {
            setIsHighlighted(false);
          }
        }}>
          <div className="flex items-center gap-2 px-2 py-1">
            <div className="w-8 h-8 flex-shrink-0 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
              AM
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[oklch(0.90_0_0)] truncate">Admin User</p>
              <p className="text-xs text-[oklch(0.60_0_0)] truncate">admin@paperco.com</p>
            </div>
            {isAccountOpen ? (
              <ChevronUp size={16} className="text-[oklch(0.75_0_0)]" />
            ) : (
              <ChevronDown size={16} className="text-[oklch(0.75_0_0)]" />
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
