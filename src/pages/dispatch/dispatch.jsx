import { useMemo, useState } from 'react'
import { Truck, Plus, Search, Eye, RotateCw, Download } from 'lucide-react'

const DISPATCH_STATS = [
  { label: 'Ready', value: '3', sublabel: 'Awaiting dispatch', color: 'text-purple-400', borderColor: 'border-l-purple-400' },
  { label: 'Loading', value: '2', sublabel: 'Being loaded', color: 'text-amber-400', borderColor: 'border-l-amber-400' },
  { label: 'In Transit', value: '5', sublabel: 'On the way', color: 'text-blue-400', borderColor: 'border-l-blue-400' },
  { label: 'Delivered', value: '8', sublabel: 'Successfully delivered', color: 'text-emerald-400', borderColor: 'border-l-emerald-400' },
  { label: 'Delayed', value: '1', sublabel: 'Requires attention', color: 'text-red-400', borderColor: 'border-l-red-400' },
  { label: 'Total', value: '19', sublabel: 'All dispatches', color: 'text-white', borderColor: 'border-l-indigo-400' },
]

const DEMO_DISPATCHES = [
  { id: 1, dispatchId: 'DSP-001', customer: 'Reliance Industries Ltd', status: 'in-transit', vehicle: 'TN-01-AB-1234', driver: 'Rajesh Kumar', date: '2025-01-01', amount: 450000 },
  { id: 2, dispatchId: 'DSP-002', customer: 'Tata Steel Ltd', status: 'delivered', vehicle: 'KA-02-CD-5678', driver: 'Vikram Singh', date: '2024-12-31', amount: 320000 },
  { id: 3, dispatchId: 'DSP-003', customer: 'Hindustan Unilever', status: 'loading', vehicle: 'MH-03-EF-9012', driver: 'Amit Patel', date: '2025-01-02', amount: 580000 },
  { id: 4, dispatchId: 'DSP-004', customer: 'ITC Limited', status: 'ready', vehicle: 'DL-04-GH-3456', driver: 'Suresh Verma', date: '2025-01-02', amount: 720000 },
  { id: 5, dispatchId: 'DSP-005', customer: 'Mahindra & Mahindra', status: 'in-transit', vehicle: 'GJ-05-IJ-7890', driver: 'Mohan Das', date: '2025-01-01', amount: 890000 },
  { id: 6, dispatchId: 'DSP-006', customer: 'Aditya Textiles', status: 'delayed', vehicle: 'TN-06-KL-2345', driver: 'Pradeep Roy', date: '2024-12-30', amount: 125000 },
  { id: 7, dispatchId: 'DSP-007', customer: 'Reliance Industries Ltd', status: 'delivered', vehicle: 'MH-07-MN-6789', driver: 'Deepak Nair', date: '2024-12-29', amount: 410000 },
  { id: 8, dispatchId: 'DSP-008', customer: 'Century Pulp', status: 'ready', vehicle: 'KA-08-OP-0123', driver: 'Ravi Kumar', date: '2025-01-02', amount: 290000 },
]

const STATUS_BADGES = {
  ready: 'bg-purple-500/20 text-purple-400',
  loading: 'bg-amber-500/20 text-amber-400',
  'in-transit': 'bg-blue-500/20 text-blue-400',
  delivered: 'bg-emerald-500/20 text-emerald-400',
  delayed: 'bg-red-500/20 text-red-400',
}

export default function Dispatch() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const filteredDispatches = useMemo(() => {
    return DEMO_DISPATCHES.filter((d) => {
      const target = `${d.dispatchId} ${d.customer} ${d.vehicle}`.toLowerCase()
      const matchesSearch = target.includes(search.toLowerCase())
      const matchesStatus = statusFilter === 'All' || (statusFilter === 'In Transit' && d.status === 'in-transit') || (statusFilter === 'Delivered' && d.status === 'delivered')
      return matchesSearch && matchesStatus
    })
  }, [search, statusFilter])

  const formatCurrency = (num) => `₹${num.toLocaleString('en-IN')}`
  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-IN')

  return (
    <div className="space-y-6 pb-10 text-[oklch(0.95_0_0)] w-full px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[oklch(0.98_0_0)]">Dispatch Management</h1>
              <p className="text-[oklch(0.70_0_0)] text-sm md:text-base mt-1">E-way bill generation and real-time dispatch tracking</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] text-[oklch(0.85_0_0)] hover:bg-[oklch(0.32_0_0)] transition-colors text-sm font-medium">
              <RotateCw className="w-4 h-4" />
              Refresh
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors text-sm font-medium">
              <Plus className="w-4 h-4" />
              New Dispatch
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-[oklch(0.65_0_0)]">
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 bg-indigo-400 rounded-sm"></span>
            Showing data from all companies
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {DISPATCH_STATS.map((stat) => (
          <div key={stat.label} className={`card-surface p-4 rounded-xl border border-[var(--border)] border-l-4 ${stat.borderColor}`}>
            <p className="text-xs text-[oklch(0.70_0_0)] mb-2">{stat.label}</p>
            <p className={`text-2xl md:text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-[oklch(0.65_0_0)] mt-1">{stat.sublabel}</p>
          </div>
        ))}
      </div>

      {/* Action Tabs */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {['All', 'In Transit', 'Delivered'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === tab
                  ? 'bg-indigo-600 text-white'
                  : 'bg-[oklch(0.30_0_0)] text-[oklch(0.85_0_0)] hover:bg-[oklch(0.32_0_0)]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[oklch(0.30_0_0)] text-[oklch(0.85_0_0)] hover:bg-[oklch(0.32_0_0)] transition-colors text-sm font-medium">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Dispatch Records */}
      <div className="card-surface rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="px-4 md:px-6 py-4 border-b border-[var(--border)]">
          <h3 className="text-base md:text-lg font-semibold text-[oklch(0.95_0_0)]">Dispatch Records</h3>
          <p className="text-xs md:text-sm text-[oklch(0.65_0_0)] mt-1">View and manage all dispatch records</p>
        </div>

        {/* Search */}
        <div className="px-4 md:px-6 py-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2 bg-[oklch(0.30_0_0)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[oklch(0.85_0_0)]">
            <Search className="w-4 h-4 text-[oklch(0.65_0_0)]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, customer, or vehicle..."
              className="bg-transparent focus:outline-none w-full placeholder:text-[oklch(0.65_0_0)]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[oklch(0.28_0_0)]">
                <th className="px-6 py-4 text-left text-xs font-semibold text-[oklch(0.75_0_0)] uppercase tracking-wider">Dispatch ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[oklch(0.75_0_0)] uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[oklch(0.75_0_0)] uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[oklch(0.75_0_0)] uppercase tracking-wider">Driver</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[oklch(0.75_0_0)] uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[oklch(0.75_0_0)] uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[oklch(0.75_0_0)] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[oklch(0.75_0_0)] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDispatches.map((d) => (
                <tr key={d.id} className="border-b border-[var(--border)] hover:bg-[oklch(0.32_0_0)] transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-[oklch(0.95_0_0)]">{d.dispatchId}</td>
                  <td className="px-6 py-4 text-sm text-[oklch(0.85_0_0)]">{d.customer}</td>
                  <td className="px-6 py-4 text-sm text-[oklch(0.85_0_0)]">{d.vehicle}</td>
                  <td className="px-6 py-4 text-sm text-[oklch(0.85_0_0)]">{d.driver}</td>
                  <td className="px-6 py-4 text-sm text-[oklch(0.85_0_0)]">{formatDate(d.date)}</td>
                  <td className="px-6 py-4 text-sm font-medium text-[oklch(0.90_0_0)]">{formatCurrency(d.amount)}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium capitalize ${STATUS_BADGES[d.status] || 'bg-[oklch(0.35_0_0)] text-[oklch(0.80_0_0)]'}`}>
                      {d.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button className="text-indigo-400 hover:text-indigo-300 transition-colors" title="View">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredDispatches.length === 0 && (
          <div className="py-12 text-center text-[oklch(0.65_0_0)] text-sm">No dispatch records found</div>
        )}
      </div>
    </div>
  )
}