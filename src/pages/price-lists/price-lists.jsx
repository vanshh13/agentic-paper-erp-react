import { useMemo, useState } from 'react'
import { Tag, Plus, Search } from 'lucide-react'

const DEMO_PRICES = [
  { id: 1, sku: 'SKU-A-COP-6', description: 'A Category - Copier Paper 75 GSM', price: '₹35', unit: 'kg', type: 'standard', category: 'A', effective: '18/11/2025 - 18/12/2026', status: 'active' },
  { id: 2, sku: 'SKU-A-COP-691', description: 'A Category - Copier Paper 80 GSM', price: '₹55', unit: 'kg', type: 'standard', category: 'A', effective: '18/11/2025 - 18/12/2026', status: 'active' },
  { id: 3, sku: 'SKU-A-DUP-504', description: 'A Category - Duplex Board 230 GSM', price: '₹54', unit: 'kg', type: 'standard', category: 'A', effective: '18/11/2025 - 18/12/2026', status: 'active' },
  { id: 4, sku: 'SKU-A-ART-478', description: 'A Category - Art Paper 130 GSM', price: '₹58', unit: 'kg', type: 'standard', category: 'A', effective: '18/11/2025 - 18/12/2026', status: 'active' },
  { id: 5, sku: 'SKU-A-KRA-890', description: 'A Category - Kraft Paper 120 GSM', price: '₹64', unit: 'kg', type: 'standard', category: 'A', effective: '18/11/2025 - 18/12/2026', status: 'active' },
  { id: 6, sku: 'SKU-B-COP-818', description: 'B Category - Copier Paper 75 GSM', price: '₹56', unit: 'kg', type: 'standard', category: 'B', effective: '18/11/2025 - 18/12/2026', status: 'active' },
  { id: 7, sku: 'SKU-B-COP-785', description: 'B Category - Copier Paper 80 GSM', price: '₹45', unit: 'kg', type: 'standard', category: 'B', effective: '18/11/2025 - 18/12/2026', status: 'active' },
  { id: 8, sku: 'SKU-B-DUP-342', description: 'B Category - Duplex Board 230 GSM', price: '₹62', unit: 'kg', type: 'standard', category: 'B', effective: '18/11/2025 - 18/12/2026', status: 'active' },
  { id: 9, sku: 'SKU-B-ART-645', description: 'B Category - Art Paper 130 GSM', price: '₹68', unit: 'kg', type: 'standard', category: 'B', effective: '18/11/2025 - 18/12/2026', status: 'active' },
  { id: 10, sku: 'SKU-C-COP-123', description: 'C Category - Copier Paper 75 GSM', price: '₹48', unit: 'kg', type: 'bulk', category: 'C', effective: '18/11/2025 - 18/12/2026', status: 'active' },
  { id: 11, sku: 'SKU-C-KRA-456', description: 'C Category - Kraft Paper 120 GSM', price: '₹52', unit: 'kg', type: 'standard', category: 'C', effective: '18/11/2025 - 18/12/2026', status: 'active' },
  { id: 12, sku: 'SKU-C-ART-789', description: 'C Category - Art Paper 170 GSM', price: '₹72', unit: 'kg', type: 'standard', category: 'C', effective: '18/11/2025 - 18/12/2026', status: 'active' },
]

const STATS = [
  { label: 'Total Entries', value: '45', color: 'text-white' },
  { label: 'Active Prices', value: '45', color: 'text-emerald-400' },
  { label: 'Currencies', value: '1', color: 'text-cyan-400' },
]

export default function PriceLists() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All Types')

  const filteredPrices = useMemo(() => {
    return DEMO_PRICES.filter((price) => {
      const matchesSearch =
        price.sku.toLowerCase().includes(search.toLowerCase()) ||
        price.description.toLowerCase().includes(search.toLowerCase())
      const matchesType = typeFilter === 'All Types' || price.type === typeFilter.toLowerCase()
      return matchesSearch && matchesType
    })
  }, [search, typeFilter])

  return (
    <div className="space-y-6 pb-10 text-[oklch(0.95_0_0)] w-full px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Tag className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[oklch(0.98_0_0)]">Price Lists</h1>
              <p className="text-[oklch(0.70_0_0)] text-sm md:text-base mt-1">Manage product pricing by SKU, category, and customer</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors text-sm font-medium">
            <Plus className="w-4 h-4" />
            Add Price
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs text-[oklch(0.65_0_0)]">
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
            <p className="text-xs md:text-sm text-[oklch(0.70_0_0)] mb-2">{stat.label}</p>
            <p className={`text-3xl md:text-4xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search Section */}
      <div className="card-surface rounded-xl border border-[var(--border)] p-4 md:p-6">
        <h3 className="text-base md:text-lg font-semibold text-[oklch(0.95_0_0)] mb-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-indigo-400" />
          Search
        </h3>
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[220px]">
            <div className="flex items-center gap-2 bg-[oklch(0.30_0_0)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[oklch(0.85_0_0)]">
              <Search className="w-4 h-4 text-[oklch(0.65_0_0)]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by SKU or description..."
                className="bg-transparent focus:outline-none w-full placeholder:text-[oklch(0.65_0_0)]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Price List Table */}
      <div className="card-surface rounded-xl border border-[var(--border)] overflow-hidden">
        {/* Header */}
        <div className="px-4 md:px-6 py-4 border-b border-[var(--border)]">
          <h3 className="text-base md:text-lg font-semibold text-[oklch(0.95_0_0)]">Price List ({filteredPrices.length})</h3>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[oklch(0.28_0_0)]">
                <th className="px-6 py-4 text-left text-xs font-semibold text-[oklch(0.75_0_0)] uppercase tracking-wider">SKU / Description</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[oklch(0.75_0_0)] uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[oklch(0.75_0_0)] uppercase tracking-wider">Unit</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[oklch(0.75_0_0)] uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[oklch(0.75_0_0)] uppercase tracking-wider">Customer Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[oklch(0.75_0_0)] uppercase tracking-wider">Effective</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[oklch(0.75_0_0)] uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredPrices.map((price) => (
                <tr key={price.id} className="border-b border-[var(--border)] hover:bg-[oklch(0.32_0_0)] transition-colors">
                  <td className="px-6 py-4 text-sm">
                    <div className="font-medium text-[oklch(0.95_0_0)]">{price.sku}</div>
                    <div className="text-xs text-[oklch(0.65_0_0)]">{price.description}</div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-[oklch(0.90_0_0)]">{price.price}</td>
                  <td className="px-6 py-4 text-sm text-[oklch(0.85_0_0)]">{price.unit}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-400 capitalize">
                      {price.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-[oklch(0.90_0_0)]">{price.category}</td>
                  <td className="px-6 py-4 text-sm text-[oklch(0.85_0_0)]">{price.effective}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 capitalize">
                      {price.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPrices.length === 0 && (
          <div className="py-12 text-center text-[oklch(0.65_0_0)] text-sm">No price entries found</div>
        )}
      </div>
    </div>
  )
}
