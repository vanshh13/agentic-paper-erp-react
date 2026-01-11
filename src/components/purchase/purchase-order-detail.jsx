import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Edit,
  Trash2,
  Save,
  X,
  FileText,
  Package,
  Truck,
  DollarSign,
  User,
  MapPin,
  FileCheck,
  Globe,
} from 'lucide-react'


import { purchaseOrderApi } from '../../services/api/purchase/purchase-order-api';
import Toast from '../ui/toast';
import Input from '../ui/input';

/* ---------------- CONFIG ---------------- */

const typeConfig = {
  jk_company: { label: 'JK Company', color: 'bg-indigo-500/20 text-indigo-400', icon: FileCheck },
  others: { label: 'Others', color: 'bg-emerald-500/20 text-emerald-400', icon: Package },
  imports: { label: 'Imports', color: 'bg-purple-500/20 text-purple-400', icon: Globe },
}

const statusConfig = {
  new: { label: 'New', color: 'bg-emerald-500/20 text-emerald-400', dotColor: 'bg-emerald-500' },
  pending: { label: 'Pending', color: 'bg-amber-500/20 text-amber-400', dotColor: 'bg-amber-500' },
  approved: { label: 'Approved', color: 'bg-cyan-500/20 text-cyan-400', dotColor: 'bg-cyan-500' },
  in_transit: { label: 'In Transit', color: 'bg-blue-500/20 text-blue-400', dotColor: 'bg-blue-500' },
  completed: { label: 'Completed', color: 'bg-emerald-500/20 text-emerald-400', dotColor: 'bg-emerald-500' },
  cancelled: { label: 'Cancelled', color: 'bg-rose-500/20 text-rose-400', dotColor: 'bg-rose-500' },
}

const deliveryConfig = {
  warehouse: { label: 'Warehouse', color: 'bg-blue-500/20 text-blue-100' },
  direct_to_customer: { label: 'Direct to Customer', color: 'bg-purple-500/20 text-purple-100' },
}

/* --------------- COMPONENTS --------------- */

const InfoField = ({ label, value }) => (
  <div>
    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">
      {label}
    </label>
    <p className="text-sm text-foreground break-words">{value || '--'}</p>
  </div>
)

const StatCard = ({ label, value, icon: Icon, color = 'bg-primary/10' }) => (
  <div className={`${color} p-4 rounded-xl border border-border`}>
    <div className="flex items-center justify-between mb-2">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
    </div>
    <p className="text-xl md:text-2xl font-bold text-foreground truncate">{value}</p>
  </div>
)

const LineItemRow = ({ item, index, isEdit, onChange }) => {
  if (isEdit) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-3 bg-card rounded-lg mb-2 border border-border">
        <div className="md:col-span-5">
          <Input
            name={`itemName-${index}`}
            value={item.itemName || ''}
            onChange={(e) => onChange(index, 'itemName', e.target.value)}
            placeholder="Item Name"
          />
        </div>
        <div className="md:col-span-3">
          <Input
            type="number"
            name={`quantity-${index}`}
            value={item.quantity || ''}
            onChange={(e) => onChange(index, 'quantity', e.target.value)}
            placeholder="Quantity"
          />
        </div>
        <div className="md:col-span-2">
          <Input
            type="number"
            name={`unitPrice-${index}`}
            value={item.unitPrice || ''}
            onChange={(e) => onChange(index, 'unitPrice', e.target.value)}
            placeholder="Unit Price"
          />
        </div>
        <div className="md:col-span-2 flex items-center justify-end">
          <span className="text-sm font-semibold text-foreground text-right">
            ₹{((item.quantity || 0) * (item.unitPrice || 0)).toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 bg-card rounded-lg mb-3 border border-border hover:bg-accent transition-colors">
      <div className="md:col-span-5">
        <p className="text-sm font-medium text-foreground mb-1">{item.itemName}</p>
        {item.description && (
          <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
        )}
      </div>
      <div className="md:col-span-3">
        <p className="text-sm text-foreground">{item.quantity?.toLocaleString('en-IN') || '0'}</p>
      </div>
      <div className="md:col-span-2">
        <p className="text-sm text-foreground">
          {item.unitPrice ? `₹${item.unitPrice.toLocaleString('en-IN')}` : '--'}
        </p>
      </div>
      <div className="md:col-span-2 flex items-center justify-end">
        <p className="text-sm font-semibold text-foreground">
          ₹{((item.quantity || 0) * (item.unitPrice || 0)).toLocaleString('en-IN')}
        </p>
      </div>
    </div>
  )
}

const JKLineItemRow = ({ item, index, isEdit, onChange }) => {
  if (isEdit) {
    return (
      <div className="space-y-3 p-4 bg-card rounded-lg mb-4 border border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Item Name"
            value={item.itemName || ''}
            onChange={(e) => onChange(index, 'itemName', e.target.value)}
          />
          <Input
            placeholder="Brand"
            value={item.brand || ''}
            onChange={(e) => onChange(index, 'brand', e.target.value)}
          />
        </div>
        <textarea
          placeholder="Description"
          value={item.description || ''}
          onChange={(e) => onChange(index, 'description', e.target.value)}
          className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground min-h-[80px] resize-none focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Input
            placeholder="Quality Grade"
            value={item.qualityGrade || ''}
            onChange={(e) => onChange(index, 'qualityGrade', e.target.value)}
          />
          <Input
            placeholder="GSM"
            value={item.gsm || ''}
            onChange={(e) => onChange(index, 'gsm', e.target.value)}
          />
          <Input
            type="number"
            placeholder="Quantity"
            value={item.quantity || ''}
            onChange={(e) => onChange(index, 'quantity', e.target.value)}
          />
          <select
            value={item.fscType || ''}
            onChange={(e) => onChange(index, 'fscType', e.target.value)}
            className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">FSC Type</option>
            <option value="fsc_certified">FSC Certified</option>
            <option value="fsc_mixed">FSC Mixed</option>
            <option value="fsc_recycled">FSC Recycled</option>
            <option value="non_fsc">Non-FSC</option>
          </select>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 bg-card rounded-lg mb-4 border border-border hover:bg-accent transition-colors">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
        <div className="flex-1">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Package className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-foreground mb-1">{item.itemName}</h4>
              {item.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
            {item.brand}
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300">
            {item.qualityGrade}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-border">
        <div>
          <span className="text-xs text-muted-foreground block mb-1">Quantity</span>
          <p className="text-sm font-medium text-foreground">{item.quantity?.toLocaleString('en-IN') || '0'}</p>
        </div>
        <div>
          <span className="text-xs text-muted-foreground block mb-1">GSM</span>
          <p className="text-sm font-medium text-foreground">{item.gsm || '--'}</p>
        </div>
        <div>
          <span className="text-xs text-muted-foreground block mb-1">FSC Type</span>
          <p className="text-sm font-medium text-foreground capitalize">
            {item.fscType?.replace(/_/g, ' ') || '--'}
          </p>
        </div>
        <div>
          <span className="text-xs text-muted-foreground block mb-1">Net Weight</span>
          <p className="text-sm font-medium text-foreground">{item.netWeight || '--'}</p>
        </div>
      </div>
    </div>
  )
}

/* --------------- TABS CONFIG --------------- */

const TABS = [
  { id: 'overview', label: 'Overview', icon: FileText },
  { id: 'line-items', label: 'Line Items', icon: Package },
  { id: 'delivery', label: 'Delivery', icon: Truck },
  { id: 'financial', label: 'Financial', icon: DollarSign },
  { id: 'vendor', label: 'Vendor', icon: User },
  { id: 'shipping', label: 'Shipping', icon: MapPin },
]

/* --------------- MAIN COMPONENT --------------- */

export default function PurchaseOrderDetail() {
  const { poId } = useParams()
  const navigate = useNavigate()

  const [purchaseOrder, setPurchaseOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditMode, setIsEditMode] = useState(false)
  const [formData, setFormData] = useState({})
  const [activeTab, setActiveTab] = useState('overview')
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  /* ---------------- LOAD DATA ---------------- */

  useEffect(() => {
    loadPurchaseOrder()
  }, [poId])

  const loadPurchaseOrder = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await purchaseOrderApi.getById(poId)
      setPurchaseOrder(data)
      setFormData(data)
    } catch (error) {
      setError('Failed to load purchase order')
    } finally {
      setLoading(false)
    }
  }

  /* --------------- HANDLE INPUT CHANGES --------------- */

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleLineItemChange = (index, field, value) => {
    const updatedLineItems = [...(formData.lineItems || [])]
    updatedLineItems[index] = {
      ...updatedLineItems[index],
      [field]: value
    }
    setFormData(prev => ({
      ...prev,
      lineItems: updatedLineItems
    }))
  }

  const handleJKDetailsChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      jkDetails: {
        ...(prev.jkDetails || {}),
        [field]: value
      }
    }))
  }

  const handleDetailsChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      details: {
        ...(prev.details || {}),
        [field]: value
      }
    }))
  }

  /* --------------- HANDLE SAVE --------------- */

  const handleSave = async () => {
    setLoading(true)
    setError('')
    try {
      // Calculate amount if line items exist
      let amount = formData.amount || 0
      if (formData.lineItems && formData.lineItems.length > 0) {
        if (formData.type === 'jk_company') {
          amount = formData.lineItems.reduce((sum, item) => {
            return sum + (parseFloat(item.quantity || 0) * 1000)
          }, 0)
        } else {
          amount = formData.lineItems.reduce((sum, item) => {
            return sum + (parseFloat(item.quantity || 0) * parseFloat(item.unitPrice || 0))
          }, 0)
        }
      }

      const payload = {
        ...formData,
        amount,
        items: formData.lineItems?.length || 0,
        deliveryDate: formData.deliveryDate || new Date().toISOString().split('T')[0]
      }

      const updatedPO = await purchaseOrderApi.update(poId, payload)
      setPurchaseOrder(updatedPO)
      setFormData(updatedPO)
      setIsEditMode(false)
      setSuccessMessage('Purchase order updated successfully')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      setError('Failed to update purchase order')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData(purchaseOrder)
    setIsEditMode(false)
  }

  /* --------------- HANDLE DELETE --------------- */

  const handleDelete = async () => {
    try {
      setLoading(true)
      await purchaseOrderApi.remove(poId)
      setSuccessMessage('Purchase order deleted successfully')
      setTimeout(() => navigate('/purchase-orders'), 1000)
    } catch (error) {
      setError('Failed to delete purchase order')
    } finally {
      setLoading(false)
      setDeleteConfirm(false)
    }
  }

  /* --------------- RENDER TAB CONTENT --------------- */

  const renderTabContent = () => {
    if (!purchaseOrder) return null

    const type = typeConfig[purchaseOrder.type] || typeConfig.others
    const status = statusConfig[purchaseOrder.status] || statusConfig.new
    const delivery = deliveryConfig[purchaseOrder.delivery] || { label: '--', color: '' }

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="Total Amount"
                value={`₹${purchaseOrder.amount?.toLocaleString('en-IN') || '0'}`}
                icon={DollarSign}
                color="bg-emerald-500/10"
              />
              <StatCard
                label="Total Items"
                value={purchaseOrder.items?.toLocaleString('en-IN') || '0'}
                icon={Package}
                color="bg-blue-500/10"
              />
              <StatCard
                label="Status"
                value={status.label}
                icon={FileText}
                color={status.color.replace('/20', '/10')}
              />
              <StatCard
                label="Delivery Type"
                value={delivery.label}
                icon={Truck}
                color="bg-purple-500/10"
              />
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5">
              {isEditMode ? (
                <>
                  <Input
                    label="PO Number"
                    name="poNumber"
                    value={formData.poNumber || ''}
                    onChange={handleInputChange}
                  />
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status || ''}
                      onChange={handleInputChange}
                      className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select</option>
                      <option value="new">New</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="in_transit">In Transit</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">
                      Type
                    </label>
                    <select
                      name="type"
                      value={formData.type || ''}
                      onChange={handleInputChange}
                      disabled={purchaseOrder.type === 'jk_company'}
                      className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                    >
                      <option value="">Select</option>
                      <option value="others">Others</option>
                      <option value="imports">Imports</option>
                    </select>
                  </div>
                  <Input
                    label="Vendor"
                    name="vendor"
                    value={formData.vendor || ''}
                    onChange={handleInputChange}
                  />
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">
                      Delivery Type
                    </label>
                    <select
                      name="delivery"
                      value={formData.delivery || ''}
                      onChange={handleInputChange}
                      className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select</option>
                      <option value="warehouse">Warehouse</option>
                      <option value="direct_to_customer">Direct to Customer</option>
                    </select>
                  </div>
                  <Input
                    label="Delivery Date"
                    name="deliveryDate"
                    type="date"
                    value={formData.deliveryDate ? formData.deliveryDate.split('T')[0] : ''}
                    onChange={handleInputChange}
                  />
                </>
              ) : (
                <>
                  <InfoField label="PO Number" value={purchaseOrder.poNumber} />
                  <InfoField label="Status" value={status.label} />
                  <InfoField label="Type" value={type.label} />
                  <InfoField label="Vendor" value={purchaseOrder.vendor} />
                  <InfoField label="Delivery Type" value={delivery.label} />
                  <InfoField label="Delivery Date" value={purchaseOrder.deliveryDate} />
                </>
              )}
            </div>
          </div>
        )

      case 'line-items':
        return (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h3 className="text-base md:text-lg font-semibold text-foreground flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" />
                Line Items
                <span className="text-xs px-2 py-1 rounded-full bg-card text-muted-foreground border border-border">
                  {purchaseOrder.items || 0} items
                </span>
              </h3>
              {isEditMode && (
                <button
                  onClick={() => {
                    const newItem = purchaseOrder.type === 'jk_company' 
                      ? { 
                          itemName: '', 
                          description: '', 
                          brand: '', 
                          quantity: '', 
                          qualityGrade: '', 
                          gsm: '', 
                          fscType: '' 
                        }
                      : { itemName: '', quantity: 0, unitPrice: 0 }
                    setFormData(prev => ({
                      ...prev,
                      lineItems: [...(prev.lineItems || []), newItem]
                    }))
                  }}
                  className="px-3 py-1.5 bg-primary hover:opacity-90 text-primary-foreground rounded-lg text-sm font-semibold transition-colors"
                >
                  + Add Item
                </button>
              )}
            </div>
            
            {purchaseOrder.type === 'jk_company' ? (
              <div className="space-y-4">
                {(formData.lineItems || []).map((item, index) => (
                  <JKLineItemRow
                    key={index}
                    item={item}
                    index={index}
                    isEdit={isEditMode}
                    onChange={handleLineItemChange}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {/* Header for desktop */}
                <div className="hidden md:grid md:grid-cols-12 gap-3 px-4 py-2 text-xs font-semibold text-muted-foreground bg-card rounded-lg border border-border">
                  <div className="md:col-span-5">Item Name</div>
                  <div className="md:col-span-3">Quantity</div>
                  <div className="md:col-span-2">Unit Price</div>
                  <div className="md:col-span-2 text-right">Total</div>
                </div>
                
                {(formData.lineItems || []).map((item, index) => (
                  <LineItemRow
                    key={index}
                    item={item}
                    index={index}
                    isEdit={isEditMode}
                    onChange={handleLineItemChange}
                  />
                ))}
                
                {/* Total */}
                <div className="mt-6 pt-4 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Subtotal</span>
                    <p className="text-lg font-bold text-foreground">
                      ₹{(formData.lineItems || []).reduce((sum, item) => 
                        sum + (parseFloat(item.quantity || 0) * parseFloat(item.unitPrice || 0)), 0
                      ).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      case 'delivery':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {isEditMode ? (
              <>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">
                    Delivery Type
                  </label>
                  <select
                    name="delivery"
                    value={formData.delivery || ''}
                    onChange={handleInputChange}
                    className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select</option>
                    <option value="warehouse">Warehouse</option>
                    <option value="direct_to_customer">Direct to Customer</option>
                  </select>
                </div>
                <Input
                  label="Delivery Date"
                  name="deliveryDate"
                  type="date"
                  value={formData.deliveryDate ? formData.deliveryDate.split('T')[0] : ''}
                  onChange={handleInputChange}
                />
                {purchaseOrder.type === 'jk_company' && (
                  <>
                    <Input
                      label="Route Code"
                      name="routeCode"
                      value={formData.jkDetails?.routeCode || ''}
                      onChange={(e) => handleJKDetailsChange('routeCode', e.target.value)}
                    />
                    <Input
                      label="Incoterms"
                      name="incoterms"
                      value={formData.jkDetails?.incoterms || ''}
                      onChange={(e) => handleJKDetailsChange('incoterms', e.target.value)}
                    />
                  </>
                )}
                {purchaseOrder.type !== 'jk_company' && (
                  <>
                    <Input
                      label="Payment Terms"
                      name="paymentTerms"
                      value={formData.details?.paymentTerms || ''}
                      onChange={(e) => handleDetailsChange('paymentTerms', e.target.value)}
                    />
                    <Input
                      label="Incoterms"
                      name="incoterms"
                      value={formData.details?.incoterms || ''}
                      onChange={(e) => handleDetailsChange('incoterms', e.target.value)}
                    />
                  </>
                )}
              </>
            ) : (
              <>
                <InfoField label="Delivery Type" value={delivery.label} />
                <InfoField label="Delivery Date" value={purchaseOrder.deliveryDate} />
                {purchaseOrder.type === 'jk_company' && purchaseOrder.jkDetails && (
                  <>
                    <InfoField label="Route Code" value={purchaseOrder.jkDetails.routeCode} />
                    <InfoField label="Incoterms" value={purchaseOrder.jkDetails.incoterms} />
                  </>
                )}
                {purchaseOrder.type !== 'jk_company' && purchaseOrder.details && (
                  <>
                    <InfoField label="Payment Terms" value={purchaseOrder.details.paymentTerms} />
                    <InfoField label="Incoterms" value={purchaseOrder.details.incoterms} />
                  </>
                )}
              </>
            )}
          </div>
        )

      case 'financial':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5">
            <InfoField
              label="Total Amount"
              value={`₹${purchaseOrder.amount?.toLocaleString('en-IN') || '0'}`}
            />
            {isEditMode ? (
              <>
                {purchaseOrder.type === 'jk_company' && (
                  <>
                    <Input
                      label="Payment Terms"
                      name="paymentTerms"
                      value={formData.jkDetails?.paymentTerms || ''}
                      onChange={(e) => handleJKDetailsChange('paymentTerms', e.target.value)}
                    />
                    <Input
                      label="Document Date"
                      name="documentDate"
                      type="date"
                      value={formData.jkDetails?.documentDate ? formData.jkDetails.documentDate.split('T')[0] : ''}
                      onChange={(e) => handleJKDetailsChange('documentDate', e.target.value)}
                    />
                  </>
                )}
                {purchaseOrder.type !== 'jk_company' && (
                  <>
                    <Input
                      label="Payment Terms"
                      name="paymentTerms"
                      value={formData.details?.paymentTerms || ''}
                      onChange={(e) => handleDetailsChange('paymentTerms', e.target.value)}
                    />
                    <Input
                      label="Document Date"
                      name="documentDate"
                      type="date"
                      value={formData.details?.documentDate ? formData.details.documentDate.split('T')[0] : ''}
                      onChange={(e) => handleDetailsChange('documentDate', e.target.value)}
                    />
                  </>
                )}
              </>
            ) : (
              <>
                {purchaseOrder.type === 'jk_company' && purchaseOrder.jkDetails && (
                  <>
                    <InfoField label="Payment Terms" value={purchaseOrder.jkDetails.paymentTerms} />
                    <InfoField label="Document Date" value={purchaseOrder.jkDetails.documentDate} />
                  </>
                )}
                {purchaseOrder.type !== 'jk_company' && purchaseOrder.details && (
                  <>
                    <InfoField label="Payment Terms" value={purchaseOrder.details.paymentTerms} />
                    <InfoField label="Document Date" value={purchaseOrder.details.documentDate} />
                  </>
                )}
              </>
            )}
          </div>
        )

      case 'vendor':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {isEditMode ? (
              <>
                <Input
                  label="Vendor Name"
                  name="vendor"
                  value={formData.vendor || ''}
                  onChange={handleInputChange}
                />
                {purchaseOrder.type === 'jk_company' && (
                  <>
                    <Input
                      label="Supplier Address"
                      name="supplierAddress"
                      value={formData.jkDetails?.supplierAddress || ''}
                      onChange={(e) => handleJKDetailsChange('supplierAddress', e.target.value)}
                    />
                    <Input
                      label="Buyer Name"
                      name="buyerName"
                      value={formData.jkDetails?.buyerName || ''}
                      onChange={(e) => handleJKDetailsChange('buyerName', e.target.value)}
                    />
                    <Input
                      label="Buyer Contact"
                      name="buyerContact"
                      value={formData.jkDetails?.buyerContact || ''}
                      onChange={(e) => handleJKDetailsChange('buyerContact', e.target.value)}
                    />
                    <Input
                      label="Tax Details"
                      name="taxDetails"
                      value={formData.jkDetails?.taxDetails || ''}
                      onChange={(e) => handleJKDetailsChange('taxDetails', e.target.value)}
                    />
                  </>
                )}
                {purchaseOrder.type !== 'jk_company' && (
                  <>
                    <Input
                      label="Supplier Contact"
                      name="supplierContact"
                      value={formData.details?.supplierContact || ''}
                      onChange={(e) => handleDetailsChange('supplierContact', e.target.value)}
                    />
                    <Input
                      label="Supplier Location"
                      name="supplierLocation"
                      value={formData.details?.supplierLocation || ''}
                      onChange={(e) => handleDetailsChange('supplierLocation', e.target.value)}
                    />
                    <Input
                      label="Buyer Name"
                      name="buyerName"
                      value={formData.details?.buyerName || ''}
                      onChange={(e) => handleDetailsChange('buyerName', e.target.value)}
                    />
                    <Input
                      label="Buyer Contact"
                      name="buyerContact"
                      value={formData.details?.buyerContact || ''}
                      onChange={(e) => handleDetailsChange('buyerContact', e.target.value)}
                    />
                  </>
                )}
              </>
            ) : (
              <>
                <InfoField label="Vendor Name" value={purchaseOrder.vendor} />
                {purchaseOrder.type === 'jk_company' && purchaseOrder.jkDetails && (
                  <>
                    <InfoField label="Supplier Address" value={purchaseOrder.jkDetails.supplierAddress} />
                    <InfoField label="Buyer Name" value={purchaseOrder.jkDetails.buyerName} />
                    <InfoField label="Buyer Contact" value={purchaseOrder.jkDetails.buyerContact} />
                    <InfoField label="Tax Details" value={purchaseOrder.jkDetails.taxDetails} />
                  </>
                )}
                {purchaseOrder.type !== 'jk_company' && purchaseOrder.details && (
                  <>
                    <InfoField label="Supplier Contact" value={purchaseOrder.details.supplierContact} />
                    <InfoField label="Supplier Location" value={purchaseOrder.details.supplierLocation} />
                    <InfoField label="Buyer Name" value={purchaseOrder.details.buyerName} />
                    <InfoField label="Buyer Contact" value={purchaseOrder.details.buyerContact} />
                  </>
                )}
              </>
            )}
          </div>
        )

      case 'shipping':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {isEditMode ? (
              <>
                {purchaseOrder.type === 'jk_company' && (
                  <>
                    <Input
                      label="Bill To Address"
                      name="billToAddress"
                      value={formData.jkDetails?.billToAddress || ''}
                      onChange={(e) => handleJKDetailsChange('billToAddress', e.target.value)}
                    />
                    <Input
                      label="Ship To Address"
                      name="shipToAddress"
                      value={formData.jkDetails?.shipToAddress || ''}
                      onChange={(e) => handleJKDetailsChange('shipToAddress', e.target.value)}
                    />
                    <Input
                      label="Deliver To Address"
                      name="deliverToAddress"
                      value={formData.jkDetails?.deliverToAddress || ''}
                      onChange={(e) => handleJKDetailsChange('deliverToAddress', e.target.value)}
                    />
                    <Input
                      label="Shipment Mode"
                      name="shipmentMode"
                      value={formData.jkDetails?.shipmentMode || ''}
                      onChange={(e) => handleJKDetailsChange('shipmentMode', e.target.value)}
                    />
                  </>
                )}
                {purchaseOrder.type === 'imports' && (
                  <>
                    <Input
                      label="Port of Loading"
                      name="portOfLoading"
                      value={formData.details?.portOfLoading || ''}
                      onChange={(e) => handleDetailsChange('portOfLoading', e.target.value)}
                    />
                    <Input
                      label="Port of Discharge"
                      name="portOfDischarge"
                      value={formData.details?.portOfDischarge || ''}
                      onChange={(e) => handleDetailsChange('portOfDischarge', e.target.value)}
                    />
                    <Input
                      label="Country of Origin"
                      name="countryOfOrigin"
                      value={formData.details?.countryOfOrigin || ''}
                      onChange={(e) => handleDetailsChange('countryOfOrigin', e.target.value)}
                    />
                    <Input
                      label="Bill of Lading"
                      name="blNumber"
                      value={formData.details?.blNumber || ''}
                      onChange={(e) => handleDetailsChange('blNumber', e.target.value)}
                    />
                  </>
                )}
                {purchaseOrder.type === 'others' && (
                  <>
                    <Input
                      label="Bill To Address"
                      name="billToAddress"
                      value={formData.details?.billToAddress || ''}
                      onChange={(e) => handleDetailsChange('billToAddress', e.target.value)}
                    />
                    <Input
                      label="Ship To Address"
                      name="shipToAddress"
                      value={formData.details?.shipToAddress || ''}
                      onChange={(e) => handleDetailsChange('shipToAddress', e.target.value)}
                    />
                    <Input
                      label="Deliver To Address"
                      name="deliverToAddress"
                      value={formData.details?.deliverToAddress || ''}
                      onChange={(e) => handleDetailsChange('deliverToAddress', e.target.value)}
                    />
                  </>
                )}
              </>
            ) : (
              <>
                {purchaseOrder.type === 'jk_company' && purchaseOrder.jkDetails && (
                  <>
                    <InfoField label="Bill To Address" value={purchaseOrder.jkDetails.billToAddress} />
                    <InfoField label="Ship To Address" value={purchaseOrder.jkDetails.shipToAddress} />
                    <InfoField label="Deliver To Address" value={purchaseOrder.jkDetails.deliverToAddress} />
                    <InfoField label="Shipment Mode" value={purchaseOrder.jkDetails.shipmentMode} />
                  </>
                )}
                {purchaseOrder.type === 'imports' && purchaseOrder.details && (
                  <>
                    <InfoField label="Port of Loading" value={purchaseOrder.details.portOfLoading} />
                    <InfoField label="Port of Discharge" value={purchaseOrder.details.portOfDischarge} />
                    <InfoField label="Country of Origin" value={purchaseOrder.details.countryOfOrigin} />
                    <InfoField label="Bill of Lading" value={purchaseOrder.details.blNumber} />
                  </>
                )}
                {purchaseOrder.type === 'others' && purchaseOrder.details && (
                  <>
                    <InfoField label="Bill To Address" value={purchaseOrder.details.billToAddress} />
                    <InfoField label="Ship To Address" value={purchaseOrder.details.shipToAddress} />
                    <InfoField label="Deliver To Address" value={purchaseOrder.details.deliverToAddress} />
                  </>
                )}
              </>
            )}
          </div>
        )

      default:
        return null
    }
  }

  if (loading && !purchaseOrder) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center text-muted-foreground">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          Loading purchase order...
        </div>
      </div>
    )
  }

  if (!purchaseOrder) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Purchase order not found</p>
          <button
            onClick={() => navigate('/purchase-orders')}
            className="text-primary hover:opacity-80 font-semibold"
          >
            Back to Purchase Orders
          </button>
        </div>
      </div>
    )
  }

  const type = typeConfig[purchaseOrder.type] || typeConfig.others
  const status = statusConfig[purchaseOrder.status] || statusConfig.new
  const TypeIcon = type.icon || FileText

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground" style={{ height: 'auto', minHeight: '100vh', overflow: 'auto' }}>
      {/* Toast Messages */}
      <Toast 
        type="error" 
        message={error} 
        isVisible={!!error} 
        onClose={() => setError('')} 
        duration={3000}
      />
      <Toast 
        type="success" 
        message={successMessage} 
        isVisible={!!successMessage} 
        onClose={() => setSuccessMessage('')} 
        duration={3000}
      />

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-foreground mb-4">Delete Purchase Order</h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete <span className="font-semibold text-foreground">{purchaseOrder.poNumber}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-destructive hover:opacity-90 text-destructive-foreground rounded-lg font-semibold transition-all disabled:opacity-50"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-secondary hover:bg-accent text-secondary-foreground rounded-lg font-semibold transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header with Tabs */}
      <div className="bg-card border-b border-border sticky top-0 z-40">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          {/* Back Button */}
          <button
            onClick={() => navigate('/purchase-orders')}
            className="flex items-center gap-2 text-primary hover:opacity-80 transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs sm:text-sm">Back</span>
          </button>

          {/* Header Content */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                <TypeIcon className="w-6 h-6 text-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-bold text-foreground mb-1">{purchaseOrder.poNumber}</h1>
                <p className="text-muted-foreground text-xs sm:text-sm mb-1 truncate">
                  {purchaseOrder.vendor} • {type.label}
                </p>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${status.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${status.dotColor}`}></span>
                  {status.label}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap justify-start sm:justify-end">
              {isEditMode ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:opacity-90 text-primary-foreground rounded-lg font-semibold transition-all disabled:opacity-50 text-sm"
                  >
                    <Save className="w-4 h-4" />
                    <span className="hidden sm:inline">Save</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary hover:bg-accent text-secondary-foreground rounded-lg font-semibold transition-all text-sm"
                  >
                    <X className="w-4 h-4" />
                    <span className="hidden sm:inline">Cancel</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditMode(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:opacity-90 text-primary-foreground rounded-lg font-semibold transition-all text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-destructive hover:opacity-90 text-destructive-foreground rounded-lg font-semibold transition-all text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 sm:gap-4 -mb-4 pb-3 border-t border-border pt-3 overflow-x-auto scrollbar-hide">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-2 sm:px-3 font-semibold text-xs sm:text-sm transition-all border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-foreground border-primary'
                    : 'text-muted-foreground border-transparent hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="bg-card rounded-lg sm:rounded-xl border border-border p-4 sm:p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  )
}