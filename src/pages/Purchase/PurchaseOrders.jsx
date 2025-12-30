import { useState } from 'react'
import { Plus, Eye, Search, FileText, Download } from 'lucide-react'
import PurchaseOrderForm from './PurchaseOrderForm'
import JKCompanyPOForm from './JKCompanyPOForm'
import PurchaseOrderView from './PurchaseOrderView'

// Dummy data
const dummyPurchaseOrders = [
  {
    id: 1,
    poNumber: 'PO-20251218-2595',
    type: 'jk_company',
    status: 'new',
    delivery: 'direct_to_customer',
    amount: 1000,
    deliveryDate: '2025-12-18',
    vendor: 'ABC Suppliers Ltd.',
    items: 5,
  },
  {
    id: 2,
    poNumber: 'PO/24-25/0001',
    type: 'jk_company',
    status: 'completed',
    delivery: '-',
    amount: 0,
    deliveryDate: '-',
    vendor: 'Global Trading Co.',
    items: 3,
  },
  {
    id: 3,
    poNumber: 'PO/24-25/0002',
    type: 'jk_company',
    status: 'in_transit',
    delivery: '-',
    amount: 0,
    deliveryDate: '-',
    vendor: 'Metro Supplies',
    items: 8,
  },
  {
    id: 4,
    poNumber: 'PO-20251215-1234',
    type: 'domestic',
    status: 'approved',
    delivery: 'warehouse',
    amount: 2500,
    deliveryDate: '2025-12-20',
    vendor: 'Local Vendors Inc.',
    items: 12,
  },
  {
    id: 5,
    poNumber: 'PO-20251210-5678',
    type: 'domestic',
    status: 'in_transit',
    delivery: 'direct_to_customer',
    amount: 1800,
    deliveryDate: '2025-12-22',
    vendor: 'National Traders',
    items: 6,
  },
  {
    id: 6,
    poNumber: 'PO-20251205-9012',
    type: 'import',
    status: 'pending',
    delivery: 'warehouse',
    amount: 5000,
    deliveryDate: '2026-01-15',
    vendor: 'International Exports Ltd.',
    items: 20,
  },
  {
    id: 7,
    poNumber: 'PO-20251201-3456',
    type: 'import',
    status: 'in_transit',
    delivery: 'warehouse',
    amount: 7500,
    deliveryDate: '2026-01-10',
    vendor: 'Global Imports Co.',
    items: 15,
  },
]

const typeConfig = {
  jk_company: { label: 'JK Company', color: 'bg-indigo-500/15 text-indigo-200' },
  domestic: { label: 'Domestic', color: 'bg-emerald-500/15 text-emerald-200' },
  import: { label: 'Import', color: 'bg-purple-500/15 text-purple-200' },
}

const statusConfig = {
  new: { label: 'New', color: 'bg-emerald-500/15 text-emerald-200' },
  pending: { label: 'Pending', color: 'bg-amber-500/20 text-amber-200' },
  approved: { label: 'Approved', color: 'bg-cyan-500/15 text-cyan-200' },
  in_transit: { label: 'In Transit', color: 'bg-blue-500/15 text-blue-200' },
  completed: { label: 'Completed', color: 'bg-emerald-500/20 text-emerald-100' },
  cancelled: { label: 'Cancelled', color: 'bg-rose-500/20 text-rose-100' },
}

export default function PurchaseOrders() {
  const [purchaseOrders, setPurchaseOrders] = useState(dummyPurchaseOrders)
  const [searchPO, setSearchPO] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [showDialog, setShowDialog] = useState(false)
  const [showJKDialog, setShowJKDialog] = useState(false)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    poType: 'jk_company',
    status: 'new',
    supplier: '',
    deliveryType: '',
    deliveryDate: '',
    lineItems: [{ product: '', quantity: 0, unitPrice: 0 }],
    paymentTerms: '',
    incoterms: '',
    deliveryAddress: '',
    notes: '',
  })
  const [jkFormData, setJKFormData] = useState({
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
    lineItems: [{ itemName: '', qualityGrade: '', brand: '', gsm: '', size1: '', size2: '', quantity: '', packagingMode: '', fscType: '' }],
    specialRemarks: '',
  })

  // Calculate counts
  const counts = {
    jk_company: purchaseOrders.filter(po => po.type === 'jk_company').length,
    domestic: purchaseOrders.filter(po => po.type === 'domestic').length,
    import: purchaseOrders.filter(po => po.type === 'import').length,
    total: purchaseOrders.length,
  }

  // Handle create PO
  const handleCreatePO = () => {
    setLoading(true)
    setTimeout(() => {
      // Create new PO object
      const newPO = {
        id: purchaseOrders.length + 1,
        poNumber: `PO-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 10000)}`,
        type: formData.poType,
        status: formData.status,
        delivery: formData.deliveryType,
        amount: formData.lineItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice || 0), 0),
        deliveryDate: formData.deliveryDate,
        vendor: formData.supplier,
        items: formData.lineItems.length,
      }
      
      // Add to list
      setPurchaseOrders([...purchaseOrders, newPO])
      
      // Reset form
      setFormData({
        poType: 'jk_company',
        status: 'new',
        supplier: '',
        deliveryType: '',
        deliveryDate: '',
        lineItems: [{ product: '', quantity: 0, unitPrice: 0 }],
        paymentTerms: '',
        incoterms: '',
        deliveryAddress: '',
        notes: '',
      })
      setShowDialog(false)
      setLoading(false)
    }, 500)
  }

  // Handle JK Company PO submission
  const handleJKCompanyPOSubmit = () => {
    setLoading(true)
    setTimeout(() => {
      // Create new JK Company PO
      const newPO = {
        id: purchaseOrders.length + 1,
        poNumber: `JK-PO-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 10000)}`,
        type: 'jk_company',
        status: 'new',
        delivery: jkFormData.deliveryType,
        amount: 0,
        deliveryDate: jkFormData.deliveryDate,
        vendor: jkFormData.supplyFrom,
        items: jkFormData.lineItems.length,
      }
      
      // Add to list
      setPurchaseOrders([...purchaseOrders, newPO])
      
      // Reset form
      setJKFormData({
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
        lineItems: [{ itemName: '', qualityGrade: '', brand: '', gsm: '', size1: '', size2: '', quantity: '', packagingMode: '', fscType: '' }],
        specialRemarks: '',
      })
      setShowJKDialog(false)
      setLoading(false)
    }, 500)
  }

  // Filter purchase orders
  const filteredPOs = purchaseOrders.filter(po => {
    const matchesSearch = searchPO === '' || po.poNumber.toLowerCase().includes(searchPO.toLowerCase())
    const matchesType = filterType === '' || po.type === filterType
    const matchesStatus = filterStatus === '' || po.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  return (
    <div className="space-y-6 pb-10 text-[oklch(0.95_0_0)] w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg gradient-primary shadow-glow text-[oklch(0.98_0_0)]">
              <FileText className="w-6 h-6" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[oklch(0.98_0_0)]">Purchase Orders</h2>
          </div>
          <p className="text-[oklch(0.70_0_0)] text-sm md:text-base">
            Multi-channel procurement management
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowJKDialog(true)}
            className="flex items-center gap-2 px-4 py-2 border border-[var(--border)] rounded-lg text-[oklch(0.90_0_0)] hover:bg-[oklch(0.24_0_0)] transition-colors text-sm">
            <FileText className="w-4 h-4" />
            JK Company PO
          </button>
          <button 
            onClick={() => setShowDialog(true)}
            className="flex items-center gap-2 gradient-primary text-[oklch(0.98_0_0)] px-5 py-2.5 rounded-lg font-semibold shadow-glow hover:opacity-90 transition text-sm md:text-base whitespace-nowrap">
            <Plus className="w-4 h-4" />
            Create PO
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-3">
        <div className="card-surface shadow-card-hover p-4 md:p-6">
          <div className="text-xs md:text-sm font-medium text-[oklch(0.70_0_0)] mb-1">JK Company Orders</div>
          <div className="text-xl md:text-2xl font-bold text-sky-300">{counts.jk_company}</div>
        </div>
        <div className="card-surface shadow-card-hover p-4 md:p-6">
          <div className="text-xs md:text-sm font-medium text-[oklch(0.70_0_0)] mb-1">Domestic Orders</div>
          <div className="text-xl md:text-2xl font-bold text-emerald-300">{counts.domestic}</div>
        </div>
        <div className="card-surface shadow-card-hover p-4 md:p-6">
          <div className="text-xs md:text-sm font-medium text-[oklch(0.70_0_0)] mb-1">Import Orders</div>
          <div className="text-xl md:text-2xl font-bold text-purple-300">{counts.import}</div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="card-surface shadow-card p-4 md:p-6">
        <h3 className="text-lg font-bold text-[oklch(0.96_0_0)] mb-4">Search & Filter</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[oklch(0.60_0_0)]" />
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
            <option value="domestic">Domestic</option>
            <option value="import">Import</option>
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
          <h3 className="text-lg md:text-xl font-bold text-[oklch(0.96_0_0)]">
            Purchase Orders ({filteredPOs.length})
          </h3>
        </div>

        {/* Desktop Table View - Hidden on Mobile */}
        <div className="hidden md:block overflow-x-auto custom-scrollbar max-h-[600px]">
          <table className="w-full min-w-full">
            <thead className="bg-[oklch(0.20_0_0)] border-b border-[var(--border)] sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[oklch(0.85_0_0)] uppercase whitespace-nowrap">PO Number</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[oklch(0.85_0_0)] uppercase whitespace-nowrap">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[oklch(0.85_0_0)] uppercase whitespace-nowrap">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[oklch(0.85_0_0)] uppercase whitespace-nowrap">Vendor</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[oklch(0.85_0_0)] uppercase whitespace-nowrap">Delivery</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[oklch(0.85_0_0)] uppercase whitespace-nowrap">Items</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-[oklch(0.85_0_0)] uppercase whitespace-nowrap">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[oklch(0.85_0_0)] uppercase whitespace-nowrap">Delivery Date</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-[oklch(0.85_0_0)] uppercase whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredPOs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-[oklch(0.70_0_0)]">
                    No purchase orders found
                  </td>
                </tr>
              ) : (
                filteredPOs.map((po) => {
                  const type = typeConfig[po.type] || typeConfig.domestic
                  const status = statusConfig[po.status] || statusConfig.pending

                  return (
                    <tr key={po.id} className="hover:bg-[oklch(0.24_0_0)] transition-colors">
                      <td className="px-4 py-4">
                        <div className="font-mono text-sm font-semibold text-[oklch(0.90_0_0)]">{po.poNumber}</div>
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
                        <span className="text-sm text-[oklch(0.88_0_0)]">{po.vendor}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-[oklch(0.78_0_0)]">{po.delivery}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-[oklch(0.88_0_0)]">{po.items}</span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="text-sm font-medium text-[oklch(0.90_0_0)]">
                          {po.amount > 0 ? `₹${po.amount.toLocaleString('en-IN')}` : '-'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-[oklch(0.78_0_0)]">
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
                            className="text-[oklch(0.90_0_0)] hover:text-[oklch(0.98_0_0)] hover:bg-[oklch(0.28_0_0)] p-1.5 rounded-lg transition-colors"
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
          {filteredPOs.length === 0 ? (
            <div className="px-4 py-12 text-center text-[oklch(0.70_0_0)]">
              No purchase orders found
            </div>
          ) : (
            <div className="p-3 space-y-3">
              {filteredPOs.map((po) => {
                const type = typeConfig[po.type] || typeConfig.domestic
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
        onCreate={handleCreatePO}
        loading={loading}
      />

      {/* JK Company PO Form Dialog */}
      <JKCompanyPOForm
        formData={jkFormData}
        setFormData={setJKFormData}
        showDialog={showJKDialog}
        setShowDialog={setShowJKDialog}
        onSubmit={handleJKCompanyPOSubmit}
        loading={loading}
      />

      {/* Purchase Order View Dialog */}
      <PurchaseOrderView
        selectedOrder={selectedOrder}
        showDetailDialog={showViewDialog}
        setShowDetailDialog={setShowViewDialog}
        loadingDetail={loading}
      />
    </div>
  )
}
