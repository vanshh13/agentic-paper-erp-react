import React from 'react'

export default function SuccessIcon({ fill = 'currentColor' }) {
  console.log('success icon rendered')

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.3337 4L6.00033 11.3333L2.66699 8"
        stroke={fill}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
