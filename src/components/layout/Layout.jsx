import { useState, useEffect, createContext, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

export const LayoutContext = createContext();

export function useLayout() {
  return useContext(LayoutContext);
}

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on route change on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <LayoutContext.Provider value={{ isSidebarOpen, setIsSidebarOpen }}>
      <div className="flex min-h-screen bg-[var(--color-bg-primary)]">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-fade-in"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 md:ml-56 transition-all duration-300 print:ml-0">
          {children}
        </div>
      </div>
    </LayoutContext.Provider>
  );
}
