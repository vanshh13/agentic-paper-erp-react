import { ShoppingCart } from 'lucide-react'

export default function TopSellingProducts() {
  const topProducts = [
    { name: 'A4 Copy Paper', revenue: '₹2.4M', growth: '+13.2%' },
    { name: 'Photo Paper Glossy', revenue: '₹1.7M', growth: '+4.8%' },
    { name: 'Cardstock White', revenue: '₹1.31M', growth: '+12.1%' },
    { name: 'Bond Paper 70gsm', revenue: '₹1.29M', growth: '-3.2%' },
    { name: 'Kraft Paper Roll', revenue: '₹0.82M', growth: '+11.3%' },
  ]

  return (
    <div className="card-surface p-6 border border-[var(--border)]">
      <div className="space-y-4">
        {/* Header */}
        <div>
          <h3 className="text-lg font-semibold text-[oklch(0.95_0_0)] flex items-center gap-2 mb-1">
            <ShoppingCart className="w-5 h-5 text-blue-400" />
            Top Selling Products
          </h3>
          <p className="text-xs text-[oklch(0.65_0_0)]">Best performing products this month</p>
        </div>

        {/* Products List */}
        <div className="space-y-2">
          {topProducts.map((product) => {
            const isPositive = !product.growth.startsWith('-')
            
            return (
              <div key={product.name} className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
                <div>
                  <p className="text-sm font-medium text-[oklch(0.90_0_0)]">{product.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-[oklch(0.95_0_0)]">{product.revenue}</p>
                  <p className={`text-xs ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>{product.growth}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
