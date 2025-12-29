import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

export default function InquiryForm({ inquiry, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(
    inquiry || {
      inquiryNumber: `INQ-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      productCategory: 'Newsprint',
      status: 'draft',
      items: [{ id: '1', productName: '', quantity: 0, unitPrice: 0, totalAmount: 0, specifications: '' }],
      notes: ''
    }
  )

  const categories = ['Newsprint', 'Coated Paper', 'Kraft Paper', 'Copy Paper', 'Tissue Paper', 'Specialty Paper']

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleItemChange = (idx, field, value) => {
    const newItems = [...formData.items]
    newItems[idx] = { ...newItems[idx], [field]: value }
    
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[idx].totalAmount = newItems[idx].quantity * newItems[idx].unitPrice
    }
    
    setFormData({ ...formData, items: newItems })
  }

  const addItem = () => {
    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      productName: '',
      quantity: 0,
      unitPrice: 0,
      totalAmount: 0,
      specifications: ''
    }
    setFormData({ ...formData, items: [...formData.items, newItem] })
  }

  const removeItem = (idx) => {
    setFormData({ ...formData, items: formData.items.filter((_, i) => i !== idx) })
  }

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.totalAmount || 0), 0)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      totalAmount: calculateTotal()
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-dark to-darkalt text-white p-6 flex justify-between items-center border-b">
          <h2 className="text-2xl font-bold">{inquiry ? 'Edit Inquiry' : 'New Inquiry'}</h2>
          <button onClick={onCancel} className="text-white hover:text-red-300 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info Section */}
          <div>
            <h3 className="text-xl font-bold text-dark mb-4 pb-2 border-b-2 border-primary">Inquiry Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-dark mb-2">Inquiry Number</label>
                <input
                  type="text"
                  value={formData.inquiryNumber}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-dark mb-2">Company Name *</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="ABC Paper Trading Co."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-dark mb-2">Contact Person *</label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  placeholder="Rajesh Kumar"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-dark mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="email@company.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-dark mb-2">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91-9876543210"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-dark mb-2">Product Category *</label>
                <select
                  name="productCategory"
                  value={formData.productCategory}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-dark mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                >
                  <option value="draft">Draft</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Items Section */}
          <div>
            <h3 className="text-xl font-bold text-dark mb-4 pb-2 border-b-2 border-primary">Inquiry Items</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {formData.items.map((item, idx) => (
                <div key={item.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="grid md:grid-cols-5 gap-3">
                    <input
                      type="text"
                      placeholder="Product name"
                      value={item.productName}
                      onChange={(e) => handleItemChange(idx, 'productName', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-primary"
                    />
                    <input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(idx, 'quantity', parseFloat(e.target.value))}
                      className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-primary"
                    />
                    <input
                      type="number"
                      placeholder="Unit Price"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(idx, 'unitPrice', parseFloat(e.target.value))}
                      className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-primary"
                    />
                    <div className="px-3 py-2 bg-white border border-gray-300 rounded text-sm font-bold text-dark">
                      ₹{item.totalAmount.toLocaleString()}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="bg-red-100 text-red-600 font-bold rounded hover:bg-red-200 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Specifications (optional)"
                    value={item.specifications}
                    onChange={(e) => handleItemChange(idx, 'specifications', e.target.value)}
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addItem}
              className="mt-3 bg-primary text-dark px-4 py-2 rounded font-bold hover:bg-cyan-400 transition-colors"
            >
              + Add Item
            </button>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-bold text-dark mb-2">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Special requirements, delivery notes, etc."
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
            ></textarea>
          </div>

          {/* Total */}
          <div className="bg-gray-100 p-4 rounded-lg flex justify-between items-center">
            <span className="text-lg font-bold text-dark">Total Amount:</span>
            <span className="text-3xl font-bold text-primary">₹{calculateTotal().toLocaleString()}</span>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border-2 border-gray-300 text-dark font-bold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-dark font-bold rounded-lg hover:bg-cyan-400 transition-colors"
            >
              {inquiry ? 'Update' : 'Create'} Inquiry
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}