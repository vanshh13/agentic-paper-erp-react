import { X, AlertTriangle } from 'lucide-react'

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning', // 'warning', 'danger', 'info'
}) {
  if (!isOpen) return null

  const typeStyles = {
    warning: {
      iconColor: 'text-amber-400',
      buttonBg: 'bg-amber-500 hover:bg-amber-600',
    },
    danger: {
      iconColor: 'text-rose-400',
      buttonBg: 'bg-rose-500 hover:bg-rose-600',
    },
    info: {
      iconColor: 'text-blue-400',
      buttonBg: 'bg-blue-500 hover:bg-blue-600',
    },
  }

  const styles = typeStyles[type] || typeStyles.warning

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm()
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 md:p-4 z-[60]">
      <div className="bg-[oklch(0.20_0_0)] text-[oklch(0.95_0_0)] rounded-xl shadow-card max-w-md w-full border border-[var(--border)]">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-[var(--border)] flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className={`p-2 rounded-lg ${styles.iconColor.replace('text-', 'bg-')}/10 flex-shrink-0`}>
              <AlertTriangle className={`w-5 h-5 ${styles.iconColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg md:text-xl font-bold">{title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[oklch(0.75_0_0)] hover:text-[oklch(0.96_0_0)] p-1 rounded-lg hover:bg-[oklch(0.24_0_0)] transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6">
          <p className="text-[oklch(0.85_0_0)] text-sm md:text-base">{message}</p>
        </div>

        {/* Footer */}
        <div className="p-4 md:p-6 border-t border-[var(--border)] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[var(--border)] rounded-lg text-[oklch(0.90_0_0)] hover:bg-[oklch(0.24_0_0)] transition-colors text-sm font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 ${styles.buttonBg} text-white rounded-lg font-semibold shadow-glow hover:opacity-90 transition-colors text-sm`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

