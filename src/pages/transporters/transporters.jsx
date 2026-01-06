import { useMemo, useState } from 'react'
import { Truck, Plus, Search, Star, Eye, Phone } from 'lucide-react'

const STATS = [
  { label: 'Total Transporters', value: '10', sublabel: '10 active', color: 'text-white' },
  { label: 'Avg Rating', value: '4.2', sublabel: 'Across all partners', color: 'text-amber-300' },
  { label: 'Active Partners', value: '10', sublabel: 'Online and verified', color: 'text-emerald-400' },
]

const DEMO_TRANSPORTERS = [
  { id: 1, name: 'Gati Logistics', code: 'TRN001', contact: '9816218681', gstin: '-', rateKm: 7, rateKg: '-', rating: 4.0, status: 'active' },
  { id: 2, name: 'Blue Dart Express', code: 'TRN002', contact: '9842585858', gstin: '-', rateKm: 9, rateKg: '-', rating: 4.0, status: 'active' },
  { id: 3, name: 'Delivery', code: 'TRN003', contact: '9829062278', gstin: '-', rateKm: 11, rateKg: '-', rating: 5.0, status: 'active' },
  { id: 4, name: 'DTDC Courier', code: 'TRN004', contact: '9818998912', gstin: '-', rateKm: 10, rateKg: '-', rating: 3.0, status: 'active' },
  { id: 5, name: 'Safexpress', code: 'TRN005', contact: '9879838596', gstin: '-', rateKm: 12, rateKg: '-', rating: 4.0, status: 'active' },
  { id: 6, name: 'VRL Logistics', code: 'TRN006', contact: '9844598906', gstin: '-', rateKm: 6, rateKg: '-', rating: 4.0, status: 'active' },
  { id: 7, name: 'TCI Express', code: 'TRN007', contact: '9830650065', gstin: '-', rateKm: 6, rateKg: '-', rating: 4.0, status: 'active' },
  { id: 8, name: 'TCI Freight', code: 'TRN008', contact: '9834436676', gstin: '-', rateKm: 6, rateKg: '-', rating: 4.0, status: 'active' },
  { id: 9, name: 'Om Logistics', code: 'TRN009', contact: '9887766656', gstin: '-', rateKm: 8, rateKg: '-', rating: 4.2, status: 'active' },
  { id: 10, name: 'KPN Travels', code: 'TRN010', contact: '9845012345', gstin: '-', rateKm: 7, rateKg: '-', rating: 4.1, status: 'active' },
]

export default function Transporters() {
  const [search, setSearch] = useState('')

  const filteredTransporters = useMemo(() => {
    return DEMO_TRANSPORTERS.filter((t) => {
      const target = `${t.name} ${t.code} ${t.contact}`.toLowerCase()
      return target.includes(search.toLowerCase())
    })
  }, [search])

  const formatRate = (value) => (value === '-' ? '-' : `₹${value.toFixed(2)}`)

  return (
    <div className="space-y-6 pb-10 text-[oklch(0.95_0_0)] w-full px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[oklch(0.98_0_0)]">Transporters</h1>
              <p className="text-[oklch(0.70_0_0)] text-sm md:text-base mt-1">Manage transportation partners and rates</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors text-sm font-medium">
            <Plus className="w-4 h-4" />
            Add Transporter
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="card-surface p-5 md:p-6 rounded-xl border border-[var(--border)]">
            <p className="text-xs md:text-sm text-[oklch(0.70_0_0)] mb-2">{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <p className={`text-3xl md:text-4xl font-bold ${stat.color}`}>{stat.value}</p>
              {stat.label === 'Avg Rating' && <Star className="w-4 h-4 text-amber-300" fill="currentColor" />}
            </div>
            <p className="text-xs md:text-sm text-[oklch(0.65_0_0)] mt-1">{stat.sublabel}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="card-surface rounded-xl border border-[var(--border)] p-4 md:p-6">
        <h3 className="text-base md:text-lg font-semibold text-[oklch(0.95_0_0)] mb-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-indigo-400" />
          Search
        </h3>
        <div className="flex items-center gap-2 bg-[oklch(0.30_0_0)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[oklch(0.85_0_0)]">
          <Search className="w-4 h-4 text-[oklch(0.65_0_0)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, code, or contact..."
            className="bg-transparent focus:outline-none w-full placeholder:text-[oklch(0.65_0_0)]"
          />
        </div>
      </div>

      {/* Transporters Table */}
      <div className="card-surface rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="px-4 md:px-6 py-4 border-b border-[var(--border)]">
          <h3 className="text-base md:text-lg font-semibold text-[oklch(0.95_0_0)]">Transporters ({filteredTransporters.length})</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[oklch(0.28_0_0)]">
                <th className="px-6 py-4 text-left text-xs font-semibold text-[oklch(0.75_0_0)] uppercase tracking-wider">Transporter</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[oklch(0.75_0_0)] uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[oklch(0.75_0_0)] uppercase tracking-wider">GSTIN</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[oklch(0.75_0_0)] uppercase tracking-wider">Rate/KM</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[oklch(0.75_0_0)] uppercase tracking-wider">Rate/KG</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[oklch(0.75_0_0)] uppercase tracking-wider">Rating</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[oklch(0.75_0_0)] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[oklch(0.75_0_0)] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransporters.map((t) => (
                <tr key={t.id} className="border-b border-[var(--border)] hover:bg-[oklch(0.32_0_0)] transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-[oklch(0.95_0_0)]">
                    <div>{t.name}</div>
                    <div className="text-xs text-[oklch(0.65_0_0)]">{t.code}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[oklch(0.85_0_0)]">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[oklch(0.65_0_0)]" />
                      <span>{t.contact}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[oklch(0.85_0_0)]">{t.gstin}</td>
                  <td className="px-6 py-4 text-sm text-[oklch(0.85_0_0)]">{formatRate(t.rateKm)}</td>
                  <td className="px-6 py-4 text-sm text-[oklch(0.85_0_0)]">{formatRate(t.rateKg)}</td>
                  <td className="px-6 py-4 text-sm text-[oklch(0.85_0_0)]">
                    <div className="inline-flex items-center gap-1 text-amber-300">
                      <Star className="w-4 h-4" fill="currentColor" />
                      <span className="text-[oklch(0.90_0_0)]">{t.rating.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium capitalize bg-emerald-500/20 text-emerald-400">
                      {t.status}
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

        {filteredTransporters.length === 0 && (
          <div className="py-12 text-center text-[oklch(0.65_0_0)] text-sm">No transporters found</div>
        )}
      </div>
    </div>
  )
}