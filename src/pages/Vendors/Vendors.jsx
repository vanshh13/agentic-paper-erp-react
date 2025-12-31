import { useMemo, useState } from 'react'
import { Building2, Plus, Search, Eye } from 'lucide-react'

const STATS = [
  { label: 'Total Vendors', value: '15', sublabel: '15 active', color: 'text-white' },
  { label: 'Traders', value: '0', sublabel: '', color: 'text-blue-400' },
  { label: 'Importers', value: '9', sublabel: '', color: 'text-purple-400' },
  { label: 'Manufacturers', value: '3', sublabel: '', color: 'text-emerald-400' },
]

const DEMO_VENDORS = [
  { id: 1, name: 'JK', code: 'VND0001', type: 'manufacturer', gstin: '26AABCU5978R1Z3', location: 'GJ', creditLimit: 3892308, rating: 4.0, status: 'active' },
  { id: 2, name: 'Century', code: 'VND0002', type: 'distributor', gstin: '02AABCU6454R1Z2', location: 'HP', creditLimit: 6072334, rating: 4.0, status: 'active' },
  { id: 3, name: 'Ballarpur', code: 'VND0003', type: 'importer', gstin: '06AABCU5487R1Z6', location: 'DL', creditLimit: 9119203, rating: 5.0, status: 'active' },
  { id: 4, name: 'Tamil', code: 'VND0004', type: 'importer', gstin: '12AABCU3966R1Z5', location: 'TN', creditLimit: 3102479, rating: 3.0, status: 'active' },
  { id: 5, name: 'Andhra', code: 'VND0005', type: 'manufacturer', gstin: '19AABCU3588R1Z8', location: 'AP', creditLimit: 2011505, rating: 4.0, status: 'active' },
  { id: 6, name: 'West', code: 'VND0006', type: 'importer', gstin: '30AABCU3948R1Z3', location: 'MH', creditLimit: 2706055, rating: 3.8, status: 'inactive' },
]

const TYPE_BADGES = {
  manufacturer: 'bg-emerald-500/15 text-emerald-300',
  distributor: 'bg-indigo-500/15 text-indigo-300',
  importer: 'bg-purple-500/15 text-purple-300',
  trader: 'bg-blue-500/15 text-blue-300',
}

export default function Vendors() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All Types')
  const [statusFilter, setStatusFilter] = useState('All Status')

  const filteredVendors = useMemo(() => {
    return DEMO_VENDORS.filter((v) => {
      const target = `${v.name} ${v.code} ${v.gstin}`.toLowerCase()
      const matchesSearch = target.includes(search.toLowerCase())
      const matchesType = typeFilter === 'All Types' || v.type === typeFilter.toLowerCase()
      const matchesStatus = statusFilter === 'All Status' || v.status === statusFilter.toLowerCase()
      return matchesSearch && matchesType && matchesStatus
    })
  }, [search, typeFilter, statusFilter])

  const formatCurrency = (num) => `₹${num.toLocaleString('en-IN')}`

  return (
    <div className="space-y-6 pb-10 text-[oklch(0.95_0_0)] w-full px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[oklch(0.98_0_0)]">Vendors</h1>
              <p className="text-[oklch(0.70_0_0)] text-sm md:text-base mt-1">Manage vendor registrations and relationships</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors text-sm font-medium">
            <Plus className="w-4 h-4" />
            Add Vendor
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs text-[oklch(0.65_0_0)]">
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 bg-indigo-400 rounded-sm"></span>
            Showing data from all companies
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="card-surface p-4 md:p-5 rounded-xl border border-[var(--border)]">
            <p className="text-xs md:text-sm text-[oklch(0.70_0_0)] mb-2">{stat.label}</p>
            <p className={`text-2xl md:text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            {stat.sublabel && <p className="text-xs text-[oklch(0.65_0_0)]">{stat.sublabel}</p>}
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="card-surface rounded-xl border border-[var(--border)] p-4 md:p-6">
        <h3 className="text-base md:text-lg font-semibold text-[oklch(0.95_0_0)] mb-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-indigo-400" />
          Search & Filter
        </h3>
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[240px]">
            <div className="flex items-center gap-2 bg-[oklch(0.30_0_0)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[oklch(0.85_0_0)]">
              <Search className="w-4 h-4 text-[oklch(0.65_0_0)]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search vendors by name, code, or GSTIN..."
                className="bg-transparent focus:outline-none w-full placeholder:text-[oklch(0.65_0_0)]"
              />
            </div>
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="min-w-[140px] bg-[oklch(0.30_0_0)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[oklch(0.90_0_0)] focus:outline-none"
          >
            {['All Types', 'Manufacturer', 'Distributor', 'Importer', 'Trader'].map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="min-w-[140px] bg-[oklch(0.30_0_0)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[oklch(0.90_0_0)] focus:outline-none"
          >
            {['All Status', 'Active', 'Inactive'].map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Vendor List */}
      <div className="card-surface rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="px-4 md:px-6 py-4 border-b border-[var(--border)]">
          <h3 className="text-base md:text-lg font-semibold text-[oklch(0.95_0_0)]">Vendor List ({filteredVendors.length})</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[oklch(0.28_0_0)]">
                <th className="px-6 py-4 text-left text-xs font-semibold text-[oklch(0.75_0_0)] uppercase tracking-wider">Vendor</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[oklch(0.75_0_0)] uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[oklch(0.75_0_0)] uppercase tracking-wider">GSTIN</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[oklch(0.75_0_0)] uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[oklch(0.75_0_0)] uppercase tracking-wider">Credit Limit</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[oklch(0.75_0_0)] uppercase tracking-wider">Rating</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[oklch(0.75_0_0)] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[oklch(0.75_0_0)] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVendors.map((v) => (
                <tr key={v.id} className="border-b border-[var(--border)] hover:bg-[oklch(0.32_0_0)] transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-[oklch(0.95_0_0)]">
                    <div>{v.name}</div>
                    <div className="text-xs text-[oklch(0.65_0_0)]">{v.code}</div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium capitalize ${TYPE_BADGES[v.type] || 'bg-[oklch(0.35_0_0)] text-[oklch(0.80_0_0)]'}`}>
                      {v.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[oklch(0.85_0_0)]">{v.gstin}</td>
                  <td className="px-6 py-4 text-sm text-[oklch(0.85_0_0)]">{v.location}</td>
                  <td className="px-6 py-4 text-sm font-medium text-[oklch(0.90_0_0)]">{formatCurrency(v.creditLimit)}</td>
                  <td className="px-6 py-4 text-sm text-[oklch(0.85_0_0)]">{v.rating.toFixed(1)}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium capitalize ${v.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button className="text-indigo-400 hover:text-indigo-300 transition-colors" title="View">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredVendors.length === 0 && (
          <div className="py-12 text-center text-[oklch(0.65_0_0)] text-sm">No vendors found</div>
        )}
      </div>
    </div>
  )
}