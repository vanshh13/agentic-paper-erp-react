import { useMemo, useState } from 'react'
import { ClipboardList, Plus, Search, Eye } from 'lucide-react'

const DEMO_GRNS = [
  { id: 1, grnNumber: 'GRN-001', status: 'pending', receivedDate: '2025-01-02', vehicle: 'GJ-05-IJ-7890', transporter: 'VRL Logistics', discrepancy: 'Awaiting QC' },
  { id: 2, grnNumber: 'GRN-002', status: 'approved', receivedDate: '2025-01-01', vehicle: 'MH-03-EF-9012', transporter: 'Gati Logistics', discrepancy: '' },
  { id: 3, grnNumber: 'GRN-003', status: 'discrepancy', receivedDate: '2024-12-31', vehicle: 'TN-06-KL-2345', transporter: 'DTDC Courier', discrepancy: 'Quantity mismatch' },
  { id: 4, grnNumber: 'GRN-004', status: 'approved', receivedDate: '2024-12-30', vehicle: 'KA-08-OP-0123', transporter: 'Blue Dart Express', discrepancy: '' },
  { id: 5, grnNumber: 'GRN-005', status: 'pending', receivedDate: '2025-01-02', vehicle: 'DL-04-GH-3456', transporter: 'Safexpress', discrepancy: 'Awaiting QC' },
  { id: 6, grnNumber: 'GRN-006', status: 'rejected', receivedDate: '2024-12-29', vehicle: 'TN-01-AB-1234', transporter: 'TCI Express', discrepancy: 'Damaged pallets' },
  { id: 7, grnNumber: 'GRN-007', status: 'approved', receivedDate: '2024-12-28', vehicle: 'KA-02-CD-5678', transporter: 'KPN Travels', discrepancy: '' },
  { id: 8, grnNumber: 'GRN-008', status: 'discrepancy', receivedDate: '2025-01-01', vehicle: 'MH-07-MN-6789', transporter: 'Om Logistics', discrepancy: 'Wrong batch labels' },
]

const STATUS_BADGES = {
  pending: 'bg-amber-500/20 text-amber-400',
  approved: 'bg-emerald-500/20 text-emerald-400',
  discrepancy: 'bg-orange-500/20 text-orange-400',
  rejected: 'bg-red-500/20 text-red-400',
}

export default function GRN() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Status')

  const filteredGrns = useMemo(() => {
    return DEMO_GRNS.filter((g) => {
      const target = `${g.grnNumber} ${g.transporter} ${g.vehicle}`.toLowerCase()
      const matchesSearch = target.includes(search.toLowerCase())
      const matchesStatus = statusFilter === 'All Status' || g.status === statusFilter.toLowerCase()
      return matchesSearch && matchesStatus
    })
  }, [search, statusFilter])

  const stats = useMemo(() => {
    const counts = { pending: 0, approved: 0, discrepancy: 0, rejected: 0 }
    DEMO_GRNS.forEach((g) => {
      counts[g.status] = (counts[g.status] || 0) + 1
    })
    return [
      { label: 'Pending Inspection', value: counts.pending, color: 'text-amber-400' },
      { label: 'Approved', value: counts.approved, color: 'text-emerald-400' },
      { label: 'With Discrepancy', value: counts.discrepancy, color: 'text-orange-400' },
      { label: 'Rejected', value: counts.rejected, color: 'text-red-400' },
    ]
  }, [])

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-IN')

  return (
    <div className="space-y-6 pb-10 text-[oklch(0.95_0_0)] w-full px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-indigo-500/20 text-indigo-400">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[oklch(0.98_0_0)]">Goods Receipt Notes</h1>
              <p className="text-[oklch(0.70_0_0)] text-sm md:text-base mt-1">Manage incoming goods and quality inspection</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors text-sm font-medium">
            <Plus className="w-4 h-4" />
            Create GRN
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat) => (
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
                placeholder="Search by GRN number, vehicle, or transporter..."
                className="bg-transparent focus:outline-none w-full placeholder:text-[oklch(0.65_0_0)]"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="min-w-[160px] bg-[oklch(0.30_0_0)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[oklch(0.90_0_0)] focus:outline-none"
          >
            {['All Status', 'Pending', 'Approved', 'Discrepancy', 'Rejected'].map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      {/* GRN Records */}
      <div className="card-surface rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="px-4 md:px-6 py-4 border-b border-[var(--border)]">
          <h3 className="text-base md:text-lg font-semibold text-[oklch(0.95_0_0)]">GRN Records ({filteredGrns.length})</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[oklch(0.28_0_0)]">
                <th className="px-6 py-4 text-left text-xs font-semibold text-[oklch(0.75_0_0)] uppercase tracking-wider">GRN Number</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[oklch(0.75_0_0)] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[oklch(0.75_0_0)] uppercase tracking-wider">Received Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[oklch(0.75_0_0)] uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[oklch(0.75_0_0)] uppercase tracking-wider">Transporter</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[oklch(0.75_0_0)] uppercase tracking-wider">Discrepancy</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[oklch(0.75_0_0)] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGrns.map((g) => (
                <tr key={g.id} className="border-b border-[var(--border)] hover:bg-[oklch(0.32_0_0)] transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-[oklch(0.95_0_0)]">{g.grnNumber}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium capitalize ${STATUS_BADGES[g.status] || 'bg-[oklch(0.35_0_0)] text-[oklch(0.80_0_0)]'}`}>
                      {g.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[oklch(0.85_0_0)]">{formatDate(g.receivedDate)}</td>
                  <td className="px-6 py-4 text-sm text-[oklch(0.85_0_0)]">{g.vehicle}</td>
                  <td className="px-6 py-4 text-sm text-[oklch(0.85_0_0)]">{g.transporter}</td>
                  <td className="px-6 py-4 text-sm text-[oklch(0.85_0_0)]">{g.discrepancy || 'None'}</td>
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

        {filteredGrns.length === 0 && (
          <div className="py-12 text-center text-[oklch(0.65_0_0)] text-sm">No GRN records found</div>
        )}
      </div>
    </div>
  )
}