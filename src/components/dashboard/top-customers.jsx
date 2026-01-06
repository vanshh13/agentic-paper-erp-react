import { Users } from 'lucide-react'

export default function TopCustomers() {
  const topCustomers = [
    { name: 'PrintMaster Solutions', revenue: '₹8.5M', customerCode: 'PMS', growth: '+14.2%' },
    { name: 'TechCorp India', revenue: '₹6.2M', customerCode: 'TCI', growth: '+9.8%' },
    { name: 'Global Print Services', revenue: '₹5.89M', customerCode: 'GPS', growth: '+11.2%' },
    { name: 'Office Supplies Co.', revenue: '₹4.98M', customerCode: 'OSC', growth: '+4.5%' },
    { name: 'Digital Print Hub', revenue: '₹4.1M', customerCode: 'DPH', growth: '+7.3%' },
  ]

  return (
    <div className="card-surface p-6 border border-[var(--border)]">
      <div className="space-y-4">
        {/* Header */}
        <div>
          <h3 className="text-lg font-semibold text-[oklch(0.95_0_0)] flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-purple-400" />
            Top Customers
          </h3>
          <p className="text-xs text-[oklch(0.65_0_0)]">Highest value customers this month</p>
        </div>

        {/* Customers List */}
        <div className="space-y-2">
          {topCustomers.map((customer) => {
            return (
              <div key={customer.name} className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
                <div className="flex items-center gap-2 flex-1">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-semibold text-purple-400">{customer.customerCode}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[oklch(0.90_0_0)]">{customer.name}</p>
                  </div>
                </div>
                <div className="text-right ml-2">
                  <p className="text-sm font-semibold text-[oklch(0.95_0_0)]">{customer.revenue}</p>
                  <p className="text-xs text-emerald-400">{customer.growth}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
