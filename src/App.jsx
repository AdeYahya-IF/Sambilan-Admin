import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

import Login from './pages/Login';
import DashboardHome from './pages/DashboardHome';
import Users, { initialUsers } from './pages/Users';
import Quests from './pages/Quests';
import Transactions, { initialWithdrawals } from './pages/Transactions';
import Moderation from './pages/Moderation';
import Resolution, { initialDisputes } from './pages/Resolution';
import Settings from './pages/Settings';
import ContentManagement from './pages/ContentManagement';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeMenu, setActiveMenu] = useState('Dashboard');

  // Lifted states for Sidebar Badges & cross-tab data persistence
  const [users, setUsers] = useState(initialUsers);
  const [disputes, setDisputes] = useState(initialDisputes);
  const [withdrawals, setWithdrawals] = useState(initialWithdrawals);
  const [adminRole, setAdminRole] = useState(() => localStorage.getItem('adminRole') || 'Super Admin');

  // Global Toast state
  const [toast, setToast] = useState(null);
  const [isToastVisible, setIsToastVisible] = useState(false);

  useEffect(() => {
    window.showToast = (message, type = 'success') => {
      setToast({ message, type });
      setIsToastVisible(true);
    };
  }, []);

  useEffect(() => {
    if (toast) {
      const fadeTimer = setTimeout(() => {
        setIsToastVisible(false);
      }, 2700);

      const removeTimer = setTimeout(() => {
        setToast(null);
      }, 3000);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [toast]);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  // Calculate pending counts for notification badges
  const disputeCount = disputes.filter(d => d.status !== 'Selesai').length;
  const kycCount = users.filter(u => u.verificationStatus === 'Menunggu').length;
  const wdCount = withdrawals.filter(w => w.status === 'Menunggu').length;

  const renderContent = () => {
    switch (activeMenu) {
      case 'Dashboard': return <DashboardHome setActiveMenu={setActiveMenu} />;
      case 'Manajemen Pengguna': return <Users users={users} setUsers={setUsers} />;
      case 'Manajemen Quest': return <Quests />;
      case 'Manajemen Keuangan': return <Transactions withdrawals={withdrawals} setWithdrawals={setWithdrawals} setActiveMenu={setActiveMenu} />;
      case 'Manajemen AI & Moderasi': return <Moderation />;
      case 'Manajemen Dispute': return <Resolution disputes={disputes} setDisputes={setDisputes} />;
      case 'Manajemen Konten & Komunikasi': return <ContentManagement adminRole={adminRole} setAdminRole={setAdminRole} />;
      case 'Pengaturan Platform': return <Settings adminRole={adminRole} setAdminRole={setAdminRole} />;
      default: return <DashboardHome setActiveMenu={setActiveMenu} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 relative">
      <Sidebar 
        activeMenu={activeMenu} 
        setActiveMenu={setActiveMenu} 
        onLogout={() => setIsAuthenticated(false)} 
        disputeCount={disputeCount}
        kycCount={kycCount}
        wdCount={wdCount}
        adminRole={adminRole}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header title={activeMenu} adminRole={adminRole} />
        <div className="flex-1 overflow-auto p-8">
          {renderContent()}
        </div>
      </main>

      {/* Global Toast Component */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-55 transition-all duration-300 transform ${
          isToastVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
        }`}>
          <div className={`px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 border font-bold text-xs text-white ${
            toast.type === 'success' ? 'bg-[#005139] border-emerald-500' : 'bg-rose-600 border-rose-500'
          }`}>
            <span className="text-sm">{toast.type === 'success' ? '✅' : '❌'}</span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}