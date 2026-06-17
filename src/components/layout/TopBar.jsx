import { Bell, User } from 'lucide-react';

export default function TopBar({ title }) {
  return (
    <header className="h-16 border-b border-[var(--color-border-default)] flex items-center justify-between px-6 bg-[var(--color-bg-primary)] sticky top-0 z-40">
      <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">
        {title}
      </h1>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors">
          <Bell className="w-5 h-5 text-[var(--color-text-secondary)]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--color-accent-green)]" />
        </button>

        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] flex items-center justify-center">
          <User className="w-4 h-4 text-[var(--color-text-secondary)]" />
        </div>
      </div>
    </header>
  );
}
