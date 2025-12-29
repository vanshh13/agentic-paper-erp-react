import { useState, useEffect } from 'react'
import { inquiryService } from '../services/inquiryService'
import InquiryList from '../components/inquiry/InquiryList'
import InquiryForm from '../components/inquiry/InquiryForm'
import InquiryView from '../components/inquiry/InquiryView'

export default function Inquiry() {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [viewingId, setViewingId] = useState(null)
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    loadInquiries()
  }, [])

  const loadInquiries = async () => {
    setLoading(true)
    const data = await inquiryService.getAll()
    setInquiries(data)
    setLoading(false)
  }

  const handleCreate = async (data) => {
    await inquiryService.create(data)
    await loadInquiries()
    setShowForm(false)
  }

  const handleUpdate = async (data) => {
    await inquiryService.update(editingId, data)
    await loadInquiries()
    setEditingId(null)
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this inquiry?')) {
      await inquiryService.delete(id)
      await loadInquiries()
      setViewingId(null)
    }
  }

  const viewingInquiry = inquiries.find(i => i.id === viewingId)
  const editingInquiry = inquiries.find(i => i.id === editingId)

  if (loading) {
    return <div className="text-center py-12 text-gray-600">Loading...</div>
  }

  return (
    <div>
      <InquiryList
        inquiries={inquiries}
        onNew={() => setShowForm(true)}
        onView={(id) => setViewingId(id)}
        onEdit={(id) => setEditingId(id)}
        onDelete={handleDelete}
      />

      {showForm && (
        <InquiryForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingId && (
        <InquiryForm
          inquiry={editingInquiry}
          onSubmit={handleUpdate}
          onCancel={() => setEditingId(null)}
        />
      )}

      {viewingId && (
        <InquiryView
          inquiry={viewingInquiry}
          onEdit={(id) => {
            setViewingId(null)
            setEditingId(id)
          }}
          onDelete={handleDelete}
          onClose={() => setViewingId(null)}
        />
      )}
    </div>
  )
}
