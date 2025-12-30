const Input = ({ label, error, required, ...props }) => (
  <div>
    <label className="block text-xs font-medium text-gray-300 mb-1">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <input
      className={`w-full px-2 py-1.5 text-sm bg-gray-800 border rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-white ${
        error ? 'border-red-500' : 'border-gray-700'
      }`}
      {...props}
    />
    {error && <p className="text-red-400 text-xs mt-0.5">{error}</p>}
  </div>
);

  export default Input;