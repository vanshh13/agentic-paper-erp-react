import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectThemeMode, selectCurrentTheme } from '../../store/slices/theme-slice'

export default function ColumnSelectorModal({ open, columns, selectedKeys, onApply, onClose }) {
  const isDarkMode = useSelector(selectThemeMode)
  const theme = useSelector(selectCurrentTheme)
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
      <div className="w-full max-w-md rounded-xl card-surface shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Select Columns</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground px-2 py-1 rounded hover:bg-secondary"
          >
            Cancel
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {columns.map((col) => (
              <label
                key={col.key}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary cursor-pointer text-sm text-foreground"
              >
                <input
                  type="checkbox"
                  checked={localSelection.includes(col.key)}
                  onChange={() => toggle(col.key)}
                  className="w-4 h-4 rounded border-border bg-input checked:bg-primary focus:ring-2 focus:ring-primary"
                />
                <span className="truncate">{col.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-border bg-card">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-border text-foreground hover:bg-accent text-xs font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 text-xs font-semibold"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}
