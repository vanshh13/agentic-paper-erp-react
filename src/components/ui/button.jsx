const Button = ({ children, loading, ...props }) => (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
        loading || props.disabled
          ? 'bg-gray-700 cursor-not-allowed text-gray-400'
          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
      }`}
    >
      {loading ? 'Processing...' : children}
    </button>
  );
  export default Button;