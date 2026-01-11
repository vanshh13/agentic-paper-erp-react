import { useEffect, useRef } from 'react'
import Sidebar from './sidebar'
import { Bell, Menu, ChevronRight, Home, Sun, Moon } from 'lucide-react'
import { useLocation, Link, matchPath } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { toggleTheme } from '../store/slices/theme-slice'
import { useSidebar } from '../contexts/sidebar-context'
import routes from '../routes/config/routes'
import { selectBreadcrumbs, setPathname } from '../store/slices/breadcrumbs-slice'

export default function RootLayout({ children }) {
  const { isOpen, setIsOpen } = useSidebar()
  const location = useLocation()
  const mainRef = useRef(null)
  const dispatch = useDispatch()

  const activeRoute = routes.find((route) => {
    if (!route?.path || route.path === '*') return false
    return Boolean(matchPath({ path: route.path, end: true }, location.pathname))
  })

  const shouldShowSidebar = activeRoute?.isSidebar !== false
  const effectiveIsOpen = shouldShowSidebar && isOpen

  // Get theme from Redux - apply globally in RootLayout only
  const isDarkMode = useSelector((state) => state.theme.isDarkMode)
  const currentTheme = useSelector((state) =>
    isDarkMode ? state.theme.darkTheme : state.theme.lightTheme
  )

  // Apply theme to document root
  useEffect(() => {
    const root = document.documentElement

    root.classList.toggle('dark', isDarkMode)
    
    // Apply the dark class when in dark mode, remove it when in light mode
    if (isDarkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    
    Object.entries(currentTheme).forEach(([key, value]) => {
      // Convert camelCase to kebab-case and set CSS variable
      const cssVarName = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
      root.style.setProperty(cssVarName, value)
    })
  }, [currentTheme, isDarkMode])

  // Keep sidebar closed on routes that don't want it
  useEffect(() => {
    if (!shouldShowSidebar && isOpen) {
      setIsOpen(false)
    }
  }, [shouldShowSidebar, isOpen, setIsOpen])

  // Breadcrumbs (computed in slice)
  const breadcrumbs = useSelector(selectBreadcrumbs)

  useEffect(() => {
    dispatch(setPathname(location.pathname))
  }, [dispatch, location.pathname])

  // Reset scroll position when route changes
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0)
    }
  }, [location.pathname])

  // Handle theme toggle
  const handleThemeToggle = () => {
    dispatch(toggleTheme())
  }

  // Force chart/layout recalculation when sidebar opens/closes
  useEffect(() => {
    window.dispatchEvent(new Event('resize'))
  }, [effectiveIsOpen])

  return (
    <div 
      className="flex h-screen overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: currentTheme.background }}
    >
      {/* Sidebar */}
      {shouldShowSidebar && <Sidebar />}

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 overflow-hidden ${
        effectiveIsOpen ? 'md:ml-[19.5rem]' : 'md:ml-0'
      }`}>
        {/* Top Bar */}
        <header 
          className="border-b flex-shrink-0 z-20 h-20 transition-colors duration-300"
          style={{ 
            backgroundColor: currentTheme.card,
            borderColor: currentTheme.border
          }}
        >
          <div className="h-full px-4 md:px-6 flex justify-between items-center">
            <div className="flex items-center gap-2">
              {shouldShowSidebar && !effectiveIsOpen && (
                <button 
                  onClick={() => setIsOpen(true)}
                  className="p-2 rounded-lg hover:opacity-80 transition-all"
                  style={{ color: currentTheme.foreground }}
                  aria-label="Open sidebar"
                  title="Open sidebar"
                >
                  <Menu className="w-5 h-5" />
                </button>
              )}
              <h1 
                className="text-base md:text-lg font-semibold truncate transition-colors duration-300"
                style={{ color: currentTheme.foreground }}
              >
                {document.title || 'Dashboard'}
              </h1>
            </div>
            
            <div className="flex items-center gap-2 md:gap-4">
              <button 
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg hover:opacity-80 transition-all text-sm"
                style={{ color: currentTheme.foreground }}
              >
                <span className="text-indigo-400">📋</span>
                All Companies
              </button>
              
              {/* Theme Toggle Switch */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleThemeToggle}
                  className="relative inline-flex items-center h-8 w-16 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  style={{ 
                    backgroundColor: isDarkMode ? 'rgba(99, 102, 241, 0.2)' : 'rgba(234, 179, 8, 0.2)',
                    borderColor: currentTheme.border 
                  }}
                  aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
                  title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
                >
                  {/* Moon Icon (Left) */}
                  <Moon 
                    className={`absolute left-2 w-4 h-4 transition-all duration-300 ${
                      isDarkMode ? 'text-indigo-400 opacity-100' : 'text-gray-400 opacity-50'
                    }`}
                  />
                  
                  {/* Sun Icon (Right) */}
                  <Sun 
                    className={`absolute right-2 w-4 h-4 transition-all duration-300 ${
                      !isDarkMode ? 'text-yellow-500 opacity-100' : 'text-gray-400 opacity-50'
                    }`}
                  />
                  
                  {/* Toggle Circle */}
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                      isDarkMode ? 'translate-x-1' : 'translate-x-9'
                    }`}
                    style={{
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                    }}
                  />
                </button>
              </div>
              <button 
                className="relative p-2 rounded-lg hover:opacity-80 transition-all"
                style={{ color: currentTheme.foreground }}
              >
                <Bell className="w-4 h-4 md:w-5 md:h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Breadcrumb */}
        {location.pathname != '/chat' &&
          <div
            className="border-b px-4 md:px-6 py-3 flex-shrink-0 transition-colors duration-300"
            style={{
              backgroundColor: currentTheme.card,
              borderColor: currentTheme.border
            }}
          >
            <nav className="flex items-center gap-2 text-sm">
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1

                // Make Edit / View / numeric IDs text-only
                const isEditViewOrId =
                  ['edit', 'view'].includes(crumb.label.toLowerCase()) ||
                  !isNaN(Number(crumb.label))

                return (
                  <div key={`${crumb.path}-${index}`} className="flex items-center gap-2">
                    {index !== 0 && (
                      <ChevronRight size={16} style={{ color: currentTheme.muted }} />
                    )}

                    {index === 0 ? (
                      // Home (always clickable)
                      <Link
                        to={crumb.path}
                        className="flex items-center gap-1.5 hover:opacity-80 transition-all"
                        style={{ color: currentTheme.primary }}
                      >
                        <Home size={16} />
                        <span>{crumb.label}</span>
                      </Link>
                    ) : isLast || isEditViewOrId ? (
                      // Edit / View / ID → text only
                      <span
                        className="font-medium cursor-default transition-colors duration-300"
                        style={{ color: currentTheme.foreground }}
                      >
                        {crumb.label}
                      </span>
                    ) : (
                      // Other breadcrumbs clickable
                      <Link
                        to={crumb.path}
                        className="hover:opacity-80 transition-all"
                        style={{ color: currentTheme.primary }}
                      >
                        {crumb.label}
                      </Link>
                    )}
                  </div>
                )
              })}
            </nav>
        </div>
        }
        {/* Page Content */}
        <main 
          ref={mainRef}
          className="flex-1 overflow-y-auto custom-scrollbar transition-colors duration-300 p-4 md:p-6"
          style={{ backgroundColor: currentTheme.background }}
        >
          {children}
        </main>
      </div>
    </div>
  )
}