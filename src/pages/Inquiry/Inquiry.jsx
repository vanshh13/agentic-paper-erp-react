import { useState, useEffect } from 'react'
import { inquiryService } from '../../services/inquiryService'
import { INQUIRY_STATUS, INQUIRY_SOURCE, SLA_STATUS } from '../../types/inquiry'
import { Plus, MessageSquare } from 'lucide-react'

// Import components
import InquiryForm from '../../components/inquiry/InquiryForm'
import InquiryList from '../../components/inquiry/InquiryList'
import InquiryView from '../../components/inquiry/InquiryView'

export default function Inquiry() {
  // Main state
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  
  // Filter states
  const [searchInquiry, setSearchInquiry] = useState('')
  const [searchCustomer, setSearchCustomer] = useState('')
  const [searchSalesPerson, setSearchSalesPerson] = useState('')
  const [filters, setFilters] = useState({
    source: '',
    status: '',
    sla: '',
    dateFrom: '',
    dateTo: '',
  })

  // Dialog states
  const [showNewDialog, setShowNewDialog] = useState(false)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [showInteractionForm, setShowInteractionForm] = useState(false)

  // Data states
  const [selectedInquiry, setSelectedInquiry] = useState(null)
  const [interactions, setInteractions] = useState([])

  // Form states
  const [formData, setFormData] = useState({
    source: INQUIRY_SOURCE.WHATSAPP,
    linkedOrderId: '',
    status: INQUIRY_STATUS.NEW,
    customerId: '',
    customerName: '',
    customerPOC: '',
    customerPhone: '',
    customerWhatsapp: '',
    customerEmail: '',
    customerAddress: '',
    preferredContactMethod: 'whatsapp',
    productRequested: '',
    expectedPrice: '',
    expectedDeliveryDate: '',
    specialInstructions: '',
    rawMessage: '',
    assignedSalesPerson: '',
    isWithinWorkingHours: true,
    interactionDueTime: '',
    slaStatus: SLA_STATUS.ON_TRACK,
  })

  const [interactionForm, setInteractionForm] = useState({
    type: '',
    outcome: '',
    summary: '',
    followUpRequired: false,
    followUpDateTime: '',
    followUpStatus: 'pending'
  })

  useEffect(() => {
    fetchInquiries()
  }, [])

  const fetchInquiries = async () => {
    try {
      setLoading(true)
      const data = await inquiryService.getAll()
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
        linkedOrderId: formData.linkedOrderId || null,
        status: formData.status,
        customerId: formData.customerId || null,
        customerName: formData.customerName || null,
        customerPOC: formData.customerPOC || null,
        customerPhone: formData.customerPhone || null,
        customerWhatsapp: formData.customerWhatsapp || null,
        customerEmail: formData.customerEmail || null,
        customerAddress: formData.customerAddress || null,
        preferredContactMethod: formData.preferredContactMethod,
        productRequested: formData.productRequested || null,
        expectedPrice: formData.expectedPrice ? parseFloat(formData.expectedPrice) : null,
        expectedDeliveryDate: formData.expectedDeliveryDate || null,
        specialInstructions: formData.specialInstructions || null,
        rawMessage: formData.rawMessage || null,
        assignedSalesPerson: formData.assignedSalesPerson || null,
        isWithinWorkingHours: formData.isWithinWorkingHours,
        interactionDueTime: formData.interactionDueTime || null,
        slaStatus: formData.slaStatus,
        inquiryDateTime: new Date().toISOString(),
      }

      await inquiryService.create(newInquiry)
      setShowNewDialog(false)
      setFormData({
        source: INQUIRY_SOURCE.WHATSAPP,
        linkedOrderId: '',
        status: INQUIRY_STATUS.NEW,
        customerId: '',
        customerName: '',
        customerPOC: '',
        customerPhone: '',
        customerWhatsapp: '',
        customerEmail: '',
        customerAddress: '',
        preferredContactMethod: 'whatsapp',
        productRequested: '',
        expectedPrice: '',
        expectedDeliveryDate: '',
        specialInstructions: '',
        rawMessage: '',
        assignedSalesPerson: '',
        isWithinWorkingHours: true,
        interactionDueTime: '',
        slaStatus: SLA_STATUS.ON_TRACK,
      })
      fetchInquiries()
    } catch (error) {
      console.error('Error creating inquiry:', error)
      alert('Failed to create inquiry')
    }
  }

  const getFilteredInquiries = () => {
    let filtered = inquiries

    if (searchInquiry) {
      filtered = filtered.filter(inq =>
        inq.inquiryNumber?.toLowerCase().includes(searchInquiry.toLowerCase())
      )
    }

    if (searchCustomer) {
      filtered = filtered.filter(inq =>
        inq.customerName?.toLowerCase().includes(searchCustomer.toLowerCase()) ||
        inq.customerPhone?.includes(searchCustomer) ||
        inq.customerEmail?.toLowerCase().includes(searchCustomer.toLowerCase())
      )
    }

    if (filters.source) {
      filtered = filtered.filter(inq => (inq.source || '').toLowerCase() === filters.source.toLowerCase())
    }

    if (filters.status) {
      filtered = filtered.filter(inq => (inq.status || '') === filters.status)
    }

    if (filters.sla) {
      filtered = filtered.filter(inq => (inq.slaStatus || '') === filters.sla)
    }

    if (searchSalesPerson) {
      filtered = filtered.filter(inq =>
        inq.assignedSalesPerson?.toLowerCase().includes(searchSalesPerson.toLowerCase())
      )
    }

    if (filters.dateFrom) {
      const from = new Date(filters.dateFrom)
      filtered = filtered.filter(inq => new Date(inq.inquiryDateTime || inq.createdAt) >= from)
    }
    if (filters.dateTo) {
      const to = new Date(filters.dateTo)
      to.setHours(23, 59, 59, 999)
      filtered = filtered.filter(inq => new Date(inq.inquiryDateTime || inq.createdAt) <= to)
    }

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

  const isAnyFilterApplied = () => {
    return (
      searchInquiry !== '' ||
      searchCustomer !== '' ||
      searchSalesPerson !== '' ||
      filters.source !== '' ||
      filters.status !== '' ||
      filters.sla !== '' ||
      filters.dateFrom !== '' ||
      filters.dateTo !== ''
    )
  }

  const clearAllFilters = () => {
    setSearchInquiry('')
    setSearchCustomer('')
    setSearchSalesPerson('')
    setFilters({
      source: '',
      status: '',
      sla: '',
      dateFrom: '',
      dateTo: '',
    })
  }

  const filteredInquiries = getFilteredInquiries()

  const counts = {
    all: inquiries.length,
    pending: inquiries.filter(inq => ['new', 'parsed'].includes(inq.status)).length,
    success: inquiries.filter(inq => inq.status === 'converted').length,
    rejected: inquiries.filter(inq => inq.status === 'rejected').length,
    follow_up: inquiries.filter(inq => inq.status === 'follow_up').length,
  }

  return (
    <div className="space-y-6 pb-10 text-[oklch(0.95_0_0)] w-full">
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

      {/* List Component */}
      <InquiryList
        filteredInquiries={filteredInquiries}
        loading={loading}
        onViewDetails={handleViewDetails}
        searchInquiry={searchInquiry}
        setSearchInquiry={setSearchInquiry}
        searchCustomer={searchCustomer}
        setSearchCustomer={setSearchCustomer}
        searchSalesPerson={searchSalesPerson}
        setSearchSalesPerson={setSearchSalesPerson}
        filters={filters}
        setFilters={setFilters}
        isAnyFilterApplied={isAnyFilterApplied}
        clearAllFilters={clearAllFilters}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        counts={counts}
        loadingDetail={loadingDetail}
      />

      {/* Form Component */}
      <InquiryForm
        formData={formData}
        setFormData={setFormData}
        showDialog={showNewDialog}
        setShowDialog={setShowNewDialog}
        onCreate={handleCreate}
      />

      {/* View Component */}
      <InquiryView
        selectedInquiry={selectedInquiry}
        showDetailDialog={showDetailDialog}
        setShowDetailDialog={setShowDetailDialog}
        interactions={interactions}
        showInteractionForm={showInteractionForm}
        setShowInteractionForm={setShowInteractionForm}
        interactionForm={interactionForm}
        setInteractionForm={setInteractionForm}
        onAddInteraction={handleAddInteraction}
        loadingDetail={loadingDetail}
      />
    </div>
  )
}
