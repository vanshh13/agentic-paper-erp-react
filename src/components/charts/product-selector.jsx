export default function ProductSelector({ selectedProduct, onProductChange, products }) {
  return (
    <select
      value={selectedProduct}
      onChange={(e) => onProductChange(e.target.value)}
      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-card text-foreground border border-border hover:bg-accent focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-colors"
    >
      {products.map((product) => (
        <option key={product.value} value={product.value}>
          {product.label}
        </option>
      ))}
    </select>
  )
}

