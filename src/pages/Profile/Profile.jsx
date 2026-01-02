import { useState, useEffect } from 'react'
import { User, Mail, Phone, Calendar, Shield, Edit, Save, X } from 'lucide-react'
import { getCurrentUser } from '../../services/api/auth'

export default function Profile() {
  const [currentUser, setCurrentUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState({})

  useEffect(() => {
    const user = getCurrentUser()
    setCurrentUser(user)
    if (user) {
      setEditedData({
        first_name: user.first_name || '',
        middle_name: user.middle_name || '',
        last_name: user.last_name || '',
        username: user.username || '',
        email: user.email || '',
        mobile_number: user.mobile_number || '',
        date_of_birth: user.date_of_birth || '',
        gender: user.gender || '',
      })
    }
  }, [])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    if (currentUser) {
      setEditedData({
        first_name: currentUser.first_name || '',
        middle_name: currentUser.middle_name || '',
        last_name: currentUser.last_name || '',
        username: currentUser.username || '',
        email: currentUser.email || '',
        mobile_number: currentUser.mobile_number || '',
        date_of_birth: currentUser.date_of_birth || '',
        gender: currentUser.gender || '',
      })
    }
  }

  const handleSave = () => {
    // TODO: Implement API call to update user data
    console.log('Saving user data:', editedData)
    setIsEditing(false)
    // Update current user in state
    setCurrentUser({ ...currentUser, ...editedData })
  }

  const handleChange = (field, value) => {
    setEditedData(prev => ({ ...prev, [field]: value }))
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-[oklch(0.70_0_0)]">Loading user data...</p>
      </div>
    )
  }

  const fullName = currentUser.first_name && currentUser.last_name
    ? `${currentUser.first_name} ${currentUser.middle_name ? currentUser.middle_name + ' ' : ''}${currentUser.last_name}`.trim()
    : currentUser.username || 'User'

  return (
    <div className="space-y-6 pb-10 text-[oklch(0.95_0_0)] w-full px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-indigo-500/20 text-indigo-400">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[oklch(0.98_0_0)]">My Profile</h1>
              <p className="text-[oklch(0.70_0_0)] text-sm md:text-base mt-1">View and manage your profile information</p>
            </div>
          </div>
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[oklch(0.25_0_0)] text-[oklch(0.80_0_0)] hover:bg-[oklch(0.30_0_0)] transition-colors text-sm font-medium"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors text-sm font-medium"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Image & Basic Info */}
        <div className="lg:col-span-1">
          <div className="card-surface rounded-xl border border-[oklch(0.25_0_0)] p-6 space-y-4">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-indigo-500/30 mb-4">
                {currentUser.first_name ? currentUser.first_name.charAt(0).toUpperCase() : (currentUser.username?.charAt(0).toUpperCase() || 'U')}
              </div>
              <h2 className="text-xl font-bold text-[oklch(0.95_0_0)] text-center">{fullName}</h2>
              <p className="text-sm text-[oklch(0.70_0_0)] text-center">{currentUser.email}</p>
              {currentUser.is_admin && (
                <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold bg-indigo-500/20 text-indigo-300 rounded-full">
                  <Shield className="w-3 h-3 inline mr-1" />
                  Admin
                </span>
              )}
            </div>
            <div className="pt-4 border-t border-[oklch(0.25_0_0)] space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-[oklch(0.60_0_0)]" />
                <span className="text-[oklch(0.80_0_0)]">{currentUser.email}</span>
              </div>
              {currentUser.mobile_number && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-[oklch(0.60_0_0)]" />
                  <span className="text-[oklch(0.80_0_0)]">{currentUser.mobile_number}</span>
                </div>
              )}
              {currentUser.username && (
                <div className="flex items-center gap-3 text-sm">
                  <User className="w-4 h-4 text-[oklch(0.60_0_0)]" />
                  <span className="text-[oklch(0.80_0_0)]">@{currentUser.username}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="lg:col-span-2">
          <div className="card-surface rounded-xl border border-[oklch(0.25_0_0)] p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-[oklch(0.95_0_0)] mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[oklch(0.85_0_0)] mb-2">First Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.first_name}
                      onChange={(e) => handleChange('first_name', e.target.value)}
                      className="w-full bg-[oklch(0.30_0_0)] border border-[oklch(0.25_0_0)] rounded-lg px-4 py-2 text-[oklch(0.95_0_0)] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <p className="text-[oklch(0.80_0_0)] py-2">{currentUser.first_name || 'Not provided'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[oklch(0.85_0_0)] mb-2">Middle Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.middle_name}
                      onChange={(e) => handleChange('middle_name', e.target.value)}
                      className="w-full bg-[oklch(0.30_0_0)] border border-[oklch(0.25_0_0)] rounded-lg px-4 py-2 text-[oklch(0.95_0_0)] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <p className="text-[oklch(0.80_0_0)] py-2">{currentUser.middle_name || 'Not provided'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[oklch(0.85_0_0)] mb-2">Last Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.last_name}
                      onChange={(e) => handleChange('last_name', e.target.value)}
                      className="w-full bg-[oklch(0.30_0_0)] border border-[oklch(0.25_0_0)] rounded-lg px-4 py-2 text-[oklch(0.95_0_0)] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <p className="text-[oklch(0.80_0_0)] py-2">{currentUser.last_name || 'Not provided'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[oklch(0.85_0_0)] mb-2">Username</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.username}
                      onChange={(e) => handleChange('username', e.target.value)}
                      className="w-full bg-[oklch(0.30_0_0)] border border-[oklch(0.25_0_0)] rounded-lg px-4 py-2 text-[oklch(0.95_0_0)] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <p className="text-[oklch(0.80_0_0)] py-2">@{currentUser.username || 'Not provided'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[oklch(0.85_0_0)] mb-2">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="w-full bg-[oklch(0.30_0_0)] border border-[oklch(0.25_0_0)] rounded-lg px-4 py-2 text-[oklch(0.95_0_0)] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <p className="text-[oklch(0.80_0_0)] py-2">{currentUser.email || 'Not provided'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[oklch(0.85_0_0)] mb-2">Mobile Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedData.mobile_number}
                      onChange={(e) => handleChange('mobile_number', e.target.value)}
                      className="w-full bg-[oklch(0.30_0_0)] border border-[oklch(0.25_0_0)] rounded-lg px-4 py-2 text-[oklch(0.95_0_0)] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <p className="text-[oklch(0.80_0_0)] py-2">{currentUser.mobile_number || 'Not provided'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[oklch(0.85_0_0)] mb-2">Date of Birth</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editedData.date_of_birth}
                      onChange={(e) => handleChange('date_of_birth', e.target.value)}
                      className="w-full bg-[oklch(0.30_0_0)] border border-[oklch(0.25_0_0)] rounded-lg px-4 py-2 text-[oklch(0.95_0_0)] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <p className="text-[oklch(0.80_0_0)] py-2">{currentUser.date_of_birth || 'Not provided'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[oklch(0.85_0_0)] mb-2">Gender</label>
                  {isEditing ? (
                    <select
                      value={editedData.gender}
                      onChange={(e) => handleChange('gender', e.target.value)}
                      className="w-full bg-[oklch(0.30_0_0)] border border-[oklch(0.25_0_0)] rounded-lg px-4 py-2 text-[oklch(0.95_0_0)] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  ) : (
                    <p className="text-[oklch(0.80_0_0)] py-2">{currentUser.gender ? currentUser.gender.charAt(0).toUpperCase() + currentUser.gender.slice(1) : 'Not provided'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

