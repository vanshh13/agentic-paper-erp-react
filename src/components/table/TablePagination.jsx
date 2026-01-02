import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

export default function TablePagination({
  currentPage = 1,
  totalPages = 1,
  pageSize = 10,
  totalRows = 0,
  onPageChange = () => {},
  onPageSizeChange = () => {},
}) {
  const startRow = (currentPage - 1) * pageSize + 1
  const endRow = Math.min(currentPage * pageSize, totalRows)

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border)] bg-[oklch(0.20_0_0)] text-sm text-[oklch(0.85_0_0)]">
      <div className="flex items-center gap-2">
        <span className="text-[oklch(0.70_0_0)]">
          Showing {totalRows === 0 ? 0 : startRow} to {endRow} of {totalRows} records
        </span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="ml-4 bg-[oklch(0.30_0_0)] border border-[var(--border)] rounded px-2 py-1 text-[oklch(0.90_0_0)] text-xs focus:outline-none"
        >
          <option value={10}>10 per page</option>
          <option value={25}>25 per page</option>
          <option value={50}>50 per page</option>
          <option value={100}>100 per page</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded hover:bg-[oklch(0.28_0_0)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[oklch(0.65_0_0)] hover:text-[oklch(0.90_0_0)]"
          title="First page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded hover:bg-[oklch(0.28_0_0)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[oklch(0.65_0_0)] hover:text-[oklch(0.90_0_0)]"
          title="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1 px-2">
          <span>Page</span>
          <input
            type="number"
            min="1"
            max={totalPages}
            value={currentPage}
            onChange={(e) => {
              const page = Math.max(1, Math.min(totalPages, Number(e.target.value)))
              onPageChange(page)
            }}
            className="w-12 bg-[oklch(0.30_0_0)] border border-[var(--border)] rounded px-2 py-1 text-center text-[oklch(0.90_0_0)] text-sm focus:outline-none focus:border-indigo-500"
          />
          <span>of {totalPages}</span>
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded hover:bg-[oklch(0.28_0_0)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[oklch(0.65_0_0)] hover:text-[oklch(0.90_0_0)]"
          title="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded hover:bg-[oklch(0.28_0_0)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[oklch(0.65_0_0)] hover:text-[oklch(0.90_0_0)]"
          title="Last page"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
