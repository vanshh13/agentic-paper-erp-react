import Sidebar from './Sidebar'
import { Bell } from 'lucide-react'
import { Outlet } from 'react-router-dom'

export default function RootLayout() {
  return (
    <div className="flex min-h-screen bg-[oklch(0.18_0_0)]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-[oklch(0.22_0_0)] border-b border-[var(--border)] relative z-20">
          <div className="px-4 md:px-6 py-3 flex justify-between items-center">
            <h1 className="text-base md:text-lg font-semibold text-[oklch(0.70_0_0)] truncate">{document.title || 'Dashboard'}</h1>
            
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

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
