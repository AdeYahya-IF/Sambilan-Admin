import { useState } from 'react';
import { 
  Sliders, 
  Shield, 
  Bell, 
  CheckCircle, 
  Save, 
  UserPlus, 
  Clock, 
  Mail, 
  Phone, 
  MapPin, 
  Palette, 
  Activity, 
  Plus, 
  X, 
  Lock,
  Building,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';

const initialAdmins = [
  { id: 'ADM-001', name: 'Nashiruddin', email: 'nashiruddin@sambilan.com', role: 'Super Admin', status: 'Aktif' },
  { id: 'ADM-002', name: 'Sari Nur Aini', email: 'sari.n.a@sambilan.com', role: 'Finance', status: 'Aktif' },
  { id: 'ADM-003', name: 'Naila Rona Nur Aini', email: 'naila.r.n.a@sambilan.com', role: 'CS', status: 'Aktif' },
  { id: 'ADM-004', name: 'Ade Yahya Hendriawan', email: 'ade.y.h@sambilan.com', role: 'Moderator', status: 'Suspended' }
];

const initialAuditLogs = [
  { id: 'LOG-001', time: '24 Jun 2026, 01:10', admin: 'Nashiruddin', role: 'Super Admin', activity: 'Mengubah batas waktu auto-release escrow menjadi 24 jam' },
  { id: 'LOG-002', time: '23 Jun 2026, 18:45', admin: 'Sari Nur Aini', role: 'Finance', activity: 'Mengunduh laporan komisi keuangan bulanan' },
  { id: 'LOG-003', time: '23 Jun 2026, 14:20', admin: 'Nashiruddin', role: 'Super Admin', activity: 'Menambahkan akun admin baru: Naila Rona Nur Aini (CS)' },
  { id: 'LOG-004', time: '22 Jun 2026, 11:30', admin: 'Ade Yahya Hendriawan', role: 'Moderator', activity: 'Mengubah threshold moderasi sensitivitas AI' },
  { id: 'LOG-005', time: '21 Jun 2026, 09:15', admin: 'Nashiruddin', role: 'Super Admin', activity: 'Menangguhkan akses akun admin Ade Yahya Hendriawan' }
];

export default function Settings({ adminRole = 'Super Admin', setAdminRole = () => {} }) {
  const [activeTab, setActiveTab] = useState('Umum'); // 'Umum' | 'Komisi' | 'Kebijakan' | 'Admin' | 'Notifikasi'
  
  // Toast notifications
  const [toastMsg, setToastMsg] = useState('');

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg('');
    }, 3000);
  };

  // State: Pengaturan Umum
  const [appName, setAppName] = useState('Sambilan Admin');
  const [appEmail, setAppEmail] = useState('halo@sambilan.id');
  const [appPhone, setAppPhone] = useState('+62 899-9999-9999');
  const [appAddress, setAppAddress] = useState('Jl Wirayudha, RT 01 RW 01, Dusun IV, Desa Karangnanas, Kecamatan Sokaraja, Kabupaten Banyumas, Prov. Jawa Tengah, 53181');
  const [themeColor, setThemeColor] = useState('emerald');

  // State: Pengaturan Komisi
  const [commissionPct, setCommissionPct] = useState(0);
  const [commissionFlat, setCommissionFlat] = useState(3500);
  const [wdAdminFee, setWdAdminFee] = useState(2500);
  const [minTopUp, setMinTopUp] = useState(10000);
  const [maxTopUp, setMaxTopUp] = useState(10000000);
  const [minWD, setMinWD] = useState(50000);
  const [maxWD, setMaxWD] = useState(20000000);

  // State: Pengaturan Kebijakan
  const [autoReleaseHours, setAutoReleaseHours] = useState(24);
  const [disputeHours, setDisputeHours] = useState(48);
  const [maxRevisions, setMaxRevisions] = useState(3);
  const [warnPointsSuspend, setWarnPointsSuspend] = useState(10);
  const [warnPointsBan, setWarnPointsBan] = useState(25);

  // Saved state to track changes on operational policies
  const [savedPolicies, setSavedPolicies] = useState({
    autoReleaseHours: 24,
    disputeHours: 48,
    maxRevisions: 3,
    warnPointsSuspend: 10,
    warnPointsBan: 25
  });

  const [showPolicyConfirmModal, setShowPolicyConfirmModal] = useState(false);

  // State: Manajemen Admin
  const [admins, setAdmins] = useState(initialAdmins);
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminRole, setNewAdminRole] = useState('Moderator');
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [auditLogs, setAuditLogs] = useState(initialAuditLogs);

  // State: Notifikasi Sistem
  const [notifQuestCompleted, setNotifQuestCompleted] = useState(true);
  const [notifDisputeEntered, setNotifDisputeEntered] = useState(true);
  const [notifWithdrawProcessed, setNotifWithdrawProcessed] = useState(true);
  const [notifKycWarning, setNotifKycWarning] = useState(true);

  // State: Template Pesan
  const [tempQuestTitle, setTempQuestTitle] = useState('Quest Selesai! 🎉');
  const [tempQuestMsg, setTempQuestMsg] = useState('Selamat! Quest "{quest_title}" telah dinyatakan selesai oleh Creator. Dana escrow Rp {budget} berhasil dilepas ke dompet saldo Anda.');
  const [tempDisputeTitle, setTempDisputeTitle] = useState('Sengketa Quest Terbuka ⚖️');
  const [tempDisputeMsg, setTempDisputeMsg] = useState('Quest "{quest_title}" telah masuk ke dalam proses penanganan dispute/sengketa oleh {initiator}. Tim moderator kami akan meninjau bukti.');
  const [tempSanksiTitle, setTempSanksiTitle] = useState('Peringatan Akun Sambilan ⚠️');
  const [tempSanksiMsg, setTempSanksiMsg] = useState('Akun Anda menerima sanksi peringatan karena terindikasi: {reason}. Total poin akumulasi pelanggaran Anda: {points} poin.');

  // Push audit log helper
  const addAuditLog = (activityText) => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }) + `, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    setAuditLogs(prev => {
      const newLog = {
        id: `LOG-${prev.length + 101}`,
        time: formattedDate,
        admin: 'Nashiruddin', // Logged in super admin mock
        role: 'Super Admin',
        activity: activityText
      };
      return [newLog, ...prev];
    });
  };

  // Save changes handler
  const handleSaveSettings = (tabName, activityMsg) => {
    triggerToast(`Pengaturan [${tabName}] berhasil disimpan.`);
    addAuditLog(activityMsg);
  };

  // Policies save action after confirmation
  const confirmSavePolicies = () => {
    setSavedPolicies({
      autoReleaseHours,
      disputeHours,
      maxRevisions,
      warnPointsSuspend,
      warnPointsBan
    });
    setShowPolicyConfirmModal(false);
    handleSaveSettings('Kebijakan Operasional', `Memperbarui kebijakan operasional (Auto-release: ${autoReleaseHours}j, Dispute: ${disputeHours}j, Max Revisi: ${maxRevisions}, Suspend: ${warnPointsSuspend}pt, Ban: ${warnPointsBan}pt)`);
  };

  // Add new admin handler
  const handleAddAdmin = (e) => {
    e.preventDefault();
    if (!newAdminName.trim() || !newAdminEmail.trim() || !newAdminPassword.trim()) {
      triggerToast('Nama, Email, dan Password admin harus diisi!', 'error');
      return;
    }

    setAdmins(prev => {
      const newAdmin = {
        id: `ADM-${prev.length + 101}`,
        name: newAdminName,
        email: newAdminEmail,
        password: newAdminPassword,
        role: newAdminRole,
        status: 'Aktif'
      };
      
      setTimeout(() => {
        addAuditLog(`Menambahkan akun admin baru: ${newAdminName} (${newAdminRole})`);
      }, 0);

      return [...prev, newAdmin];
    });

    triggerToast(`Admin ${newAdminName} berhasil ditambahkan.`);
    
    // Reset form
    setNewAdminName('');
    setNewAdminEmail('');
    setNewAdminPassword('');
    setNewAdminRole('Moderator');
    setShowAddAdminModal(false);
  };

  // Toggle admin status
  const handleToggleAdminStatus = (id, name, currentStatus) => {
    const nextStatus = currentStatus === 'Aktif' ? 'Suspended' : 'Aktif';
    setAdmins(prev => prev.map(adm => adm.id === id ? { ...adm, status: nextStatus } : adm));
    
    const actionWord = nextStatus === 'Suspended' ? 'Menangguhkan akses' : 'Mengaktifkan kembali';
    addAuditLog(`${actionWord} akun admin ${name}`);
    triggerToast(`Status admin ${name} diubah menjadi ${nextStatus}.`);
  };

  // Delete admin
  const handleDeleteAdmin = (id, name) => {
    setAdmins(prev => prev.filter(adm => adm.id !== id));
    addAuditLog(`Menghapus akun admin ${name}`);
    triggerToast(`Akun admin ${name} berhasil dihapus.`);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 bg-[#005139] border border-emerald-500 text-white font-bold text-sm px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 size={18} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Title Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            Pengaturan Platform
          </h2>
          <p className="text-slate-500 text-sm mt-1">Konfigurasi teknis, keuangan, kebijakan operasional, manajemen admin, dan notifikasi platform Sambilan.</p>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto scrollbar-none pb-px text-sm font-bold">
        {[
          { id: 'Umum', label: 'Umum & Kontak' },
          { id: 'Komisi', label: 'Keuangan & Komisi' },
          { id: 'Kebijakan', label: 'Kebijakan Operasional' },
          { id: 'Admin', label: 'Manajemen Admin & Audit' },
          { id: 'Notifikasi', label: 'Notifikasi & Template' }
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 pb-3 border-b-2 font-black transition-all shrink-0 ${
              activeTab === tab.id 
                ? 'border-[#005139] text-[#005139]' 
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* LEFT/CENTER DETAILS PANEL */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* ==================== TAB 1: PENGATURAN UMUM & KONTAK ==================== */}
          {activeTab === 'Umum' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-6 animate-in fade-in duration-300">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-50 rounded-lg text-[#005139]"><Sliders size={18} /></div>
                  <h3 className="font-extrabold text-slate-800 text-base">Identitas & Kontak Platform</h3>
                </div>
                <button 
                  onClick={() => handleSaveSettings('Umum & Kontak', 'Mengubah konfigurasi identitas umum dan kontak platform')}
                  className="flex items-center gap-2 px-4 py-2 bg-[#005139] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-emerald-100"
                >
                  <Save size={14}/> Simpan Perubahan
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Nama Aplikasi */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">Nama Aplikasi Platform</label>
                  <input 
                    type="text" 
                    value={appName} 
                    onChange={(e) => setAppName(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#005139] text-sm font-semibold text-slate-800 bg-slate-50/50"
                  />
                </div>

                {/* Warna Tema */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Palette size={12} /> Warna Tema Utama
                  </label>
                  <div className="flex gap-3 items-center h-[38px]">
                    {[
                      { id: 'emerald', bg: 'bg-emerald-600', label: 'Emerald' },
                      { id: 'blue', bg: 'bg-blue-600', label: 'Blue' },
                      { id: 'indigo', bg: 'bg-indigo-600', label: 'Indigo' },
                      { id: 'amber', bg: 'bg-amber-500', label: 'Amber' }
                    ].map(color => (
                      <button 
                        key={color.id}
                        type="button"
                        onClick={() => setThemeColor(color.id)}
                        className={`w-6 h-6 rounded-full ${color.bg} transition-all relative ${
                          themeColor === color.id ? 'ring-2 ring-slate-800 ring-offset-2 scale-110' : 'opacity-70 hover:opacity-100'
                        }`}
                        title={color.label}
                      />
                    ))}
                    <span className="text-xs text-slate-500 font-bold capitalize ml-1">{themeColor}</span>
                  </div>
                </div>

                {/* Logo Uploader */}
                <div className="md:col-span-2 p-4 bg-slate-50 border border-slate-200 border-dashed rounded-xl flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                    <img src="/LOGO SAMBILAN.png" alt="Sambilan Logo Preview" className="w-12 h-12 object-contain" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <h4 className="text-xs font-bold text-slate-800">Logo Aplikasi (.png)</h4>
                    <p className="text-[10px] text-slate-500 font-semibold">Gunakan resolusi persegi minimal 512x512 piksel dengan latar transparan.</p>
                    <div className="flex gap-2 mt-1">
                      <button type="button" className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg transition-colors">
                        Ganti Logo
                      </button>
                      <button type="button" className="px-3 py-1 text-slate-500 text-[10px] font-bold hover:text-rose-600 transition-colors">
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>

                {/* Email Support */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Mail size={12} /> Email Kontak Resmi
                  </label>
                  <input 
                    type="email" 
                    value={appEmail} 
                    onChange={(e) => setAppEmail(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#005139] text-sm font-semibold text-slate-800"
                  />
                </div>

                {/* Telepon Support */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Phone size={12} /> No. Telepon Resmi
                  </label>
                  <input 
                    type="text" 
                    value={appPhone} 
                    onChange={(e) => setAppPhone(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#005139] text-sm font-semibold text-slate-800"
                  />
                </div>

                {/* Alamat Kantor */}
                <div className="md:col-span-2 flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <MapPin size={12} /> Alamat Kantor Fisik
                  </label>
                  <textarea 
                    rows={3}
                    value={appAddress} 
                    onChange={(e) => setAppAddress(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#005139] text-sm font-semibold text-slate-800 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB 2: PENGATURAN KOMISI & KEUANGAN ==================== */}
          {activeTab === 'Komisi' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-6 animate-in fade-in duration-300">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-50 rounded-lg text-[#005139]"><Building size={18} /></div>
                  <h3 className="font-extrabold text-slate-800 text-base">Aturan Monetisasi & Transaksi</h3>
                </div>
                <button 
                  onClick={() => handleSaveSettings('Keuangan & Komisi', `Mengubah komisi platform (${commissionPct}% + Rp ${commissionFlat}) dan biaya penarikan (Rp ${wdAdminFee})`)}
                  disabled={commissionPct < 0 || commissionPct > 100 || minTopUp > maxTopUp}
                  className={`flex items-center gap-2 px-4 py-2 text-white rounded-xl text-xs font-bold transition-all shadow-sm ${
                    (commissionPct < 0 || commissionPct > 100 || minTopUp > maxTopUp)
                      ? 'bg-slate-350 opacity-55 cursor-not-allowed'
                      : 'bg-[#005139] hover:bg-emerald-800 shadow-emerald-100'
                  }`}
                >
                  <Save size={14}/> Simpan Perubahan
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Persentase Komisi Platform */}
                <div className="p-4 bg-emerald-50/20 border border-emerald-100 rounded-xl flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-800">Komisi Platform Persentase</label>
                  <div className="flex border border-slate-200 rounded-xl overflow-hidden focus-within:border-[#005139] bg-white">
                    <input 
                      type="number" 
                      value={commissionPct} 
                      onChange={(e) => setCommissionPct(Number(e.target.value))}
                      className="w-full px-3 py-2 outline-none font-bold text-slate-800 text-sm"
                    />
                    <span className="px-4 py-2 bg-slate-100 border-l border-slate-200 text-slate-500 font-bold text-sm flex items-center">%</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium">Beban komisi persentase yang dipotong otomatis dari anggaran quest ketika disetujui selesai.</p>
                  {(commissionPct < 0 || commissionPct > 100) && (
                    <p className="text-[10px] text-red-500 font-semibold mt-1">Error: Komisi platform harus berada di antara 0% dan 100%.</p>
                  )}
                </div>

                {/* Komisi Platform Tetap (Rupiah) */}
                <div className="p-4 bg-emerald-50/20 border border-emerald-100 rounded-xl flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-800">Komisi Platform Tetap (Flat)</label>
                  <div className="flex border border-slate-200 rounded-xl overflow-hidden focus-within:border-[#005139] bg-white">
                    <span className="px-4 py-2 bg-slate-100 border-r border-slate-200 text-slate-500 font-bold text-sm flex items-center">Rp</span>
                    <input 
                      type="number" 
                      value={commissionFlat} 
                      onChange={(e) => setCommissionFlat(Number(e.target.value))}
                      className="w-full px-3 py-2 outline-none font-bold text-slate-800 text-sm"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium">Beban komisi nominal tetap (flat) yang dipotong untuk setiap quest yang selesai.</p>
                </div>

                {/* Biaya Admin Penarikan */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col gap-2 md:col-span-2">
                  <label className="text-xs font-bold text-slate-850">Biaya Admin Penarikan Saldo</label>
                  <div className="flex border border-slate-200 rounded-xl overflow-hidden focus-within:border-[#005139] bg-white">
                    <span className="px-4 py-2 bg-slate-100 border-r border-slate-200 text-slate-500 font-bold text-sm flex items-center">Rp</span>
                    <input 
                      type="number" 
                      value={wdAdminFee} 
                      onChange={(e) => setWdAdminFee(Number(e.target.value))}
                      className="w-full px-3 py-2 outline-none font-bold text-slate-800 text-sm"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium">Biaya flat setiap proses penarikan saldo (withdrawal) ke rekening bank.</p>
                </div>

                {/* Batasan Top Up */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3.5">
                  <h4 className="text-xs font-black text-slate-850 border-b border-slate-200 pb-1.5 uppercase tracking-wide">Batasan Top Up Saldo</h4>
                  
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-slate-600">Minimum Top Up</label>
                    <div className="flex border border-slate-200 rounded-lg overflow-hidden bg-white">
                      <span className="px-3 py-1 bg-slate-50 border-r border-slate-200 text-slate-400 text-xs flex items-center">Rp</span>
                      <input 
                        type="number" 
                        value={minTopUp} 
                        onChange={(e) => setMinTopUp(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 outline-none font-semibold text-slate-700 text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-slate-600">Maksimum Top Up (Per Transaksi)</label>
                    <div className="flex border border-slate-200 rounded-lg overflow-hidden bg-white">
                      <span className="px-3 py-1 bg-slate-50 border-r border-slate-200 text-slate-400 text-xs flex items-center">Rp</span>
                      <input 
                        type="number" 
                        value={maxTopUp} 
                        onChange={(e) => setMaxTopUp(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 outline-none font-semibold text-slate-700 text-xs"
                      />
                    </div>
                  </div>

                  {minTopUp > maxTopUp && (
                    <p className="text-[10px] text-red-500 font-semibold mt-1">
                      Error: Minimum top up tidak boleh lebih besar dari maksimum top up.
                    </p>
                  )}
                </div>

                {/* Batasan Penarikan */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3.5">
                  <h4 className="text-xs font-black text-slate-800 border-b border-slate-200 pb-1.5 uppercase tracking-wide">Batasan Penarikan Saldo</h4>

                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-slate-600">Minimum Penarikan</label>
                    <div className="flex border border-slate-200 rounded-lg overflow-hidden bg-white">
                      <span className="px-3 py-1 bg-slate-50 border-r border-slate-200 text-slate-400 text-xs flex items-center">Rp</span>
                      <input 
                        type="number" 
                        value={minWD} 
                        onChange={(e) => setMinWD(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 outline-none font-semibold text-slate-700 text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-slate-600">Maksimum Penarikan (Per Transaksi)</label>
                    <div className="flex border border-slate-200 rounded-lg overflow-hidden bg-white">
                      <span className="px-3 py-1 bg-slate-50 border-r border-slate-200 text-slate-400 text-xs flex items-center">Rp</span>
                      <input 
                        type="number" 
                        value={maxWD} 
                        onChange={(e) => setMaxWD(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 outline-none font-semibold text-slate-700 text-xs"
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ==================== TAB 3: KEBIJAKAN OPERASIONAL ==================== */}
          {activeTab === 'Kebijakan' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-6 animate-in fade-in duration-300">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-50 rounded-lg text-[#005139]"><Shield size={18} /></div>
                  <h3 className="font-extrabold text-slate-800 text-base">Kebijakan & Sanksi Platform</h3>
                </div>
                <button 
                  onClick={() => setShowPolicyConfirmModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#005139] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  <Save size={14}/> Simpan Perubahan
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Batas Auto-Release */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-750">Batas Waktu Auto-Release Escrow</label>
                  <div className="flex border border-slate-200 rounded-xl overflow-hidden focus-within:border-[#005139]">
                    <input 
                      type="number" 
                      value={autoReleaseHours} 
                      onChange={(e) => setAutoReleaseHours(Number(e.target.value))}
                      className="w-full px-3.5 py-2 outline-none font-bold text-slate-800 text-sm"
                    />
                    <span className="px-4 py-2 bg-slate-100 border-l border-slate-200 text-slate-500 font-bold text-xs flex items-center">Jam</span>
                  </div>
                  <p className="text-slate-400 text-[10px] font-semibold leading-relaxed mt-1">Dana escrow otomatis dirilis ke Adventurer apabila Creator tidak memberikan konfirmasi atau ulasan setelah batas waktu ini terlampaui.</p>
                </div>

                {/* Batas Waktu Dispute */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-750">Batas Waktu Pengajuan Dispute</label>
                  <div className="flex border border-slate-200 rounded-xl overflow-hidden focus-within:border-[#005139]">
                    <input 
                      type="number" 
                      value={disputeHours} 
                      onChange={(e) => setDisputeHours(Number(e.target.value))}
                      className="w-full px-3.5 py-2 outline-none font-bold text-slate-800 text-sm"
                    />
                    <span className="px-4 py-2 bg-slate-100 border-l border-slate-200 text-slate-500 font-bold text-xs flex items-center">Jam</span>
                  </div>
                  <p className="text-slate-400 text-[10px] font-semibold leading-relaxed mt-1">Batas waktu maksimal bagi Creator untuk membuka mediasi sengketa apabila tidak puas dengan bukti penyerahan hasil tugas.</p>
                </div>

                {/* Revisi Maksimum */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-750">Jumlah Maksimum Revisi Default</label>
                  <div className="flex border border-slate-200 rounded-xl overflow-hidden focus-within:border-[#005139]">
                    <input 
                      type="number" 
                      value={maxRevisions} 
                      onChange={(e) => setMaxRevisions(Number(e.target.value))}
                      className="w-full px-3.5 py-2 outline-none font-bold text-slate-800 text-sm"
                    />
                    <span className="px-4 py-2 bg-slate-100 border-l border-slate-200 text-slate-500 font-bold text-xs flex items-center">Kali</span>
                  </div>
                  <p className="text-slate-400 text-[10px] font-semibold leading-relaxed mt-1">Batas jumlah revisi default yang diizinkan untuk setiap Quest sebelum salah satu pihak berhak membuka jalur dispute.</p>
                </div>

                {/* Keamanan & Penalti */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4 md:col-span-2">
                  <h4 className="text-xs font-black text-slate-855 flex items-center gap-1.5">
                    <ShieldAlert size={14} className="text-rose-500" /> Threshold Akumulasi Poin Pelanggaran & Sanksi
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-650">Batas Poin untuk Suspend Akun Sementara</label>
                      <div className="flex border border-slate-200 rounded-lg overflow-hidden bg-white">
                        <input 
                          type="number" 
                          value={warnPointsSuspend} 
                          onChange={(e) => setWarnPointsSuspend(Number(e.target.value))}
                          className="w-full px-3 py-1.5 outline-none font-bold text-slate-800 text-xs"
                        />
                        <span className="px-3 py-1.5 bg-slate-100 border-l border-slate-200 text-slate-500 text-[10px] font-bold flex items-center">Poin</span>
                      </div>
                      <p className="text-slate-400 text-[10px] font-semibold leading-relaxed mt-1">Akun pengguna akan dinonaktifkan sementara (suspend) otomatis apabila menyentuh poin pelanggaran ini.</p>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-655">Batas Poin untuk Pemblokiran Permanen (Ban)</label>
                      <div className="flex border border-slate-200 rounded-lg overflow-hidden bg-white">
                        <input 
                          type="number" 
                          value={warnPointsBan} 
                          onChange={(e) => setWarnPointsBan(Number(e.target.value))}
                          className="w-full px-3 py-1.5 outline-none font-bold text-slate-800 text-xs"
                        />
                        <span className="px-3 py-1.5 bg-slate-100 border-l border-slate-200 text-slate-500 text-[10px] font-bold flex items-center">Poin</span>
                      </div>
                      <p className="text-slate-400 text-[10px] font-semibold leading-relaxed mt-1">Akun pengguna akan diblokir permanen otomatis dari sistem jika poin akumulasi melampaui nilai ini.</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ==================== TAB 4: MANAJEMEN ADMIN & AUDIT ==================== */}
          {activeTab === 'Admin' && (
            <div className="space-y-6 animate-in fade-in duration-300">

              {/* ROLE SIMULATOR */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
                  <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                    <Shield size={18} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-base">Simulasikan Hak Akses Admin (Testing Role)</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Ubah identitas simulasi akun Anda saat ini untuk menguji pembatasan izin menu & privasi data.</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-150">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <span className="text-xs font-bold text-slate-700">Role Admin Aktif:</span>
                    <div className="flex flex-wrap gap-2">
                      {['Super Admin', 'CS', 'Finance', 'Moderator'].map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => {
                            setAdminRole(r);
                            localStorage.setItem('adminRole', r);
                            if (window.showToast) {
                              window.showToast(`Role admin disimulasikan sebagai: ${r}`, 'success');
                            }
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                            adminRole === r
                              ? 'bg-[#005139] text-white border-[#005139] shadow-xs'
                              : 'bg-white text-slate-650 hover:bg-slate-100 border-slate-200 shadow-3xs'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold italic">
                    *Mempengaruhi izin navigasi menu samping (Sidebar) & akses data sensitif.
                  </span>
                </div>
              </div>
              
              {/* DAFTAR ADMIN */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-emerald-50 rounded-lg text-[#005139]"><UserPlus size={18} /></div>
                    <h3 className="font-extrabold text-slate-800 text-base">Daftar Pengelola Platform (Admin)</h3>
                  </div>
                  <button 
                    onClick={() => setShowAddAdminModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#005139] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    <Plus size={14} /> Tambah Admin Baru
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-150 text-slate-400 uppercase font-black text-[9px] tracking-wider">
                        <th className="pb-3 pl-2">ID</th>
                        <th className="pb-3">Nama</th>
                        <th className="pb-3">Email</th>
                        <th className="pb-3">Peran / Hak Akses</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right pr-2">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {admins.map(adm => {
                        let roleCol = 'bg-slate-100 text-slate-700';
                        if (adm.role === 'Super Admin') roleCol = 'bg-emerald-100 text-[#005139]';
                        else if (adm.role === 'Finance') roleCol = 'bg-blue-100 text-blue-800';
                        else if (adm.role === 'CS') roleCol = 'bg-purple-100 text-purple-800';
                        else if (adm.role === 'Moderator') roleCol = 'bg-amber-100 text-amber-800';

                        return (
                          <tr key={adm.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-3 pl-2 font-mono text-slate-400 font-bold">{adm.id}</td>
                            <td className="py-3 font-bold text-slate-800">{adm.name}</td>
                            <td className="py-3 font-semibold text-slate-500">{adm.email}</td>
                            <td className="py-3">
                              <span className={`px-2 py-0.5 rounded font-black text-[9px] ${roleCol}`}>
                                {adm.role}
                              </span>
                            </td>
                            <td className="py-3">
                              <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${
                                adm.status === 'Aktif' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                              }`}>
                                {adm.status}
                              </span>
                            </td>
                            <td className="py-3 text-right pr-2 space-x-2">
                              {adm.role !== 'Super Admin' && (
                                <>
                                  <button 
                                    onClick={() => handleToggleAdminStatus(adm.id, adm.name, adm.status)}
                                    className={`text-[10px] font-bold ${
                                      adm.status === 'Aktif' ? 'text-amber-600 hover:text-amber-800' : 'text-emerald-600 hover:text-emerald-800'
                                    }`}
                                  >
                                    {adm.status === 'Aktif' ? 'Suspend' : 'Aktifkan'}
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteAdmin(adm.id, adm.name)}
                                    className="text-rose-500 hover:text-rose-700 text-[10px] font-bold"
                                  >
                                    Hapus
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* AUDIT TRAIL LOGS */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><Clock size={18} /></div>
                    <h3 className="font-extrabold text-slate-800 text-base">Audit Trail (Log Aktivitas Admin)</h3>
                  </div>
                  <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full font-black text-slate-500">Live Updates</span>
                </div>

                <div className="flex flex-col gap-4 overflow-y-auto max-h-[300px] pr-2 scrollbar-none">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="flex gap-3 text-xs leading-relaxed items-start border-l-2 border-slate-200 pl-4 relative">
                      <div className="absolute w-2 h-2 rounded-full bg-slate-300 -left-[5px] top-1.5"></div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-0.5">
                          <p className="font-black text-slate-700">{log.admin} <span className="font-bold text-[9px] text-slate-400">({log.role})</span></p>
                          <span className="text-[9px] font-semibold text-slate-400 shrink-0">{log.time}</span>
                        </div>
                        <p className="text-slate-500 font-medium">{log.activity}</p>
                      </div>
                    </div>
                  ))}
                  {auditLogs.length === 0 && (
                    <p className="text-center py-6 text-slate-400 font-bold">Belum ada log audit trail.</p>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* ==================== TAB 5: NOTIFIKASI & TEMPLATE SYSTEM ==================== */}
          {activeTab === 'Notifikasi' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-6 animate-in fade-in duration-300">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-50 rounded-lg text-[#005139]"><Bell size={18} /></div>
                  <h3 className="font-extrabold text-slate-800 text-base">Konfigurasi Notifikasi & Template Event</h3>
                </div>
                <button 
                  onClick={() => handleSaveSettings('Notifikasi & Template', 'Mengubah preferensi notifikasi otomatis dan memperbarui template pesan event')}
                  className="flex items-center gap-2 px-4 py-2 bg-[#005139] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  <Save size={14}/> Simpan Perubahan
                </button>
              </div>

              {/* Toggles System */}
              <div className="space-y-4 pb-4 border-b border-slate-100">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Notifikasi Otomatis Terkirim</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Quest Selesai */}
                  <div className="flex justify-between items-center p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold text-slate-850">Quest Selesai disetujui</span>
                      <span className="text-[10px] text-slate-400 font-medium">Kirim Push notification ke Adventurer</span>
                    </div>
                    <div onClick={() => setNotifQuestCompleted(!notifQuestCompleted)} className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors duration-300 shrink-0 ${notifQuestCompleted ? 'bg-[#005139]' : 'bg-slate-300'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow transition-transform duration-300 ${notifQuestCompleted ? 'left-[22px]' : 'left-0.5'}`}></div>
                    </div>
                  </div>

                  {/* Dispute Terbuka */}
                  <div className="flex justify-between items-center p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold text-slate-850">Dispute Masuk</span>
                      <span className="text-[10px] text-slate-400 font-medium">Kirim Push/Email notifikasi ke kedua pihak</span>
                    </div>
                    <div onClick={() => setNotifDisputeEntered(!notifDisputeEntered)} className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors duration-300 shrink-0 ${notifDisputeEntered ? 'bg-[#005139]' : 'bg-slate-300'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow transition-transform duration-300 ${notifDisputeEntered ? 'left-[22px]' : 'left-0.5'}`}></div>
                    </div>
                  </div>

                  {/* Penarikan Saldo */}
                  <div className="flex justify-between items-center p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold text-slate-855">Penarikan Saldo diproses</span>
                      <span className="text-[10px] text-slate-400 font-medium">Kirim Email tanda terima transaksi sukses</span>
                    </div>
                    <div onClick={() => setNotifWithdrawProcessed(!notifWithdrawProcessed)} className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors duration-300 shrink-0 ${notifWithdrawProcessed ? 'bg-[#005139]' : 'bg-slate-300'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow transition-transform duration-300 ${notifWithdrawProcessed ? 'left-[22px]' : 'left-0.5'}`}></div>
                    </div>
                  </div>

                  {/* Peringatan KYC */}
                  <div className="flex justify-between items-center p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold text-slate-855">Peringatan / Penolakan KYC</span>
                      <span className="text-[10px] text-slate-400 font-medium">Notifikasi penolakan verifikasi KTP/KTM</span>
                    </div>
                    <div onClick={() => setNotifKycWarning(!notifKycWarning)} className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors duration-300 shrink-0 ${notifKycWarning ? 'bg-[#005139]' : 'bg-slate-300'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow transition-transform duration-300 ${notifKycWarning ? 'left-[22px]' : 'left-0.5'}`}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Templates Forms */}
              <div className="space-y-5">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Template Pesan Notifikasi Sistem</h4>
                
                {/* Event 1: Quest Selesai */}
                <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="text-xs font-black text-[#005139] uppercase">Event: Quest Disetujui Selesai</span>
                    <span className="text-[10px] font-mono text-slate-400">Placeholders: {"{quest_title}, {budget}"}</span>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-600">Judul Notifikasi</label>
                    <input 
                      type="text" 
                      value={tempQuestTitle} 
                      onChange={(e) => setTempQuestTitle(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 bg-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-600">Pesan Push / Email Body</label>
                    <textarea 
                      rows={2}
                      value={tempQuestMsg} 
                      onChange={(e) => setTempQuestMsg(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 bg-white resize-none"
                    />
                  </div>
                </div>

                {/* Event 2: Dispute Masuk */}
                <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="text-xs font-black text-amber-700 uppercase">Event: Penanganan Dispute Terbuka</span>
                    <span className="text-[10px] font-mono text-slate-400">Placeholders: {"{quest_title}, {initiator}"}</span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-600">Judul Notifikasi</label>
                    <input 
                      type="text" 
                      value={tempDisputeTitle} 
                      onChange={(e) => setTempDisputeTitle(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 bg-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-600">Pesan Push / Email Body</label>
                    <textarea 
                      rows={2}
                      value={tempDisputeMsg} 
                      onChange={(e) => setTempDisputeMsg(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 bg-white resize-none"
                    />
                  </div>
                </div>

                {/* Event 3: Peringatan Sanksi */}
                <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="text-xs font-black text-rose-700 uppercase">Event: Sanksi Peringatan Akun</span>
                    <span className="text-[10px] font-mono text-slate-400">Placeholders: {"{reason}, {points}"}</span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-600">Judul Notifikasi</label>
                    <input 
                      type="text" 
                      value={tempSanksiTitle} 
                      onChange={(e) => setTempSanksiTitle(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 bg-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-600">Pesan Push / Email Body</label>
                    <textarea 
                      rows={2}
                      value={tempSanksiMsg} 
                      onChange={(e) => setTempSanksiMsg(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 bg-white resize-none"
                    />
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* WIDGET KANAN: STATUS KESEHATAN PLATFORM & SERVER */}
        <div className="space-y-6">
          
          {/* SERVER METRICS */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-0"></div>
            <h3 className="font-extrabold text-slate-800 text-sm mb-5 relative z-10">Kesehatan Platform</h3>
            
            <div className="space-y-4 relative z-10 text-xs">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-500 mb-0.5">Server Uptime</p>
                  <p className="font-extrabold text-[#005139]">99.98% (AWS Cloud)</p>
                </div>
                <div className="px-2 py-0.5 bg-emerald-100 text-[#005139] rounded font-black text-[9px]">NORMAL</div>
              </div>

              <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-500 mb-0.5">Database Cluster</p>
                  <p className="font-extrabold text-slate-750">PostgreSQL (Primary-Replica)</p>
                </div>
                <CheckCircle size={16} className="text-[#005139]" />
              </div>

              <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-500 mb-0.5">Gateway Transaksi</p>
                  <p className="font-extrabold text-slate-750">Midtrans API Sandbox/Prod</p>
                </div>
                <div className="px-2 py-0.5 bg-[#005139] text-white rounded font-black text-[9px]">CONNECTED</div>
              </div>

              <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-500 mb-0.5">System Security Level</p>
                  <p className="font-extrabold text-slate-750">SSL, WAF & AES-256 Escrow</p>
                </div>
                <Activity size={16} className="text-amber-500" />
              </div>
            </div>
          </div>

          {/* QUICK NOTE */}
          <div className="p-5 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-2xl shadow-md space-y-3 relative overflow-hidden">
            <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-white/5 rounded-full"></div>
            <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Lock size={12} /> Audit & Keamanan
            </h4>
            <p className="text-[11px] text-slate-300 leading-relaxed font-semibold">
              Setiap konfigurasi yang Anda ubah di sini akan langsung direkam ke dalam <strong>Audit Trail</strong> log. Log ini permanen dan tidak dapat dimodifikasi oleh admin lain untuk menjamin transparansi operasional.
            </p>
          </div>

        </div>

      </div>

      {/* ==================== MODAL: ADD ADMIN ==================== */}
      {showAddAdminModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <UserPlus size={18} className="text-[#005139]" />
                <h3 className="font-extrabold text-slate-800 text-sm">Tambah Admin Baru</h3>
              </div>
              <button 
                onClick={() => setShowAddAdminModal(false)}
                className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddAdmin} className="p-5 space-y-4">
              {/* Nama */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-700">Nama Lengkap</label>
                <input 
                  type="text" 
                  required
                  placeholder="Masukkan nama lengkap admin..."
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:border-[#005139]"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-700">Alamat Email Resmi</label>
                <input 
                  type="email" 
                  required
                  placeholder="contoh: nama.admin@sambilan.com"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:border-[#005139]"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-700">Password Sementara</label>
                <input 
                  type="password" 
                  required
                  placeholder="Masukkan password admin..."
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:border-[#005139]"
                />
              </div>

              {/* Peran */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-700">Peran & Hak Akses</label>
                <select 
                  value={newAdminRole}
                  onChange={(e) => setNewAdminRole(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 bg-white outline-none focus:border-[#005139]"
                >
                  <option value="Super Admin">Super Admin (Akses Penuh)</option>
                  <option value="Moderator">Moderator (Quest, Dispute & AI)</option>
                  <option value="CS">Customer Service (Tiket Bantuan & User)</option>
                  <option value="Finance">Finance (Keuangan, Escrow & Withdraw)</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2.5 border-t border-slate-100 pt-4 mt-2">
                <button 
                  type="button"
                  onClick={() => setShowAddAdminModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-500 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-[#005139] hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
                >
                  Simpan Admin
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ==================== POLICY CONFIRMATION MODAL ==================== */}
      {showPolicyConfirmModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200 p-6 space-y-4">
            <div className="flex items-start gap-2.5 text-slate-800">
              <div>
                <h3 className="font-extrabold text-sm text-slate-850">⚠️ Konfirmasi Perubahan Kebijakan</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Perubahan kebijakan operasional akan langsung berdampak pada seluruh transaksi aktif di platform. Pastikan Anda telah memeriksa kembali semua nilai sebelum menyimpan.
                </p>
              </div>
            </div>

            {/* List of changes */}
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-150 space-y-2">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Daftar Perubahan Kebijakan</span>
              <div className="space-y-1.5 text-xs text-slate-700 font-semibold max-h-[150px] overflow-y-auto pr-1">
                {savedPolicies.autoReleaseHours !== autoReleaseHours && (
                  <div className="flex justify-between border-b border-slate-100 pb-1 last:border-0">
                    <span className="text-slate-500">Auto-Release Escrow:</span>
                    <span>{savedPolicies.autoReleaseHours} Jam &rarr; {autoReleaseHours} Jam</span>
                  </div>
                )}
                {savedPolicies.disputeHours !== disputeHours && (
                  <div className="flex justify-between border-b border-slate-100 pb-1 last:border-0">
                    <span className="text-slate-500">Batas Dispute:</span>
                    <span>{savedPolicies.disputeHours} Jam &rarr; {disputeHours} Jam</span>
                  </div>
                )}
                {savedPolicies.maxRevisions !== maxRevisions && (
                  <div className="flex justify-between border-b border-slate-100 pb-1 last:border-0">
                    <span className="text-slate-500">Max Revisi Default:</span>
                    <span>{savedPolicies.maxRevisions} Kali &rarr; {maxRevisions} Kali</span>
                  </div>
                )}
                {savedPolicies.warnPointsSuspend !== warnPointsSuspend && (
                  <div className="flex justify-between border-b border-slate-100 pb-1 last:border-0">
                    <span className="text-slate-500">Batas Suspend Akun:</span>
                    <span>{savedPolicies.warnPointsSuspend} Poin &rarr; {warnPointsSuspend} Poin</span>
                  </div>
                )}
                {savedPolicies.warnPointsBan !== warnPointsBan && (
                  <div className="flex justify-between border-b border-slate-100 pb-1 last:border-0">
                    <span className="text-slate-500">Batas Pemblokiran (Ban):</span>
                    <span>{savedPolicies.warnPointsBan} Poin &rarr; {warnPointsBan} Poin</span>
                  </div>
                )}
                {savedPolicies.autoReleaseHours === autoReleaseHours &&
                 savedPolicies.disputeHours === disputeHours &&
                 savedPolicies.maxRevisions === maxRevisions &&
                 savedPolicies.warnPointsSuspend === warnPointsSuspend &&
                 savedPolicies.warnPointsBan === warnPointsBan && (
                   <p className="text-[11px] text-slate-400 italic text-center py-2">Tidak ada perubahan nilai terdeteksi.</p>
                 )}
              </div>
            </div>

            <div className="flex justify-end gap-2.5 border-t border-slate-100 pt-4 mt-2">
              <button 
                type="button"
                onClick={() => setShowPolicyConfirmModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-500 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors font-sans cursor-pointer"
              >
                Batalkan
              </button>
              <button 
                type="button"
                onClick={confirmSavePolicies}
                className="px-4 py-2 bg-[#005139] hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors shadow-sm font-sans cursor-pointer"
              >
                Simpan Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}