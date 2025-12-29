import { useState, useEffect } from 'react'
import { inquiryService } from '../../services/inquiryService'
import { INQUIRY_STATUS, INQUIRY_SOURCE, SLA_STATUS } from '../../types/inquiry'
import { 
  Plus, 
  Search, 
  MessageSquare, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle,
  XCircle,
  X,
  Eye,
  RefreshCw,
  User,
  MapPin,
  Building2,
  Package,
  Calendar,
  FileText,
  UserCircle,
  Link as LinkIcon,
  SlidersHorizontal
} from 'lucide-react'

// Status configuration
const statusConfig = {
  new: { label: 'New', color: 'bg-emerald-500/15 text-emerald-200', icon: MessageSquare },
  parsed: { label: 'Parsed', color: 'bg-indigo-500/15 text-indigo-200', icon: RefreshCw },
  pi_sent: { label: 'PI Sent', color: 'bg-cyan-500/15 text-cyan-200', icon: Mail },
  follow_up: { label: 'Follow Up', color: 'bg-amber-500/20 text-amber-200', icon: Clock },
  converted: { label: 'Converted', color: 'bg-emerald-500/20 text-emerald-100', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'bg-rose-500/20 text-rose-100', icon: XCircle },
  // Legacy support
  draft: { label: 'Draft', color: 'bg-zinc-500/20 text-zinc-200', icon: MessageSquare },
  pending: { label: 'Pending', color: 'bg-amber-500/20 text-amber-200', icon: Clock },
  approved: { label: 'Approved', color: 'bg-emerald-500/20 text-emerald-100', icon: CheckCircle },
  completed: { label: 'Completed', color: 'bg-sky-500/20 text-sky-100', icon: CheckCircle },
}

const sourceConfig = {
  whatsapp: { label: 'WhatsApp', icon: MessageSquare },
  email: { label: 'Email', icon: Mail },
  phone: { label: 'Phone', icon: Phone },
  portal: { label: 'Portal', icon: MessageSquare },
  walk_in: { label: 'Walk-in', icon: MessageSquare },
}

const slaConfig = {
  on_track: { label: 'On Track', color: 'bg-emerald-500/15 text-emerald-200' },
  at_risk: { label: 'At Risk', color: 'bg-amber-500/20 text-amber-200' },
  breached: { label: 'Breached', color: 'bg-rose-500/20 text-rose-100' },
}

export default function Inquiry() {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [showNewDialog, setShowNewDialog] = useState(false)
  const [selectedInquiry, setSelectedInquiry] = useState(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    source: '',
    status: '',
    sla: '',
    dateFrom: '',
    dateTo: '',
  })
  const [interactions, setInteractions] = useState([])
  const [showInteractionForm, setShowInteractionForm] = useState(false)
  const [interactionForm, setInteractionForm] = useState({
    type: '',
    outcome: '',
    summary: '',
    followUpRequired: false,
    followUpDateTime: '',
    followUpStatus: 'pending'
  })
  const [formData, setFormData] = useState({
    source: INQUIRY_SOURCE.WHATSAPP,
    sourceReference: '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerPONumber: '',
    expectedDeliveryDate: '',
    expectedPrice: '',
    specialInstructions: '',
    rawMessage: '',
    assignedSalesPerson: '',
  })

  useEffect(() => {
    fetchInquiries()
  }, [])

  const fetchInquiries = async () => {
    try {
      setLoading(true)
      const data = await inquiryService.getAll()
      // Transform legacy data to new format
      const transformedData = data.map(inq => ({
        ...inq,
        source: inq.source || INQUIRY_SOURCE.WHATSAPP,
        customerName: inq.customerName || inq.companyName || '',
        customerPhone: inq.customerPhone || inq.phone || '',
        customerEmail: inq.customerEmail || inq.email || '',
        inquiryDateTime: inq.inquiryDateTime || inq.createdAt,
        slaStatus: inq.slaStatus || SLA_STATUS.ON_TRACK,
        status: inq.status || INQUIRY_STATUS.NEW,
      }))
      setInquiries(transformedData)
    } catch (error) {
      console.error('Failed to fetch inquiries:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = async (inquiry) => {
    try {
      setLoadingDetail(true)
      const data = await inquiryService.getById(inquiry.id)
      if (data) {
        const transformed = {
          ...data,
          source: data.source || INQUIRY_SOURCE.WHATSAPP,
          customerName: data.customerName || data.companyName || '',
          customerPhone: data.customerPhone || data.phone || '',
          customerEmail: data.customerEmail || data.email || '',
          inquiryDateTime: data.inquiryDateTime || data.createdAt,
          slaStatus: data.slaStatus || SLA_STATUS.ON_TRACK,
          // Additional fields with defaults
          linkedOrderId: data.linkedOrderId || null,
          customerId: data.customerId || null,
          customerPOC: data.customerPOC || null,
          customerWhatsapp: data.customerWhatsapp || data.customerPhone || null,
          customerAddress: data.customerAddress || null,
          preferredContactMethod: data.preferredContactMethod || 'whatsapp',
          productRequested: data.productRequested || null,
          isWithinWorkingHours: data.isWithinWorkingHours !== undefined ? data.isWithinWorkingHours : true,
          interactionDueTime: data.interactionDueTime || null,
        }
        setSelectedInquiry(transformed)
        // Load interactions (mock data for now)
        setInteractions(data.interactions || [
          {
            id: 1,
            type: 'Call',
            dateTime: new Date().toISOString(),
            outcome: 'Customer Interested',
            summary: 'Discussed product requirements and pricing',
            followUpRequired: true,
            followUpDateTime: new Date(Date.now() + 86400000).toISOString(),
            followUpStatus: 'pending'
          }
        ])
        setShowDetailDialog(true)
      }
    } catch (error) {
      console.error('Failed to fetch inquiry details:', error)
    } finally {
      setLoadingDetail(false)
    }
  }

  const handleAddInteraction = () => {
    if (!interactionForm.type || !interactionForm.outcome || !interactionForm.summary) {
      alert('Please fill all required fields')
      return
    }

    const newInteraction = {
      id: interactions.length + 1,
      type: interactionForm.type,
      dateTime: new Date().toISOString(),
      outcome: interactionForm.outcome,
      summary: interactionForm.summary,
      followUpRequired: interactionForm.followUpRequired,
      followUpDateTime: interactionForm.followUpRequired ? interactionForm.followUpDateTime : null,
      followUpStatus: interactionForm.followUpRequired ? interactionForm.followUpStatus : null
    }

    setInteractions([...interactions, newInteraction])
    setInteractionForm({
      type: '',
      outcome: '',
      summary: '',
      followUpRequired: false,
      followUpDateTime: '',
      followUpStatus: 'pending'
    })
    setShowInteractionForm(false)
  }

  const handleCreate = async () => {
    if (!formData.customerName && !formData.customerPhone && !formData.customerEmail) {
      alert('At least one customer contact is required')
      return
    }

    try {
      const newInquiry = {
        source: formData.source,
        sourceReference: formData.sourceReference || null,
        customerName: formData.customerName || null,
        customerPhone: formData.customerPhone || null,
        customerEmail: formData.customerEmail || null,
        customerPONumber: formData.customerPONumber || null,
        expectedDeliveryDate: formData.expectedDeliveryDate || null,
        expectedPrice: formData.expectedPrice ? parseFloat(formData.expectedPrice) : null,
        specialInstructions: formData.specialInstructions || null,
        rawMessage: formData.rawMessage || null,
        assignedSalesPerson: formData.assignedSalesPerson || null,
        status: INQUIRY_STATUS.NEW,
      }

      await inquiryService.create(newInquiry)
      setShowNewDialog(false)
      setFormData({
        source: INQUIRY_SOURCE.WHATSAPP,
        sourceReference: '',
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        customerPONumber: '',
        expectedDeliveryDate: '',
        expectedPrice: '',
        specialInstructions: '',
        rawMessage: '',
        assignedSalesPerson: '',
      })
      fetchInquiries()
    } catch (error) {
      console.error('Error creating inquiry:', error)
      alert('Failed to create inquiry')
    }
  }

  const getFilteredInquiries = () => {
    let filtered = inquiries

    // Filter by search
    if (searchTerm) {
      filtered = filtered.filter(inq =>
        inq.inquiryNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inq.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inq.customerPhone?.includes(searchTerm) ||
        inq.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by explicit filters
    if (filters.source) {
      filtered = filtered.filter(inq => (inq.source || '').toLowerCase() === filters.source.toLowerCase())
    }
    if (filters.status) {
      filtered = filtered.filter(inq => (inq.status || '') === filters.status)
    }
    if (filters.sla) {
      filtered = filtered.filter(inq => (inq.slaStatus || '') === filters.sla)
    }
    if (filters.dateFrom) {
      const from = new Date(filters.dateFrom)
      filtered = filtered.filter(inq => new Date(inq.inquiryDateTime || inq.createdAt) >= from)
    }
    if (filters.dateTo) {
      const to = new Date(filters.dateTo)
      to.setHours(23,59,59,999)
      filtered = filtered.filter(inq => new Date(inq.inquiryDateTime || inq.createdAt) <= to)
    }

    // Filter by tab
    if (activeTab !== 'all') {
      if (activeTab === 'pending') {
        filtered = filtered.filter(inq => ['new', 'parsed'].includes(inq.status))
      } else if (activeTab === 'success') {
        filtered = filtered.filter(inq => inq.status === 'converted')
      } else if (activeTab === 'rejected') {
        filtered = filtered.filter(inq => inq.status === 'rejected')
      } else if (activeTab === 'follow_up') {
        filtered = filtered.filter(inq => inq.status === 'follow_up')
      }
    }

    return filtered
  }

  const filteredInquiries = getFilteredInquiries()

  const counts = {
    all: inquiries.length,
    pending: inquiries.filter(inq => ['new', 'parsed'].includes(inq.status)).length,
    success: inquiries.filter(inq => inq.status === 'converted').length,
    rejected: inquiries.filter(inq => inq.status === 'rejected').length,
    follow_up: inquiries.filter(inq => inq.status === 'follow_up').length,
  }

  const getInitials = (name) => {
    if (!name) return 'UN'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <div className="space-y-6 pb-10 text-[oklch(0.95_0_0)] max-w-[1600px]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg gradient-primary shadow-glow text-[oklch(0.98_0_0)]">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[oklch(0.98_0_0)]">Inquiries</h2>
          </div>
          <p className="text-[oklch(0.70_0_0)] text-sm md:text-base">
            Track and manage customer inquiries from all sources
          </p>
          <div className="flex items-center gap-2 mt-2 text-xs text-[oklch(0.65_0_0)]">
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 bg-indigo-400 rounded-sm"></span>
              Showing data from all companies
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowNewDialog(true)}
          className="flex items-center gap-2 gradient-primary text-[oklch(0.98_0_0)] px-5 py-2.5 rounded-lg font-semibold shadow-glow hover:opacity-90 transition text-sm md:text-base whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          New Inquiry
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 md:gap-4 grid-cols-2 md:grid-cols-5">
        {[
          { label: 'Total', value: counts.all, color: 'text-[oklch(0.96_0_0)]' },
          { label: 'Pending', value: counts.pending, color: 'text-sky-300' },
          { label: 'Follow Up', value: counts.follow_up, color: 'text-amber-300' },
          { label: 'Converted', value: counts.success, color: 'text-emerald-300' },
          { label: 'Rejected', value: counts.rejected, color: 'text-rose-300' },
        ].map((stat) => (
          <div key={stat.label} className="card-surface shadow-card-hover p-4 md:p-6">
            <div className="text-xs md:text-sm font-medium text-[oklch(0.70_0_0)] mb-1">{stat.label}</div>
            <div className={`text-xl md:text-2xl font-bold ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="card-surface shadow-card overflow-hidden">
        <div className="p-4 md:p-6 border-b border-[var(--border)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <h3 className="text-lg md:text-xl font-bold text-[oklch(0.96_0_0)]">Inquiry List</h3>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <button
                onClick={() => setShowFilters(v => !v)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border)] bg-[oklch(0.22_0_0)] hover:bg-[oklch(0.24_0_0)] text-[oklch(0.92_0_0)] text-sm"
                aria-expanded={showFilters}
                aria-controls="inquiry-filters"
                title="Toggle filters"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-[oklch(0.60_0_0)]" />
                <input
                  type="text"
                  placeholder="Search inquiries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] text-sm"
                />
              </div>
            </div>
          </div>

          {showFilters && (
            <div id="inquiry-filters" className="card-surface p-3 md:p-4 rounded-lg mb-4">
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
                <div>
                  <label className="block text-xs font-medium text-[oklch(0.70_0_0)] mb-1">Source</label>
                  <select
                    value={filters.source}
                    onChange={(e) => setFilters({ ...filters, source: e.target.value })}
                    className="w-full px-3 py-2 input-surface text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                  >
                    <option value="">All</option>
                    <option value={INQUIRY_SOURCE.WHATSAPP}>WhatsApp</option>
                    <option value={INQUIRY_SOURCE.EMAIL}>Email</option>
                    <option value={INQUIRY_SOURCE.PHONE}>Phone</option>
                    <option value={INQUIRY_SOURCE.PORTAL}>Portal</option>
                    <option value={INQUIRY_SOURCE.WALK_IN}>Walk-in</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[oklch(0.70_0_0)] mb-1">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="w-full px-3 py-2 input-surface text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                  >
                    <option value="">All</option>
                    <option value={INQUIRY_STATUS.NEW}>New</option>
                    <option value={INQUIRY_STATUS.PARSED}>Parsed</option>
                    <option value={INQUIRY_STATUS.PI_SENT}>PI Sent</option>
                    <option value={INQUIRY_STATUS.FOLLOW_UP}>Follow Up</option>
                    <option value={INQUIRY_STATUS.CONVERTED}>Converted</option>
                    <option value={INQUIRY_STATUS.REJECTED}>Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[oklch(0.70_0_0)] mb-1">SLA</label>
                  <select
                    value={filters.sla}
                    onChange={(e) => setFilters({ ...filters, sla: e.target.value })}
                    className="w-full px-3 py-2 input-surface text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                  >
                    <option value="">All</option>
                    <option value={SLA_STATUS.ON_TRACK}>On Track</option>
                    <option value={SLA_STATUS.AT_RISK}>At Risk</option>
                    <option value={SLA_STATUS.BREACHED}>Breached</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[oklch(0.70_0_0)] mb-1">From</label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                    className="w-full px-3 py-2 input-surface text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[oklch(0.70_0_0)] mb-1">To</label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                    className="w-full px-3 py-2 input-surface text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={() => setFilters({ source: '', status: '', sla: '', dateFrom: '', dateTo: '' })}
                  className="px-3 py-2 border border-[var(--border)] rounded-lg text-sm text-[oklch(0.90_0_0)] hover:bg-[oklch(0.24_0_0)]"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

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
          <table className="w-full min-w-[900px]">
            <thead className="bg-[oklch(0.20_0_0)] border-b border-[var(--border)]">
              <tr>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-[oklch(0.85_0_0)] uppercase">Inquiry</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-[oklch(0.85_0_0)] uppercase">Customer</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-[oklch(0.85_0_0)] uppercase">Source</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-[oklch(0.85_0_0)] uppercase">Status</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-[oklch(0.85_0_0)] uppercase">SLA</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-[oklch(0.85_0_0)] uppercase">Assigned To</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-[oklch(0.85_0_0)] uppercase">Date</th>
                <th className="px-4 md:px-6 py-3 text-right text-xs font-semibold text-[oklch(0.85_0_0)] uppercase">Actions</th>
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
                  const StatusIcon = status.icon
                  const SourceIcon = source.icon
                  const initials = getInitials(inq.customerName)

                  return (
                    <tr key={inq.id} className="hover:bg-[oklch(0.24_0_0)] transition-colors">
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <div className="font-mono text-xs md:text-sm font-semibold text-[oklch(0.90_0_0)]">{inq.inquiryNumber}</div>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <div className="flex items-center gap-2 md:gap-3">
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
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[oklch(0.26_0_0)] text-[oklch(0.90_0_0)] text-xs font-medium">
                          <SourceIcon className="w-3 h-3 flex-shrink-0" />
                          <span className="hidden md:inline">{source.label}</span>
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${status.color}`}>
                          <StatusIcon className="w-3 h-3 flex-shrink-0" />
                          <span className="hidden sm:inline">{status.label}</span>
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${sla.color}`}>
                          {sla.label}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <span className="text-xs md:text-sm text-[oklch(0.78_0_0)] truncate block">{inq.assignedSalesPerson || '-'}</span>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <div className="text-xs md:text-sm text-[oklch(0.78_0_0)]">
                          {new Date(inq.inquiryDateTime || inq.createdAt).toLocaleDateString('en-IN')}
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4 text-right">
                        <button
                          onClick={() => handleViewDetails(inq)}
                          disabled={loadingDetail}
                          className="text-[oklch(0.90_0_0)] hover:text-[oklch(0.98_0_0)] hover:bg-[oklch(0.28_0_0)] p-1.5 rounded-lg transition-colors"
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

      {/* New Inquiry Dialog */}
      {showNewDialog && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 md:p-4 z-50">
          <div className="bg-[oklch(0.20_0_0)] text-[oklch(0.95_0_0)] rounded-xl shadow-card max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[var(--border)] custom-scrollbar">
            <div className="p-4 md:p-6 border-b border-[var(--border)] sticky top-0 bg-[oklch(0.20_0_0)] z-10">
              <h3 className="text-xl md:text-2xl font-bold">Create New Inquiry</h3>
              <p className="text-[oklch(0.75_0_0)] text-xs md:text-sm mt-1">Log a new customer inquiry</p>
            </div>
            <div className="p-4 md:p-6 space-y-4">
              <div className="grid gap-3 md:gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Source <span className="text-rose-300">*</span>
                  </label>
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                  >
                    <option value={INQUIRY_SOURCE.WHATSAPP}>WhatsApp</option>
                    <option value={INQUIRY_SOURCE.EMAIL}>Email</option>
                    <option value={INQUIRY_SOURCE.PHONE}>Phone</option>
                    <option value={INQUIRY_SOURCE.PORTAL}>Portal</option>
                    <option value={INQUIRY_SOURCE.WALK_IN}>Walk-in</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Source Reference</label>
                  <input
                    type="text"
                    placeholder="Phone/Email ID reference"
                    value={formData.sourceReference}
                    onChange={(e) => setFormData({ ...formData, sourceReference: e.target.value })}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Customer Name</label>
                  <input
                    type="text"
                    placeholder="Customer name"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Customer Phone</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Customer Email</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Customer PO Number</label>
                  <input
                    type="text"
                    placeholder="Customer PO reference"
                    value={formData.customerPONumber}
                    onChange={(e) => setFormData({ ...formData, customerPONumber: e.target.value })}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Expected Delivery Date</label>
                  <input
                    type="date"
                    value={formData.expectedDeliveryDate}
                    onChange={(e) => setFormData({ ...formData, expectedDeliveryDate: e.target.value })}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Expected Price (₹)</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={formData.expectedPrice}
                    onChange={(e) => setFormData({ ...formData, expectedPrice: e.target.value })}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Assigned Sales Person</label>
                <input
                  type="text"
                  placeholder="Sales person name"
                  value={formData.assignedSalesPerson}
                  onChange={(e) => setFormData({ ...formData, assignedSalesPerson: e.target.value })}
                  className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Raw Message / Transcript</label>
                <textarea
                  placeholder="Paste the original inquiry message here..."
                  value={formData.rawMessage}
                  onChange={(e) => setFormData({ ...formData, rawMessage: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Special Instructions</label>
                <textarea
                  placeholder="Any special requirements or notes"
                  value={formData.specialInstructions}
                  onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
                <button
                  onClick={() => setShowNewDialog(false)}
                  className="px-4 py-2 border border-[var(--border)] rounded-lg text-[oklch(0.90_0_0)] hover:bg-[oklch(0.24_0_0)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  className="px-4 py-2 gradient-primary text-[oklch(0.98_0_0)] rounded-lg font-semibold shadow-glow hover:opacity-90 transition-colors"
                >
                  Create Inquiry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inquiry Detail Dialog */}
      {showDetailDialog && selectedInquiry && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 md:p-4 z-50 overflow-y-auto">
          <div className="bg-[oklch(0.20_0_0)] text-[oklch(0.95_0_0)] rounded-xl shadow-card max-w-6xl w-full my-8 border border-[var(--border)]">
            {/* Header */}
            <div className="p-4 md:p-6 border-b border-[var(--border)] flex justify-between items-start gap-4 sticky top-0 bg-[oklch(0.20_0_0)] z-10 rounded-t-xl">
              <div className="flex-1 min-w-0">
                <h3 className="text-xl md:text-2xl font-bold truncate">Inquiry Details</h3>
                <p className="text-[oklch(0.75_0_0)] text-xs md:text-sm mt-1 font-mono truncate">{selectedInquiry.inquiryNumber}</p>
              </div>
              <button
                onClick={() => {
                  setShowDetailDialog(false)
                  setShowInteractionForm(false)
                }}
                className="text-[oklch(0.75_0_0)] hover:text-[oklch(0.96_0_0)] p-1 rounded-lg hover:bg-[oklch(0.24_0_0)] transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>

            <div className="p-4 md:p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto custom-scrollbar">
              {/* Inquiry Information */}
              <div>
                <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  Inquiry Information
                </h4>
                <div className="grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-3 card-surface p-4">
                  <div>
                    <label className="block text-xs font-medium text-[oklch(0.65_0_0)] mb-1">Inquiry ID</label>
                    <p className="font-mono text-sm font-semibold text-[oklch(0.96_0_0)]">{selectedInquiry.inquiryNumber}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[oklch(0.65_0_0)] mb-1">Date & Time</label>
                    <p className="text-sm">{new Date(selectedInquiry.inquiryDateTime || selectedInquiry.createdAt).toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[oklch(0.65_0_0)] mb-1">Source</label>
                    <p className="text-sm">{sourceConfig[selectedInquiry.source]?.label || selectedInquiry.source}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[oklch(0.65_0_0)] mb-1">Source Reference</label>
                    <p className="text-sm">{selectedInquiry.sourceReference || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[oklch(0.65_0_0)] mb-1">Linked Order ID</label>
                    <p className="text-sm">{selectedInquiry.linkedOrderId || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[oklch(0.65_0_0)] mb-1">Status</label>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${statusConfig[selectedInquiry.status]?.color}`}>
                      {statusConfig[selectedInquiry.status]?.label || selectedInquiry.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Details */}
              <div>
                <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-emerald-400" />
                  Customer Details
                  {!selectedInquiry.customerId && (
                    <span className="text-xs text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-md">
                      Waiting for customer details acquisition
                    </span>
                  )}
                </h4>
                <div className="grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-3 card-surface p-4">
                  <div>
                    <label className="block text-xs font-medium text-[oklch(0.65_0_0)] mb-1">Customer ID</label>
                    <p className="text-sm font-mono">{selectedInquiry.customerId || 'Pending'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[oklch(0.65_0_0)] mb-1">Name</label>
                    <p className="text-sm">{selectedInquiry.customerName || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[oklch(0.65_0_0)] mb-1">POC (Point of Contact)</label>
                    <p className="text-sm">{selectedInquiry.customerPOC || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[oklch(0.65_0_0)] mb-1 flex items-center gap-1">
                      <Phone className="w-3 h-3" /> Phone Number
                    </label>
                    <p className="text-sm">{selectedInquiry.customerPhone || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[oklch(0.65_0_0)] mb-1 flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" /> WhatsApp
                    </label>
                    <p className="text-sm">{selectedInquiry.customerWhatsapp || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[oklch(0.65_0_0)] mb-1 flex items-center gap-1">
                      <Mail className="w-3 h-3" /> Email
                    </label>
                    <p className="text-sm">{selectedInquiry.customerEmail || '-'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-[oklch(0.65_0_0)] mb-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> Address
                    </label>
                    <p className="text-sm">{selectedInquiry.customerAddress || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[oklch(0.65_0_0)] mb-1">Preferred Contact Method</label>
                    <p className="text-sm capitalize">{selectedInquiry.preferredContactMethod || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Product & Order Details */}
              <div>
                <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <Package className="w-5 h-5 text-cyan-400" />
                  Product & Order Details
                </h4>
                <div className="grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-3 card-surface p-4">
                  <div>
                    <label className="block text-xs font-medium text-[oklch(0.65_0_0)] mb-1">Product Requested</label>
                    <p className="text-sm">{selectedInquiry.productRequested || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[oklch(0.65_0_0)] mb-1">Expected Price</label>
                    <p className="text-sm">{selectedInquiry.expectedPrice ? `₹${selectedInquiry.expectedPrice.toLocaleString('en-IN')}` : '-'}</p>
                    {selectedInquiry.expectedPrice && (
                      <span className="text-xs text-[oklch(0.65_0_0)]">(According to price list)</span>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[oklch(0.65_0_0)] mb-1">Expected Delivery</label>
                    <p className="text-sm">{selectedInquiry.expectedDeliveryDate ? new Date(selectedInquiry.expectedDeliveryDate).toLocaleDateString('en-IN') : '-'}</p>
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-xs font-medium text-[oklch(0.65_0_0)] mb-1">Special Instructions</label>
                    <p className="text-sm whitespace-pre-wrap">{selectedInquiry.specialInstructions || '-'}</p>
                  </div>
                  {selectedInquiry.rawMessage && (
                    <div className="md:col-span-3">
                      <label className="block text-xs font-medium text-[oklch(0.65_0_0)] mb-1">Transcript of Interaction</label>
                      <div className="bg-[oklch(0.24_0_0)] p-3 rounded-md">
                        <p className="text-sm whitespace-pre-wrap font-mono text-[oklch(0.88_0_0)]">{selectedInquiry.rawMessage}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Assignment & SLA Details */}
              <div>
                <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <UserCircle className="w-5 h-5 text-purple-400" />
                  Assignment & SLA
                </h4>
                <div className="grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-4 card-surface p-4">
                  <div>
                    <label className="block text-xs font-medium text-[oklch(0.65_0_0)] mb-1">Assigned Sales Person</label>
                    <p className="text-sm">{selectedInquiry.assignedSalesPerson || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[oklch(0.65_0_0)] mb-1">Within Working Hours</label>
                    <p className="text-sm">
                      {selectedInquiry.isWithinWorkingHours ? (
                        <span className="text-emerald-300">✓ Yes</span>
                      ) : (
                        <span className="text-amber-300">✗ No</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[oklch(0.65_0_0)] mb-1">Interaction Due Time</label>
                    <p className="text-sm">{selectedInquiry.interactionDueTime ? new Date(selectedInquiry.interactionDueTime).toLocaleString('en-IN') : '-'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[oklch(0.65_0_0)] mb-1">SLA Status</label>
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${slaConfig[selectedInquiry.slaStatus]?.color}`}>
                      {slaConfig[selectedInquiry.slaStatus]?.label || 'On Track'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Interaction Details Table */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-bold flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-amber-400" />
                    Interaction Details
                  </h4>
                  <button
                    onClick={() => setShowInteractionForm(!showInteractionForm)}
                    className="flex items-center gap-2 px-3 py-1.5 gradient-primary text-[oklch(0.98_0_0)] rounded-lg text-sm font-semibold shadow-glow hover:opacity-90 transition"
                  >
                    <Plus className="w-4 h-4" />
                    Add Interaction
                  </button>
                </div>

                {/* Interaction Form */}
                {showInteractionForm && (
                  <div className="card-surface p-4 mb-4 space-y-3">
                    <h5 className="font-semibold text-sm text-[oklch(0.90_0_0)] mb-2">New Interaction</h5>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div>
                        <label className="block text-xs font-medium text-[oklch(0.70_0_0)] mb-1">Type <span className="text-rose-300">*</span></label>
                        <select
                          value={interactionForm.type}
                          onChange={(e) => setInteractionForm({ ...interactionForm, type: e.target.value })}
                          className="w-full px-3 py-2 input-surface text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                        >
                          <option value="">Select type</option>
                          <option value="Call">Call</option>
                          <option value="Email">Email</option>
                          <option value="WhatsApp">WhatsApp</option>
                          <option value="Meeting">Meeting</option>
                          <option value="Visit">Visit</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[oklch(0.70_0_0)] mb-1">Outcome <span className="text-rose-300">*</span></label>
                        <select
                          value={interactionForm.outcome}
                          onChange={(e) => setInteractionForm({ ...interactionForm, outcome: e.target.value })}
                          className="w-full px-3 py-2 input-surface text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                        >
                          <option value="">Select outcome</option>
                          <option value="Customer Interested">Customer Interested</option>
                          <option value="Awaiting Response">Awaiting Response</option>
                          <option value="Price Negotiation">Price Negotiation</option>
                          <option value="Order Confirmed">Order Confirmed</option>
                          <option value="Customer Declined">Customer Declined</option>
                          <option value="No Response">No Response</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-[oklch(0.70_0_0)] mb-1">Summary <span className="text-rose-300">*</span></label>
                        <textarea
                          value={interactionForm.summary}
                          onChange={(e) => setInteractionForm({ ...interactionForm, summary: e.target.value })}
                          rows={2}
                          placeholder="Describe the interaction..."
                          className="w-full px-3 py-2 input-surface text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={interactionForm.followUpRequired}
                            onChange={(e) => setInteractionForm({ ...interactionForm, followUpRequired: e.target.checked })}
                            className="w-4 h-4"
                          />
                          <span className="text-sm text-[oklch(0.90_0_0)]">Follow-up required?</span>
                        </label>
                      </div>
                      {interactionForm.followUpRequired && (
                        <>
                          <div>
                            <label className="block text-xs font-medium text-[oklch(0.70_0_0)] mb-1">Follow-up Date & Time</label>
                            <input
                              type="datetime-local"
                              value={interactionForm.followUpDateTime}
                              onChange={(e) => setInteractionForm({ ...interactionForm, followUpDateTime: e.target.value })}
                              className="w-full px-3 py-2 input-surface text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-[oklch(0.70_0_0)] mb-1">Follow-up Status</label>
                            <select
                              value={interactionForm.followUpStatus}
                              onChange={(e) => setInteractionForm({ ...interactionForm, followUpStatus: e.target.value })}
                              className="w-full px-3 py-2 input-surface text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                            >
                              <option value="pending">Pending</option>
                              <option value="scheduled">Scheduled</option>
                              <option value="completed">Completed</option>
                            </select>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="flex gap-2 justify-end pt-2 border-t border-[var(--border)]">
                      <button
                        onClick={() => setShowInteractionForm(false)}
                        className="px-3 py-1.5 border border-[var(--border)] rounded-lg text-sm text-[oklch(0.90_0_0)] hover:bg-[oklch(0.24_0_0)] transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddInteraction}
                        className="px-3 py-1.5 gradient-primary text-[oklch(0.98_0_0)] rounded-lg text-sm font-semibold shadow-glow hover:opacity-90 transition-colors"
                      >
                        Add Interaction
                      </button>
                    </div>
                  </div>
                )}

                {/* Interactions Table */}
                <div className="border border-[var(--border)] rounded-lg overflow-hidden">
                  <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full min-w-[800px]">
                      <thead className="bg-[oklch(0.22_0_0)]">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-[oklch(0.85_0_0)] uppercase w-12">#</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-[oklch(0.85_0_0)] uppercase">Type</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-[oklch(0.85_0_0)] uppercase">Date & Time</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-[oklch(0.85_0_0)] uppercase">Outcome</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-[oklch(0.85_0_0)] uppercase">Summary</th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-[oklch(0.85_0_0)] uppercase">Follow-up?</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-[oklch(0.85_0_0)] uppercase">Follow-up Date</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-[oklch(0.85_0_0)] uppercase">Follow-up Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border)]">
                        {interactions.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="px-4 py-8 text-center text-[oklch(0.70_0_0)] text-sm">
                              No interactions recorded yet
                            </td>
                          </tr>
                        ) : (
                          interactions.map((interaction, index) => (
                            <tr key={interaction.id} className="hover:bg-[oklch(0.24_0_0)] transition-colors">
                              <td className="px-4 py-3 text-sm text-[oklch(0.75_0_0)] font-mono">{index + 1}</td>
                              <td className="px-4 py-3 text-sm text-[oklch(0.92_0_0)]">{interaction.type}</td>
                              <td className="px-4 py-3 text-sm text-[oklch(0.92_0_0)]">
                                {new Date(interaction.dateTime).toLocaleString('en-IN', { 
                                  dateStyle: 'short', 
                                  timeStyle: 'short' 
                                })}
                              </td>
                              <td className="px-4 py-3">
                                <span className="inline-flex px-2 py-1 rounded-md text-xs font-medium bg-[oklch(0.26_0_0)] text-[oklch(0.90_0_0)]">
                                  {interaction.outcome}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-[oklch(0.88_0_0)] max-w-xs truncate">
                                {interaction.summary}
                              </td>
                              <td className="px-4 py-3 text-center">
                                {interaction.followUpRequired ? (
                                  <span className="text-emerald-300">✓</span>
                                ) : (
                                  <span className="text-[oklch(0.60_0_0)]">-</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm text-[oklch(0.88_0_0)]">
                                {interaction.followUpDateTime 
                                  ? new Date(interaction.followUpDateTime).toLocaleString('en-IN', { 
                                      dateStyle: 'short', 
                                      timeStyle: 'short' 
                                    })
                                  : '-'}
                              </td>
                              <td className="px-4 py-3">
                                {interaction.followUpStatus ? (
                                  <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium capitalize ${
                                    interaction.followUpStatus === 'completed' 
                                      ? 'bg-emerald-500/15 text-emerald-200'
                                      : interaction.followUpStatus === 'scheduled'
                                      ? 'bg-sky-500/15 text-sky-200'
                                      : 'bg-amber-500/15 text-amber-200'
                                  }`}>
                                    {interaction.followUpStatus}
                                  </span>
                                ) : (
                                  <span className="text-[oklch(0.60_0_0)]">-</span>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

