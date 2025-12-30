import { Eye, X } from 'lucide-react'
import { INQUIRY_STATUS, INQUIRY_SOURCE, SLA_STATUS } from '../../types/inquiry'

const statusConfig = {
  new: { label: 'New', color: 'bg-emerald-500/15 text-emerald-200' },
  parsed: { label: 'Parsed', color: 'bg-indigo-500/15 text-indigo-200' },
  pi_sent: { label: 'PI Sent', color: 'bg-cyan-500/15 text-cyan-200' },
  follow_up: { label: 'Follow Up', color: 'bg-amber-500/20 text-amber-200' },
  converted: { label: 'Converted', color: 'bg-emerald-500/20 text-emerald-100' },
  rejected: { label: 'Rejected', color: 'bg-rose-500/20 text-rose-100' },
}

const sourceConfig = {
  whatsapp: { label: 'WhatsApp' },
  email: { label: 'Email' },
  phone: { label: 'Phone' },
  portal: { label: 'Portal' },
  walk_in: { label: 'Walk-in' },
}

const slaConfig = {
  on_track: { label: 'On Track', color: 'bg-emerald-500/15 text-emerald-200' },
  at_risk: { label: 'At Risk', color: 'bg-amber-500/20 text-amber-200' },
  breached: { label: 'Breached', color: 'bg-rose-500/20 text-rose-100' },
}

export default function InquiryList({
  filteredInquiries = [],
  loading = false,
  onViewDetails,
  searchInquiry,
  setSearchInquiry,
  searchCustomer,
  setSearchCustomer,
  searchSalesPerson,
  setSearchSalesPerson,
  filters,
  setFilters,
  isAnyFilterApplied,
  clearAllFilters,
  activeTab,
  setActiveTab,
  counts = {},
  loadingDetail = false
}) {
  const getInitials = (name) => {
    if (!name) return 'UN'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <div className="card-surface shadow-card overflow-hidden">
      <div className="p-4 md:p-6 border-b border-[var(--border)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <h3 className="text-lg md:text-xl font-bold text-[oklch(0.96_0_0)]">Inquiry List</h3>
          <div className="flex items-center gap-2 w-full md:w-auto">
            {isAnyFilterApplied() && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border)] bg-[oklch(0.22_0_0)] hover:bg-[oklch(0.24_0_0)] text-[oklch(0.92_0_0)] text-sm transition-all"
                title="Clear all filters"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 md:gap-2 border-b border-[var(--border)] overflow-x-auto custom-scrollbar pb-px">
          {[
            { id: 'all', label: `All (${counts.all})` },
            { id: 'pending', label: `Pending (${counts.pending})` },
            { id: 'follow_up', label: `Follow Up (${counts.follow_up})` },
            { id: 'success', label: `Converted (${counts.success})` },
            { id: 'rejected', label: `Rejected (${counts.rejected})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 md:px-4 py-2 font-medium transition-colors whitespace-nowrap text-xs md:text-sm ${
                activeTab === tab.id
                  ? 'text-[oklch(0.98_0_0)] border-b-2 border-[oklch(0.50_0.18_280)]'
                  : 'text-[oklch(0.70_0_0)] hover:text-[oklch(0.92_0_0)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full min-w-full">
          {/* Header Row */}
          <thead className="bg-[oklch(0.20_0_0)] border-b border-[var(--border)] sticky top-0 z-20">
            <tr>
              <th className="px-3 md:px-4 py-3 text-left text-xs font-semibold text-[oklch(0.85_0_0)] uppercase whitespace-nowrap min-w-[140px]">Inquiry #</th>
              <th className="px-3 md:px-4 py-3 text-left text-xs font-semibold text-[oklch(0.85_0_0)] uppercase whitespace-nowrap min-w-[180px]">Customer</th>
              <th className="px-3 md:px-4 py-3 text-left text-xs font-semibold text-[oklch(0.85_0_0)] uppercase whitespace-nowrap min-w-[120px]">Source</th>
              <th className="px-3 md:px-4 py-3 text-left text-xs font-semibold text-[oklch(0.85_0_0)] uppercase whitespace-nowrap min-w-[120px]">Status</th>
              <th className="px-3 md:px-4 py-3 text-left text-xs font-semibold text-[oklch(0.85_0_0)] uppercase whitespace-nowrap min-w-[110px]">SLA</th>
              <th className="px-3 md:px-4 py-3 text-left text-xs font-semibold text-[oklch(0.85_0_0)] uppercase whitespace-nowrap min-w-[140px]">Assigned To</th>
              <th className="px-3 md:px-4 py-3 text-left text-xs font-semibold text-[oklch(0.85_0_0)] uppercase whitespace-nowrap min-w-[130px]">Date</th>
              <th className="px-3 md:px-4 py-3 text-right text-xs font-semibold text-[oklch(0.85_0_0)] uppercase whitespace-nowrap min-w-[60px]">Actions</th>
            </tr>
            {/* Filter Row */}
            <tr className="bg-[oklch(0.22_0_0)] border-b border-[var(--border)]">
              <td className="px-3 md:px-4 py-2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchInquiry}
                  onChange={(e) => setSearchInquiry(e.target.value)}
                  className="w-full px-2 py-1 text-xs input-surface focus:outline-none focus:ring-1 focus:ring-[oklch(0.50_0.18_280)] rounded"
                />
              </td>
              <td className="px-3 md:px-4 py-2">
                <input
                  type="text"
                  placeholder="Search customer..."
                  value={searchCustomer}
                  onChange={(e) => setSearchCustomer(e.target.value)}
                  className="w-full px-2 py-1 text-xs input-surface focus:outline-none focus:ring-1 focus:ring-[oklch(0.50_0.18_280)] rounded"
                />
              </td>
              <td className="px-3 md:px-4 py-2">
                <select
                  value={filters.source}
                  onChange={(e) => setFilters({ ...filters, source: e.target.value })}
                  className="w-full px-2 py-1 text-xs input-surface focus:outline-none focus:ring-1 focus:ring-[oklch(0.50_0.18_280)] rounded"
                >
                  <option value="">All</option>
                  <option value={INQUIRY_SOURCE.WHATSAPP}>WhatsApp</option>
                  <option value={INQUIRY_SOURCE.EMAIL}>Email</option>
                  <option value={INQUIRY_SOURCE.PHONE}>Phone</option>
                  <option value={INQUIRY_SOURCE.PORTAL}>Portal</option>
                  <option value={INQUIRY_SOURCE.WALK_IN}>Walk-in</option>
                </select>
              </td>
              <td className="px-3 md:px-4 py-2">
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full px-2 py-1 text-xs input-surface focus:outline-none focus:ring-1 focus:ring-[oklch(0.50_0.18_280)] rounded"
                >
                  <option value="">All</option>
                  <option value={INQUIRY_STATUS.NEW}>New</option>
                  <option value={INQUIRY_STATUS.PARSED}>Parsed</option>
                  <option value={INQUIRY_STATUS.PI_SENT}>PI Sent</option>
                  <option value={INQUIRY_STATUS.FOLLOW_UP}>Follow Up</option>
                  <option value={INQUIRY_STATUS.CONVERTED}>Converted</option>
                  <option value={INQUIRY_STATUS.REJECTED}>Rejected</option>
                </select>
              </td>
              <td className="px-3 md:px-4 py-2">
                <select
                  value={filters.sla}
                  onChange={(e) => setFilters({ ...filters, sla: e.target.value })}
                  className="w-full px-2 py-1 text-xs input-surface focus:outline-none focus:ring-1 focus:ring-[oklch(0.50_0.18_280)] rounded"
                >
                  <option value="">All</option>
                  <option value={SLA_STATUS.ON_TRACK}>On Track</option>
                  <option value={SLA_STATUS.AT_RISK}>At Risk</option>
                  <option value={SLA_STATUS.BREACHED}>Breached</option>
                </select>
              </td>
              <td className="px-3 md:px-4 py-2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchSalesPerson}
                  onChange={(e) => setSearchSalesPerson(e.target.value)}
                  className="w-full px-2 py-1 text-xs input-surface focus:outline-none focus:ring-1 focus:ring-[oklch(0.50_0.18_280)] rounded"
                />
              </td>
              <td className="px-3 md:px-4 py-2">
                <div className="flex gap-1">
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                    className="flex-1 px-2 py-1 text-xs input-surface focus:outline-none focus:ring-1 focus:ring-[oklch(0.50_0.18_280)] rounded"
                    title="From date"
                  />
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                    className="flex-1 px-2 py-1 text-xs input-surface focus:outline-none focus:ring-1 focus:ring-[oklch(0.50_0.18_280)] rounded"
                    title="To date"
                  />
                </div>
              </td>
              <td className="px-3 md:px-4 py-2"></td>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-[oklch(0.70_0_0)]">
                  Loading...
                </td>
              </tr>
            ) : filteredInquiries.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-[oklch(0.70_0_0)]">
                  No inquiries found
                </td>
              </tr>
            ) : (
              filteredInquiries.map((inq) => {
                const status = statusConfig[inq.status] || statusConfig.new
                const source = sourceConfig[inq.source] || sourceConfig.whatsapp
                const sla = slaConfig[inq.slaStatus] || slaConfig.on_track
                const initials = getInitials(inq.customerName)

                return (
                  <tr key={inq.id} className="hover:bg-[oklch(0.24_0_0)] transition-colors">
                    <td className="px-3 md:px-4 py-3 md:py-4">
                      <div className="font-mono text-xs md:text-sm font-semibold text-[oklch(0.90_0_0)] whitespace-nowrap">{inq.inquiryNumber}</div>
                    </td>
                    <td className="px-3 md:px-4 py-3 md:py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[oklch(0.28_0_0)] text-[oklch(0.98_0_0)] flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-xs md:text-sm text-[oklch(0.95_0_0)] truncate">{inq.customerName || 'Unknown'}</div>
                          <div className="text-xs text-[oklch(0.70_0_0)] truncate">
                            {inq.customerPhone || inq.customerEmail || '-'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 md:px-4 py-3 md:py-4">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[oklch(0.26_0_0)] text-[oklch(0.90_0_0)] text-xs font-medium whitespace-nowrap">
                        {source.label}
                      </span>
                    </td>
                    <td className="px-3 md:px-4 py-3 md:py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-3 md:px-4 py-3 md:py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap ${sla.color}`}>
                        {sla.label}
                      </span>
                    </td>
                    <td className="px-3 md:px-4 py-3 md:py-4">
                      <span className="text-xs md:text-sm text-[oklch(0.78_0_0)] truncate block">{inq.assignedSalesPerson || '-'}</span>
                    </td>
                    <td className="px-3 md:px-4 py-3 md:py-4">
                      <div className="text-xs md:text-sm text-[oklch(0.78_0_0)] whitespace-nowrap">
                        {new Date(inq.inquiryDateTime || inq.createdAt).toLocaleDateString('en-IN')}
                      </div>
                    </td>
                    <td className="px-3 md:px-4 py-3 md:py-4 text-right">
                      <button
                        onClick={() => onViewDetails(inq)}
                        disabled={loadingDetail}
                        className="text-[oklch(0.90_0_0)] hover:text-[oklch(0.98_0_0)] hover:bg-[oklch(0.28_0_0)] p-1.5 rounded-lg transition-colors flex-shrink-0"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
