import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react'

export default function ColumnSortFilter({ 
  column, 
  sortKey, 
  sortOrder, 
  onSort, 
  onFilter 
}) {
  const isSorted = sortKey === column.key

  return (
    <div className="flex items-center gap-1">
      <span>{column.label}</span>
      <button
        onClick={() => {
          if (isSorted) {
            // Cycle: asc -> desc -> none
            if (sortOrder === 'asc') {
              onSort(column.key, 'desc')
            } else if (sortOrder === 'desc') {
              onSort(null, null)
            }
          } else {
            onSort(column.key, 'asc')
          }
        }}
        className="p-0.5 rounded hover:bg-[oklch(0.32_0_0)] transition-colors flex-shrink-0"
        title="Sort by this column"
      >
        {isSorted && sortOrder === 'asc' && (
          <ChevronUp className="w-3.5 h-3.5 text-indigo-400" />
        )}
        {isSorted && sortOrder === 'desc' && (
          <ChevronDown className="w-3.5 h-3.5 text-indigo-400" />
        )}
        {!isSorted && (
          <ChevronsUpDown className="w-3.5 h-3.5 text-[oklch(0.60_0_0)]" />
        )}
      </button>
    </div>
  )
}
