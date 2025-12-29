import { Link } from 'react-router-dom'
import { ArrowRight, Users, Package, ShoppingCart, BarChart3, FileText, Truck } from 'lucide-react'

export default function Home() {
  const features = [
    { icon: BarChart3, title: 'Dashboard', desc: 'Real-time analytics and workflow status', link: '/' },
    { icon: Users, title: 'Customers', desc: 'Manage customer information and credit', link: '/customers' },
    { icon: Package, title: 'Products', desc: 'Control inventory and product catalog', link: '/products' },
    { icon: ShoppingCart, title: 'Sales Orders', desc: 'Create and manage sales orders', link: '/sales-orders' },
    { icon: FileText, title: 'Purchase Orders', desc: 'Purchase and supplier management', link: '/purchase-orders' },
    { icon: Truck, title: 'Quotations', desc: 'Generate and track quotations', link: '/quotations' },
  ]

  const stats = [
    { label: 'Total Customers', value: '125', color: 'from-blue-500 to-cyan-500' },
    { label: 'Products', value: '450', color: 'from-green-500 to-emerald-500' },
    { label: 'Active Orders', value: '320', color: 'from-red-500 to-pink-500' },
    { label: 'Pending Tasks', value: '45', color: 'from-amber-500 to-orange-500' },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-dark to-darkalt text-white rounded-lg mb-12 p-12 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-5xl font-bold mb-4 text-primary">Welcome to ERP System</h1>
          <p className="text-lg text-gray-300 mb-8">Manage your entire business operations in one powerful platform</p>
          <div className="flex gap-4 flex-wrap">
            <Link to="/" className="flex items-center gap-2 bg-primary text-dark px-8 py-3 rounded-lg font-bold hover:bg-cyan-400 transition-colors transform hover:-translate-y-0.5">
              Go to Dashboard <ArrowRight size={18} />
            </Link>
            <a href="#features" className="flex items-center gap-2 border-2 border-primary text-primary px-8 py-3 rounded-lg font-bold hover:bg-primary hover:bg-opacity-10 transition-colors">
              Learn More
            </a>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="w-72 h-72 bg-gradient-to-br from-primary to-secondary rounded-3xl shadow-2xl animate-pulse"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mb-12">
        <h2 className="text-4xl font-bold text-center mb-10 text-dark">System Overview</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className={`bg-gradient-to-br ${stat.color} p-8 rounded-xl text-white shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all`}>
              <h4 className="text-sm font-semibold text-white opacity-90 mb-2">{stat.label}</h4>
              <p className="text-4xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="mb-12">
        <h2 className="text-4xl font-bold text-center mb-10 text-dark">Key Modules</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const IconComponent = feature.icon
            return (
              <Link 
                key={idx} 
                to={feature.link} 
                className="group bg-white p-8 rounded-xl border-2 border-gray-200 hover:border-primary shadow-md hover:shadow-xl transform hover:-translate-y-2 transition-all"
              >
                <div className="text-4xl mb-4 text-primary">
                  <IconComponent size={40} />
                </div>
                <h3 className="text-xl font-bold text-dark mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{feature.desc}</p>
                <div className="text-primary font-bold opacity-0 group-hover:opacity-100 transform group-hover:translate-x-2 transition-all">→</div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="mb-12">
        <h2 className="text-4xl font-bold text-center mb-10 text-dark">Quick Access</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md">
            <h4 className="text-xl font-bold text-dark mb-4 pb-3 border-b-2 border-primary">📝 Create New</h4>
            <ul className="space-y-2">
              <li><Link to="/customers" className="text-primary hover:text-secondary font-medium transition-colors">✓ Add Customer</Link></li>
              <li><Link to="/products" className="text-primary hover:text-secondary font-medium transition-colors">✓ Add Product</Link></li>
              <li><Link to="/quotations" className="text-primary hover:text-secondary font-medium transition-colors">✓ Create Quotation</Link></li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md">
            <h4 className="text-xl font-bold text-dark mb-4 pb-3 border-b-2 border-primary">📊 View Reports</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-primary hover:text-secondary font-medium transition-colors">✓ Sales Overview</Link></li>
              <li><Link to="/purchase-orders" className="text-primary hover:text-secondary font-medium transition-colors">✓ Purchases</Link></li>
              <li><Link to="/" className="text-primary hover:text-secondary font-medium transition-colors">✓ Inventory Status</Link></li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md">
            <h4 className="text-xl font-bold text-dark mb-4 pb-3 border-b-2 border-primary">⚙️ Settings</h4>
            <ul className="space-y-2">
              <li><a href="#settings" className="text-primary hover:text-secondary font-medium transition-colors">✓ Company Settings</a></li>
              <li><a href="#settings" className="text-primary hover:text-secondary font-medium transition-colors">✓ User Management</a></li>
              <li><a href="#settings" className="text-primary hover:text-secondary font-medium transition-colors">✓ Payment Methods</a></li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
