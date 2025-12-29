import { X, Edit2, Trash2, Download } from 'lucide-react'

export default function InquiryView({ inquiry, onEdit, onDelete, onClose }) {
  if (!inquiry) return null

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800'
    }
    return colors[status] || colors.draft
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-dark to-darkalt text-white p-6 flex justify-between items-center border-b">
          <div>
            <h2 className="text-2xl font-bold">{inquiry.inquiryNumber}</h2>
            <p className="text-gray-300 text-sm">{inquiry.companyName}</p>
          </div>
          <button onClick={onClose} className="text-white hover:text-red-300 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status & Dates */}
          <div className="flex justify-between items-start">
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(inquiry.status)}`}>
                {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Created: {inquiry.createdAt}</p>
              <p className="text-sm text-gray-600">Updated: {inquiry.updatedAt}</p>
            </div>
          </div>

          {/* Company Info */}
          <div className="grid md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg">
            <div>
              <p className="text-xs font-bold text-gray-600 uppercase mb-1">Company</p>
              <p className="text-lg font-bold text-dark">{inquiry.companyName}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-600 uppercase mb-1">Contact Person</p>
              <p className="text-lg font-bold text-dark">{inquiry.contactPerson}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-600 uppercase mb-1">Email</p>
              <p className="text-dark">{inquiry.email}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-600 uppercase mb-1">Phone</p>
              <p className="text-dark">{inquiry.phone}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-600 uppercase mb-1">Product Category</p>
              <p className="text-dark font-semibold">{inquiry.productCategory}</p>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <h3 className="text-lg font-bold text-dark mb-4 pb-2 border-b-2 border-primary">Inquiry Items</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-bold text-dark">Product</th>
                    <th className="px-4 py-2 text-left text-sm font-bold text-dark">Quantity</th>
                    <th className="px-4 py-2 text-left text-sm font-bold text-dark">Unit Price</th>
                    <th className="px-4 py-2 text-left text-sm font-bold text-dark">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiry.items.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-dark">{item.productName}</p>
                        {item.specifications && <p className="text-xs text-gray-600">{item.specifications}</p>}
                      </td>
                      <td className="px-4 py-3 text-dark">{item.quantity}</td>
                      <td className="px-4 py-3 text-dark">₹{item.unitPrice.toLocaleString()}</td>
                      <td className="px-4 py-3 font-bold text-primary">₹{item.totalAmount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total & Notes */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-bold text-dark">Total Amount:</span>
              <span className="text-3xl font-bold text-primary">₹{inquiry.totalAmount.toLocaleString()}</span>
            </div>
            {inquiry.notes && (
              <div>
                <p className="text-sm font-bold text-gray-600 mb-2">Notes:</p>
                <p className="text-dark bg-white p-3 rounded border border-gray-200">{inquiry.notes}</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => onDelete(inquiry.id)}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 font-bold rounded-lg hover:bg-red-200 transition-colors"
            >
              <Trash2 size={18} /> Delete
            </button>
            <button
              onClick={() => onEdit(inquiry.id)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-dark font-bold rounded-lg hover:bg-cyan-400 transition-colors"
            >
              <Edit2 size={18} /> Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}