export default function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl p-5 shadow-[var(--shadow-card)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
