import { Link, useLocation, useNavigate } from 'react-router-dom'
import { X, Search, Settings, LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useSidebar } from '../contexts/SidebarContext'
import { logoutUser } from '../services/api/auth'
import NavItems from './NavItems'
import InteractiveAIAvatar from '../components/InteractiveAIAvatar'
import { logoutSuccess } from '../store/slices/userSlice'

export default function Sidebar() {
  const { isOpen, setIsOpen } = useSidebar()
  const [isMobile, setIsMobile] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const currentUser = useSelector((state) => state.auth.user)

  useEffect(() => {
    console.log("currentUser" ,currentUser)
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
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
    } catch (err) {
      console.warn('Logout API failed, clearing client state anyway')
    } finally {
      dispatch(logoutSuccess())    
      navigate('/auth/login', { replace: true })
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

      <aside 
        className={`fixed top-0 left-0 h-screen w-78 border-sidebar border-r bg-sidebar transform transition-all duration-300 ease-in-out z-50 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Sidebar Header */}
        <div 
          className="flex-shrink-0 p-4 pb-3 border-b border-sidebar flex items-center gap-3 transition-colors duration-300"
        >
          <div className="w-8 h-8 flex-shrink-0 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">RP</div>
          <div className="min-w-0 flex-1">
            <h2 
              className="text-sm font-semibold text-sidebar-foreground truncate transition-colors duration-300"
            >
              Rahul Papers
            </h2>
          </div>
          <button 
            onClick={handleToggleSidebar} 
            className="p-1.5 rounded-md text-sidebar-foreground transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* AI Avatar */}
        <div 
          className="flex-shrink-0 border-b border-sidebar pt-4 pb-3 cursor-pointer transition-colors duration-300"
          onClick={() => navigate('/chat')}
        >
          <InteractiveAIAvatar />
        </div>

        {/* Search Bar */}
        <div 
          className="flex-shrink-0 p-3 border-b border-sidebar transition-colors duration-300"
        >
          <div className="relative">
            <Search 
              size={16} 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-sidebar-foreground" 
            />
            <input
              type="text"
              placeholder="Search navigation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-9 py-2 border border-sidebar rounded-lg text-sm bg-input text-sidebar-foreground focus:outline-none focus:ring-2 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded transition-colors text-muted-foreground"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <NavItems onLinkClick={handleLinkClick} searchQuery={searchQuery} />

        {/* Sidebar Footer - Profile Section */}
        <div 
          className="flex-shrink-0 border-t border-sidebar rounded-t-lg relative z-10 mt-auto transition-colors duration-300"
        >
          <div className="flex items-center gap-2 p-3">
            <Link
              to="/profile"
              onClick={handleLinkClick}
              className={`flex-1 flex items-center gap-3 cursor-pointer transition-all rounded-lg p-2 -m-2 ${location.pathname === '/profile' ? 'bg-sidebar-accent' : ''}`}
            >
              <div className="w-10 h-10 flex-shrink-0 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-indigo-500/30">
                {currentUser?.first_name ? currentUser.first_name.charAt(0).toUpperCase() : (currentUser?.username?.charAt(0).toUpperCase() || 'U')}
              </div>
              <div className="flex-1 min-w-0">
                <p 
                  className="text-sm font-semibold text-sidebar-foreground truncate transition-colors duration-300"
                >
                  {currentUser?.first_name && currentUser?.last_name 
                    ? `${currentUser.first_name} ${currentUser.middle_name ? currentUser.middle_name + ' ' : ''}${currentUser.last_name}`.trim()
                    : currentUser?.username || 'User'}
                </p>
                <p 
                  className="text-xs text-sidebar-foreground truncate mt-0.5 transition-colors duration-300"
                >
                  {currentUser?.email || 'user@company.com'}
                </p>
                {currentUser?.is_admin && (
                  <span 
                    className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold rounded-md bg-primary/20 text-primary transition-colors duration-300"
                  >
                    Admin
                  </span>
                )}
              </div>
            </Link>
            <div className="flex items-center gap-1">
              <Link
                to="/settings"
                onClick={handleLinkClick}
                className={`p-2 rounded-lg transition-all ${location.pathname === '/settings' ? 'bg-primary/20 text-primary' : 'text-sidebar-foreground'}`}
                title="Settings"
              >
                <Settings size={18} />
              </Link>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-destructive"
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
