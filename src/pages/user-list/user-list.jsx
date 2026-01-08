import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Eye as EyeIcon, Users as UsersIcon } from 'lucide-react'
import { userApi } from '../../services/api/user/user-api'
import { DynamicTable } from '../../components/table'
import { userColumns } from './user-colums'

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
  const isDarkMode = useSelector((state) => state.theme.isDarkMode)
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
    navigate(`/users/${user.user_id}`)
  }

  const columns = useMemo(() => userColumns, [])

  return (
    <div className="text-foreground w-full h-screen overflow-hidden flex flex-col px-3 sm:px-4 lg:px-8">
      {/* Header */}
      <div className="pt-2 pb-3 sm:pb-4 flex-shrink-0">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-2 sm:p-2.5 rounded-lg bg-indigo-500/20 text-indigo-400 flex-shrink-0">
              <UsersIcon className="w-5 sm:w-7 h-5 sm:h-7" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-foreground">User List</h1>
            </div>
          </div>
        </div>
      </div>

      {/* User List Table - Desktop */}
      <div className="flex-1 min-h-0 flex flex-col hidden sm:flex">
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

      {/* Mobile Card View */}
      <div className="flex-1 min-h-0 flex flex-col overflow-y-auto sm:hidden px-2">
        {loading ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No users found
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 py-3">
            {users.map((user) => (
              <div
                key={user.user_id}
                className="bg-card border border-border rounded-lg p-4 hover:bg-accent transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-foreground truncate">
                      {user.full_name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {user.employee_code}
                    </p>
                    <div className="flex flex-col gap-1 mt-2 text-xs text-muted-foreground">
                      {user.designation_name && (
                        <p>{user.designation_name}</p>
                      )}
                      {user.department_name && (
                        <p>{user.department_name}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleViewUser(user)}
                    className="flex items-center justify-center p-2 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-lg hover:bg-indigo-500/20 transition-all flex-shrink-0"
                    aria-label="View user"
                  >
                    <EyeIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
