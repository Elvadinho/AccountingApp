import { useState, useRef, useEffect } from 'react';
import { Menu, Bell, User, Trash2, Settings, AlertTriangle } from 'lucide-react';
import { useLayout } from './Layout';
import { useFinance } from '../../context/FinanceContext';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

export default function TopBar({ title }) {
  const { setIsSidebarOpen } = useLayout();
  const { resetAllData } = useFinance();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleResetConfirm() {
    resetAllData();
    setIsResetModalOpen(false);
    setIsDropdownOpen(false);
  }

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
        
        {/* Profile Dropdown Container */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-[var(--color-bg-tertiary)] transition-colors border border-[var(--color-border-default)] cursor-pointer group hover:border-[var(--color-accent-green)]"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-bg-tertiary)] to-[var(--color-bg-secondary)] border border-[var(--color-border-default)] flex items-center justify-center">
              <User className="w-4 h-4 text-[var(--color-text-secondary)] group-hover:text-[var(--color-accent-green)] transition-colors" />
            </div>
            <span className="text-sm font-medium hidden sm:block text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors">
              Elvadinho
            </span>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl shadow-[var(--shadow-elevated)] py-1 animate-fade-in z-50">
              <button className="w-full text-left px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] transition-colors flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <div className="h-px bg-[var(--color-border-default)] my-1" />
              <button 
                onClick={() => setIsResetModalOpen(true)}
                className="w-full text-left px-4 py-2 text-sm text-[var(--color-accent-red)] hover:bg-[var(--color-accent-red-glow)] transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Erase All Data
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Erase All Data"
      >
        <div className="flex flex-col items-center text-center pb-4">
          <div className="w-12 h-12 rounded-full bg-[var(--color-accent-red-glow)] flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-[var(--color-accent-red)]" />
          </div>
          <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">
            Are you absolutely sure?
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6">
            This action cannot be undone. This will permanently delete all your transactions, budgets, and financial history from your device.
          </p>
          <div className="flex w-full gap-3">
            <Button variant="secondary" onClick={() => setIsResetModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="danger" onClick={handleResetConfirm} className="flex-1 bg-[var(--color-accent-red)] text-white hover:bg-[var(--color-accent-red)]/90 border-none">
              Yes, erase everything
            </Button>
          </div>
        </div>
      </Modal>
    </header>
  );
}
