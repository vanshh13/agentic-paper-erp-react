export default function ProductSelector({ selectedProduct, onProductChange, products }) {
  return (
    <select
      value={selectedProduct}
      onChange={(e) => onProductChange(e.target.value)}
      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[oklch(0.22_0_0)] text-[oklch(0.92_0_0)] border border-[oklch(0.30_0_0)] hover:bg-[oklch(0.24_0_0)] focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-colors"
    >
      {products.map((product) => (
        <option key={product.value} value={product.value}>
          {product.label}
        </option>
      ))}
    </select>
  )
}

