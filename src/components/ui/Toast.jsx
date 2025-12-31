import { useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

const toastTypes = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    iconColor: 'text-emerald-400',
    textColor: 'text-emerald-200',
  },
  error: {
    icon: AlertCircle,
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/30',
    iconColor: 'text-rose-400',
    textColor: 'text-rose-200',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    iconColor: 'text-amber-400',
    textColor: 'text-amber-200',
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    iconColor: 'text-blue-400',
    textColor: 'text-blue-200',
  },
}

export default function Toast({ message, type = 'info', isVisible, onClose, duration = 3000 }) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  if (!isVisible) return null

  const config = toastTypes[type] || toastTypes.info
  const Icon = config.icon

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-2 fade-in duration-300">
      <div
        className={`
          flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border backdrop-blur-sm
          ${config.bgColor} ${config.borderColor} min-w-[300px] max-w-[500px]
        `}
      >
        <Icon className={`w-5 h-5 flex-shrink-0 ${config.iconColor}`} />
        <p className={`flex-1 text-sm font-medium ${config.textColor}`}>{message}</p>
        <button
          onClick={onClose}
          className={`p-1 rounded hover:bg-black/10 transition-colors ${config.iconColor}`}
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

