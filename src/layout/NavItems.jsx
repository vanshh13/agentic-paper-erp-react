import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, Package, ShoppingCart, FileText, Truck, MessageSquare, Tag, FileCheck, ClipboardList, CheckSquare, IndianRupee, ChevronRight } from 'lucide-react'
import { useState, useMemo, useEffect } from 'react'

export default function NavItems({ onLinkClick, searchQuery = '' }) {
  const location = useLocation()
  const [openSections, setOpenSections] = useState({
    overview: true,
    purchases: true,
    sales: true,
    inventory: true,
    masterData: true,
    system: true
  })

  const navigationSections = [
    {
      id: 'overview',
      label: 'Overview',
      items: [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', badge: null },
        { label: 'Inquiries', icon: MessageSquare, path: '/inquiry', badge: '5' },
        { label: 'Approvals', icon: CheckSquare, path: '/approvals', badge: '4' },
      ]
    },
    {
      id: 'purchases',
      label: 'Purchases',
      items: [
        { label: 'Purchase Orders', icon: ShoppingCart, path: '/purchase-orders', badge: '3' },
        { label: 'GRN', icon: ClipboardList, path: '/grn', badge: '2' },
      ]
    },
    {
      id: 'sales',
      label: 'Sales',
      items: [
        { label: 'Sales Orders', icon: IndianRupee, path: '/sales-orders', badge: '8' },
        { label: 'Quotations', icon: FileText, path: '/quotations', badge: null },
        { label: 'Dispatch', icon: Truck, path: '/dispatch', badge: null },
      ]
    },
    {
      id: 'inventory',
      label: 'Inventory',
      items: [
        { label: 'Stock', icon: Package, path: '/stock', badge: '12' },
        { label: 'Products', icon: Package, path: '/productsList', badge: null },
        { label: 'Price Lists', icon: Tag, path: '/price-lists', badge: null },
      ]
    },
    {
      id: 'masterData',
      label: 'Master Data',
      items: [
        { label: 'Users-List', icon: Users, path: '/users', badge: null },
        { label: 'Customers', icon: Users, path: '/customers', badge: null },
        { label: 'Vendors', icon: Users, path: '/vendors', badge: null },
        { label: 'Transporters', icon: Truck, path: '/transporters', badge: null },
      ]
    },
    {
      id: 'system',
      label: 'System',
      items: [
        { label: 'Rules', icon: FileCheck, path: '/rules', badge: null },
      ]
    }
  ]

  const toggleSection = (sectionId) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  const isActive = (path) => location.pathname.startsWith(path)

  // Highlight matching text in search results
  const highlightText = (text, query) => {
    if (!query.trim()) {
      return text
    }

    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`(${escapedQuery})`, 'gi')
    const parts = text.split(regex)

    return parts.map((part, index) => {
      // Check if this part matches the query (case-insensitive)
      const testRegex = new RegExp(`^${escapedQuery}$`, 'gi')
      if (testRegex.test(part)) {
        return (
          <mark key={index} className="bg-yellow-500/30 text-yellow-200 font-medium px-0.5 rounded">
            {part}
          </mark>
        )
      }
      return <span key={index}>{part}</span>
    })
  }

  // Filter navigation items based on search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) {
      return navigationSections
    }

    const query = searchQuery.toLowerCase().trim()
    return navigationSections.map(section => {
      const filteredItems = section.items.filter(item =>
        item.label.toLowerCase().includes(query) ||
        section.label.toLowerCase().includes(query)
      )
      return { ...section, items: filteredItems }
    }).filter(section => section.items.length > 0)
  }, [searchQuery])

  // Auto-expand sections when searching
  useEffect(() => {
    if (searchQuery.trim()) {
      setOpenSections(prev => {
        const newState = { ...prev }
        filteredSections.forEach(section => {
          newState[section.id] = true
        })
        return newState
      })
    }
  }, [searchQuery, filteredSections])

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2 min-h-0">
        {filteredSections.map((section) => (
          <div key={section.id} className="space-y-1">
            {/* Section Header */}
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-[oklch(0.60_0_0)] uppercase tracking-wider hover:text-[oklch(0.75_0_0)] transition-colors"
            >
              <span>{section.label}</span>
              <ChevronRight
                size={14}
                className={`transition-transform duration-200 ${openSections[section.id] ? 'rotate-90' : ''}`}
              />
            </button>

            {/* Section Items */}
            {openSections[section.id] && (
              <div className="space-y-1 pl-1">
                {section.items.map((item) => {
                  const IconComponent = item.icon
                  const active = isActive(item.path)
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={onLinkClick}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm relative group ${
                        active
                          ? 'bg-indigo-600 text-white font-medium shadow-lg shadow-indigo-900/40'
                          : 'text-[oklch(0.75_0_0)] hover:bg-[oklch(0.20_0_0)] hover:text-[oklch(0.92_0_0)]'
                      }`}
                    >
                      <IconComponent size={18} className="flex-shrink-0 min-w-[18px]" />
                      <span className="flex-1 truncate">{highlightText(item.label, searchQuery)}</span>
                      {item.badge && (
                        <span
                          className={`flex-shrink-0 px-1.5 py-0.5 rounded text-xs font-semibold whitespace-nowrap ${
                            active
                              ? 'bg-white/20 text-white'
                              : 'bg-[oklch(0.25_0_0)] text-[oklch(0.85_0_0)]'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        ))}

        {filteredSections.length === 0 && (
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-[oklch(0.60_0_0)]">No results found</p>
          </div>
        )}
      </nav>
    </div>
  )
}
