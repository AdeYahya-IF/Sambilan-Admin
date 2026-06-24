import { useState, useEffect } from 'react';
import { 
  Sliders, 
  X, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  ShieldAlert, 
  Search,
  Info
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

// --- INITIAL DATASET ---

const initialLogs = [
  { id: 'LOG-309', time: '01:12', user: 'Rian H.', type: 'Chat Obrolan', text: 'Bisa kirim no WA kak? Kita transaksi di luar wa.me/628123456789 atau hubungi 0812-3456-7890 di Jl. Jend Sudirman No. 12.', status: 'Mencurigakan', color: 'border-amber-500 bg-amber-50/20 text-amber-800' },
  { id: 'LOG-308', time: '01:05', user: 'Siti A.', type: 'Chat Obrolan', text: 'Aduh, maaf kak, nanti akun saya bisa di-suspend sistem.', status: 'Aman', color: 'border-emerald-500 bg-emerald-50/10 text-emerald-800' },
  { id: 'LOG-307', time: '00:45', user: 'Hendra S.', type: 'Deskripsi Quest', text: 'Butuh desain banner promo Ramadhan ukuran 1080x1080px untuk Instagram feeds bisnis pakaian.', status: 'Aman', color: 'border-emerald-500 bg-emerald-50/10 text-emerald-800' },
  { id: 'LOG-306', time: '23:14', user: 'Spammer99', type: 'Deskripsi Quest', text: 'KLIK LINK INI UNTUK MENANGKAN HADIAH HINGGA PULUH KALI LIPAT!!! http://phishing-sambilan.com', status: 'Ditolak', color: 'border-red-500 bg-red-50/20 text-red-800', reason: 'Terdeteksi Tautan Phishing/Spam' },
  { id: 'LOG-305', time: '22:40', user: 'Agus Santoso', type: 'Ulasan Pekerja', text: 'Pemberi tugas sangat ramah dan pembayarannya lancar. Sangat direkomendasikan!', status: 'Aman', color: 'border-emerald-500 bg-emerald-50/10 text-emerald-800' },
  { id: 'LOG-304', time: '22:15', user: 'Joni R.', type: 'Chat Obrolan', text: 'anjing kamu nipu ya, kirim lemarinya mana gak dateng dateng dari tadi', status: 'Mencurigakan', color: 'border-amber-500 bg-amber-50/20 text-amber-800', reason: 'Penggunaan Kata Kasar/SARA' }
];

const initialRules = [
  { id: 'RULE-01', pattern: 'transaksi langsung', action: 'FLAG', category: 'Transaksi Luar Sistem' },
  { id: 'RULE-02', pattern: 'pinjam rekening', action: 'BLOCK', category: 'Pencucian Uang / Fraud' },
  { id: 'RULE-03', pattern: 'phishing-sambilan.com', action: 'BLOCK', category: 'Link Phishing / Malware' },
  { id: 'RULE-04', pattern: 'anjing', action: 'FLAG', category: 'Kata Kasar / SARA' },
  { id: 'RULE-05', pattern: 'wa.me/', action: 'FLAG', category: 'Kontak Luar Aplikasi' }
];

const initialBlacklistedWords = [
  'transaksi luar',
  'kirim wa',
  'pinjam bank',
  'saudara transfer',
  'kasar',
  'kasino',
  'judi slot',
  'gacor'
];

const initialBlockedUsers = [
  { id: 'USR-5591', name: 'Gilang Ramadhan', reason: 'Upaya pemalsuan dokumen verifikasi KYC.', date: '16 Feb 2024' },
  { id: 'USR-9901', name: 'Spammer99', reason: 'Posting link phishing berulang kali di deskripsi quest.', date: '23 Jun 2026' },
  { id: 'USR-1123', name: 'Joni R.', reason: 'Ujaran kebencian & kata-kata kasar berulang di chat quest.', date: '24 Jun 2026' }
];

// Recharts: Weekly AI Audit Logs Count
const aiAuditWeeklyData = [
  { name: 'Sen', check: 8400 },
  { name: 'Sel', check: 9800 },
  { name: 'Rab', check: 10400 },
  { name: 'Kam', check: 12840 },
  { name: 'Jum', check: 11500 },
  { name: 'Sab', check: 9100 },
  { name: 'Min', check: 7800 }
];

// Helper to sanitize contact details (mask phone, urls, addresses)
const sanitizeContentLog = (text) => {
  if (!text) return '';
  
  // 1. Phone numbers (e.g. 08123456789, +628123456789, etc.)
  const phoneRegex = /(?:\+62|62|0)8[1-9](?:\s*-*\s*\d){7,11}\b/g;
  
  // 2. URLs / Web links (including http, https, www, wa.me, whatsapp.com, etc.)
  const urlRegex = /(?:https?:\/\/|www\.)[a-zA-Z0-9-./?=&%+_]+|(?:wa\.me|whatsapp\.com)\/[a-zA-Z0-9-./?=&%+_]+|(?:[a-zA-Z0-9-]+\.)+(?:com|org|net|me|gov|edu|mil|info|biz|co|id|us|uk|de|fr|app)(?:\/[a-zA-Z0-9-./?=&%+_]*)?/gi;
  
  // 3. Addresses (starting with Jl., Jalan, Gg., Gang, Ruko, Apartemen, Kosan, Perumahan, Komplek)
  const addressRegex = /(?:jl\.|jalan|gg\.|gang|ruko|apartemen|kosan|perumahan|komplek)\s+[a-zA-Z0-9\s.,-]{3,50}\b/gi;

  let sanitized = text;
  sanitized = sanitized.replace(phoneRegex, '[DATA KONTAK]');
  sanitized = sanitized.replace(urlRegex, '[DATA KONTAK]');
  sanitized = sanitized.replace(addressRegex, '[DATA KONTAK]');
  
  return sanitized;
};

// Helper to truncate text to max 60 chars and append ellipsis
const getTruncatedContent = (text) => {
  const sanitized = sanitizeContentLog(text);
  if (sanitized.length > 60) {
    return sanitized.substring(0, 60) + '...';
  }
  return sanitized;
};

// Global counters outside components to avoid React purity rule warnings
let ruleCounter = 6;
let copyCounter = 100;

export default function Moderation() {
  const [activeTab, setActiveTab] = useState('logs'); // 'logs' | 'rules' | 'blacklist'

  const [logs] = useState(initialLogs);
  const [rules, setRules] = useState(initialRules);
  const [blacklistWords, setBlacklistWords] = useState(initialBlacklistedWords);
  const [blockedUsers, setBlockedUsers] = useState(initialBlockedUsers);

  // Loading state for tables
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // Filter & Search states
  const [searchLogTerm, setSearchLogTerm] = useState('');
  const [statusLogFilter, setStatusLogFilter] = useState('Semua');

  // Interactive configurations
  const [sensitivityThreshold, setSensitivityThreshold] = useState(75); // Slider percentage

  // Add rule state
  const [newRulePattern, setNewRulePattern] = useState('');
  const [newRuleAction, setNewRuleAction] = useState('FLAG');
  const [newRuleCategory, setNewRuleCategory] = useState('Lain-lain');

  // Add blacklist word state
  const [newWord, setNewWord] = useState('');
  const [isAddingWord, setIsAddingWord] = useState(false);

  // Destructive deletion confirmation state
  const [confirmDeleteRuleId, setConfirmDeleteRuleId] = useState(null);

  const [selectedLog, setSelectedLog] = useState(null);
  const [moderationLogs, setModerationLogs] = useState([]);

  const handleCopyToNotes = (log) => {
    const now = new Date();
    const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const newEntry = {
      id: `COPY-${copyCounter++}`,
      time: timestamp,
      user: log.user,
      contentType: log.type,
      content: log.text
    };
    setModerationLogs(prev => [newEntry, ...prev]);
    triggerToast('Berhasil disimpan ke log catatan moderasi.', 'success');
  };

  // Toast
  const [toastMsg, setToastMsg] = useState('');

  const triggerToast = (msg, type = 'success') => {
    if (window.showToast) {
      window.showToast(msg, type);
    } else {
      setToastMsg(msg);
      setTimeout(() => setToastMsg(''), 3000);
    }
  };

  // Log filter application
  const filteredLogs = logs.filter(log => {
    const matchSearch = log.user.toLowerCase().includes(searchLogTerm.toLowerCase()) ||
      log.text.toLowerCase().includes(searchLogTerm.toLowerCase());
    const matchStatus = statusLogFilter === 'Semua' || log.status === statusLogFilter;
    return matchSearch && matchStatus;
  });

  // Action handlers
  const handleAddRule = (e) => {
    e.preventDefault();
    if (!newRulePattern.trim()) return;
    const newRule = {
      id: `RULE-${String(ruleCounter++).padStart(2, '0')}`,
      pattern: newRulePattern,
      action: newRuleAction,
      category: newRuleCategory
    };
    setRules(prev => [...prev, newRule]);
    setNewRulePattern('');
    triggerToast('Aturan moderasi AI baru berhasil ditambahkan.');
  };

  const handleDeleteRule = (id) => {
    setRules(prev => prev.filter(r => r.id !== id));
    triggerToast('Aturan moderasi AI berhasil dihapus.');
  };

  const handleAddBlacklistWord = (e) => {
    e.preventDefault();
    if (!newWord.trim()) return;
    if (blacklistWords.includes(newWord.toLowerCase().trim())) {
      triggerToast('Kata/frasa sudah terdaftar di blacklist.');
      return;
    }
    setBlacklistWords(prev => [...prev, newWord.toLowerCase().trim()]);
    setNewWord('');
    setIsAddingWord(false);
    triggerToast('Kata/frasa berhasil dimasukkan ke blacklist.');
  };

  const handleDeleteBlacklistWord = (word) => {
    setBlacklistWords(prev => prev.filter(w => w !== word));
    triggerToast('Kata/frasa berhasil dihapus dari blacklist.');
  };

  const handleUnblockUser = (userId, name) => {
    setBlockedUsers(prev => prev.filter(u => u.id !== userId));
    triggerToast(`Pengguna ${name} berhasil dilepas dari blokir.`);
  };

  // Stats Calculations
  const totalInputsToday = 12840;
  const passRate = 97.4;
  const flaggedRate = 2.6;

  const topViolations = [
    { name: 'Transaksi Luar Sistem', pct: 58, count: 193, color: '#005139' },
    { name: 'Spam & Phishing Links', pct: 27, count: 90, color: '#3b82f6' },
    { name: 'Kata Kasar & SARA', pct: 15, count: 50, color: '#f59e0b' }
  ];

  return (
    <div className="space-y-6">
      
      {/* TOAST PANEL */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-[100] bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-slate-800 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMsg}</span>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="pb-2 border-b border-slate-100 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Manajemen AI & Moderasi</h2>
          <p className="text-sm text-slate-500 mt-1">Konfigurasi kepatuhan, pantau sensor input real-time, dan audit blacklist kata kunci.</p>
        </div>
      </div>

      {/* TABS CONTAINER */}
      <div className="flex border-b border-slate-200 gap-6">
        {[
          { id: 'logs', label: 'Log Moderasi & Statistik' },
          { id: 'rules', label: 'Pengaturan Aturan AI' },
          { id: 'blacklist', label: 'Daftar Blacklist & Blokir' }
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => {
              setIsLoading(true);
              setActiveTab(tab.id);
            }} 
            className={`pb-3 font-bold text-sm border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === tab.id ? 'border-[#005139] text-[#005139]' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: LOGS & STATS */}
      {activeTab === 'logs' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Top Row Stats & Sensitivity thresholds */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Stat Card 1: Daily checked */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1">INPUT DICEK HARI INI</p>
                <h3 className="text-3xl font-black text-slate-850">{totalInputsToday.toLocaleString('id-ID')}</h3>
              </div>
              <span className="text-[10px] text-slate-400 mt-3 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span> Live Auditing Teraktifkan
              </span>
            </div>

            {/* Stat Card 2: Pass Ratio percentage */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1">RASIO LOLOS VS FLAGGED</p>
                <div className="flex justify-between items-center text-xs font-bold text-slate-700 mt-1">
                  <span>Lolos ({passRate}%)</span>
                  <span>Flagged ({flaggedRate}%)</span>
                </div>
                
                {/* Progress bar */}
                <div className="w-full h-2.5 bg-rose-250 rounded-full overflow-hidden flex mt-2.5">
                  <div className="h-full bg-emerald-600" style={{ width: `${passRate}%` }} />
                  <div className="h-full bg-rose-600" style={{ width: `${flaggedRate}%` }} />
                </div>
              </div>
              <span className="text-[9px] text-slate-400 mt-3 font-medium">
                Sistem meninjau 100% ulasan, obrolan chat, dan deskripsi quest.
              </span>
            </div>

            {/* Threshold config slider */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">THRESHOLD SENSITIVITAS AI</p>
                  <span className="px-2 py-0.5 bg-emerald-100 text-[#005139] text-[10px] font-black rounded">
                    {sensitivityThreshold}% Ketat
                  </span>
                </div>
                
                <div className="mt-4">
                  <input 
                    type="range" 
                    min="10" 
                    max="100" 
                    value={sensitivityThreshold}
                    onChange={(e) => {
                      setSensitivityThreshold(Number(e.target.value));
                    }}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#005139]"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 font-bold mt-2">
                    <span>Longgar (10%)</span>
                    <span>Moderat (50%)</span>
                    <span>Sangat Ketat (100%)</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Recharts weekly check + top violations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Checked inputs history */}
            <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col min-h-[300px]">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Volume Moderasi AI Mingguan</h3>
                <p className="text-[11px] text-slate-450 mt-0.5">Jumlah pengecekan konten otomatis dalam satu minggu terakhir</p>
              </div>
              <div className="h-44 w-full mt-4 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={aiAuditWeeklyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                    <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Bar dataKey="check" name="Pengecekan" fill="#005139" radius={[3, 3, 0, 0]} barSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Violations Categories breakdown */}
            <div className="lg:col-span-1 bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[300px]">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Kategori Pelanggaran Terbanyak</h3>
                <p className="text-[11px] text-slate-450 mt-0.5">Breakdown parameter flagging & pemblokiran sistem</p>
              </div>
              
              <div className="space-y-4 my-auto py-2">
                {topViolations.map((v, idx) => (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="flex justify-between font-bold text-slate-700">
                      <span>{v.name}</span>
                      <span>{v.count} Kasus ({v.pct}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${v.pct}%`, backgroundColor: v.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* AI MODERATION LOG (ALL INPUTS CHECKED) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            
            {/* Table Header Filter */}
            <div className="p-4 border-b border-slate-150 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-800 text-sm">AI Moderation Log</h3>
                <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-[#005139] rounded-md font-extrabold border border-emerald-100">
                  {filteredLogs.length} Entri log termonitor
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-450" size={13} />
                  <input 
                    type="text" 
                    placeholder="Cari User / Kata..." 
                    value={searchLogTerm} 
                    onChange={(e) => setSearchLogTerm(e.target.value)} 
                    className="pl-8 pr-3 py-1.5 border border-slate-250 bg-white rounded-lg text-xs font-semibold outline-none focus:border-[#005139]"
                  />
                </div>

                {/* Status Log Filter */}
                <select 
                  value={statusLogFilter} 
                  onChange={(e) => setStatusLogFilter(e.target.value)} 
                  className="px-3 py-1.5 border border-slate-250 bg-white rounded-lg text-xs font-bold text-slate-655 outline-none focus:border-[#005139]"
                >
                  <option value="Semua">Semua Status Log</option>
                  <option value="Aman">Aman (Hijau)</option>
                  <option value="Mencurigakan">Mencurigakan (Kuning)</option>
                  <option value="Ditolak">Ditolak (Merah)</option>
                </select>
              </div>
            </div>

            {/* Logs Table Element */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-650">
                <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">ID & Waktu</th>
                    <th className="px-6 py-4">Pengguna</th>
                    <th className="px-6 py-4">Tipe Konten</th>
                    <th className="px-6 py-4">Isi Konten / Input Pengguna</th>
                    <th className="px-6 py-4">Status Moderasi</th>
                    <th className="px-6 py-4">Keterangan Deteksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-6 py-4">
                          <div className="h-2 bg-slate-200 rounded w-10 mb-1"></div>
                          <div className="h-3 bg-slate-200 rounded w-16"></div>
                        </td>
                        <td className="px-6 py-4"><div className="h-3 bg-slate-200 rounded w-20"></div></td>
                        <td className="px-6 py-4"><div className="h-3 bg-slate-200 rounded w-24"></div></td>
                        <td className="px-6 py-4"><div className="h-3 bg-slate-200 rounded w-48"></div></td>
                        <td className="px-6 py-4"><div className="h-5 bg-slate-200 rounded w-16"></div></td>
                        <td className="px-6 py-4"><div className="h-3 bg-slate-200 rounded w-32"></div></td>
                      </tr>
                    ))
                  ) : filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <Search className="w-12 h-12 text-slate-300" />
                          <span className="font-extrabold text-sm text-slate-500 font-sans">Tidak ada data ditemukan</span>
                          <button 
                            type="button" 
                            onClick={() => {
                              setSearchLogTerm('');
                              setStatusLogFilter('Semua');
                            }}
                            className="px-3.5 py-1.5 bg-[#005139] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer border-0 font-sans"
                          >
                            Reset Filter
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => {
                      let statusBadge = 'bg-slate-100 text-slate-600';
                      if (log.status === 'Aman') statusBadge = 'bg-emerald-50 text-emerald-700 border border-emerald-100';
                      else if (log.status === 'Mencurigakan') statusBadge = 'bg-amber-50 text-amber-700 border border-amber-100';
                      else if (log.status === 'Ditolak') statusBadge = 'bg-rose-50 text-rose-700 border border-rose-100';

                      return (
                        <tr key={log.id} className="hover:bg-slate-55/40 transition-colors">
                          
                          {/* ID & Waktu */}
                          <td className="px-6 py-4">
                            <span className="font-mono text-[9px] text-slate-400 font-bold">{log.id}</span>
                            <span className="text-[10px] text-slate-500 block font-semibold mt-0.5">{log.time} WIB</span>
                          </td>

                          {/* Pengguna */}
                          <td className="px-6 py-4 font-bold text-slate-800">
                            {log.user}
                          </td>

                          {/* Tipe Konten */}
                          <td className="px-6 py-4 text-xs font-semibold text-slate-600">
                            {log.type}
                          </td>

                          {/* Isi Konten */}
                          <td className="px-6 py-4 text-xs font-medium text-slate-700 max-w-sm">
                            <div className="flex flex-col gap-1">
                              <p className="font-semibold leading-relaxed">
                                "{getTruncatedContent(log.text)}"
                              </p>
                              <button
                                type="button"
                                onClick={() => setSelectedLog(log)}
                                className="text-[10px] font-bold text-[#005139] hover:underline hover:text-emerald-800 transition-all text-left cursor-pointer border-0 bg-transparent p-0"
                              >
                                Lihat Selengkapnya
                              </button>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black ${statusBadge}`}>
                              • {log.status}
                            </span>
                          </td>

                          {/* Keterangan */}
                          <td className="px-6 py-4 text-xs font-semibold text-slate-500">
                            {log.reason ? log.reason : (log.status === 'Aman' ? 'Konten Sesuai Pedoman' : 'Tindakan Butuh Review Manual')}
                          </td>

                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            {/* AUDIT LOG COPIES TRAIL */}
            {moderationLogs.length > 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mt-6 space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-250 pb-2">
                  <Info size={14} className="text-[#005139]" />
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Log Salinan Audit Moderasi ({moderationLogs.length})</h4>
                </div>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {moderationLogs.map((entry) => (
                    <div key={entry.id} className="bg-white p-3 rounded-lg border border-slate-200 text-xs flex justify-between items-start gap-4">
                      <div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold">
                          <span className="font-mono text-[#005139]">{entry.id}</span>
                          <span>•</span>
                          <span>{entry.time} WIB</span>
                          <span>•</span>
                          <span>User: {entry.user}</span>
                          <span>•</span>
                          <span>Type: {entry.contentType}</span>
                        </div>
                        <p className="text-slate-700 font-semibold mt-1">"{entry.content}"</p>
                      </div>
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-750 font-bold rounded text-[8px] tracking-wide uppercase shrink-0">
                        Disimpan Ke Log
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Catatan Kepatuhan Privasi */}
            <div className="bg-slate-50 border-t border-slate-200 p-4 rounded-xl flex items-start gap-2.5 mt-6 text-xs text-slate-500">
              <Info className="text-slate-400 shrink-0 mt-0.5" size={16} />
              <p className="leading-relaxed">
                Data percakapan pengguna diproses secara otomatis oleh sistem AI. Admin hanya dapat mengakses konten yang diflagging untuk keperluan moderasi platform sesuai kebijakan privasi Sambilan.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: PENGATURAN AI RULES */}
      {activeTab === 'rules' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
          
          {/* LEFT RULE CONFIG FORM */}
          <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sliders size={18} className="text-[#005139]" />
              <h3 className="font-bold text-slate-800 text-sm">Tambah Aturan Sensor AI</h3>
            </div>
            
            <form onSubmit={handleAddRule} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase">KATA KUNCI / POLA PATTERN</label>
                <input 
                  type="text"
                  placeholder="Contoh: judi slot / wa.me/"
                  value={newRulePattern}
                  onChange={(e) => setNewRulePattern(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-250 bg-white rounded-lg text-xs font-semibold outline-none focus:border-[#005139]"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase">TINDAKAN AI</label>
                <select 
                  value={newRuleAction} 
                  onChange={(e) => setNewRuleAction(e.target.value)} 
                  className="w-full px-3 py-2 border border-slate-250 bg-white rounded-lg text-xs font-bold text-slate-655 outline-none focus:border-[#005139]"
                >
                  <option value="FLAG">FLAG (Peringatan & Review Manual)</option>
                  <option value="BLOCK">BLOCK (Otomatis Ditolak Sistem)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase">KATEGORI PELANGGARAN</label>
                <select 
                  value={newRuleCategory} 
                  onChange={(e) => setNewRuleCategory(e.target.value)} 
                  className="w-full px-3 py-2 border border-slate-250 bg-white rounded-lg text-xs font-bold text-slate-655 outline-none focus:border-[#005139]"
                >
                  <option value="Transaksi Luar Sistem">Transaksi Luar Sistem</option>
                  <option value="Kata Kasar / SARA">Kata Kasar / SARA</option>
                  <option value="Link Phishing / Malware">Link Phishing / Malware</option>
                  <option value="Pencucian Uang / Fraud">Pencucian Uang / Fraud</option>
                  <option value="Lain-lain">Lain-lain</option>
                </select>
              </div>

              <button 
                type="submit"
                className="w-full py-2 bg-[#005139] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer"
              >
                <Plus size={14} /> Daftarkan Aturan
              </button>
            </form>
          </div>

          {/* RIGHT RULES TABLE DATABASE */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-sm">Daftar Aturan Sensor Moderasi Aktif</h3>
              <span className="px-2.5 py-0.5 bg-emerald-50 text-[#005139] text-[10px] font-black rounded-full border border-emerald-100">
                {rules.length} Aturan Aktif
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-650">
                <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">ID Aturan</th>
                    <th className="px-6 py-4">Kata Kunci / Pola</th>
                    <th className="px-6 py-4">Kategori Pelanggaran</th>
                    <th className="px-6 py-4">Tindakan Sistem</th>
                    <th className="px-6 py-4 text-center">Aksi Hapus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-6 py-4"><div className="h-3 bg-slate-200 rounded w-16"></div></td>
                        <td className="px-6 py-4"><div className="h-3.5 bg-slate-200 rounded w-24"></div></td>
                        <td className="px-6 py-4"><div className="h-3 bg-slate-200 rounded w-32"></div></td>
                        <td className="px-6 py-4"><div className="h-5 bg-slate-200 rounded-full w-20"></div></td>
                        <td className="px-6 py-4 text-center"><div className="h-6 bg-slate-200 rounded w-6 mx-auto"></div></td>
                      </tr>
                    ))
                  ) : rules.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                          </svg>
                          <span className="font-extrabold text-sm text-slate-500">Tidak ada data ditemukan</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    rules.map((rule) => (
                      <tr key={rule.id} className="hover:bg-slate-55/40 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs font-bold text-slate-400">{rule.id}</td>
                        <td className="px-6 py-4 font-extrabold text-slate-800 font-mono text-xs">"{rule.pattern}"</td>
                        <td className="px-6 py-4 text-xs font-semibold text-slate-600">{rule.category}</td>
                        <td className="px-6 py-4 text-xs">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                            rule.action === 'BLOCK' ? 'bg-rose-50 text-rose-700 border border-rose-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                          }`}>
                            {rule.action === 'BLOCK' ? 'REJECT (BLOCK)' : 'WARNING (FLAG)'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button 
                            onClick={() => setConfirmDeleteRuleId(rule.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-all cursor-pointer"
                          >
                            <Trash2 size={16} />
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

      {/* TAB 3: BLACKLIST WORDS & BLOCKED USERS */}
      {activeTab === 'blacklist' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
          
          {/* BLACKLIST WORDS CONTAINER (LEFT COL) */}
          <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between min-h-[450px]">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldAlert size={18} className="text-slate-500" />
                  <h3 className="font-bold text-slate-800 text-sm">Blacklist Kata / Frasa</h3>
                </div>
                <button 
                  onClick={() => setIsAddingWord(true)}
                  className="text-xs font-bold text-[#005139] hover:underline cursor-pointer"
                >
                  + Tambah Kata
                </button>
              </div>

              {/* Form inline */}
              {isAddingWord && (
                <form onSubmit={handleAddBlacklistWord} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2.5 animate-in slide-in-from-top-2 duration-200">
                  <input 
                    type="text"
                    placeholder="Masukkan kata/frasa baru..."
                    value={newWord}
                    onChange={(e) => setNewWord(e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-200 bg-white rounded text-xs font-semibold outline-none focus:border-[#005139]"
                    required
                  />
                  <div className="flex gap-1.5 justify-end">
                    <button 
                      type="submit"
                      className="px-2.5 py-1 bg-[#005139] text-white text-[10px] font-bold rounded cursor-pointer"
                    >
                      Daftarkan
                    </button>
                    <button 
                      onClick={() => {
                        setIsAddingWord(false);
                        setNewWord('');
                      }}
                      className="px-2.5 py-1 bg-slate-200 text-slate-700 text-[10px] font-bold rounded cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              )}

              {/* List grid of words */}
              <div className="flex flex-wrap gap-2 overflow-y-auto max-h-[300px] pt-1">
                {blacklistWords.map((word, idx) => (
                  <span 
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 text-rose-700 rounded-lg border border-rose-100 text-xs font-bold font-mono"
                  >
                    <span>"{word}"</span>
                    <button 
                      onClick={() => handleDeleteBlacklistWord(word)}
                      className="p-0.5 hover:bg-rose-100 text-rose-450 hover:text-rose-700 rounded transition-all cursor-pointer"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
            
            <p className="text-[10px] text-slate-400 font-medium border-t border-slate-100 pt-3 mt-4">
              *Setiap input pesan ulasan atau chat yang mengandung kata di atas akan diflagging otomatis oleh filter.
            </p>
          </div>

          {/* BLOCKED USERS LIST (RIGHT 2 COLS) */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-sm">Daftar Pengguna Diblokir (Blacklisted Accounts)</h3>
              <span className="px-2.5 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-black rounded-full border border-rose-200">
                {blockedUsers.length} Dibanned
              </span>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-sm text-slate-650">
                <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">ID Pengguna</th>
                    <th className="px-6 py-4">Nama Pengguna</th>
                    <th className="px-6 py-4">Tanggal Ban</th>
                    <th className="px-6 py-4">Alasan Pemblokiran</th>
                    <th className="px-6 py-4 text-center">Buka Blokir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {blockedUsers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-10 text-center text-slate-400 font-medium">
                        Tidak ada pengguna yang diblokir saat ini.
                      </td>
                    </tr>
                  ) : (
                    blockedUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-55/40 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs font-bold text-slate-400">{u.id}</td>
                        <td className="px-6 py-4 font-bold text-slate-800">{u.name}</td>
                        <td className="px-6 py-4 text-xs font-semibold text-slate-550">{u.date}</td>
                        <td className="px-6 py-4 text-xs font-medium text-rose-700 bg-rose-50/20 max-w-xs">
                          {u.reason}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button 
                            onClick={() => handleUnblockUser(u.id, u.name)}
                            className="px-3 py-1.5 bg-emerald-50 hover:bg-[#005139] hover:text-white text-xs font-bold text-[#005139] border border-emerald-100 rounded-lg transition-colors cursor-pointer"
                          >
                            Lepas Blokir
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

      {/* CONFIRM DELETE RULE MODAL */}
      {confirmDeleteRuleId && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200 text-center">
            <div className="mx-auto w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center">
              <Trash2 size={20} />
            </div>
            <h3 className="font-extrabold text-sm text-slate-850">⚠️ Hapus Aturan AI</h3>
            <p className="text-xs text-slate-650 leading-relaxed font-semibold">
              Apakah Anda yakin ingin menghapus aturan moderasi AI dengan ID <strong className="text-slate-850">{confirmDeleteRuleId}</strong>?
            </p>
            <p className="text-[11px] text-slate-450 leading-normal">
              Tindakan ini tidak dapat dibatalkan dan sistem tidak akan memfilter kata kunci/pola ini lagi.
            </p>
            
            <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button 
                onClick={() => {
                  setConfirmDeleteRuleId(null);
                  triggerToast('Aksi dibatalkan', 'error');
                }}
                className="flex-1 py-2 bg-white hover:bg-slate-50 text-slate-750 border border-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer font-sans"
              >
                Batalkan
              </button>
              <button 
                onClick={() => {
                  handleDeleteRule(confirmDeleteRuleId);
                  setConfirmDeleteRuleId(null);
                }}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer font-sans border-0"
              >
                Ya, Hapus Aturan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL LOG MODAL (LIHAT SELENGKAPNYA) */}
      {selectedLog && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-emerald-50 text-[#005139] text-[10px] font-black rounded border border-emerald-100">
                  Audit Konten
                </span>
                <span className="font-mono text-xs text-slate-400 font-bold">{selectedLog.id}</span>
              </div>
              <button 
                onClick={() => setSelectedLog(null)}
                className="p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Banner Audit */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-2.5">
              <ShieldAlert className="text-amber-600 shrink-0 mt-0.5" size={16} />
              <p className="text-xs text-amber-800 font-semibold leading-relaxed">
                Konten ini ditampilkan untuk keperluan audit moderasi. Akses dicatat dalam sistem.
              </p>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-3 gap-4 bg-slate-50/50 p-3 rounded-lg border border-slate-150 text-[11px] font-medium text-slate-655">
              <div>
                <span className="text-slate-400 text-[8px] font-bold uppercase tracking-wider block">Pengguna</span>
                <span className="font-bold text-slate-800 text-xs">{selectedLog.user}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[8px] font-bold uppercase tracking-wider block">Tipe Konten</span>
                <span className="font-bold text-slate-800 text-xs">{selectedLog.type}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[8px] font-bold uppercase tracking-wider block">Waktu</span>
                <span className="font-bold text-slate-850 text-xs">{selectedLog.time} WIB</span>
              </div>
            </div>

            {/* Pesan Lengkap */}
            <div className="space-y-1.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Pesan Lengkap (Raw Content)</span>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed select-text">
                {selectedLog.text}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button 
                onClick={() => {
                  handleCopyToNotes(selectedLog);
                }}
                className="px-4 py-2 bg-[#005139] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer border-0"
              >
                Salin ke Catatan Moderasi
              </button>
              <button 
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-705 border border-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}