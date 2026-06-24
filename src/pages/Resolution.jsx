import { useState, useEffect } from 'react';
import { 
  Search, 
  AlertTriangle, 
  Image as ImageIcon, 
  X, 
  CheckCircle2, 
  Scale, 
  CheckSquare,
  PlusCircle,
  UserCheck,
  Send,
  AlertOctagon,
  EyeOff
} from 'lucide-react';

// --- INITIAL SENGKETA/DISPUTE DATA ---

export const initialDisputes = [
  {
    questId: '#Q-7721',
    title: 'Antar Berkas Fisik ke Sudirman Office',
    creator: 'Dimas Anggara',
    adventurer: 'Agus Santoso',
    createdDate: '2026-06-21',
    status: 'Menunggu', // 'Menunggu', 'Dalam Proses', 'Selesai'
    urgency: 'Tinggi',
    pendingDays: 3, // Lama pending (older is higher priority)
    budget: 45000,
    complaint: 'Pekerja mengantarkan dokumen dengan amplop basah robek, dan ada lembaran berkas penting yang hilang di jalan.',
    proofImage: 'proof',
    proofNotes: 'Berkas sudah ditaruh di resepsionis lantai 2 dalam kondisi tertutup rapi.',
    chatHistory: [
      { sender: 'Dimas Anggara', time: '14:25', message: 'Tolong jangan sampai telat ya berkasnya penting.' },
      { sender: 'Agus Santoso', time: '17:28', message: 'Sudah saya titipkan di resepsionis pak.' },
      { sender: 'Dimas Anggara', time: '18:02', message: 'Loh, tapi amplopnya robek dan ada dokumen yang hilang! Saya tidak mau rilis pembayaran.' }
    ],
    timeline: [
      { time: '21 Jun 2026, 14:00', event: 'Quest dipublikasikan oleh Creator (Dimas Anggara)' },
      { time: '21 Jun 2026, 14:20', event: 'Adventurer (Agus Santoso) disetujui mengambil Quest' },
      { time: '21 Jun 2026, 17:30', event: 'Adventurer menyelesaikan pekerjaan & mengirim bukti' },
      { time: '21 Jun 2026, 18:00', event: 'Dispute dilaporkan oleh Creator (Dimas Anggara)' }
    ],
    decision: null,
    decisionNotes: ''
  },
  {
    questId: '#Q-8815',
    title: 'Jasa Bersih Kamar Mandi Kosan',
    creator: 'Ahmad Faisal',
    adventurer: 'Rian Prasetyo',
    createdDate: '2026-06-23',
    status: 'Dalam Proses',
    urgency: 'Sedang',
    pendingDays: 1,
    budget: 60000,
    complaint: 'Pemberi tugas komplain dinding kamar mandi masih berkerak hitam padahal sudah disikat selama satu jam.',
    proofImage: 'proof',
    proofNotes: 'Sudah saya sikat bersih pakai cairan pembersih karat, noda hitam lama tidak bisa hilang sempurna karena keramik rusak.',
    chatHistory: [
      { sender: 'Ahmad Faisal', time: '09:00', message: 'Tolong disikat bersih ya mas berkeraknya.' },
      { sender: 'Rian Prasetyo', time: '10:30', message: 'Sudah selesai mas.' },
      { sender: 'Ahmad Faisal', time: '10:45', message: 'Ini masih kotor hitam di pojokan deket bak air mas.' }
    ],
    timeline: [
      { time: '23 Jun 2026, 08:30', event: 'Quest dipublikasikan oleh Ahmad Faisal' },
      { time: '23 Jun 2026, 09:00', event: 'Adventurer disetujui' },
      { time: '23 Jun 2026, 10:35', event: 'Adventurer submit penyelesaian' },
      { time: '23 Jun 2026, 10:50', event: 'Dispute dilaporkan oleh Ahmad Faisal' }
    ],
    decision: null,
    decisionNotes: ''
  },
  {
    questId: '#Q-5529',
    title: 'Bantu Pindahan Meja Makan Kayu',
    creator: 'Hendra Wijaya',
    adventurer: 'Budi Kusuma',
    createdDate: '2026-06-19',
    status: 'Selesai',
    urgency: 'Rendah',
    pendingDays: 5,
    budget: 100000,
    complaint: 'Adventurer terlambat datang dari waktu janjian awal 1 jam, pemberi tugas minta kompensasi diskon budget setengahnya.',
    proofImage: 'proof',
    proofNotes: 'Meja sudah dipindahkan dengan selamat tanpa lecet sama sekali.',
    chatHistory: [
      { sender: 'Hendra Wijaya', time: '13:00', message: 'Mas kok belum datang? Katanya jam 1.' },
      { sender: 'Budi Kusuma', time: '13:45', message: 'Maaf pak tadi ban motor bocor dijalan.' }
    ],
    timeline: [
      { time: '19 Jun 2026, 10:00', event: 'Quest dipublikasikan oleh Hendra Wijaya' },
      { time: '19 Jun 2026, 11:00', event: 'Adventurer disetujui' },
      { time: '19 Jun 2026, 14:30', event: 'Adventurer submit penyelesaian' },
      { time: '19 Jun 2026, 15:00', event: 'Dispute dilaporkan oleh Hendra Wijaya' }
    ],
    decision: 'adventurer',
    decisionNotes: 'Toleransi keterlambatan karena kondisi ban bocor. Pekerjaan utama selesai 100% dengan selamat. Dana escrow penuh Rp 100.000 dilepas ke Adventurer.'
  },
  {
    questId: '#Q-9912',
    title: 'Jasa Beli & Antar Obat Apotek',
    creator: 'Rudi Hermawan',
    adventurer: 'Siti Aminah',
    createdDate: '2026-06-22',
    status: 'Menunggu',
    urgency: 'Tinggi',
    pendingDays: 2,
    budget: 35000,
    complaint: 'Adventurer membelikan merk obat generik yang berbeda dari resep foto awal, tanpa konfirmasi chat.',
    proofImage: 'proof',
    proofNotes: 'Apotek mengatakan merk utama kosong, obat ini zat aktif dan kegunaannya sama persis.',
    chatHistory: [
      { sender: 'Rudi Hermawan', time: '19:00', message: 'Tolong harus sama persis dengan resep ya.' },
      { sender: 'Siti Aminah', time: '19:40', message: 'Obat sudah saya taruh di depan pintu rumah.' }
    ],
    timeline: [
      { time: '22 Jun 2026, 18:30', event: 'Quest dibuat oleh Rudi Hermawan' },
      { time: '22 Jun 2026, 19:00', event: 'Adventurer mengambil tugas' },
      { time: '22 Jun 2026, 19:45', event: 'Adventurer submit penyelesaian' },
      { time: '22 Jun 2026, 20:00', event: 'Dispute dilaporkan oleh Rudi Hermawan' }
    ],
    decision: null,
    decisionNotes: ''
  }
];

// Helper to get initials
// Helper to get initials
const getInitials = (name) => {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// Helper to sanitize chat message (mask contact number, WA links, addresses)
const sanitizeChatMessage = (msg) => {
  if (!msg) return '';
  
  // 1. Phone numbers (Indonesian formats: e.g. 08123456789, +62 812-3456-7890, 62812 3456 7890)
  const phoneRegex = /(?:\+62|62|0)8[1-9](?:\s*-*\s*\d){7,11}\b/g;
  
  // 2. WhatsApp links (e.g. wa.me/628123456789, whatsapp.com/send?phone=...)
  const waRegex = /(?:https?:\/\/)?(?:www\.)?(?:wa\.me|whatsapp\.com)\/[a-zA-Z0-9-./?=&%+_]+/gi;
  
  // 3. Addresses (words starting with Jl., Jalan, Gg., Gang, Ruko, Apartemen, Komplek, Perumahan, Kosan)
  const addressRegex = /(?:jl\.|jalan|gg\.|gang|ruko|apartemen|kosan|perumahan|komplek)\s+[a-zA-Z0-9\s.,-]{3,50}\b/gi;
  
  let sanitized = msg;
  sanitized = sanitized.replace(phoneRegex, '[KONTAK DISEMBUNYIKAN]');
  sanitized = sanitized.replace(waRegex, '[KONTAK DISEMBUNYIKAN]');
  sanitized = sanitized.replace(addressRegex, '[KONTAK DISEMBUNYIKAN]');
  
  return sanitized;
};

// Helper to get minimum 4 chats for dispute
const getChatMessages = (dispute) => {
  const creatorName = dispute.creator;
  const adventurerName = dispute.adventurer;
  
  if (dispute.questId === '#Q-7721') {
    return [
      { sender: creatorName, time: '14:00', message: 'Halo mas, posisi di mana? Bisa tolong ambil berkasnya sekarang di Jl. Gatot Subroto No. 12?' },
      { sender: adventurerName, time: '14:05', message: 'Halo pak, saya sedang di jalan menuju ke sana.' },
      { sender: creatorName, time: '14:10', message: 'Oke, tolong kabari kalau sudah sampai ya.' },
      { sender: adventurerName, time: '14:20', message: 'Sudah sampai pak, saya di lobi utama.' },
      { sender: creatorName, time: '14:25', message: 'Tolong jangan sampai telat ya berkasnya penting. Kirim ke Jl. Jend Sudirman Kav 21.' },
      { sender: adventurerName, time: '14:30', message: 'Baik pak, segera saya antarkan.' },
      { sender: creatorName, time: '15:15', message: 'Bagaimana statusnya mas? Apakah sudah sampai?' },
      { sender: adventurerName, time: '15:20', message: 'Ini sedang macet di dekat bundaran Senayan pak.' },
      { sender: creatorName, time: '15:25', message: 'Hubungi saya di nomor HP 0812-3456-7890 jika ada kendala di jalan.' },
      { sender: adventurerName, time: '17:28', message: 'Sudah saya titipkan di resepsionis pak. Buktinya bisa dilihat di wa.me/628123456789 atau foto di sistem.' },
      { sender: creatorName, time: '18:02', message: 'Loh, tapi amplopnya robek dan ada dokumen yang hilang! Saya tidak mau rilis pembayaran.' },
      { sender: adventurerName, time: '18:10', message: 'Saya bawa dari lokasi aman kok pak, mungkin ada insiden saat saya serahkan di sana.' }
    ];
  } else if (dispute.questId === '#Q-8815') {
    return [
      { sender: creatorName, time: '09:00', message: 'Tolong disikat bersih ya mas berkeraknya.' },
      { sender: adventurerName, time: '10:30', message: 'Sudah selesai mas.' },
      { sender: creatorName, time: '10:45', message: 'Ini masih kotor hitam di pojokan deket bak air mas.' },
      { sender: adventurerName, time: '10:50', message: 'Itu noda hitam lama yang keramiknya sudah rusak berpori pak, tidak bisa hilang hanya dengan sikat.' }
    ];
  } else if (dispute.questId === '#Q-5529') {
    return [
      { sender: creatorName, time: '13:00', message: 'Mas kok belum datang? Katanya jam 1.' },
      { sender: adventurerName, time: '13:45', message: 'Maaf pak tadi ban motor bocor dijalan.' },
      { sender: creatorName, time: '14:00', message: 'Aduh harusnya kabarin dulu dong mas, saya ada agenda lain.' },
      { sender: adventurerName, time: '14:05', message: 'Iya pak mohon maaf sekali, sekarang saya sudah sampai di depan.' }
    ];
  } else if (dispute.questId === '#Q-9912') {
    return [
      { sender: creatorName, time: '19:00', message: 'Tolong harus sama persis dengan resep ya.' },
      { sender: adventurerName, time: '19:40', message: 'Obat sudah saya taruh di depan pintu rumah.' },
      { sender: creatorName, time: '19:45', message: 'Loh ini generik beda merk dari foto resep mas, tidak ada konfirmasi.' },
      { sender: adventurerName, time: '19:50', message: 'Apoteker bilang khasiat dan kandungannya sama persis pak, karena merk itu sedang kosong.' }
    ];
  }
  
  return [
    { sender: creatorName, time: '10:00', message: 'Apakah pekerjaan sudah selesai sesuai instruksi?' },
    { sender: adventurerName, time: '10:15', message: 'Sudah selesai dikerjakan semuanya.' },
    { sender: creatorName, time: '10:20', message: 'Tapi ada beberapa bagian yang belum rapi dan kurang bersih.' },
    { sender: adventurerName, time: '10:30', message: 'Mohon maaf, saya sudah usahakan yang terbaik sesuai kesepakatan.' }
  ];
};

// Helper to get structured timeline steps with Icons
const getTimelineSteps = (dispute, PlusCircleIcon, UserCheckIcon, SendIcon, AlertOctagonIcon) => {
  const defaultTimes = [
    '21 Jun 2026, 14:00',
    '21 Jun 2026, 14:20',
    '21 Jun 2026, 17:30',
    '21 Jun 2026, 18:00'
  ];
  
  return [
    { label: 'Quest dibuat', time: dispute.timeline[0]?.time || defaultTimes[0], icon: PlusCircleIcon },
    { label: 'Adventurer diterima', time: dispute.timeline[1]?.time || defaultTimes[1], icon: UserCheckIcon },
    { label: 'Bukti dikirim', time: dispute.timeline[2]?.time || defaultTimes[2], icon: SendIcon },
    { label: 'Dispute dibuka', time: dispute.timeline[3]?.time || defaultTimes[3], icon: AlertOctagonIcon }
  ];
};

export default function Resolution({ disputes = initialDisputes, setDisputes = () => {} }) {
  // Loading state for tables
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [urgencyFilter, setUrgencyFilter] = useState('Semua');
  const [dateFilter, setDateFilter] = useState('Semua');

  // Detail & Decision State
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [chosenWinner, setChosenWinner] = useState(''); // 'creator', 'adventurer', 'split'
  const [decisionNotes, setDecisionNotes] = useState('');
  const [showAllChats, setShowAllChats] = useState(false);
  const [accessLogs, setAccessLogs] = useState({});

  const handleSelectDispute = (disp) => {
    setSelectedDispute(disp);
    setChosenWinner('');
    setDecisionNotes('');
    setShowAllChats(false);

    const now = new Date();
    const day = now.getDate();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timestamp = `${day} ${month} ${year}, ${hours}:${minutes}:${seconds}`;

    setAccessLogs(prev => ({
      ...prev,
      [disp.questId]: {
        admin: 'Super Admin',
        timestamp: timestamp
      }
    }));
  };

  // Notification Toast
  const [toastMsg, setToastMsg] = useState('');

  const triggerToast = (msg, type = 'success') => {
    if (window.showToast) {
      window.showToast(msg, type);
    } else {
      setToastMsg(msg);
      setTimeout(() => setToastMsg(''), 3000);
    }
  };

  // --- STATISTIK DISPUTE CALCULATIONS ---
  // Mock monthly count
  const totalDisputesThisMonth = disputes.length + 8; // Mock value including historic resolved ones
  const averageResolutionTime = "14.2 Jam"; // Mock avg time
  
  // Win rates calculations
  const resolvedDisputes = disputes.filter(d => d.status === 'Selesai');
  const creatorWins = resolvedDisputes.filter(d => d.decision === 'creator').length + 5; // Mock historic
  const adventurerWins = resolvedDisputes.filter(d => d.decision === 'adventurer').length + 3; // Mock historic
  const totalWins = creatorWins + adventurerWins;
  const creatorWinRate = totalWins > 0 ? ((creatorWins / totalWins) * 100).toFixed(0) : 60;
  const adventurerWinRate = totalWins > 0 ? ((adventurerWins / totalWins) * 100).toFixed(0) : 40;

  // --- FILTER & SORTING (LAMA PENDING PALING LAMA DI ATAS) ---
  const filteredDisputes = disputes
    .filter(disp => {
      const matchSearch = searchTerm === '' ||
        disp.questId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        disp.creator.toLowerCase().includes(searchTerm.toLowerCase()) ||
        disp.adventurer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        disp.title.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'Semua' || disp.status === statusFilter;
      const matchUrgency = urgencyFilter === 'Semua' || disp.urgency === urgencyFilter;

      let matchDate = true;
      if (dateFilter === 'today') {
        matchDate = disp.createdDate === '2026-06-24';
      } else if (dateFilter === 'last-7') {
        matchDate = disp.createdDate >= '2026-06-17';
      }

      return matchSearch && matchStatus && matchUrgency && matchDate;
    })
    // Priority sorting: oldest pending days at the top (lama pending yang paling lama di atas)
    .sort((a, b) => b.pendingDays - a.pendingDays);

  // Resolve sengketa handler
  const handleResolveDispute = (e) => {
    e.preventDefault();
    if (!chosenWinner) {
      triggerToast('Silakan pilih pihak pemenang dispute.');
      return;
    }
    if (!decisionNotes.trim()) {
      triggerToast('Mohon masukkan catatan penjelasan keputusan.');
      return;
    }

    const updatedTimeline = [
      ...selectedDispute.timeline,
      { 
        time: '24 Jun 2026, 14:15', 
        event: `Sengketa diselesaikan admin. Pemenang: ${
          chosenWinner === 'creator' ? 'Creator (Refund Penuh)' : 
          chosenWinner === 'adventurer' ? 'Adventurer (Rilis Dana)' : 'Bagi Hasil (50/50)'
        }. Catatan: ${decisionNotes}` 
      }
    ];

    const updatedDisp = {
      ...selectedDispute,
      status: 'Selesai',
      decision: chosenWinner,
      decisionNotes: decisionNotes,
      timeline: updatedTimeline
    };

    // Process dispute in state
    setDisputes(prev => prev.map(disp => {
      if (disp.questId === selectedDispute.questId) {
        return updatedDisp;
      }
      return disp;
    }));

    // Keep detail panel open with updated information
    setSelectedDispute(updatedDisp);

    // Generate toast detail
    let payoutDesc;
    if (chosenWinner === 'creator') {
      payoutDesc = `Escrow Rp ${selectedDispute.budget.toLocaleString('id-ID')} di-refund ke Creator.`;
    } else if (chosenWinner === 'adventurer') {
      payoutDesc = `Escrow Rp ${selectedDispute.budget.toLocaleString('id-ID')} dirilis ke Adventurer.`;
    } else {
      payoutDesc = `Escrow Rp ${selectedDispute.budget.toLocaleString('id-ID')} dibagi rata 50/50.`;
    }

    triggerToast(`Dispute Selesai! ${payoutDesc}`);
    setChosenWinner('');
    setDecisionNotes('');
  };

  const handleHoldDispute = () => {
    if (!selectedDispute) return;

    const updatedTimeline = [
      ...selectedDispute.timeline,
      { 
        time: '24 Jun 2026, 14:15', 
        event: 'Sengketa ditunda oleh admin untuk informasi tambahan.' 
      }
    ];

    const updatedDisp = {
      ...selectedDispute,
      status: 'Dalam Proses',
      timeline: updatedTimeline
    };

    setDisputes(prev => prev.map(disp => {
      if (disp.questId === selectedDispute.questId) {
        return updatedDisp;
      }
      return disp;
    }));

    setSelectedDispute(updatedDisp);
    triggerToast('Penyelesaian dispute ditunda. Permintaan informasi tambahan dikirim.');
  };

  const pendingOverTwoDaysCount = disputes.filter(disp => disp.status !== 'Selesai' && disp.pendingDays > 2).length;

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
          <h2 className="text-2xl font-bold text-slate-800">Manajemen Dispute</h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">Mediasi perselisihan, arbitrase escrow, dan pemutusan pemenang sengketa Quest.</p>
        </div>
      </div>

      {/* STATISTIK DISPUTE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Total Dispute Bulan Ini */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1">TOTAL DISPUTE BULAN INI</p>
            <h3 className="text-3xl font-black text-slate-850">{totalDisputesThisMonth} Kasus</h3>
          </div>
          <span className="text-[10px] text-slate-400 mt-3 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 100% termonitor sistem
          </span>
        </div>

        {/* Card 2: Rata-rata Waktu Penyelesaian */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1">RATA-RATA WAKTU PENYELESAIAN</p>
            <h3 className="text-3xl font-black text-slate-850">{averageResolutionTime}</h3>
          </div>
          <span className="text-[10px] text-slate-400 mt-3 font-medium">
            Meningkat 1.2 jam lebih cepat dari bulan lalu
          </span>
        </div>

        {/* Card 3: Persentase Dimenangkan */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1">RASIO KEPUTUSAN SENGKETA</p>
            <div className="flex justify-between items-center text-xs font-bold text-slate-700 mt-1">
              <span>Creator ({creatorWinRate}%)</span>
              <span>Adventurer ({adventurerWinRate}%)</span>
            </div>
            
            {/* Horizontal progress bar */}
            <div className="w-full h-2.5 bg-indigo-200 rounded-full overflow-hidden flex mt-2">
              <div className="h-full bg-[#005139]" style={{ width: `${creatorWinRate}%` }} />
              <div className="h-full bg-indigo-500" style={{ width: `${adventurerWinRate}%` }} />
            </div>
          </div>
          <span className="text-[9px] text-slate-400 mt-3 font-medium">
            Warna hijau: Creator • Warna indigo: Adventurer
          </span>
        </div>

      </div>

      {/* WARNING BADGE */}
      {pendingOverTwoDaysCount > 0 && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 flex items-center gap-3 text-xs font-bold shadow-xs transition-all duration-200">
          <span className="text-base shrink-0">⚠️</span>
          <span>{pendingOverTwoDaysCount} dispute telah menunggu lebih dari 2 hari — segera tangani</span>
        </div>
      )}

      {/* FILTER & BASIS DATA DISPUTE CONTAINER FOR SPLIT-PANEL */}
      <div className={`grid grid-cols-1 ${selectedDispute ? 'lg:grid-cols-12' : ''} gap-6 items-start`}>
        
        {/* LEFT PANEL: TABLE LIST */}
        <div className={`${selectedDispute ? 'lg:col-span-6 xl:col-span-7' : 'lg:col-span-12'} transition-all duration-300`}>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            
            {/* Table Filters Header */}
            <div className="p-4 border-b border-slate-150 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-800 text-sm">Antrian Sengketa Aktif</h3>
                <span className="text-[10px] px-2 py-0.5 bg-rose-50 text-rose-700 rounded-md font-extrabold border border-rose-100">
                  {filteredDisputes.filter(d => d.status !== 'Selesai').length} Perlu Penanganan
                </span>
              </div>

              <div className={`grid grid-cols-1 ${selectedDispute ? 'sm:grid-cols-2' : 'sm:grid-cols-4'} gap-2.5`}>
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                  <input 
                    type="text" 
                    placeholder="Cari ID / User / Judul..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className="w-full pl-8 pr-3 py-1.5 border border-slate-250 bg-white rounded-lg text-xs font-semibold outline-none focus:border-[#005139]"
                  />
                </div>

                {/* Filter Status */}
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)} 
                  className="px-3 py-1.5 border border-slate-250 bg-white rounded-lg text-xs font-bold text-slate-600 outline-none focus:border-[#005139]"
                >
                  <option value="Semua">Semua Status</option>
                  <option value="Menunggu">Menunggu Tinjauan</option>
                  <option value="Dalam Proses">Dalam Proses</option>
                  <option value="Selesai">Diselesaikan</option>
                </select>

                {/* Filter Urgensi */}
                <select 
                  value={urgencyFilter} 
                  onChange={(e) => setUrgencyFilter(e.target.value)} 
                  className="px-3 py-1.5 border border-slate-250 bg-white rounded-lg text-xs font-bold text-slate-600 outline-none focus:border-[#005139]"
                >
                  <option value="Semua">Semua Urgensi</option>
                  <option value="Tinggi">Tinggi</option>
                  <option value="Sedang">Sedang</option>
                  <option value="Rendah">Rendah</option>
                </select>

                {/* Filter Tanggal */}
                <select 
                  value={dateFilter} 
                  onChange={(e) => setDateFilter(e.target.value)} 
                  className="px-3 py-1.5 border border-slate-250 bg-white rounded-lg text-xs font-bold text-slate-600 outline-none focus:border-[#005139]"
                >
                  <option value="Semua">Semua Waktu</option>
                  <option value="today">Hari Ini</option>
                  <option value="last-7">7 Hari Terakhir</option>
                </select>
              </div>
            </div>

            {/* Disputes Table Element */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-650">
                <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">ID Quest & Judul</th>
                    <th className={`px-6 py-4 ${selectedDispute ? 'hidden xl:table-cell' : ''}`}>Pemberi (Creator)</th>
                    <th className={`px-6 py-4 ${selectedDispute ? 'hidden xl:table-cell' : ''}`}>Penerima (Adventurer)</th>
                    <th className={`px-6 py-4 ${selectedDispute ? 'hidden md:table-cell' : ''}`}>Tanggal Masuk</th>
                    <th className="px-6 py-4">Urgensi</th>
                    <th className="px-6 py-4 text-center">Lama Pending</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        {/* ID Quest & Judul */}
                        <td className="px-6 py-4">
                          <div className="h-2 bg-slate-200 rounded w-10 mb-1"></div>
                          <div className="h-3.5 bg-slate-200 rounded w-28"></div>
                        </td>
                        {/* Creator */}
                        <td className={`px-6 py-4 ${selectedDispute ? 'hidden xl:table-cell' : ''}`}>
                          <div className="h-3 bg-slate-200 rounded w-20"></div>
                        </td>
                        {/* Adventurer */}
                        <td className={`px-6 py-4 ${selectedDispute ? 'hidden xl:table-cell' : ''}`}>
                          <div className="h-3 bg-slate-200 rounded w-20"></div>
                        </td>
                        {/* Tanggal Masuk */}
                        <td className={`px-6 py-4 ${selectedDispute ? 'hidden md:table-cell' : ''}`}>
                          <div className="h-3 bg-slate-200 rounded w-20"></div>
                        </td>
                        {/* Urgensi */}
                        <td className="px-6 py-4">
                          <div className="h-5 bg-slate-200 rounded w-12"></div>
                        </td>
                        {/* Lama Pending */}
                        <td className="px-6 py-4 text-center">
                          <div className="h-3 bg-slate-200 rounded w-10 mx-auto"></div>
                        </td>
                        {/* Status */}
                        <td className="px-6 py-4">
                          <div className="h-5 bg-slate-200 rounded w-16"></div>
                        </td>
                        {/* Aksi */}
                        <td className="px-6 py-4 text-center">
                          <div className="h-8 bg-slate-200 rounded-lg w-16 mx-auto"></div>
                        </td>
                      </tr>
                    ))
                  ) : filteredDisputes.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-12 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <Scale className="w-12 h-12 text-slate-305" />
                          <span className="font-extrabold text-sm text-slate-500 font-sans">Tidak ada data ditemukan</span>
                          <button 
                            type="button" 
                            onClick={() => {
                              setSearchTerm('');
                              setStatusFilter('Semua');
                              setUrgencyFilter('Semua');
                              setDateFilter('Semua');
                            }}
                            className="px-3.5 py-1.5 bg-[#005139] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer border-0 font-sans"
                          >
                            Reset Filter
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredDisputes.map((disp) => {
                      let badgeColor = 'bg-slate-100 text-slate-600';
                      if (disp.status === 'Menunggu') badgeColor = 'bg-rose-50 text-rose-700 border border-rose-100';
                      else if (disp.status === 'Dalam Proses') badgeColor = 'bg-amber-50 text-amber-705 border border-amber-100';
                      else if (disp.status === 'Selesai') badgeColor = 'bg-emerald-50 text-emerald-700 border border-emerald-100';

                      let urgencyBadge = 'bg-slate-50 text-slate-600';
                      if (disp.urgency === 'Tinggi') urgencyBadge = 'bg-red-100 text-red-700 font-black';
                      else if (disp.urgency === 'Sedang') urgencyBadge = 'bg-amber-100 text-amber-700 font-bold';

                      const isCurrentSelection = selectedDispute?.questId === disp.questId;

                      return (
                        <tr 
                          key={disp.questId} 
                          className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${
                            isCurrentSelection ? 'bg-emerald-50/15 font-semibold border-l-4 border-l-[#005139]' : ''
                          }`}
                          onClick={() => handleSelectDispute(disp)}
                        >
                          
                          {/* ID Quest & Judul */}
                          <td className="px-6 py-4">
                            <span className="font-mono text-[9px] text-slate-400 font-bold">{disp.questId}</span>
                            <p className="font-bold text-slate-800 text-xs mt-0.5 line-clamp-1">
                              {disp.title}
                            </p>
                          </td>

                          {/* Creator */}
                          <td className={`px-6 py-4 text-xs font-semibold text-slate-700 ${selectedDispute ? 'hidden xl:table-cell' : ''}`}>
                            {disp.creator}
                          </td>

                          {/* Adventurer */}
                          <td className={`px-6 py-4 text-xs font-semibold text-slate-700 ${selectedDispute ? 'hidden xl:table-cell' : ''}`}>
                            {disp.adventurer}
                          </td>

                          {/* Tanggal Masuk */}
                          <td className={`px-6 py-4 text-xs font-medium text-slate-600 ${selectedDispute ? 'hidden md:table-cell' : ''}`}>
                            {disp.createdDate}
                          </td>

                          {/* Urgensi */}
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded text-[9px] ${urgencyBadge}`}>
                              {disp.urgency}
                            </span>
                          </td>

                          {/* Lama Pending */}
                          <td className="px-6 py-4 text-center font-bold text-xs text-rose-600">
                            {disp.status !== 'Selesai' ? `${disp.pendingDays} Hari` : '-'}
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black ${badgeColor}`}>
                              {disp.status}
                            </span>
                          </td>

                          {/* Aksi */}
                          <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                            <button 
                              onClick={() => handleSelectDispute(disp)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                                isCurrentSelection 
                                  ? 'bg-[#005139] text-white border-[#005139]' 
                                  : 'bg-slate-50 hover:bg-[#005139] hover:text-white text-slate-700 border-slate-200'
                              }`}
                            >
                              Tinjau
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

        {/* RIGHT PANEL: DETAIL DISPUTE */}
        {selectedDispute && (
          <div className="lg:col-span-6 xl:col-span-5 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
            
            {/* Detail Header */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <span className="p-1 px-2.5 bg-rose-50 text-rose-700 text-xs font-bold rounded-lg border border-rose-100 flex items-center gap-1.5">
                  <AlertTriangle size={13} /> Panel Tinjauan
                </span>
                <span className="font-mono text-xs text-slate-400 font-bold">{selectedDispute.questId}</span>
              </div>
              <button 
                onClick={() => {
                  setSelectedDispute(null);
                  setChosenWinner('');
                  setDecisionNotes('');
                }}
                className="p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Detail Body */}
            <div className="p-5 space-y-5 max-h-[calc(100vh-220px)] overflow-y-auto">
              
              {/* Header Info: Title & Urgensi */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Judul Quest</span>
                  <h3 className="font-bold text-slate-800 text-sm mt-0.5 leading-snug">{selectedDispute.title}</h3>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-black shrink-0 ${
                  selectedDispute.urgency === 'Tinggi' ? 'bg-red-100 text-red-700 font-black' :
                  selectedDispute.urgency === 'Sedang' ? 'bg-amber-100 text-amber-700 font-bold' :
                  'bg-slate-100 text-slate-600 font-semibold'
                }`}>
                  {selectedDispute.urgency}
                </span>
              </div>

              {/* Informasi Pihak: Creator vs Adventurer */}
              <div className="grid grid-cols-2 gap-4 border-t border-b border-slate-100 py-3.5">
                {/* Creator (Left) */}
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 font-extrabold flex items-center justify-center text-xs border border-slate-200 shrink-0">
                    {getInitials(selectedDispute.creator)}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Creator</span>
                    <span className="text-xs font-bold text-slate-800 block truncate">{selectedDispute.creator}</span>
                  </div>
                </div>
                
                {/* Adventurer (Right) */}
                <div className="flex items-center gap-2.5 justify-end text-right">
                  <div className="min-w-0">
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Adventurer</span>
                    <span className="text-xs font-bold text-slate-800 block truncate">{selectedDispute.adventurer}</span>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-emerald-50 text-[#005139] font-extrabold flex items-center justify-center text-xs border border-emerald-100 shrink-0">
                    {getInitials(selectedDispute.adventurer)}
                  </div>
                </div>
              </div>

              {/* Budget Info */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50/50 p-3 rounded-lg border border-slate-150 text-[11px] font-medium text-slate-655">
                <div>
                  <span className="text-slate-400 text-[8px] font-bold uppercase tracking-wider block">Escrow Budget</span>
                  <span className="font-extrabold text-[#005139] text-xs">Rp {selectedDispute.budget.toLocaleString('id-ID')}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[8px] font-bold uppercase tracking-wider block">Lama Pending</span>
                  <span className="font-bold text-rose-600 text-xs">{selectedDispute.status !== 'Selesai' ? `${selectedDispute.pendingDays} Hari` : '-'}</span>
                </div>
              </div>

              {/* Alasan Dispute Creator (Rose-50 Box) */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Alasan Komplain (Creator)</span>
                <div className="p-3 bg-rose-50 text-rose-900 text-xs font-semibold rounded-xl border border-rose-100 leading-relaxed italic">
                  "{selectedDispute.complaint}"
                </div>
              </div>

              {/* Bukti Foto Penyelesaian (Dashed Border Placeholder) */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Bukti Foto Penyelesaian (Adventurer)</span>
                <div className="border border-dashed border-slate-300 bg-slate-50/30 p-4 rounded-xl flex flex-col items-center justify-center text-center">
                  <ImageIcon size={22} className="text-slate-400 mb-1" />
                  <span className="text-xs font-bold text-slate-700">Foto Bukti Adventurer</span>
                  <span className="text-[9px] text-slate-400 font-mono mt-0.5">foto_bukti_quest.jpg</span>
                  {selectedDispute.proofNotes && (
                    <p className="text-[10px] text-slate-550 italic mt-2 border-t border-slate-100 pt-1.5 w-full">
                      "{selectedDispute.proofNotes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Riwayat Chat (minimum 4 messages: creator left slate-100, adventurer right emerald-50) */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Riwayat Chat Percakapan</span>
                
                {/* Banner Peringatan */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-3 flex items-start gap-2.5">
                  <EyeOff className="text-amber-600 shrink-0 mt-0.5" size={16} />
                  <p className="text-xs text-amber-800 font-semibold leading-relaxed">
                    Riwayat percakapan ini bersifat rahasia dan hanya ditampilkan untuk keperluan penyelesaian sengketa. Dilarang menyalin atau mendistribusikan isi percakapan ini.
                  </p>
                </div>

                {(() => {
                  const allChats = getChatMessages(selectedDispute);
                  const visibleChats = showAllChats ? allChats : allChats.slice(-10);
                  return (
                    <>
                      <div className="border border-slate-200 rounded-xl bg-slate-50/20 p-3.5 space-y-3 max-h-[220px] overflow-y-auto">
                        {allChats.length > 10 && !showAllChats && (
                          <div className="flex justify-center pb-2">
                            <button
                              type="button"
                              onClick={() => setShowAllChats(true)}
                              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-bold transition-all cursor-pointer border border-slate-200 animate-pulse-subtle"
                            >
                              Muat Pesan Sebelumnya
                            </button>
                          </div>
                        )}
                        {visibleChats.map((chat, idx) => {
                          const isCreator = chat.sender === selectedDispute.creator;
                          return (
                            <div key={idx} className={`flex flex-col ${isCreator ? 'items-start' : 'items-end'}`}>
                              <div className="flex items-center gap-1 mb-0.5">
                                <span className="text-[8px] font-bold text-slate-400">
                                  {chat.sender} ({isCreator ? 'Creator' : 'Adventurer'})
                                </span>
                                <span className="text-[7px] text-slate-400">• {chat.time}</span>
                              </div>
                              <div className={`px-2.5 py-1.5 rounded-xl text-xs max-w-[85%] leading-relaxed ${
                                isCreator 
                                  ? 'bg-slate-100 text-slate-800 rounded-tl-none font-medium' 
                                  : 'bg-emerald-50 text-emerald-950 border border-emerald-100 rounded-tr-none font-medium'
                              }`}>
                                {sanitizeChatMessage(chat.message)}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {accessLogs[selectedDispute.questId] && (
                        <p className="text-xs text-slate-400 italic text-right mt-2">
                          Akses percakapan ini dicatat: Admin {accessLogs[selectedDispute.questId].admin} pada {accessLogs[selectedDispute.questId].timestamp}
                        </p>
                      )}
                    </>
                  );
                })()}
              </div>

              {/* Timeline Aktivitas Quest (Quest dibuat → Adventurer diterima → Bukti dikirim → Dispute dibuka) */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Timeline Aktivitas Quest</span>
                <div className="border border-slate-200 rounded-xl p-3.5 bg-white space-y-3.5">
                  {getTimelineSteps(selectedDispute, PlusCircle, UserCheck, Send, AlertOctagon).map((step, idx) => {
                    const IconComponent = step.icon;
                    return (
                      <div key={idx} className="flex gap-2.5 items-start">
                        <div className="flex flex-col items-center shrink-0">
                          <div className="p-0.5 rounded-full bg-slate-50 border border-slate-200 text-slate-500">
                            <IconComponent size={12} />
                          </div>
                          {idx < 3 && <div className="w-0.5 h-5 bg-slate-100 my-0.5" />}
                        </div>
                        <div className="min-w-0">
                          <span className="text-[7px] text-slate-400 font-bold block leading-none">{step.time}</span>
                          <p className="text-xs font-semibold text-slate-700 mt-0.5 leading-none">{step.label}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Form Keputusan / Keputusan Tuntas */}
              {selectedDispute.status !== 'Selesai' ? (
                <form onSubmit={handleResolveDispute} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3.5">
                  <div className="flex items-center gap-1.5 text-slate-800 font-bold text-xs border-b border-slate-200 pb-1.5 uppercase tracking-wide">
                    <Scale size={13} className="text-[#005139]" />
                    <span>Form Keputusan Admin</span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[9px] font-bold text-slate-600 uppercase tracking-wider">Tentukan Pihak Pemenang *</label>
                    <div className="space-y-2">
                      {/* Option 1: Creator */}
                      <label className={`flex items-start gap-2.5 p-2 border-2 rounded-lg cursor-pointer transition-all ${
                        chosenWinner === 'creator' ? 'border-[#005139] bg-emerald-50/10' : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}>
                        <input 
                          type="radio" 
                          name="winner" 
                          value="creator" 
                          checked={chosenWinner === 'creator'}
                          onChange={(e) => setChosenWinner(e.target.value)}
                          className="mt-0.5 text-[#005139] focus:ring-[#005139] shrink-0"
                          required
                        />
                        <div className="text-xs">
                          <span className="font-bold text-slate-800 block leading-tight">Menangkan Creator (Refund ke Creator)</span>
                          <span className="text-[9px] text-slate-400 block mt-0.5 leading-none">
                            Dana escrow akan dikembalikan penuh ke Creator.
                          </span>
                        </div>
                      </label>

                      {/* Option 2: Adventurer */}
                      <label className={`flex items-start gap-2.5 p-2 border-2 rounded-lg cursor-pointer transition-all ${
                        chosenWinner === 'adventurer' ? 'border-[#005139] bg-emerald-50/10' : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}>
                        <input 
                          type="radio" 
                          name="winner" 
                          value="adventurer" 
                          checked={chosenWinner === 'adventurer'}
                          onChange={(e) => setChosenWinner(e.target.value)}
                          className="mt-0.5 text-[#005139] focus:ring-[#005139] shrink-0"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-slate-800 block leading-tight">Menangkan Adventurer (Rilis ke Adventurer)</span>
                          <span className="text-[9px] text-slate-400 block mt-0.5 leading-none">
                            Dana escrow akan ditransfer penuh ke Adventurer.
                          </span>
                        </div>
                      </label>

                      {/* Option 3: Bagi Hasil */}
                      <label className={`flex items-start gap-2.5 p-2 border-2 rounded-lg cursor-pointer transition-all ${
                        chosenWinner === 'split' ? 'border-[#005139] bg-emerald-50/10' : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}>
                        <input 
                          type="radio" 
                          name="winner" 
                          value="split" 
                          checked={chosenWinner === 'split'}
                          onChange={(e) => setChosenWinner(e.target.value)}
                          className="mt-0.5 text-[#005139] focus:ring-[#005139] shrink-0"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-slate-800 block leading-tight">Bagi Hasil (50/50)</span>
                          <span className="text-[9px] text-slate-400 block mt-0.5 leading-none">
                            Dana dibagi rata (masing-masing mendapat Rp {(selectedDispute.budget / 2).toLocaleString('id-ID')}).
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold text-slate-600 uppercase tracking-wider">Catatan Keputusan Admin *</label>
                    <textarea 
                      rows="3"
                      placeholder="Masukkan catatan dan pertimbangan keputusan..."
                      value={decisionNotes}
                      onChange={(e) => setDecisionNotes(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-250 bg-white rounded-lg text-xs font-semibold outline-none focus:border-[#005139]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1.5">
                    <button 
                      type="submit"
                      className="w-full py-2 bg-[#005139] hover:bg-[#00432f] text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CheckSquare size={13} /> Selesaikan Dispute
                    </button>
                    <button 
                      type="button"
                      onClick={handleHoldDispute}
                      className="w-full py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-250 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      Tunda / Minta Info Tambahan
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                    <CheckCircle2 size={14} />
                    <span>Dispute ini telah diselesaikan (Tuntas)</span>
                  </div>
                  <div className="text-slate-650 leading-relaxed font-semibold">
                    <span className="font-bold text-slate-800">Keputusan Arbitrase: </span> 
                    {selectedDispute.decision === 'creator' ? 'Dimenangkan oleh Creator (Refund Penuh)' :
                     selectedDispute.decision === 'adventurer' ? 'Dimenangkan oleh Adventurer (Pembayaran Penuh)' : 'Bagi Hasil (50/50)'}
                  </div>
                  <div className="text-slate-650 leading-relaxed font-normal">
                    <span className="font-bold text-slate-800">Catatan Mediator: </span> 
                    "{selectedDispute.decisionNotes}"
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

      </div>

    </div>
  );
}