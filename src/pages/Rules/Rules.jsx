import { Plus, Settings, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import { useSelector } from 'react-redux'

export default function Rules() {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode)
  const [activeTab, setActiveTab] = useState('All')

  const ruleStats = [
    { label: 'Total Rules', value: '12', color: 'text-violet-600' },
    { label: 'Approval', value: '3', color: 'text-purple-400' },
    { label: 'Pricing', value: '4', color: 'text-emerald-400' },
    { label: 'Credit', value: '2', color: 'text-orange-400' },
    { label: 'Active', value: '9', color: 'text-cyan-400' },
  ]

  const demoRules = [
    {
      id: 1,
      rule: 'Auto Approve PO < 50K',
      type: 'Approval',
      category: 'Purchase Orders',
      threshold: '₹50,000',
      action: 'Auto Approve',
      priority: 'High',
      status: 'Active',
    },
    {
      id: 2,
      rule: 'Bulk Discount 10+',
      type: 'Pricing',
      category: 'Sales',
      threshold: '10 units',
      action: 'Apply 5%',
      priority: 'Medium',
      status: 'Active',
    },
    {
      id: 3,
      rule: 'Credit Limit Check',
      type: 'Credit',
      category: 'Customers',
      threshold: '₹5,00,000',
      action: 'Block Order',
      priority: 'High',
      status: 'Active',
    },
    {
      id: 4,
      rule: 'New Customer Discount',
      type: 'Pricing',
      category: 'Sales',
      threshold: 'First Order',
      action: 'Apply 10%',
      priority: 'Low',
      status: 'Active',
    },
    {
      id: 5,
      rule: 'Stock Low Alert',
      type: 'Pricing',
      category: 'Inventory',
      threshold: '< 50 units',
      action: 'Price Increase',
      priority: 'Medium',
      status: 'Inactive',
    },
    {
      id: 6,
      rule: 'Seasonal Discount',
      type: 'Pricing',
      category: 'Sales',
      threshold: 'Jan-Mar',
      action: 'Apply 15%',
      priority: 'Low',
      status: 'Active',
    },
  ]

  const tabs = ['All', 'Approval', 'Pricing', 'Credit', 'Discount']

  const getStatusColor = (status) => {
    return status === 'Active' 
      ? 'bg-emerald-500/20 text-emerald-400' 
      : 'bg-gray-500/20 text-gray-400'
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'text-red-400'
      case 'Medium':
        return 'text-yellow-400'
      case 'Low':
        return 'text-blue-400'
      default:
        return 'text-gray-400'
    }
  }

  const filteredRules = activeTab === 'All' 
    ? demoRules 
    : demoRules.filter(rule => rule.type === activeTab || activeTab === 'Discount')

  return (
    <div className="space-y-6 pb-10 text-foreground w-full px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-indigo-500/20 text-indigo-400">
              <SlidersHorizontal className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Rules Management</h1>
              <p className="text-muted-foreground text-sm md:text-base mt-1">
                Configure business rules for approvals, pricing, and more
              </p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors text-sm font-medium">
            <Plus className="w-4 h-4" />
            Add Rule
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 bg-indigo-400 rounded-sm"></span>
            Showing data from all companies
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {ruleStats.map((stat) => (
          <div
            key={stat.label}
            className="card-surface p-4 md:p-5 rounded-xl border border-[var(--border)]"
          >
            <p className="text-xs md:text-sm text-muted-foreground mb-2">{stat.label}</p>
            <p className={`text-3xl md:text-4xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs and Table */}
      <div className="card-surface rounded-xl border border-[var(--border)] overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-[var(--border)] bg-muted">
          <div className="flex gap-1 p-4 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-indigo-600/30 text-indigo-400 border border-indigo-500/50'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-muted">
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Rule</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Threshold</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Action</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRules.map((rule, idx) => (
                <tr
                  key={rule.id}
                  className="border-b border-[var(--border)] hover:bg-accent transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{rule.rule}</td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    <span className="inline-block px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-medium">
                      {rule.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{rule.category}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{rule.threshold}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{rule.action}</td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <span className={getPriorityColor(rule.priority)}>{rule.priority}</span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(rule.status)}`}>
                      {rule.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button className="text-indigo-400 hover:text-indigo-300 transition-colors">
                      <Settings className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredRules.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground text-sm">No rules found</p>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card-surface p-5 md:p-6 rounded-xl border border-[var(--border)]">
          <h3 className="text-base md:text-lg font-semibold text-foreground mb-4">How Rules Work</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <span className="text-indigo-400 font-bold">•</span>
              <span>Approval rules automatically process orders based on amount thresholds</span>
            </li>
            <li className="flex gap-3">
              <span className="text-purple-400 font-bold">•</span>
              <span>Pricing rules apply discounts and adjustments to sales orders</span>
            </li>
            <li className="flex gap-3">
              <span className="text-orange-400 font-bold">•</span>
              <span>Credit rules enforce customer credit limits and policies</span>
            </li>
          </ul>
        </div>

        <div className="card-surface p-5 md:p-6 rounded-xl border border-[var(--border)]">
          <h3 className="text-base md:text-lg font-semibold text-foreground mb-4">Recent Changes</h3>
          <div className="space-y-3">
            {[
              { action: 'Created: Auto Approve PO < 50K', time: '2 hours ago' },
              { action: 'Modified: New Customer Discount', time: '1 day ago' },
              { action: 'Deactivated: Stock Low Alert', time: '3 days ago' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
                <span className="text-sm text-foreground">{item.action}</span>
                <span className="text-xs text-muted-foreground">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}