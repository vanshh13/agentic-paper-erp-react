export default function TimeRangeSelector({ selectedRange, onRangeChange }) {
  const ranges = [
    { value: 1, label: '1 Month' },
    { value: 3, label: '3 Months' },
    { value: 6, label: '6 Months' },
    { value: 12, label: '12 Months' },
  ]

  return (
    <div className="flex items-center gap-2">
      {ranges.map((range) => (
        <button
          key={range.value}
          onClick={() => onRangeChange(range.value)}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            selectedRange === range.value
              ? 'bg-indigo-600 text-white'
              : 'bg-[oklch(0.22_0_0)] text-[oklch(0.75_0_0)] hover:bg-[oklch(0.24_0_0)] hover:text-[oklch(0.92_0_0)]'
          }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  )
}

