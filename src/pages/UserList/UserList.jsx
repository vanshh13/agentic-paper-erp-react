import { useEffect, useMemo, useState } from 'react'
import { Eye as EyeIcon, Users as UsersIcon } from 'lucide-react'
import { userApi } from '../../services/api/user/user-api'
import { DynamicTable } from '../../components/table'
import UserView from '../../components/user/UserView'
import { userColumns } from './UserColums'

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

  const columns = useMemo(() => userColumns, [])

  return (
    <div className="text-[oklch(0.95_0_0)] w-full h-screen overflow-hidden flex flex-col px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="pt-2 pb-4 flex-shrink-0">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <UsersIcon className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[oklch(0.98_0_0)]">User List</h1>
            </div>
          </div>
        </div>
      </div>

      {/* User List Table */}
      <div className="flex-1 min-h-0 flex flex-col">
        <DynamicTable
          title="User List"
          columns={columns}
          rows={users}
          loading={loading}
          defaultVisibleCount={6}
          heightClass="h-full"
          renderActions={(row) => (
            <button
              onClick={() => handleViewUser(row)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-lg text-xs font-semibold hover:bg-indigo-500/20 transition-all whitespace-nowrap"
            >
              <EyeIcon className="w-4 h-4" aria-hidden="true" />
              <span className="sr-only">View</span>
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
