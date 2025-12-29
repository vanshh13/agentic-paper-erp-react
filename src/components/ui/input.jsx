const Input = ({ label, error, ...props }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-300 mb-1">
        {label} {props.required && <span className="text-red-400">*</span>}
      </label>
      <input
        {...props}
        className={`w-full px-4 py-2.5 bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-white placeholder-gray-500 ${
          error ? 'border-red-500' : 'border-gray-700'
        }`}
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );

  export default Input;