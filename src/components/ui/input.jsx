const Input = ({ label, error, required, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-[oklch(0.85_0_0)] mb-2">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <input
      className={`w-full px-4 py-2.5 text-sm bg-[oklch(0.30_0_0)] border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-[oklch(0.95_0_0)] placeholder:text-[oklch(0.60_0_0)] ${
        error ? 'border-red-500 focus:ring-red-500' : 'border-[oklch(0.25_0_0)]'
      }`}
      {...props}
    />
    {error && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {error}
    </p>}
  </div>
);
  export default Input;
