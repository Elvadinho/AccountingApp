export default function Card({ children, className = '' }) {
  return (
    <div 
      className={`bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-[var(--radius-xl)] p-5 md:p-6 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-300 relative overflow-hidden group ${className}`}
    >
      {/* Subtle top highlight for depth */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-text-secondary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      {children}
    </div>
  );
}
