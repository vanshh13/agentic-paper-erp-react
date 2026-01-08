import { useMemo, useState } from 'react'
import { Eye, Plus, RefreshCcw, Search, ShoppingCart } from 'lucide-react'

const STATUS_BADGES = {
  pending: 'bg-amber-500/20 text-amber-400',
  processing: 'bg-blue-500/20 text-blue-400',
  shipped: 'bg-indigo-500/20 text-indigo-400',
  delivered: 'bg-emerald-500/20 text-emerald-400',
  cancelled: 'bg-red-500/20 text-red-400',
}

const PAYMENT_BADGES = {
  pending: 'bg-amber-500/20 text-amber-400',
  paid: 'bg-emerald-500/20 text-emerald-400',
  failed: 'bg-red-500/20 text-red-400',
}

const DEMO_ORDERS = [
  { number: 'SO-20251218-9830', status: 'pending', payment: 'pending', amount: '₹15,000', deliveryDate: '19/12/2025', createdAt: '18/12/2025' },
  { number: 'SO-20251218-1548', status: 'pending', payment: 'pending', amount: '₹15,000', deliveryDate: '19/12/2025', createdAt: '18/12/2025' },
  { number: 'SO-20251218-9678', status: 'processing', payment: 'pending', amount: '₹18,400', deliveryDate: '20/12/2025', createdAt: '18/12/2025' },
  { number: 'SO-20251218-4948', status: 'shipped', payment: 'paid', amount: '₹22,750', deliveryDate: '22/12/2025', createdAt: '18/12/2025' },
  { number: 'SO-20251218-1664', status: 'delivered', payment: 'paid', amount: '₹10,001', deliveryDate: '18/12/2025', createdAt: '17/12/2025' },
]

export default function SalesOrders() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [paymentFilter, setPaymentFilter] = useState('All Payments')

  const filteredOrders = useMemo(() => {
    return DEMO_ORDERS.filter((order) => {
      const matchesSearch = order.number.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === 'All Status' || order.status === statusFilter.toLowerCase()
      const matchesPayment = paymentFilter === 'All Payments' || order.payment === paymentFilter.toLowerCase()
      return matchesSearch && matchesStatus && matchesPayment
    })
  }, [search, statusFilter, paymentFilter])

  return (
    <div className="space-y-6 pb-10 text-foreground w-full px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-indigo-500/20 text-indigo-400">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Sales Orders</h1>
              <p className="text-muted-foreground text-sm md:text-base mt-1">Manage and track all sales orders</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors text-sm font-medium">
            <Plus className="w-4 h-4" />
            Create Order
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card-surface rounded-xl border border-[var(--border)] p-4 md:p-6 space-y-4">
        <div className="flex flex-wrap gap-3 items-center text-muted-foreground text-sm font-medium">
          <span className="text-base md:text-lg text-foreground">Filters</span>
          <span className="text-xs md:text-sm">Filter and search sales orders</span>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[220px]">
            <div className="flex items-center gap-2 bg-input border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-foreground">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by order number..."
                className="bg-transparent focus:outline-none w-full placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="min-w-[140px] bg-input border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none"
          >
            {['All Status', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="min-w-[140px] bg-input border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none"
          >
            {['All Payments', 'Paid', 'Pending', 'Failed'].map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>

          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary border border-[var(--border)] text-foreground hover:bg-accent hover:border-indigo-500/60 transition-colors text-sm">
            <RefreshCcw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card-surface rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="px-4 md:px-6 py-3 border-b border-[var(--border)] flex items-center justify-between">
          <div>
            <h3 className="text-base md:text-lg font-semibold text-foreground">Orders ({filteredOrders.length})</h3>
            <p className="text-muted-foreground text-xs md:text-sm">Most recent orders first</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-muted">
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Order Number</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Payment</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Delivery Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Created</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.number}
                  className="border-b border-[var(--border)] hover:bg-accent transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{order.number}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_BADGES[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${PAYMENT_BADGES[order.payment]}`}>
                      {order.payment}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{order.amount}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{order.deliveryDate}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{order.createdAt}</td>
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

        {filteredOrders.length === 0 && (
          <div className="py-12 text-center text-muted-foreground text-sm">No orders found</div>
        )}
      </div>
    </div>
  )
}
