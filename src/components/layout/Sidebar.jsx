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

export default function Sidebar({ isOpen }) {
  return (
    <aside 
      className={`fixed left-0 top-0 bottom-0 w-56 bg-[var(--color-bg-secondary)] border-r border-[var(--color-border-default)] flex flex-col z-50 transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      {/* Logo */}
      <div className="px-5 py-6 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--color-accent-green)] to-[var(--color-accent-blue)] flex items-center justify-center shadow-lg shadow-[var(--color-accent-green-glow)]">
          <Wallet className="w-5 h-5 text-[var(--color-bg-primary)]" />
        </div>
        <span className="text-xl font-bold text-[var(--color-text-primary)] tracking-tight">
          MyMoney
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 mt-4">
        <ul className="space-y-1.5">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-[var(--color-accent-green-glow)] text-[var(--color-accent-green)]'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={`w-[18px] h-[18px] transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                    {item.label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-5 py-5 border-t border-[var(--color-border-default)] bg-gradient-to-t from-[var(--color-bg-tertiary)] to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#3b82f6] to-[#22c55e] p-0.5">
            <div className="w-full h-full rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center">
              <span className="text-xs font-bold text-[var(--color-text-primary)]">M</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">
              MyMoney Pro
            </p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              v1.0.0
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
