import React from 'react'

export default function InfoIcon({ fill = 'currentColor' }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="12" fill="#1FB6FF" />
      <path
        d="M11.9993 5.33268C8.33268 5.33268 5.33268 8.33268 5.33268 11.9993C5.33268 15.666 8.33268 18.666 11.9993 18.666C15.666 18.666 18.666 15.666 18.666 11.9993C18.666 8.33268 15.666 5.33268 11.9993 5.33268Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 14.666V11.3327"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.0039 9.33203H11.9979"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
