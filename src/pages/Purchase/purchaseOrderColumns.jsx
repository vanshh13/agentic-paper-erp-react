import React from 'react'
import { typeConfig, statusConfig } from './purchaseOrderConfigs'

export const purchaseOrderColumns = [
  {
    key: 'poNumber',
    label: 'PO Number',
    minWidth: 'min-w-[180px]',
    filterType: 'text',
    filterable: true,
  },
  {
    key: 'type',
    label: 'Type',
    minWidth: 'min-w-[160px]',
    filterType: 'select',
    filterable: true,
    filterOptions: [
      { label: 'JK Company', value: 'jk_company' },
      { label: 'Others', value: 'others' },
      { label: 'Imports', value: 'imports' },
    ],
    render: (value) => {
      const cfg = typeConfig[value] || typeConfig.others
      return (
        <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${cfg.color}`}>
          {cfg.label}
        </span>
      )
    },
  },
  {
    key: 'status',
    label: 'Status',
    minWidth: 'min-w-[160px]',
    filterType: 'select',
    filterable: true,
    filterOptions: Object.entries(statusConfig).map(([value, cfg]) => ({
      value,
      label: cfg.label,
    })),
    render: (value) => {
      const cfg = statusConfig[value] || statusConfig.pending
      return (
        <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${cfg.color}`}>
          {cfg.label}
        </span>
      )
    },
  },
  {
    key: 'vendor',
    label: 'Vendor',
    minWidth: 'min-w-[240px]',
    filterType: 'text',
    filterable: true,
  },
  {
    key: 'delivery',
    label: 'Delivery',
    minWidth: 'min-w-[160px]',
    filterType: 'text',
    filterable: true,
  },
  {
    key: 'items',
    label: 'Items',
    minWidth: 'min-w-[120px]',
    filterType: 'number',
    filterable: true,
  },
  {
    key: 'amount',
    label: 'Amount',
    minWidth: 'min-w-[160px]',
    filterType: 'number',
    filterable: true,
    render: (value) =>
      value > 0 ? `₹${value.toLocaleString('en-IN')}` : '-',
  },
  {
    key: 'deliveryDate',
    label: 'Delivery Date',
    minWidth: 'min-w-[170px]',
    filterType: 'date',
    filterable: true,
    render: (value) =>
      value && value !== '-'
        ? new Date(value).toLocaleDateString('en-IN')
        : '-',
  },
]

export default purchaseOrderColumns
