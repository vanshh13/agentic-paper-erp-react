import { useState, useEffect } from 'react'
import { Edit2, Trash2, Eye, Plus } from 'lucide-react'

export default function InquiryList({ onEdit, onView, onDelete, onNew, inquiries }) {
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-2xl font-bold text-dark">Paper Trading Inquiries</h3>
        <button 
          onClick={onNew}
          className="flex items-center gap-2 bg-primary text-dark px-4 py-2 rounded-lg font-bold hover:bg-cyan-400 transition-colors"
        >
          <Plus size={18} /> New Inquiry
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-bold text-dark">Inquiry #</th>
              <th className="px-6 py-3 text-left text-sm font-bold text-dark">Company</th>
              <th className="px-6 py-3 text-left text-sm font-bold text-dark">Contact</th>
              <th className="px-6 py-3 text-left text-sm font-bold text-dark">Category</th>
              <th className="px-6 py-3 text-left text-sm font-bold text-dark">Amount</th>
              <th className="px-6 py-3 text-left text-sm font-bold text-dark">Status</th>
              <th className="px-6 py-3 text-left text-sm font-bold text-dark">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inquiry) => (
              <tr key={inquiry.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-semibold text-primary">{inquiry.inquiryNumber}</td>
                <td className="px-6 py-4 text-sm text-dark font-medium">{inquiry.companyName}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{inquiry.contactPerson}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{inquiry.productCategory}</td>
                <td className="px-6 py-4 text-sm font-bold text-dark">₹{inquiry.totalAmount.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(inquiry.status)}`}>
                    {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm flex gap-2">
                  <button
                    onClick={() => onView(inquiry.id)}
                    className="text-primary hover:text-cyan-600 font-bold transition-colors"
                    title="View"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => onEdit(inquiry.id)}
                    className="text-blue-600 hover:text-blue-800 font-bold transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(inquiry.id)}
                    className="text-red-600 hover:text-red-800 font-bold transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}