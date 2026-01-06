import Sidebar from './sidebar'
import { Outlet, useLocation, Link } from 'react-router-dom'
import { Bell, Menu, ChevronRight, Home } from 'lucide-react'
import { useSidebar } from '../contexts/side-bar-context'

export default function RootLayout({ children }) {
  const { isOpen, setIsOpen } = useSidebar()
  const location = useLocation()

  // Generate breadcrumb from location pathname
  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean)
    const breadcrumbs = [{ label: 'Home', path: '/dashboard' }]
    
    if (paths.length === 0) {
      return breadcrumbs
    }

    let currentPath = ''
    paths.forEach((path, index) => {
      currentPath += `/${path}`
      const label = path
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      breadcrumbs.push({ label, path: currentPath })
    })

    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs()

  return (
    <div className="flex h-screen bg-[oklch(0.18_0_0)] overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 overflow-hidden ${
        isOpen ? 'lg:ml-[19.5rem]' : 'lg:ml-0'
      }`}>
        {/* Top Bar */}
        <header className="bg-[oklch(0.22_0_0)] border-b border-[oklch(0.25_0_0)] flex-shrink-0 z-20 h-20">
          <div className="h-full px-4 md:px-6 flex justify-between items-center">
            <div className="flex items-center gap-2">
              {!isOpen && (
                <button 
                  onClick={() => setIsOpen(true)}
                  className="p-2 rounded-lg text-[oklch(0.80_0_0)] hover:bg-[oklch(0.24_0_0)] transition-colors"
                  aria-label="Open sidebar"
                  title="Open sidebar"
                >
                  <Menu className="w-5 h-5" />
                </button>
              )}
              <h1 className="text-base md:text-lg font-semibold text-[oklch(0.90_0_0)] truncate">{document.title || 'Dashboard'}</h1>
            </div>
            
            <div className="flex items-center gap-2 md:gap-4">
              <button className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-[oklch(0.80_0_0)] hover:bg-[oklch(0.24_0_0)] transition-colors text-sm">
                <span className="text-indigo-400">📋</span>
                All Companies
              </button>
              <button className="relative p-2 rounded-lg text-[oklch(0.80_0_0)] hover:bg-[oklch(0.24_0_0)] transition-colors">
                <Bell className="w-4 h-4 md:w-5 md:h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

          {/* Breadcrumb */}
          <div className="bg-[oklch(0.20_0_0)] border-b border-[oklch(0.25_0_0)] px-4 md:px-6 py-3 flex-shrink-0">
            <nav className="flex items-center gap-2 text-sm">
                {breadcrumbs.map((crumb, index) => {
                  const isLast = index === breadcrumbs.length - 1;

                  //  Make Edit, View & numeric IDs text-only
                  const isEditViewOrId =
                    ['edit', 'view'].includes(crumb.label.toLowerCase()) ||
                    !isNaN(Number(crumb.label));

                  return (
                    <div key={`${crumb.path}-${index}`} className="flex items-center gap-2">
                      {index !== 0 && (
                        <ChevronRight size={16} className="text-[oklch(0.50_0_0)]" />
                      )}

                      {index === 0 ? (
                        // Home (always clickable)
                        <Link
                          to={crumb.path}
                          className="flex items-center gap-1.5 text-[oklch(0.70_0_0)] hover:text-[oklch(0.90_0_0)] transition-colors"
                        >
                          <Home size={16} />
                          <span>{crumb.label}</span>
                        </Link>
                      ) : isLast || isEditViewOrId ? (
                        // Edit / View / ID → text only
                        <span className="text-[oklch(0.90_0_0)] font-medium cursor-default">
                          {crumb.label}
                        </span>
                      ) : (
                        // Other breadcrumbs clickable
                        <Link
                          to={crumb.path}
                          className="text-[oklch(0.70_0_0)] hover:text-[oklch(0.90_0_0)] transition-colors"
                        >
                          {crumb.label}
                        </Link>
                      )}
                    </div>
                  );
                })}

            </nav>
          </div>


        {/* Page Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-[oklch(0.18_0_0)] p-4 md:p-6">
          {/* <Outlet key={location.pathname} />  */}
          {children}
        </main>
      </div>
    </div>
  )
}