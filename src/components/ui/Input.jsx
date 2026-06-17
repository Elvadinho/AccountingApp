export default function Input({
  label,
  error,
  className = '',
  id,
  ...props
}) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-[var(--color-text-secondary)]"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`px-3 py-2.5 rounded-[var(--radius-lg)] bg-[var(--color-bg-tertiary)] border text-[var(--color-text-primary)] text-sm placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 shadow-inner ${
          error
            ? 'border-[var(--color-accent-red)] focus:border-[var(--color-accent-red)] focus:ring-[var(--color-accent-red-glow)]'
            : 'border-[var(--color-border-default)] focus:border-[var(--color-accent-green)] focus:ring-[var(--color-accent-green-glow)] hover:border-[var(--color-border-hover)]'
        }`}
        {...props}
      />
      {error && (
        <span className="text-xs text-[var(--color-accent-red)] font-medium animate-fade-in">
          {error}
        </span>
      )}
    </div>
  );
}
