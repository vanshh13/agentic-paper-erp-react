import { X, User, Mail, Phone, MapPin, Briefcase, Calendar, Shield, Edit, Trash2, ArrowRight } from 'lucide-react'

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
  active: { label: 'Active', color: 'bg-emerald-500/20 text-emerald-100', dotColor: 'bg-emerald-500' },
  'on leave': { label: 'On Leave', color: 'bg-amber-500/20 text-amber-200', dotColor: 'bg-amber-500' },
  probation: { label: 'Probation', color: 'bg-indigo-500/15 text-indigo-200', dotColor: 'bg-indigo-500' },
  inactive: { label: 'Inactive', color: 'bg-rose-500/20 text-rose-100', dotColor: 'bg-rose-500' },
}

const InfoField = ({ label, value, icon: Icon }) => (
  <div className="group">
    <label className="text-xs font-semibold text-[oklch(0.65_0_0)] uppercase tracking-wider mb-1.5 flex items-center gap-2">
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {label}
    </label>
    <p className="text-sm text-[oklch(0.92_0_0)] group-hover:text-white transition-colors break-words">{value || '--'}</p>
  </div>
)

export default function UserView({
  selectedUser,
  showDetailDialog,
  setShowDetailDialog,
  onEdit,
  onDelete,
  loadingDetail = false,
}) {
  if (!showDetailDialog || !selectedUser) return null

  const statusKey = selectedUser.employment_status?.toLowerCase()
  const statusDisplay = statusConfig[statusKey] || { 
    label: selectedUser.employment_status, 
    color: 'bg-[oklch(0.30_0_0)] text-[oklch(0.90_0_0)]',
    dotColor: 'bg-gray-500'
  }

  const initials = selectedUser.full_name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || 'U'

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 md:p-4 z-50 overflow-y-auto">
      <div className="bg-gradient-to-br from-[oklch(0.22_0_0)] to-[oklch(0.20_0_0)] text-[oklch(0.95_0_0)] rounded-2xl shadow-2xl max-w-5xl w-full my-8 border border-[oklch(0.28_0_0)] overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Gradient Header */}
        <div className="relative bg-gradient-to-r from-indigo-600/20 to-indigo-500/10 p-6 md:p-8 border-b border-[oklch(0.28_0_0)]">
          {/* Close Button - Top Right */}
          <button
            onClick={() => setShowDetailDialog(false)}
            className="absolute top-4 right-4 md:top-6 md:right-6 text-[oklch(0.75_0_0)] hover:text-white hover:bg-[oklch(0.26_0_0)] p-2 rounded-lg transition-all duration-200"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <div className="flex items-start gap-4 md:gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-bold text-2xl md:text-3xl shadow-lg">
                {initials}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl md:text-3xl font-bold text-white truncate">{selectedUser.full_name}</h2>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${statusDisplay.color}`}>
                  <span className={`w-2 h-2 rounded-full ${statusDisplay.dotColor}`}></span>
                  {statusDisplay.label}
                </span>
              </div>
              <p className="text-[oklch(0.75_0_0)] text-sm md:text-base mb-3 truncate">
                {selectedUser.designation_name || 'Employee'} {selectedUser.department_name && `• ${selectedUser.department_name}`}
              </p>
              <div className="flex items-center gap-2 text-xs md:text-sm text-[oklch(0.70_0_0)]">
                <span className="font-mono font-semibold text-indigo-400">{selectedUser.employee_code}</span>
                <span>•</span>
                <span>ID: {selectedUser.user_id}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 mt-6 pt-6 border-t border-[oklch(0.28_0_0)]">
            {onEdit && (
              <button
                onClick={() => onEdit(selectedUser)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 hover:text-indigo-100 border border-indigo-500/30 rounded-lg text-sm font-semibold transition-all duration-200"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
            )}

            {onDelete && (
              <button
                onClick={() => onDelete(selectedUser)}
                className="flex items-center gap-2 px-4 py-2 bg-rose-600/30 hover:bg-rose-600/50 text-rose-200 hover:text-rose-100 border border-rose-500/30 rounded-lg text-sm font-semibold transition-all duration-200"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 space-y-8 max-h-[calc(90vh-280px)] overflow-y-auto custom-scrollbar">
          {/* Personal Information */}
          <section className="space-y-4">
            <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2 pb-3 border-b border-[oklch(0.26_0_0)]">
              <User className="w-5 h-5 text-indigo-400" />
              Personal Information
            </h3>
            <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <InfoField label="First Name" value={selectedUser.first_name} />
              <InfoField label="Middle Name" value={selectedUser.middle_name} />
              <InfoField label="Last Name" value={selectedUser.last_name} />
              <InfoField label="Gender" value={selectedUser.gender} />
              <InfoField label="Date of Birth" value={formatDate(selectedUser.date_of_birth)} icon={Calendar} />
              <InfoField label="Blood Group" value={selectedUser.blood_group} />
              <InfoField label="Marital Status" value={selectedUser.marital_status} />
            </div>
          </section>

          {/* Contact Details */}
          <section className="space-y-4">
            <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2 pb-3 border-b border-[oklch(0.26_0_0)]">
              <Phone className="w-5 h-5 text-emerald-400" />
              Contact Details
            </h3>
            <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
              <InfoField label="Email" value={selectedUser.email} icon={Mail} />
              <InfoField label="Mobile Number" value={selectedUser.mobile_number} icon={Phone} />
              <InfoField label="Alternate Mobile" value={selectedUser.alternate_mobile} />
            </div>
          </section>

          {/* Address Information */}
          <section className="space-y-4">
            <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2 pb-3 border-b border-[oklch(0.26_0_0)]">
              <MapPin className="w-5 h-5 text-cyan-400" />
              Address
            </h3>
            <div className="space-y-4">
              <InfoField label="Address Line 1" value={selectedUser.address_line1} />
              <InfoField label="Address Line 2" value={selectedUser.address_line2} />
              <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <InfoField label="City" value={selectedUser.city} />
                <InfoField label="Taluka" value={selectedUser.taluka} />
                <InfoField label="District" value={selectedUser.district} />
                <InfoField label="State" value={selectedUser.state} />
                <InfoField label="Country" value={selectedUser.country} />
                <InfoField label="PIN Code" value={selectedUser.pin_code} />
              </div>
            </div>
          </section>

          {/* Employment Details */}
          <section className="space-y-4">
            <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2 pb-3 border-b border-[oklch(0.26_0_0)]">
              <Briefcase className="w-5 h-5 text-purple-400" />
              Employment Details
            </h3>
            <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <InfoField label="Department" value={selectedUser.department_name || selectedUser.department_id} />
              <InfoField label="Designation" value={selectedUser.designation_name || selectedUser.designation_id} />
              <InfoField label="Employment Type" value={selectedUser.employment_type || selectedUser.employment_type_id} />
              <InfoField label="Date of Joining" value={formatDate(selectedUser.date_of_joining)} icon={Calendar} />
              <InfoField label="Reporting Manager" value={selectedUser.reporting_manager_name || selectedUser.reporting_manager_id} />
            </div>
          </section>

          {/* System Information */}
          <section className="space-y-4">
            <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2 pb-3 border-b border-[oklch(0.26_0_0)]">
              <Shield className="w-5 h-5 text-amber-400" />
              System Information
            </h3>
            <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <div className="group">
                <label className="text-xs font-semibold text-[oklch(0.65_0_0)] uppercase tracking-wider mb-1.5">Admin Access</label>
                <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${selectedUser.is_admin ? 'bg-rose-500/20 text-rose-200' : 'bg-[oklch(0.26_0_0)] text-[oklch(0.75_0_0)]'}`}>
                  {selectedUser.is_admin ? '✓ Yes' : 'No'}
                </span>
              </div>
              <InfoField label="Last Login" value={formatDateTime(selectedUser.last_login_at)} />
              <InfoField label="Created At" value={formatDateTime(selectedUser.createdAt)} />
              <InfoField label="Updated At" value={formatDateTime(selectedUser.updatedAt)} />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
