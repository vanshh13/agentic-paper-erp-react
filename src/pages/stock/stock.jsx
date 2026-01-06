import { useMemo, useState } from 'react'
import { Package, Plus, Search } from 'lucide-react'

const DEMO_STOCK_DATA = [
  { location: 'Main Warehouse', bin: 'C-2-3', batch: 'BATCH-2024593', available: 16642, booked: 957, inTransit: 593, qcStatus: 'passed', stockLevel: 85 },
  { location: 'Warehouse A', bin: 'F-9-2', batch: 'BATCH-2024096', available: 27055, booked: 1901, inTransit: 169, qcStatus: 'passed', stockLevel: 90 },
  { location: 'Main Warehouse', bin: 'B-1-4', batch: 'BATCH-2024962', available: 1406, booked: 768, inTransit: 740, qcStatus: 'pending', stockLevel: 35 },
  { location: 'Main Warehouse', bin: 'E-8-3', batch: 'BATCH-2024917', available: 5164, booked: 1208, inTransit: 13, qcStatus: 'pending', stockLevel: 52 },
  { location: 'Main Warehouse', bin: 'B-8-4', batch: 'BATCH-2024060', available: 21342, booked: 1247, inTransit: 871, qcStatus: 'passed', stockLevel: 88 },
  { location: 'Warehouse B', bin: 'D-5-1', batch: 'BATCH-2024504', available: 8900, booked: 450, inTransit: 320, qcStatus: 'passed', stockLevel: 78 },
  { location: 'Warehouse C', bin: 'G-3-6', batch: 'BATCH-2024281', available: 3200, booked: 800, inTransit: 240, qcStatus: 'pending', stockLevel: 48 },
  { location: 'Main Warehouse', bin: 'A-2-5', batch: 'BATCH-2024715', available: 15000, booked: 2300, inTransit: 450, qcStatus: 'passed', stockLevel: 82 },
]

const STATS = [
  { label: 'Warehouses', value: '3', icon: 'package', color: 'text-slate-300' },
  { label: 'Available', value: '499,268', icon: 'check', color: 'text-emerald-400' },
  { label: 'Booked', value: '45,455', icon: 'lock', color: 'text-blue-400' },
  { label: 'In Transit', value: '20,572', icon: 'truck', color: 'text-purple-400' },
  { label: 'Low Stock', value: '72', icon: 'alert', color: 'text-red-400' },
]

export default function Stock() {
  const [search, setSearch] = useState('')
  const [warehouseFilter, setWarehouseFilter] = useState('All Warehouses')

  const filteredStock = useMemo(() => {
    return DEMO_STOCK_DATA.filter((item) => {
      const matchesSearch =
        item.location.toLowerCase().includes(search.toLowerCase()) ||
        item.bin.toLowerCase().includes(search.toLowerCase()) ||
        item.batch.toLowerCase().includes(search.toLowerCase())
      const matchesWarehouse = warehouseFilter === 'All Warehouses' || item.location === warehouseFilter
      return matchesSearch && matchesWarehouse
    })
  }, [search, warehouseFilter])

  const warehouses = ['All Warehouses', ...new Set(DEMO_STOCK_DATA.map(item => item.location))]

  const getQCStatusColor = (status) => {
    return status === 'passed' ? 'text-emerald-400' : 'text-amber-400'
  }

  const getStockLevelWidth = (level) => {
    return `${level}%`
  }

  return (
    <div className="space-y-6 pb-10 text-[oklch(0.95_0_0)] w-full px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[oklch(0.98_0_0)]">Stock & Inventory</h1>
              <p className="text-[oklch(0.70_0_0)] text-sm md:text-base mt-1">Multi-warehouse stock management</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors text-sm font-medium">
            <Plus className="w-4 h-4" />
            Add Stock
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="card-surface p-4 md:p-5 rounded-xl border border-[var(--border)]">
            <p className="text-xs md:text-sm text-[oklch(0.70_0_0)] mb-2">{stat.label}</p>
            <p className={`text-2xl md:text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Stock Listing */}
      <div className="card-surface rounded-xl border border-[var(--border)] overflow-hidden">
        {/* Header */}
        <div className="px-4 md:px-6 py-4 border-b border-[var(--border)] flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-base md:text-lg font-semibold text-[oklch(0.95_0_0)]">Stock Listing</h3>
          <div className="flex flex-wrap gap-2 items-center">
            <select
              value={warehouseFilter}
              onChange={(e) => setWarehouseFilter(e.target.value)}
              className="px-3 py-2 bg-[oklch(0.30_0_0)] border border-[var(--border)] rounded-lg text-sm text-[oklch(0.90_0_0)] focus:outline-none"
            >
              {warehouses.map((wh) => (
                <option key={wh}>{wh}</option>
              ))}
            </select>
            <div className="flex items-center gap-2 bg-[oklch(0.30_0_0)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[oklch(0.85_0_0)]">
              <Search className="w-4 h-4 text-[oklch(0.65_0_0)]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="bg-transparent focus:outline-none w-full placeholder:text-[oklch(0.65_0_0)]"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[oklch(0.28_0_0)]">
                <th className="px-6 py-4 text-left text-xs font-semibold text-[oklch(0.75_0_0)] uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[oklch(0.75_0_0)] uppercase tracking-wider">Bin</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[oklch(0.75_0_0)] uppercase tracking-wider">Batch</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[oklch(0.75_0_0)] uppercase tracking-wider">Available</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[oklch(0.75_0_0)] uppercase tracking-wider">Booked</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[oklch(0.75_0_0)] uppercase tracking-wider">In Transit</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[oklch(0.75_0_0)] uppercase tracking-wider">QC Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[oklch(0.75_0_0)] uppercase tracking-wider">Stock Level</th>
              </tr>
            </thead>
            <tbody>
              {filteredStock.map((stock, idx) => (
                <tr key={idx} className="border-b border-[var(--border)] hover:bg-[oklch(0.32_0_0)] transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-[oklch(0.95_0_0)]">{stock.location}</td>
                  <td className="px-6 py-4 text-sm text-[oklch(0.85_0_0)]">{stock.bin}</td>
                  <td className="px-6 py-4 text-sm text-[oklch(0.85_0_0)]">{stock.batch}</td>
                  <td className="px-6 py-4 text-sm font-medium text-emerald-400">{stock.available.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm font-medium text-blue-400">{stock.booked.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm font-medium text-purple-400">{stock.inTransit.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getQCStatusColor(stock.qcStatus)} ${stock.qcStatus === 'passed' ? 'bg-emerald-500/20' : 'bg-amber-500/20'}`}>
                      {stock.qcStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="w-full bg-[oklch(0.35_0_0)] rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all"
                        style={{ width: getStockLevelWidth(stock.stockLevel) }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredStock.length === 0 && (
          <div className="py-12 text-center text-[oklch(0.65_0_0)] text-sm">No stock items found</div>
        )}
      </div>
    </div>
  )
}