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
      className="flex items-center gap-1 px-2 py-1 rounded hover:bg-secondary transition-colors w-full text-left"
      title="Sort by this column"
    >
      <span className="truncate">{column.label}</span>
      {isSorted && sortOrder === 'asc' && (
        <ChevronUp className="w-3.5 h-3.5 text-primary flex-shrink-0" />
      )}
      {isSorted && sortOrder === 'desc' && (
        <ChevronDown className="w-3.5 h-3.5 text-primary flex-shrink-0" />
      )}
      {!isSorted && (
        <ChevronsUpDown className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
      )}
    </button>
  )
}
