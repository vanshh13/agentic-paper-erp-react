import { X, FileText, Package, MapPin, Calendar, DollarSign, Truck, Edit, Trash2 } from 'lucide-react'

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

export default function PurchaseOrderView({
  selectedOrder,
  showDetailDialog,
  setShowDetailDialog,
  loadingDetail = false,
  onEdit = () => {},
  onDelete = () => {},
}) {
  if (!showDetailDialog || !selectedOrder) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 md:p-4 z-50 overflow-y-auto">
      <div className="bg-card text-foreground rounded-xl shadow-card max-w-4xl w-full my-8 border border-[var(--border)]">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-[var(--border)] flex justify-between items-start gap-4 sticky top-0 bg-card z-10 rounded-t-xl">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl md:text-2xl font-bold">Purchase Order Details</h3>
            <p className="text-muted-foreground text-xs md:text-sm mt-1 font-mono">{selectedOrder.poNumber}</p>
          </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
            {/* Edit Button */}
            <button
              onClick={() => onEdit(selectedOrder)}
              className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-lg text-xs md:text-sm font-semibold hover:bg-indigo-500/20 transition-all"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Update</span>
            </button>

            {/* Delete Button */}
            <button
              onClick={() => onDelete(selectedOrder)}
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
              }}
              className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-accent transition-colors">
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>

        <div className="p-4 md:p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto custom-scrollbar">
          {/* PO Information */}
          <div>
            <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              PO Information
            </h4>
            <div className="grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-2 card-surface p-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">PO Number</label>
                <p className="font-mono text-sm font-semibold text-foreground">{selectedOrder.poNumber}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Status</label>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${statusConfig[selectedOrder.status]?.color}`}>
                  {statusConfig[selectedOrder.status]?.label || selectedOrder.status}
                </span>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">PO Type</label>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${typeConfig[selectedOrder.type]?.color}`}>
                  {typeConfig[selectedOrder.type]?.label || selectedOrder.type}
                </span>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Total Amount</label>
                <p className="text-lg font-bold text-cyan-300">₹{selectedOrder.amount.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>

          {/* Supplier & Delivery Details */}
          <div>
            <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Truck className="w-5 h-5 text-cyan-400" />
              Supplier & Delivery
            </h4>
            <div className="grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-2 card-surface p-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Vendor / Supplier</label>
                <p className="text-sm">{selectedOrder.vendor || '-'}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Delivery Type</label>
                <p className="text-sm capitalize">{selectedOrder.delivery || '-'}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Requested Delivery Date
                </label>
                <p className="text-sm">
                  {selectedOrder.deliveryDate && selectedOrder.deliveryDate !== '-'
                    ? new Date(selectedOrder.deliveryDate).toLocaleDateString('en-IN')
                    : '-'}
                </p>
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div>
            <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-400" />
              Line Items
            </h4>
            <div className="card-surface p-4 space-y-3">
              <div className="flex justify-between items-center text-xs font-medium text-muted-foreground">
                <span>Total Items: {selectedOrder.items}</span>
              </div>
              <div className="text-sm text-foreground py-4 text-center border border-dashed border-[var(--border)] rounded">
                {selectedOrder.items > 0
                  ? `${selectedOrder.items} item(s) in this purchase order`
                  : 'No items added'}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div>
            <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              Summary
            </h4>
            <div className="bg-muted border border-[var(--border)] rounded-lg p-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Number of Items:</span>
                  <span className="font-semibold text-foreground">{selectedOrder.items}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-semibold text-foreground">₹{selectedOrder.amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="border-t border-[var(--border)] pt-2 mt-2 flex justify-between items-center">
                  <span className="text-foreground font-medium">Grand Total:</span>
                  <span className="text-xl font-bold text-sky-300">₹{selectedOrder.amount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h4 className="text-lg font-bold mb-3">Additional Information</h4>
            <div className="grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-2 card-surface p-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Created Date</label>
                <p className="text-sm">{new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Last Modified</label>
                <p className="text-sm">{new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
