import { X } from 'lucide-react'

export default function InquiryForm({
  formData,
  setFormData,
  showDialog,
  setShowDialog,
  onSubmit,
  mode = 'create', // 'create' or 'edit'
  loading = false
}) {
  if (!showDialog) return null

  const isEditMode = mode === 'edit'
  const title = isEditMode ? 'Edit Inquiry' : 'Create New Inquiry'
  const subtitle = isEditMode ? 'Update inquiry details' : 'Log a new customer inquiry'
  const submitButtonText = isEditMode ? 'Update Inquiry' : 'Create Inquiry'
  const uomOptions = ['kg', 'g', 'mg', 'ton'];

  // Helper function for handling changes
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Helper to format date for datetime-local input
  const formatForDateTimeLocal = (dateString) => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return ''
      // Convert to YYYY-MM-DDTHH:mm format
      const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      return local.toISOString().slice(0, 16)
    } catch {
      return ''
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 md:p-4 z-50">
      <div className="bg-[oklch(0.20_0_0)] text-[oklch(0.95_0_0)] rounded-xl shadow-card max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-[var(--border)] custom-scrollbar">
        <div className="p-4 md:p-6 border-b border-[var(--border)] sticky top-0 bg-[oklch(0.20_0_0)] z-10 relative">
          <button
            onClick={() => setShowDialog(false)}
            className="absolute top-4 right-4 text-[oklch(0.75_0_0)] hover:text-[oklch(0.90_0_0)] transition-colors"
          >
            <X size={20} />
          </button>
          <h3 className="text-xl md:text-2xl font-bold">{title}</h3>
          <p className="text-[oklch(0.75_0_0)] text-xs md:text-sm mt-1">{subtitle}</p>
        </div>
        <div className="p-4 md:p-6 space-y-6">
          {/* Inquiry Section */}
          <div>
            <h4 className="text-lg font-bold mb-3 text-[oklch(0.90_0_0)] border-b border-[var(--border)] pb-2">Inquiry Section</h4>
            <div className="space-y-4">
              <div className="grid gap-3 md:gap-4 md:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Source <span className="text-rose-300">*</span>
                  </label>
                  <select
                    value={formData.source}
                    onChange={(e) => handleChange('source', e.target.value)}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                  >
                    <option value="">Select Source</option>
                    <option value="WHATSAPP">WhatsApp</option>
                    <option value="EMAIL">Email</option>
                    <option value="PHONE">Phone</option>
                    <option value="PORTAL">Portal</option>
                    <option value="WALK_IN">Walk-in</option>
                  </select>
                </div>
                
                {/* ADD THIS FIELD - source_reference */}
                <div>
                  <label className="block text-sm font-medium mb-1">Source Reference</label>
                  <input
                    type="text"
                    placeholder="e.g., WhatsApp Group Name"
                    value={formData.sourceReference || ''}
                    onChange={(e) => handleChange('sourceReference', e.target.value)}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Linked Order ID</label>
                  <input
                    type="text"
                    placeholder="SO-2025-001"
                    value={formData.linkedOrderId}
                    onChange={(e) => handleChange('linkedOrderId', e.target.value)}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Status <span className="text-rose-300">*</span>
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                  >
                    <option value="">Select Status</option>
                    {/* <option value="NEW">New</option> */}
                    <option value="OPEN">Open</option>
                    {/* <option value="PARSED">Parsed</option> */}
                    {/* <option value="PI_SENT">PI Sent</option> */}
                    <option value="FOLLOW_UP">Follow Up</option>
                    <option value="CLOSED">Closed</option>
                    <option value="CANCELLED">Rejected</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
 
          {/* Customer Details Section - SAME AS BEFORE */}
          <div>
            <h4 className="text-lg font-bold mb-3 text-[oklch(0.90_0_0)] border-b border-[var(--border)] pb-2">Customer Details</h4>
            <div className="space-y-4">
              <div className="grid gap-3 md:gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Customer ID</label>
                  <input
                    type="text"
                    placeholder="Will be assigned (leave empty for new customer)"
                    value={formData.customerId}
                    onChange={(e) => handleChange('customerId', e.target.value)}
                    readOnly
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                  />
                  <p className="text-xs text-[oklch(0.65_0_0)] mt-1">Will be assigned for new customers</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Customer Name</label>
                  <input
                    type="text"
                    placeholder="Customer name"
                    value={formData.customerName}
                    onChange={(e) => handleChange('customerName', e.target.value)}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                  />
                </div>
              </div>
              <div className="grid gap-3 md:gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-1">POC (Point of Contact)</label>
                  <input
                    type="text"
                    placeholder="Contact person name"
                    value={formData.customerPOC}
                    onChange={(e) => handleChange('customerPOC', e.target.value)}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.customerPhone}
                    onChange={(e) => handleChange('customerPhone', e.target.value)}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                  />
                </div>
              </div>
              <div className="grid gap-3 md:gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-1">WhatsApp Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.customerWhatsapp}
                    onChange={(e) => handleChange('customerWhatsapp', e.target.value)}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={formData.customerEmail}
                    onChange={(e) => handleChange('customerEmail', e.target.value)}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                  />
                </div>
              </div>
              <div className="grid gap-3 md:gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <textarea
                    placeholder="Customer address"
                    value={formData.customerAddress}
                    onChange={(e) => handleChange('customerAddress', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Preferred Contact Method</label>
                  <select
                    value={formData.preferredContactMethod}
                    onChange={(e) => handleChange('preferredContactMethod', e.target.value)}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                  >
                    <option value="whatsapp">WhatsApp</option>
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Product & Order Details */}
          <div>
            <h4 className="text-lg font-bold mb-3 text-[oklch(0.90_0_0)] border-b border-[var(--border)] pb-2">Product & Order Details</h4>
            <div className="space-y-4">
              <div className="grid gap-3 md:gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Product Requested</label>
                  <input
                    type="text"
                    placeholder="Product name or category"
                    value={formData.productRequested}
                    onChange={(e) => handleChange('productRequested', e.target.value)}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Expected Price (₹)</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={formData.expectedPrice}
                    onChange={(e) => handleChange('expectedPrice', e.target.value)}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                    step="0.01"
                  />
                  <p className="text-xs text-[oklch(0.65_0_0)] mt-1">According to price list</p>
                </div>
              </div>
              <div className="grid gap-3 md:gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Quantity</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={formData.quantity}
                    onChange={(e) => handleChange('quantity', e.target.value)}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                  />
                </div>
                <div>
                  {/* CHANGE UOM to text input */}
                  <label className="block text-sm font-medium mb-1">UOM (Unit of Measure)</label>
                  <select
                      value={formData.uom || ''}
                      onChange={(e) => handleChange('uom', e.target.value)}
                      className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                    >
                      <option value="" disabled>
                        Select unit
                      </option>
                      {uomOptions.map((uom) => (
                        <option key={uom} value={uom}>
                          {uom}
                        </option>
                      ))}
                    </select>

                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Expected Delivery Date</label>
                <input
                  type="date"
                  value={formData.expectedDeliveryDate}
                  onChange={(e) => handleChange('expectedDeliveryDate', e.target.value)}
                  className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Special Instructions</label>
                <textarea
                  placeholder="Any special requirements or notes"
                  value={formData.specialInstructions}
                  onChange={(e) => handleChange('specialInstructions', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                />
              </div>
              <div>
                {/* CHANGE rawMessage to transcript */}
                <label className="block text-sm font-medium mb-1">Transcript of Interaction</label>
                <textarea
                  placeholder="Paste the original inquiry message here..."
                  value={formData.transcript || formData.rawMessage || ''}
                  onChange={(e) => handleChange('transcript', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                />
              </div>
            </div>
          </div>

          {/* Assignment & SLA */}
          <div>
            <h4 className="text-lg font-bold mb-3 text-[oklch(0.90_0_0)] border-b border-[var(--border)] pb-2">Assignment & SLA</h4>
            <div className="space-y-4">
              <div className="grid gap-3 md:gap-4 md:grid-cols-2">
                <div>
                  {/* Keep as text input since no API */}
                  <label className="block text-sm font-medium mb-1">Assigned Sales Person</label>
                  <input
                    type="text"
                    placeholder="Sales person name or ID"
                    value={formData.assignedSalesPerson}
                    onChange={(e) => handleChange('assignedSalesPerson', e.target.value)}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Within Working Hours</label>
                  <select
                    value={formData.isWithinWorkingHours?.toString() || 'true'}
                    onChange={(e) => handleChange('isWithinWorkingHours', e.target.value === 'true')}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>
    <div className="grid gap-3 md:gap-4 md:grid-cols-2">
      <div>
        <label className="block text-sm font-medium mb-1">Interaction Due Time</label>
        <input
          type="datetime-local"
          value={formatForDateTimeLocal(formData.interactionDueTime)}
          onChange={(e) => handleChange('interactionDueTime', e.target.value)}
          className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">SLA Status</label>
        <select
          value={formData.slaStatus || 'PENDING'}
          onChange={(e) => handleChange('slaStatus', e.target.value)}
          className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
        >
          <option value="PENDING">Pending</option>
          <option value="ON_TRACK">On Track</option>
          <option value="AT_RISK">At Risk</option>
          <option value="BREACHED">Breached</option>
        </select>
      </div>
    </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
            <button
              onClick={() => setShowDialog(false)}
              className="px-4 py-2 border border-[var(--border)] rounded-lg text-[oklch(0.90_0_0)] hover:bg-[oklch(0.24_0_0)] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={loading}
              className="px-4 py-2 gradient-primary text-[oklch(0.98_0_0)] rounded-lg font-semibold shadow-glow hover:opacity-90 transition-colors disabled:opacity-50"
            >
              {submitButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}