import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Package, Plus, Search } from 'lucide-react'

const DEMO_PRODUCTS = [
  { id: 1, name: 'VIVEX', category: 'kraft', brand: '-', gsm: 90, stock: '6 sheets 0', minLevel: '0 sheets', price: '₹1,999', status: 'active' },
  { id: 2, name: 'Copier Paper 75 GSM A4', category: 'Copier', brand: 'JK Paper', gsm: 75, stock: '15376 kg', minLevel: '1875 kg', price: '₹58', status: 'active' },
  { id: 3, name: 'Copier Paper 80 GSM A4', category: 'Copier', brand: 'JK Paper', gsm: 80, stock: '43318 kg', minLevel: '909 kg', price: '₹58', status: 'active' },
  { id: 4, name: 'Duplex Board 230 GSM', category: 'Duplex', brand: 'Century', gsm: 230, stock: '15149 kg', minLevel: '1366 kg', price: '₹78', status: 'active' },
  { id: 5, name: 'Duplex Board 300 GSM', category: 'Duplex', brand: 'Century', gsm: 300, stock: '32877 kg', minLevel: '855 kg', price: '₹51', status: 'active' },
  { id: 6, name: 'Art Paper 130 GSM', category: 'Art Paper', brand: 'Ballarpur', gsm: 130, stock: '45914 kg', minLevel: '1735 kg', price: '₹80', status: 'active' },
  { id: 7, name: 'Art Paper 170 GSM', category: 'Art Paper', brand: 'Ballarpur', gsm: 170, stock: '48899 kg', minLevel: '1840 kg', price: '₹18', status: 'active' },
  { id: 8, name: 'Kraft Paper 120 GSM', category: 'Kraft', brand: 'West Coast', gsm: 120, stock: '5047 kg', minLevel: '1036 kg', price: '₹49', status: 'active' },
  { id: 9, name: 'Bond Paper 80 GSM', category: 'Bond', brand: 'ITC', gsm: 80, stock: '2300 kg', minLevel: '500 kg', price: '₹42', status: 'low_stock' },
  { id: 10, name: 'Gloss Paper 150 GSM', category: 'Gloss', brand: 'Century', gsm: 150, stock: '8750 kg', minLevel: '1200 kg', price: '₹95', status: 'active' },
  { id: 11, name: 'Newsprint 45 GSM', category: 'Newsprint', brand: 'APP', gsm: 45, stock: '3200 kg', minLevel: '800 kg', price: '₹35', status: 'low_stock' },
  { id: 12, name: 'Cardboard 200 GSM', category: 'Cardboard', brand: 'Mondi', gsm: 200, stock: '12500 kg', minLevel: '2500 kg', price: '₹62', status: 'active' },
]

const STATS = [
  { label: 'Total Products', value: '36', sublabel: '31 active', color: 'text-violet-600', bgColor: 'bg-indigo-500/20' },
  { label: 'Low Stock Alert', value: '2', sublabel: 'Items below minimum level', color: 'text-orange-400', bgColor: 'bg-orange-500/20' },
  { label: 'Inventory Value', value: '₹4,29,01,438', sublabel: 'Total stock value', color: 'text-indigo-300', bgColor: 'bg-indigo-500/20' },
]

export default function Products() {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All Categories')

  const filteredProducts = useMemo(() => {
    return DEMO_PRODUCTS.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.brand.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = categoryFilter === 'All Categories' || product.category === categoryFilter
      return matchesSearch && matchesCategory
    })
  }, [search, categoryFilter])

  const categories = ['All Categories', ...new Set(DEMO_PRODUCTS.map(p => p.category))]

  const getStatusColor = (status) => {
    return status === 'active' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-orange-500/20 text-orange-400'
  }

  return (
    <div className="space-y-6 pb-10 text-foreground w-full px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Product Catalog</h1>
              <p className="text-muted-foreground text-sm md:text-base mt-1">Manage inventory and product specifications</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors text-sm font-medium">
            <Plus className="w-4 h-4" />
            Add Product
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
          <div key={stat.label} className={`card-surface p-5 md:p-6 rounded-xl border border-[var(--border)] ${stat.bgColor}`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className={`text-2xl md:text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground">{stat.sublabel}</p>
          </div>
        ))}
      </div>

      {/* Search Products */}
      <div className="card-surface rounded-xl border border-[var(--border)] p-4 md:p-6">
        <h3 className="text-base md:text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-indigo-400" />
          Search Products
        </h3>
        <p className="text-muted-foreground text-sm mb-4">Find products by name or category</p>
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[220px]">
            <div className="flex items-center gap-2 bg-input border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-foreground">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="bg-transparent focus:outline-none w-full placeholder:text-muted-foreground"
              />
            </div>
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="min-w-[140px] bg-input border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none"
          >
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="card-surface rounded-xl border border-[var(--border)] overflow-hidden">
        {/* Header */}
        <div className="px-4 md:px-6 py-4 border-b border-[var(--border)]">
          <h3 className="text-base md:text-lg font-semibold text-foreground">Products ({filteredProducts.length})</h3>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-secondary">
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Product Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Brand</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">GSM</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Min Level</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-[var(--border)] hover:bg-accent transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{product.category}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{product.brand}</td>
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{product.gsm}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{product.stock}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{product.minLevel}</td>
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{product.price}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(product.status)}`}>
                      {product.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-12 text-center text-muted-foreground text-sm">No products found</div>
        )}
      </div>
    </div>
  )
}
