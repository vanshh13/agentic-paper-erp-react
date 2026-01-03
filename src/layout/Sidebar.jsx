import { Link, useLocation, useNavigate } from 'react-router-dom'
import { X, Search, Settings, LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useSidebar } from '../contexts/SidebarContext'
import { getCurrentUser, logoutUser } from '../services/api/auth'
import NavItems from './NavItems'
import InteractiveAIAvatar from '../components/InteractiveAIAvatar'

export default function Sidebar() {
  const { isOpen, setIsOpen } = useSidebar()
  const [isMobile, setIsMobile] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

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

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLinkClick = () => {
    if (isMobile) setIsOpen(false)
  }

  const handleToggleSidebar = () => setIsOpen(!isOpen)

  const handleLogout = async (e) => {
    e.preventDefault()
    e.stopPropagation()
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

      <aside className={`fixed top-0 left-0 h-screen w-78 bg-[oklch(0.15_0_0)] border-r border-[oklch(0.25_0_0)] transform transition-all duration-300 ease-in-out z-50 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Sidebar Header */}
        <div className="flex-shrink-0 p-4 pb-3 border-b border-[oklch(0.25_0_0)] flex items-center gap-3">
          <div className="w-8 h-8 flex-shrink-0 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">RP</div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold text-[oklch(0.92_0_0)] truncate">Rahul Papers</h2>
          </div>
          <button onClick={handleToggleSidebar} className="p-1.5 hover:bg-[oklch(0.20_0_0)] rounded-md text-[oklch(0.75_0_0)] hover:text-[oklch(0.92_0_0)] transition-colors flex-shrink-0">
            <X size={18} />
          </button>
        </div>

        {/* AI Avatar */}
        <div 
          className="flex-shrink-0 border-b border-[oklch(0.25_0_0)] pt-4 pb-3 cursor-pointer"
          onClick={() => navigate('/chat')}
        >
          <InteractiveAIAvatar />
        </div>

        {/* Search Bar */}
        <div className="flex-shrink-0 p-3 border-b border-[oklch(0.25_0_0)]">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[oklch(0.60_0_0)]" />
            <input
              type="text"
              placeholder="Search navigation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-9 py-2 bg-[oklch(0.12_0_0)] border border-[oklch(0.25_0_0)] rounded-lg text-sm text-[oklch(0.92_0_0)] placeholder-[oklch(0.60_0_0)] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-[oklch(0.20_0_0)] rounded transition-colors"
                aria-label="Clear search"
              >
                <X size={14} className="text-[oklch(0.60_0_0)] hover:text-[oklch(0.90_0_0)]" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <NavItems onLinkClick={handleLinkClick} searchQuery={searchQuery} />

        {/* Sidebar Footer - Profile Section */}
        <div className="flex-shrink-0 border-t border-[oklch(0.25_0_0)] bg-[oklch(0.15_0_0)] rounded-t-lg relative z-10 mt-auto">
          <div className="flex items-center gap-2 p-3">
            <Link
              to="/profile"
              onClick={handleLinkClick}
              className={`flex-1 flex items-center gap-3 cursor-pointer hover:bg-[oklch(0.18_0_0)] transition-colors rounded-lg p-2 -m-2 ${location.pathname === '/profile' ? 'bg-[oklch(0.20_0_0)]' : ''}`}
            >
              <div className="w-10 h-10 flex-shrink-0 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-indigo-500/30">
                {currentUser?.first_name ? currentUser.first_name.charAt(0).toUpperCase() : (currentUser?.username?.charAt(0).toUpperCase() || 'U')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[oklch(0.95_0_0)] truncate">
                  {currentUser?.first_name && currentUser?.last_name 
                    ? `${currentUser.first_name} ${currentUser.middle_name ? currentUser.middle_name + ' ' : ''}${currentUser.last_name}`.trim()
                    : currentUser?.username || 'User'}
                </p>
                <p className="text-xs text-[oklch(0.65_0_0)] truncate mt-0.5">{currentUser?.email || 'user@company.com'}</p>
                {currentUser?.is_admin && (
                  <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 rounded-md">
                    Admin
                  </span>
                )}
              </div>
            </Link>
            <div className="flex items-center gap-1">
              <Link
                to="/settings"
                onClick={handleLinkClick}
                className={`p-2 rounded-lg transition-colors ${location.pathname === '/settings' ? 'bg-indigo-600 text-white' : 'text-[oklch(0.70_0_0)] hover:bg-[oklch(0.20_0_0)] hover:text-[oklch(0.90_0_0)]'}`}
                title="Settings"
              >
                <Settings size={18} />
              </Link>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="p-2 rounded-lg transition-colors text-red-400 hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
