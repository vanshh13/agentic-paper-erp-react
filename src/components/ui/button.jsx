const Button = ({ children, loading, ...props }) => (
  <button
    className="px-8 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    disabled={loading}
    {...props}
  >
    {loading ? 'Processing...' : children}
  </button>
);
  export default Button;