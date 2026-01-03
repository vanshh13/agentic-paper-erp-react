import { X, ChevronDown } from 'lucide-react'

export default function PurchaseOrderForm({
  formData,
  setFormData,
  showDialog,
  setShowDialog,
  onCreate,
  onSubmit,
  loading = false,
  mode = 'create',
  submitLabel,
  title,
}) {
  if (!showDialog) return null

  const isEdit = mode === 'edit'
  const formTitle = title || (isEdit ? 'Update Purchase Order' : 'Create Purchase Order')
  const primaryLabel = submitLabel || (isEdit ? 'Update Purchase Order' : 'Create Purchase Order')

  const vendorType = formData.vendorType || 'others'

  const handleAddLineItem = () => {
    const newItems = [...(formData.lineItems || []), {
      itemName: '',
      itemDescription: '',
      quality: '',
      brand: '',
      packagingMode: '',
      size1: '',
      size2: '',
      packages: '',
      gsm: '',
      sheets: '',
      reamWeight: '',
      reams: '',
      tareWeight: '',
      fscType: '',
      sizeType: '',
      specialRemarks: '',
    }]
    setFormData({ ...formData, lineItems: newItems })
  }

  const handleRemoveLineItem = (index) => {
    const newItems = formData.lineItems.filter((_, i) => i !== index)
    setFormData({ ...formData, lineItems: newItems })
  }

  const handleLineItemChange = (index, field, value) => {
    const newItems = [...formData.lineItems]
    newItems[index] = { ...newItems[index], [field]: value }
    setFormData({ ...formData, lineItems: newItems })
  }

  const calculateNetWeight = (sheets, reamWeight) => {
    const s = parseFloat(sheets) || 0
    const rw = parseFloat(reamWeight) || 0
    return (s * rw).toFixed(2)
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 md:p-4 z-50">
      <div className="bg-[oklch(0.20_0_0)] text-[oklch(0.95_0_0)] rounded-xl shadow-card max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-[var(--border)] custom-scrollbar">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-[var(--border)] sticky top-0 bg-[oklch(0.20_0_0)] z-10 flex justify-between items-start">
          <div>
            <h3 className="text-xl md:text-2xl font-bold">{formTitle}</h3>
            <p className="text-[oklch(0.75_0_0)] text-xs md:text-sm mt-1">Complete all mandatory fields marked with <span className="text-rose-300">*</span></p>
          </div>
          <button
            onClick={() => setShowDialog(false)}
            className="text-[oklch(0.70_0_0)] hover:text-[oklch(0.95_0_0)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 md:p-6 space-y-6">
          {/* STEP 1: Vendor Type Selection */}
          <div>
            <h4 className="text-lg font-bold mb-3 text-sky-300 flex items-center gap-2">
              <span className="bg-sky-300 text-[oklch(0.20_0_0)] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
              Vendor Type Selection
            </h4>
            <div className="bg-[oklch(0.18_0_0)] border border-[var(--border)] rounded-lg p-4">
              <label className="block text-sm font-medium mb-2">
                Vendor Type <span className="text-rose-300">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { value: 'others', label: 'Others' },
                  { value: 'imports', label: 'Imports' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFormData({ ...formData, vendorType: option.value })}
                    className={`p-3 rounded-lg border-2 font-medium transition-all text-center ${
                      vendorType === option.value
                        ? 'border-sky-400 bg-sky-400/10 text-sky-300'
                        : 'border-[var(--border)] bg-[oklch(0.20_0_0)] text-[oklch(0.80_0_0)] hover:border-sky-400/50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* STEP 2: Common PO Details */}
          <div>
            <h4 className="text-lg font-bold mb-3 text-emerald-300 flex items-center gap-2">
              <span className="bg-emerald-300 text-[oklch(0.20_0_0)] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
              Common Purchase Details
            </h4>
            
            <div className="space-y-4 bg-[oklch(0.18_0_0)] border border-[var(--border)] rounded-lg p-4">
              {/* Row 1: PO Number & Document Date */}
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-2">PO Number <span className="text-rose-300">*</span></label>
                  <input
                    type="text"
                    placeholder="Auto-generated"
                    value={formData.poNumber || 'PO-2025-001'}
                    disabled
                    className="w-full px-3 py-2 input-surface bg-[oklch(0.16_0_0)] cursor-not-allowed opacity-70"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Document Date <span className="text-rose-300">*</span></label>
                  <input
                    type="date"
                    value={formData.documentDate || ''}
                    onChange={(e) => setFormData({ ...formData, documentDate: e.target.value })}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                  />
                </div>
              </div>

              {/* Buyer Details */}
              <div className="border-t border-[var(--border)] pt-4">
                <h5 className="font-semibold text-[oklch(0.85_0_0)] mb-3">Buyer Details</h5>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-2">Buyer Name <span className="text-rose-300">*</span></label>
                    <input
                      type="text"
                      placeholder="Your company name"
                      value={formData.buyerName || ''}
                      onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
                      className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Contact <span className="text-rose-300">*</span></label>
                    <input
                      type="text"
                      placeholder="Contact number"
                      value={formData.buyerContact || ''}
                      onChange={(e) => setFormData({ ...formData, buyerContact: e.target.value })}
                      className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                    />
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-3 mt-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">City <span className="text-rose-300">*</span></label>
                    <input
                      type="text"
                      placeholder="City"
                      value={formData.buyerLocation || ''}
                      onChange={(e) => setFormData({ ...formData, buyerLocation: e.target.value })}
                      className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">State <span className="text-rose-300">*</span></label>
                    <input
                      type="text"
                      placeholder="State"
                      value={formData.buyerState || ''}
                      onChange={(e) => setFormData({ ...formData, buyerState: e.target.value })}
                      className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Country <span className="text-rose-300">*</span></label>
                    <input
                      type="text"
                      placeholder="Country"
                      value={formData.buyerCountry || ''}
                      onChange={(e) => setFormData({ ...formData, buyerCountry: e.target.value })}
                      className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                    />
                  </div>
                </div>
              </div>

              {/* Supplier Details */}
              <div className="border-t border-[var(--border)] pt-4">
                <h5 className="font-semibold text-[oklch(0.85_0_0)] mb-3">Supplier Details</h5>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-2">Supplier Name <span className="text-rose-300">*</span></label>
                    <input
                      type="text"
                      placeholder="Supplier name"
                      value={formData.supplierName || ''}
                      onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                      className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Contact <span className="text-rose-300">*</span></label>
                    <input
                      type="text"
                      placeholder="Contact number"
                      value={formData.supplierContact || ''}
                      onChange={(e) => setFormData({ ...formData, supplierContact: e.target.value })}
                      className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                    />
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-3 mt-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">Location <span className="text-rose-300">*</span></label>
                    <input
                      type="text"
                      placeholder="City"
                      value={formData.supplierLocation || ''}
                      onChange={(e) => setFormData({ ...formData, supplierLocation: e.target.value })}
                      className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">State <span className="text-rose-300">*</span></label>
                    <input
                      type="text"
                      placeholder="State"
                      value={formData.supplierState || ''}
                      onChange={(e) => setFormData({ ...formData, supplierState: e.target.value })}
                      className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Country <span className="text-rose-300">*</span></label>
                    <input
                      type="text"
                      placeholder="Country"
                      value={formData.supplierCountry || ''}
                      onChange={(e) => setFormData({ ...formData, supplierCountry: e.target.value })}
                      className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                    />
                  </div>
                </div>
              </div>

              {/* Incoterms */}
              <div className="border-t border-[var(--border)] pt-4">
                <label className="block text-sm font-medium mb-2">Incoterms <span className="text-rose-300">*</span></label>
                <select
                  value={formData.incoterms || ''}
                  onChange={(e) => setFormData({ ...formData, incoterms: e.target.value })}
                  className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                >
                  <option value="">Select incoterms</option>
                  <option value="fob">FOB (Free on Board)</option>
                  <option value="cif">CIF (Cost, Insurance and Freight)</option>
                  <option value="cfr">CFR (Cost and Freight)</option>
                  <option value="exw">EXW (Ex Works)</option>
                  <option value="ddp">DDP (Delivered Duty Paid)</option>
                </select>
              </div>

              {/* Addresses */}
              <div className="border-t border-[var(--border)] pt-4">
                <h5 className="font-semibold text-[oklch(0.85_0_0)] mb-3">Delivery Addresses</h5>
                <div className="grid gap-3 md:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">Bill To Address <span className="text-rose-300">*</span></label>
                    <textarea
                      placeholder="Address line, city, state, country, pincode"
                      value={formData.billToAddress || ''}
                      onChange={(e) => setFormData({ ...formData, billToAddress: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Ship To Address <span className="text-rose-300">*</span></label>
                    <textarea
                      placeholder="Address line, city, state, country, pincode"
                      value={formData.shipToAddress || ''}
                      onChange={(e) => setFormData({ ...formData, shipToAddress: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] text-sm"
                    />
                  </div>
                  <div>
                    {/* <label className="block text-sm font-medium mb-2">Deliver To Address <span className="text-rose-300">*</span></label>
                    <textarea
                      placeholder="Address line, city, state, country, pincode"
                      value={formData.deliverToAddress || ''}
                      onChange={(e) => setFormData({ ...formData, deliverToAddress: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] text-sm"
                    /> */}
                  </div>
                </div>
              </div>

              {/* Payment & Insurance */}
              <div className="border-t border-[var(--border)] pt-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-2">Payment Terms <span className="text-rose-300">*</span></label>
                    <input
                      type="text"
                      placeholder="e.g., 30 days, 2/10 net 30"
                      value={formData.paymentTerms || ''}
                      onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                      className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Insurance Terms</label>
                    <input
                      type="text"
                      placeholder="e.g., Buyer, Seller, CIF"
                      value={formData.insuranceTerms || ''}
                      onChange={(e) => setFormData({ ...formData, insuranceTerms: e.target.value })}
                      className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                    />
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-2 mt-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">Policy Number</label>
                    <input
                      type="text"
                      placeholder="Insurance policy #"
                      value={formData.policyNumber || ''}
                      onChange={(e) => setFormData({ ...formData, policyNumber: e.target.value })}
                      className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Insurer Name</label>
                    <input
                      type="text"
                      placeholder="Insurance company"
                      value={formData.insurerName || ''}
                      onChange={(e) => setFormData({ ...formData, insurerName: e.target.value })}
                      className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block text-sm font-medium mb-2">Policy Expiration Date</label>
                  <input
                    type="date"
                    value={formData.policyExpiryDate || ''}
                    onChange={(e) => setFormData({ ...formData, policyExpiryDate: e.target.value })}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                  />
                </div>
              </div>

              {/* Additional Info */}
              <div className="border-t border-[var(--border)] pt-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-2">Linked Sales Order / Contract Number</label>
                    <input
                      type="text"
                      placeholder="SO-2025-001"
                      value={formData.linkedSalesOrder || ''}
                      onChange={(e) => setFormData({ ...formData, linkedSalesOrder: e.target.value })}
                      className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Tax Rates and Amounts (%)</label>
                    <input
                      type="number"
                      placeholder="Tax %"
                      value={formData.taxRate || ''}
                      onChange={(e) => setFormData({ ...formData, taxRate: e.target.value })}
                      step="0.01"
                      className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 3: Product Details */}
          <div>
            <h4 className="text-lg font-bold mb-3 text-indigo-300 flex items-center gap-2">
              <span className="bg-indigo-300 text-[oklch(0.20_0_0)] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
              Item Details
            </h4>
            <div className="bg-[oklch(0.18_0_0)] border border-[var(--border)] rounded-lg p-4 space-y-4">
              {formData.lineItems && formData.lineItems.length > 0 ? (
                formData.lineItems.map((item, index) => (
                  <div key={index} className="bg-[oklch(0.20_0_0)] p-4 rounded-lg border border-[var(--border)] space-y-3">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-semibold text-[oklch(0.85_0_0)]">Item {index + 1}</h5>
                      <button
                        onClick={() => handleRemoveLineItem(index)}
                        className="text-sm text-rose-300 hover:text-rose-200"
                      >
                        Remove
                      </button>
                    </div>

                    {/* Row 1: Item Name, Description, Brand */}
                    <div className="grid gap-3 md:grid-cols-3">
                      <div>
                        <label className="text-xs font-medium mb-1 block">Item Name <span className="text-rose-300">*</span></label>
                        <input
                          type="text"
                          placeholder="Product name"
                          value={item.itemName || ''}
                          onChange={(e) => handleLineItemChange(index, 'itemName', e.target.value)}
                          className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium mb-1 block">Description</label>
                        <input
                          type="text"
                          placeholder="Product description"
                          value={item.description || ''}
                          onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
                          className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium mb-1 block">Brand</label>
                        <input
                          type="text"
                          placeholder="Brand"
                          value={item.brand || ''}
                          onChange={(e) => handleLineItemChange(index, 'brand', e.target.value)}
                          className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] text-sm"
                        />
                      </div>
                    </div>

                    {/* Row 2: Product Specs */}
                    <div className="grid gap-3 md:grid-cols-4">
                      <div>
                        <label className="text-xs font-medium mb-1 block">Item Group</label>
                        <select
                          value={item.itemGroup || ''}
                          onChange={(e) => handleLineItemChange(index, 'itemGroup', e.target.value)}
                          className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] text-sm"
                        >
                          <option value="">Select group</option>
                          <option value="paper">Paper</option>
                          <option value="packaging">Packaging</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium mb-1 block">HSN Code</label>
                        <input
                          type="text"
                          placeholder="HSN Code"
                          value={item.hsnCode || ''}
                          onChange={(e) => handleLineItemChange(index, 'hsnCode', e.target.value)}
                          className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium mb-1 block">GSM</label>
                        <input
                          type="number"
                          placeholder="GSM"
                          value={item.gsm || ''}
                          onChange={(e) => handleLineItemChange(index, 'gsm', e.target.value)}
                          className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium mb-1 block">Quality</label>
                        <select
                          value={item.quality || ''}
                          onChange={(e) => handleLineItemChange(index, 'quality', e.target.value)}
                          className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] text-sm"
                        >
                          <option value="">Select quality</option>
                          <option value="A">Grade A</option>
                          <option value="B">Grade B</option>
                        </select>
                      </div>
                    </div>

                    {/* Row 3: Sizes */}
                    <div className="grid gap-3 md:grid-cols-4">
                      <div>
                        <label className="text-xs font-medium mb-1 block">Size 1 (cm)</label>
                        <input
                          type="number"
                          placeholder="Width"
                          value={item.size1 || ''}
                          onChange={(e) => handleLineItemChange(index, 'size1', e.target.value)}
                          className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium mb-1 block">Size 2 (cm)</label>
                        <input
                          type="number"
                          placeholder="Height"
                          value={item.size2 || ''}
                          onChange={(e) => handleLineItemChange(index, 'size2', e.target.value)}
                          className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium mb-1 block">Size Type (FOL)</label>
                        <select
                          value={item.sizeType || ''}
                          onChange={(e) => handleLineItemChange(index, 'sizeType', e.target.value)}
                          className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] text-sm"
                        >
                          <option value="">Select size type</option>
                          <option value="A3">A3</option>
                          <option value="A4">A4</option>
                          <option value="custom">Custom</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium mb-1 block">Mode of Packaging</label>
                        <select
                          value={item.packagingMode || ''}
                          onChange={(e) => handleLineItemChange(index, 'packagingMode', e.target.value)}
                          className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] text-sm"
                        >
                          <option value="">Select mode</option>
                          <option value="carton">Carton</option>
                          <option value="ream">Ream</option>
                        </select>
                      </div>
                    </div>

                    {/* Row 4: Quantity Details */}
                    <div className="grid gap-3 md:grid-cols-4">
                      <div>
                        <label className="text-xs font-medium mb-1 block">Quantity <span className="text-rose-300">*</span></label>
                        <input
                          type="number"
                          placeholder="Qty"
                          value={item.quantity || ''}
                          onChange={(e) => handleLineItemChange(index, 'quantity', e.target.value)}
                          className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium mb-1 block">No of Packages</label>
                        <input
                          type="number"
                          placeholder="Packages"
                          value={item.packages || ''}
                          onChange={(e) => handleLineItemChange(index, 'packages', e.target.value)}
                          className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium mb-1 block">Sheets/Reams</label>
                        <input
                          type="number"
                          placeholder="Count"
                          value={item.sheets || ''}
                          onChange={(e) => handleLineItemChange(index, 'sheets', e.target.value)}
                          className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium mb-1 block">Unit of Weight</label>
                        <select
                          value={item.unitOfWeight || 'kg'}
                          onChange={(e) => handleLineItemChange(index, 'unitOfWeight', e.target.value)}
                          className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] text-sm"
                        >
                          <option value="kg">KG</option>
                          <option value="gm">GM</option>
                          <option value="mt">MT</option>
                        </select>
                      </div>
                    </div>

                    {/* Row 5: Weights */}
                    <div className="grid gap-3 md:grid-cols-4">
                      <div>
                        <label className="text-xs font-medium mb-1 block">Ream Weight (kg)</label>
                        <input
                          type="number"
                          placeholder="Weight"
                          value={item.reamWeight || ''}
                          onChange={(e) => handleLineItemChange(index, 'reamWeight', e.target.value)}
                          className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium mb-1 block">Tare Weight (kg)</label>
                        <input
                          type="number"
                          placeholder="Tare"
                          value={item.tareWeight || ''}
                          onChange={(e) => handleLineItemChange(index, 'tareWeight', e.target.value)}
                          className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium mb-1 block">Net Weight</label>
                        <input
                          type="text"
                          value={calculateNetWeight(item.sheets, item.reamWeight) + ' kg'}
                          disabled
                          className="w-full px-3 py-2 input-surface bg-[oklch(0.16_0_0)] text-sm opacity-70 cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium mb-1 block">No. of Reams/Packages</label>
                        <input
                          type="number"
                          placeholder="Count"
                          value={item.reams || ''}
                          onChange={(e) => handleLineItemChange(index, 'reams', e.target.value)}
                          className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] text-sm"
                        />
                      </div>
                    </div>

                    {/* Row 6: Remarks */}
                    <div>
                      <label className="text-xs font-medium mb-1 block">Remarks</label>
                      <textarea
                        placeholder="Special instructions or remarks"
                        value={item.specialRemarks || ''}
                        onChange={(e) => handleLineItemChange(index, 'specialRemarks', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] text-sm"
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-[oklch(0.65_0_0)]">
                  <p>No items added yet</p>
                </div>
              )}
              <button
                onClick={handleAddLineItem}
                className="w-full py-2 border border-dashed border-[var(--border)] rounded-lg text-[oklch(0.90_0_0)] hover:bg-[oklch(0.24_0_0)] transition-colors font-medium"
              >
                + Add Item
              </button>
            </div>
          </div>

          {/* STEP 4: Import-Specific Fields */}
          {vendorType === 'imports' && (
            <div>
              <h4 className="text-lg font-bold mb-3 text-amber-300 flex items-center gap-2">
                <span className="bg-amber-300 text-[oklch(0.20_0_0)] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">4</span>
                Import-Specific Details
              </h4>

              {/* Shipment Information */}
              <div className="bg-[oklch(0.18_0_0)] border border-[var(--border)] rounded-lg p-4 mb-4 space-y-4">
                <h5 className="font-semibold text-cyan-300 mb-3">Shipment & Logistics</h5>
                <div className="grid gap-3 md:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">BL Number</label>
                    <input
                      type="text"
                      placeholder="Bill of Lading #"
                      value={formData.blNumber || ''}
                      onChange={(e) => setFormData({ ...formData, blNumber: e.target.value })}
                      className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">AWB Number</label>
                    <input
                      type="text"
                      placeholder="Air Waybill #"
                      value={formData.awbNumber || ''}
                      onChange={(e) => setFormData({ ...formData, awbNumber: e.target.value })}
                      className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Country of Origin <span className="text-rose-300">*</span></label>
                    <select
                      value={formData.countryOfOrigin || ''}
                      onChange={(e) => setFormData({ ...formData, countryOfOrigin: e.target.value })}
                      className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                    >
                      <option value="">Select country</option>
                      <option value="india">India</option>
                      <option value="china">China</option>
                      <option value="usa">USA</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">Port of Loading <span className="text-rose-300">*</span></label>
                    <input
                      type="text"
                      placeholder="Departure port"
                      value={formData.portOfLoading || ''}
                      onChange={(e) => setFormData({ ...formData, portOfLoading: e.target.value })}
                      className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Port of Discharge <span className="text-rose-300">*</span></label>
                    <input
                      type="text"
                      placeholder="Arrival port"
                      value={formData.portOfDischarge || ''}
                      onChange={(e) => setFormData({ ...formData, portOfDischarge: e.target.value })}
                      className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Final Destination <span className="text-rose-300">*</span></label>
                    <input
                      type="text"
                      placeholder="Ultimate delivery location"
                      value={formData.finalDestination || ''}
                      onChange={(e) => setFormData({ ...formData, finalDestination: e.target.value })}
                      className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                    />
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">Shipment Mode <span className="text-rose-300">*</span></label>
                    <select
                      value={formData.shipmentMode || ''}
                      onChange={(e) => setFormData({ ...formData, shipmentMode: e.target.value })}
                      className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                    >
                      <option value="">Select mode</option>
                      <option value="sea">Sea Freight</option>
                      <option value="air">Air Freight</option>
                      <option value="road">Road</option>
                      <option value="rail">Rail</option>
                      <option value="courier">Courier</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Shipping Line/Carrier Name</label>
                    <input
                      type="text"
                      placeholder="Shipping company"
                      value={formData.shippingLine || ''}
                      onChange={(e) => setFormData({ ...formData, shippingLine: e.target.value })}
                      className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Vessel/Flight Name</label>
                    <input
                      type="text"
                      placeholder="Ship/Flight name"
                      value={formData.vesselName || ''}
                      onChange={(e) => setFormData({ ...formData, vesselName: e.target.value })}
                      className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                    />
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">B/L Date</label>
                    <input
                      type="date"
                      value={formData.blDate || ''}
                      onChange={(e) => setFormData({ ...formData, blDate: e.target.value })}
                      className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">ETD (Estimated Departure)</label>
                    <input
                      type="date"
                      value={formData.etd || ''}
                      onChange={(e) => setFormData({ ...formData, etd: e.target.value })}
                      className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">ETA (Estimated Arrival)</label>
                    <input
                      type="date"
                      value={formData.eta || ''}
                      onChange={(e) => setFormData({ ...formData, eta: e.target.value })}
                      className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                    />
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">Actual Arrival Date</label>
                    <input
                      type="date"
                      value={formData.actualArrivalDate || ''}
                      onChange={(e) => setFormData({ ...formData, actualArrivalDate: e.target.value })}
                      className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Container Number(s)</label>
                    <input
                      type="text"
                      placeholder="Container #"
                      value={formData.containerNumber || ''}
                      onChange={(e) => setFormData({ ...formData, containerNumber: e.target.value })}
                      className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Container Type/Size</label>
                    <select
                      value={formData.containerType || ''}
                      onChange={(e) => setFormData({ ...formData, containerType: e.target.value })}
                      className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                    >
                      <option value="">Select size</option>
                      <option value="20ft">20ft</option>
                      <option value="40ft">40ft</option>
                      <option value="40fthc">40ft HC</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-2">Net Weight</label>
                    <input
                      type="number"
                      placeholder="Weight of goods only"
                      value={formData.netWeightImport || ''}
                      onChange={(e) => setFormData({ ...formData, netWeightImport: e.target.value })}
                      className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Volume/CBM (Cubic Meters)</label>
                    <input
                      type="number"
                      placeholder="Volume"
                      value={formData.volumeCbm || ''}
                      onChange={(e) => setFormData({ ...formData, volumeCbm: e.target.value })}
                      className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                    />
                  </div>
                </div>
              </div>

              {/* Import Compliance & Customs */}
              <div className="bg-[oklch(0.18_0_0)] border border-[var(--border)] rounded-lg p-4 mb-4 space-y-4">
                <h5 className="font-semibold text-cyan-300 mb-3">Import Compliance & Customs</h5>
                <div className="grid gap-3 md:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">IEC Number</label>
                    <input
                      type="text"
                      placeholder="IEC #"
                      value={formData.iecNumber || ''}
                      onChange={(e) => setFormData({ ...formData, iecNumber: e.target.value })}
                      className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">PIMS Registration Number</label>
                    <input
                      type="text"
                      placeholder="PIMS #"
                      value={formData.pimsNumber || ''}
                      onChange={(e) => setFormData({ ...formData, pimsNumber: e.target.value })}
                      className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Currency <span className="text-rose-300">*</span></label>
                    <select
                      value={formData.currency || ''}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                    >
                      <option value="">Select currency</option>
                      <option value="inr">INR</option>
                      <option value="usd">USD</option>
                      <option value="eur">EUR</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">Exchange Rate (Fixed)</label>
                    <input
                      type="number"
                      placeholder="Rate"
                      step="0.01"
                      value={formData.exchangeRate || ''}
                      onChange={(e) => setFormData({ ...formData, exchangeRate: e.target.value })}
                      className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Customs Duty Rate (%)</label>
                    <input
                      type="number"
                      placeholder="Duty %"
                      step="0.01"
                      value={formData.customsDutyRate || ''}
                      onChange={(e) => setFormData({ ...formData, customsDutyRate: e.target.value })}
                      className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Customs Duty Amount</label>
                    <input
                      type="number"
                      placeholder="Amount"
                      value={formData.customsDutyAmount || ''}
                      onChange={(e) => setFormData({ ...formData, customsDutyAmount: e.target.value })}
                      className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Amount in Local Currency</label>
                  <input
                    type="number"
                    placeholder="Calculated amount in local currency"
                    value={formData.amountInLocalCurrency || ''}
                    onChange={(e) => setFormData({ ...formData, amountInLocalCurrency: e.target.value })}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                  />
                </div>
              </div>

              {/* Insurance Details */}
              <div className="bg-[oklch(0.18_0_0)] border border-[var(--border)] rounded-lg p-4 mb-4 space-y-4">
                <h5 className="font-semibold text-cyan-300 mb-3">Insurance Details</h5>
                <div className="grid gap-3 md:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">Insurance Policy Number</label>
                    <input
                      type="text"
                      placeholder="Policy #"
                      value={formData.insurancePolicyNumber || ''}
                      onChange={(e) => setFormData({ ...formData, insurancePolicyNumber: e.target.value })}
                      className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Insurance Amount</label>
                    <input
                      type="number"
                      placeholder="Insured value"
                      value={formData.insuranceAmount || ''}
                      onChange={(e) => setFormData({ ...formData, insuranceAmount: e.target.value })}
                      className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Insurance Company</label>
                    <input
                      type="text"
                      placeholder="Insurer name"
                      value={formData.insuranceCompany || ''}
                      onChange={(e) => setFormData({ ...formData, insuranceCompany: e.target.value })}
                      className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Insurance Premium</label>
                  <input
                    type="number"
                    placeholder="Cost of insurance"
                    value={formData.insurancePremium || ''}
                    onChange={(e) => setFormData({ ...formData, insurancePremium: e.target.value })}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                  />
                </div>
              </div>

              {/* Landing & Clearing Charges */}
              <div className="bg-[oklch(0.18_0_0)] border border-[var(--border)] rounded-lg p-4 space-y-4">
                <h5 className="font-semibold text-cyan-300 mb-3">Landing & Clearing Charges</h5>
                <div className="grid gap-3 md:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">CHA/Clearing Agent Name <span className="text-rose-300">*</span></label>
                    <input
                      type="text"
                      placeholder="Agent name"
                      value={formData.chaName || ''}
                      onChange={(e) => setFormData({ ...formData, chaName: e.target.value })}
                      className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">CHA Charges</label>
                    <input
                      type="number"
                      placeholder="Amount"
                      value={formData.chaCharges || ''}
                      onChange={(e) => setFormData({ ...formData, chaCharges: e.target.value })}
                      className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Port Handling Charges</label>
                    <input
                      type="number"
                      placeholder="Amount"
                      value={formData.portHandlingCharges || ''}
                      onChange={(e) => setFormData({ ...formData, portHandlingCharges: e.target.value })}
                      className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                    />
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">Storage/Demurrage Charges</label>
                    <input
                      type="number"
                      placeholder="Amount"
                      value={formData.storageCharges || ''}
                      onChange={(e) => setFormData({ ...formData, storageCharges: e.target.value })}
                      className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Inspection Charges</label>
                    <input
                      type="number"
                      placeholder="Amount"
                      value={formData.inspectionCharges || ''}
                      onChange={(e) => setFormData({ ...formData, inspectionCharges: e.target.value })}
                      className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Documentation Charges</label>
                    <input
                      type="number"
                      placeholder="Amount"
                      value={formData.documentationCharges || ''}
                      onChange={(e) => setFormData({ ...formData, documentationCharges: e.target.value })}
                      className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Other Landing Costs</label>
                  <textarea
                    placeholder="Miscellaneous charges (freight surcharge, handling etc.)"
                    value={formData.otherLandingCosts || ''}
                    onChange={(e) => setFormData({ ...formData, otherLandingCosts: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
            <button
              onClick={() => setShowDialog(false)}
              className="px-6 py-2 border border-[var(--border)] rounded-lg text-[oklch(0.90_0_0)] hover:bg-[oklch(0.24_0_0)] transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit || onCreate}
              disabled={loading}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? (isEdit ? 'Updating...' : 'Creating...') : primaryLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
