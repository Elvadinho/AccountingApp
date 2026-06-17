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
    'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-[var(--color-accent-green)] text-[var(--color-bg-primary)] hover:bg-[var(--color-accent-green-hover)] active:scale-[0.97]',
    secondary:
      'bg-transparent border border-[var(--color-border-default)] text-[var(--color-text-primary)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-bg-tertiary)] active:scale-[0.97]',
    danger:
      'bg-transparent border border-[var(--color-accent-red)] text-[var(--color-accent-red)] hover:bg-[var(--color-accent-red-glow)] active:scale-[0.97]',
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
