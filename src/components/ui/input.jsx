const Input = ({ label, error, required, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-muted-foreground mb-2">
      {label} {required && <span className="text-destructive">*</span>}
    </label>
    <input
      className={`w-full px-4 py-2.5 text-sm bg-input text-foreground placeholder:text-muted-foreground border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all ${
        error ? 'border-destructive focus:ring-destructive' : 'border-border'
      }`}
      {...props}
    />
    {error && (
      <p className="text-destructive text-xs mt-1.5 flex items-center gap-1">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {error}
      </p>
    )}
  </div>
);
  export default Input;
