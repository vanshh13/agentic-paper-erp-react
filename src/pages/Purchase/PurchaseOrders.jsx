import { useEffect, useState } from 'react'
import { Plus, Eye, Search, FileText } from 'lucide-react'
import ConfirmationModal from '../../components/ui/ConfirmationModal'
import Toast from '../../components/ui/Toast'
import PurchaseOrderForm from './PurchaseOrderForm'
import JKCompanyPOForm from './JKCompanyPOForm'
import PurchaseOrderView from './PurchaseOrderView'
import { purchaseOrderApi } from '../../services/api/purchase/purchase-order-api'

const typeConfig = {
  jk_company: { label: 'JK Company', color: 'bg-indigo-500/20 text-black dark:text-indigo-400' },
  others: { label: 'Others', color: 'bg-emerald-500/20 text-black dark:text-emerald-400' },
  imports: { label: 'Imports', color: 'bg-purple-500/20 text-black dark:text-purple-400' },
}

const statusConfig = {
  new: { label: 'New', color: 'bg-emerald-500/20 text-black dark:text-emerald-400' },
  pending: { label: 'Pending', color: 'bg-amber-500/20 text-black dark:text-amber-400' },
  approved: { label: 'Approved', color: 'bg-cyan-500/20 text-black dark:text-cyan-400' },
  in_transit: { label: 'In Transit', color: 'bg-blue-500/20 text-black dark:text-blue-400' },
  completed: { label: 'Completed', color: 'bg-emerald-500/20 text-black dark:text-emerald-400' },
  cancelled: { label: 'Cancelled', color: 'bg-rose-500/20 text-black dark:text-rose-400' },
}

const baseFormData = {
  vendorType: 'others',
  poType: 'others',
  status: 'new',
  supplier: '',
  supplierName: '',
  deliveryType: '',
  deliveryDate: '',
  lineItems: [],
  paymentTerms: '',
  incoterms: '',
  deliveryAddress: '',
  notes: '',
}

const blankJKLineItem = {
  itemName: '',
  qualityGrade: '',
  brand: '',
  gsm: '',
  size1: '',
  size2: '',
  quantity: '',
  packagingMode: '',
  fscType: '',
}

const baseJKFormData = {
  unit: '',
  division: '',
  supplyFrom: '',
  incoterms: '',
  deliveryType: '',
  deliveryDate: '',
  routeCode: '',
  paymentTerms: '',
  policyNumber: '',
  insurerName: '',
  policyExpiry: '',
  lineItems: [blankJKLineItem],
  specialRemarks: '',
}

export default function PurchaseOrders() {
  const [purchaseOrders, setPurchaseOrders] = useState([])
  const [searchPO, setSearchPO] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [showDialog, setShowDialog] = useState(false)
  const [showJKDialog, setShowJKDialog] = useState(false)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState(baseFormData)
  const [jkFormData, setJKFormData] = useState(baseJKFormData)
  const [formMode, setFormMode] = useState('create')
  const [jkFormMode, setJKFormMode] = useState('create')
  const [editingPO, setEditingPO] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [toastState, setToastState] = useState({ isVisible: false, message: '', type: 'success' })
  const [loadingList, setLoadingList] = useState(false)

  // Calculate counts
  const counts = {
    jk_company: purchaseOrders.filter(po => po.type === 'jk_company').length,
    others: purchaseOrders.filter(po => po.type === 'others').length,
    imports: purchaseOrders.filter(po => po.type === 'imports').length,
    total: purchaseOrders.length,
  }

  const showToastMessage = (message, type = 'success') => {
    setToastState({ isVisible: true, message, type })
  }

  const closeToast = () => setToastState((prev) => ({ ...prev, isVisible: false }))

  useEffect(() => {
    const fetchOrders = async () => {
      setLoadingList(true)
      try {
        const data = await purchaseOrderApi.getAll()
        setPurchaseOrders(data)
      } catch (error) {
        showToastMessage('Failed to load purchase orders', 'error')
      } finally {
        setLoadingList(false)
      }
    }

    fetchOrders()
  }, [])

  const resetStandardForm = () => {
    setFormData({ ...baseFormData })
    setFormMode('create')
  }

  const resetJKForm = () => {
    setJKFormData({
      ...baseJKFormData,
      lineItems: baseJKFormData.lineItems.map((item) => ({ ...item })),
    })
    setJKFormMode('create')
  }

  const handleSubmitStandardPO = async () => {
    setLoading(true)
    try {
      const hasLineItems = formData.lineItems && formData.lineItems.length > 0
      const amount = hasLineItems
        ? formData.lineItems.reduce((sum, item) => sum + (parseFloat(item.quantity || 0) * parseFloat(item.unitPrice || 0)), 0)
        : editingPO?.amount || 0
      const itemsCount = hasLineItems ? formData.lineItems.length : editingPO?.items || 0
      const payload = {
        type: formData.vendorType === 'imports' ? 'imports' : 'others',
        delivery: formData.deliveryType || 'warehouse',
        amount: amount || 0,
        deliveryDate: formData.deliveryDate || formData.documentDate || new Date().toISOString().split('T')[0],
        vendor: formData.supplierName || formData.supplier || 'Unknown Vendor',
        items: itemsCount,
        lineItems: hasLineItems ? formData.lineItems : editingPO?.lineItems || [],
        details: { ...formData },
      }

      if (formMode === 'edit' && editingPO) {
        const updatedPO = await purchaseOrderApi.update(editingPO.id, payload)
        setPurchaseOrders((prev) => prev.map((po) => (po.id === editingPO.id ? updatedPO : po)))
        setSelectedOrder(updatedPO)
        showToastMessage('Purchase order updated successfully', 'success')
      } else {
        const newPO = await purchaseOrderApi.create({
          poNumber: `PO-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 10000)}`,
          ...payload,
        })
        setPurchaseOrders((prev) => [...prev, newPO])
        showToastMessage('Purchase order created successfully', 'success')
      }

      resetStandardForm()
      setEditingPO(null)
      setShowDialog(false)
      setShowViewDialog(false)
    } catch (error) {
      showToastMessage('Failed to save purchase order', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitJKCompanyPO = async () => {
    setLoading(true)
    try {
      const hasLineItems = jkFormData.lineItems && jkFormData.lineItems.length > 0
      const payload = {
        type: 'jk_company',
        delivery: jkFormData.deliveryType || 'warehouse',
        amount: hasLineItems
          ? jkFormData.lineItems.reduce((sum, item) => sum + (parseFloat(item.quantity || 0)), 0)
          : editingPO?.amount || 0,
        deliveryDate: jkFormData.deliveryDate || new Date().toISOString().split('T')[0],
        vendor: jkFormData.supplyFrom || 'JK Paper Supplier',
        items: hasLineItems ? jkFormData.lineItems.length : editingPO?.items || 0,
        lineItems: hasLineItems ? jkFormData.lineItems : editingPO?.lineItems || [],
        jkDetails: { ...jkFormData },
      }

      if (jkFormMode === 'edit' && editingPO) {
        const updatedPO = await purchaseOrderApi.update(editingPO.id, payload)
        setPurchaseOrders((prev) => prev.map((po) => (po.id === editingPO.id ? updatedPO : po)))
        setSelectedOrder(updatedPO)
        showToastMessage('Purchase order updated successfully', 'success')
      } else {
        const newPO = await purchaseOrderApi.create({
          poNumber: `JK-PO-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 10000)}`,
          ...payload,
        })
        setPurchaseOrders((prev) => [...prev, newPO])
        showToastMessage('Purchase order created successfully', 'success')
      }

      resetJKForm()
      setEditingPO(null)
      setShowJKDialog(false)
      setShowViewDialog(false)
    } catch (error) {
      showToastMessage('Failed to save purchase order', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleEditFromView = (order) => {
    setEditingPO(order)
    setSelectedOrder(order)

    if (order.type === 'jk_company') {
      setJKFormMode('edit')
      const details = order.jkDetails || {}
      setJKFormData({
        ...baseJKFormData,
        ...details,
        supplyFrom: details.supplyFrom || order.vendor || '',
        deliveryType: order.delivery || details.deliveryType || '',
        deliveryDate: order.deliveryDate && order.deliveryDate !== '-' ? order.deliveryDate : details.deliveryDate || '',
        lineItems: order.lineItems?.length
          ? order.lineItems
          : details.lineItems?.length
            ? details.lineItems
            : [{ ...blankJKLineItem }],
      })
      setShowJKDialog(true)
    } else {
      const vendorType = order.type === 'imports' ? 'imports' : 'others'
      setFormMode('edit')
      const details = order.details || {}
      setFormData({
        ...baseFormData,
        ...details,
        vendorType,
        poType: vendorType,
        status: order.status || details.status || 'new',
        supplier: details.supplier || order.vendor || '',
        supplierName: details.supplierName || order.vendor || '',
        deliveryType: order.delivery || details.deliveryType || '',
        deliveryDate: order.deliveryDate && order.deliveryDate !== '-' ? order.deliveryDate : details.deliveryDate || '',
        lineItems: order.lineItems?.length
          ? order.lineItems
          : details.lineItems?.length
            ? details.lineItems
            : [],
        paymentTerms: details.paymentTerms || '',
        incoterms: details.incoterms || '',
      })
      setShowDialog(true)
    }

    setShowViewDialog(false)
  }

  const handleRequestDelete = (order) => {
    setDeleteTarget(order)
    setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = () => {
    if (!deleteTarget) return

    purchaseOrderApi.remove(deleteTarget.id)
      .then(() => {
        setPurchaseOrders((prev) => prev.filter((po) => po.id !== deleteTarget.id))
        setSelectedOrder(null)
        setEditingPO(null)
        setShowViewDialog(false)
        showToastMessage('Purchase order deleted successfully', 'success')
      })
      .catch(() => {
        showToastMessage('Failed to delete purchase order', 'error')
      })
      .finally(() => {
        setShowDeleteConfirm(false)
        setDeleteTarget(null)
      })
  }

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false)
    setDeleteTarget(null)
  }

  // Filter purchase orders
  const filteredPOs = purchaseOrders.filter(po => {
    const matchesSearch = searchPO === '' || po.poNumber.toLowerCase().includes(searchPO.toLowerCase())
    const matchesType = filterType === '' || po.type === filterType
    const matchesStatus = filterStatus === '' || po.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  return (
    <div className="space-y-6 pb-10 text-foreground w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg gradient-primary shadow-glow text-foreground">
              <FileText className="w-6 h-6" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Purchase Orders</h2>
          </div>
          <p className="text-muted-foreground text-sm md:text-base">
            Multi-channel procurement management
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => {
              resetJKForm()
              setEditingPO(null)
              setShowJKDialog(true)
            }}
            className="flex items-center gap-2 px-4 py-2 border border-[var(--border)] rounded-lg text-foreground hover:bg-accent transition-colors text-sm">
            <FileText className="w-4 h-4" />
            JK Company PO
          </button>
          <button 
            onClick={() => {
              resetStandardForm()
              setEditingPO(null)
              setShowDialog(true)
            }}
            className="flex items-center gap-2 gradient-primary text-white px-5 py-2.5 rounded-lg font-semibold shadow-glow hover:opacity-90 transition text-sm md:text-base whitespace-nowrap">
            <Plus className="w-4 h-4" />
            Create PO
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-3">
        <div className="card-surface shadow-card-hover p-4 md:p-6">
          <div className="text-xs md:text-sm font-medium text-muted-foreground mb-1">JK Company Orders</div>
          <div className="text-xl md:text-2xl font-bold text-sky-300">{counts.jk_company}</div>
        </div>
        <div className="card-surface shadow-card-hover p-4 md:p-6">
          <div className="text-xs md:text-sm font-medium text-muted-foreground mb-1">Others Orders</div>
          <div className="text-xl md:text-2xl font-bold text-emerald-300">{counts.others}</div>
        </div>
        <div className="card-surface shadow-card-hover p-4 md:p-6">
          <div className="text-xs md:text-sm font-medium text-muted-foreground mb-1">Imports Orders</div>
          <div className="text-xl md:text-2xl font-bold text-purple-300">{counts.imports}</div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="card-surface shadow-card p-4 md:p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Search & Filter</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by PO number..."
              value={searchPO}
              onChange={(e) => setSearchPO(e.target.value)}
              className="w-full pl-10 pr-4 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded-lg"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded-lg"
          >
            <option value="">All Types</option>
            <option value="jk_company">JK Company</option>
            <option value="others">Others</option>
            <option value="imports">Imports</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 input-surface focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.18_280)] rounded-lg"
          >
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="in_transit">In Transit</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Purchase Orders List */}
      <div className="card-surface shadow-card overflow-hidden">
        <div className="p-4 md:p-6 border-b border-[var(--border)]">
          <h3 className="text-lg md:text-xl font-bold text-foreground">
            Purchase Orders ({filteredPOs.length})
          </h3>
        </div>

        {/* Desktop Table View - Hidden on Mobile */}
        <div className="hidden md:block overflow-x-auto custom-scrollbar max-h-[600px]">
          <table className="w-full min-w-full">
            <thead className="bg-card border-b border-[var(--border)] sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase whitespace-nowrap">PO Number</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase whitespace-nowrap">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase whitespace-nowrap">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase whitespace-nowrap">Vendor</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase whitespace-nowrap">Delivery</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase whitespace-nowrap">Items</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase whitespace-nowrap">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase whitespace-nowrap">Delivery Date</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {loadingList ? (
                <tr>
                  <td colSpan={9} className="px-6 py-6 text-center text-muted-foreground">
                    Loading purchase orders...
                  </td>
                </tr>
              ) : filteredPOs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-muted-foreground">
                    No purchase orders found
                  </td>
                </tr>
              ) : (
                filteredPOs.map((po) => {
                  const type = typeConfig[po.type] || typeConfig.others
                  const status = statusConfig[po.status] || statusConfig.pending

                  return (
                    <tr key={po.id} className="hover:bg-accent transition-colors">
                      <td className="px-4 py-4">
                        <div className="font-mono text-sm font-semibold text-foreground">{po.poNumber}</div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium ${type.color}`}>
                          {type.label}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-foreground">{po.vendor}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-foreground">{po.delivery}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-foreground">{po.items}</span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="text-sm font-medium text-foreground">
                          {po.amount > 0 ? `₹${po.amount.toLocaleString('en-IN')}` : '-'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-foreground">
                          {po.deliveryDate !== '-' ? new Date(po.deliveryDate).toLocaleDateString('en-IN') : '-'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedOrder(po)
                              setShowViewDialog(true)
                            }}
                            className="text-foreground hover:text-foreground hover:bg-accent p-1.5 rounded-lg transition-colors"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View - Hidden on Desktop */}
        <div className="md:hidden max-h-[600px] overflow-y-auto custom-scrollbar">
          {loadingList ? (
            <div className="px-4 py-12 text-center text-[oklch(0.70_0_0)]">
              Loading purchase orders...
            </div>
          ) : filteredPOs.length === 0 ? (
            <div className="px-4 py-12 text-center text-[oklch(0.70_0_0)]">
              No purchase orders found
            </div>
          ) : (
            <div className="p-3 space-y-3">
              {filteredPOs.map((po) => {
                const type = typeConfig[po.type] || typeConfig.others
                const status = statusConfig[po.status] || statusConfig.pending

                return (
                  <div
                    key={po.id}
                    className="bg-[oklch(0.18_0_0)] border border-[var(--border)] rounded-lg p-4 space-y-3 hover:bg-[oklch(0.22_0_0)] transition-colors"
                  >
                    {/* Header Row */}
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-sm font-bold text-[oklch(0.92_0_0)] truncate">
                          {po.poNumber}
                        </div>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${type.color}`}>
                            {type.label}
                          </span>
                          <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${status.color}`}>
                            {status.label}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedOrder(po)
                          setShowViewDialog(true)
                        }}
                        className="text-[oklch(0.90_0_0)] hover:text-[oklch(0.98_0_0)] hover:bg-[oklch(0.28_0_0)] p-2 rounded-lg transition-colors flex-shrink-0"
                        title="View details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-xs text-[oklch(0.65_0_0)] mb-0.5">Vendor</div>
                        <div className="text-[oklch(0.88_0_0)] truncate">{po.vendor}</div>
                      </div>
                      <div>
                        <div className="text-xs text-[oklch(0.65_0_0)] mb-0.5">Items</div>
                        <div className="text-[oklch(0.88_0_0)]">{po.items}</div>
                      </div>
                      <div>
                        <div className="text-xs text-[oklch(0.65_0_0)] mb-0.5">Amount</div>
                        <div className="text-[oklch(0.90_0_0)] font-semibold">
                          {po.amount > 0 ? `₹${po.amount.toLocaleString('en-IN')}` : '-'}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-[oklch(0.65_0_0)] mb-0.5">Delivery</div>
                        <div className="text-[oklch(0.88_0_0)] truncate capitalize">
                          {po.delivery}
                        </div>
                      </div>
                    </div>

                    {/* Delivery Date */}
                    <div className="pt-2 border-t border-[var(--border)]">
                      <div className="text-xs text-[oklch(0.65_0_0)] mb-0.5">Delivery Date</div>
                      <div className="text-sm text-[oklch(0.78_0_0)]">
                        {po.deliveryDate !== '-' ? new Date(po.deliveryDate).toLocaleDateString('en-IN') : '-'}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Purchase Order Form Dialog */}
      <PurchaseOrderForm
        formData={formData}
        setFormData={setFormData}
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        onSubmit={handleSubmitStandardPO}
        mode={formMode}
        submitLabel={formMode === 'edit' ? 'Update Purchase Order' : undefined}
        title={formMode === 'edit' ? 'Update Details' : undefined}
        loading={loading}
      />

      {/* JK Company PO Form Dialog */}
      <JKCompanyPOForm
        formData={jkFormData}
        setFormData={setJKFormData}
        showDialog={showJKDialog}
        setShowDialog={setShowJKDialog}
        onSubmit={handleSubmitJKCompanyPO}
        mode={jkFormMode}
        submitLabel={jkFormMode === 'edit' ? 'Update Purchase Order' : undefined}
        title={jkFormMode === 'edit' ? 'Update Details' : undefined}
        loading={loading}
      />

      {/* Purchase Order View Dialog */}
      <PurchaseOrderView
        selectedOrder={selectedOrder}
        showDetailDialog={showViewDialog}
        setShowDetailDialog={setShowViewDialog}
        loadingDetail={loading}
        onEdit={handleEditFromView}
        onDelete={handleRequestDelete}
      />

      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete purchase order?"
        message={`Are you sure you want to delete ${deleteTarget?.poNumber || 'this purchase order'}?`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      <Toast
        message={toastState.message}
        type={toastState.type}
        isVisible={toastState.isVisible}
        onClose={closeToast}
      />
    </div>
  )
}
