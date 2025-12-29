import { Link } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function RootLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg sticky top-0 z-10">
          <div className="px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary tracking-wider">📊 ERP System</h1>
            
            <div className="flex items-center gap-4">
              <Link 
                to="/" 
                className="text-white font-medium hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white text-center py-4 border-t border-primary">
          <p className="text-sm">&copy; 2024 ERP System. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}
