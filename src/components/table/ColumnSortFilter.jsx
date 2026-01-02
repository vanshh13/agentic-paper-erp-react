import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react'

export default function ColumnSortFilter({ 
  column, 
  sortKey, 
  sortOrder, 
  onSort, 
  onFilter 
}) {
  const isSorted = sortKey === column.key

  const handleSortClick = () => {
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
  }

  return (
    <button
      type="button"
      onClick={handleSortClick}
      className="flex items-center gap-1 px-2 py-1 rounded hover:bg-[oklch(0.32_0_0)] transition-colors w-full text-left"
      title="Sort by this column"
    >
      <span className="truncate">{column.label}</span>
      {isSorted && sortOrder === 'asc' && (
        <ChevronUp className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
      )}
      {isSorted && sortOrder === 'desc' && (
        <ChevronDown className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
      )}
      {!isSorted && (
        <ChevronsUpDown className="w-3.5 h-3.5 text-[oklch(0.60_0_0)] flex-shrink-0" />
      )}
    </button>
  )
}
