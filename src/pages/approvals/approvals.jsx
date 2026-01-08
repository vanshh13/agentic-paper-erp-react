import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { UserCheck, Search, Eye, CheckCircle2, XCircle, Clock3 } from 'lucide-react'

const DEMO_REQUESTS = [
  { id: 1, requestId: 'APR-001', type: 'Purchase Order', requester: 'Priya Sharma', department: 'Procurement', date: '2025-01-02', amount: 450000, status: 'pending' },
  { id: 2, requestId: 'APR-002', type: 'Vendor Onboarding', requester: 'Rohan Mehta', department: 'Operations', date: '2025-01-01', amount: 0, status: 'approved' },
  { id: 3, requestId: 'APR-003', type: 'Price List', requester: 'Ananya Iyer', department: 'Sales', date: '2024-12-31', amount: 120000, status: 'rejected' },
  { id: 4, requestId: 'APR-004', type: 'Sales Order', requester: 'Vikram Singh', department: 'Sales', date: '2025-01-02', amount: 310000, status: 'pending' },
  { id: 5, requestId: 'APR-005', type: 'Stock Transfer', requester: 'Neha Kapoor', department: 'Warehouse', date: '2024-12-30', amount: 88000, status: 'approved' },
  { id: 6, requestId: 'APR-006', type: 'Purchase Order', requester: 'Arjun Rao', department: 'Procurement', date: '2025-01-01', amount: 215000, status: 'pending' },
]

const STATUS_BADGES = {
  pending: 'bg-amber-500/20 text-amber-400',
  approved: 'bg-emerald-500/20 text-emerald-400',
  rejected: 'bg-red-500/20 text-red-400',
}

export default function Approvals() {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode)
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('Pending')

  const stats = useMemo(() => {
    const counts = { pending: 0, approved: 0, rejected: 0 }
    DEMO_REQUESTS.forEach((r) => {
      counts[r.status] = (counts[r.status] || 0) + 1
    })
    return [
      { label: 'Pending', value: counts.pending, color: 'text-amber-400', icon: Clock3 },
      { label: 'Approved', value: counts.approved, color: 'text-emerald-400', icon: CheckCircle2 },
      { label: 'Rejected', value: counts.rejected, color: 'text-red-400', icon: XCircle },
      { label: 'Total', value: DEMO_REQUESTS.length, color: 'text-violet-600' },
    ]
  }, [])

  const filtered = useMemo(() => {
    return DEMO_REQUESTS.filter((r) => {
      const target = `${r.requestId} ${r.requester} ${r.type} ${r.department}`.toLowerCase()
      const matchesSearch = target.includes(search.toLowerCase())
      const matchesTab =
        tab === 'All' ||
        (tab === 'Pending' && r.status === 'pending') ||
        (tab === 'Approved' && r.status === 'approved') ||
        (tab === 'Rejected' && r.status === 'rejected')
      return matchesSearch && matchesTab
    })
  }, [search, tab])

  const formatCurrency = (num) => (num === 0 ? '-' : `₹${num.toLocaleString('en-IN')}`)
  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-IN')

  return (
    <div className="space-y-6 pb-10 text-foreground w-full px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-indigo-500/20 text-indigo-400">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Approval Queue</h1>
              <p className="text-muted-foreground text-sm md:text-base mt-1">Review and approve pending requests</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 bg-indigo-400 rounded-sm"></span>
              Showing data from all companies
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="card-surface p-5 md:p-6 rounded-xl border border-[var(--border)]">
              <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground mb-2">
                {Icon && <Icon className={`w-4 h-4 ${stat.color}`} />}
                <span>{stat.label}</span>
              </div>
              <p className={`text-3xl md:text-4xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          )
        })}
      </div>

      {/* Tabs + Search */}
      <div className="card-surface rounded-xl border border-[var(--border)] p-4 md:p-6">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex flex-wrap gap-2">
            {['Pending', 'Approved', 'Rejected', 'All'].map((item) => (
              <button
                key={item}
                onClick={() => setTab(item)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  tab === item
                    ? 'bg-indigo-600 text-white'
                    : 'bg-input text-foreground hover:bg-accent'
                }`}
              >
                {item}
                <span className="ml-1 text-muted-foreground">({
                  item === 'Pending'
                    ? stats[0].value
                    : item === 'Approved'
                      ? stats[1].value
                      : item === 'Rejected'
                        ? stats[2].value
                        : stats[3].value
                })</span>
              </button>
            ))}
          </div>
          <div className="flex-1 min-w-[240px] max-w-sm">
            <div className="flex items-center gap-2 bg-input border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-foreground">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search requests..."
                className="bg-transparent focus:outline-none w-full placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="card-surface rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="px-4 md:px-6 py-4 border-b border-[var(--border)]">
          <h3 className="text-base md:text-lg font-semibold text-foreground">Requests ({filtered.length})</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-secondary">
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Request ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Requester</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Department</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-[var(--border)] hover:bg-accent transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{r.requestId}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{r.type}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{r.requester}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{r.department}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{formatDate(r.date)}</td>
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{formatCurrency(r.amount)}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium capitalize ${STATUS_BADGES[r.status] || 'bg-muted text-foreground'}`}>
                      {r.status}
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

        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground text-sm">No pending approvals at the moment.</div>
        )}
      </div>
    </div>
  )
}