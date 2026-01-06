import axios from 'axios'
import {
  Notification,
  NOTIFICATION_TYPE_ERROR,
  NOTIFICATION_TYPE_INFO,
  NOTIFICATION_TYPE_SUCCESS,
} from '../components/notifiction/notifiction'

// Status codes
const StatusCode = {
  NoContent: 204,
  ResourceUnauthorized: 401,
  ClientForbidden: 403,
  ResourceNotFound: 404,
  Conflict: 409,
}

// ✅ ONLY client-safe headers
const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json; charset=utf-8',
}

// Default message settings
const defaultSettings = {
  hideSuccessMessage: false,
  hideErrorMessage: false,
  errorMessage: '',
  successMessage: '',
}

const Http = async (apiDataProps) => {
  const http = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers,
    withCredentials: true, // REQUIRED for cookies
  })

  const {
    url,
    config = {},
    messageSettings,
    data,
    method,
  } = apiDataProps

  const mergedMessageSettings = {
    ...defaultSettings,
    ...messageSettings,
  }

  const handleSuccess = (response) => {
    if (mergedMessageSettings.hideSuccessMessage) return

    if (mergedMessageSettings.successMessage) {
      Notification({
        type: NOTIFICATION_TYPE_SUCCESS,
        message: mergedMessageSettings.successMessage,
      })
    } else if (response?.data?.meta?.message) {
      Notification({
        type: NOTIFICATION_TYPE_SUCCESS,
        message: response.data.meta.message,
      })
    } else if (response?.status === StatusCode.NoContent) {
      Notification({
        type: NOTIFICATION_TYPE_INFO,
        message: 'Nothing updated.',
      })
    }
  }

  const handleError = (errorResponse) => {
    // FRONTEND validation error (thrown manually)
    if (errorResponse?.name === 'ValidationError') {
      Notification({
        type: NOTIFICATION_TYPE_ERROR,
        message: errorResponse.message,
      })
      return Promise.reject(errorResponse)
    }
    
    // Network / CORS / server-down error
    if (!errorResponse) {
      Notification({
        type: NOTIFICATION_TYPE_ERROR,
        message: 'Network error. Please check your connection.',
      })
      return Promise.reject(errorResponse)
    }

    const { status, data } = errorResponse

    if (data?.error?.message) {
      Notification({
        type: NOTIFICATION_TYPE_ERROR,
        message: data.error.message,
      })
      return Promise.reject(errorResponse)
    }

    if (mergedMessageSettings.hideErrorMessage) {
      return Promise.reject(errorResponse)
    }
    
    if (mergedMessageSettings.errorMessage) {
      Notification({
        type: NOTIFICATION_TYPE_ERROR,
        message: mergedMessageSettings.errorMessage,
      })
    } else if (typeof data?.data === 'string') {
      Notification({
        type: NOTIFICATION_TYPE_ERROR,
        message: data.data,
      })
    } else {
      switch (status) {
        case StatusCode.ResourceUnauthorized:
          Notification({ type: NOTIFICATION_TYPE_ERROR, message: 'Unauthorized access.' })
          break
        case StatusCode.ClientForbidden:
          Notification({ type: NOTIFICATION_TYPE_ERROR, message: 'Forbidden access.' })
          break
        case StatusCode.ResourceNotFound:
          Notification({ type: NOTIFICATION_TYPE_ERROR, message: 'Resource not found.' })
          break
        case StatusCode.Conflict:
          Notification({ type: NOTIFICATION_TYPE_ERROR, message: 'Conflict error.' })
          break
        default:
          Notification({ type: NOTIFICATION_TYPE_ERROR, message: 'Something went wrong.' })
      }
    }

    return Promise.reject(errorResponse)
  }

  http.interceptors.response.use(
    (response) => {
      handleSuccess(response)
      return response.data
    },
    (error) => handleError(error?.response)
  )

  switch (method) {
    case 'get':
      return http.get(url, config)
    case 'post':
      return http.post(url, data, config)
    case 'put':
      return http.put(url, data, config)
    case 'patch':
      return http.patch(url, data, config)
    case 'delete':
      return http.delete(url, config)
    default:
      return http.request(config)
  }
}

// Helpers
Http.get = ({ url, config, messageSettings }) =>
  Http({ url, config, messageSettings, method: 'get' })

Http.post = ({ url, data, config, messageSettings }) =>
  Http({ url, data, config, messageSettings, method: 'post' })

Http.put = ({ url, data, config, messageSettings }) =>
  Http({ url, data, config, messageSettings, method: 'put' })

Http.patch = ({ url, data, config, messageSettings }) =>
  Http({ url, data, config, messageSettings, method: 'patch' })

Http.delete = ({ url, config, messageSettings }) =>
  Http({ url, config, messageSettings, method: 'delete' })

export default Http
