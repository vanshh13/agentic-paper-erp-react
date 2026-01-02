import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, Package, ShoppingCart, FileText, Truck, MessageSquare, Menu, X, Tag, DollarSign, FileCheck, ClipboardList, CheckSquare, Settings, LogOut, ChevronUp, ChevronDown, IndianRupee } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useSidebar } from '../contexts/SidebarContext'
import { logoutUser, getCurrentUser } from '../services/api/auth'

export default function Sidebar() {
  const { isOpen, setIsOpen } = useSidebar()
  const [isAccountOpen, setIsAccountOpen] = useState(false)
  const [isHighlighted, setIsHighlighted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  
  // 1. This ref will track the entire account section area
  const accountRef = useRef(null)

  useEffect(() => {
    // Get current user from localStorage
    const user = getCurrentUser()
    setCurrentUser(user)
    
    // Listen for storage changes (when user logs in or registers in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        const updatedUser = e.newValue ? JSON.parse(e.newValue) : null
        setCurrentUser(updatedUser)
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    // 2. Click outside logic
    const handleClickOutside = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setIsAccountOpen(false);
        setIsHighlighted(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    // Add the click listener
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', badge: null },
    { label: 'Inquiries', icon: MessageSquare, path: '/inquiry', badge: null },
    { label: 'Purchases', icon: ShoppingCart, path: '/purchase-orders', badge: null },
    { label: 'Rules', icon: FileCheck, path: '/rules', badge: null }, 
    { label: 'Sales', icon: IndianRupee, path: '/sales-orders', badge: null },
    { label: 'Stock', icon: Package, path: '/stock', badge: null },
    { label: 'Products', icon: Package, path: '/products', badge: null },
    { label: 'Price Lists', icon: Tag, path: '/price-lists', badge: null },
    { label: 'User List', icon: Users, path: '/users', badge: null },
    { label: 'Customers', icon: Users, path: '/customers', badge: null },
    { label: 'Vendors', icon: Users, path: '/vendors', badge: null },
    { label: 'Transporters', icon: Truck, path: '/transporters', badge: null },
    { label: 'Quotations', icon: FileText, path: '/quotations', badge: null },
    { label: 'Dispatch', icon: Truck, path: '/dispatch', badge: null },
    { label: 'GRN', icon: ClipboardList, path: '/grn', badge: null },
    { label: 'Approvals', icon: CheckSquare, path: '/approvals', badge: null },
  ]

  const isActive = (path) => location.pathname.startsWith(path)

  const handleLinkClick = () => {
    if (isMobile) setIsOpen(false)
  }

  const handleToggleSidebar = () => setIsOpen(!isOpen)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logoutUser()
      navigate('/auth/login')
    } catch (error) {
      console.error('Logout error:', error)
      // Still navigate to login even if logout fails
      navigate('/auth/login')
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`fixed top-0 left-0 h-screen w-60 bg-[oklch(0.15_0_0)] border-r border-[oklch(0.25_0_0)] transform transition-all duration-300 ease-in-out z-50 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Sidebar Header */}
        <div className="flex-shrink-0 p-4 border-b border-[oklch(0.25_0_0)] flex items-center gap-3">
          <div className="w-8 h-8 flex-shrink-0 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">RP</div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold text-[oklch(0.92_0_0)] truncate">Rahul Papers</h2>
          </div>
          <button onClick={handleToggleSidebar} className="p-1.5 hover:bg-[oklch(0.20_0_0)] rounded-md text-[oklch(0.75_0_0)] hover:text-[oklch(0.92_0_0)] transition-colors flex-shrink-0">
            <X size={18} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1 min-h-0">
          {menuItems.map((item) => {
            const IconComponent = item.icon
            const active = isActive(item.path)
            return (
              <Link key={item.path} to={item.path} onClick={handleLinkClick} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm relative group ${active ? 'bg-indigo-600 text-white font-medium shadow-lg shadow-indigo-900/40' : 'text-[oklch(0.75_0_0)] hover:bg-[oklch(0.20_0_0)] hover:text-[oklch(0.92_0_0)]'}`}>
                <IconComponent size={18} className="flex-shrink-0 min-w-[18px]" />
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge && <span className={`flex-shrink-0 px-1.5 py-0.5 rounded text-xs font-semibold whitespace-nowrap ${active ? 'bg-white/20 text-white' : 'bg-[oklch(0.25_0_0)] text-[oklch(0.85_0_0)]'}`}>{item.badge}</span>}
              </Link>
            )
          })}
        </nav>

        {/* 3. Wrap Account Section and Footer in a div with the ref */}
        <div ref={accountRef} className="flex flex-col">
          {isAccountOpen && (
            <div className="card-surface backdrop-blur-sm flex-shrink-0 border border-gray-200/50 pt-3 px-3 rounded-lg shadow-lg mx-2 mb-2">
              <p className="text-xs font-semibold text-white/60 uppercase tracking-wider px-3 mb-2">My Account</p>
              <div className="space-y-1 mb-3">
                <Link to="/settings" onClick={() => { handleLinkClick(); setIsAccountOpen(false); }} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm ${location.pathname === '/settings' ? 'bg-indigo-600 text-white font-medium shadow-lg shadow-indigo-900/40' : 'text-[oklch(0.75_0_0)] hover:bg-[oklch(0.20_0_0)] hover:text-[oklch(0.92_0_0)]'}`}>
                  <Settings size={18} className="flex-shrink-0 min-w-[18px]" />
                  <span className="flex-1 truncate">Settings</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LogOut size={18} className="flex-shrink-0 min-w-[18px]" />
                  <span className="flex-1 truncate text-left">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Sidebar Footer */}
          <div 
            className={`flex-shrink-0 p-2 border-t border-[oklch(0.25_0_0)] bg-[oklch(0.12_0_0)] cursor-pointer hover:bg-[oklch(0.15_0_0)] transition-colors rounded-t-lg ${isHighlighted ? 'ring-2 ring-white/20' : ''}`} 
            onClick={() => {
              setIsAccountOpen(!isAccountOpen)
              setIsHighlighted(!isAccountOpen)
            }}
          >
            <div className="flex items-center gap-2 px-2 py-1">
              <div className="w-8 h-8 flex-shrink-0 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {currentUser?.first_name ? currentUser.first_name.charAt(0).toUpperCase() : (currentUser?.username?.charAt(0).toUpperCase() || 'U')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-[oklch(0.90_0_0)] truncate">
                  {currentUser?.first_name && currentUser?.last_name 
                    ? `${currentUser.first_name} ${currentUser.middle_name ? currentUser.middle_name + ' ' : ''}${currentUser.last_name}` 
                    : currentUser?.username || 'User'}
                </p>
                <p className="text-xs text-[oklch(0.60_0_0)] truncate">{currentUser?.email || 'user@company.com'}</p>
              </div>
              {isAccountOpen ? <ChevronUp size={16} className="text-[oklch(0.75_0_0)]" /> : <ChevronDown size={16} className="text-[oklch(0.75_0_0)]" />}
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
