import { X } from 'lucide-react'

export default function JKCompanyPOForm({
  formData,
  setFormData,
  showDialog,
  setShowDialog,
  onSubmit,
  loading = false
}) {
  if (!showDialog) return null

  const handleAddItem = () => {
    const newItems = [...(formData.lineItems || []), {
      itemName: '',
      qualityGrade: '',
      brand: '',
      gsm: '',
      size1: '',
      size2: '',
      quantity: '',
      packagingMode: '',
      fscType: ''
    }]
    setFormData({ ...formData, lineItems: newItems })
  }

  const handleRemoveItem = (index) => {
    const newItems = formData.lineItems.filter((_, i) => i !== index)
    setFormData({ ...formData, lineItems: newItems })
  }

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.lineItems]
    newItems[index] = { ...newItems[index], [field]: value }
    setFormData({ ...formData, lineItems: newItems })
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 md:p-4 z-50">
      <div className="bg-[oklch(0.20_0_0)] text-[oklch(0.95_0_0)] rounded-xl shadow-card max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-[var(--border)] custom-scrollbar">
        <div className="p-4 md:p-6 border-b border-[var(--border)] sticky top-0 bg-[oklch(0.20_0_0)] z-10 flex justify-between items-start">
          <div>
            <h3 className="text-xl md:text-2xl font-bold">JK Company Purchase Order</h3>
            <p className="text-[oklch(0.75_0_0)] text-xs md:text-sm mt-1">Create specialized purchase order for JK Paper Mills Ltd</p>
          </div>
          <button
            onClick={() => setShowDialog(false)}
            className="text-[oklch(0.70_0_0)] hover:text-[oklch(0.95_0_0)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 md:p-6 space-y-6">
          {/* Basic Details Section */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-[oklch(0.90_0_0)] border-b border-[var(--border)] pb-2">Purchase Order Details</h4>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Unit <span className="text-rose-300">*</span>
                  </label>
                  <select
                    value={formData.unit || ''}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded"
                  >
                    <option value="">Select unit</option>
                    <option value="unit1">Unit 1</option>
                    <option value="unit2">Unit 2</option>
                    <option value="unit3">Unit 3</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Division <span className="text-rose-300">*</span>
                  </label>
                  <select
                    value={formData.division || ''}
                    onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded"
                  >
                    <option value="">Select division</option>
                    <option value="division1">Division 1</option>
                    <option value="division2">Division 2</option>
                    <option value="division3">Division 3</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Supply From <span className="text-rose-300">*</span>
                  </label>
                  <select
                    value={formData.supplyFrom || ''}
                    onChange={(e) => setFormData({ ...formData, supplyFrom: e.target.value })}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded"
                  >
                    <option value="">Select source</option>
                    <option value="supplier1">Supplier 1</option>
                    <option value="supplier2">Supplier 2</option>
                    <option value="supplier3">Supplier 3</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Incoterms <span className="text-rose-300">*</span>
                  </label>
                  <select
                    value={formData.incoterms || ''}
                    onChange={(e) => setFormData({ ...formData, incoterms: e.target.value })}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded"
                  >
                    <option value="">Select incoterms</option>
                    <option value="fob">FOB</option>
                    <option value="cif">CIF</option>
                    <option value="cpt">CPT</option>
                    <option value="dap">DAP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Delivery Type <span className="text-rose-300">*</span>
                  </label>
                  <select
                    value={formData.deliveryType || ''}
                    onChange={(e) => setFormData({ ...formData, deliveryType: e.target.value })}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded"
                  >
                    <option value="">Select delivery type</option>
                    <option value="warehouse">Warehouse</option>
                    <option value="direct">Direct Delivery</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Delivery Date <span className="text-rose-300">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.deliveryDate || ''}
                    onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Route Code <span className="text-rose-300">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., WEST1"
                    value={formData.routeCode || ''}
                    onChange={(e) => setFormData({ ...formData, routeCode: e.target.value })}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Payment Terms <span className="text-rose-300">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 45 days NST"
                    value={formData.paymentTerms || ''}
                    onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Insurance Information Section */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-[oklch(0.90_0_0)] border-b border-[var(--border)] pb-2">Insurance Information</h4>
            <div className="bg-[oklch(0.18_0_0)] p-4 rounded-lg space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Policy Number</label>
                  <input
                    type="text"
                    placeholder="Policy number"
                    value={formData.policyNumber || ''}
                    onChange={(e) => setFormData({ ...formData, policyNumber: e.target.value })}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Insurer Name</label>
                  <input
                    type="text"
                    placeholder="Insurance company"
                    value={formData.insurerName || ''}
                    onChange={(e) => setFormData({ ...formData, insurerName: e.target.value })}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Policy Expiry</label>
                  <input
                    type="date"
                    value={formData.policyExpiry || ''}
                    onChange={(e) => setFormData({ ...formData, policyExpiry: e.target.value })}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Product Line Items Section */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-[oklch(0.90_0_0)] border-b border-[var(--border)] pb-2">Product Line Items</h4>
            <p className="text-sm text-[oklch(0.70_0_0)] mb-4">Add products to this purchase order</p>
            
            <div className="space-y-4 bg-[oklch(0.18_0_0)] p-4 rounded-lg">
              {formData.lineItems && formData.lineItems.length > 0 ? (
                formData.lineItems.map((item, index) => (
                  <div key={index} className="bg-[oklch(0.20_0_0)] p-4 rounded-lg border border-[var(--border)] space-y-4">
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="font-semibold text-[oklch(0.85_0_0)]">Item {index + 1}</h5>
                      <button
                        onClick={() => handleRemoveItem(index)}
                        className="text-sm text-rose-300 hover:text-rose-200 transition-colors"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid gap-3 md:grid-cols-3">
                      <div>
                        <label className="block text-xs font-medium mb-1">Item Name</label>
                        <input
                          type="text"
                          placeholder="Product name"
                          value={item.itemName || ''}
                          onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                          className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Quality Grade</label>
                        <select
                          value={item.qualityGrade || ''}
                          onChange={(e) => handleItemChange(index, 'qualityGrade', e.target.value)}
                          className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded text-sm"
                        >
                          <option value="">Select quality</option>
                          <option value="A">Grade A</option>
                          <option value="B">Grade B</option>
                          <option value="C">Grade C</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Brand</label>
                        <input
                          type="text"
                          placeholder="Brand name"
                          value={item.brand || ''}
                          onChange={(e) => handleItemChange(index, 'brand', e.target.value)}
                          className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-4">
                      <div>
                        <label className="block text-xs font-medium mb-1">GSM</label>
                        <input
                          type="text"
                          placeholder="e.g., 80"
                          value={item.gsm || ''}
                          onChange={(e) => handleItemChange(index, 'gsm', e.target.value)}
                          className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Size 1 (mm)</label>
                        <input
                          type="text"
                          placeholder="e.g., 210"
                          value={item.size1 || ''}
                          onChange={(e) => handleItemChange(index, 'size1', e.target.value)}
                          className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Size 2 (mm)</label>
                        <input
                          type="text"
                          placeholder="e.g., 297"
                          value={item.size2 || ''}
                          onChange={(e) => handleItemChange(index, 'size2', e.target.value)}
                          className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Quantity</label>
                        <input
                          type="number"
                          placeholder="Qty"
                          value={item.quantity || ''}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                          className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <div>
                        <label className="block text-xs font-medium mb-1">Packaging Mode</label>
                        <select
                          value={item.packagingMode || ''}
                          onChange={(e) => handleItemChange(index, 'packagingMode', e.target.value)}
                          className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded text-sm"
                        >
                          <option value="">Select packaging</option>
                          <option value="carton">Carton</option>
                          <option value="pallet">Pallet</option>
                          <option value="bulk">Bulk</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">FSC Type</label>
                        <select
                          value={item.fscType || ''}
                          onChange={(e) => handleItemChange(index, 'fscType', e.target.value)}
                          className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded text-sm"
                        >
                          <option value="">Select FSC Type</option>
                          <option value="fsc_certified">FSC Certified</option>
                          <option value="fsc_mixed">FSC Mixed</option>
                          <option value="non_fsc">Non FSC</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-[oklch(0.65_0_0)]">
                  <p className="text-sm">No items added yet</p>
                </div>
              )}

              <button
                onClick={handleAddItem}
                className="w-full py-2 border border-dashed border-[var(--border)] rounded-lg text-[oklch(0.90_0_0)] hover:bg-[oklch(0.24_0_0)] transition-colors text-sm font-medium"
              >
                + Add Another Item
              </button>
            </div>
          </div>

          {/* Special Remarks Section */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-[oklch(0.90_0_0)] border-b border-[var(--border)] pb-2">Special Remarks</h4>
            <textarea
              placeholder="Any special instructions or requirements"
              value={formData.specialRemarks || ''}
              onChange={(e) => setFormData({ ...formData, specialRemarks: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
            <button
              onClick={() => setShowDialog(false)}
              className="px-6 py-2 border border-[var(--border)] rounded-lg text-[oklch(0.90_0_0)] hover:bg-[oklch(0.24_0_0)] transition-colors font-medium"
            >
              Save as Draft
            </button>
            <button
              onClick={onSubmit}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Purchase Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
