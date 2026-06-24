import { useState } from 'react';
import { 
  Users, 
  ClipboardList, 
  Banknote, 
  TrendingUp, 
  Bot, 
  AlertTriangle, 
  ShieldAlert, 
  X, 
  ArrowRight, 
  Eye, 
  CreditCard, 
  Wallet,
  UserPlus, 
  PlusCircle, 
  CheckCircle,
  HelpCircle,
  Clock
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell
} from 'recharts';

// --- DATASETS FOR CHARTS ---

const newUsersData = {
  hari: [
    { name: 'Sen', pengguna: 42 },
    { name: 'Sel', pengguna: 58 },
    { name: 'Rab', pengguna: 65 },
    { name: 'Kam', pengguna: 72 },
    { name: 'Jum', pengguna: 88 },
    { name: 'Sab', pengguna: 110 },
    { name: 'Min', pengguna: 95 },
  ],
  minggu: [
    { name: 'Minggu 1', pengguna: 320 },
    { name: 'Minggu 2', pengguna: 410 },
    { name: 'Minggu 3', pengguna: 390 },
    { name: 'Minggu 4', pengguna: 512 },
  ],
  bulan: [
    { name: 'Jan', pengguna: 1150 },
    { name: 'Feb', pengguna: 1320 },
    { name: 'Mar', pengguna: 1480 },
    { name: 'Apr', pengguna: 1750 },
    { name: 'Mei', pengguna: 2100 },
    { name: 'Jun', pengguna: 2450 },
  ],
};

const questCompareData = {
  minggu: [
    { name: 'Sen', dibuat: 35, selesai: 20 },
    { name: 'Sel', dibuat: 55, selesai: 35 },
    { name: 'Rab', dibuat: 28, selesai: 15 },
    { name: 'Kam', dibuat: 75, selesai: 40 },
    { name: 'Jum', dibuat: 48, selesai: 50 },
    { name: 'Sab', dibuat: 90, selesai: 65 },
    { name: 'Min', dibuat: 40, selesai: 25 },
  ],
  bulan: [
    { name: 'Jan', dibuat: 380, selesai: 310 },
    { name: 'Feb', dibuat: 450, selesai: 390 },
    { name: 'Mar', dibuat: 410, selesai: 380 },
    { name: 'Apr', dibuat: 520, selesai: 460 },
    { name: 'Mei', dibuat: 600, selesai: 530 },
    { name: 'Jun', dibuat: 680, selesai: 590 },
  ],
};

const transactionVolumeData = {
  minggu: [
    { name: 'Sen', volume: 12500000 },
    { name: 'Sel', volume: 18200000 },
    { name: 'Rab', volume: 14900000 },
    { name: 'Kam', volume: 22400000 },
    { name: 'Jum', volume: 19800000 },
    { name: 'Sab', volume: 31500000 },
    { name: 'Min', volume: 24500000 },
  ],
  bulan: [
    { name: 'Jan', volume: 380000000 },
    { name: 'Feb', volume: 440000000 },
    { name: 'Mar', volume: 410000000 },
    { name: 'Apr', volume: 530000000 },
    { name: 'Mei', volume: 590000000 },
    { name: 'Jun', volume: 680000000 },
  ],
};

const popularCategoriesData = [
  { name: 'Kurir & Logistik', value: 420, color: '#005139' },
  { name: 'Jasa Bersih-bersih', value: 310, color: '#10b981' },
  { name: 'Belanja & Titip', value: 250, color: '#3b82f6' },
  { name: 'Bantuan IT & Desain', value: 180, color: '#f59e0b' },
  { name: 'Lain-lain', value: 95, color: '#6366f1' },
];

// --- INITIAL DATA FOR ACTIVITY FEED ---

const initialActivities = [
  {
    id: 'ACT-001',
    type: 'ai_alert',
    message: "AI mendeteksi percakapan mencurigakan: indikasi penipuan transaksi luar sistem",
    user: 'AI Guardian',
    time: '2 menit yang lalu',
    status: 'Perlu Tinjauan',
    detail: {
      questId: '#Q-8812',
      sender: 'Rian H.',
      receiver: 'Siti A.',
      context: 'Rian: "Bisa kirim no WA kak? Kita transaksi langsung di luar aplikasi aja biar ga dipotong admin."\nSiti: "Aduh, maaf kak, nanti akun saya bisa di-suspend sistem."',
      riskLevel: 'Tinggi',
    }
  },
  {
    id: 'ACT-003',
    type: 'dispute',
    message: 'Dispute baru masuk: Pekerjaan Quest #7721 diklaim tidak lengkap',
    user: 'Dimas Anggara',
    time: '34 menit yang lalu',
    status: 'Terbuka',
    detail: {
      questId: '#Q-7721',
      title: 'Antar berkas fisik ke Sudirman Office',
      complaint: 'Pekerja mengantarkan dokumen dengan amplop basah robek, dan ada lembaran berkas penting yang hilang di jalan.',
      reportedBy: 'Dimas Anggara (Pemberi Tugas)',
      worker: 'Agus Santoso (Pekerja)',
    }
  },
  {
    id: 'ACT-004',
    type: 'quest_publish',
    message: "Quest baru dipublikasikan: 'Jasa Bersih Kamar Kos Bulanan'",
    user: 'Lina Marlina',
    time: '1 jam yang lalu',
    status: 'Aktif',
    detail: {
      title: 'Jasa Bersih Kamar Kos Bulanan',
      budget: 'Rp 150.000',
      location: 'Kec. Pabuaran, Bogor',
      category: 'Jasa Bersih-bersih',
    }
  },
  {
    id: 'ACT-005',
    type: 'user_register',
    message: 'Pengguna baru terdaftar: Budi Santoso (Verifikasi KYC Berhasil)',
    user: 'Budi Santoso',
    time: '2 jam yang lalu',
    status: 'Terverifikasi',
    detail: {
      fullName: 'Budi Santoso',
      email: 'budi.santoso@email.com',
      role: 'Pekerja (Worker)',
      joinDate: '24 Jun 2026',
    }
  },
  {
    id: 'ACT-006',
    type: 'quest_publish',
    message: "Quest baru dipublikasikan: 'Antar Belanjaan Pasar Subuh'",
    user: 'Fahmi Reza',
    time: '3 jam yang lalu',
    status: 'Aktif',
    detail: {
      title: 'Antar Belanjaan Pasar Subuh',
      budget: 'Rp 45.000',
      location: 'Tanah Abang, Jakarta Pusat',
      category: 'Kurir & Logistik',
    }
  },
  {
    id: 'ACT-007',
    type: 'ai_alert',
    message: "AI mendeteksi kata-kata tidak sopan dalam deskripsi Quest #9012",
    user: 'AI Guardian',
    time: '4 jam yang lalu',
    status: 'Tindakan Diambil',
    detail: {
      questId: '#Q-9012',
      title: 'Bantu beresin barang bekas [sensor]',
      budget: 'Rp 30.000',
      riskLevel: 'Sedang',
    }
  }
];

export default function DashboardHome({ setActiveMenu }) {
  // Chart toggles state
  const [newUsersTimeframe, setNewUsersTimeframe] = useState('hari');
  const [questCompareTimeframe, setQuestCompareTimeframe] = useState('minggu');
  const [transactionTimeframe, setTransactionTimeframe] = useState('minggu');

  // Feed states
  const [activities, setActivities] = useState(initialActivities);
  const [feedFilter, setFeedFilter] = useState('semua');
  const [selectedActivity, setSelectedActivity] = useState(null);

  // Helper formats
  const formatRupiah = (val) => {
    if (val >= 1e6) return `Rp ${(val / 1e6).toFixed(1)} Jt`;
    if (val >= 1e3) return `Rp ${(val / 1e3).toFixed(0)} Rb`;
    return `Rp ${val}`;
  };

  // Filter logic
  const filteredActivities = (feedFilter === 'semua'
    ? activities
    : activities.filter(act => act.type === feedFilter)
  ).filter(act => act.type !== 'withdrawal');

  // Handle action buttons inside modal
  const handleResolveActivity = (id, newStatus = 'Tuntas') => {
    setActivities(prev => prev.map(act => act.id === id ? { ...act, status: newStatus } : act));
    setSelectedActivity(null);
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-2 border-b border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Beranda Admin</h2>
          <p className="text-sm text-slate-500 mt-1">Ringkasan kondisi platform Sambilan secara real-time</p>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0 px-3 py-1.5 bg-emerald-50/50 rounded-lg text-xs font-bold text-[#005139] border border-emerald-100">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
          <span>Feed Sistem Aktif</span>
        </div>
      </div>

      {/* 5 KPI METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        
        {/* Card 1: Total Pengguna Aktif Hari Ini */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">PENGGUNA AKTIF HARI INI</p>
              <h3 className="text-2xl font-black text-slate-800 mt-1">1,842</h3>
            </div>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Users size={18} />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
            <span className="text-emerald-600 font-bold flex items-center"><TrendingUp size={12} className="mr-0.5" /> +8.2%</span> dari kemarin
          </p>
        </div>

        {/* Card 2: Total Quest Aktif / Dalam Proses */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">QUEST AKTIF / PROSES</p>
              <h3 className="text-2xl font-black text-slate-800 mt-1">312</h3>
            </div>
            <div className="p-2 bg-emerald-50 text-[#005139] rounded-lg">
              <ClipboardList size={18} />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 font-medium">
            245 berjalan, 67 pencarian
          </p>
        </div>

        {/* Card 3: Total Transaksi Hari Ini */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">TRANSAKSI HARI INI</p>
              <h3 className="text-xl font-black text-slate-800 mt-1.5">Rp 24.5M</h3>
            </div>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <CreditCard size={18} />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 font-medium">
            Dari 180 total transaksi sukses
          </p>
        </div>

        {/* Card 4: Total Dispute Belum Selesai */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">DISPUTE BELUM SELESAI</p>
              <h3 className="text-2xl font-black text-slate-800 mt-1">7</h3>
            </div>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <ShieldAlert size={18} />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 flex items-center gap-1 font-semibold text-rose-600">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span> 4 Butuh Mediasi Segera
          </p>
        </div>

        {/* Card 5: Pendapatan Platform (Komisi) Hari Ini */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">KOMISI PLATFORM HARI INI</p>
              <h3 className="text-xl font-black text-slate-800 mt-1.5">Rp 2.45M</h3>
            </div>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Banknote size={18} />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
            <span className="text-emerald-600 font-bold flex items-center"><TrendingUp size={12} className="mr-0.5" /> +12.4%</span> dari target harian
          </p>
        </div>

      </div>

      {/* CHARTS GRID SECTION */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Chart 1: Grafik Pengguna Baru */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[320px]">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Pengguna Baru</h3>
              <p className="text-[11px] text-slate-500">Jumlah pendaftaran akun baru di platform Sambilan</p>
            </div>
            <div className="flex gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
              <button 
                onClick={() => setNewUsersTimeframe('hari')} 
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${newUsersTimeframe === 'hari' ? 'bg-white shadow-sm text-slate-800 font-bold' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Hari
              </button>
              <button 
                onClick={() => setNewUsersTimeframe('minggu')} 
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${newUsersTimeframe === 'minggu' ? 'bg-white shadow-sm text-slate-800 font-bold' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Minggu
              </button>
              <button 
                onClick={() => setNewUsersTimeframe('bulan')} 
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${newUsersTimeframe === 'bulan' ? 'bg-white shadow-sm text-slate-800 font-bold' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Bulan
              </button>
            </div>
          </div>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={newUsersData[newUsersTimeframe]} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorNewUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#005139" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#005139" stopOpacity={0.01}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Area type="monotone" dataKey="pengguna" name="Pengguna Baru" stroke="#005139" strokeWidth={2} fillOpacity={1} fill="url(#colorNewUsers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Grafik Quest Dibuat vs Quest Selesai */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[320px]">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Quest Dibuat vs Quest Selesai</h3>
              <p className="text-[11px] text-slate-500">Perbandingan jumlah postingan quest dan penyelesaiannya</p>
            </div>
            <div className="flex gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
              <button 
                onClick={() => setQuestCompareTimeframe('minggu')} 
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${questCompareTimeframe === 'minggu' ? 'bg-white shadow-sm text-slate-800 font-bold' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Minggu
              </button>
              <button 
                onClick={() => setQuestCompareTimeframe('bulan')} 
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${questCompareTimeframe === 'bulan' ? 'bg-white shadow-sm text-slate-800 font-bold' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Bulan
              </button>
            </div>
          </div>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={questCompareData[questCompareTimeframe]} barGap={4} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="dibuat" name="Dibuat" fill="#005139" radius={[3, 3, 0, 0]} barSize={questCompareTimeframe === 'minggu' ? 14 : 24} />
                <Bar dataKey="selesai" name="Selesai" fill="#a7f3d0" radius={[3, 3, 0, 0]} barSize={questCompareTimeframe === 'minggu' ? 14 : 24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Grafik Volume Transaksi */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[320px]">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Volume Transaksi</h3>
              <p className="text-[11px] text-slate-500">Nilai perputaran uang dan dana escrow dalam Rupiah</p>
            </div>
            <div className="flex gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
              <button 
                onClick={() => setTransactionTimeframe('minggu')} 
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${transactionTimeframe === 'minggu' ? 'bg-white shadow-sm text-slate-800 font-bold' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Minggu
              </button>
              <button 
                onClick={() => setTransactionTimeframe('bulan')} 
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${transactionTimeframe === 'bulan' ? 'bg-white shadow-sm text-slate-800 font-bold' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Bulan
              </button>
            </div>
          </div>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={transactionVolumeData[transactionTimeframe]} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.01}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 10}}
                  tickFormatter={formatRupiah}
                />
                <Tooltip 
                  formatter={(value) => [formatRupiah(value), 'Volume']}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                />
                <Area type="monotone" dataKey="volume" name="Volume Transaksi" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorVolume)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Kategori Quest Terpopuler */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[320px]">
          <div className="mb-4">
            <h3 className="font-bold text-slate-800 text-sm">Kategori Quest Terpopuler</h3>
            <p className="text-[11px] text-slate-500">Distribusi postingan berdasarkan kategori tugas</p>
          </div>
          <div className="flex-1 flex items-center justify-between min-h-0 gap-2">
            <div className="w-[55%] h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={popularCategoriesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {popularCategoriesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} Quest`, 'Total']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="w-[45%] space-y-2 pr-2 overflow-y-auto max-h-full">
              {popularCategoriesData.map((entry, index) => {
                const total = popularCategoriesData.reduce((acc, curr) => acc + curr.value, 0);
                const pct = ((entry.value / total) * 100).toFixed(0);
                return (
                  <div key={index} className="flex flex-col text-[11px] font-medium border-b border-slate-50 pb-1.5 last:border-0 last:pb-0">
                    <div className="flex items-center gap-1.5 justify-between">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                        <span className="text-slate-600 truncate">{entry.name}</span>
                      </div>
                      <span className="text-slate-800 font-bold shrink-0">{pct}%</span>
                    </div>
                    <span className="text-[9px] text-slate-400 ml-4 font-normal">{entry.value} Quest diposting</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* FEED AKTIVITAS TERBARU (LIVE FEED) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        
        {/* Feed Header */}
        <div className="p-5 border-b border-slate-100 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-800 text-base">Feed Aktivitas Terbaru</h3>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Pantau transaksi, pengguna, dispute, dan peringatan sistem secara real-time</p>
          </div>
          
          {/* Feed Filter Buttons */}
          <div className="flex flex-wrap gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs font-semibold shadow-2xs">
            {[
              { id: 'semua', label: 'Semua' },
              { id: 'user_register', label: 'Pengguna' },
              { id: 'quest_publish', label: 'Quest Baru' },
              { id: 'dispute', label: 'Dispute' },
              { id: 'ai_alert', label: 'Alert AI' }
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setFeedFilter(btn.id)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  feedFilter === btn.id
                    ? 'bg-[#005139] text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Feed List Items */}
        <div className="divide-y divide-slate-100">
          {filteredActivities.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm flex flex-col items-center justify-center gap-2">
              <Clock size={32} className="text-slate-300 animate-pulse" />
              <span>Tidak ada aktivitas terbaru dalam filter ini</span>
            </div>
          ) : (
            filteredActivities.map((act) => {
              // Icon & color mapping
              let Icon = HelpCircle;
              let bgClass = 'bg-slate-50 text-slate-500';
              let badgeLabel = 'Sistem';
              let badgeColor = 'bg-slate-100 text-slate-700';

              if (act.type === 'user_register') {
                Icon = UserPlus;
                bgClass = 'bg-blue-50 text-blue-600';
                badgeLabel = 'Pengguna Baru';
                badgeColor = 'bg-blue-50 text-blue-700 border border-blue-100';
              } else if (act.type === 'quest_publish') {
                Icon = PlusCircle;
                bgClass = 'bg-emerald-50 text-[#005139]';
                badgeLabel = 'Quest';
                badgeColor = 'bg-emerald-50 text-[#005139] border border-emerald-100';
              } else if (act.type === 'dispute') {
                Icon = AlertTriangle;
                bgClass = 'bg-rose-50 text-rose-600';
                badgeLabel = 'Dispute';
                badgeColor = 'bg-rose-50 text-rose-700 border border-rose-100';
              } else if (act.type === 'withdrawal') {
                Icon = Wallet;
                bgClass = 'bg-amber-50 text-amber-600';
                badgeLabel = 'Penarikan';
                badgeColor = 'bg-amber-50 text-amber-700 border border-amber-100';
              } else if (act.type === 'ai_alert') {
                Icon = Bot;
                bgClass = 'bg-purple-50 text-purple-600';
                badgeLabel = 'Alert AI';
                badgeColor = 'bg-purple-50 text-purple-700 border border-purple-100';
              }

              return (
                <div key={act.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-3.5 min-w-0 flex-1 mr-4">
                    <div className={`p-2.5 rounded-xl shrink-0 ${bgClass}`}>
                      <Icon size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-700 leading-snug line-clamp-1 sm:line-clamp-none">{act.message}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                          <Clock size={11} /> {act.time}
                        </span>
                        <span className="text-[10px] text-slate-300">•</span>
                        <span className="text-[10px] text-slate-400">Oleh: <span className="font-semibold text-slate-600">{act.user}</span></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${badgeColor}`}>
                      {badgeLabel}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      act.status === 'Tuntas' || act.status === 'Terverifikasi' || act.status === 'Tindakan Diambil'
                        ? 'bg-emerald-100 text-emerald-700'
                        : act.status === 'Menunggu' || act.status === 'Terbuka' || act.status === 'Perlu Tinjauan'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {act.status}
                    </span>
                    <button 
                      onClick={() => setSelectedActivity(act)}
                      className="p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
                      title="Tinjau Aktivitas"
                    >
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

      {/* DETAILED ACTION MODAL POPUP */}
      {selectedActivity && (
        <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className={`p-1.5 rounded-lg text-xs font-bold ${
                  selectedActivity.type === 'ai_alert' ? 'bg-purple-100 text-purple-700' :
                  selectedActivity.type === 'dispute' ? 'bg-rose-100 text-rose-700' :
                  selectedActivity.type === 'withdrawal' ? 'bg-amber-100 text-amber-700' :
                  selectedActivity.type === 'quest_publish' ? 'bg-emerald-100 text-[#005139]' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {selectedActivity.id}
                </span>
                <h3 className="font-bold text-slate-800 text-lg">Tinjauan Detail</h3>
              </div>
              <button 
                onClick={() => setSelectedActivity(null)}
                className="p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content depending on Activity Type */}
            <div className="p-6 space-y-4">
              
              {/* Type: AI Alert Detail */}
              {selectedActivity.type === 'ai_alert' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400 font-medium">Log Sistem:</span>
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-black rounded-md flex items-center gap-1">
                      <ShieldAlert size={12} /> Resiko {selectedActivity.detail.riskLevel}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">{selectedActivity.message}</h4>
                  
                  <div className="bg-slate-900 text-slate-300 p-4 rounded-xl font-mono text-xs space-y-2 border border-slate-800 overflow-x-auto">
                    <p className="text-slate-500">// Obrolan Quest {selectedActivity.detail.questId}</p>
                    <p className="text-slate-400">{selectedActivity.detail.sender} vs {selectedActivity.detail.receiver}</p>
                    <div className="border-t border-slate-800 my-2 pt-2 space-y-1">
                      {selectedActivity.detail.context.split('\n').map((line, idx) => (
                        <p key={idx} className={line.includes('Rian:') ? 'text-amber-400 font-medium' : 'text-slate-300'}>
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button 
                      onClick={() => handleResolveActivity(selectedActivity.id, 'Tindakan Diambil')}
                      className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors cursor-pointer"
                    >
                      Tangguhkan Quest & User
                    </button>
                    <button 
                      onClick={() => handleResolveActivity(selectedActivity.id, 'Tuntas')}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Tandai Aman / Abaikan
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      setActiveMenu('Manajemen AI & Moderasi');
                      setSelectedActivity(null);
                    }}
                    className="w-full py-2 bg-purple-50 text-purple-700 rounded-xl text-xs font-bold hover:bg-purple-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Buka Panel Manajemen AI & Moderasi <ArrowRight size={14} />
                  </button>
                </div>
              )}

              {/* Type: Withdrawal Balance Detail */}
              {selectedActivity.type === 'withdrawal' && (
                <div className="space-y-3">
                  <span className="text-xs text-slate-400 font-medium">Informasi Transfer Rekening:</span>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-2.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Nama Penerima:</span>
                      <span className="font-bold text-slate-800">{selectedActivity.detail.accountName}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Tujuan Bank:</span>
                      <span className="font-bold text-slate-800">{selectedActivity.detail.bankName}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Nomor Rekening:</span>
                      <span className="font-mono font-bold text-slate-800">{selectedActivity.detail.accountNumber}</span>
                    </div>
                    <div className="border-t border-slate-200 pt-2 flex justify-between items-center">
                      <span className="text-xs text-slate-500 font-bold">Total Penarikan:</span>
                      <span className="text-base font-extrabold text-[#005139]">{selectedActivity.detail.amount}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button 
                      onClick={() => handleResolveActivity(selectedActivity.id, 'Tuntas')}
                      className="px-4 py-2 bg-[#005139] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Setujui & Proses Transfer
                    </button>
                    <button 
                      onClick={() => handleResolveActivity(selectedActivity.id, 'Ditolak')}
                      className="px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Tolak Penarikan
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      setActiveMenu('Manajemen Keuangan');
                      setSelectedActivity(null);
                    }}
                    className="w-full py-2 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Buka Panel Manajemen Keuangan <ArrowRight size={14} />
                  </button>
                </div>
              )}

              {/* Type: Dispute Detail */}
              {selectedActivity.type === 'dispute' && (
                <div className="space-y-3">
                  <span className="text-xs text-slate-400 font-medium">Laporan Perselisihan (Dispute):</span>
                  <div className="space-y-2 bg-rose-50/50 p-4 rounded-xl border border-rose-100 text-xs">
                    <div>
                      <span className="text-slate-500 block font-medium">Judul Quest Terkait:</span>
                      <span className="font-bold text-slate-800 text-sm block mt-0.5">{selectedActivity.detail.title} (ID: {selectedActivity.detail.questId})</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 my-2 pt-1 border-t border-rose-100/50">
                      <div>
                        <span className="text-slate-400 block font-normal text-[10px]">Pelapor:</span>
                        <span className="font-semibold text-slate-700 block truncate">{selectedActivity.detail.reportedBy}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-normal text-[10px]">Pekerja:</span>
                        <span className="font-semibold text-slate-700 block truncate">{selectedActivity.detail.worker}</span>
                      </div>
                    </div>
                    <div className="border-t border-rose-100/50 pt-2">
                      <span className="text-slate-500 font-bold block">Isi Keluhan / Kronologi:</span>
                      <p className="text-slate-700 mt-1 italic leading-relaxed">"{selectedActivity.detail.complaint}"</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button 
                      onClick={() => {
                        setActiveMenu('Manajemen Dispute');
                        setSelectedActivity(null);
                      }}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      Buka Manajemen Dispute <ArrowRight size={12} />
                    </button>
                    <button 
                      onClick={() => handleResolveActivity(selectedActivity.id, 'Tuntas')}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Tandai Tuntas Mediasi
                    </button>
                  </div>
                </div>
              )}

              {/* Type: Quest Publish Detail */}
              {selectedActivity.type === 'quest_publish' && (
                <div className="space-y-3">
                  <span className="text-xs text-slate-400 font-medium">Informasi Quest Dipublikasi:</span>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-2">
                    <div className="text-xs">
                      <span className="text-slate-500">Judul Quest:</span>
                      <p className="font-bold text-slate-800 text-sm mt-0.5">{selectedActivity.detail.title}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200/60">
                      <div>
                        <span className="text-slate-500">Budget Penawaran:</span>
                        <p className="font-extrabold text-[#005139] mt-0.5">{selectedActivity.detail.budget}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Kategori:</span>
                        <p className="font-semibold text-slate-700 mt-0.5">{selectedActivity.detail.category}</p>
                      </div>
                    </div>
                    <div className="text-xs pt-1.5 border-t border-slate-200/60">
                      <span className="text-slate-500">Lokasi Penugasan:</span>
                      <p className="font-medium text-slate-700 mt-0.5">{selectedActivity.detail.location}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button 
                      onClick={() => {
                        setActiveMenu('Manajemen Quest');
                        setSelectedActivity(null);
                      }}
                      className="px-4 py-2 bg-[#005139] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      Lihat Rincian Quest <Eye size={12} />
                    </button>
                    <button 
                      onClick={() => handleResolveActivity(selectedActivity.id, 'Tindakan Diambil')}
                      className="px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Takedown / Batalkan Quest
                    </button>
                  </div>
                </div>
              )}

              {/* Type: User Register Detail */}
              {selectedActivity.type === 'user_register' && (
                <div className="space-y-3">
                  <span className="text-xs text-slate-400 font-medium">Informasi Pengguna Baru:</span>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-slate-500">Verifikasi KYC:</span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-black rounded-md flex items-center gap-0.5">
                        <CheckCircle size={10} /> Sukses
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Nama Lengkap:</span>
                      <span className="font-bold text-slate-800">{selectedActivity.detail.fullName}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Email:</span>
                      <span className="font-bold text-slate-800">{selectedActivity.detail.email}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Peran Awal:</span>
                      <span className="font-bold text-slate-800">{selectedActivity.detail.role}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Tanggal Gabung:</span>
                      <span className="font-bold text-slate-800">{selectedActivity.detail.joinDate}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button 
                      onClick={() => {
                        setActiveMenu('Manajemen Pengguna');
                        setSelectedActivity(null);
                      }}
                      className="px-4 py-2 bg-[#005139] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      Buka Profil Lengkap <Eye size={12} />
                    </button>
                    <button 
                      onClick={() => handleResolveActivity(selectedActivity.id, 'Tangguhkan')}
                      className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Tangguhkan Akun
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
}