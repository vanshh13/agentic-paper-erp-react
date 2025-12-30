import { X } from 'lucide-react'

export default function PurchaseOrderForm({
  formData,
  setFormData,
  showDialog,
  setShowDialog,
  onCreate,
  loading = false
}) {
  if (!showDialog) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 md:p-4 z-50">
      <div className="bg-[oklch(0.20_0_0)] text-[oklch(0.95_0_0)] rounded-xl shadow-card max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-[var(--border)] custom-scrollbar">
        <div className="p-4 md:p-6 border-b border-[var(--border)] sticky top-0 bg-[oklch(0.20_0_0)] z-10">
          <h3 className="text-xl md:text-2xl font-bold">Create Purchase Order</h3>
          <p className="text-[oklch(0.75_0_0)] text-xs md:text-sm mt-1">Create a new purchase order</p>
        </div>
        <div className="p-4 md:p-6 space-y-6">
          {/* PO Section */}
          <div>
            <h4 className="text-lg font-bold mb-3 text-[oklch(0.90_0_0)] border-b border-[var(--border)] pb-2">PO Details</h4>
            <div className="space-y-4">
              <div className="grid gap-3 md:gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    PO Type <span className="text-rose-300">*</span>
                  </label>
                  <select
                    value={formData.poType}
                    onChange={(e) => setFormData({ ...formData, poType: e.target.value })}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                  >
                    <option value="jk_company">JK Company</option>
                    <option value="domestic">Domestic</option>
                    <option value="import">Import</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Status <span className="text-rose-300">*</span>
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                  >
                    <option value="new">New</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="in_transit">In Transit</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Supplier & Delivery Details */}
          <div>
            <h4 className="text-lg font-bold mb-3 text-[oklch(0.90_0_0)] border-b border-[var(--border)] pb-2">Supplier & Delivery</h4>
            <div className="space-y-4">
              <div className="grid gap-3 md:gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Supplier <span className="text-rose-300">*</span>
                  </label>
                  <select
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                  >
                    <option value="">Select supplier</option>
                    <option value="ABC Suppliers Ltd.">ABC Suppliers Ltd.</option>
                    <option value="Global Trading Co.">Global Trading Co.</option>
                    <option value="Metro Supplies">Metro Supplies</option>
                    <option value="Local Vendors Inc.">Local Vendors Inc.</option>
                    <option value="National Traders">National Traders</option>
                    <option value="International Exports Ltd.">International Exports Ltd.</option>
                    <option value="Global Imports Co.">Global Imports Co.</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Delivery Type <span className="text-rose-300">*</span>
                  </label>
                  <select
                    value={formData.deliveryType}
                    onChange={(e) => setFormData({ ...formData, deliveryType: e.target.value })}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                  >
                    <option value="">Select delivery type</option>
                    <option value="warehouse">Warehouse</option>
                    <option value="direct_to_customer">Direct to Customer</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Requested Delivery Date <span className="text-rose-300">*</span>
                </label>
                <input
                  type="date"
                  value={formData.deliveryDate}
                  onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                  className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                />
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-lg font-bold text-[oklch(0.90_0_0)] border-b border-[var(--border)] pb-2 w-full">Line Items</h4>
            </div>
            <div className="bg-[oklch(0.18_0_0)] rounded-lg p-4 space-y-4">
              {formData.lineItems && formData.lineItems.length > 0 ? (
                formData.lineItems.map((item, index) => (
                  <div key={index} className="bg-[oklch(0.20_0_0)] p-4 rounded-lg border border-[var(--border)]">
                    <div className="grid gap-3 md:gap-4 md:grid-cols-2 mb-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Product</label>
                        <input
                          type="text"
                          placeholder="Select product"
                          value={item.product || ''}
                          onChange={(e) => {
                            const newItems = [...formData.lineItems]
                            newItems[index].product = e.target.value
                            setFormData({ ...formData, lineItems: newItems })
                          }}
                          className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Quantity</label>
                        <input
                          type="number"
                          placeholder="0"
                          value={item.quantity || ''}
                          onChange={(e) => {
                            const newItems = [...formData.lineItems]
                            newItems[index].quantity = parseInt(e.target.value) || 0
                            setFormData({ ...formData, lineItems: newItems })
                          }}
                          className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Unit Price (₹)</label>
                        <input
                          type="number"
                          placeholder="0.00"
                          value={item.unitPrice || ''}
                          onChange={(e) => {
                            const newItems = [...formData.lineItems]
                            newItems[index].unitPrice = parseFloat(e.target.value) || 0
                            setFormData({ ...formData, lineItems: newItems })
                          }}
                          className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Total Price (₹)</label>
                        <div className="px-3 py-2 input-surface bg-[oklch(0.18_0_0)] rounded">
                          {(item.quantity && item.unitPrice ? (item.quantity * item.unitPrice).toFixed(2) : '0.00')}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const newItems = formData.lineItems.filter((_, i) => i !== index)
                        setFormData({ ...formData, lineItems: newItems })
                      }}
                      className="text-sm text-rose-300 hover:text-rose-200 transition-colors"
                    >
                      Remove Item
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-[oklch(0.65_0_0)]">
                  <p className="text-sm">No items added yet</p>
                </div>
              )}
              <button
                onClick={() => {
                  const newItems = [...(formData.lineItems || []), { product: '', quantity: 0, unitPrice: 0 }]
                  setFormData({ ...formData, lineItems: newItems })
                }}
                className="w-full py-2 border border-dashed border-[var(--border)] rounded-lg text-[oklch(0.90_0_0)] hover:bg-[oklch(0.24_0_0)] transition-colors text-sm font-medium"
              >
                + Add Item
              </button>
            </div>
          </div>

          {/* Payment & Additional Details */}
          <div>
            <h4 className="text-lg font-bold mb-3 text-[oklch(0.90_0_0)] border-b border-[var(--border)] pb-2">Payment & Notes</h4>
            <div className="space-y-4">
              <div className="grid gap-3 md:gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Payment Terms</label>
                  <input
                    type="text"
                    placeholder="e.g., 30 Days"
                    value={formData.paymentTerms}
                    onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Incoterms</label>
                  <input
                    type="text"
                    placeholder="e.g., FOB, CIF"
                    value={formData.incoterms}
                    onChange={(e) => setFormData({ ...formData, incoterms: e.target.value })}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Delivery Address</label>
                <textarea
                  placeholder="Enter delivery address"
                  value={formData.deliveryAddress}
                  onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  placeholder="Any additional notes or special instructions"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                />
              </div>
            </div>
          </div>

          {/* Grand Total */}
          <div className="bg-[oklch(0.18_0_0)] p-4 rounded-lg border border-[var(--border)]">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-[oklch(0.90_0_0)]">Grand Total:</span>
              <span className="text-2xl font-bold text-sky-300">
                ₹{formData.lineItems && formData.lineItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice || 0), 0).toFixed(2)}
              </span>
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
              onClick={onCreate}
              disabled={loading}
              className="px-4 py-2 gradient-primary text-[oklch(0.98_0_0)] rounded-lg font-semibold shadow-glow hover:opacity-90 transition-colors disabled:opacity-50"
            >
              Create PO
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
