import { X, FileText, User, MapPin, Phone, Mail, MessageSquare, Package, UserCircle, Plus, Trash2 } from 'lucide-react'

const statusConfig = {
  new: { label: 'New', color: 'bg-emerald-500/15 text-emerald-200' },
  open: { label: 'Open', color: 'bg-emerald-500/15 text-emerald-200' },
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
  pending: { label: 'Pending', color: 'bg-gray-500/15 text-gray-200' },
  on_track: { label: 'On Track', color: 'bg-emerald-500/15 text-emerald-200' },
  at_risk: { label: 'At Risk', color: 'bg-amber-500/20 text-amber-200' },
  breached: { label: 'Breached', color: 'bg-rose-500/20 text-rose-100' },
}

export default function InquiryView({
  selectedInquiry,
  showDetailDialog,
  setShowDetailDialog,
  interactions = [],
  showInteractionForm,
  setShowInteractionForm,
  interactionForm,
  setInteractionForm,
  onAddInteraction,
  onEdit,
  onDelete,
  onDeleteInteraction,
  loadingDetail = false
}) {
  if (!showDetailDialog || !selectedInquiry) return null

  // Helper functions to safely get config values
  const getStatusConfig = (status) => {
    if (!status) return statusConfig.new
    const statusKey = status.toLowerCase()
    return statusConfig[statusKey] || statusConfig.new
  }

  const getSlaConfig = (slaStatus) => {
    if (!slaStatus) return slaConfig.pending
    const slaKey = slaStatus.toLowerCase()
    return slaConfig[slaKey] || slaConfig.pending
  }

  const getSourceConfig = (source) => {
    if (!source) return sourceConfig.whatsapp
    const sourceKey = source.toLowerCase()
    return sourceConfig[sourceKey] || sourceConfig.whatsapp
  }

  // Get config values for current inquiry
  const status = getStatusConfig(selectedInquiry.status)
  const sla = getSlaConfig(selectedInquiry.slaStatus)
  const source = getSourceConfig(selectedInquiry.source)

  // Helper function to format dates
  const formatDateTime = (dateString) => {
    if (!dateString) return '-'
    try {
      return new Date(dateString).toLocaleString('en-IN', {
        dateStyle: 'short',
        timeStyle: 'short'
      })
    } catch {
      return 'Invalid Date'
    }
  }

  // Helper function to format date only
  const formatDate = (dateString) => {
    if (!dateString) return '-'
    try {
      return new Date(dateString).toLocaleDateString('en-IN')
    } catch {
      return 'Invalid Date'
    }
  }

  // Format price with INR symbol
  const formatPrice = (price) => {
    if (!price && price !== 0) return '-'
    const numPrice = typeof price === 'string' ? parseFloat(price) : price
    return `₹${numPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  // Format quantity
  const formatQuantity = (quantity) => {
    if (!quantity && quantity !== 0) return '-'
    const numQuantity = typeof quantity === 'string' ? parseFloat(quantity) : quantity
    return numQuantity.toLocaleString('en-IN')
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 md:p-4 z-50 overflow-y-auto">
      <div className="bg-[oklch(0.20_0_0)] text-[oklch(0.95_0_0)] rounded-xl shadow-card max-w-6xl w-full my-8 border border-[var(--border)]">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-[var(--border)] flex justify-between items-start gap-4 sticky top-0 bg-[oklch(0.20_0_0)] z-10 rounded-t-xl">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl md:text-2xl font-bold truncate">Inquiry Details</h3>
            <p className="text-[oklch(0.75_0_0)] text-xs md:text-sm mt-1 font-mono truncate">
              {selectedInquiry.inquiryNumber || selectedInquiry.inquiry_code || 'No Inquiry Number'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Edit Button */}
            <button
              onClick={() => onEdit && onEdit(selectedInquiry)}
              className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-lg text-xs md:text-sm font-semibold hover:bg-indigo-500/20 transition-all"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Edit</span>
            </button>

            {/* Delete Button */}
            <button
              onClick={() => onDelete && onDelete(selectedInquiry.id)}
              className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-lg text-xs md:text-sm font-semibold hover:bg-rose-500 hover:text-white transition-all duration-200 group"
            >
              <Trash2 className="w-4 h-4 text-rose-400 group-hover:text-white transition-colors" />
              <span className="hidden sm:inline">Delete</span>
            </button>
            
            {/* Vertical Divider */}
            <div className="w-[1px] h-8 bg-[var(--border)] mx-1" />

            {/* Close Button */}
            <button
              onClick={() => {
                setShowDetailDialog(false)
                setShowInteractionForm(false)
              }}
              className="text-[oklch(0.75_0_0)] hover:text-[oklch(0.96_0_0)] p-1.5 rounded-lg hover:bg-[oklch(0.24_0_0)] transition-colors"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
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
                <p className="font-mono text-sm font-semibold text-[oklch(0.96_0_0)]">
                  {selectedInquiry.inquiryNumber || selectedInquiry.inquiry_code || '-'}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-[oklch(0.65_0_0)] mb-1">Date & Time</label>
                <p className="text-sm">
                  {formatDateTime(selectedInquiry.inquiryDateTime || selectedInquiry.inquiry_datetime || selectedInquiry.createdAt || selectedInquiry.created_at)}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-[oklch(0.65_0_0)] mb-1">Source</label>
                <p className="text-sm capitalize">{source.label}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-[oklch(0.65_0_0)] mb-1">Source Reference</label>
                <p className="text-sm">{selectedInquiry.sourceReference || selectedInquiry.source_reference || '-'}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-[oklch(0.65_0_0)] mb-1">Status</label>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${status.color}`}>
                  {status.label}
                </span>
              </div>
              <div>
                <label className="block text-xs font-medium text-[oklch(0.65_0_0)] mb-1">Linked Order ID</label>
                <p className="text-sm">{selectedInquiry.linkedOrderId || selectedInquiry.linked_order_id || '-'}</p>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div>
            <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-400" />
              Customer Details
              {!selectedInquiry.customerId && !selectedInquiry.customer_details?.id && (
                <span className="text-xs text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-md">
                  Waiting for customer details
                </span>
              )}
            </h4>
            <div className="grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-3 card-surface p-4">
              <div>
                <label className="block text-xs font-medium text-[oklch(0.65_0_0)] mb-1">Customer ID</label>
                <p className="text-sm font-mono">
                  {selectedInquiry.customerId || selectedInquiry.customer_details?.id || 'Pending'}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-[oklch(0.65_0_0)] mb-1">Name</label>
                <p className="text-sm">
                  {selectedInquiry.customerName || selectedInquiry.customer_details?.name || '-'}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-[oklch(0.65_0_0)] mb-1">POC</label>
                <p className="text-sm">
                  {selectedInquiry.customerPOC || selectedInquiry.customer_details?.poc_name || '-'}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-[oklch(0.65_0_0)] mb-1 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> Phone
                </label>
                <p className="text-sm">
                  {selectedInquiry.customerPhone || selectedInquiry.customer_details?.phone_number || '-'}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-[oklch(0.65_0_0)] mb-1 flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" /> WhatsApp
                </label>
                <p className="text-sm">
                  {selectedInquiry.customerWhatsapp || selectedInquiry.customer_details?.whatsapp_number || '-'}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-[oklch(0.65_0_0)] mb-1 flex items-center gap-1">
                  <Mail className="w-3 h-3" /> Email
                </label>
                <p className="text-sm">
                  {selectedInquiry.customerEmail || selectedInquiry.customer_details?.email || '-'}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-[oklch(0.65_0_0)] mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Address
                </label>
                <p className="text-sm">
                  {selectedInquiry.customerAddress || selectedInquiry.customer_details?.address || '-'}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-[oklch(0.65_0_0)] mb-1">Preferred Contact</label>
                <p className="text-sm capitalize">
                  {/* {selectedInquiry.preferredContactMethod || selectedInquiry.customer_details?.preferred_contact_method || '-'} */}
                  {selectedInquiry.customer_details?.preferred_contact_method || '-'}
                </p>
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
                <p className="text-sm">{selectedInquiry.productRequested || selectedInquiry.product_requested || '-'}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-[oklch(0.65_0_0)] mb-1">Expected Price</label>
                <p className="text-sm">
                  {formatPrice(selectedInquiry.expectedPrice || selectedInquiry.expected_price)}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-[oklch(0.65_0_0)] mb-1">Expected Delivery</label>
                <p className="text-sm">
                  {formatDate(selectedInquiry.expectedDeliveryDate || selectedInquiry.expected_delivery_date)}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-[oklch(0.65_0_0)] mb-1">Quantity</label>
                <p className="text-sm">
                  {formatQuantity(selectedInquiry.quantity)}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-[oklch(0.65_0_0)] mb-1">UOM</label>
                <p className="text-sm">{selectedInquiry.uom || '-'}</p>
              </div>
              <div className="md:col-span-3">
                <label className="block text-xs font-medium text-[oklch(0.65_0_0)] mb-1">Special Instructions</label>
                <p className="text-sm whitespace-pre-wrap">
                  {selectedInquiry.specialInstructions || selectedInquiry.special_instructions || '-'}
                </p>
              </div>
              {/* {(selectedInquiry.transcript || selectedInquiry.rawMessage) && ( */}
                <div className="md:col-span-3">
                  <label className="block text-xs font-medium text-[oklch(0.65_0_0)] mb-1">Transcript / Raw Message</label>
                  {/* <div className="bg-[oklch(0.24_0_0)] p-3 rounded-md"> */}
                    <p className="text-sm whitespace-pre-wrap font-mono text-[oklch(0.88_0_0)]">
                      {selectedInquiry.transcript || selectedInquiry.rawMessage}
                    </p>
                  {/* </div> */}
                </div>
              {/* )} */}
            </div>
          </div>

          {/* Assignment & SLA */}
          <div>
            <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
              <UserCircle className="w-5 h-5 text-purple-400" />
              Assignment & SLA
            </h4>
            <div className="grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-4 card-surface p-4">
              <div>
                <label className="block text-xs font-medium text-[oklch(0.65_0_0)] mb-1">Assigned To</label>
                <p className="text-sm">
                  {selectedInquiry.assignedSalesPerson || 
                   selectedInquiry.assigned_sales_person?.full_name || 
                   selectedInquiry.assigned_user_name || 
                   '-'}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-[oklch(0.65_0_0)] mb-1">Employee Code</label>
                <p className="text-sm">
                  {selectedInquiry.assignedSalesPersonCode || 
                   selectedInquiry.assigned_sales_person?.employee_code || 
                   selectedInquiry.assigned_user_code || 
                   '-'}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-[oklch(0.65_0_0)] mb-1">Working Hours</label>
                <p className="text-sm">
                  {!selectedInquiry.isWithinWorkingHours ? (
                    <span className="text-amber-300">✗ No</span>  
                  ) : (
                    <span className="text-emerald-300">✓ Yes</span>
                  )}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-[oklch(0.65_0_0)] mb-1">Due Time</label>
                <p className="text-sm">
                  {formatDateTime(selectedInquiry.interactionDueTime || selectedInquiry.interaction_due_time)}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-[oklch(0.65_0_0)] mb-1">SLA Status</label>
                <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${sla.color}`}>
                  {sla.label}
                </span>
              </div>
              <div>
                <label className="block text-xs font-medium text-[oklch(0.65_0_0)] mb-1">Total Interactions</label>
                <p className="text-sm">
                  {selectedInquiry.totalInteractions || selectedInquiry.interaction_summary?.total_interactions || 0}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-[oklch(0.65_0_0)] mb-1">Last Interaction</label>
                <p className="text-sm">
                  {formatDateTime(selectedInquiry.lastInteractionDate || selectedInquiry.interaction_summary?.last_interaction_date)}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-[oklch(0.65_0_0)] mb-1">Last Interaction Type</label>
                <p className="text-sm capitalize">
                  {selectedInquiry.lastInteractionType || selectedInquiry.interaction_summary?.last_interaction_type || '-'}
                </p>
              </div>
            </div>
          </div>

          {/* Interactions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-bold flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-400" />
                Interactions
              </h4>
              <button
                onClick={() => setShowInteractionForm(!showInteractionForm)}
                className="flex items-center gap-2 px-3 py-1.5 gradient-primary text-[oklch(0.98_0_0)] rounded-lg text-sm font-semibold shadow-glow hover:opacity-90 transition"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>

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
                    onClick={onAddInteraction}
                    className="px-3 py-1.5 gradient-primary text-[oklch(0.98_0_0)] rounded-lg text-sm font-semibold shadow-glow hover:opacity-90 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

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
                      <th className="px-4 py-3 text-right text-xs font-semibold text-[oklch(0.85_0_0)] uppercase">Remove</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {interactions.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-4 py-8 text-center text-[oklch(0.70_0_0)] text-sm">
                          No interactions recorded yet
                        </td>
                      </tr>
                    ) : (
                      interactions.map((interaction, index) => (
                        <tr key={interaction.id} className="hover:bg-[oklch(0.24_0_0)] transition-colors">
                          <td className="px-4 py-3 text-sm text-[oklch(0.75_0_0)] font-mono">{index + 1}</td>
                          <td className="px-4 py-3 text-sm text-[oklch(0.92_0_0)]">{interaction.interaction_type}</td>
                          <td className="px-4 py-3 text-sm text-[oklch(0.92_0_0)]">
                            {formatDateTime(interaction.dateTime || interaction.created_at)}
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
                            {interaction.follow_up_required ? (
                              <span className="text-emerald-300">✓</span>
                            ) : (
                              <span className="text-[oklch(0.60_0_0)]">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-[oklch(0.88_0_0)]">
                            {interaction.follow_up_datetime 
                              ? formatDateTime(interaction.follow_up_datetime)
                              : '-'}
                          </td>
                          <td className="px-4 py-3">
                            {interaction.follow_up_status ? (
                              <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium capitalize ${
                                interaction.follow_up_status === 'completed' 
                                  ? 'bg-emerald-500/15 text-emerald-200'
                                  : interaction.follow_up_status === 'scheduled'
                                  ? 'bg-sky-500/15 text-sky-200'
                                  : 'bg-amber-500/15 text-amber-200'
                              }`}>
                                {interaction.follow_up_status}
                              </span>
                            ) : (
                              <span className="text-[oklch(0.60_0_0)]">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => onDeleteInteraction(interaction.id)}
                              className="p-1.5 text-rose-400 hover:text-rose-100 hover:bg-rose-500/20 rounded-lg transition-all"
                              title="Delete Interaction"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
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
  )
}