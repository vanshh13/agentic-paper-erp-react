import { useState, useEffect } from 'react'
import { inquiryService } from '../../services/inquiryService'
import { INQUIRY_STATUS, INQUIRY_SOURCE, SLA_STATUS } from '../../types/inquiry'
import { Plus, MessageSquare } from 'lucide-react'
import { inquiryServiceApi } from '../../services/api/inquiry/inquiry-api'
// Import components
import InquiryForm from '../../components/inquiry/InquiryForm'
import InquiryList from '../../components/inquiry/InquiryList'
import InquiryView from '../../components/inquiry/InquiryView'
import Toast from '../../components/ui/Toast'
import ConfirmationModal from '../../components/ui/ConfirmationModal'

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
  const [showFormDialog, setShowFormDialog] = useState(false)
  const [formMode, setFormMode] = useState('create') // 'create' or 'edit'
  const [editingInquiryId, setEditingInquiryId] = useState(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [showInteractionForm, setShowInteractionForm] = useState(false)

  // Data states
  const [selectedInquiry, setSelectedInquiry] = useState(null)
  const [interactions, setInteractions] = useState([])

  // Toast state
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'info', // 'success', 'error', 'warning', 'info'
  })

  // Confirmation modal state
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    message: '',
    onConfirm: null,
  })

  // Helper function to show toast
  const showToast = (message, type = 'info') => {
    setToast({
      isVisible: true,
      message,
      type,
    })
  }

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }))
  }

  // Helper function to show confirmation modal
  const showConfirmation = (message, onConfirm) => {
    setConfirmationModal({
      isOpen: true,
      message,
      onConfirm,
    })
  }

  const hideConfirmation = () => {
    setConfirmationModal({
      isOpen: false,
      message: '',
      onConfirm: null,
    })
  }

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
    quantity: '',
    uom: '',
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
      
      // TODO: Uncomment when API is ready
      // const data = await inquiryService.getAll()
      
      const response = await inquiryServiceApi.getAll()
      // console.log(response);
      const data = response.data.data;
      const transformedData = data.map(inq => ({
        // Keep original for reference
        ...inq,
        
        // Mapping Backend (snake_case) to Frontend (camelCase)
        id: inq.id,
        inquiryNumber: inq.inquiry_code, // Mapped from inquiry_code
        customerName: inq.customer_name || '',
        productRequested: inq.product_requested || '',
        inquiryDateTime: inq.inquiry_datetime || inq.created_at,
        
        // Handle Nested Contact Info
        customerPhone: inq.contact_info?.type === 'phone' ? inq.contact_info.value : (inq.customer_phone || ''),
        customerWhatsapp: inq.contact_info?.type === 'whatsapp' ? inq.contact_info.value : (inq.customer_whatsapp || ''),
        customerEmail: inq.customer_email || inq.email || '',
        
        // Assignment Info
        assignedSalesPerson: inq.assigned_user_name || inq.assigned_sales_person || '',
        
        // Enums and Fallbacks
        source: inq.source || INQUIRY_SOURCE.WHATSAPP,
        status: (inq.status || INQUIRY_STATUS.NEW).toLowerCase(), // Ensure lowercase for statusConfig keys
        slaStatus: (inq.sla_status || SLA_STATUS.ON_TRACK).toLowerCase(),
        
        // Financials/Dates
        expectedPrice: inq.expected_price || null,
        expectedDeliveryDate: inq.expected_delivery_date || null,
        
        // Ensure consistency for components
        createdAt: inq.created_at
      }));

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
      
      // TODO: Uncomment when API is ready
      // const data = await inquiryService.getById(inquiry.id)
      
      // Using dummy data for now
      const response = await inquiryServiceApi.getById(inquiry.id)
      const data = response.data;
      console.log(data)
      if (data) {
        const transformed = {
          ...data,
        
          // 1. Core Header Information
          inquiryNumber: data.inquiry_code,
          // Fallback to created_at if inquiry_datetime is missing
          inquiryDateTime: data.inquiry_datetime || data.created_at,
        
          // 2. Map Nested Customer Details
          customerId: data.customer_details?.id || null,
          customerName: data.customer_details?.name || '',
          customerPOC: data.customer_details?.poc_name || '',
          customerPhone: data.customer_details?.phone_number || '',
          // Logic: Use whatsapp_number if present, otherwise fall back to phone_number
          customerWhatsapp: data.customer_details?.whatsapp_number || data.customer_details?.phone_number || '',
          customerEmail: data.customer_details?.email || '',
          customerAddress: data.customer_details?.address || '',
          preferredContactMethod: data.customer_details?.preferred_contact_method || 'whatsapp',
        
          // 3. Status & Source Mapping
          // Ensures strings are lowercase to match your statusConfig/slaConfig/sourceConfig keys
          status: (data.status || 'new').toLowerCase(),
          source: (data.source || 'whatsapp').toLowerCase(),
          // Mapping 'PENDING' or 'OPEN' from backend to 'on_track' if it doesn't match your config keys
          slaStatus: data.sla_status === 'PENDING' ? 'on_track' : (data.sla_status || 'on_track').toLowerCase(),
        
          // 4. Product & Order Details
          productRequested: data.product_requested || null,
          quantity: data.quantity || null,
          uom: data.uom || null,
          expectedPrice: data.expected_price || null,
          expectedDeliveryDate: data.expected_delivery_date || null,
          specialInstructions: data.special_instructions || null,
          rawMessage: data.transcript || null, 
          linkedOrderId: data.linked_order_id || null,
        
          // 5. Assignment & Working Hours
          assignedSalesPerson: data.assigned_sales_person?.full_name || '',
          // Checks strictly for null to allow false values
          isWithinWorkingHours: data.is_within_working_hours !== null ? data.is_within_working_hours : true,
          interactionDueTime: data.interaction_due_time || null,
        
          // 6. Interactions Table Data
          interactions: (data.interactions || []).map(int => ({
            id: int.id,
            type: int.type,
            // Maps backend dates to camelCase used in InquiryView table
            dateTime: int.interaction_date || int.created_at,
            outcome: int.outcome || '',
            summary: int.summary || '',
            followUpRequired: Boolean(int.follow_up_required),
            followUpDateTime: int.follow_up_date || null,
            followUpStatus: (int.follow_up_status || 'pending').toLowerCase()
          }))
        };
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

  const resetForm = () => {
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
      quantity: '',
      uom: '',
      expectedDeliveryDate: '',
      specialInstructions: '',
      rawMessage: '',
      assignedSalesPerson: '',
      isWithinWorkingHours: true,
      interactionDueTime: '',
      slaStatus: SLA_STATUS.ON_TRACK,
    })
  }

  const handleOpenCreateForm = () => {
    resetForm()
    setFormMode('create')
    setEditingInquiryId(null)
    setShowFormDialog(true)
  }

  const handleOpenEditForm = (inquiry) => {
    // Prefill form with inquiry data
    setFormData({
      source: inquiry.source || INQUIRY_SOURCE.WHATSAPP,
      linkedOrderId: inquiry.linkedOrderId || '',
      status: inquiry.status || INQUIRY_STATUS.NEW,
      customerId: inquiry.customerId || '',
      customerName: inquiry.customerName || '',
      customerPOC: inquiry.customerPOC || '',
      customerPhone: inquiry.customerPhone || '',
      customerWhatsapp: inquiry.customerWhatsapp || '',
      customerEmail: inquiry.customerEmail || '',
      customerAddress: inquiry.customerAddress || '',
      preferredContactMethod: inquiry.preferredContactMethod || 'whatsapp',
      productRequested: inquiry.productRequested || '',
      expectedPrice: inquiry.expectedPrice || '',
      quantity: inquiry.quantity || '',
      uom: inquiry.uom || '',
      expectedDeliveryDate: inquiry.expectedDeliveryDate || '',
      specialInstructions: inquiry.specialInstructions || '',
      rawMessage: inquiry.rawMessage || '',
      assignedSalesPerson: inquiry.assignedSalesPerson || '',
      isWithinWorkingHours: inquiry.isWithinWorkingHours !== undefined ? inquiry.isWithinWorkingHours : true,
      interactionDueTime: inquiry.interactionDueTime || '',
      slaStatus: inquiry.slaStatus || SLA_STATUS.ON_TRACK,
    })
    setFormMode('edit')
    setEditingInquiryId(inquiry.id)
    setShowFormDialog(true)
    setShowDetailDialog(false) // Close detail view when opening edit form
  }

  const handleFormSubmit = async () => {
    if (!formData.customerName && !formData.customerPhone && !formData.customerEmail) {
      alert('At least one customer contact is required')
      return
    }

    try {
      if (formMode === 'edit' && editingInquiryId) {
        // Update existing inquiry
        const updatedInquiry = {
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
          quantity: formData.quantity ? parseFloat(formData.quantity) : null,
          uom: formData.uom || null,
          expectedDeliveryDate: formData.expectedDeliveryDate || null,
          specialInstructions: formData.specialInstructions || null,
          rawMessage: formData.rawMessage || null,
          assignedSalesPerson: formData.assignedSalesPerson || null,
          isWithinWorkingHours: formData.isWithinWorkingHours,
          interactionDueTime: formData.interactionDueTime || null,
          slaStatus: formData.slaStatus,
        }

        // TODO: Uncomment when API is ready
        // await inquiryService.update(editingInquiryId, updatedInquiry)
        
        // Using dummy data for now
        await inquiryService.update(editingInquiryId, updatedInquiry)
        
        setShowFormDialog(false)
        resetForm()
        fetchInquiries()
        showToast('Inquiry updated successfully', 'success')
      } else {
        // Create new inquiry
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
          quantity: formData.quantity ? parseFloat(formData.quantity) : null,
          uom: formData.uom || null,
          expectedDeliveryDate: formData.expectedDeliveryDate || null,
          specialInstructions: formData.specialInstructions || null,
          rawMessage: formData.rawMessage || null,
          assignedSalesPerson: formData.assignedSalesPerson || null,
          isWithinWorkingHours: formData.isWithinWorkingHours,
          interactionDueTime: formData.interactionDueTime || null,
          slaStatus: formData.slaStatus,
          inquiryDateTime: new Date().toISOString(),
        }

        // TODO: Uncomment when API is ready
        // await inquiryService.create(newInquiry)
        
        // Using dummy data for now
        await inquiryService.create(newInquiry)
        
        setShowFormDialog(false)
        resetForm()
        fetchInquiries()
        showToast('Inquiry created successfully', 'success')
      }
    } catch (error) {
      console.error(`Error ${formMode === 'edit' ? 'updating' : 'creating'} inquiry:`, error)
      alert(`Failed to ${formMode === 'edit' ? 'update' : 'create'} inquiry`)
    }
  }

  const handleDeleteInquiry = (inquiryId) => {
    showConfirmation(
      'Are you sure you want to delete this inquiry?',
      async () => {
        try {
          // TODO: Uncomment when API is ready
          // await inquiryService.delete(inquiryId)
          
          // Using dummy data for now
          await inquiryService.delete(inquiryId)
          
          setShowDetailDialog(false)
          setSelectedInquiry(null)
          fetchInquiries()
          showToast('Inquiry deleted successfully', 'success')
        } catch (error) {
          console.error('Error deleting inquiry:', error)
          showToast('Failed to delete inquiry', 'error')
        }
      }
    )
  }

  const handleDeleteInteraction = (interactionId) => {
    showConfirmation(
      'Are you sure you want to delete this interaction?',
      async () => {
        try {
          await inquiryService.deleteInteraction(interactionId);
          
          // Refresh the interactions list for the currently selected inquiry
          const updatedInteractions = await inquiryService.getInteractions(selectedInquiry.id);
          setInteractions(updatedInteractions);
          
          showToast('Interaction removed successfully', 'success');
        } catch (error) {
          console.error('Error deleting interaction:', error);
          showToast('Failed to delete interaction', 'error');
        }
      }
    );
  };

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
          onClick={handleOpenCreateForm}
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

      {/* Form Component - Reusable for Create and Edit */}
      <InquiryForm
        formData={formData}
        setFormData={setFormData}
        showDialog={showFormDialog}
        setShowDialog={setShowFormDialog}
        onSubmit={handleFormSubmit}
        mode={formMode}
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
        onEdit={handleOpenEditForm}
        onDelete={handleDeleteInquiry}
        onDeleteInteraction={handleDeleteInteraction}
        loadingDetail={loadingDetail}
      />

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
        duration={3000}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={hideConfirmation}
        onConfirm={() => {
          if (confirmationModal.onConfirm) {
            confirmationModal.onConfirm()
          }
        }}
        title="Confirm Delete"
        message={confirmationModal.message}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  )
}
