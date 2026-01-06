import { useState, useEffect } from 'react'
import { INQUIRY_STATUS, INQUIRY_SOURCE, SLA_STATUS } from '../../types/inquiry'
import { Plus, MessageSquare } from 'lucide-react'
import {
  getAllInquiries,
  createInquiry,
  updateInquiry,
  deleteInquiry,
  getInquiryById
} from '../../services/api/inquiry/inquiry-api'
import {
  getInquiryInteractions,
  addInquiryInteraction,
  updateInquiryInteraction,
  deleteInquiryInteraction,
} from '../../services/api/inquiry/inquiry-interaction-api';
// Import components
import InquiryForm from '../../components/inquiry/InquiryForm'
import InquiryList from '../../components/inquiry/InquiryList'
import InquiryView from '../../components/inquiry/InquiryView'
import Toast from '../../components/ui/Toast'
import ConfirmationModal from '../../components/ui/ConfirmationModal'
import Notification from '../../components/notifiction/notifiction'
import { useSelector } from 'react-redux'

export default function Inquiry() {
  // Main state
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const user = useSelector((state) => state.auth.user)

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
  const [editingInteractionId, setEditingInteractionId] = useState(null)

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
    source: '',
    sourceReference: '',
    linkedOrderId: '',
    status: '',
    productRequested: '',
    expectedPrice: '',
    expectedDeliveryDate: '',
    quantity: '',
    uom: '',
    specialInstructions: '',
    transcript: '',
    assignedSalesPerson: '',
    isWithinWorkingHours: true,
    interactionDueTime: '',
    slaStatus: 'PENDING',
    customerName: '',
    customerPOC: '',
    customerPhone: '',
    customerWhatsapp: '',
    customerEmail: '',
    customerAddress: '',
    preferredContactMethod: 'whatsapp',
    customerId: ''  
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
  
      const response = await getAllInquiries()
      const data = response?.data?.data ?? []
      console.log(response);
      const transformedData = data.map(inq => {
        let customerPhone = ''
        let customerEmail = ''
      
        if (inq.contact_info) {
          if (inq.contact_info.type === 'email') {
            customerEmail = inq.contact_info.value || ''
          } else if (inq.contact_info.type === 'phone') {
            customerPhone = inq.contact_info.value || ''
          }
          else if(inq.contact_info.type === 'whatsapp') {
            customerPhone = inq.contact_info.value || ''
          }
        }
      
        return {
          ...inq,
          // Map backend fields to frontend naming convention
          inquiryNumber: inq.inquiry_code || '',
          source: inq.source ? inq.source.toLowerCase() : INQUIRY_SOURCE.WHATSAPP,
          status: inq.status || INQUIRY_STATUS.NEW,
          slaStatus: inq.sla_status || SLA_STATUS.PENDING,
          customerName: inq.customer_name || '',
          customerPhone,
          customerEmail,
          inquiryDateTime: inq.inquiry_datetime || '',
          assignedSalesPerson: inq.assigned_user_name || '',
          expectedPrice: inq.expected_price || '',
          productRequested: inq.product_requested || '',
          expectedDeliveryDate: inq.expected_delivery_date,
          // You might also want to map the user code if needed
          assignedSalesPersonCode: inq.assigned_user_code || '',
          // Original contact info if needed
          contactType: inq.contact_info?.type || '',
          id: inq.id || inq.inquiry_code,
        }
      })
      console.log(transformedData);
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
      console.log('View details clicked for:', inquiry)
      
      // Make sure we have an ID to fetch
      const inquiryId = inquiry?.id || inquiry?.inquiryId
      if (!inquiryId) {
        console.error('No inquiry ID provided')
        return
      }
  
      const response = await getInquiryById(inquiryId)
      const data = response?.data.data
      
      console.log('Backend response:', data)
      
      if (!data) {
        console.error('No data received from backend')
        return
      }
  
      // Extract customer details if available
      const customerDetails = data.customer_details || {}
      
      // Extract assigned sales person details
      const assignedPerson = data.assigned_sales_person || {}
      
      // Extract interaction summary
      const interactionSummary = data.interaction_summary || {}
      
      // Transform data to match frontend expectations
      const transformed = {
        // Basic fields
        id: data.id,
        inquiryNumber: data.inquiry_code || '',
        inquiryDateTime: data.inquiry_datetime || data.created_at,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        
        // Source - convert to lowercase for frontend config
        source: (data.source || '').toLowerCase(),
        sourceReference: data.source_reference || '',
        
        // Status - convert to lowercase for frontend config
        status: (data.status || '').toLowerCase(),
        
        // SLA Status - convert to lowercase for frontend config
        slaStatus: (data.sla_status || '').toLowerCase(),
        
        // Customer information
        customerId: customerDetails.id || null,
        customerName: customerDetails.name || '',
        customerPOC: customerDetails.poc_name || '',
        customerPhone: customerDetails.phone_number || '',
        customerWhatsapp: customerDetails.whatsapp_number || customerDetails.phone_number || '',
        customerEmail: customerDetails.email || '',
        customerAddress: customerDetails.address || '',
        preferredContactMethod: (customerDetails.preferred_contact_method || 'whatsapp').toLowerCase(),
        
        // Product information
        productRequested: data.product_requested || '',
        expectedPrice: data.expected_price ? parseFloat(data.expected_price) : null,
        expectedDeliveryDate: data.expected_delivery_date,
        quantity: data.quantity ? parseInt(data.quantity) : null,
        uom: data.uom || '',
        specialInstructions: data.special_instructions || '',
        transcript: data.transcript || '-',
        rawMessage: data.transcript || '', // For frontend display
        
        // Sales person assignment
        assignedSalesPerson: assignedPerson.full_name || assignedPerson.username || '',
        assignedSalesPersonCode: assignedPerson.employee_code || '',
        
        // Additional fields
        linkedOrderId: data.linked_order_id || null,
        isWithinWorkingHours: data.is_within_working_hours ?? true,
        interactionDueTime: data.interaction_due_time || null,
        
        // Interaction summary (for display purposes)
        totalInteractions: interactionSummary.total_interactions || 0,
        lastInteractionType: interactionSummary.last_interaction_type || null,
        lastInteractionDate: interactionSummary.last_interaction_date || null,
        
        // Keep original nested objects (optional)
        customer_details: customerDetails,
        assigned_sales_person: assignedPerson,
        interaction_summary: interactionSummary,
      }
  
      console.log('Transformed data for frontend:', transformed)
      
      // Set the transformed data
      setSelectedInquiry(transformed)
      
      // Set interactions (if available from response)
      setInteractions(data.interactions || [])
      
      // Show the detail dialog
      setShowDetailDialog(true)
  
    } catch (error) {
      console.error('Failed to fetch inquiry details:', error)
      const errorMessage = error?.response?.data?.error?.message || error?.message || 'Failed to fetch inquiry details'
    } finally {
      setLoadingDetail(false)
    }
  }

  const handleAddInteraction = async (id) =>  {
    if (!interactionForm.type || !interactionForm.outcome || !interactionForm.summary) {
      throw {
        name: 'ValidationError',
        message: 'Please fill all required fields',
        statusCode: 400,
      }
    }
    
    
    console.log('user_id:', user.user_id);
    
    try {
      const newInteraction = {
        inquiry_id: id,
        interaction_type: interactionForm.type,
        interaction_datetime: new Date().toISOString(),
        outcome: interactionForm.outcome,
        summary: interactionForm.summary,
        follow_up_required: interactionForm.followUpRequired,
        follow_up_datetime: interactionForm.followUpRequired ? interactionForm.followUpDateTime : null,
        follow_up_status: interactionForm.followUpRequired ? interactionForm.followUpStatus : null,
        created_by:  user.user_id 
      }
      console.log('add interaction: ', newInteraction)
      
      const response = await addInquiryInteraction(newInteraction)
      console.log(response);
      
      if (response?.data) {
        // Update interactions list with the new interaction
        setInteractions([...interactions, response.data.interaction])
        
        // Refresh inquiry details to update total interactions count
        if (selectedInquiry?.id) {
          const detailResponse = await getInquiryById(selectedInquiry.id)
          const detailData = detailResponse?.data?.data
          if (detailData) {
            const interactionSummary = detailData.interaction_summary || {}
            setSelectedInquiry(prev => ({
              ...prev,
              totalInteractions: interactionSummary.total_interactions || interactions.length + 1,
              lastInteractionType: interactionSummary.last_interaction_type || response.data.interaction.interaction_type,
              lastInteractionDate: interactionSummary.last_interaction_date || response.data.interaction.interaction_datetime,
              interaction_summary: interactionSummary
            }))
          }
        }
        
        // Reset form
        setInteractionForm({
          type: '',
          outcome: '',
          summary: '',
          followUpRequired: false,
          followUpDateTime: '',
          followUpStatus: 'pending'
        })
        setEditingInteractionId(null)
        setShowInteractionForm(false)
      } else {
      }
    } catch (error) {
      console.error('Error adding interaction:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      source: '',
      sourceReference: '',
      linkedOrderId: '',
      status: '',
      productRequested: '',
      expectedPrice: '',
      expectedDeliveryDate: '',
      quantity: '',
      uom: '',
      specialInstructions: '',
      transcript: '',
      assignedSalesPerson: '',
      isWithinWorkingHours: true,
      interactionDueTime: '',
      slaStatus: 'PENDING',
      customerName: '',
      customerPOC: '',
      customerPhone: '',
      customerWhatsapp: '',
      customerEmail: '',
      customerAddress: '',
      preferredContactMethod: 'whatsapp',
      customerId: ''
    })
  }

  const handleOpenCreateForm = () => {
    resetForm()
    setFormMode('create')
    setEditingInquiryId(null)
    setShowFormDialog(true)
  }

  const handleOpenEditForm = (inquiry) => {
    console.log('Opening edit form for inquiry:', inquiry)
    
    // Transform the inquiry data to match form structure
    const transformedData = {
      source: inquiry.source?.toUpperCase() || 'WHATSAPP',
      sourceReference: inquiry.sourceReference || inquiry.source_reference || '',
      linkedOrderId: inquiry.linkedOrderId || inquiry.linked_order_id || '',
      status: inquiry.status?.toUpperCase() || 'OPEN',
      productRequested: inquiry.productRequested || inquiry.product_requested || '',
      expectedPrice: inquiry.expectedPrice || inquiry.expected_price || '',
      expectedDeliveryDate: inquiry.expectedDeliveryDate || inquiry.expected_delivery_date || '',
      quantity: inquiry.quantity || '',
      uom: inquiry.uom || '',
      specialInstructions: inquiry.specialInstructions || inquiry.special_instructions || '',
      transcript: inquiry.transcript || inquiry.rawMessage || '',
      assignedSalesPerson: inquiry.assignedSalesPersonId ||  '',
      isWithinWorkingHours: inquiry.isWithinWorkingHours ?? 
                          inquiry.is_within_working_hours ?? 
                          true,
      interactionDueTime: inquiry.interactionDueTime || inquiry.interaction_due_time || '',
      slaStatus: inquiry.slaStatus?.toUpperCase() || inquiry.sla_status?.toUpperCase() || 'PENDING',
      customerName: inquiry.customerName || inquiry.customer_details?.name || '',
      customerPOC: inquiry.customerPOC || inquiry.customer_details?.poc_name || '',
      customerPhone: inquiry.customerPhone || inquiry.customer_details?.phone_number || '',
      customerWhatsapp: inquiry.customerWhatsapp || inquiry.customer_details?.whatsapp_number || '',
      customerEmail: inquiry.customerEmail || inquiry.customer_details?.email || '',
      customerAddress: inquiry.customerAddress || inquiry.customer_details?.address || '',
      preferredContactMethod: inquiry.preferredContactMethod || 
                            inquiry.customer_details?.preferred_contact_method || 
                            'whatsapp',
      customerId: inquiry.customerId || inquiry.customer_details?.id || ''
    }
  
    console.log('Transformed data for edit form:', transformedData)
    
    setFormData(transformedData)
    setFormMode('edit')
    setEditingInquiryId(inquiry.id)
    setShowFormDialog(true)
    setShowDetailDialog(false) // Close detail view when opening edit form
  }

  const handleFormSubmit = async () => {
    // Validation
    if (!formData.source) {
      alert('Source is required')
      return
    }
    
    if (!formData.status) {
      alert('Status is required')
      return
    }
    
    if (!formData.productRequested) {
      alert('Product requested is required')
      return
    }
  
    try {
      if (formMode === 'edit' && editingInquiryId) {
        // Prepare update data for backend
        const updateData = {
          source: formData.source,
          source_reference: formData.sourceReference || null,
          linked_order_id: formData.linkedOrderId || null,
          status: formData.status,
          product_requested: formData.productRequested,
          expected_price: formData.expectedPrice ? parseFloat(formData.expectedPrice) : null,
          expected_delivery_date: formData.expectedDeliveryDate || null,
          quantity: formData.quantity ? parseInt(formData.quantity) : null,
          uom: formData.uom || null,
          special_instructions: formData.specialInstructions || null,
          transcript: formData.transcript || null,
          assigned_sales_person: formData.assignedSalesPerson || null,
          is_within_working_hours: formData.isWithinWorkingHours,
          interaction_due_time: formData.interactionDueTime || null,
          sla_status: formData.slaStatus,
        }
  
        // Add customer details if any customer field is filled
        const hasCustomerData = 
          formData.customerName ||
          formData.customerPOC ||
          formData.customerPhone ||
          formData.customerWhatsapp ||
          formData.customerEmail ||
          formData.customerAddress
  
        if (hasCustomerData) {
          updateData.customer_name = formData.customerName || null
          updateData.customer_poc_name = formData.customerPOC || null
          updateData.customer_phone_number = formData.customerPhone || null
          updateData.customer_whatsapp_number = formData.customerWhatsapp || null
          updateData.customer_email = formData.customerEmail || null
          updateData.customer_address = formData.customerAddress || null
          updateData.customer_preferred_contact_method = formData.preferredContactMethod
        }
  
        console.log('Updating inquiry with data:', updateData)
        
        // Call your API to update the inquiry
        const response = await updateInquiry(editingInquiryId, updateData)
        
        console.log('Update response:', response.data)
        
        if (response?.data) {
          setShowFormDialog(false)
          resetForm()
          fetchInquiries()
          
          // If we're viewing this inquiry, refresh the details
          if (selectedInquiry?.id === editingInquiryId) {
            handleViewDetails({ id: editingInquiryId })
          }          
        } 
      } else {
        // Create new inquiry
        const newInquiry = {
          source: formData.source,
          source_reference: formData.sourceReference || null,
          linked_order_id: formData.linkedOrderId || null,
          status: formData.status,
          product_requested: formData.productRequested,
          expected_price: formData.expectedPrice ? parseFloat(formData.expectedPrice) : null,
          expected_delivery_date: formData.expectedDeliveryDate || null,
          quantity: formData.quantity ? parseInt(formData.quantity) : null,
          uom: formData.uom || null,
          special_instructions: formData.specialInstructions || null,
          transcript: formData.transcript || null,
          assigned_sales_person: formData.assignedSalesPerson || null,
          is_within_working_hours: formData.isWithinWorkingHours,
          interaction_due_time: formData.interactionDueTime || null,
          sla_status: formData.slaStatus,
        }
  
        // Add customer details for create mode
        if (formData.customerName || formData.customerPhone || formData.customerEmail) {
          newInquiry.customer_name = formData.customerName || null
          newInquiry.customer_poc_name = formData.customerPOC || null
          newInquiry.customer_phone_number = formData.customerPhone || null
          newInquiry.customer_whatsapp_number = formData.customerWhatsapp || null
          newInquiry.customer_email = formData.customerEmail || null
          newInquiry.customer_address = formData.customerAddress || null
          newInquiry.customer_preferred_contact_method = formData.preferredContactMethod
        }
  
        console.log('Creating new inquiry with data:', newInquiry)

        const response = await createInquiry(newInquiry)
        
        setShowFormDialog(false)
        resetForm()
        fetchInquiries()
      }
    } catch (error) {
      console.error(`Error ${formMode === 'edit' ? 'updating' : 'creating'} inquiry:`, error)
    }
  }

  const handleDeleteInquiry = (inquiryId) => {
    showConfirmation(
      'Are you sure you want to delete this inquiry?',
      async () => {
        try {
          // API is ready
          await deleteInquiry(inquiryId)
          
          setShowDetailDialog(false)
          setSelectedInquiry(null)
          fetchInquiries()
        } catch (error) {
          console.error('Error deleting inquiry:', error)
        }
      }
    )
  }

  const handleDeleteInteraction = (interactionId, inquiryId) => {
    showConfirmation(
      'Are you sure you want to delete this interaction?',
      async () => {
        try {
          await deleteInquiryInteraction(interactionId);
          
          // Remove the deleted interaction from the list
          setInteractions(interactions.filter(interaction => interaction.id !== interactionId));
          
          // Refresh inquiry details to update total interactions count
          if (selectedInquiry?.id) {
            const detailResponse = await getInquiryById(selectedInquiry.id)
            const detailData = detailResponse?.data?.data
            if (detailData) {
              const interactionSummary = detailData.interaction_summary || {}
              setSelectedInquiry(prev => ({
                ...prev,
                totalInteractions: interactionSummary.total_interactions || Math.max(0, interactions.length - 1),
                lastInteractionType: interactionSummary.last_interaction_type || null,
                lastInteractionDate: interactionSummary.last_interaction_date || null,
                interaction_summary: interactionSummary
              }))
            }
          }
          
        } catch (error) {
          console.error('Error deleting interaction:', error);
          const errorMessage = error?.response?.data?.error?.message || error?.message || 'Failed to delete interaction'
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
        filtered = filtered.filter(inq => inq.status === 'OPEN')
      } else if (activeTab === 'success') {
        filtered = filtered.filter(inq => inq.status === 'CONVERTED')
      } else if (activeTab === 'rejected') {
        filtered = filtered.filter(inq => inq.status === 'CANCELLED')
      } else if (activeTab === 'follow_up') {
        filtered = filtered.filter(inq => inq.status === 'FOLLOW_UP')
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

  const handleUpdateInteraction = async (inquiryId, interactionId) => {
    if (!interactionForm.type || !interactionForm.outcome || !interactionForm.summary) {
      throw {
        name: 'ValidationError',
        message: 'Please fill all required fields',
        statusCode: 400,
      }
    }
    
    try {
      const updateData = {
        inquiry_id: inquiryId,
        interaction_type: interactionForm.type,
        outcome: interactionForm.outcome,
        summary: interactionForm.summary,
        follow_up_required: interactionForm.followUpRequired,
        follow_up_datetime: interactionForm.followUpRequired ? interactionForm.followUpDateTime : null,
        follow_up_status: interactionForm.followUpRequired ? interactionForm.followUpStatus : null,
      }
      console.log('update interaction: ', updateData)
      
      const response = await updateInquiryInteraction(interactionId, updateData)
      console.log(response);
      if (response?.data) {
        // Update interactions list with the updated interaction
        setInteractions(prev =>
          prev.map(interaction =>
            interaction.id === interactionId
              ? { ...interaction, ...response.data.data }
              : interaction
          )
        )        
        
        // Refresh inquiry details to update total interactions count
        if (selectedInquiry?.id) {
          const detailResponse = await getInquiryById(selectedInquiry.id)
          const detailData = detailResponse?.data?.data
          console.log('detailData', detailData)
          if (detailData) {
            setSelectedInquiry(detailData)
          }                   
        }
        
        // Reset form and editing state
        setInteractionForm({
          type: '',
          outcome: '',
          summary: '',
          followUpRequired: false,
          followUpDateTime: '',
          followUpStatus: 'pending'
        })
        setEditingInteractionId(null)
        setShowInteractionForm(false)
        showToast('Interaction updated successfully', 'success')
      } else {
        showToast('Failed to update interaction: Invalid response', 'error')
      }
    } catch (error) {
      console.error('Error updating interaction:', error)
      const errorMessage = error?.response?.data?.error?.message || error?.message || 'Failed to update interaction'
      showToast(errorMessage, 'error')
    }
  }

  const filteredInquiries = getFilteredInquiries()

  const counts = {
    all: inquiries.length,
    pending: inquiries.filter(inq => inq.status === 'OPEN').length,
    success: inquiries.filter(inq => inq.status === 'CONVERTED').length,
    rejected: inquiries.filter(inq => inq.status === 'CANCELLED').length,
    follow_up: inquiries.filter(inq => inq.status === 'FOLLOW_UP').length,
    new: inquiries.filter(inq => inq.status === 'NEW').length,
    converted: inquiries.filter(inq => inq.status === 'CONVERTED').length,
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
        onUpdateInteraction={handleUpdateInteraction}
        onEdit={handleOpenEditForm}
        onDelete={handleDeleteInquiry}
        onDeleteInteraction={handleDeleteInteraction}
        editingInteractionId={editingInteractionId}
        setEditingInteractionId={setEditingInteractionId}
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
