import { toast, ToastContainer, Slide } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import NotificationCloseIcon from '../../assets/icons/notifiction-close-icon'
import SuccessIcon from '../../assets/icons/success-icon'
import ErrorIcon from '../../assets/icons/error-icon'
import InfoIcon from '../../assets/icons/info-icon'
import WarningIcon from '../../assets/icons/waring-icon'

// Notification types
export const NOTIFICATION_TYPE_SUCCESS = 'success'
export const NOTIFICATION_TYPE_ERROR = 'error'
export const NOTIFICATION_TYPE_INFO = 'info'
export const NOTIFICATION_TYPE_WARN = 'warn'

// Fixed display time in milliseconds
const FIXED_NOTIFICATION_DISPLAY_TIME = 5000

/**
 * Fire-and-forget notification trigger
 */
export function Notification({ type, message, isDarkMode = true }) {
  const iconColor = '#fff'

  const toastOptions = {
    position: 'top-center',
    autoClose: FIXED_NOTIFICATION_DISPLAY_TIME,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    theme: isDarkMode ? 'dark' : 'light',
    className: 'custom-toast-notification',

    // Custom close button
    closeButton: ({ closeToast }) => (
      <button onClick={closeToast} className="Toastify__close-button">
        <NotificationCloseIcon fill={iconColor} />
      </button>
    ),
  }

  switch (type) {
    case NOTIFICATION_TYPE_SUCCESS:
      toast.success(message, {
        ...toastOptions,
        icon: (
          <div className="status-icon success-icon">
            <SuccessIcon fill={iconColor} />
          </div>
        ),
      })
      break

    case NOTIFICATION_TYPE_ERROR:
      toast.error(message, {
        ...toastOptions,
        icon: (
          <div className="status-icon error-icon">
            <ErrorIcon fill={iconColor} />
          </div>
        ),
      })
      break

    case NOTIFICATION_TYPE_INFO:
      toast.info(message, {
        ...toastOptions,
        icon: (
          <div className="status-icon info-icon">
            <InfoIcon fill={iconColor} />
          </div>
        ),
      })
      break

    case NOTIFICATION_TYPE_WARN:
      toast.warn(message, {
        ...toastOptions,
        icon: (
          <div className="status-icon warning-icon">
            <WarningIcon fill={iconColor} />
          </div>
        ),
      })
      break

    default:
      break
  }

  return null
}

/**
 * Global notification container
 * Mount ONCE (App root)
 */
function NotificationWrapper({ isDarkMode = true }) {
  return (
    <>
      <ToastContainer
        role="alert"
        transition={Slide}
        theme={isDarkMode ? 'dark' : 'light'}
        autoClose={FIXED_NOTIFICATION_DISPLAY_TIME}
        hideProgressBar={false}
        closeButton={false}
      />

      {/* Scoped styles */}
      <style>{`
        .custom-toast-notification {
          display: flex !important;
          align-items: center !important;
        }

        .Toastify__toast-icon {
          display: flex !important;
          margin-right: 12px !important;
        }

        .status-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
        }

        .Toastify__progress-bar {
          height: 4px !important;
          opacity: 0.7 !important;
        }

        .Toastify__close-button {
          position: absolute;
          right: 8px;
          top: 8px;
          background: transparent;
          border: none;
          color: white;
          cursor: pointer;
        }
      `}</style>
    </>
  )
}

export default NotificationWrapper
