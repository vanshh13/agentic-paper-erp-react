import { 
  ShoppingCart, 
  FileText, 
  Package, 
  Settings, 
  CheckSquare, 
  ClipboardList,
  MessageSquare,
  Plus,
  ArrowRight,
  LayoutDashboard
} from 'lucide-react'
import ActiveCustomersChart from '../../components/charts/active-customers-chart'
import SalesAnalyticsChart from '../../components/charts/sales-analytics-chart'
import TopInventoryChart from '../../components/charts/top-inventory-chart'
import CriticalInventoryChart from '../../components/charts/critical-inventory-chart'
import PriceHistoryChart from '../../components/charts/price-history-chart'
import OrderWorkflowStatus from '../../components/dashboard/order-workflow-status'
import TopSellingProducts from '../../components/dashboard/top-selling-products'
import TopCustomers from '../../components/dashboard/top-customers'
import AdditionalStatsSection from '../../components/dashboard/additional-stats-section'

export default function Dashboard() {
  const quickActions = [
    { label: 'New Inquiry', icon: MessageSquare, color: 'bg-blue-500/10 text-blue-400', path: '/inquiry' },
    { label: 'Create PI', icon: FileText, color: 'bg-purple-500/10 text-purple-400', path: '/quotations' },
    { label: 'New Order', icon: ShoppingCart, color: 'bg-emerald-500/10 text-emerald-400', path: '/sales-orders' },
    { label: 'Create PO', icon: Package, color: 'bg-orange-500/10 text-orange-400', path: '/purchase-orders' },
    { label: 'Stock Check', icon: ClipboardList, color: 'bg-cyan-500/10 text-cyan-400', path: '/stock' },
    { label: 'Approvals', icon: CheckSquare, color: 'bg-amber-500/10 text-amber-400', path: '/approvals' },
  ]

  const statsCards = [
    { 
      title: "Today's Orders", 
      value: '12', 
      subtitle: 'Active sales orders',
      icon: ShoppingCart, 
      color: 'text-blue-400',
      link: 'View all'
    },
    { 
      title: 'Pending PIs', 
      value: '5', 
      subtitle: 'Awaiting approval',
      icon: FileText, 
      color: 'text-purple-400',
      link: 'View all'
    },
    { 
      title: 'Pending DOs', 
      value: '8', 
      subtitle: 'Ready to dispatch',
      icon: Package, 
      color: 'text-cyan-400',
      link: 'View all'
    },
    { 
      title: 'Approvals', 
      value: '4', 
      subtitle: 'Requires attention',
      icon: CheckSquare, 
      color: 'text-amber-400',
      link: 'Review now'
    },
  ]

  return (
    <div className="space-y-6 pb-10 text-[oklch(0.95_0_0)] w-full px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-indigo-500/20 text-indigo-400">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[oklch(0.98_0_0)]">Dashboard</h1>
                <p className="text-[oklch(0.70_0_0)] text-sm md:text-base">Company-wide overview and quick actions</p>

            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 animate-pulse"></span>
            </span>
            <span className="text-sm font-medium text-emerald-400">Live</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[oklch(0.65_0_0)]">
          <span className="inline-flex items-center gap-1 text-xs md:text-sm">
            <span className="w-2 h-2 bg-indigo-400 rounded-sm"></span>
            Showing data from all companies
          </span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Plus className="w-4 h-4 text-indigo-400" />
          <h2 className="text-lg md:text-xl font-semibold text-[oklch(0.96_0_0)]">Quick Actions</h2>
        </div>
        <p className="text-[oklch(0.70_0_0)] text-xs md:text-sm">Frequently used actions</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <button
                key={action.label}
                onClick={() => window.location.href = action.path}
                className="card-surface p-4 md:p-6 hover:shadow-card-hover transition-all duration-200 group"
              >
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 md:w-7 md:h-7" />
                  </div>
                  <span className="text-xs md:text-sm font-medium text-[oklch(0.90_0_0)] group-hover:text-[oklch(0.98_0_0)] transition-colors">
                    {action.label}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.title}
              className="card-surface p-5 md:p-6 shadow-card-hover transition-all duration-200 group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg ${stat.color.replace('text-', 'bg-')}/10 flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              
              <div className="space-y-1 mb-4">
                <p className="text-xs md:text-sm text-[oklch(0.70_0_0)]">{stat.title}</p>
                <p className={`text-3xl md:text-4xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-[oklch(0.65_0_0)]">{stat.subtitle}</p>
              </div>

              <button className="flex items-center gap-1 text-xs text-[oklch(0.75_0_0)] hover:text-[oklch(0.95_0_0)] transition-colors group-hover:gap-2">
                <span>{stat.link}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )
        })}
      </div>

      {/* Additional Stats Section */}
      <AdditionalStatsSection />

      {/* Order Workflow Status - Full Width */}
      <OrderWorkflowStatus />

      {/* Top Selling Products and Top Customers - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TopSellingProducts />
        <TopCustomers />
      </div>

      {/* Analytics Charts */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ActiveCustomersChart />
          <SalesAnalyticsChart />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TopInventoryChart />
          <CriticalInventoryChart />
        </div>
        <div className="grid grid-cols-1 gap-4">
          <PriceHistoryChart />
        </div>
      </div>
    </div>
  )
}
