// src/pages/Products/productColumns.jsx
import React from 'react';

const productColumns = (products = []) => {
  const categoryOptions = Array.from(
    new Set(products.map(p => p.category))
  ).map(cat => ({
    label: cat,
    value: cat,
  }));

  return [
    {
      key: 'name',
      label: 'Product Name',
      minWidth: 'min-w-[220px]',
      filterType: 'text',
      filterable: true,
    },
    {
      key: 'category',
      label: 'Category',
      minWidth: 'min-w-[160px]',
      filterType: 'select',
      filterable: true,
      filterOptions: categoryOptions,   
    },
    {
      key: 'brand',
      label: 'Brand',
      minWidth: 'min-w-[160px]',
      filterType: 'text',
      filterable: true,
    },
    {
      key: 'stock',
      label: 'Stock',
      minWidth: 'min-w-[140px]',
      filterType: 'number',
      filterable: true,
      render: (_, row) => `${row.stock} ${row.stockUnit}`,
    },
    {
      key: 'price',
      label: 'Price',
      minWidth: 'min-w-[140px]',
      filterType: 'number',
      filterable: true,
      render: (value) => `₹${value}`,
    },
    {
      key: 'status',
      label: 'Status',
      minWidth: 'min-w-[140px]',
      filterType: 'select',
      filterable: true,
      filterOptions: [
        { label: 'Active', value: 'active' },
        { label: 'Low Stock', value: 'low_stock' },
      ],
      render: (value) => (
        <span
          className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
            value === 'active'
              ? 'bg-indigo-500/20 text-indigo-400'
              : 'bg-orange-500/20 text-orange-400'
          }`}
        >
          {value.replace('_', ' ')}
        </span>
      ),
    },
  ];
};

export default productColumns;
