// src/pages/InquiryList/InquiryList.jsx

import { Eye, X, MessageSquare } from 'lucide-react'
import { DynamicTable } from '../../components/table'
import { inquiryColumns } from './InquiryColums'
import { useMemo } from 'react'

// Status configs (keep these inside component if needed for mobile view)
const statusConfig = {
  NEW: { label: 'New', color: 'bg-emerald-500/20 text-foreground' },
  OPEN: { label: 'Open', color: 'bg-emerald-500/10 text-foreground' },
  PARSED: { label: 'Parsed', color: 'bg-indigo-500/20 text-foreground' },
  PI_SENT: { label: 'PI Sent', color: 'bg-cyan-500/20 text-foreground' },
  FOLLOW_UP: { label: 'Follow Up', color: 'bg-amber-500/20 text-foreground' },
  CONVERTED: { label: 'Converted', color: 'bg-emerald-500/20 text-foreground' },
  REJECTED: { label: 'Rejected', color: 'bg-rose-500/20 text-foreground' },
  CANCELLED: { label: 'Cancelled', color: 'bg-rose-500/20 text-foreground' },
}

const sourceConfig = {
  whatsapp: { label: 'WhatsApp' },
  email: { label: 'Email' },
  phone: { label: 'Phone' },
  portal: { label: 'Portal' },
  walk_in: { label: 'Walk-in' },
}

const slaConfig = {
  PENDING: { label: 'Pending', color: 'bg-gray-500/20 text-foreground' },
  ON_TRACK: { label: 'On Track', color: 'bg-emerald-500/20 text-foreground' },
  AT_RISK: { label: 'At Risk', color: 'bg-amber-500/20 text-foreground' },
  BREACHED: { label: 'Breached', color: 'bg-rose-500/20 text-foreground' },
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
  // Helper function to get status config
  const getStatusConfig = (status) => {
    const statusKey = status?.toUpperCase() || 'NEW'
    return statusConfig[statusKey] || statusConfig.NEW
  }

  // Helper function to get SLA config
  const getSlaConfig = (slaStatus) => {
    const slaKey = slaStatus?.toUpperCase() || 'PENDING'
    return slaConfig[slaKey] || slaConfig.PENDING
  }

  // Helper function to get source config
  const getSourceConfig = (source) => {
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

  // Get initials for customer avatar
  const getInitials = (name) => {
    if (!name) return 'UN'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  // Create custom columns with enhanced filtering capabilities
  const customColumns = useMemo(() => {
    return inquiryColumns.map(col => {
      // Add custom filter rendering based on filterType
      if (col.filterable) {
        return {
          ...col,
          // Override the filter value and onChange for proper integration
          filterValue: (() => {
            switch (col.key) {
              case 'inquiryNumber':
                return searchInquiry
              case 'customerName':
                return searchCustomer
              case 'assignedSalesPerson':
                return searchSalesPerson
              case 'source':
                return filters.source
              case 'status':
                return filters.status
              case 'slaStatus':
                return filters.sla
              case 'inquiryDateTime':
                return { from: filters.dateFrom, to: filters.dateTo }
              default:
                return ''
            }
          })(),
          onFilterChange: (value) => {
            switch (col.key) {
              case 'inquiryNumber':
                setSearchInquiry(value)
                break
              case 'customerName':
                setSearchCustomer(value)
                break
              case 'assignedSalesPerson':
                setSearchSalesPerson(value)
                break
              case 'source':
                setFilters({ ...filters, source: value })
                break
              case 'status':
                setFilters({ ...filters, status: value })
                break
              case 'slaStatus':
                setFilters({ ...filters, sla: value })
                break
              case 'inquiryDateTime':
                if (value.from !== undefined) {
                  setFilters({ ...filters, dateFrom: value.from })
                }
                if (value.to !== undefined) {
                  setFilters({ ...filters, dateTo: value.to })
                }
                break
            }
          },
          filterRender: (columnKey, value, onChange) => {
            switch (col.filterType) {
              case 'text':
                if (columnKey === 'inquiryNumber') {
                  return (
                    <input
                      type="text"
                      placeholder="Search inquiry..."
                      value={searchInquiry}
                      onChange={(e) => setSearchInquiry(e.target.value)}
                      className="w-full px-2 py-1 text-xs input-surface focus:outline-none focus:ring-1 focus:ring-primary rounded"
                    />
                  )
                } else if (columnKey === 'customerName') {
                  return (
                    <input
                      type="text"
                      placeholder="Search customer..."
                      value={searchCustomer}
                      onChange={(e) => setSearchCustomer(e.target.value)}
                      className="w-full px-2 py-1 text-xs input-surface focus:outline-none focus:ring-1 focus:ring-primary rounded"
                    />
                  )
                } else if (columnKey === 'assignedSalesPerson') {
                  return (
                    <input
                      type="text"
                      placeholder="Search salesperson..."
                      value={searchSalesPerson}
                      onChange={(e) => setSearchSalesPerson(e.target.value)}
                      className="w-full px-2 py-1 text-xs input-surface focus:outline-none focus:ring-1 focus:ring-primary rounded"
                    />
                  )
                }
                return null
              
              case 'select':
                if (columnKey === 'source') {
                  return (
                    <select
                      value={filters.source}
                      onChange={(e) => setFilters({ ...filters, source: e.target.value })}
                      className="w-full px-2 py-1 text-xs input-surface focus:outline-none focus:ring-1 focus:ring-primary rounded"
                    >
                      <option value="">All Sources</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="portal">Portal</option>
                      <option value="walk_in">Walk-in</option>
                    </select>
                  )
                } else if (columnKey === 'status') {
                  return (
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                      className="w-full px-2 py-1 text-xs input-surface focus:outline-none focus:ring-1 focus:ring-primary rounded"
                    >
                      <option value="">All Status</option>
                      <option value="NEW">New</option>
                      <option value="OPEN">Open</option>
                      <option value="PARSED">Parsed</option>
                      <option value="PI_SENT">PI Sent</option>
                      <option value="FOLLOW_UP">Follow Up</option>
                      <option value="CONVERTED">Converted</option>
                      <option value="REJECTED">Rejected</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  )
                } else if (columnKey === 'slaStatus') {
                  return (
                    <select
                      value={filters.sla}
                      onChange={(e) => setFilters({ ...filters, sla: e.target.value })}
                      className="w-full px-2 py-1 text-xs input-surface focus:outline-none focus:ring-1 focus:ring-primary rounded"
                    >
                      <option value="">All SLA</option>
                      <option value="PENDING">Pending</option>
                      <option value="ON_TRACK">On Track</option>
                      <option value="AT_RISK">At Risk</option>
                      <option value="BREACHED">Breached</option>
                    </select>
                  )
                }
                return null
              
              case 'date':
                return (
                  <div className="flex gap-1">
                    <input
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                      className="flex-1 px-2 py-1 text-xs input-surface focus:outline-none focus:ring-1 focus:ring-primary rounded"
                      placeholder="From"
                      title="From date"
                    />
                    <input
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                      className="flex-1 px-2 py-1 text-xs input-surface focus:outline-none focus:ring-1 focus:ring-primary rounded"
                      placeholder="To"
                      title="To date"
                    />
                  </div>
                )
              
              default:
                return null
            }
          }
        }
      }
      return col
    })
  }, [
    searchInquiry, 
    searchCustomer, 
    searchSalesPerson, 
    filters, 
    setFilters, 
    setSearchInquiry, 
    setSearchCustomer, 
    setSearchSalesPerson
  ])

  // Mobile card render function
  const renderMobileCard = (inq) => {
    const status = getStatusConfig(inq.status)
    const source = getSourceConfig(inq.source)
    const sla = getSlaConfig(inq.slaStatus)
    const initials = getInitials(inq.customerName)
    const displayDate = formatDate(getDisplayDate(inq))

    return (
      <div
        key={inq.id}
        className="bg-background border border-[var(--border)] rounded-lg p-4 space-y-3 hover:bg-card transition-colors"
      >
        {/* Header Row */}
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <div className="font-mono text-sm font-bold text-foreground truncate">
              {inq.inquiryNumber || inq.inquiry_code || '-'}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-8 h-8 rounded-full bg-secondary text-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-sm text-muted-foreground truncate">
                  {inq.customerName || inq.customer_name || 'Unknown'}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {inq.customerPhone || inq.customerEmail || '-'}
                </div>
                {inq.productRequested && (
                  <div className="text-xs text-muted-foreground truncate mt-0.5">
                    {inq.productRequested}
                  </div>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => onViewDetails(inq)}
            disabled={loadingDetail}
            className="text-foreground hover:text-foreground hover:bg-secondary p-2 rounded-lg transition-colors flex-shrink-0"
            title="View details"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-foreground text-xs font-medium">
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
            <div className="text-xs text-muted-foreground mb-0.5">Assigned To</div>
            <div className="text-foreground truncate">
              {inq.assignedSalesPerson || inq.assigned_user_name || '-'}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-0.5">Date</div>
            <div className="text-foreground">
              {displayDate}
            </div>
          </div>
          {/* Show expected price if available */}
          {inq.expectedPrice && (
            <div className="col-span-2">
              <div className="text-xs text-muted-foreground mb-0.5">Expected Price</div>
              <div className="text-foreground">
                ₹{parseFloat(inq.expectedPrice).toLocaleString('en-IN')}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="text-foreground w-full h-screen overflow-hidden flex flex-col px-3 sm:px-4 lg:px-8">
      {/* Header */}
      <div className="pt-2 pb-3 sm:pb-4 flex-shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-foreground">Inquiry List</h1>
            </div>
          </div>
          {isAnyFilterApplied && isAnyFilterApplied() && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card hover:bg-accent text-foreground text-sm transition-all"
              title="Clear all filters"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 md:gap-2 border-b border-border overflow-x-auto custom-scrollbar pb-px mb-4 flex-shrink-0">
        {[
          { id: 'all', label: `All (${counts.all || 0})` },
          { id: 'pending', label: `Pending (${counts.pending || 0})` },
          { id: 'follow_up', label: `Follow Up (${counts.follow_up || 0})` },
          { id: 'success', label: `Converted (${counts.success || 0})` },
          { id: 'rejected', label: `Rejected (${counts.rejected || 0})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 md:px-4 py-2 font-medium transition-colors whitespace-nowrap text-xs md:text-sm ${
              activeTab === tab.id
                ? 'text-foreground border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Inquiry List Table - Desktop */}
      <div className="flex-1 min-h-0 flex flex-col hidden sm:flex">
        <DynamicTable
          title="Inquiries"
          columns={customColumns}
          rows={filteredInquiries}
          loading={loading}
          defaultVisibleCount={10}
          heightClass="h-full"
          showFilterRow={true}
          renderActions={(row) => (
            <button
              onClick={() => onViewDetails(row)}
              disabled={loadingDetail}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-input text-foreground border border-[var(--border)] rounded-lg text-xs font-semibold hover:bg-accent transition-all whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Eye className="w-4 h-4" aria-hidden="true" />
              <span>View</span>
            </button>
          )}
        />
      </div>

      {/* Mobile Card View */}
      <div className="flex-1 min-h-0 flex flex-col overflow-y-auto sm:hidden px-2">
        {loading ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Loading inquiries...
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No inquiries found
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 py-3">
            {filteredInquiries.map(renderMobileCard)}
          </div>
        )}
      </div>
    </div>
  )
}