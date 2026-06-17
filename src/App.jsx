import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FinanceProvider } from './context/FinanceContext';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budget from './pages/Budget';
import Reports from './pages/Reports';
import AIAssistant from './pages/AIAssistant';

export default function App() {
  return (
    <FinanceProvider>
      <BrowserRouter>
        <div className="flex min-h-screen">
          {/* Fixed sidebar */}
          <Sidebar />

          {/* Main content area — offset by sidebar width */}
          <div className="flex-1 ml-56">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/budget" element={<Budget />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/ai" element={<AIAssistant />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </FinanceProvider>
  );
}
