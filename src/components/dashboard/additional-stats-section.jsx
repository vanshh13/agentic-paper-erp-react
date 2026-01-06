import { AlertTriangle, FileText, Truck, TrendingUp } from 'lucide-react'

export default function AdditionalStatsSection() {
  const topMetrics = [
    { 
      title: 'Open Inquiries', 
      value: '15', 
      icon: FileText, 
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
      actionText: 'Respond to inquiries',
      actionColor: 'text-orange-400',
      trend: null
    },
    { 
      title: 'Low Stock Alerts', 
      value: '7', 
      icon: AlertTriangle, 
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
      actionText: 'View stock levels',
      actionColor: 'text-red-400',
      trend: null
    },
    { 
      title: 'GRN Pending', 
      value: '2', 
      icon: Truck, 
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/20',
      actionText: 'Process GRN',
      actionColor: 'text-emerald-400',
      trend: null
    },
  ]

  const bottomMetrics = [
    { 
      title: 'Total Revenue', 
      value: '₹45.2M', 
      trend: '+12.5%',
      trendUp: true,
      icon: TrendingUp, 
      color: 'text-emerald-400',
      subtitle: 'From last month'
    },
    { 
      title: 'Active Orders', 
      value: '234', 
      trend: '+8.1%',
      trendUp: true,
      icon: FileText, 
      color: 'text-blue-400',
      subtitle: 'From last month'
    },
    { 
      title: 'Total Customers', 
      value: '1,248', 
      trend: '+5.2%',
      trendUp: true,
      icon: FileText, 
      color: 'text-purple-400',
      subtitle: 'From last month'
    },
    { 
      title: 'Pending Approvals', 
      value: '8', 
      trend: '-15.2%',
      trendUp: false,
      icon: FileText, 
      color: 'text-orange-400',
      subtitle: 'From last month'
    },
    { 
      title: 'Low Stock Items', 
      value: '12', 
      trend: '-15.2%',
      trendUp: false,
      icon: AlertTriangle, 
      color: 'text-red-400',
      subtitle: 'From last month'
    },
    { 
      title: 'In Transit', 
      value: '18', 
      trend: '+3.1%',
      trendUp: true,
      icon: Truck, 
      color: 'text-cyan-400',
      subtitle: 'From last month'
    },
    { 
      title: 'Pending Payments', 
      value: '₹8.5M', 
      trend: '-2.4%',
      trendUp: false,
      icon: FileText, 
      color: 'text-yellow-400',
      subtitle: 'From last month'
    },
    { 
      title: 'Total Products', 
      value: '1,456', 
      trend: '+18.7%',
      trendUp: true,
      icon: FileText, 
      color: 'text-violet-400',
      subtitle: 'From last month'
    },
  ]

  return (
    <div className="space-y-6">
      {/* Top Alert Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {topMetrics.map((metric) => {
          const Icon = metric.icon
          return (
            <div
              key={metric.title}
              className="card-surface p-5 md:p-6 border border-[var(--border)] transition-all duration-200 hover:shadow-card-hover"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg ${metric.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${metric.color}`} />
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-[oklch(0.65_0_0)] mb-1">{metric.title}</p>
                  <p className={`text-3xl md:text-4xl font-bold ${metric.color}`}>{metric.value}</p>
                </div>

                <button className={`text-xs ${metric.actionColor} hover:text-[oklch(0.95_0_0)] transition-colors font-medium`}>
                  {metric.actionText} →
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {bottomMetrics.map((metric) => {
          const Icon = metric.icon
          return (
            <div
              key={metric.title}
              className="card-surface p-4 md:p-5 border border-[var(--border)] transition-all duration-200 hover:shadow-card-hover"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${metric.color.replace('text-', 'bg-')}/10 flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${metric.color}`} />
                </div>
                <span className={`text-xs font-semibold ${metric.trendUp ? 'text-emerald-400' : 'text-red-400'}`}>
                  {metric.trend}
                </span>
              </div>
              
              <div className="space-y-1">
                <p className="text-xs text-[oklch(0.65_0_0)]">{metric.title}</p>
                <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
                <p className="text-xs text-[oklch(0.60_0_0)]">{metric.subtitle}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
