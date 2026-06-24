import { useState, useEffect } from 'react';
import { 
  Users as UsersIcon, 
  ShieldCheck, 
  Clock, 
  ShieldAlert, 
  Download, 
  Star, 
  Search, 
  ShieldX, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  UserCheck, 
  Ban, 
  Lock, 
  Wallet,
  Shield
} from 'lucide-react';

// --- INITIAL MOCK DATA ---

export const initialUsers = [
  {
    id: 'USR-8921',
    name: 'Budi Kusuma',
    email: 'budi.k@email.com',
    phone: '0812-3456-7890',
    joinDate: '12 Okt 2023',
    verificationStatus: 'Terverifikasi',
    accountStatus: 'Aktif',
    initial: 'BK',
    bg: 'bg-[#005139]',
    dob: '24 Oktober 1992',
    address: 'Jl. Dago No. 12, Bandung, Jawa Barat',
    creatorStats: { questsCreated: 24, rating: 4.8 },
    adventurerStats: { questsCompleted: 5, rating: 4.5 },
    balance: 350000,
    transactions: [
      { id: '#TRX-102', date: '22 Jun 2026', type: 'Pencairan Komisi', amount: -150000, status: 'Berhasil' },
      { id: '#TRX-098', date: '18 Jun 2026', type: 'Top Up Dana', amount: 500000, status: 'Berhasil' }
    ],
    sanctions: [
      { date: '10 Jan 2024', type: 'Peringatan', description: 'Deskripsi quest melanggar pedoman kata tidak sopan.' }
    ]
  },
  {
    id: 'USR-7742',
    name: 'Siti Rahma',
    email: 'siti.r@email.com',
    phone: '0856-7890-1234',
    joinDate: '24 Nov 2023',
    verificationStatus: 'Menunggu',
    accountStatus: 'Aktif',
    initial: 'SR',
    bg: 'bg-indigo-500',
    dob: '11 Desember 1995',
    address: 'Jl. Kemang Raya No. 45, Jakarta Selatan, DKI Jakarta',
    creatorStats: { questsCreated: 2, rating: 5.0 },
    adventurerStats: { questsCompleted: 42, rating: 4.9 },
    balance: 120000,
    transactions: [
      { id: '#TRX-204', date: '23 Jun 2026', type: 'Hasil Quest #7701', amount: 45000, status: 'Berhasil' }
    ],
    sanctions: []
  },
  {
    id: 'USR-1109',
    name: 'Agus Wijaya',
    email: 'agus.w@email.com',
    phone: '0813-4567-8901',
    joinDate: '05 Des 2023',
    verificationStatus: 'Gagal',
    accountStatus: 'Suspended',
    initial: 'AW',
    bg: 'bg-red-500',
    dob: '15 Maret 1990',
    address: 'Jl. Soekarno Hatta No. 102, Bandung, Jawa Barat',
    creatorStats: { questsCreated: 2, rating: 3.5 },
    adventurerStats: { questsCompleted: 15, rating: 4.2 },
    balance: 0,
    transactions: [],
    sanctions: [
      { date: '12 Mei 2026', type: 'Suspended', description: 'Pekerjaan dilaporkan tidak selesai 3 kali berturut-turut.' }
    ]
  },
  {
    id: 'USR-4421',
    name: 'Dian Fitriani',
    email: 'dian.f@email.com',
    phone: '0821-9876-5432',
    joinDate: '18 Jan 2024',
    verificationStatus: 'Terverifikasi',
    accountStatus: 'Aktif',
    initial: 'DF',
    bg: 'bg-blue-600',
    dob: '18 Agustus 1998',
    address: 'Jl. Setiabudhi No. 88, Bandung, Jawa Barat',
    creatorStats: { questsCreated: 88, rating: 5.0 },
    adventurerStats: { questsCompleted: 0, rating: 0 },
    balance: 1450000,
    transactions: [
      { id: '#TRX-301', date: '20 Jun 2026', type: 'Pembayaran Quest #8012', amount: -250000, status: 'Berhasil' }
    ],
    sanctions: []
  },
  {
    id: 'USR-2219',
    name: 'Eko Prasetyo',
    email: 'eko.p@email.com',
    phone: '0895-1234-5678',
    joinDate: '01 Feb 2024',
    verificationStatus: 'Terverifikasi',
    accountStatus: 'Aktif',
    initial: 'EP',
    bg: 'bg-amber-500',
    dob: '01 Januari 1996',
    address: 'Jl. Gajah Mada No. 14, Semarang, Jawa Tengah',
    creatorStats: { questsCreated: 1, rating: 4.0 },
    adventurerStats: { questsCompleted: 18, rating: 4.7 },
    balance: 75000,
    transactions: [],
    sanctions: []
  },
  {
    id: 'USR-3312',
    name: 'Fina Amanda',
    email: 'fina.am@email.com',
    phone: 'Belum diisi',
    joinDate: '12 Feb 2024',
    verificationStatus: 'Belum Verifikasi',
    accountStatus: 'Aktif',
    initial: 'FA',
    bg: 'bg-slate-400',
    dob: '-',
    address: '-',
    creatorStats: { questsCreated: 1, rating: 4.5 },
    adventurerStats: { questsCompleted: 0, rating: 0 },
    balance: 0,
    transactions: [],
    sanctions: []
  },
  {
    id: 'USR-5591',
    name: 'Gilang Ramadhan',
    email: 'gilang.r@email.com',
    phone: 'Belum diisi',
    joinDate: '15 Feb 2024',
    verificationStatus: 'Belum Verifikasi',
    accountStatus: 'Banned',
    initial: 'GR',
    bg: 'bg-slate-700',
    dob: '-',
    address: '-',
    creatorStats: { questsCreated: 0, rating: 0 },
    adventurerStats: { questsCompleted: 1, rating: 2.0 },
    balance: 0,
    transactions: [],
    sanctions: [
      { date: '16 Feb 2024', type: 'Banned', description: 'Upaya pemalsuan dokumen verifikasi.' }
    ]
  }
];

export default function Users({ users: propUsers, setUsers: propSetUsers }) {
  const [activeTab, setActiveTab] = useState('daftar'); // 'daftar' or 'verifikasi'
  
  const [localUsers, setLocalUsers] = useState(initialUsers);
  const users = propUsers || localUsers;
  const setUsers = propSetUsers || setLocalUsers;

  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [verificationFilter, setVerificationFilter] = useState('Semua');
  const [accountStatusFilter, setAccountStatusFilter] = useState('Semua');

  // Detail Modal state
  const [selectedUser, setSelectedUser] = useState(null);

  // Destructive confirmation modals state
  const [confirmBanUserId, setConfirmBanUserId] = useState(null);
  const [isKycLogOpen, setIsKycLogOpen] = useState(false);

  // Manual warning input inside Detail modal
  const [isWarningFormOpen, setIsWarningFormOpen] = useState(false);
  const [warningText, setWarningText] = useState('');

  // Notification overlay
  const [toastMsg, setToastMsg] = useState('');

  const triggerToast = (msg, type = 'success') => {
    if (window.showToast) {
      window.showToast(msg, type);
    } else {
      setToastMsg(msg);
      setTimeout(() => setToastMsg(''), 3000);
    }
  };

  // KPI calculations
  const totalCount = users.length;
  const verifiedCount = users.filter(u => u.verificationStatus === 'Terverifikasi').length;
  const pendingCount = users.filter(u => u.verificationStatus === 'Menunggu').length;
  const unverifiedCount = users.filter(u => u.verificationStatus === 'Belum Verifikasi').length;

  // Filter application
  const filteredUsers = users.filter(user => {
    const matchSearch = searchTerm === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchTerm.toLowerCase());

    const matchVerification = verificationFilter === 'Semua' || 
      user.verificationStatus === verificationFilter;

    const matchAccount = accountStatusFilter === 'Semua' || 
      (accountStatusFilter === 'Banned' ? user.accountStatus.includes('Ban') : user.accountStatus === accountStatusFilter);

    return matchSearch && matchVerification && matchAccount;
  });

  // Verification queue list (users waiting KYC, verified, or failed)
  const queueUsers = users.filter(u => u.verificationStatus === 'Menunggu' || u.verificationStatus === 'Terverifikasi' || u.verificationStatus === 'Gagal');
  const [selectedQueueUser, setSelectedQueueUser] = useState(queueUsers[0] || null);
  const queueUserDetail = users.find(u => u.id === selectedQueueUser?.id) || selectedQueueUser;



  // Detail Modal Actions

  const handleSuspendUser = (userId) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { 
          ...u, 
          accountStatus: 'Suspended',
          sanctions: [
            ...u.sanctions,
            { date: '24 Jun 2026', type: 'Suspended', description: 'Akun ditangguhkan sementara oleh admin.' }
          ]
        };
      }
      return u;
    }));
    setSelectedUser(prev => prev ? { 
      ...prev, 
      accountStatus: 'Suspended',
      sanctions: [...prev.sanctions, { date: '24 Jun 2026', type: 'Suspended', description: 'Akun ditangguhkan sementara oleh admin.' }]
    } : null);
    triggerToast('Akun pengguna berhasil disuspend sementara.');
  };

  const handleBanUser = (userId, type = 'Permanen') => {
    const isPermanent = type === 'Permanen';
    const statusText = isPermanent ? 'Banned' : 'Banned Sementara (30 Hari)';
    const descText = isPermanent ? 'Akun diblokir permanen oleh admin.' : 'Akun diblokir sementara (30 Hari) oleh admin.';

    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { 
          ...u, 
          accountStatus: statusText,
          sanctions: [
            ...u.sanctions,
            { date: '24 Jun 2026', type: 'Banned', description: descText }
          ]
        };
      }
      return u;
    }));
    setSelectedUser(prev => prev ? { 
      ...prev, 
      accountStatus: statusText,
      sanctions: [...prev.sanctions, { date: '24 Jun 2026', type: 'Banned', description: descText }]
    } : null);
    triggerToast(isPermanent ? 'Akun pengguna diblokir secara permanen.' : 'Akun pengguna diblokir sementara selama 30 hari.');
  };

  const handleUnbanUser = (userId) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { 
          ...u, 
          accountStatus: 'Aktif',
          sanctions: [
            ...u.sanctions,
            { date: '24 Jun 2026', type: 'Unbanned', description: 'Pemblokiran akun dibatalkan oleh admin.' }
          ]
        };
      }
      return u;
    }));
    setSelectedUser(prev => prev ? { 
      ...prev, 
      accountStatus: 'Aktif',
      sanctions: [...prev.sanctions, { date: '24 Jun 2026', type: 'Unbanned', description: 'Pemblokiran akun dibatalkan oleh admin.' }]
    } : null);
    triggerToast('Akun pengguna berhasil diaktifkan kembali (unban).');
  };

  const handleResetPassword = (name) => {
    alert(`Reset password dikirim! Kata sandi baru sementara untuk ${name} adalah "Sambilan123!"`);
  };

  const handleAddWarning = (userId) => {
    if (!warningText.trim()) return;
    const newWarning = {
      date: '24 Jun 2026',
      type: 'Peringatan',
      description: warningText
    };
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, sanctions: [...u.sanctions, newWarning] };
      }
      return u;
    }));
    setSelectedUser(prev => prev ? { ...prev, sanctions: [...prev.sanctions, newWarning] } : null);
    setWarningText('');
    setIsWarningFormOpen(false);
    triggerToast('Peringatan baru ditambahkan ke log.');
  };

  return (
    <div className="space-y-6">
      
      {/* TOAST NOTIFICATION */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-[100] bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-slate-800 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMsg}</span>
        </div>
      )}

      {/* TITLE & HEADER */}
      <div className="flex justify-between items-end pb-2 border-b border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Manajemen Pengguna</h2>
          <p className="text-sm text-slate-500 mt-1">Kelola data profil, verifikasi KYC, dan audit perilaku akun pengguna.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer">
          <Download size={14} /> Ekspor Data XLS
        </button>
      </div>

      {/* TABS CONTAINER */}
      <div className="flex border-b border-slate-200 gap-6">
        <button 
          onClick={() => setActiveTab('daftar')} 
          className={`pb-3 font-bold text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === 'daftar' ? 'border-[#005139] text-[#005139]' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Daftar Pengguna
        </button>
        <button 
          onClick={() => {
            setActiveTab('verifikasi');
            if (queueUsers.length > 0 && !selectedQueueUser) {
              setSelectedQueueUser(queueUsers[0]);
            }
          }} 
          className={`pb-3 font-bold text-sm border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'verifikasi' ? 'border-[#005139] text-[#005139]' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <span>Manajemen Verifikasi KYC</span>
          {pendingCount > 0 && (
            <span className="px-2 py-0.5 text-[10px] font-black bg-rose-500 text-white rounded-full">
              {pendingCount}
            </span>
          )}
        </button>
      </div>

      {/* VIEW RENDER CONDITIONS */}

      {activeTab === 'daftar' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* 4 KPI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'TOTAL USER TERDAFTAR', val: totalCount, icon: UsersIcon, color: 'text-blue-500 bg-blue-50' },
              { title: 'KYC TERVERIFIKASI', val: verifiedCount, icon: ShieldCheck, color: 'text-[#005139] bg-emerald-50' },
              { title: 'MENUNGGU VERIFIKASI', val: pendingCount, icon: Clock, color: 'text-amber-500 bg-amber-50' },
              { title: 'BELUM SUBMIT KYC', val: unverifiedCount, icon: ShieldX, color: 'text-slate-500 bg-slate-100' }
            ].map((card, i) => (
              <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start mb-3">
                  <div className={`p-2 rounded-lg ${card.color}`}><card.icon size={20} /></div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 tracking-wider mb-0.5">{card.title}</p>
                  <h3 className="text-2xl font-black text-slate-800">{card.val}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* TABLE BASIS DATA */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            
            {/* Table Filters Header */}
            <div className="p-4 border-b border-slate-150 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-800 text-sm">Basis Data Pengguna</h3>
                <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-[#005139] rounded-md font-extrabold border border-emerald-100">
                  {filteredUsers.length} Pengguna ditemukan
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                {/* Search */}
                <div className="relative col-span-1 sm:col-span-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-450" size={14} />
                  <input 
                    type="text" 
                    placeholder="Cari Nama/Email/No. Telp..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className="w-full pl-9 pr-3 py-1.5 border border-slate-250 bg-white rounded-lg text-xs font-semibold outline-none focus:border-[#005139]"
                  />
                </div>

                {/* Filter Verification */}
                <select 
                  value={verificationFilter} 
                  onChange={(e) => setVerificationFilter(e.target.value)} 
                  className="px-3 py-1.5 border border-slate-250 bg-white rounded-lg text-xs font-bold text-slate-600 outline-none focus:border-[#005139]"
                >
                  <option value="Semua">Semua Status KYC</option>
                  <option value="Terverifikasi">Terverifikasi</option>
                  <option value="Menunggu">Menunggu KYC</option>
                  <option value="Belum Verifikasi">Belum Verifikasi</option>
                  <option value="Gagal">Gagal Verifikasi</option>
                </select>

                {/* Filter Account Status */}
                <select 
                  value={accountStatusFilter} 
                  onChange={(e) => setAccountStatusFilter(e.target.value)} 
                  className="px-3 py-1.5 border border-slate-250 bg-white rounded-lg text-xs font-bold text-slate-600 outline-none focus:border-[#005139]"
                >
                  <option value="Semua">Semua Status Akun</option>
                  <option value="Aktif">Aktif</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Banned">Banned</option>
                </select>
              </div>
            </div>

            {/* Table Element */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-650">
                <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Nama Pengguna</th>
                    <th className="px-6 py-4">Kontak</th>
                    <th className="px-6 py-4">Tanggal Daftar</th>
                    <th className="px-6 py-4">Status Verifikasi</th>
                    <th className="px-6 py-4">Status Akun</th>
                    <th className="px-6 py-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-200 shrink-0"></div>
                          <div className="space-y-2 flex-1">
                            <div className="h-3.5 bg-slate-200 rounded w-24"></div>
                            <div className="h-2 bg-slate-200 rounded w-16"></div>
                          </div>
                        </td>
                        <td className="px-6 py-4 space-y-2">
                          <div className="h-3.5 bg-slate-200 rounded w-32"></div>
                          <div className="h-2.5 bg-slate-200 rounded w-20"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-3 bg-slate-200 rounded w-16"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-3 bg-slate-200 rounded w-12"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-5 bg-slate-200 rounded-full w-20"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-5 bg-slate-200 rounded-full w-14"></div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="h-6 bg-slate-200 rounded w-10 mx-auto"></div>
                        </td>
                      </tr>
                    ))
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                          </svg>
                          <span className="font-extrabold text-sm text-slate-500">Tidak ada data ditemukan</span>
                          <button 
                            type="button" 
                            onClick={() => {
                              setSearchTerm('');
                              setVerificationFilter('Semua');
                              setAccountStatusFilter('Semua');
                            }}
                            className="px-3.5 py-1.5 bg-[#005139] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer border-0"
                          >
                            Reset Filter
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-55/40 transition-colors">
                        
                        {/* Name & Initial */}
                        <td className="px-6 py-4 flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full text-white flex items-center justify-center font-bold text-xs shrink-0 ${user.bg}`}>
                            {user.initial}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-800 truncate">{user.name}</p>
                            <span className="text-[10px] text-slate-400 font-mono">{user.id}</span>
                          </div>
                        </td>

                        {/* Email & Phone */}
                        <td className="px-6 py-4">
                          <p className="font-medium text-slate-700">{user.email}</p>
                          <span className="text-xs text-slate-400">{user.phone}</span>
                        </td>

                        {/* Join Date */}
                        <td className="px-6 py-4 text-xs font-semibold text-slate-600">
                          {user.joinDate}
                        </td>

                        {/* KYC Verification Status */}
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold flex w-max items-center gap-1.5 ${
                            user.verificationStatus === 'Terverifikasi' 
                              ? 'text-emerald-700 bg-emerald-100' 
                              : user.verificationStatus === 'Gagal' 
                              ? 'text-red-700 bg-red-100' 
                              : user.verificationStatus === 'Menunggu' 
                              ? 'text-amber-700 bg-amber-100' 
                              : 'text-slate-600 bg-slate-100'
                          }`}>
                            {user.verificationStatus === 'Terverifikasi' ? <ShieldCheck size={12} /> :
                             user.verificationStatus === 'Gagal' ? <ShieldAlert size={12} /> :
                             user.verificationStatus === 'Menunggu' ? <Clock size={12} /> : <ShieldX size={12} />}
                            {user.verificationStatus}
                          </span>
                        </td>

                        {/* Account Status */}
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                            user.accountStatus === 'Aktif'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                              : user.accountStatus === 'Suspended'
                              ? 'bg-amber-50 text-amber-700 border border-amber-100'
                              : 'bg-rose-50 text-rose-700 border border-rose-100'
                          }`}>
                            {user.accountStatus}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-center">
                          <button 
                            onClick={() => setSelectedUser(user)}
                            className="px-3 py-1.5 bg-slate-50 hover:bg-[#005139] hover:text-white rounded-lg text-xs font-bold text-slate-700 transition-colors shadow-2xs border border-slate-200 cursor-pointer"
                          >
                            Buka Detail
                          </button>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: MANAJEMEN VERIFIKASI KYC (SIDE-BY-SIDE VIEW) */}
      {activeTab === 'verifikasi' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
          
          {/* QUEUE LIST PANEL */}
          <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden max-h-[600px]">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-sm">Monitoring Verifikasi KYC</h3>
              <span className="px-2 py-0.5 bg-emerald-100 text-[#005139] text-[10px] font-black rounded-full border border-emerald-200">
                {queueUsers.length} Total
              </span>
            </div>
            
            <div className="overflow-y-auto divide-y divide-slate-100 flex-1">
              {queueUsers.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2 h-full">
                  <CheckCircle2 size={32} className="text-emerald-500 animate-bounce" />
                  <span className="font-bold">Antrian Bersih!</span>
                  <span>Semua verifikasi KYC sudah selesai ditinjau.</span>
                </div>
              ) : (
                queueUsers.map((user) => (
                  <div 
                    key={user.id}
                    onClick={() => {
                      setSelectedQueueUser(user);
                    }}
                    className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${
                      selectedQueueUser?.id === user.id ? 'bg-emerald-50/40 border-l-4 border-[#005139]' : 'hover:bg-slate-55/40'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-full text-white font-bold text-xs flex items-center justify-center shrink-0 ${user.bg}`}>
                        {user.initial}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 text-xs truncate">{user.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{user.id} • {user.joinDate}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                      user.verificationStatus === 'Terverifikasi' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                      user.verificationStatus === 'Gagal' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                      'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}>
                      {user.verificationStatus === 'Terverifikasi' ? 'Terverifikasi' :
                       user.verificationStatus === 'Gagal' ? 'Ditolak' : 'Dalam Proses'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* THIRD-PARTY VERIFICATION PRIVACY COMPLIANT VIEW */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between min-h-[500px]">
            {queueUserDetail ? (
              <div className="space-y-6 flex-1 flex flex-col justify-between">
                
                {/* User KYC Header Info */}
                <div className="border-b border-slate-100 pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-850">{queueUserDetail.name}</h3>
                      <p className="text-xs text-slate-500 mt-1 flex flex-wrap gap-x-2 gap-y-1">
                        <span>ID: <span className="font-semibold text-slate-700">{queueUserDetail.id}</span></span>
                        <span>•</span>
                        <span>Email: <span className="font-semibold text-slate-700">{queueUserDetail.email}</span></span>
                      </p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-bold rounded-lg border flex items-center gap-1.5 ${
                      queueUserDetail.verificationStatus === 'Terverifikasi' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      queueUserDetail.verificationStatus === 'Gagal' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                      'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      <Clock size={12} /> {queueUserDetail.verificationStatus === 'Terverifikasi' ? 'Terverifikasi (Selesai)' :
                                          queueUserDetail.verificationStatus === 'Gagal' ? 'Ditolak' : 'Dalam Proses'}
                    </span>
                  </div>
                </div>

                {/* Privacy Warning Card */}
                <div className="border border-slate-200 bg-slate-50/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4 py-8">
                  <Shield size={32} className="text-slate-400" />
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-800">Dokumen Diproses oleh Sistem Verifikasi Pihak Ketiga</h4>
                    <p className="text-xs text-slate-500 mt-2 max-w-md leading-relaxed font-semibold">
                      Foto selfie dan dokumen identitas pengguna tidak ditampilkan di panel admin untuk menjaga kepatuhan privasi data (UU PDP 2022). Hasil verifikasi dikirim langsung oleh sistem pihak ketiga.
                    </p>
                  </div>
                  
                  {/* Third-party Status Badge */}
                  <div className="pt-2">
                    {queueUserDetail.verificationStatus === 'Terverifikasi' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                        ✓ Identitas Terverifikasi oleh Sistem
                      </span>
                    )}
                    {queueUserDetail.verificationStatus === 'Menunggu' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-50 text-amber-700 border border-amber-200">
                        ⏳ Sedang Diproses Pihak Ketiga
                      </span>
                    )}
                    {queueUserDetail.verificationStatus === 'Gagal' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-50 text-rose-700 border border-rose-200">
                        ✗ Ditolak — Dokumen Tidak Terbaca
                      </span>
                    )}
                  </div>
                </div>

                {/* DATA MONITORING GRID */}
                <div className="border-t border-slate-150 pt-5 space-y-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wide border-b border-slate-200 pb-2">
                      <ShieldCheck size={14} className="text-[#005139]" />
                      <span>Data Monitoring KYC</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Nama Lengkap Pengguna</span>
                        <span className="text-slate-800 block mt-1 font-bold">{queueUserDetail.name}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">ID Pengguna</span>
                        <span className="text-slate-850 block mt-1 font-mono font-bold">{queueUserDetail.id}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Email Akun</span>
                        <span className="text-slate-800 block mt-1 font-semibold">{queueUserDetail.email}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Tanggal Submit Verifikasi</span>
                        <span className="text-slate-600 block mt-1 font-medium">{queueUserDetail.joinDate}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Tanggal Diproses</span>
                        <span className="text-slate-600 block mt-1 font-medium font-sans">
                          {queueUserDetail.verificationStatus === 'Terverifikasi' ? '24 Jun 2026, 09:15 WIB' :
                           queueUserDetail.verificationStatus === 'Gagal' ? '23 Jun 2026, 16:40 WIB' : '24 Jun 2026, 14:28 WIB (Sedang diproses)'}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Status Hasil</span>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black mt-1 ${
                          queueUserDetail.verificationStatus === 'Terverifikasi' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                          queueUserDetail.verificationStatus === 'Gagal' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                          'bg-amber-50 text-amber-700 border border-amber-100'
                        }`}>
                          {queueUserDetail.verificationStatus === 'Terverifikasi' ? 'Terverifikasi' :
                           queueUserDetail.verificationStatus === 'Gagal' ? 'Ditolak' : 'Dalam Proses'}
                        </span>
                      </div>

                      {queueUserDetail.verificationStatus === 'Gagal' && (
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Alasan Penolakan</span>
                          <span className="text-rose-700 block mt-1 font-semibold italic bg-rose-50/50 p-2 rounded border border-rose-100/50">
                            "Dokumen tidak terbaca"
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions for Monitoring */}
                  <div className="flex justify-end gap-2.5">
                    <button
                      onClick={() => setIsKycLogOpen(true)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-250 rounded-xl text-xs font-bold transition-colors cursor-pointer border-0"
                    >
                      Lihat Log Pihak Ketiga
                    </button>

                    {queueUserDetail.verificationStatus === 'Gagal' && (
                      <button
                        onClick={() => {
                          if (window.showToast) {
                            window.showToast(`Notifikasi pengulangan KYC dikirim ulang ke ${queueUserDetail.name}`, 'success');
                          }
                        }}
                        className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-colors cursor-pointer border-0"
                      >
                        Notifikasi Pengguna untuk Mengulang
                      </button>
                    )}
                  </div>
                </div>

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 text-slate-400 py-16 flex-1">
                <Clock size={40} className="text-slate-300 animate-pulse" />
                <span className="font-bold">Tidak ada detail peninjauan terpilih</span>
                <span>Pilih pengguna di antrian kiri untuk mulai meninjau dokumen KYC.</span>
              </div>
            )}
          </div>

        </div>
      )}

      {/* DETAIL USER DRAWER/MODAL POPUP */}
      {selectedUser && (
        <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${
                  selectedUser.verificationStatus === 'Terverifikasi' ? 'bg-emerald-500' : 'bg-amber-500'
                }`} />
                <h3 className="font-bold text-slate-800 text-lg">Kartu Detail Pengguna: {selectedUser.name}</h3>
              </div>
              <button 
                onClick={() => {
                  setSelectedUser(null);
                  setIsWarningFormOpen(false);
                  setWarningText('');
                }}
                className="p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body Scroll Container */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              
              {/* Profile Card */}
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-150">
                <div className="flex flex-col sm:flex-row items-center gap-6 pb-4 border-b border-slate-200">
                  <div className={`w-16 h-16 rounded-full text-white font-extrabold text-2xl flex items-center justify-center ${selectedUser.bg}`}>
                    {selectedUser.initial}
                  </div>
                  <div className="text-center sm:text-left flex-1">
                    <div className="flex flex-col sm:flex-row items-center gap-2 justify-center sm:justify-start">
                      <h4 className="font-bold text-slate-800 text-lg">{selectedUser.name}</h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        selectedUser.accountStatus === 'Aktif'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : selectedUser.accountStatus === 'Suspended'
                          ? 'bg-amber-50 text-amber-700 border border-amber-100'
                          : 'bg-rose-50 text-rose-700 border border-rose-100'
                      }`}>
                        {selectedUser.accountStatus}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono block mt-0.5">ID: {selectedUser.id}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs pt-4">
                  <div>
                    <span className="text-slate-450 block text-[10px] font-bold">EMAIL</span>
                    <span className="font-bold text-slate-750">{selectedUser.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-455 block text-[10px] font-bold">NOMOR TELEPON</span>
                    <span className="font-bold text-slate-750">{selectedUser.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-455 block text-[10px] font-bold">TANGGAL GABUNG</span>
                    <span className="font-bold text-slate-750">{selectedUser.joinDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-455 block text-[10px] font-bold">TANGGAL LAHIR</span>
                    <span className="font-bold text-slate-750">{selectedUser.dob}</span>
                  </div>
                  <div className="col-span-2 md:col-span-4">
                    <span className="text-slate-455 block text-[10px] font-bold">ALAMAT DOMISILI</span>
                    <span className="font-medium text-slate-750 leading-relaxed">{selectedUser.address}</span>
                  </div>
                </div>
              </div>

              {/* Stats & Finance */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* 1. Statistics (Creator & Adventurer) */}
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Creator Stats */}
                  <div className="border border-slate-200 p-4 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-450 tracking-wider">CREATOR STATS</h4>
                      <span className="text-[10px] px-1.5 py-0.5 bg-purple-50 text-purple-700 rounded-full font-bold">Pemberi Quest</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-center bg-slate-50 p-2.5 rounded-lg">
                      <div>
                        <span className="text-[9px] text-slate-450 font-bold block">QUEST DIBUAT</span>
                        <span className="text-lg font-black text-slate-800">{selectedUser.creatorStats.questsCreated}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-450 font-bold block">RATING RATA2</span>
                        <span className="text-lg font-black text-slate-800 flex items-center justify-center gap-1">
                          {selectedUser.creatorStats.questsCreated > 0 ? (
                            <>
                              <Star size={12} className="text-amber-400 fill-amber-400" />
                              {selectedUser.creatorStats.rating}
                            </>
                          ) : '-'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Adventurer Stats */}
                  <div className="border border-slate-200 p-4 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-450 tracking-wider">ADVENTURER STATS</h4>
                      <span className="text-[10px] px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded-full font-bold">Penerima Quest</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-center bg-slate-50 p-2.5 rounded-lg">
                      <div>
                        <span className="text-[9px] text-slate-450 font-bold block">QUEST SELESAI</span>
                        <span className="text-lg font-black text-slate-800">{selectedUser.adventurerStats.questsCompleted}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-450 font-bold block">RATING RATA2</span>
                        <span className="text-lg font-black text-slate-800 flex items-center justify-center gap-1">
                          {selectedUser.adventurerStats.questsCompleted > 0 ? (
                            <>
                              <Star size={12} className="text-amber-400 fill-amber-400" />
                              {selectedUser.adventurerStats.rating}
                            </>
                          ) : '-'}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* 2. Wallet Balance */}
                <div className="md:col-span-1 border border-slate-200 p-4 rounded-xl flex flex-col justify-between bg-slate-50/20">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-450 tracking-wider">DOMPET SALDO USER</h4>
                    <Wallet size={16} className="text-slate-400" />
                  </div>
                  <div className="my-auto py-2">
                    <p className="text-[10px] font-bold text-slate-400">SALDO AKTIF (ESCROW)</p>
                    <h3 className="text-2xl font-black text-[#005139]">Rp {selectedUser.balance.toLocaleString('id-ID')}</h3>
                  </div>
                  <p className="text-[9px] text-slate-400 leading-normal">
                    *Dana aman tersimpan di bank kustodian rekanan Sambilan.
                  </p>
                </div>

              </div>

              {/* Transactions History & Warnings log */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. Transaction history list */}
                <div className="border border-slate-200 rounded-xl overflow-hidden flex flex-col">
                  <div className="p-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-1.5">
                    <h4 className="text-xs font-extrabold text-slate-800 uppercase">Riwayat Transaksi Terakhir</h4>
                  </div>
                  <div className="divide-y divide-slate-100 overflow-y-auto max-h-[160px] text-xs flex-1">
                    {selectedUser.transactions.length === 0 ? (
                      <div className="p-6 text-center text-slate-405">Tidak ada riwayat transaksi.</div>
                    ) : (
                      selectedUser.transactions.map((trx, idx) => (
                        <div key={idx} className="p-3 flex justify-between items-center hover:bg-slate-50/50">
                          <div>
                            <p className="font-bold text-slate-800">{trx.type}</p>
                            <span className="text-[9px] text-slate-400">{trx.date} • ID: {trx.id}</span>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold ${trx.amount > 0 ? 'text-emerald-600' : 'text-slate-800'}`}>
                              {trx.amount > 0 ? '+' : ''}Rp {trx.amount.toLocaleString('id-ID')}
                            </p>
                            <span className="text-[8px] font-extrabold px-1.5 py-0.2 bg-emerald-50 text-emerald-700 rounded-full">{trx.status}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* 2. Warning / Sanction History */}
                <div className="border border-slate-200 rounded-xl overflow-hidden flex flex-col">
                  <div className="p-3.5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <h4 className="text-xs font-extrabold text-slate-800 uppercase">Log Peringatan & Sanksi</h4>
                    <button 
                      onClick={() => setIsWarningFormOpen(true)}
                      className="text-[10px] font-bold text-[#005139] hover:underline cursor-pointer"
                    >
                      + Tambah Peringatan
                    </button>
                  </div>
                  
                  {isWarningFormOpen && (
                    <div className="p-3 bg-slate-55 border-b border-slate-200 space-y-2.5 animate-in slide-in-from-top-2 duration-200">
                      <textarea 
                        rows="2"
                        placeholder="Tulis kronologi pelanggaran..."
                        value={warningText}
                        onChange={(e) => setWarningText(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-200 bg-white rounded-lg text-xs font-medium outline-none focus:border-[#005139]"
                      />
                      <div className="flex gap-2 justify-end">
                        <button 
                          onClick={() => handleAddWarning(selectedUser.id)}
                          className="px-2.5 py-1.5 bg-[#005139] text-white text-[10px] font-bold rounded-lg cursor-pointer hover:bg-emerald-800 transition-colors"
                        >
                          Simpan
                        </button>
                        <button 
                          onClick={() => {
                            setIsWarningFormOpen(false);
                            setWarningText('');
                          }}
                          className="px-2.5 py-1.5 bg-slate-200 text-slate-700 text-[10px] font-bold rounded-lg cursor-pointer"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="divide-y divide-slate-100 overflow-y-auto max-h-[160px] text-xs flex-1">
                    {selectedUser.sanctions.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 italic">User ini memiliki rekam jejak bersih (tidak ada sanksi).</div>
                    ) : (
                      selectedUser.sanctions.map((sanc, idx) => (
                        <div key={idx} className="p-3 hover:bg-slate-50/50">
                          <div className="flex justify-between items-center mb-1">
                            <span className="px-2 py-0.5 rounded text-[8px] font-extrabold bg-rose-50 text-rose-700 border border-rose-100">
                              {sanc.type}
                            </span>
                            <span className="text-[9px] text-slate-400">{sanc.date}</span>
                          </div>
                          <p className="text-slate-650 leading-relaxed text-[11px]">{sanc.description}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-wrap gap-2.5 justify-end shrink-0">
              


              <button 
                onClick={() => handleResetPassword(selectedUser.name)}
                className="px-3.5 py-2 bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all flex items-center gap-1 cursor-pointer"
              >
                <Lock size={14} /> Reset Password
              </button>

              {selectedUser.accountStatus !== 'Aktif' && (
                <button 
                  onClick={() => handleUnbanUser(selectedUser.id)}
                  className="px-3.5 py-2 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-all flex items-center gap-1 cursor-pointer animate-in fade-in duration-200"
                >
                  <UserCheck size={14} /> Aktifkan Kembali Akun (Unban)
                </button>
              )}

              {selectedUser.accountStatus === 'Aktif' && (
                <button 
                  onClick={() => handleSuspendUser(selectedUser.id)}
                  className="px-3.5 py-2 bg-amber-50 text-amber-700 border border-amber-100 rounded-xl text-xs font-bold hover:bg-amber-100 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <ShieldAlert size={14} /> Suspend Akun
                </button>
              )}

              {!selectedUser.accountStatus.includes('Ban') && !selectedUser.accountStatus.includes('Banned') && (
                <button 
                  onClick={() => setConfirmBanUserId(selectedUser.id)}
                  className="px-3.5 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Ban size={14} /> Blokir Akun (Ban)
                </button>
              )}

            </div>

          </div>
        </div>
      )}

      {/* BAN CONFIRMATION MODAL */}
      {confirmBanUserId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-sm w-full overflow-hidden animate-in zoom-in-95 duration-200 p-6 space-y-4 text-center">
            <div className="mx-auto w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center">
              <Ban size={24} />
            </div>
            <h3 className="font-extrabold text-slate-800 text-base">⚠️ Konfirmasi Blokir Pengguna</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pilih jenis pemblokiran untuk akun pengguna ini. Pemblokiran akan langsung memutus akses mereka ke sistem.
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <button 
                type="button"
                onClick={() => {
                  handleBanUser(confirmBanUserId, 'Sementara');
                  setConfirmBanUserId(null);
                }}
                className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-100 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Clock size={14} /> Ban Sementara (30 Hari)
              </button>
              <button 
                type="button"
                onClick={() => {
                  handleBanUser(confirmBanUserId, 'Permanen');
                  setConfirmBanUserId(null);
                }}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 border-0"
              >
                <Ban size={14} /> Ban Permanen (Selamanya)
              </button>
              <button 
                type="button"
                onClick={() => {
                  setConfirmBanUserId(null);
                  triggerToast('Aksi dibatalkan', 'error');
                }}
                className="w-full py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl text-xs font-bold transition-colors cursor-pointer border-0 bg-white"
              >
                Batalkan
              </button>
            </div>
          </div>
        </div>
      )}



      {/* THIRD PARTY LOG MODAL */}
      {isKycLogOpen && queueUserDetail && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200 p-6 space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <span className="font-bold text-slate-350">⚡ API Response Log (Third Party)</span>
              <button 
                onClick={() => setIsKycLogOpen(false)}
                className="p-1 text-slate-500 hover:text-slate-300 rounded hover:bg-slate-800 cursor-pointer border-0 bg-transparent"
              >
                <X size={16} />
              </button>
            </div>
            
            <pre className="bg-slate-950 p-4 rounded-lg overflow-x-auto text-[10px] text-emerald-400 leading-relaxed border border-slate-800">
{JSON.stringify({
  "timestamp": queueUserDetail.verificationStatus === 'Terverifikasi' ? "2026-06-24T02:15:00.312Z" : "2026-06-23T09:40:12.883Z",
  "api_response_code": queueUserDetail.verificationStatus === 'Gagal' ? 422 : 200,
  "provider": queueUserDetail.verificationStatus === 'Terverifikasi' ? "Verihubs Identity Verification" : "PrivyID OCR Engine",
  "transaction_id": `tx_kyc_${queueUserDetail.id.toLowerCase()}`,
  "liveness_check": {
    "status": queueUserDetail.verificationStatus === 'Gagal' ? "FAILED" : "PASSED",
    "score": queueUserDetail.verificationStatus === 'Gagal' ? 0.421 : 0.984
  },
  "ocr_recognition": {
    "status": queueUserDetail.verificationStatus === 'Gagal' ? "FAILED" : "SUCCESS",
    "details": queueUserDetail.verificationStatus === 'Gagal' ? "BLURRY_OR_LOW_CONTRAST" : "VERIFIED_OK"
  }
}, null, 2)}
            </pre>
            
            <div className="flex justify-end pt-2">
              <button 
                onClick={() => setIsKycLogOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-350 hover:text-white rounded-xl text-xs font-bold transition-colors cursor-pointer border-0 font-sans"
              >
                Tutup Log
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}