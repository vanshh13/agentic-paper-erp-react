import { useMemo, useState } from 'react'
import { FileText, Plus, Search, Eye } from 'lucide-react'

const STATS = [
  { label: 'Pending Approval', value: '4', color: 'text-amber-400' },
  { label: 'Approved', value: '2', color: 'text-emerald-400' },
  { label: 'Total Value', value: '₹29,53,250', color: 'text-white' },
]

const DEMO_QUOTATIONS = [
  { id: 1, quotationNo: 'QT-001-2025', customerName: 'Reliance Industries Ltd', totalAmount: 450000, discount: 0, netAmount: 450000, validUntil: '2025-02-15', status: 'draft' },
  { id: 2, quotationNo: 'QT-002-2025', customerName: 'Tata Steel Ltd', totalAmount: 320000, discount: 16000, netAmount: 304000, validUntil: '2025-02-10', status: 'sent' },
  { id: 3, quotationNo: 'QT-003-2025', customerName: 'Hindustan Unilever', totalAmount: 580000, discount: 29000, netAmount: 551000, validUntil: '2025-02-20', status: 'accepted' },
  { id: 4, quotationNo: 'QT-004-2025', customerName: 'ITC Limited', totalAmount: 720000, discount: 36000, netAmount: 684000, validUntil: '2025-02-18', status: 'sent' },
  { id: 5, quotationNo: 'QT-005-2025', customerName: 'Mahindra & Mahindra', totalAmount: 890000, discount: 44500, netAmount: 845500, validUntil: '2025-02-25', status: 'draft' },
  { id: 6, quotationNo: 'QT-006-2025', customerName: 'Aditya Textiles', totalAmount: 125000, discount: 6250, netAmount: 118750, validUntil: '2025-02-12', status: 'accepted' },
]

const STATUS_BADGES = {
  draft: 'bg-slate-500/20 text-slate-300',
  sent: 'bg-blue-500/20 text-blue-400',
  accepted: 'bg-emerald-500/20 text-emerald-400',
  rejected: 'bg-red-500/20 text-red-400',
}

export default function Quotations() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Status')

  const filteredQuotations = useMemo(() => {
    return DEMO_QUOTATIONS.filter((q) => {
      const target = `${q.quotationNo} ${q.customerName}`.toLowerCase()
      const matchesSearch = target.includes(search.toLowerCase())
      const matchesStatus = statusFilter === 'All Status' || q.status === statusFilter.toLowerCase()
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
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[oklch(0.98_0_0)]">Quotations</h1>
              <p className="text-[oklch(0.70_0_0)] text-sm md:text-base mt-1">Create and manage customer quotations</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors text-sm font-medium">
            <Plus className="w-4 h-4" />
            New Quotation
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs text-[oklch(0.65_0_0)]">
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 bg-indigo-400 rounded-sm"></span>
            Showing data from all companies
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="card-surface p-5 md:p-6 rounded-xl border border-[var(--border)]">
            <p className="text-xs md:text-sm text-[oklch(0.70_0_0)] mb-2">{stat.label}</p>
            <p className={`text-3xl md:text-4xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="card-surface rounded-xl border border-[var(--border)] p-4 md:p-6">
        <h3 className="text-base md:text-lg font-semibold text-[oklch(0.95_0_0)] mb-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-indigo-400" />
          Search & Filter
        </h3>
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[240px]">
            <div className="flex items-center gap-2 bg-[oklch(0.30_0_0)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[oklch(0.85_0_0)]">
              <Search className="w-4 h-4 text-[oklch(0.65_0_0)]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by quotation number..."
                className="bg-transparent focus:outline-none w-full placeholder:text-[oklch(0.65_0_0)]"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="min-w-[140px] bg-[oklch(0.30_0_0)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[oklch(0.90_0_0)] focus:outline-none"
          >
            {['All Status', 'Draft', 'Sent', 'Accepted', 'Rejected'].map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Quotations Table */}
      <div className="card-surface rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="px-4 md:px-6 py-4 border-b border-[var(--border)]">
          <h3 className="text-base md:text-lg font-semibold text-[oklch(0.95_0_0)]">Quotations ({filteredQuotations.length})</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[oklch(0.28_0_0)]">
                <th className="px-6 py-4 text-left text-xs font-semibold text-[oklch(0.75_0_0)] uppercase tracking-wider">Quotation No.</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[oklch(0.75_0_0)] uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[oklch(0.75_0_0)] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[oklch(0.75_0_0)] uppercase tracking-wider">Total Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[oklch(0.75_0_0)] uppercase tracking-wider">Discount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[oklch(0.75_0_0)] uppercase tracking-wider">Net Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[oklch(0.75_0_0)] uppercase tracking-wider">Valid Until</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[oklch(0.75_0_0)] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuotations.map((q) => (
                <tr key={q.id} className="border-b border-[var(--border)] hover:bg-[oklch(0.32_0_0)] transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-[oklch(0.95_0_0)]">{q.quotationNo}</td>
                  <td className="px-6 py-4 text-sm text-[oklch(0.85_0_0)]">{q.customerName}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium capitalize ${STATUS_BADGES[q.status] || 'bg-[oklch(0.35_0_0)] text-[oklch(0.80_0_0)]'}`}>
                      {q.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-[oklch(0.90_0_0)]">{formatCurrency(q.totalAmount)}</td>
                  <td className="px-6 py-4 text-sm text-[oklch(0.85_0_0)]">{formatCurrency(q.discount)}</td>
                  <td className="px-6 py-4 text-sm font-medium text-[oklch(0.90_0_0)]">{formatCurrency(q.netAmount)}</td>
                  <td className="px-6 py-4 text-sm text-[oklch(0.85_0_0)]">{formatDate(q.validUntil)}</td>
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

        {filteredQuotations.length === 0 && (
          <div className="py-12 text-center text-[oklch(0.65_0_0)] text-sm">No quotations found</div>
        )}
      </div>
    </div>
  )
}
