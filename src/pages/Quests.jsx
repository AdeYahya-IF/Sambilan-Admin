import { useState, useEffect } from 'react';
import { 
  Filter, 
  Eye, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Search, 
  X, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  MessageSquare, 
  Activity,
  Image as ImageIcon
} from 'lucide-react';

// --- INITIAL MOCK DATA ---

const initialQuests = [
  {
    id: '#Q-8812',
    title: 'Bantu Pindahan Lemari Dua Pintu',
    category: 'Jasa Bersih-bersih',
    creator: 'Lina Marlina',
    adventurer: 'Agus Santoso',
    budget: 150000,
    status: 'Dalam Proses',
    createdDate: '2026-06-22',
    deadlineDate: '2026-06-25',
    description: 'Pindahan kos dari lantai 1 ke lantai 3. Butuh bantuan angkut lemari pakaian kayu berat 2 pintu.',
    location: 'Kec. Pabuaran, Bogor',
    timeline: [
      { time: '22 Jun 2026, 09:00', event: 'Quest dipublikasikan oleh Creator (Lina Marlina)' },
      { time: '22 Jun 2026, 10:15', event: 'Adventurer (Agus Santoso) mengajukan penawaran' },
      { time: '22 Jun 2026, 11:00', event: 'Penawaran disetujui. Dana escrow Rp 150.000 ditahan sistem' },
      { time: '22 Jun 2026, 11:05', event: 'Adventurer mulai mengerjakan Quest' }
    ],
    proofImage: null,
    proofNotes: null,
    chatHistory: [
      { sender: 'Lina Marlina', time: '11:02', message: 'Halo Agus, lemarinya di kamar belakang ya.' },
      { sender: 'Agus Santoso', time: '11:03', message: 'Baik bu, saya jalan ke lokasi kos sekarang.' }
    ],
    aiFlagged: false,
    aiFlagReason: null
  },
  {
    id: '#Q-8813',
    title: 'Pinjam Rekening Buat Terima Transfer',
    category: 'Lain-lain',
    creator: 'Rian H.',
    adventurer: 'Siti A.',
    budget: 50000,
    status: 'Dalam Proses',
    createdDate: '2026-06-23',
    deadlineDate: '2026-06-24',
    description: 'Butuh pinjam rekening bank apa saja untuk terima transferan dari saudara sebentar, nanti saya kasih komisi Rp 50.000 langsung.',
    location: 'Online / Remote',
    timeline: [
      { time: '23 Jun 2026, 21:00', event: 'Quest dipublikasikan oleh Creator (Rian H.)' },
      { time: '23 Jun 2026, 21:15', event: 'Adventurer (Siti A.) menyetujui Quest' },
      { time: '23 Jun 2026, 21:16', event: 'Dana escrow Rp 50.000 ditahan sistem' }
    ],
    proofImage: null,
    proofNotes: null,
    chatHistory: [
      { sender: 'Rian H.', time: '21:18', message: 'Bisa kirim no WA kak? Kita transaksi langsung di luar aplikasi aja biar ga dipotong admin.' },
      { sender: 'Siti A.', time: '21:20', message: 'Aduh, maaf kak, nanti akun saya bisa di-suspend sistem.' },
      { sender: 'Rian H.', time: '21:22', message: 'Tenang saja kak, transfer langsung ke rekening mandiri saya juga boleh. Nanti saya lebihkan Rp 20.000.' },
      { sender: 'Siti A.', time: '21:25', message: 'Maaf pak, saya tidak mau ambil risiko diblokir admin Sambilan. Silakan cancel saja kalau tidak mau lewat aplikasi.' }
    ],
    aiFlagged: true,
    aiFlagReason: 'Mendeteksi frasa mencurigakan terkait transaksi luar sistem (WA/transaksi langsung) dan peminjaman rekening bank.'
  },
  {
    id: '#Q-7721',
    title: 'Antar Berkas Fisik ke Sudirman Office',
    category: 'Kurir & Logistik',
    creator: 'Dimas Anggara',
    adventurer: 'Agus Santoso',
    budget: 45000,
    status: 'Dispute',
    createdDate: '2026-06-21',
    deadlineDate: '2026-06-22',
    description: 'Antar berkas rahasia dari Kemang ke Sudirman Tower sebelum jam 5 sore.',
    location: 'Jakarta Selatan',
    timeline: [
      { time: '21 Jun 2026, 14:00', event: 'Quest dipublikasikan oleh Creator (Dimas Anggara)' },
      { time: '21 Jun 2026, 14:20', event: 'Adventurer (Agus Santoso) disetujui mengambil Quest' },
      { time: '21 Jun 2026, 17:30', event: 'Adventurer menyelesaikan pekerjaan & mengirim bukti' },
      { time: '21 Jun 2026, 18:00', event: 'Creator mengajukan Dispute (Komplain)' }
    ],
    proofImage: 'proof',
    proofNotes: 'Berkas sudah ditaruh di resepsionis lantai 2.',
    chatHistory: [
      { sender: 'Dimas Anggara', time: '14:25', message: 'Tolong jangan sampai telat ya berkasnya penting.' },
      { sender: 'Agus Santoso', time: '17:28', message: 'Sudah saya titipkan di resepsionis pak.' },
      { sender: 'Dimas Anggara', time: '18:02', message: 'Loh, tapi amplopnya robek dan ada dokumen yang hilang! Saya tidak mau rilis pembayaran.' }
    ],
    aiFlagged: false,
    aiFlagReason: null
  },
  {
    id: '#Q-9012',
    title: 'Bantu Beresin Barang Bekas di Gudang',
    category: 'Jasa Bersih-bersih',
    creator: 'Jessica M.',
    adventurer: 'Rian Prasetyo',
    budget: 30000,
    status: 'Menunggu Konfirmasi',
    createdDate: '2026-06-23',
    deadlineDate: '2026-06-24',
    description: 'Beresin barang bekas di gudang rumah tinggal, ditumpuk rapi di luar untuk diangkut tukang rongsokan.',
    location: 'Tanah Abang, Jakarta Pusat',
    timeline: [
      { time: '23 Jun 2026, 08:00', event: 'Quest dipublikasikan oleh Creator (Jessica M.)' },
      { time: '23 Jun 2026, 08:30', event: 'Adventurer (Rian Prasetyo) disetujui mengerjakan' },
      { time: '23 Jun 2026, 11:15', event: 'Adventurer menyelesaikan tugas & mengunggah bukti foto' }
    ],
    proofImage: 'proof',
    proofNotes: 'Gudang sudah bersih rapi, barang bekas sudah ditumpuk di depan pagar sesuai instruksi.',
    chatHistory: [
      { sender: 'Jessica M.', time: '08:32', message: 'Kuncinya di bawah keset pintu depan ya.' },
      { sender: 'Rian Prasetyo', time: '11:12', message: 'Sudah selesai mba, mohon dicek fotonya.' }
    ],
    aiFlagged: false,
    aiFlagReason: null
  },
  {
    id: '#Q-5521',
    title: 'Jasa Antar Makanan Sahur Kilat',
    category: 'Kurir & Logistik',
    creator: 'Fahmi Reza',
    adventurer: 'Budi Kusuma',
    budget: 25000,
    status: 'Selesai',
    createdDate: '2026-06-20',
    deadlineDate: '2026-06-21',
    description: 'Beli nasi uduk di Kebon Kacang dan antarkan ke apartemen Thamrin Executive.',
    location: 'Jakarta Pusat',
    timeline: [
      { time: '20 Jun 2026, 02:30', event: 'Quest dipublikasikan oleh Creator (Fahmi Reza)' },
      { time: '20 Jun 2026, 02:40', event: 'Adventurer (Budi Kusuma) disetujui' },
      { time: '20 Jun 2026, 03:15', event: 'Adventurer mengirim foto bukti penyelesaian' },
      { time: '20 Jun 2026, 03:20', event: 'Creator menyetujui, dana escrow Rp 25.000 dirilis ke Adventurer' }
    ],
    proofImage: 'proof',
    proofNotes: 'Makanan sudah sampai dan digantung di pintu unit 12B.',
    chatHistory: [
      { sender: 'Fahmi Reza', time: '02:41', message: 'Sambalnya tolong dibanyakin ya mas.' },
      { sender: 'Budi Kusuma', time: '03:14', message: 'Siap mas, sudah digantung di pintu depan ya.' }
    ],
    aiFlagged: false,
    aiFlagReason: null
  },
  {
    id: '#Q-1004',
    title: 'Desain Banner Sosial Media Promosi',
    category: 'Bantuan IT & Desain',
    creator: 'Hendra S.',
    adventurer: null,
    budget: 200000,
    status: 'Menunggu Adventurer',
    createdDate: '2026-06-23',
    deadlineDate: '2026-06-28',
    description: 'Butuh desain banner promo Ramadhan ukuran 1080x1080px untuk Instagram feeds bisnis pakaian.',
    location: 'Remote / Online',
    timeline: [
      { time: '23 Jun 2026, 10:00', event: 'Quest dipublikasikan oleh Creator (Hendra S.)' }
    ],
    proofImage: null,
    proofNotes: null,
    chatHistory: [],
    aiFlagged: false,
    aiFlagReason: null
  },
  {
    id: '#Q-0992',
    title: 'Ambil Paket JNE di Kantor Cabang Pabuaran',
    category: 'Kurir & Logistik',
    creator: 'Dian Fitriani',
    adventurer: null,
    budget: 15000,
    status: 'Expired',
    createdDate: '2026-06-15',
    deadlineDate: '2026-06-16',
    description: 'Tolong ambilkan paket atas nama Dian di kantor JNE Pabuaran Bogor.',
    location: 'Bogor',
    timeline: [
      { time: '15 Jun 2026, 08:00', event: 'Quest dipublikasikan oleh Creator (Dian Fitriani)' },
      { time: '16 Jun 2026, 08:00', event: 'Batas waktu quest berakhir (Expired) tanpa pendaftar disetujui' }
    ],
    proofImage: null,
    proofNotes: null,
    chatHistory: [],
    aiFlagged: false,
    aiFlagReason: null
  },
  {
    id: '#Q-0812',
    title: 'Bantu Belajar Matematika Dasar SMA',
    category: 'Lain-lain',
    creator: 'Eko Prasetyo',
    adventurer: null,
    budget: 80000,
    status: 'Dibatalkan',
    createdDate: '2026-06-18',
    deadlineDate: '2026-06-19',
    description: 'Bantu jelaskan bab integral dasar secara tatap muka sore ini jam 4 di kafe x.',
    location: 'Semarang',
    timeline: [
      { time: '18 Jun 2026, 12:00', event: 'Quest dipublikasikan oleh Creator (Eko Prasetyo)' },
      { time: '18 Jun 2026, 13:45', event: 'Quest dibatalkan oleh Creator' }
    ],
    proofImage: null,
    proofNotes: null,
    chatHistory: [],
    aiFlagged: false,
    aiFlagReason: null
  }
];

// Helper to get initials
const getInitials = (name) => {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export default function Quests() {
  const [activeTab, setActiveTab] = useState('daftar'); // 'daftar' or 'moderasi'
  const [quests, setQuests] = useState(initialQuests);

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
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [categoryFilter, setCategoryFilter] = useState('Semua');
  const [budgetFilter, setBudgetFilter] = useState('Semua');
  const [dateFilter, setDateFilter] = useState('Semua');

  // Detail Modal State
  const [selectedQuest, setSelectedQuest] = useState(null);

  // Rejection confirmation modal state
  const [confirmRejectBlockQuestId, setConfirmRejectBlockQuestId] = useState(null);
  const [confirmRejectBlockCreator, setConfirmRejectBlockCreator] = useState('');
  const [confirmRejectWarnQuestId, setConfirmRejectWarnQuestId] = useState(null);
  const [confirmRejectWarnCreator, setConfirmRejectWarnCreator] = useState('');

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

  // Filter application
  const filteredQuests = quests.filter(q => {
    // Search by title or creator
    const matchSearch = searchTerm === '' || 
      q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.creator.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by status
    const matchStatus = statusFilter === 'Semua' || q.status === statusFilter;

    // Filter by category
    const matchCategory = categoryFilter === 'Semua' || q.category === categoryFilter;

    // Filter by budget range
    let matchBudget = true;
    if (budgetFilter === 'under-50k') {
      matchBudget = q.budget < 50000;
    } else if (budgetFilter === '50k-150k') {
      matchBudget = q.budget >= 50000 && q.budget <= 150000;
    } else if (budgetFilter === 'over-150k') {
      matchBudget = q.budget > 150000;
    }

    // Filter by date range
    let matchDate = true;
    if (dateFilter === 'today') {
      matchDate = q.createdDate === '2026-06-24';
    } else if (dateFilter === 'last-7') {
      matchDate = q.createdDate >= '2026-06-17';
    } else if (dateFilter === 'last-30') {
      matchDate = q.createdDate >= '2026-05-24';
    }

    return matchSearch && matchStatus && matchCategory && matchBudget && matchDate;
  });

  // AI Moderation Queue
  const flaggedQuests = quests.filter(q => q.aiFlagged === true);
  const [selectedFlaggedQuest, setSelectedFlaggedQuest] = useState(flaggedQuests[0] || null);

  // Admin Actions on Detail Modal
  const handleForceComplete = (questId) => {
    setQuests(prev => prev.map(q => {
      if (q.id === questId) {
        return {
          ...q,
          status: 'Selesai',
          timeline: [
            ...q.timeline,
            { time: '24 Jun 2026, 01:12', event: 'Quest dipaksa selesai oleh Administrator. Escrow dilepas.' }
          ]
        };
      }
      return q;
    }));
    setSelectedQuest(null);
    triggerToast('Quest berhasil dipaksa selesai. Dana dirilis ke Adventurer.');
  };

  const handleForceCancel = (questId) => {
    setQuests(prev => prev.map(q => {
      if (q.id === questId) {
        return {
          ...q,
          status: 'Dibatalkan',
          timeline: [
            ...q.timeline,
            { time: '24 Jun 2026, 01:12', event: 'Quest dibatalkan secara paksa oleh Administrator. Dana di-refund.' }
          ]
        };
      }
      return q;
    }));
    setSelectedQuest(null);
    triggerToast('Quest berhasil dibatalkan paksa. Saldo di-refund ke Creator.');
  };

  const handleMarkSuspicious = (questId) => {
    setQuests(prev => prev.map(q => {
      if (q.id === questId) {
        return {
          ...q,
          aiFlagged: true,
          aiFlagReason: 'Ditandai mencurigakan secara manual oleh Administrator.',
          timeline: [
            ...q.timeline,
            { time: '24 Jun 2026, 01:12', event: 'Quest ditandai mencurigakan oleh Administrator.' }
          ]
        };
      }
      return q;
    }));
    setSelectedQuest(null);
    triggerToast('Quest ditandai mencurigakan & masuk antrian moderasi AI.');
  };

  // AI Moderation Queue Actions
  const handleApproveContinue = (questId) => {
    setQuests(prev => prev.map(q => {
      if (q.id === questId) {
        return {
          ...q,
          aiFlagged: false,
          aiFlagReason: null,
          timeline: [
            ...q.timeline,
            { time: '24 Jun 2026, 01:12', event: 'Flagging AI ditolak oleh Administrator. Quest dilanjutkan.' }
          ]
        };
      }
      return q;
    }));
    triggerToast('Quest disetujui & penandaan AI dibersihkan.');
    
    // Auto shift queue selection
    const nextFlagged = flaggedQuests.filter(q => q.id !== questId);
    setSelectedFlaggedQuest(nextFlagged[0] || null);
  };

  const handleRejectBlock = (questId, creatorName) => {
    setQuests(prev => prev.map(q => {
      if (q.id === questId) {
        return {
          ...q,
          status: 'Dibatalkan',
          aiFlagged: false,
          aiFlagReason: null,
          timeline: [
            ...q.timeline,
            { time: '24 Jun 2026, 01:12', event: 'Quest ditolak karena aktivitas berbahaya. Akun pembuat diblokir.' }
          ]
        };
      }
      return q;
    }));
    triggerToast(`Quest dibatalkan. Pengguna ${creatorName} telah diblokir.`);

    // Auto shift queue selection
    const nextFlagged = flaggedQuests.filter(q => q.id !== questId);
    setSelectedFlaggedQuest(nextFlagged[0] || null);
  };

  const handleRejectWarn = (questId, creatorName) => {
    setQuests(prev => prev.map(q => {
      if (q.id === questId) {
        return {
          ...q,
          status: 'Dibatalkan',
          aiFlagged: false,
          aiFlagReason: null,
          timeline: [
            ...q.timeline,
            { time: '24 Jun 2026, 01:12', event: 'Quest ditolak karena melanggar pedoman. Pembuat diberi peringatan.' }
          ]
        };
      }
      return q;
    }));
    triggerToast(`Quest ditolak. Pengguna ${creatorName} diberi peringatan.`);

    // Auto shift queue selection
    const nextFlagged = flaggedQuests.filter(q => q.id !== questId);
    setSelectedFlaggedQuest(nextFlagged[0] || null);
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

      {/* HEADER SECTION */}
      <div className="flex justify-between items-end pb-2 border-b border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Manajemen Quest</h2>
          <p className="text-sm text-slate-500 mt-1">Pantau seluruh kontrak tugas, escrow, sengketa, dan kepatuhan sistem.</p>
        </div>
      </div>

      {/* TABS CONTAINER */}
      <div className="flex border-b border-slate-200 gap-6">
        <button 
          onClick={() => setActiveTab('daftar')} 
          className={`pb-3 font-bold text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === 'daftar' ? 'border-[#005139] text-[#005139]' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Daftar Quest
        </button>
        <button 
          onClick={() => {
            setActiveTab('moderasi');
            if (flaggedQuests.length > 0 && !selectedFlaggedQuest) {
              setSelectedFlaggedQuest(flaggedQuests[0]);
            }
          }} 
          className={`pb-3 font-bold text-sm border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'moderasi' ? 'border-[#005139] text-[#005139]' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <span>AI Moderation Queue</span>
          {flaggedQuests.length > 0 && (
            <span className="px-2 py-0.5 text-[10px] font-black bg-rose-500 text-white rounded-full">
              {flaggedQuests.length} Flagged
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: DAFTAR QUEST */}
      {activeTab === 'daftar' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Filters card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col gap-4">
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-slate-400" />
                <span className="text-xs font-bold text-slate-700 uppercase">Filter Pencarian Quest</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-[#005139] rounded-md font-extrabold border border-emerald-100 self-start">
                {filteredQuests.length} Quest ditemukan
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                <input 
                  type="text" 
                  placeholder="Cari Judul / Creator..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  className="w-full pl-8 pr-3 py-1.5 border border-slate-250 bg-white rounded-lg text-xs font-semibold outline-none focus:border-[#005139]"
                />
              </div>

              {/* Filter Status */}
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)} 
                className="px-3 py-1.5 border border-slate-250 bg-white rounded-lg text-xs font-bold text-slate-655 outline-none focus:border-[#005139]"
              >
                <option value="Semua">Semua Status</option>
                <option value="Menunggu Adventurer">Menunggu Adventurer</option>
                <option value="Dalam Proses">Dalam Proses</option>
                <option value="Menunggu Konfirmasi">Menunggu Konfirmasi</option>
                <option value="Dispute">Dispute</option>
                <option value="Selesai">Selesai</option>
                <option value="Expired">Expired</option>
                <option value="Dibatalkan">Dibatalkan</option>
              </select>

              {/* Filter Kategori */}
              <select 
                value={categoryFilter} 
                onChange={(e) => setCategoryFilter(e.target.value)} 
                className="px-3 py-1.5 border border-slate-250 bg-white rounded-lg text-xs font-bold text-slate-655 outline-none focus:border-[#005139]"
              >
                <option value="Semua">Semua Kategori</option>
                <option value="Kurir & Logistik">Kurir & Logistik</option>
                <option value="Jasa Bersih-bersih">Jasa Bersih-bersih</option>
                <option value="Belanja & Titip">Belanja & Titip</option>
                <option value="Bantuan IT & Desain">Bantuan IT & Desain</option>
                <option value="Lain-lain">Lain-lain</option>
              </select>

              {/* Filter Budget */}
              <select 
                value={budgetFilter} 
                onChange={(e) => setBudgetFilter(e.target.value)} 
                className="px-3 py-1.5 border border-slate-250 bg-white rounded-lg text-xs font-bold text-slate-655 outline-none focus:border-[#005139]"
              >
                <option value="Semua">Semua Rentang Budget</option>
                <option value="under-50k">&lt; Rp 50.000</option>
                <option value="50k-150k">Rp 50.000 - Rp 150.000</option>
                <option value="over-150k">&gt; Rp 150.000</option>
              </select>

              {/* Filter Tanggal */}
              <select 
                value={dateFilter} 
                onChange={(e) => setDateFilter(e.target.value)} 
                className="px-3 py-1.5 border border-slate-250 bg-white rounded-lg text-xs font-bold text-slate-655 outline-none focus:border-[#005139]"
              >
                <option value="Semua">Semua Rentang Waktu</option>
                <option value="today">Hari Ini</option>
                <option value="last-7">7 Hari Terakhir</option>
                <option value="last-30">30 Hari Terakhir</option>
              </select>

            </div>

          </div>

          {/* TABLE QUEST LIST */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-650">
                <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">ID & Judul Quest</th>
                    <th className="px-6 py-4">Kategori</th>
                    <th className="px-6 py-4">Tanggal Dibuat</th>
                    <th className="px-6 py-4">Deadline</th>
                    <th className="px-6 py-4">Pihak Kontrak</th>
                    <th className="px-6 py-4">Budget Escrow</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <div className="space-y-2 flex-1">
                            <div className="h-3.5 bg-slate-200 rounded w-44"></div>
                            <div className="h-2.5 bg-slate-200 rounded w-16"></div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-3 bg-slate-200 rounded w-20"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-3 bg-slate-200 rounded w-24"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-3 bg-slate-200 rounded w-24"></div>
                        </td>
                        <td className="px-6 py-4 space-y-1.5">
                          <div className="h-3 bg-slate-200 rounded w-28"></div>
                          <div className="h-2.5 bg-slate-200 rounded w-20"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-3.5 bg-slate-200 rounded w-16"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-5 bg-slate-200 rounded-full w-24"></div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="h-6 bg-slate-200 rounded w-6 mx-auto"></div>
                        </td>
                      </tr>
                    ))
                  ) : filteredQuests.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-12 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                          </svg>
                          <span className="font-extrabold text-sm text-slate-500">Tidak ada data ditemukan</span>
                          <button 
                            type="button" 
                            onClick={() => {
                              setSearchTerm('');
                              setStatusFilter('Semua');
                              setCategoryFilter('Semua');
                              setBudgetFilter('Semua');
                              setDateFilter('Semua');
                            }}
                            className="px-3.5 py-1.5 bg-[#005139] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer border-0"
                          >
                            Reset Filter
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredQuests.map((q) => {
                      // Status color styles mapping
                      let statusBadge = 'bg-slate-100 text-slate-600';
                      if (q.status === 'Dalam Proses') statusBadge = 'bg-blue-50 text-blue-700 border border-blue-100';
                      else if (q.status === 'Menunggu Konfirmasi') statusBadge = 'bg-amber-50 text-amber-700 border border-amber-100';
                      else if (q.status === 'Selesai') statusBadge = 'bg-emerald-50 text-emerald-700 border border-emerald-100';
                      else if (q.status === 'Dispute') statusBadge = 'bg-rose-50 text-rose-700 border border-rose-100';
                      else if (q.status === 'Dibatalkan' || q.status === 'Expired') statusBadge = 'bg-slate-50 text-slate-500 border border-slate-200';

                      return (
                        <tr key={q.id} className="hover:bg-slate-50/50 transition-colors">
                          
                          {/* ID & Judul */}
                          <td className="px-6 py-4 min-w-[200px]">
                            <p className="font-mono text-[9px] text-slate-400 font-medium">{q.id}</p>
                            <p className="font-bold text-slate-800 text-xs mt-0.5 line-clamp-1 hover:text-emerald-700 transition-colors cursor-pointer" onClick={() => setSelectedQuest(q)}>
                              {q.title}
                            </p>
                          </td>

                          {/* Kategori */}
                          <td className="px-6 py-4">
                            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold">
                              {q.category}
                            </span>
                          </td>

                          {/* Created date */}
                          <td className="px-6 py-4 text-xs font-medium text-slate-600">
                            {q.createdDate}
                          </td>

                          {/* Deadline */}
                          <td className="px-6 py-4 text-xs font-semibold text-slate-600">
                            {q.deadlineDate}
                          </td>

                          {/* Pihak (Creator vs Adventurer) */}
                          <td className="px-6 py-4 text-xs">
                            <p className="font-medium text-slate-500">Creator: <span className="font-bold text-slate-700">{q.creator}</span></p>
                            {q.adventurer && (
                              <p className="text-[10px] text-slate-450 mt-0.5">Adventurer: <span className="font-semibold text-slate-600">{q.adventurer}</span></p>
                            )}
                          </td>

                          {/* Budget */}
                          <td className="px-6 py-4 font-bold text-slate-800 text-xs">
                            Rp {q.budget.toLocaleString('id-ID')}
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black ${statusBadge}`}>
                              {q.status}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4 text-center">
                            <button 
                              onClick={() => setSelectedQuest(q)}
                              className="p-1 text-slate-400 hover:text-[#005139] hover:bg-emerald-50 rounded-lg transition-all cursor-pointer"
                            >
                              <Eye size={16} />
                            </button>
                          </td>

                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: AI MODERATION QUEUE */}
      {activeTab === 'moderasi' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
          
          {/* LEFT LIST PANEL */}
          <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden max-h-[600px]">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-sm">Flagged by AI</h3>
              <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-black rounded-full">
                {flaggedQuests.length} Peringatan
              </span>
            </div>
            
            <div className="overflow-y-auto divide-y divide-slate-100 flex-1">
              {flaggedQuests.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2 h-full">
                  <CheckCircle2 size={32} className="text-emerald-500 animate-bounce" />
                  <span className="font-bold">Moderasi Bersih!</span>
                  <span>Tidak ada quest yang mencurigakan saat ini.</span>
                </div>
              ) : (
                flaggedQuests.map((q) => (
                  <div 
                    key={q.id}
                    onClick={() => setSelectedFlaggedQuest(q)}
                    className={`p-4 flex flex-col gap-2 cursor-pointer transition-colors ${
                      selectedFlaggedQuest?.id === q.id ? 'bg-rose-50/20 border-l-4 border-rose-500' : 'hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-mono font-bold text-slate-400">{q.id}</span>
                      <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-[8px] font-black rounded">
                        RESIKO TINGGI
                      </span>
                    </div>
                    <p className="font-bold text-slate-800 text-xs line-clamp-1">{q.title}</p>
                    <div className="flex justify-between text-[10px] text-slate-450 mt-1">
                      <span>Creator: {q.creator}</span>
                      <span className="font-bold">Rp {q.budget.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RIGHT DETAIL PANEL */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between min-h-[500px]">
            {selectedFlaggedQuest ? (
              <div className="space-y-6 flex-1 flex flex-col justify-between">
                
                {/* Header detail */}
                <div className="border-b border-slate-150 pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-800">{selectedFlaggedQuest.title}</h3>
                      <p className="text-xs text-slate-400 font-medium mt-1">
                        Dibuat oleh: <span className="font-semibold text-slate-600">{selectedFlaggedQuest.creator}</span> • Budget: <span className="font-bold text-[#005139]">Rp {selectedFlaggedQuest.budget.toLocaleString('id-ID')}</span>
                      </p>
                    </div>
                    <span className="px-2.5 py-1 bg-rose-50 text-rose-750 text-[10px] font-black rounded-lg border border-rose-100 flex items-center gap-1 shrink-0">
                      <ShieldAlert size={12} /> AI Flagged
                    </span>
                  </div>
                </div>

                {/* AI Reason Detail */}
                <div className="space-y-3">
                  <div className="bg-rose-50/30 border border-rose-100 p-4 rounded-xl space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-rose-700 font-bold">
                      <AlertTriangle size={14} />
                      <span>Analisis Pelanggaran AI:</span>
                    </div>
                    <p className="text-xs text-slate-650 leading-relaxed font-semibold">
                      {selectedFlaggedQuest.aiFlagReason}
                    </p>
                  </div>

                  {/* Context snippet description */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Deskripsi Quest Terkait</span>
                    <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg leading-relaxed border border-slate-150">
                      {selectedFlaggedQuest.description}
                    </p>
                  </div>

                  {/* Obrolan Terdeteksi (if any) */}
                  {selectedFlaggedQuest.chatHistory.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Percakapan Terkait</span>
                      <div className="border border-slate-200 bg-slate-50/20 p-4 rounded-xl space-y-3 max-h-[300px] overflow-y-auto">
                        {selectedFlaggedQuest.chatHistory.map((chat, idx) => {
                          const isCreator = chat.sender === selectedFlaggedQuest.creator;
                          const roleLabel = isCreator ? '[Creator]' : '[Adventurer]';
                          return (
                            <div key={idx} className={`flex flex-col ${isCreator ? 'items-start' : 'items-end'}`}>
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <span className={`text-[9px] font-extrabold ${isCreator ? 'text-[#005139]' : 'text-indigo-650'}`}>
                                  {roleLabel} {chat.sender}
                                </span>
                                <span className="text-[8px] text-slate-400">• {chat.time}</span>
                              </div>
                              <div className={`px-3 py-2 rounded-xl text-xs max-w-[85%] leading-relaxed ${
                                isCreator 
                                  ? 'bg-slate-100 text-slate-800 rounded-tl-none font-medium' 
                                  : 'bg-emerald-50 text-emerald-950 border border-emerald-100 rounded-tr-none font-medium'
                              }`}>
                                {chat.message}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                </div>

                {/* Actions bottom */}
                <div className="border-t border-slate-100 pt-4 flex justify-end gap-2.5">
                  <button 
                    onClick={() => {
                      setConfirmRejectBlockQuestId(selectedFlaggedQuest.id);
                      setConfirmRejectBlockCreator(selectedFlaggedQuest.creator);
                    }}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Tolak & Blokir Pengguna
                  </button>
                  <button 
                    onClick={() => {
                      setConfirmRejectWarnQuestId(selectedFlaggedQuest.id);
                      setConfirmRejectWarnCreator(selectedFlaggedQuest.creator);
                    }}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Tolak & Peringatkan
                  </button>
                  <button 
                    onClick={() => handleApproveContinue(selectedFlaggedQuest.id)}
                    className="px-4 py-2 bg-[#005139] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Setujui Lanjutkan
                  </button>
                </div>

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 text-slate-400 py-16 flex-1">
                <ShieldAlert size={40} className="text-slate-300 animate-pulse" />
                <span className="font-bold">Tidak ada sengketa / flag terpilih</span>
                <span>Pilih item quest di menu antrian kiri untuk memeriksa parameter flagging AI.</span>
              </div>
            )}
          </div>

        </div>
      )}      {/* DETAIL QUEST SLIDE-OVER PANEL */}
      {selectedQuest && (
        <div className="fixed inset-0 z-[70] flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-305" 
            onClick={() => setSelectedQuest(null)}
          />
          
          {/* Slide-over panel content */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
            
            {/* Panel Header */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <span className="p-1 px-2.5 bg-emerald-50 text-[#005139] text-xs font-bold rounded-lg border border-emerald-100 font-mono">
                  {selectedQuest.id}
                </span>
                <span className="font-bold text-slate-800 text-sm">Detail Quest</span>
              </div>
              <button 
                onClick={() => setSelectedQuest(null)}
                className="p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Panel Body */}
            <div className="p-5 overflow-y-auto flex-1 space-y-5">
              
              {/* Header: ID, title, status badge */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Judul Quest</span>
                  <h3 className="font-bold text-slate-800 text-sm mt-0.5 leading-snug">{selectedQuest.title}</h3>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-black shrink-0 ${
                  selectedQuest.status === 'Dalam Proses' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                  selectedQuest.status === 'Menunggu Konfirmasi' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                  selectedQuest.status === 'Selesai' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                  selectedQuest.status === 'Dispute' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                  'bg-slate-50 text-slate-500 border border-slate-200'
                }`}>
                  {selectedQuest.status}
                </span>
              </div>

              {/* Creator Info: name, rating star, avatar */}
              <div className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-150 space-y-2.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block leading-none">Informasi Creator</span>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-700 font-extrabold flex items-center justify-center text-xs border border-slate-350 shrink-0 font-sans">
                    {getInitials(selectedQuest.creator)}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">{selectedQuest.creator}</span>
                    <span className="text-[10px] text-amber-550 font-bold block mt-0.5 flex items-center gap-1">
                      ★ 4.8 <span className="text-slate-400 font-normal">(Rating Creator)</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Adventurer Info: name, rating star, avatar */}
              <div className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-150 space-y-2.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block leading-none">Informasi Adventurer</span>
                {selectedQuest.adventurer ? (
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-50 text-[#005139] font-extrabold flex items-center justify-center text-xs border border-emerald-150 shrink-0 font-sans">
                      {getInitials(selectedQuest.adventurer)}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">{selectedQuest.adventurer}</span>
                      <span className="text-[10px] text-amber-555 font-bold block mt-0.5 flex items-center gap-1">
                        ★ 4.9 <span className="text-slate-400 font-normal">(Rating Adventurer)</span>
                      </span>
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 italic font-medium block">Belum ada Adventurer yang mengambil Quest ini.</span>
                )}
              </div>

              {/* Detail Quest Lengkap: kategori, budget escrow, deadline, deskripsi */}
              <div className="space-y-3 border-t border-slate-100 pt-4">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block leading-none">Detail Pekerjaan</span>
                <div className="grid grid-cols-2 gap-4 text-xs font-medium text-slate-655">
                  <div>
                    <span className="text-[8px] text-slate-400 block uppercase font-bold">Kategori</span>
                    <span className="text-slate-800 block font-bold mt-0.5">{selectedQuest.category}</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-400 block uppercase font-bold">Budget Escrow</span>
                    <span className="text-[#005139] block font-extrabold mt-0.5">Rp {selectedQuest.budget.toLocaleString('id-ID')}</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-400 block uppercase font-bold">Deadline</span>
                    <span className="text-slate-800 block font-bold mt-0.5">{selectedQuest.deadlineDate || '-'}</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-400 block uppercase font-bold">Lokasi</span>
                    <span className="text-slate-800 block font-semibold mt-0.5 truncate">{selectedQuest.location || 'Remote'}</span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <span className="text-[8px] text-slate-400 block uppercase font-bold">Deskripsi Tugas</span>
                  <p className="text-xs text-slate-700 bg-slate-50 border border-slate-150 p-3 rounded-lg leading-relaxed">
                    {selectedQuest.description}
                  </p>
                </div>
              </div>

              {/* Timeline Aktivitas */}
              <div className="space-y-3 border-t border-slate-100 pt-4">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block leading-none">Timeline Aktivitas</span>
                <div className="space-y-3 text-xs bg-slate-50/20 p-3.5 rounded-xl border border-slate-200">
                  {selectedQuest.timeline.map((log, idx) => (
                    <div key={idx} className="flex gap-2.5 items-start">
                      <div className="flex flex-col items-center shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#005139] mt-1.5" />
                        {idx !== selectedQuest.timeline.length - 1 && <span className="w-0.5 h-6 bg-slate-200 my-0.5" />}
                      </div>
                      <div>
                        <span className="text-[7px] text-slate-400 font-bold block leading-none">{log.time}</span>
                        <p className="text-slate-650 leading-relaxed font-semibold mt-1">{log.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Foto Bukti (jika status "Menunggu Konfirmasi" atau "Selesai") */}
              {(selectedQuest.status === 'Menunggu Konfirmasi' || selectedQuest.status === 'Selesai') && (
                <div className="space-y-3 border-t border-slate-100 pt-4">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block leading-none">Foto Bukti Penyelesaian</span>
                  <div className="border border-dashed border-slate-350 bg-slate-50/50 p-4 rounded-xl flex flex-col items-center justify-center text-center">
                    <ImageIcon size={22} className="text-slate-400 mb-1 shrink-0" />
                    <span className="text-xs font-bold text-slate-750">Foto Bukti Adventurer</span>
                    <span className="text-[9px] text-slate-400 font-mono mt-0.5">foto_bukti_quest_penyelesaian.jpg</span>
                    {selectedQuest.proofNotes && (
                      <p className="text-[10px] text-slate-500 italic mt-2 border-t border-slate-100 pt-1.5 w-full">
                        "{selectedQuest.proofNotes}"
                      </p>
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* Panel Actions Bottom Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col gap-2 shrink-0">
              {selectedQuest.status !== 'Selesai' && selectedQuest.status !== 'Dibatalkan' && (
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => handleForceComplete(selectedQuest.id)}
                    className="w-full py-2 bg-[#005139] hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer font-sans"
                  >
                    <CheckCircle size={14} /> Paksa Selesai
                  </button>

                  <button 
                    onClick={() => handleForceCancel(selectedQuest.id)}
                    className="w-full py-2 bg-white hover:bg-slate-50 text-rose-600 border border-rose-200 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer font-sans"
                  >
                    <XCircle size={14} /> Paksa Batalkan
                  </button>
                </div>
              )}

              {!selectedQuest.aiFlagged && selectedQuest.status !== 'Selesai' && selectedQuest.status !== 'Dibatalkan' && (
                <button 
                  onClick={() => handleMarkSuspicious(selectedQuest.id)}
                  className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-705 border border-amber-200 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer font-sans"
                >
                  <AlertTriangle size={14} /> Tandai Mencurigakan
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* REJECT & BLOCK CONFIRMATION MODAL */}
      {confirmRejectBlockQuestId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-sm w-full overflow-hidden animate-in zoom-in-95 duration-200 p-6 space-y-4 text-center">
            <div className="mx-auto w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center">
              <ShieldAlert size={24} />
            </div>
            <h3 className="font-extrabold text-slate-800 text-base">⚠️ Konfirmasi Tolak & Blokir</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Apakah Anda yakin ingin menolak quest ini dan memblokir pembuatnya ({confirmRejectBlockCreator}) secara permanen? Tindakan ini bersifat merusak dan tidak dapat dibatalkan.
            </p>
            <div className="flex gap-2.5 pt-2">
              <button 
                type="button"
                onClick={() => {
                  setConfirmRejectBlockQuestId(null);
                  setConfirmRejectBlockCreator('');
                  triggerToast('Aksi dibatalkan', 'error');
                }}
                className="flex-1 py-2 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl text-xs font-bold transition-colors cursor-pointer border-0 bg-white"
              >
                Batalkan
              </button>
              <button 
                type="button"
                onClick={() => {
                  handleRejectBlock(confirmRejectBlockQuestId, confirmRejectBlockCreator);
                  setConfirmRejectBlockQuestId(null);
                  setConfirmRejectBlockCreator('');
                }}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer border-0"
              >
                Ya, Tolak & Blokir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECT & WARN CONFIRMATION MODAL */}
      {confirmRejectWarnQuestId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-sm w-full overflow-hidden animate-in zoom-in-95 duration-200 p-6 space-y-4 text-center">
            <div className="mx-auto w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center">
              <AlertTriangle size={24} />
            </div>
            <h3 className="font-extrabold text-slate-800 text-base">⚠️ Konfirmasi Tolak & Peringatkan</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Apakah Anda yakin ingin menolak quest ini dan memberikan peringatan kepada pembuatnya ({confirmRejectWarnCreator})? Akun pembuat tidak akan diblokir.
            </p>
            <div className="flex gap-2.5 pt-2">
              <button 
                type="button"
                onClick={() => {
                  setConfirmRejectWarnQuestId(null);
                  setConfirmRejectWarnCreator('');
                  triggerToast('Aksi dibatalkan', 'error');
                }}
                className="flex-1 py-2 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl text-xs font-bold transition-colors cursor-pointer border-0 bg-white"
              >
                Batalkan
              </button>
              <button 
                type="button"
                onClick={() => {
                  handleRejectWarn(confirmRejectWarnQuestId, confirmRejectWarnCreator);
                  setConfirmRejectWarnQuestId(null);
                  setConfirmRejectWarnCreator('');
                }}
                className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer border-0"
              >
                Ya, Tolak & Peringatkan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}