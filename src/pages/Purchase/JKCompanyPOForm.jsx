import { X } from 'lucide-react'
import { useSelector } from 'react-redux'

export default function JKCompanyPOForm({
  formData,
  setFormData,
  showDialog,
  setShowDialog,
  onSubmit,
  loading = false,
  mode = 'create',
  submitLabel,
  title,
}) {
  if (!showDialog) return null

  const isDarkMode = useSelector((state) => state.theme.isDarkMode)

  const isEdit = mode === 'edit'
  const formTitle = title || (isEdit ? 'Update JK Company PO' : 'JK Company Purchase Order')
  const primaryLabel = submitLabel || (isEdit ? 'Update Purchase Order' : 'Submit Purchase Order')

  const handleAddItem = () => {
    const newItems = [...(formData.lineItems || []), {
      itemName: '',
      description: '',
      brand: '',
      itemGroup: '',
      hsnCode: '',
      qualityGrade: '',
      gsm: '',
      size1: '',
      size2: '',
      sizeType: '',
      packagingMode: '',
      quantity: '',
      numPackages: '',
      sheetsReams: '',
      reamsPerPackage: '',
      unitOfWeight: 'kg',
      reamWeight: '',
      tareWeight: '',
      netWeight: '',
      fscType: '',
      itemRemarks: '',
    }]
    setFormData({ ...formData, lineItems: newItems })
  }

  const handleRemoveItem = (index) => {
    const newItems = (formData.lineItems || []).filter((_, i) => i !== index)
    setFormData({ ...formData, lineItems: newItems })
  }

  const handleItemChange = (index, field, value) => {
    const newItems = [...(formData.lineItems || [])]
    newItems[index] = { ...newItems[index], [field]: value }

    // Auto-calc net weight when weight inputs change
    if (['reamWeight', 'tareWeight'].includes(field)) {
      const rw = parseFloat(newItems[index].reamWeight) || 0
      const tw = parseFloat(newItems[index].tareWeight) || 0
      newItems[index].netWeight = (rw - tw).toFixed(2)
    }

    setFormData({ ...formData, lineItems: newItems })
  }

  return (
    <div
      className={`fixed inset-0 ${isDarkMode ? 'bg-black/70' : 'bg-black/50'} backdrop-blur-sm flex items-center justify-center p-3 md:p-4 z-50`}
    >
      <div className="bg-card text-card-foreground rounded-xl shadow-card max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-border custom-scrollbar">
        <div className="p-4 md:p-6 border-b border-border sticky top-0 bg-card z-10 flex justify-between items-start">
          <div>
            <h3 className="text-xl md:text-2xl font-bold">{formTitle}</h3>
          </div>
          <button
            onClick={() => setShowDialog(false)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 md:p-6 space-y-6">
          {/* Basic Details Section */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-foreground border-b border-border pb-2">Purchase Order Details</h4>
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

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-2">PO Number</label>
                  <input
                    type="text"
                    placeholder="Enter PO number"
                    value={formData.poNumber || ''}
                    onChange={(e) => setFormData({ ...formData, poNumber: e.target.value })}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Document Date</label>
                  <input
                    type="date"
                    value={formData.documentDate || ''}
                    onChange={(e) => setFormData({ ...formData, documentDate: e.target.value })}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Buyer Name</label>
                  <input
                    type="text"
                    placeholder="Buyer name"
                    value={formData.buyerName || ''}
                    onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Buyer Contact</label>
                  <input
                    type="text"
                    placeholder="Contact / phone"
                    value={formData.buyerContact || ''}
                    onChange={(e) => setFormData({ ...formData, buyerContact: e.target.value })}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tax Details</label>
                  <input
                    type="text"
                    placeholder="GST / tax notes"
                    value={formData.taxDetails || ''}
                    onChange={(e) => setFormData({ ...formData, taxDetails: e.target.value })}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Supplier Address</label>
                  <textarea
                    placeholder="Supplier address"
                    value={formData.supplierAddress || ''}
                    onChange={(e) => setFormData({ ...formData, supplierAddress: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Bill To</label>
                  <textarea
                    placeholder="Billing address"
                    value={formData.billToAddress || ''}
                    onChange={(e) => setFormData({ ...formData, billToAddress: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Ship To</label>
                  <textarea
                    placeholder="Shipping address"
                    value={formData.shipToAddress || ''}
                    onChange={(e) => setFormData({ ...formData, shipToAddress: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Deliver To</label>
                  <textarea
                    placeholder="Delivery location"
                    value={formData.deliverToAddress || ''}
                    onChange={(e) => setFormData({ ...formData, deliverToAddress: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Buyer Details</label>
                  <textarea
                    placeholder="Additional buyer details"
                    value={formData.buyerDetails || ''}
                    onChange={(e) => setFormData({ ...formData, buyerDetails: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Supplier Details</label>
                  <textarea
                    placeholder="Additional supplier details"
                    value={formData.supplierDetails || ''}
                    onChange={(e) => setFormData({ ...formData, supplierDetails: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Import / Customs (Optional) */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-foreground border-b border-border pb-2">Import / Customs (Optional)</h4>
            <div className="grid gap-4 md:grid-cols-3 bg-background p-4 rounded-lg">
              <div>
                <label className="block text-sm font-medium mb-2">Country of Origin</label>
                <input
                  type="text"
                  placeholder="e.g., India"
                  value={formData.countryOfOrigin || ''}
                  onChange={(e) => setFormData({ ...formData, countryOfOrigin: e.target.value })}
                  className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Shipment Mode</label>
                <select
                  value={formData.shipmentMode || ''}
                  onChange={(e) => setFormData({ ...formData, shipmentMode: e.target.value })}
                  className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded"
                >
                  <option value="">Select mode</option>
                  <option value="sea">Sea</option>
                  <option value="air">Air</option>
                  <option value="road">Road</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Port of Loading</label>
                <input
                  type="text"
                  placeholder="Port of loading"
                  value={formData.portOfLoading || ''}
                  onChange={(e) => setFormData({ ...formData, portOfLoading: e.target.value })}
                  className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Port of Discharge</label>
                <input
                  type="text"
                  placeholder="Port of discharge"
                  value={formData.portOfDischarge || ''}
                  onChange={(e) => setFormData({ ...formData, portOfDischarge: e.target.value })}
                  className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Final Destination</label>
                <input
                  type="text"
                  placeholder="Final destination"
                  value={formData.finalDestination || ''}
                  onChange={(e) => setFormData({ ...formData, finalDestination: e.target.value })}
                  className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">BL Number</label>
                <input
                  type="text"
                  placeholder="BL number"
                  value={formData.blNumber || ''}
                  onChange={(e) => setFormData({ ...formData, blNumber: e.target.value })}
                  className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">AWB Number</label>
                <input
                  type="text"
                  placeholder="AWB number"
                  value={formData.awbNumber || ''}
                  onChange={(e) => setFormData({ ...formData, awbNumber: e.target.value })}
                  className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded"
                />
              </div>
            </div>
          </div>

          {/* Insurance Information Section */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-foreground border-b border-border pb-2">Insurance Information</h4>
            <div className="bg-background p-4 rounded-lg space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Insurance Terms</label>
                  <input
                    type="text"
                    placeholder="Insurance terms"
                    value={formData.insuranceTerms || ''}
                    onChange={(e) => setFormData({ ...formData, insuranceTerms: e.target.value })}
                    className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded"
                  />
                </div>
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
            <h4 className="text-lg font-bold mb-4 text-foreground border-b border-border pb-2">Product Line Items</h4>
            <p className="text-sm text-muted-foreground mb-4">Add products to this purchase order</p>
            
            <div className="space-y-4 bg-background p-4 rounded-lg">
              {formData.lineItems && formData.lineItems.length > 0 ? (
                formData.lineItems.map((item, index) => (
                  <div key={index} className="bg-card p-4 rounded-lg border border-border space-y-4">
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="font-semibold text-foreground">Item {index + 1}</h5>
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
                        <label className="block text-xs font-medium mb-1">Description</label>
                        <textarea
                          placeholder="Short description"
                          value={item.description || ''}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded text-sm"
                        />
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

                    <div className="grid gap-3 md:grid-cols-3">
                      <div>
                        <label className="block text-xs font-medium mb-1">Item Group</label>
                        <input
                          type="text"
                          placeholder="Optional group"
                          value={item.itemGroup || ''}
                          onChange={(e) => handleItemChange(index, 'itemGroup', e.target.value)}
                          className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">HSN Code</label>
                        <input
                          type="text"
                          placeholder="HSN code"
                          value={item.hsnCode || ''}
                          onChange={(e) => handleItemChange(index, 'hsnCode', e.target.value)}
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
                          placeholder="e.g., 21"
                          value={item.size1 || ''}
                          onChange={(e) => handleItemChange(index, 'size1', e.target.value)}
                          className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Size 2 (mm)</label>
                        <input
                          type="text"
                          placeholder="e.g., 29.7"
                          value={item.size2 || ''}
                          onChange={(e) => handleItemChange(index, 'size2', e.target.value)}
                          className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Size Type (FOL)</label>
                        <input
                          type="text"
                          placeholder="Optional size type"
                          value={item.sizeType || ''}
                          onChange={(e) => handleItemChange(index, 'sizeType', e.target.value)}
                          className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-3">
                      <div>
                        <label className="block text-xs font-medium mb-1">Mode of Packaging</label>
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
                        <label className="block text-xs font-medium mb-1">Quantity</label>
                        <input
                          type="number"
                          placeholder="Qty"
                          value={item.quantity || ''}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                          className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">No. of Packages</label>
                        <input
                          type="number"
                          placeholder="Packages"
                          value={item.numPackages || ''}
                          onChange={(e) => handleItemChange(index, 'numPackages', e.target.value)}
                          className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-3">
                      <div>
                        <label className="block text-xs font-medium mb-1">Sheets / Reams</label>
                        <input
                          type="number"
                          placeholder="Sheets or reams"
                          value={item.sheetsReams || ''}
                          onChange={(e) => handleItemChange(index, 'sheetsReams', e.target.value)}
                          className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">No. of Reams / Packages</label>
                        <input
                          type="number"
                          placeholder="Reams per package"
                          value={item.reamsPerPackage || ''}
                          onChange={(e) => handleItemChange(index, 'reamsPerPackage', e.target.value)}
                          className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Unit of Weight</label>
                        <select
                          value={item.unitOfWeight || 'kg'}
                          onChange={(e) => handleItemChange(index, 'unitOfWeight', e.target.value)}
                          className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded text-sm"
                        >
                          <option value="kg">KG</option>
                          <option value="mt">MT</option>
                          <option value="lb">LB</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-4">
                      <div>
                        <label className="block text-xs font-medium mb-1">Ream Weight ({item.unitOfWeight || 'kg'})</label>
                        <input
                          type="number"
                          placeholder="Ream weight"
                          value={item.reamWeight || ''}
                          onChange={(e) => handleItemChange(index, 'reamWeight', e.target.value)}
                          className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Tare Weight ({item.unitOfWeight || 'kg'})</label>
                        <input
                          type="number"
                          placeholder="Tare weight"
                          value={item.tareWeight || ''}
                          onChange={(e) => handleItemChange(index, 'tareWeight', e.target.value)}
                          className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Net Weight ({item.unitOfWeight || 'kg'})</label>
                        <input
                          type="number"
                          value={item.netWeight || ''}
                          readOnly
                          className="w-full px-3 py-2 input-surface focus:outline-none rounded text-sm opacity-80"
                        />
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

                    <div>
                      <label className="block text-xs font-medium mb-1">Item Remarks</label>
                      <textarea
                        placeholder="Item remarks"
                        value={item.itemRemarks || ''}
                        onChange={(e) => handleItemChange(index, 'itemRemarks', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded text-sm"
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">No items added yet</p>
                </div>
              )}

              <button
                onClick={handleAddItem}
                className="w-full py-2 border border-dashed border-border rounded-lg text-foreground hover:bg-accent transition-colors text-sm font-medium"
              >
                + Add Another Item
              </button>
            </div>
          </div>

          {/* Special Remarks Section */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-foreground border-b border-border pb-2">Special Remarks</h4>
            <textarea
              placeholder="Any special instructions or requirements"
              value={formData.specialRemarks || ''}
              onChange={(e) => setFormData({ ...formData, specialRemarks: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button
              onClick={() => setShowDialog(false)}
              className="px-6 py-2 border border-border rounded-lg text-foreground hover:bg-accent transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? (isEdit ? 'Updating...' : 'Submitting...') : primaryLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
