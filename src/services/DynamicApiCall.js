import http from './http'

export const DynamicApiCall = ({
  url,
  method = 'post',
  data,
  params,
  headers,
  messageSettings,
}) => {
  const config = {
    url,
    method,
    params,
  }

  if (messageSettings) {
    config.messageSettings = messageSettings
  }

  // Only add headers if provided
  if (headers) {
    config.headers = headers
  }

  // Only attach data if method allows body
  if (method !== 'get' && method !== 'delete' && data) {
    config.data = data
  }

  return http[method](config)
}
