import { useEffect, useMemo, useState } from 'react'
import { Users as UsersIcon, RefreshCw } from 'lucide-react'
import { userApi } from '../../services/api/user/user-api'
import { DynamicTable } from '../../components/table'
import UserView from '../../components/user/UserView'

const normalizeUser = (user) => {
  const fullName = user.full_name || [user.first_name, user.middle_name, user.last_name].filter(Boolean).join(' ')
  return {
    ...user,
    full_name: fullName || user.username,
    department_name: user.department_name,
    designation_name: user.designation_name,
    reporting_manager_name: user.reporting_manager_name,
  }
}

export default function UserList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)

  const stats = useMemo(() => {
    const activeCount = users.filter((u) => (u.employment_status || '').toLowerCase() === 'active').length
    const adminCount = users.filter((u) => u.is_admin).length
    return {
      total: users.length,
      active: activeCount,
      admins: adminCount,
    }
  }, [users])

  const loadUsers = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await userApi.getAll()
      setUsers(Array.isArray(data) ? data.map(normalizeUser) : [])
    } catch (err) {
      console.error('Unable to fetch users', err)
      setError('Unable to fetch users right now. Showing any cached data if available.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    document.title = 'User List'
    loadUsers()
  }, [])

  const handleViewUser = (user) => {
    setSelectedUser(user)
    setShowDetailDialog(true)
  }

  const handleEdit = (user) => {
    console.log('Edit user:', user)
    setShowDetailDialog(false)
    // TODO: Implement edit functionality
  }

  const handleDelete = (user) => {
    console.log('Delete user:', user)
    setShowDetailDialog(false)
    // TODO: Implement delete functionality
  }

  const userColumns = useMemo(() => [
    { key: 'user_id', label: 'User ID', minWidth: 'min-w-[100px]' },
    { key: 'username', label: 'Username', minWidth: 'min-w-[150px]' },
    { key: 'email', label: 'Email', minWidth: 'min-w-[250px]' },
    { key: 'employee_code', label: 'Code', minWidth: 'min-w-[120px]' },
    { key: 'full_name', label: 'Full Name', minWidth: 'min-w-[180px]' },
    { key: 'gender', label: 'Gender', minWidth: 'min-w-[100px]' },
    { key: 'date_of_birth', label: 'DOB', minWidth: 'min-w-[130px]' },
    { key: 'marital_status', label: 'Marital Status', minWidth: 'min-w-[150px]' },
    { key: 'mobile_number', label: 'Mobile', minWidth: 'min-w-[140px]' },
    { key: 'department_name', label: 'Department', minWidth: 'min-w-[150px]' },
    { key: 'designation_name', label: 'Designation', minWidth: 'min-w-[160px]' },
    { key: 'reporting_manager_name', label: 'Manager', minWidth: 'min-w-[150px]' },
  ], [])

  return (
    <div className="space-y-6 pb-10 text-[oklch(0.95_0_0)] w-full px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-indigo-500/20 text-indigo-400">
              <UsersIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[oklch(0.98_0_0)]">User List</h1>
              <p className="text-[oklch(0.70_0_0)] text-sm md:text-base">Manage employees, access levels, and reporting lines</p>
            </div>
          </div>
          <button
            onClick={loadUsers}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[oklch(0.28_0_0)] text-[oklch(0.92_0_0)] hover:bg-[oklch(0.30_0_0)] border border-[var(--border)] transition-colors text-sm font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs text-[oklch(0.65_0_0)]">
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 bg-indigo-400 rounded-sm"></span>
            Shows live data when API is available, otherwise local sample data
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-surface p-4 md:p-5 rounded-xl border border-[var(--border)]">
          <p className="text-xs md:text-sm text-[oklch(0.70_0_0)] mb-1">Total Users</p>
          <p className="text-2xl md:text-3xl font-bold text-[oklch(0.98_0_0)]">{stats.total}</p>
          <p className="text-xs text-[oklch(0.65_0_0)] mt-0.5">Including active and inactive</p>
        </div>
        <div className="card-surface p-4 md:p-5 rounded-xl border border-[var(--border)]">
          <p className="text-xs md:text-sm text-[oklch(0.70_0_0)] mb-1">Active Employees</p>
          <p className="text-2xl md:text-3xl font-bold text-emerald-400">{stats.active}</p>
          <p className="text-xs text-[oklch(0.65_0_0)] mt-0.5">Employment status marked active</p>
        </div>
        <div className="card-surface p-4 md:p-5 rounded-xl border border-[var(--border)]">
          <p className="text-xs md:text-sm text-[oklch(0.70_0_0)] mb-1">Admins</p>
          <p className="text-2xl md:text-3xl font-bold text-indigo-300">{stats.admins}</p>
          <p className="text-xs text-[oklch(0.65_0_0)] mt-0.5">Users with admin privileges</p>
        </div>
      </div>

      {/* User List Table */}
      <div className="flex-1 min-h-0 flex flex-col">
        <DynamicTable
          title="User List"
          columns={userColumns}
          rows={users}
          loading={loading}
          defaultVisibleCount={6}
          renderActions={(row) => (
            <button
              onClick={() => handleViewUser(row)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-lg text-xs font-semibold hover:bg-indigo-500/20 transition-all whitespace-nowrap"
            >
              View
            </button>
          )}
        />
      </div>

      {/* User View Modal */}
      <UserView
        selectedUser={selectedUser}
        showDetailDialog={showDetailDialog}
        setShowDetailDialog={setShowDetailDialog}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}
