import { Eye, X } from 'lucide-react'
import { INQUIRY_STATUS, INQUIRY_SOURCE, SLA_STATUS } from '../../types/inquiry'

const statusConfig = {
  // Update status keys to match backend values
  NEW: { label: 'New', color: 'bg-emerald-500/15 text-emerald-200' },
  OPEN: { label: 'Open', color: 'bg-emerald-500/15 text-emerald-200' },
  PARSED: { label: 'Parsed', color: 'bg-indigo-500/15 text-indigo-200' },
  PI_SENT: { label: 'PI Sent', color: 'bg-cyan-500/15 text-cyan-200' },
  FOLLOW_UP: { label: 'Follow Up', color: 'bg-amber-500/20 text-amber-200' },
  CONVERTED: { label: 'Converted', color: 'bg-emerald-500/20 text-emerald-100' },
  REJECTED: { label: 'Rejected', color: 'bg-rose-500/20 text-rose-100' },
  CANCELLED: { label: 'cancelled', color: 'bg-rose-500/20 text-rose-100' },
}

const sourceConfig = {
  whatsapp: { label: 'WhatsApp' },
  email: { label: 'Email' },
  phone: { label: 'Phone' },
  portal: { label: 'Portal' },
  walk_in: { label: 'Walk-in' },
}

const slaConfig = {
  PENDING: { label: 'Pending', color: 'bg-gray-500/15 text-gray-200' },
  ON_TRACK: { label: 'On Track', color: 'bg-emerald-500/15 text-emerald-200' },
  AT_RISK: { label: 'At Risk', color: 'bg-amber-500/20 text-amber-200' },
  BREACHED: { label: 'Breached', color: 'bg-rose-500/20 text-rose-100' },
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

  // Helper function to get status config
  const getStatusConfig = (status) => {
    // Handle both uppercase and lowercase status
    const statusKey = status?.toUpperCase() || 'NEW'
    return statusConfig[statusKey] || statusConfig.NEW
  }

  // Helper function to get SLA config
  const getSlaConfig = (slaStatus) => {
    // Handle both uppercase and lowercase sla status
    const slaKey = slaStatus?.toUpperCase() || 'PENDING'
    return slaConfig[slaKey] || slaConfig.PENDING
  }

  // Helper function to get source config
  const getSourceConfig = (source) => {
    // Your backend data will be lowercase due to transformation
    const sourceKey = source?.toLowerCase() || 'whatsapp'
    return sourceConfig[sourceKey] || sourceConfig.whatsapp
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    } catch {
      return 'Invalid Date'
    }
  }

  // Get appropriate date for display
  const getDisplayDate = (inq) => {
    return inq.inquiryDateTime || inq.created_at || inq.createdAt
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
        {/* Desktop Table View - Hidden on Mobile */}
        <div className="hidden md:block overflow-x-auto custom-scrollbar max-h-[600px]">
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
                  <option value="whatsapp">WhatsApp</option>
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="portal">Portal</option>
                  <option value="walk_in">Walk-in</option>
                </select>
              </td>
              <td className="px-3 md:px-4 py-2">
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full px-2 py-1 text-xs input-surface focus:outline-none focus:ring-1 focus:ring-[oklch(0.50_0.18_280)] rounded"
                >
                  <option value="">All</option>
                  {/* <option value="NEW">New</option> */}
                  <option value="OPEN">Open</option>
                  {/* <option value="PARSED">Parsed</option> */}
                  {/* <option value="PI_SENT">PI Sent</option> */}
                  <option value="FOLLOW_UP">Follow Up</option>
                  <option value="CONVERTED">Converted</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </td>
              <td className="px-3 md:px-4 py-2">
                <select
                  value={filters.sla}
                  onChange={(e) => setFilters({ ...filters, sla: e.target.value })}
                  className="w-full px-2 py-1 text-xs input-surface focus:outline-none focus:ring-1 focus:ring-[oklch(0.50_0.18_280)] rounded"
                >
                  <option value="">All</option>
                  <option value="PENDING">Pending</option>
                  <option value="ON_TRACK">On Track</option>
                  <option value="AT_RISK">At Risk</option>
                  <option value="BREACHED">Breached</option>
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
                // Use helper functions to get configs
                const status = getStatusConfig(inq.status)
                const source = getSourceConfig(inq.source)
                const sla = getSlaConfig(inq.slaStatus)
                const initials = getInitials(inq.customerName)
                const displayDate = getDisplayDate(inq)

                return (
                  <tr key={inq.id} className="hover:bg-[oklch(0.24_0_0)] transition-colors">
                    <td className="px-3 md:px-4 py-3 md:py-4">
                      <div className="font-mono text-xs md:text-sm font-semibold text-[oklch(0.90_0_0)] whitespace-nowrap">
                        {inq.inquiryNumber || inq.inquiry_code || '-'}
                      </div>
                    </td>
                    <td className="px-3 md:px-4 py-3 md:py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[oklch(0.28_0_0)] text-[oklch(0.98_0_0)] flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-xs md:text-sm text-[oklch(0.95_0_0)] truncate">
                            {inq.customerName || inq.customer_name || 'Unknown'}
                          </div>
                          <div className="text-xs text-[oklch(0.70_0_0)] truncate">
                            {inq.customerPhone || inq.customerEmail || '-'}
                          </div>
                          {/* Show product if available */}
                          {inq.productRequested && (
                            <div className="text-xs text-[oklch(0.60_0_0)] truncate mt-0.5">
                              {inq.productRequested}
                            </div>
                          )}
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
                      <span className="text-xs md:text-sm text-[oklch(0.78_0_0)] truncate block">
                        {inq.assignedSalesPerson || inq.assigned_user_name || '-'}
                      </span>
                    </td>
                    <td className="px-3 md:px-4 py-3 md:py-4">
                      <div className="text-xs md:text-sm text-[oklch(0.78_0_0)] whitespace-nowrap">
                        {formatDate(displayDate)}
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

        {/* Mobile Card View - Hidden on Desktop */}
        <div className="md:hidden max-h-[600px] overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="px-4 py-12 text-center text-[oklch(0.70_0_0)]">
              Loading...
            </div>
          ) : filteredInquiries.length === 0 ? (
            <div className="px-4 py-12 text-center text-[oklch(0.70_0_0)]">
              No inquiries found
            </div>
          ) : (
            <div className="p-3 space-y-3">
              {filteredInquiries.map((inq) => {
                const status = getStatusConfig(inq.status)
                const source = getSourceConfig(inq.source)
                const sla = getSlaConfig(inq.slaStatus)
                const initials = getInitials(inq.customerName)
                const displayDate = getDisplayDate(inq)

                return (
                  <div
                    key={inq.id}
                    className="bg-[oklch(0.18_0_0)] border border-[var(--border)] rounded-lg p-4 space-y-3 hover:bg-[oklch(0.22_0_0)] transition-colors"
                  >
                    {/* Header Row */}
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-sm font-bold text-[oklch(0.92_0_0)] truncate">
                          {inq.inquiryNumber || inq.inquiry_code || '-'}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="w-8 h-8 rounded-full bg-[oklch(0.28_0_0)] text-[oklch(0.98_0_0)] flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {initials}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-sm text-[oklch(0.95_0_0)] truncate">
                              {inq.customerName || inq.customer_name || 'Unknown'}
                            </div>
                            <div className="text-xs text-[oklch(0.70_0_0)] truncate">
                              {inq.customerPhone || inq.customerEmail || '-'}
                            </div>
                            {inq.productRequested && (
                              <div className="text-xs text-[oklch(0.60_0_0)] truncate mt-0.5">
                                {inq.productRequested}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => onViewDetails(inq)}
                        disabled={loadingDetail}
                        className="text-[oklch(0.90_0_0)] hover:text-[oklch(0.98_0_0)] hover:bg-[oklch(0.28_0_0)] p-2 rounded-lg transition-colors flex-shrink-0"
                        title="View details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[oklch(0.26_0_0)] text-[oklch(0.90_0_0)] text-xs font-medium">
                        {source.label}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${status.color}`}>
                        {status.label}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${sla.color}`}>
                        {sla.label}
                      </span>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3 text-sm pt-2 border-t border-[var(--border)]">
                      <div>
                        <div className="text-xs text-[oklch(0.65_0_0)] mb-0.5">Assigned To</div>
                        <div className="text-[oklch(0.88_0_0)] truncate">
                          {inq.assignedSalesPerson || inq.assigned_user_name || '-'}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-[oklch(0.65_0_0)] mb-0.5">Date</div>
                        <div className="text-[oklch(0.88_0_0)]">
                          {formatDate(displayDate)}
                        </div>
                      </div>
                      {/* Show expected price if available */}
                      {inq.expectedPrice && (
                        <div className="col-span-2">
                          <div className="text-xs text-[oklch(0.65_0_0)] mb-0.5">Expected Price</div>
                          <div className="text-[oklch(0.88_0_0)]">
                            ₹{parseFloat(inq.expectedPrice).toLocaleString('en-IN')}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}