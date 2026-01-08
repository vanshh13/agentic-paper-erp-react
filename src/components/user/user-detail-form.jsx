import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit, Trash2, Save, X } from 'lucide-react'
import { userApi } from '../../services/api/user/user-api'
import Input from '../ui/input'
import Toast from '../ui/toast'

const formatDate = (value) => {
  if (!value) return '--'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

const formatDateTime = (value) => {
  if (!value) return '--'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const statusConfig = {
  active: { label: 'Active', color: 'bg-emerald-500/20 text-black dark:text-emerald-400', dotColor: 'bg-emerald-500' },
  'on leave': { label: 'On Leave', color: 'bg-amber-500/20 text-black dark:text-amber-400', dotColor: 'bg-amber-500' },
  probation: { label: 'Probation', color: 'bg-indigo-500/20 text-black dark:text-indigo-400', dotColor: 'bg-indigo-500' },
  inactive: { label: 'Inactive', color: 'bg-rose-500/20 text-black dark:text-rose-400', dotColor: 'bg-rose-500' },
}

const InfoField = ({ label, value }) => (
  <div>
    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">
      {label}
    </label>
    <p className="text-sm text-foreground break-words">{value || '--'}</p>
  </div>
)

const TABS = [
  { id: 'general', label: 'General Info' },
  { id: 'personal', label: 'Personal Info' },
  { id: 'contact', label: 'Contact Info' },
  { id: 'address', label: 'Address Info' },
  { id: 'employment', label: 'Employment' },
]

export default function UserDetailForm() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('general')
  const [isEditMode, setIsEditMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [user, setUser] = useState(null)
  const [formData, setFormData] = useState({})

  useEffect(() => {
    loadUser()
  }, [userId])

  const loadUser = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await userApi.getById(userId)
      setUser(data)
      setFormData(data)
    } catch (err) {
      console.error('Error loading user:', err)
      setError('Failed to load user details')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      await userApi.update(userId, formData)
      setUser(formData)
      setIsEditMode(false)
      setSuccessMessage('User updated successfully')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      console.error('Error updating user:', err)
      setError('Failed to update user')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      setLoading(true)
      await userApi.delete(userId)
      setSuccessMessage('User deleted successfully')
      setTimeout(() => {
        navigate('/users')
      }, 1000)
    } catch (err) {
      console.error('Error deleting user:', err)
      setError('Failed to delete user')
    } finally {
      setLoading(false)
      setDeleteConfirm(false)
    }
  }

  const handleCancel = () => {
    setFormData(user)
    setIsEditMode(false)
  }

  if (loading && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br bg-background">
        <div className="text-foreground">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br bg-background">
        <div className="text-foreground">User not found</div>
      </div>
    )
  }

  const statusKey = user.employment_status?.toLowerCase()
  const statusDisplay = statusConfig[statusKey] || {
    label: user.employment_status,
    color: 'bg-secondary text-foreground',
    dotColor: 'bg-gray-500'
  }

  const initials = user.full_name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || 'U'

  // Tab content rendering
  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {isEditMode ? (
                <>
                  <Input
                    label="Employee Code"
                    name="employee_code"
                    value={formData.employee_code || ''}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="Username"
                    name="username"
                    value={formData.username || ''}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                  />
                </>
              ) : (
                <>
                  <InfoField label="Employee Code" value={user.employee_code} />
                  <InfoField label="Username" value={user.username} />
                  <InfoField label="Email" value={user.email} />
                </>
              )}
            </div>
          </div>
        )

      case 'personal':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {isEditMode ? (
                <>
                  <Input
                    label="First Name"
                    name="first_name"
                    value={formData.first_name || ''}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="Middle Name"
                    name="middle_name"
                    value={formData.middle_name || ''}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="Last Name"
                    name="last_name"
                    value={formData.last_name || ''}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="Gender"
                    name="gender"
                    value={formData.gender || ''}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="Date of Birth"
                    name="date_of_birth"
                    type="date"
                    value={formData.date_of_birth ? formData.date_of_birth.split('T')[0] : ''}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="Blood Group"
                    name="blood_group"
                    value={formData.blood_group || ''}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="Marital Status"
                    name="marital_status"
                    value={formData.marital_status || ''}
                    onChange={handleInputChange}
                  />
                </>
              ) : (
                <>
                  <InfoField label="First Name" value={user.first_name} />
                  <InfoField label="Middle Name" value={user.middle_name} />
                  <InfoField label="Last Name" value={user.last_name} />
                  <InfoField label="Gender" value={user.gender} />
                  <InfoField label="Date of Birth" value={formatDate(user.date_of_birth)} />
                  <InfoField label="Blood Group" value={user.blood_group} />
                  <InfoField label="Marital Status" value={user.marital_status} />
                </>
              )}
            </div>
          </div>
        )

      case 'contact':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {isEditMode ? (
                <>
                  <Input
                    label="Mobile Number"
                    name="mobile_number"
                    value={formData.mobile_number || ''}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="Alternate Mobile"
                    name="alternate_mobile"
                    value={formData.alternate_mobile || ''}
                    onChange={handleInputChange}
                  />
                </>
              ) : (
                <>
                  <InfoField label="Mobile Number" value={user.mobile_number} />
                  <InfoField label="Alternate Mobile" value={user.alternate_mobile} />
                </>
              )}
            </div>
          </div>
        )

      case 'address':
        return (
          <div className="space-y-4">
            {isEditMode ? (
              <>
                <Input
                  label="Address Line 1"
                  name="address_line1"
                  value={formData.address_line1 || ''}
                  onChange={handleInputChange}
                />
                <Input
                  label="Address Line 2"
                  name="address_line2"
                  value={formData.address_line2 || ''}
                  onChange={handleInputChange}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  <Input
                    label="City"
                    name="city"
                    value={formData.city || ''}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="Taluka"
                    name="taluka"
                    value={formData.taluka || ''}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="District"
                    name="district"
                    value={formData.district || ''}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="State"
                    name="state"
                    value={formData.state || ''}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="Country"
                    name="country"
                    value={formData.country || ''}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="PIN Code"
                    name="pin_code"
                    value={formData.pin_code || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </>
            ) : (
              <>
                <InfoField label="Address Line 1" value={user.address_line1} />
                <InfoField label="Address Line 2" value={user.address_line2} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <InfoField label="City" value={user.city} />
                  <InfoField label="Taluka" value={user.taluka} />
                  <InfoField label="District" value={user.district} />
                  <InfoField label="State" value={user.state} />
                  <InfoField label="Country" value={user.country} />
                  <InfoField label="PIN Code" value={user.pin_code} />
                </div>
              </>
            )}
          </div>
        )

      case 'employment':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {isEditMode ? (
                <>
                  <Input
                    label="Department"
                    name="department_id"
                    value={formData.department_id || formData.department_name || ''}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="Designation"
                    name="designation_id"
                    value={formData.designation_id || formData.designation_name || ''}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="Employment Type"
                    name="employment_type"
                    value={formData.employment_type || ''}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="Date of Joining"
                    name="date_of_joining"
                    type="date"
                    value={formData.date_of_joining ? formData.date_of_joining.split('T')[0] : ''}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="Reporting Manager"
                    name="reporting_manager_id"
                    value={formData.reporting_manager_id || formData.reporting_manager_name || ''}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="Employment Status"
                    name="employment_status"
                    value={formData.employment_status || ''}
                    onChange={handleInputChange}
                  />
                </>
              ) : (
                <>
                  <InfoField label="Department" value={user.department_name || user.department_id} />
                  <InfoField label="Designation" value={user.designation_name || user.designation_id} />
                  <InfoField label="Employment Type" value={user.employment_type} />
                  <InfoField label="Date of Joining" value={formatDate(user.date_of_joining)} />
                  <InfoField label="Reporting Manager" value={user.reporting_manager_name || user.reporting_manager_id} />
                  <InfoField label="Employment Status" value={user.employment_status} />
                </>
              )}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br bg-background text-foreground" style={{ height: 'auto', minHeight: '100vh', overflow: 'auto' }}>
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
            <h3 className="text-lg font-bold text-foreground mb-4">Delete User</h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete <span className="font-semibold text-foreground">{user.full_name}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-foreground rounded-lg font-semibold transition-all disabled:opacity-50"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-secondary hover:bg-accent text-foreground rounded-lg font-semibold transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header with Tabs */}
      <div className="bg-gradient-to-r bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          {/* Back Button */}
          <button
            onClick={() => navigate('/users')}
            className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs sm:text-sm">Back</span>
          </button>

          {/* Header Content */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-foreground font-bold text-lg flex-shrink-0">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-bold text-foreground mb-1">{user.full_name}</h1>
                <p className="text-muted-foreground text-xs sm:text-sm mb-1 truncate">
                  {user.employee_code} • {user.designation_name || 'Employee'} {user.department_name && `• ${user.department_name}`}
                </p>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${statusDisplay.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusDisplay.dotColor}`}></span>
                  {statusDisplay.label}
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
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all text-sm"
                  >
                    <Save className="w-4 h-4" />
                    <span className="hidden sm:inline">Save</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-all text-sm"
                  >
                    <X className="w-4 h-4" />
                    <span className="hidden sm:inline">Cancel</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditMode(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold transition-all text-sm"
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
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-4 sm:py-6">
        <div className="bg-gradient-to-br bg-card rounded-lg sm:rounded-xl border border-border p-4 sm:p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  )
}

