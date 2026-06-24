import { LayoutDashboard, Users, ClipboardList, Wallet, Bot, Settings, LogOut, LifeBuoy, Megaphone, Lock } from 'lucide-react';

// Tambahkan konstanta role permission di atas komponen Sidebar
const rolePermissions = {
  'Super Admin': ['all'],
  'Finance': ['Dashboard', 'Manajemen Keuangan', 'Pengaturan Platform'],
  'CS': ['Dashboard', 'Manajemen Konten & Komunikasi'],
  'Moderator': ['Dashboard', 'Manajemen Quest', 'Manajemen AI & Moderasi'],
};

export default function Sidebar({ activeMenu, setActiveMenu, onLogout, disputeCount = 0, kycCount = 0, wdCount = 0, adminRole = 'Super Admin' }) {
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Manajemen Pengguna', icon: Users },
    { name: 'Manajemen Quest', icon: ClipboardList },
    { name: 'Manajemen Dispute', icon: LifeBuoy },
    { name: 'Manajemen Keuangan', icon: Wallet },
    { name: 'Manajemen AI & Moderasi', icon: Bot },
    { name: 'Manajemen Konten & Komunikasi', icon: Megaphone },
    { name: 'Pengaturan Platform', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between h-full z-10">
      <div>
        <div className="p-6 flex items-center gap-3 text-left">
          <img src="/LOGO SAMBILAN.png" alt="Logo Sambilan" className="w-10 h-10 object-contain drop-shadow-sm" />
          <div className="text-left">
            <h1 className="font-extrabold text-[#005139] text-xl tracking-tight leading-tight text-left">Sambilan</h1>
            <p className="text-xs text-slate-500 font-medium text-left">{adminRole}</p>
          </div>
        </div>

        <nav className="mt-2 px-4 space-y-1">
          {menuItems.map((item) => {
            let badge = null;
            if (item.name === 'Manajemen Dispute' && disputeCount > 0) badge = disputeCount;
            if (item.name === 'Manajemen Pengguna' && kycCount > 0) badge = kycCount;
            if (item.name === 'Manajemen Keuangan' && wdCount > 0) badge = wdCount;

            const permissions = rolePermissions[adminRole] || [];
            const hasAccess = permissions.includes('all') || permissions.includes(item.name);

            return (
              <button
                key={item.name}
                onClick={() => {
                  if (hasAccess) {
                    setActiveMenu(item.name);
                  } else {
                    if (window.showToast) {
                      window.showToast("Akses ditolak — Anda tidak memiliki izin untuk menu ini", "error");
                    }
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 text-left ${
                  !hasAccess
                    ? 'text-slate-300 cursor-not-allowed bg-transparent'
                    : activeMenu === item.name 
                      ? 'bg-emerald-50/80 text-[#005139] shadow-sm' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                <item.icon size={20} className={
                  !hasAccess
                    ? 'text-slate-300'
                    : activeMenu === item.name ? 'text-[#005139]' : 'text-slate-400'
                } />
                <span className={!hasAccess ? 'text-slate-300' : ''}>{item.name}</span>
                {badge !== null && hasAccess && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 ml-auto">
                    {badge}
                  </span>
                )}
                {!hasAccess && (
                  <Lock size={12} className="text-slate-300 ml-auto shrink-0" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
      
      <div className="p-4 border-t border-slate-100">
        <button onClick={onLogout} className="flex items-center gap-3 text-red-500 font-bold px-4 py-3 hover:bg-red-50 rounded-xl w-full transition-colors">
          <LogOut size={20} /> Keluar
        </button>
      </div>
    </aside>
  );
}