import { Menu, Bell, User } from 'lucide-react';
import { useLayout } from './Layout';

export default function TopBar({ title }) {
  const { setIsSidebarOpen } = useLayout();

  return (
    <header className="sticky top-0 z-30 bg-[var(--color-bg-primary)]/80 backdrop-blur-md border-b border-[var(--color-border-default)] px-4 md:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden p-2 -ml-2 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button className="p-2 rounded-full text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] transition-colors relative cursor-pointer group">
          <Bell className="w-5 h-5 group-hover:animate-bounce" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-[var(--color-accent-red)] rounded-full shadow-[0_0_8px_var(--color-accent-red)] animate-pulse" />
        </button>
        <button className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-[var(--color-bg-tertiary)] transition-colors border border-[var(--color-border-default)] cursor-pointer group hover:border-[var(--color-accent-green)]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-bg-tertiary)] to-[var(--color-bg-secondary)] border border-[var(--color-border-default)] flex items-center justify-center">
            <User className="w-4 h-4 text-[var(--color-text-secondary)] group-hover:text-[var(--color-accent-green)] transition-colors" />
          </div>
          <span className="text-sm font-medium hidden sm:block text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors">
            Elvadinho
          </span>
        </button>
      </div>
    </header>
  );
}
