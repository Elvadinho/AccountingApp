import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  PiggyBank,
  BarChart3,
  Bot,
  Wallet,
} from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/budget', label: 'Budget', icon: PiggyBank },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/ai', label: 'AI Assistant', icon: Bot },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-56 bg-[var(--color-bg-secondary)] border-r border-[var(--color-border-default)] flex flex-col z-50">
      {/* Logo */}
      <div className="px-5 py-6 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-[var(--color-accent-green)] flex items-center justify-center">
          <Wallet className="w-5 h-5 text-[var(--color-bg-primary)]" />
        </div>
        <span className="text-lg font-bold text-[var(--color-text-primary)] tracking-tight">
          MyMoney
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 mt-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[var(--color-bg-tertiary)] text-[var(--color-accent-green)] border-l-2 border-[var(--color-accent-green)] -ml-px'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]'
                  }`
                }
              >
                <item.icon className="w-[18px] h-[18px]" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-[var(--color-border-default)]">
        <p className="text-xs text-[var(--color-text-muted)]">
          MyMoney v1.0
        </p>
        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
          Smart Finance Dashboard
        </p>
      </div>
    </aside>
  );
}
