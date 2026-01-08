import { useEffect, useMemo, useState, useRef } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import TablePagination from './TablePagination'
import ColumnSortFilter from './ColumnSortFilter'
import ColumnSelectorModal from './ColumnSelectorModal'

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
  const [visibleColumns, setVisibleColumns] = useState(columns.map((c) => c.key))
  const [columnWidths, setColumnWidths] = useState(() => {
    const initial = {}
    columns.forEach((col) => {
      initial[col.key] = getInitialWidth(col)
    })
    if (renderActions) {
      initial.__actions__ = getInitialWidth({ minWidth: 'min-w-[110px]', width: 110 })
    }
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
      if (renderActions && !next.__actions__) {
        next.__actions__ = getInitialWidth({ minWidth: 'min-w-[180px]', width: 180 })
      }

      const activeKeys = columns.map((c) => c.key)
      Object.keys(next).forEach((key) => {
        if (key !== '__actions__' && !activeKeys.includes(key)) delete next[key]
      })
      return next
    })
  }, [columns, renderActions])

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

  // When search changes, jump to first page to show results immediately
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

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
      const normalize = (val) => String(val ?? '').replace(/\D/g, '')
      const valueDigits = normalize(value)
      const filterDigits = normalize(filterValue)
      if (!filterDigits) return true
      return valueDigits.includes(filterDigits)
    }

    if (type === 'date') {
      const normalize = (val) => String(val ?? '').replace(/\D/g, '')
      const valueDigits = normalize(value)
      const filterDigits = normalize(filterValue)
      if (!filterDigits) return true
      return valueDigits.startsWith(filterDigits)
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

  // If filtered results shrink below a single page, snap back to page 1
  useEffect(() => {
    if (currentPage > 1 && sortedRows.length <= pageSize) {
      setCurrentPage(1)
    }
  }, [sortedRows.length, pageSize, currentPage])

  const totalPages = Math.ceil(sortedRows.length / pageSize)

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
  const actionWidth = columnWidths.__actions__ || getInitialWidth({ minWidth: 'min-w-[120px]', width: 120 })
  const emptyRowCount = Math.max(0, pageSize - paginatedRows.length)

  // Calculate total table width for infinite horizontal growth
  const totalTableWidth = useMemo(() => {
    let total = 0
    displayColumns.forEach((col) => {
      total += columnWidths[col.key] || getInitialWidth(col)
    })
    if (renderActions) {
      total += actionWidth
    }
    return total
  }, [displayColumns, columnWidths, renderActions, actionWidth])

  return (
    <div 
      ref={tableContainerRef}
      className={`card-surface rounded-lg sm:rounded-xl border border-border overflow-x-hidden overflow-y-hidden flex flex-col w-full max-w-full ${heightClass}`}
    >
      {/* Header */}
      <div className="flex-shrink-0 px-3 sm:px-4 py-2 sm:py-3 border-b border-border table-header-surface">
        {/* Search, Columns, and Pagination - Responsive */}
        <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 lg:justify-between">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="w-full sm:w-[200px] md:w-[280px] lg:w-[320px]">
              <div className="input-surface flex items-center gap-2 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-foreground">
                <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="bg-transparent focus:outline-none w-full text-xs sm:text-sm placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div>
              <button
                onClick={() => setShowColumnSelector(true)}
                className="flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-secondary text-foreground hover:bg-accent border border-border transition-colors text-xs sm:text-sm font-medium flex-shrink-0"
              >
                <SlidersHorizontal className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                <span className="hidden sm:inline">Columns</span>
              </button>
            </div>
          </div>

          {sortedRows.length > 0 && (
            <div className="w-full lg:w-auto mt-2 lg:mt-0">
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
      </div>

      {/* Scrollable Table Area */}
      <div className="flex-1 min-h-0 w-full overflow-hidden flex flex-col bg-background isolate">
        <div className="flex-1 min-h-0 w-full overflow-x-auto overflow-y-auto overscroll-x-contain custom-scrollbar scroll-smooth relative">
          {renderActions && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-0 bottom-0 w-[2px] bg-border z-[80]"
              style={{ right: actionWidth }}
            />
          )}
          <table className="border-separate border-spacing-0 w-full" style={{ tableLayout: 'fixed', minWidth: totalTableWidth }}>
            {/* COLGROUP - Controls column widths */}
            <colgroup>
              {displayColumns.map((col) => (
                <col key={col.key} style={{ width: columnWidths[col.key] || getInitialWidth(col) }} />
              ))}
              {renderActions && (
                <col style={{ width: actionWidth }} />
              )}
            </colgroup>

            <thead className="sticky top-0 table-header-surface z-50">
              <tr className="border-b-2 border-border">
                {displayColumns.map((col) => {
                  const width = columnWidths[col.key] || getInitialWidth(col)
                  const minWidth = parseMinWidth(col.minWidth)
                  return (
                    <th
                      key={col.key}
                      className={`px-2 sm:px-3 py-1 sm:py-1.5 text-left text-xs sm:text-base font-semibold uppercase tracking-wider whitespace-nowrap relative border-r border-border ${col.minWidth || ''}`}
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
                        className="absolute right-0 top-0 h-full w-1 cursor-col-resize select-none bg-border hover:bg-primary transition-colors z-10"
                        onMouseDown={(event) => {
                          event.stopPropagation()
                          handleResizeStart(event, col)
                        }}
                        role="presentation"
                      ></span>
                    </th>
                  )
                })}
                {renderActions && (
                  <th
                    className="px-2 sm:px-3 py-1 sm:py-1.5 text-left text-xs sm:text-sm font-semibold uppercase tracking-wider w-[100px] sm:w-[180px] flex-shrink-0 sticky right-0 table-header-surface whitespace-nowrap z-[100] border-l-2 border-border"
                  >
                    <div className="relative flex items-center justify-center">
                      Actions
                      <span
                        className="absolute right-0 top-0 h-full w-0 cursor-col-resize select-none bg-border hover:bg-primary transition-colors z-10"
                        onMouseDown={(event) => {
                          event.stopPropagation()
                          handleResizeStart(event, { key: '__actions__', minWidth: 'min-w-[180px]' })
                        }}
                        role="presentation"
                      ></span>
                    </div>
                  </th>
                )}
              </tr>
              {displayColumns.length > 0 && (
                <tr className="bg-card border-b-2 border-border">
                  {displayColumns.map((col) => {
                    const width = columnWidths[col.key] || getInitialWidth(col)
                    const minWidth = parseMinWidth(col.minWidth)
                    const filterType = col.filterType || 'text'
                    const value = columnFilters[col.key] ?? ''

                    return (
                      <th
                        key={`${col.key}-filter`}
                        className={`px-2 sm:px-3 py-1 sm:py-1.5 text-left text-xs sm:text-sm font-medium text-muted-foreground whitespace-nowrap relative border-r border-border ${col.minWidth || ''}`}
                      >
                        {col.filterable === false ? (
                          <span className="block h-[18px]"></span>
                        ) : filterType === 'select' && Array.isArray(col.filterOptions) ? (
                          <select
                            value={value}
                            onChange={(e) => handleFilterChange(col.key, e.target.value)}
                            className="w-full bg-input border border-border rounded px-2 py-1 text-foreground text-xs sm:text-sm focus:outline-none"
                          >
                            <option value="">All</option>
                            {col.filterOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        ) : filterType === 'date' ? (
                          <div className="relative">
                            <input
                              type="text"
                              inputMode="numeric"
                              maxLength="10"
                              value={value}
                              onChange={(e) => {
                                let val = e.target.value.replace(/[^\d]/g, '')
                                if (val.length >= 2) val = val.slice(0, 2) + '/' + val.slice(2)
                                if (val.length >= 5) val = val.slice(0, 5) + '/' + val.slice(5, 9)
                                handleFilterChange(col.key, val)
                              }}
                              placeholder="DD/MM/YYYY"
                              className="w-full bg-input border border-border rounded px-2 py-1 pr-8 text-foreground text-sm focus:outline-none placeholder:text-muted-foreground"
                            />
                            <input
                              type="date"
                              onChange={(e) => {
                                if (e.target.value) {
                                  const [y, m, d] = e.target.value.split('-')
                                  handleFilterChange(col.key, `${d}/${m}/${y}`)
                                } else {
                                  handleFilterChange(col.key, '')
                                }
                              }}
                              className="absolute right-2 top-0 w-10 h-full opacity-0 cursor-pointer"
                            />
                            <svg
                              className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        ) : (
                          <input
                            type={filterType === 'number' ? 'number' : 'text'}
                            value={value}
                            onChange={(e) => handleFilterChange(col.key, e.target.value)}
                            placeholder="Filter"
                            className="w-full bg-input border border-border rounded px-2 py-1 text-foreground text-sm focus:outline-none placeholder:text-muted-foreground"
                          />
                        )}
                        <span
                          className="absolute right-0 top-0 h-full w-3 cursor-col-resize select-none bg-transparent"
                          onMouseDown={(event) => {
                            event.stopPropagation()
                            handleResizeStart(event, col)
                          }}
                          role="presentation"
                        ></span>
                      </th>
                    )
                  })}
                  {renderActions && (
                    <th
                      className="px-3 py-1.5 text-left text-sm font-medium text-muted-foreground uppercase tracking-wider w-[120px] flex-shrink-0 sticky right-0 bg-card border-l-2 border-border whitespace-nowrap z-40"
                    >
                      <span
                        className="absolute right-0 top-0 h-full w-3 cursor-col-resize select-none bg-transparent"
                        onMouseDown={(event) => {
                          event.stopPropagation()
                          handleResizeStart(event, { key: '__actions__', minWidth: 'min-w-[120px]' })
                        }}
                        role="presentation"
                      ></span>
                    </th>
                  )}
                </tr>
              )}
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={displayColumns.length + (renderActions ? 1 : 0)} className="px-6 py-10 text-center text-muted-foreground text-sm">
                    Loading data...
                  </td>
                </tr>
              ) : sortedRows.length === 0 ? (
                <tr>
                  <td colSpan={displayColumns.length + (renderActions ? 1 : 0)} className="px-6 py-10 text-center text-muted-foreground text-sm">
                    No data found
                  </td>
                </tr>
              ) : (
                paginatedRows.map((row, idx) => {
                  const stripeClass = idx % 2 === 0 ? 'bg-card' : 'bg-secondary'
                  return (
                    <tr
                      key={row.id || row.user_id || idx}
                      className={`border-b border-border ${stripeClass} hover:bg-accent transition-colors row-animate`}
                    >
                    {displayColumns.map((col) => {
                      const value = row[col.key]
                      const content = col.render ? col.render(value, row) : value || '--'
                      const width = columnWidths[col.key] || getInitialWidth(col)
                      const minWidth = parseMinWidth(col.minWidth)
                      return (
                        <td
                          key={col.key}
                          className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-base text-foreground dark:text-foreground truncate border-r border-border ${col.minWidth || ''}`}
                        >
                          {content}
                        </td>
                      )
                    })}
                    {renderActions && (
                      <td
                        className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm w-[100px] sm:w-[180px] flex-shrink-0 sticky right-0 ${stripeClass} text-foreground z-[60] border-l-2 border-border`}
                      >
                        <div className="relative h-full w-full flex items-center justify-center">
                          {renderActions(row)}
                          <span
                            className="absolute right-0 top-0 h-full w-3 cursor-col-resize select-none bg-transparent"
                            onMouseDown={(event) => {
                              event.stopPropagation()
                              handleResizeStart(event, { key: '__actions__', minWidth: 'min-w-[180px]' })
                            }}
                            role="presentation"
                          ></span>
                        </div>
                      </td>
                    )}
                  </tr>
                  )
                })
              )}
              {emptyRowCount > 0 &&
                Array.from({ length: emptyRowCount }).map((_, idx) => (
                  <tr
                    key={`empty-row-${idx}`}
                    className={`border-b border-border ${(paginatedRows.length + idx) % 2 === 0 ? 'bg-card' : 'bg-secondary'} row-animate-soft`}
                    style={{ height: '38px' }}
                  >
                    {displayColumns.map((col) => (
                      <td
                        key={`${col.key}-empty-${idx}`}
                        className={`px-3 py-1.5 text-base text-muted-foreground border-r border-border ${col.minWidth || ''}`}
                      >
                        {' '}
                      </td>
                    ))}
                    {renderActions && (
                      <td
                        className={`px-3 py-1.5 text-sm w-[120px] flex-shrink-0 sticky right-0 ${(paginatedRows.length + idx) % 2 === 0 ? 'bg-card' : 'bg-secondary'} text-foreground z-[60] border-l-2 border-border`}
                      >
                        <div className="relative h-full w-full flex items-center justify-center">
                          {'\u00A0'}
                          <span
                            className="absolute right-0 top-0 h-full w-3 cursor-col-resize select-none bg-transparent "
                            onMouseDown={(event) => {
                              event.stopPropagation()
                              handleResizeStart(event, { key: '__actions__', minWidth: 'min-w-[120px]' })
                            }}
                            role="presentation"
                          ></span>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <ColumnSelectorModal
        open={showColumnSelector}
        columns={columns}
        selectedKeys={visibleColumns}
        onApply={(next) => {
          setVisibleColumns(next)
          setShowColumnSelector(false)
        }}
        onClose={() => setShowColumnSelector(false)}
      />
    </div>
  )
}
