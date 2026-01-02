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
  heightClass = 'h-[calc(100vh-100px)]',
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
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sortKey, setSortKey] = useState(null)
  const [sortOrder, setSortOrder] = useState(null)
  const [columnFilters, setColumnFilters] = useState({})
  const tableContainerRef = useRef(null)

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
    const columnKeys = columns.map((c) => c.key)
    setVisibleColumns((prev) => {
      const next = prev.filter((key) => columnKeys.includes(key))
      columnKeys.forEach((key) => {
        if (!next.includes(key)) next.push(key)
      })
      return next
    })

    setColumnFilters((prev) => {
      const next = {}
      columnKeys.forEach((key) => {
        if (prev[key] !== undefined) {
          next[key] = prev[key]
        }
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

  const filterableColumns = useMemo(
    () => columns.filter((col) => col.filterable !== false),
    [columns]
  )

  const matchesFilter = (value, filterValue, column) => {
    if (filterValue === undefined || filterValue === null || filterValue === '') {
      return true
    }

    if (typeof column.filterPredicate === 'function') {
      return column.filterPredicate(value, filterValue, column)
    }

    const type = column.filterType || 'text'
    const valueStr = String(value ?? '').toLowerCase()
    const filterStr = String(filterValue ?? '').toLowerCase()

    if (type === 'select') {
      return valueStr === filterStr
    }

    if (type === 'number') {
      return Number(value) === Number(filterValue)
    }

    if (type === 'date') {
      return valueStr.startsWith(filterStr)
    }

    return valueStr.includes(filterStr)
  }

  const filteredByColumns = useMemo(() => {
    return rows.filter((row) =>
      filterableColumns.every((col) =>
        matchesFilter(row[col.key], columnFilters[col.key], col)
      )
    )
  }, [rows, filterableColumns, columnFilters])

  const filteredRows = useMemo(() => {
    if (!searchTerm) return filteredByColumns
    const term = searchTerm.toLowerCase()
    return filteredByColumns.filter((row) =>
      Object.values(row || {}).some((val) =>
        String(val ?? '').toLowerCase().includes(term)
      )
    )
  }, [filteredByColumns, searchTerm])

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

  const handleFilterChange = (key, value) => {
    setColumnFilters((prev) => ({ ...prev, [key]: value }))
    setCurrentPage(1)
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
  const emptyRowCount = Math.max(0, pageSize - paginatedRows.length)

  return (
    <div 
      ref={tableContainerRef}
      className={`card-surface rounded-xl border border-[var(--border)] overflow-x-hidden overflow-y-hidden flex flex-col w-full max-w-full ${heightClass}`}
    >
      {/* Header */}
      <div className="flex-shrink-0 px-3 py-2 border-b border-[var(--border)] space-y-1.5 bg-[oklch(0.20_0_0)]">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-[oklch(0.95_0_0)]">{title} ({filteredRows.length})</h3>
          {sortedRows.length > 0 && (
            <div className="w-full md:w-auto">
              <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalRows={sortedRows.length}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            </div>
          )}
        </div>

        {/* Search and Columns */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-[200px] sm:w-[240px]">
            <div className="flex items-center gap-2 bg-[oklch(0.30_0_0)] border border-[var(--border)] rounded-lg px-2 py-1 text-xs text-[oklch(0.85_0_0)]">
              <Search className="w-3.5 h-3.5 text-[oklch(0.65_0_0)]" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="bg-transparent focus:outline-none w-full text-xs placeholder:text-[oklch(0.65_0_0)]"
              />
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowColumnSelector((v) => !v)}
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[oklch(0.28_0_0)] text-[oklch(0.92_0_0)] hover:bg-[oklch(0.30_0_0)] border border-[var(--border)] transition-colors text-xs font-medium"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Columns
              <ChevronDown className="w-2.5 h-2.5" />
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
              {displayColumns.length > 0 && (
                <tr className="border-b border-[var(--border)] bg-[oklch(0.24_0_0)]">
                  {displayColumns.map((col) => {
                    const width = columnWidths[col.key] || getInitialWidth(col)
                    const minWidth = parseMinWidth(col.minWidth)
                    const filterType = col.filterType || 'text'
                    const value = columnFilters[col.key] ?? ''

                    return (
                      <th
                        key={`${col.key}-filter`}
                        className={`px-4 py-2 text-left text-xs font-medium text-[oklch(0.78_0_0)] whitespace-nowrap border-r border-[var(--border)] ${col.minWidth || ''}`}
                        style={{ width: `${width}px`, minWidth: minWidth ? `${minWidth}px` : undefined, maxWidth: `${width}px` }}
                      >
                        {col.filterable === false ? (
                          <span className="text-[oklch(0.60_0_0)]">—</span>
                        ) : filterType === 'select' && Array.isArray(col.filterOptions) ? (
                          <select
                            value={value}
                            onChange={(e) => handleFilterChange(col.key, e.target.value)}
                            className="w-full bg-[oklch(0.30_0_0)] border border-[var(--border)] rounded px-2 py-1 text-[oklch(0.90_0_0)] text-xs focus:outline-none"
                          >
                            <option value="">All</option>
                            {col.filterOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={filterType === 'number' ? 'number' : filterType === 'date' ? 'date' : 'text'}
                            value={value}
                            onChange={(e) => handleFilterChange(col.key, e.target.value)}
                            placeholder="Filter"
                            className="w-full bg-[oklch(0.30_0_0)] border border-[var(--border)] rounded px-2 py-1 text-[oklch(0.90_0_0)] text-xs focus:outline-none placeholder:text-[oklch(0.60_0_0)]"
                          />
                        )}
                      </th>
                    )
                  })}
                  {renderActions && (
                    <th className="px-4 py-2 text-left text-xs font-medium text-[oklch(0.78_0_0)] uppercase tracking-wider w-[120px] flex-shrink-0 sticky right-0 bg-[oklch(0.24_0_0)] border-l border-[var(--border)] whitespace-nowrap z-30">
                      
                    </th>
                  )}
                </tr>
              )}
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
                {emptyRowCount > 0 &&
                  Array.from({ length: emptyRowCount }).map((_, idx) => (
                    <tr
                      key={`empty-row-${idx}`}
                      className="border-b border-[var(--border)]"
                      style={{ height: '48px' }}
                    >
                      {displayColumns.map((col) => (
                        <td
                          key={`${col.key}-empty-${idx}`}
                          className={`px-4 py-3 text-sm text-[oklch(0.70_0_0)] border-r border-[var(--border)] ${col.minWidth || ''}`}
                          style={{ width: `${columnWidths[col.key] || getInitialWidth(col)}px` }}
                        >
                          {'\u00A0'}
                        </td>
                      ))}
                      {renderActions && (
                        <td className="px-4 py-3 text-sm w-[120px] flex-shrink-0 sticky right-0 bg-[oklch(0.20_0_0)] border-l border-[var(--border)] z-20">
                          {'\u00A0'}
                        </td>
                      )}
                    </tr>
                  ))}
              </tbody>
            </table>
        </div>
        {filteredRows.length > 0 && (
          <div className="h-1 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"></div>
        )}
      </div>
    </div>
  )
}
