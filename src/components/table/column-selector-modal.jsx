import { useEffect, useState } from 'react'

export default function ColumnSelectorModal({ open, columns, selectedKeys, onApply, onClose }) {
  const [localSelection, setLocalSelection] = useState(selectedKeys || [])

  useEffect(() => {
    if (open) {
      setLocalSelection(selectedKeys || [])
    }
  }, [open, selectedKeys])

  if (!open) return null

  const toggle = (key) => {
    setLocalSelection((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  const handleApply = () => {
    if (typeof onApply === 'function') {
      // Preserve original column ordering
      const ordered = columns
        .map((c) => c.key)
        .filter((key) => localSelection.includes(key))
      onApply(ordered)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-xl border border-[var(--border)] bg-[oklch(0.18_0_0)] shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
          <h3 className="text-sm font-semibold text-[oklch(0.95_0_0)]">Select Columns</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-[oklch(0.75_0_0)] hover:text-[oklch(0.90_0_0)] px-2 py-1 rounded hover:bg-[oklch(0.22_0_0)]"
          >
            Cancel
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {columns.map((col) => (
              <label
                key={col.key}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[oklch(0.22_0_0)] cursor-pointer text-sm text-[oklch(0.92_0_0)]"
              >
                <input
                  type="checkbox"
                  checked={localSelection.includes(col.key)}
                  onChange={() => toggle(col.key)}
                  className="w-4 h-4 rounded border-[var(--border)] bg-[oklch(0.26_0_0)] checked:bg-indigo-600 focus:ring-2 focus:ring-indigo-500"
                />
                <span className="truncate">{col.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-[var(--border)] bg-[oklch(0.20_0_0)]">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-[var(--border)] text-[oklch(0.85_0_0)] hover:bg-[oklch(0.24_0_0)] text-xs font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 text-xs font-semibold"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}
