export const inquiryColumns = [
//   { 
//     key: 'inquiryNumber', 
//     label: 'Inquiry #', 
//     minWidth: 'min-w-[160px]', 
//     filterType: 'text', 
//     filterable: true,
//     render: (value) => (
//       <span className="font-mono text-xs md:text-sm font-semibold text-[oklch(0.90_0_0)]">
//         {value || '-'}
//       </span>
//     )
//   },
  { 
    key: 'customerName', 
    label: 'Customer', 
    minWidth: 'min-w-[200px]', 
    filterType: 'text', 
    filterable: true,
    render: (value, row) => {
      const getInitials = (name) => {
        if (!name) return 'UN'
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
      }
      
      const initials = getInitials(value)
      
      return (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="font-medium text-xs md:text-sm text-foreground truncate">
              {value || 'Unknown'}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {row.customerPhone || row.customerEmail || '-'}
            </div>
            {row.productRequested && (
              <div className="text-xs text-muted-foreground truncate mt-0.5">
                {row.productRequested}
              </div>
            )}
          </div>
        </div>
      )
    }
  },
  { 
    key: 'source', 
    label: 'Source', 
    minWidth: 'min-w-[120px]', 
    filterType: 'text', 
    filterable: true,
    render: (value) => {
      const sourceConfig = {
        whatsapp: { label: 'WhatsApp' },
        email: { label: 'Email' },
        phone: { label: 'Phone' },
        portal: { label: 'Portal' },
        walk_in: { label: 'Walk-in' },
      }
      const source = sourceConfig[value?.toLowerCase()] || sourceConfig.whatsapp
      
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-foreground text-xs font-medium whitespace-nowrap">
          {source.label}
        </span>
      )
    }
  },
  { 
    key: 'status', 
    label: 'Status', 
    minWidth: 'min-w-[120px]', 
    filterType: 'select', 
    filterable: true,
    filterOptions: [
      { value: 'OPEN', label: 'Open' },
      { value: 'FOLLOW_UP', label: 'Follow Up' },
      { value: 'CONVERTED', label: 'Converted' },
      { value: 'REJECTED', label: 'Rejected' },
      { value: 'CANCELLED', label: 'Cancelled' }
    ],
    render: (value) => {
      const statusConfig = {
        NEW: { label: 'New', color: 'bg-emerald-500/15 text-foreground' },
        OPEN: { label: 'Open', color: 'bg-emerald-500/15 text-foreground' },
        PARSED: { label: 'Parsed', color: 'bg-indigo-500/15 text-foreground' },
        PI_SENT: { label: 'PI Sent', color: 'bg-cyan-500/15 text-foreground' },
        FOLLOW_UP: { label: 'Follow Up', color: 'bg-amber-500/20 text-foreground' },
        CONVERTED: { label: 'Converted', color: 'bg-emerald-500/20 text-foreground' },
        REJECTED: { label: 'Rejected', color: 'bg-rose-500/20 text-foreground' },
        CANCELLED: { label: 'Cancelled', color: 'bg-rose-500/20 text-foreground' },
      }
      const status = statusConfig[value?.toUpperCase()] || statusConfig.NEW
      
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap ${status.color}`}>
          {status.label}
        </span>
      )
    }
  },
  { 
    key: 'slaStatus', 
    label: 'SLA', 
    minWidth: 'min-w-[110px]', 
    filterType: 'select', 
    filterable: true,
    filterOptions: [
      { value: 'PENDING', label: 'Pending' },
      { value: 'ON_TRACK', label: 'On Track' },
      { value: 'AT_RISK', label: 'At Risk' },
      { value: 'BREACHED', label: 'Breached' }
    ],
    render: (value) => {
      const slaConfig = {
        PENDING: { label: 'Pending', color: 'bg-gray-500/15 text-foreground' },
        ON_TRACK: { label: 'On Track', color: 'bg-emerald-500/15 text-foreground' },
        AT_RISK: { label: 'At Risk', color: 'bg-amber-500/20 text-foreground' },
        BREACHED: { label: 'Breached', color: 'bg-rose-500/20 text-foreground' },
      }
      const sla = slaConfig[value?.toUpperCase()] || slaConfig.PENDING
      
      return (
        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap ${sla.color}`}>
          {sla.label}
        </span>
      )
    }
  },
  { 
    key: 'assignedSalesPerson', 
    label: 'Assigned To', 
    minWidth: 'min-w-[140px]', 
    filterType: 'text', 
    filterable: true,
    render: (value) => (
      <span className="text-xs md:text-sm text-muted-foreground truncate block">
        {value || '-'}
      </span>
    )
  },
  // Updated inquiryDateTime column definition

{
  key: 'inquiryDateTime',
  label: 'Date',
  minWidth: 'min-w-[130px]',
  filterType: 'date',
  filterable: true,
  sortable: true,
  
  // Custom filter predicate to handle ISO date strings
  filterPredicate: (value, filterValue, column) => {
    if (!filterValue || filterValue === '') return true
    if (!value) return false
    
    try {
      // Parse the ISO date string
      const dateObj = new Date(value)
      if (isNaN(dateObj.getTime())) return false
      
      // Format to DD/MM/YYYY for comparison
      const day = String(dateObj.getDate()).padStart(2, '0')
      const month = String(dateObj.getMonth() + 1).padStart(2, '0')
      const year = dateObj.getFullYear()
      const formattedDate = `${day}/${month}/${year}`
      
      // Remove non-digits from filter value for partial matching
      const filterDigits = filterValue.replace(/\D/g, '')
      const dateDigits = formattedDate.replace(/\D/g, '')
      
      // Check if date starts with the filter digits
      return dateDigits.startsWith(filterDigits)
    } catch {
      return false
    }
  },
  
  render: (value, row) => {
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
    
    const getDisplayDate = () => {
      const dateString = value || row.created_at || row.createdAt
      return formatDate(dateString)
    }
    
    return (
      <div className="text-xs md:text-sm text-muted-foreground whitespace-nowrap">
        {getDisplayDate()}
      </div>
    )
  }
}
]

export default inquiryColumns