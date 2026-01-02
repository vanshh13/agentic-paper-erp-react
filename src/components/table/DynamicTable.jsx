import { useEffect, useMemo, useState, useRef } from 'react'
import { Search, SlidersHorizontal, ChevronDown, X } from 'lucide-react'
import TablePagination from './TablePagination'
import ColumnSortFilter from './ColumnSortFilter'

const parseMinWidth = (minWidth) => {
  if (!minWidth) return null
  const match = minWidth.match(/min-w-\[(\d+)px\]/)
  return match ? Number(match[1]) : null
}

const getInitialWidth = (col) => {
  const parsedMin = parseMinWidth(col.minWidth)
  return col.width || parsedMin || 160
}

// columns: [{key,label,minWidth?,render?}]
export default function DynamicTable({
  title = 'Table',
  columns = [],
  rows = [],
  loading = false,
  defaultVisibleCount = 6,
  heightClass = 'h-[60vh] sm:h-[65vh] md:h-[calc(100vh-320px)] lg:h-[calc(100vh-300px)]',
  renderActions,
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [showColumnSelector, setShowColumnSelector] = useState(false)
  const [visibleColumns, setVisibleColumns] = useState(
    columns.map((c) => c.key)
  )
  const [columnWidths, setColumnWidths] = useState(() => {
    const initial = {}
    columns.forEach((col) => {
      initial[col.key] = getInitialWidth(col)
    })
    return initial
  })
  const [resizing, setResizing] = useState(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sortKey, setSortKey] = useState(null)
  const [sortOrder, setSortOrder] = useState(null)
  const tableContainerRef = useRef(null)

  useEffect(() => {
    const updateWidth = () => {
      if (tableContainerRef.current) {
        setContainerWidth(tableContainerRef.current.clientWidth)
      }
    }
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  useEffect(() => {
    setColumnWidths((prev) => {
      const next = { ...prev }
      columns.forEach((col) => {
        if (!next[col.key]) {
          next[col.key] = getInitialWidth(col)
        }
      })

      const activeKeys = columns.map((c) => c.key)
      Object.keys(next).forEach((key) => {
        if (!activeKeys.includes(key)) delete next[key]
      })
      return next
    })
  }, [columns])

  useEffect(() => {
    if (!resizing) return

    const handleMouseMove = (event) => {
      const delta = event.clientX - resizing.startX
      const minWidth = resizing.minWidth || 80
      const newResizingWidth = Math.max(minWidth, resizing.startWidth + delta)

      setColumnWidths((prev) => {
        return { ...prev, [resizing.key]: newResizingWidth }
      })
    }

    const stopResize = () => setResizing(null)

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', stopResize)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', stopResize)
    }
  }, [resizing])

  const filteredRows = useMemo(() => {
    if (!searchTerm) return rows
    const term = searchTerm.toLowerCase()
    return rows.filter((row) =>
      Object.values(row || {}).some((val) =>
        String(val ?? '').toLowerCase().includes(term)
      )
    )
  }, [rows, searchTerm])

  const sortedRows = useMemo(() => {
    if (!sortKey) return filteredRows
    
    const sorted = [...filteredRows].sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]
      
      if (aVal == null && bVal == null) return 0
      if (aVal == null) return 1
      if (bVal == null) return -1
      
      // Handle numeric comparison
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal
      }
      
      // Handle string comparison
      const aStr = String(aVal).toLowerCase()
      const bStr = String(bVal).toLowerCase()
      if (sortOrder === 'asc') {
        return aStr.localeCompare(bStr)
      } else {
        return bStr.localeCompare(aStr)
      }
    })
    
    return sorted
  }, [filteredRows, sortKey, sortOrder])

  const paginatedRows = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize
    const endIdx = startIdx + pageSize
    return sortedRows.slice(startIdx, endIdx)
  }, [sortedRows, currentPage, pageSize])

  const totalPages = Math.ceil(sortedRows.length / pageSize)

  const toggleColumn = (key) => {
    setVisibleColumns((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  const handleSort = (key, order) => {
    setSortKey(key)
    setSortOrder(order)
    setCurrentPage(1) // Reset to first page on sort
  }

  const handlePageChange = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const handlePageSizeChange = (size) => {
    setPageSize(size)
    setCurrentPage(1) // Reset to first page on size change
  }

  const handleResizeStart = (event, col) => {
    event.preventDefault()
    const currentWidth = columnWidths[col.key] || getInitialWidth(col)
    const minWidth = parseMinWidth(col.minWidth)
    setResizing({
      key: col.key,
      startX: event.clientX,
      startWidth: currentWidth,
      minWidth,
    })
  }

  const displayColumns = columns.filter((c) => visibleColumns.includes(c.key))

  return (
    <div 
      ref={tableContainerRef}
      className={`card-surface rounded-xl border border-[var(--border)] overflow-x-hidden overflow-y-hidden flex flex-col w-full max-w-full ${heightClass}`}
    >
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-[var(--border)] space-y-3 bg-[oklch(0.20_0_0)]">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base font-semibold text-[oklch(0.95_0_0)]">{title} ({sortedRows.length})</h3>

          <div className="relative">
            <button
              onClick={() => setShowColumnSelector((v) => !v)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[oklch(0.28_0_0)] text-[oklch(0.92_0_0)] hover:bg-[oklch(0.30_0_0)] border border-[var(--border)] transition-colors text-sm font-medium"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Columns
              <ChevronDown className="w-3 h-3" />
            </button>

            {showColumnSelector && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-[oklch(0.22_0_0)] border border-[var(--border)] rounded-lg shadow-xl z-40 p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-[oklch(0.95_0_0)]">Select Columns</p>
                  <button
                    onClick={() => setShowColumnSelector(false)}
                    className="p-1 hover:bg-[oklch(0.28_0_0)] rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-[oklch(0.75_0_0)]" />
                  </button>
                </div>
                <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
                  {columns.map((col) => (
                    <label
                      key={col.key}
                      className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[oklch(0.26_0_0)] cursor-pointer text-sm text-[oklch(0.90_0_0)]"
                    >
                      <input
                        type="checkbox"
                        checked={visibleColumns.includes(col.key)}
                        onChange={() => toggleColumn(col.key)}
                        className="w-4 h-4 rounded border-[var(--border)] bg-[oklch(0.28_0_0)] checked:bg-indigo-600 focus:ring-2 focus:ring-indigo-500"
                      />
                      {col.label}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex-1 min-w-[200px]">
            <div className="flex items-center gap-2 bg-[oklch(0.30_0_0)] border border-[var(--border)] rounded-lg px-3 py-1.5 text-sm text-[oklch(0.85_0_0)]">
              <Search className="w-4 h-4 text-[oklch(0.65_0_0)]" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="bg-transparent focus:outline-none w-full placeholder:text-[oklch(0.65_0_0)]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Table Area */}
      <div className="flex-1 min-h-0 w-full overflow-hidden flex flex-col bg-[oklch(0.20_0_0)] isolate">
        <div className="flex-1 min-h-0 w-full overflow-x-auto overflow-y-auto overscroll-x-contain custom-scrollbar scroll-smooth relative">
          <table className="min-w-max border-collapse">
            <thead className="sticky top-0 bg-[oklch(0.26_0_0)] z-10">
              <tr className="border-b border-[var(--border)]">
                {displayColumns.map((col) => {
                  const width = columnWidths[col.key] || getInitialWidth(col)
                  const minWidth = parseMinWidth(col.minWidth)
                  return (
                    <th
                      key={col.key}
                      className={`px-4 py-3 text-left text-xs font-semibold text-[oklch(0.75_0_0)] uppercase tracking-wider whitespace-nowrap relative border-r border-[var(--border)] ${col.minWidth || ''}`}
                      style={{ width: `${width}px`, minWidth: minWidth ? `${minWidth}px` : undefined, maxWidth: `${width}px` }}
                    >
                        <div className="flex items-center justify-between gap-1 pr-2">
                          <ColumnSortFilter
                            column={col}
                            sortKey={sortKey}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                          />
                        </div>
                        <span
                          className="absolute right-[-2px] top-0 h-full w-2 cursor-col-resize select-none bg-[oklch(0.35_0_0)]/40 hover:bg-indigo-500/50 transition-colors"
                          onMouseDown={(event) => handleResizeStart(event, col)}
                          role="presentation"
                        ></span>
                      </th>
                    )
                  })}
                  {renderActions && (
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[oklch(0.75_0_0)] uppercase tracking-wider w-[120px] flex-shrink-0 sticky right-0 bg-[oklch(0.26_0_0)] border-l border-[var(--border)] whitespace-nowrap z-30">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={displayColumns.length + (renderActions ? 1 : 0)} className="px-6 py-10 text-center text-[oklch(0.70_0_0)] text-sm">
                      Loading data...
                    </td>
                  </tr>
                ) : sortedRows.length === 0 ? (
                  <tr>
                    <td colSpan={displayColumns.length + (renderActions ? 1 : 0)} className="px-6 py-10 text-center text-[oklch(0.65_0_0)] text-sm">
                      No data found
                    </td>
                  </tr>
                ) : (
                  paginatedRows.map((row, idx) => (
                    <tr
                      key={row.id || row.user_id || idx}
                      className="border-b border-[var(--border)] hover:bg-[oklch(0.24_0_0)] transition-colors"
                    >
                      {displayColumns.map((col) => {
                        const value = row[col.key]
                        const content = col.render ? col.render(value, row) : value || '--'
                        const width = columnWidths[col.key] || getInitialWidth(col)
                        const minWidth = parseMinWidth(col.minWidth)
                        return (
                          <td
                            key={col.key}
                            className={`px-4 py-3 text-sm text-[oklch(0.90_0_0)] truncate border-r border-[var(--border)] ${col.minWidth || ''}`}
                            style={{ width: `${width}px`, minWidth: minWidth ? `${minWidth}px` : undefined, maxWidth: `${width}px` }}
                          >
                            {content}
                          </td>
                        )
                      })}
                      {renderActions && (
                        <td className="px-4 py-3 text-sm w-[120px] flex-shrink-0 sticky right-0 bg-[oklch(0.20_0_0)] border-l border-[var(--border)] z-20">
                          {renderActions(row)}
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
        </div>
        {filteredRows.length > 0 && (
          <div className="h-1 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"></div>
        )}
      </div>

      {/* Pagination */}
      {sortedRows.length > 0 && (
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalRows={sortedRows.length}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  )
}
