export default function Button({
  variant = 'primary',
  children,
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-[var(--radius-lg)] text-sm font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-0 active:scale-[0.97]';

  const variants = {
    primary:
      'bg-[var(--color-accent-blue)] text-[var(--color-bg-primary)] hover:bg-[var(--color-accent-blue-hover)] focus:ring-[var(--color-accent-blue-glow)] shadow-sm hover:shadow-md',
    secondary:
      'bg-transparent border border-[var(--color-border-default)] text-[var(--color-text-primary)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-bg-tertiary)] focus:ring-[var(--color-border-hover)]',
    danger:
      'bg-transparent border border-[var(--color-finance-expense)]/40 text-[var(--color-finance-expense)] hover:bg-[var(--color-finance-expense-glow)] focus:ring-[var(--color-finance-expense-glow)]',
    ghost:
      'bg-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
