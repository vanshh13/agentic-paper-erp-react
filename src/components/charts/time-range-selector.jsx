export default function TimeRangeSelector({ selectedRange, onRangeChange }) {
  const ranges = [
    { value: 1, label: '1 Month' },
    { value: 3, label: '3 Months' },
    { value: 6, label: '6 Months' },
    { value: 12, label: '12 Months' },
  ]

  return (
    <div className="flex flex-wrap justify-end gap-2 w-full md:w-auto">
      {ranges.map((range) => (
        <button
          key={range.value}
          onClick={() => onRangeChange(range.value)}
          className={`px-2.5 py-1.5 text-[11px] font-medium rounded-lg whitespace-nowrap transition-colors ${
            selectedRange === range.value
              ? 'bg-indigo-600 text-white'
              : 'bg-card text-muted-foreground hover:bg-accent hover:text-foreground'
          }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  )
}

