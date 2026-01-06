import React from 'react'

export default function NotificationCloseIcon({ fill = 'currentColor' }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 8.65991L8.65995 0.999957"
        stroke={fill}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.65995 8.65995L1 1"
        stroke={fill}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
