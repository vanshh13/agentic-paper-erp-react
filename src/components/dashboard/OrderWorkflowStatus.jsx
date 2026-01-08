import { TrendingUp, CheckCircle, Clock, Package, Truck, Archive } from 'lucide-react'

export default function OrderWorkflowStatus() {
  const workflowStatuses = [
    { name: 'Pending Approval', count: 8, icon: Clock, color: 'text-amber-400', bgColor: 'bg-amber-500/20', barColor: 'from-amber-500 to-amber-400' },
    { name: 'In Production', count: 15, icon: Package, color: 'text-blue-400', bgColor: 'bg-blue-500/20', barColor: 'from-blue-500 to-blue-400' },
    { name: 'Ready to Dispatch', count: 12, icon: CheckCircle, color: 'text-cyan-400', bgColor: 'bg-cyan-500/20', barColor: 'from-cyan-500 to-cyan-400' },
    { name: 'In Transit', count: 18, icon: Truck, color: 'text-orange-400', bgColor: 'bg-orange-500/20', barColor: 'from-orange-500 to-orange-400' },
    { name: 'Delivered', count: 5, icon: Archive, color: 'text-emerald-400', bgColor: 'bg-emerald-500/20', barColor: 'from-emerald-500 to-emerald-400' },
  ]

  const totalOrders = 50
  const completedOrders = 45
  const pendingOrders = 5

  return (
    <div className="card-surface p-6 border border-[var(--border)]">
      <div className="space-y-6">
        {/* Header with Title and Summary */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            Order Workflow Status
          </h3>
          <p className="text-xs text-muted-foreground mb-4">Track orders across different stages</p>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-[var(--background)] p-3 rounded-lg border border-[var(--border)]">
              <p className="text-xs text-muted-foreground mb-1">Total Orders</p>
              <p className="text-2xl font-bold text-foreground">{totalOrders}</p>
            </div>
            <div className="bg-[var(--background)] p-3 rounded-lg border border-[var(--border)]">
              <p className="text-xs text-muted-foreground mb-1">Completed</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{completedOrders}</p>
            </div>
            <div className="bg-[var(--background)] p-3 rounded-lg border border-[var(--border)]">
              <p className="text-xs text-muted-foreground mb-1">Pending</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{pendingOrders}</p>
            </div>
          </div>
        </div>

        {/* Workflow Status List */}
        <div className="space-y-3">
          {workflowStatuses.map((status) => {
            const Icon = status.icon
            const percentage = (status.count / totalOrders) * 100
            return (
              <div key={status.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${status.bgColor} flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 ${status.color}`} />
                    </div>
                    <div>
                      <p className="text-sm text-foreground">{status.name}</p>
                      <p className="text-xs text-muted-foreground">{status.count} orders</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-foreground">{percentage.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-[var(--background)] rounded-full h-2.5 overflow-hidden border border-[var(--border)]">
                  <div
                    className={`h-full bg-gradient-to-r ${status.barColor} transition-all duration-500 ease-out`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
