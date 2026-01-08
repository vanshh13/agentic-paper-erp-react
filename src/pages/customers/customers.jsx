import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Users, Plus, Search, Eye } from 'lucide-react'

const DEMO_CUSTOMERS = [
  {
    id: 1,
    name: 'Reliance Industries Ltd',
    email: 'procurement@reliancein.com',
    phone: '9861619190',
    type: 'existing',
    creditLimit: 2373169,
    creditUsed: 0,
    available: 2373169,
    status: 'active',
  },
  {
    id: 2,
    name: 'Tata Steel Ltd',
    email: 'procurement@tatasteel.com',
    phone: '9857737678',
    type: 'new',
    creditLimit: 797074,
    creditUsed: 0,
    available: 797074,
    status: 'active',
  },
  {
    id: 3,
    name: 'Hindustan Unilever',
    email: 'procurement@hindustan.com',
    phone: '9867124522',
    type: 'new',
    creditLimit: 1914371,
    creditUsed: 0,
    available: 1914371,
    status: 'active',
  },
  {
    id: 4,
    name: 'ITC Limited',
    email: 'procurement@itclimited.com',
    phone: '9864882567',
    type: 'existing',
    creditLimit: 3919562,
    creditUsed: 0,
    available: 3919562,
    status: 'active',
  },
  {
    id: 5,
    name: 'Mahindra & Mahindra',
    email: 'procurement@mahindra.com',
    phone: '9816869804',
    type: 'existing',
    creditLimit: 4684600,
    creditUsed: 0,
    available: 4684600,
    status: 'active',
  },
  {
    id: 6,
    name: 'Aditya Textiles',
    email: 'buy@adityatex.com',
    phone: '9820098200',
    type: 'new',
    creditLimit: 1250000,
    creditUsed: 120000,
    available: 1130000,
    status: 'active',
  },
]

const STATS = [
  { label: 'Total Customers', value: '31', sublabel: '30 active customers', color: 'text-violet-600' },
  { label: 'Total Credit Used', value: '₹86,30,000', sublabel: 'Across all customers', color: 'text-emerald-400' },
  { label: 'Avg Credit Utilization', value: '10.3%', sublabel: 'Average across portfolio', color: 'text-indigo-300' },
]

export default function Customers() {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Status')

  const filteredCustomers = useMemo(() => {
    return DEMO_CUSTOMERS.filter((cust) => {
      const target = `${cust.name} ${cust.email} ${cust.phone}`.toLowerCase()
      const matchesSearch = target.includes(search.toLowerCase())
      const matchesStatus = statusFilter === 'All Status' || cust.status === statusFilter.toLowerCase()
      return matchesSearch && matchesStatus
    })
  }, [search, statusFilter])

  const getTypeBadge = (type) => (type === 'existing'
    ? 'bg-indigo-500/20 text-indigo-400'
    : 'bg-emerald-500/20 text-emerald-400')

  const getStatusBadge = (status) => (status === 'active'
    ? 'bg-emerald-500/20 text-emerald-400'
    : 'bg-amber-500/20 text-amber-400')

  const formatCurrency = (num) => `₹${num.toLocaleString('en-IN')}`

  return (
    <div className="space-y-6 pb-10 text-foreground w-full px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Customers</h1>
              <p className="text-muted-foreground text-sm md:text-base mt-1">Manage customer relationships and credit limits</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors text-sm font-medium">
            <Plus className="w-4 h-4" />
            Add Customer
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 bg-indigo-400 rounded-sm"></span>
            Showing data from all companies
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="card-surface p-5 md:p-6 rounded-xl border border-[var(--border)]">
            <p className="text-xs md:text-sm text-muted-foreground mb-2">{stat.label}</p>
            <p className={`text-3xl md:text-4xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">{stat.sublabel}</p>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="card-surface rounded-xl border border-[var(--border)] p-4 md:p-6">
        <h3 className="text-base md:text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-indigo-400" />
          Search & Filter
        </h3>
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[240px]">
            <div className="flex items-center gap-2 bg-input border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-foreground">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, or status..."
                className="bg-transparent focus:outline-none w-full placeholder:text-muted-foreground"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="min-w-[140px] bg-input border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none"
          >
            {['All Status', 'Active', 'Inactive'].map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="card-surface rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="px-4 md:px-6 py-4 border-b border-[var(--border)]">
          <h3 className="text-base md:text-lg font-semibold text-foreground">Customer List ({filteredCustomers.length})</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-secondary">
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Credit Limit</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Credit Used</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Available</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((cust) => {
                const utilization = cust.creditLimit === 0 ? 0 : Math.min(100, Math.round((cust.creditUsed / cust.creditLimit) * 100))
                return (
                  <tr key={cust.id} className="border-b border-[var(--border)] hover:bg-accent transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{cust.name}</td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      <div>{cust.email}</div>
                      <div className="text-muted-foreground text-xs">{cust.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getTypeBadge(cust.type)}`}>
                        {cust.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{formatCurrency(cust.creditLimit)}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{formatCurrency(cust.creditUsed)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{formatCurrency(cust.available)}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(cust.status)}`}>
                        {cust.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                        <button className="text-indigo-400 hover:text-indigo-300 transition-colors" title="View">
                          <Eye className="w-4 h-4" />
                        </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="py-12 text-center text-muted-foreground text-sm">No customers found</div>
        )}
      </div>
    </div>
  )
}
