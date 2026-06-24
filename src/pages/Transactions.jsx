import { useState, useEffect } from 'react';
import { 
  Download, 
  TrendingUp, 
  Lock, 
  Wallet, 
  CheckCircle2, 
  Search, 
  Banknote, 
  DollarSign, 
  Clock,
  XCircle
} from 'lucide-react';
import { 
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

// --- INITIAL MOCK DATASETS ---

const initialTopUps = [
  { id: 'TXN-TU01', user: 'Budi Kusuma', amount: 50000, method: 'BCA Virtual Account', vaNumber: '88012081234567890', time: '24 Jun 2026, 09:30', status: 'Berhasil' },
  { id: 'TXN-TU02', user: 'Siti Rahma', amount: 150000, method: 'Mandiri Virtual Account', vaNumber: '89512085678901234', time: '24 Jun 2026, 09:12', status: 'Pending' },
  { id: 'TXN-TU03', user: 'Agus Wijaya', amount: 300000, method: 'GoPay', vaNumber: '081345678901', time: '23 Jun 2026, 18:45', status: 'Gagal' },
  { id: 'TXN-TU04', user: 'Dian Fitriani', amount: 1000000, method: 'BNI Virtual Account', vaNumber: '88103082198765432', time: '23 Jun 2026, 14:20', status: 'Berhasil' },
  { id: 'TXN-TU05', user: 'Eko Prasetyo', amount: 75000, method: 'Permata Virtual Account', vaNumber: '88553089512345678', time: '22 Jun 2026, 10:15', status: 'Berhasil' }
];

export const initialWithdrawals = [
  // Pending queue
  { id: 'TXN-WD01', user: 'Rudi Hermawan', amount: 750000, targetBank: 'BCA', targetAccount: '8910237461', time: '24 Jun 2026, 00:45', status: 'Menunggu' },
  { id: 'TXN-WD02', user: 'Siti Aminah', amount: 1200000, targetBank: 'Mandiri', targetAccount: '1240008761234', time: '23 Jun 2026, 20:15', status: 'Menunggu' },
  // Processed history
  { id: 'TXN-WD03', user: 'Dian Fitriani', amount: 450000, targetBank: 'BRI', targetAccount: '002301098234501', time: '22 Jun 2026, 11:30', status: 'Berhasil' },
  { id: 'TXN-WD04', user: 'Agus Wijaya', amount: 200000, targetBank: 'BCA', targetAccount: '8910293812', time: '21 Jun 2026, 15:40', status: 'Ditolak', rejectReason: 'Nama pemilik rekening bank tidak sesuai profil pengguna.' }
];

const initialEscrowList = [
  { questId: '#Q-8812', title: 'Bantu Pindahan Lemari Dua Pintu', creator: 'Lina Marlina', adventurer: 'Agus Santoso', amount: 150000, questStatus: 'Dalam Proses', escrowStatus: 'Ditahan' },
  { questId: '#Q-8813', title: 'Pinjam Rekening Buat Terima Transfer', creator: 'Rian H.', adventurer: 'Siti A.', amount: 50000, questStatus: 'Dalam Proses', escrowStatus: 'Ditahan' },
  { questId: '#Q-7721', title: 'Antar Berkas Fisik ke Sudirman Office', creator: 'Dimas Anggara', adventurer: 'Agus Santoso', amount: 45000, questStatus: 'Dispute', escrowStatus: 'Ditahan' },
  { questId: '#Q-9012', title: 'Bantu Beresin Barang Bekas di Gudang', creator: 'Jessica M.', adventurer: 'Rian Prasetyo', amount: 30000, questStatus: 'Menunggu Konfirmasi', escrowStatus: 'Ditahan' },
  { questId: '#Q-5521', title: 'Jasa Antar Makanan Sahur Kilat', creator: 'Fahmi Reza', adventurer: 'Budi Kusuma', amount: 25000, questStatus: 'Selesai', escrowStatus: 'Dilepas' },
  { questId: '#Q-0812', title: 'Bantu Belajar Matematika Dasar SMA', creator: 'Eko Prasetyo', adventurer: null, amount: 80000, questStatus: 'Dibatalkan', escrowStatus: 'Di-refund' }
];

// Recharts: Monthly commission revenue data
const monthlyCommissionData = [
  { name: 'Jan', komisi: 42000000 },
  { name: 'Feb', komisi: 51000000 },
  { name: 'Mar', komisi: 49000000 },
  { name: 'Apr', komisi: 62000000 },
  { name: 'Mei', komisi: 68000000 },
  { name: 'Jun', komisi: 72800000 }
];

// Recharts: Revenue breakdown by quest category
const categoryRevenueData = [
  { name: 'Kurir & Logistik', value: 32000000, color: '#005139' },
  { name: 'Jasa Bersih-bersih', value: 22000000, color: '#10b981' },
  { name: 'Belanja & Titip', value: 12000000, color: '#3b82f6' },
  { name: 'Bantuan IT & Desain', value: 5000000, color: '#f59e0b' },
  { name: 'Lain-lain', value: 1800000, color: '#6366f1' }
];

export default function Transactions({ withdrawals: propWithdrawals, setWithdrawals: propSetWithdrawals }) {
  const [activeTab, setActiveTab] = useState('ringkasan'); // 'ringkasan' | 'topup' | 'penarikan' | 'escrow'

  // State lists
  const [topUps, setTopUps] = useState(initialTopUps);
  
  const [localWithdrawals, setLocalWithdrawals] = useState(initialWithdrawals);
  const withdrawals = propWithdrawals || localWithdrawals;
  const setWithdrawals = propSetWithdrawals || setLocalWithdrawals;

  const [escrowList, setEscrowList] = useState(initialEscrowList);

  // Loading state for tables
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // Filters Top Up
  const [searchTopUp, setSearchTopUp] = useState('');
  const [statusTopUpFilter, setStatusTopUpFilter] = useState('Semua');
  const [methodTopUpFilter, setMethodTopUpFilter] = useState('Semua');

  // Rejection state for withdrawal
  const [rejectingWD, setRejectingWD] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [confirmRejectWDId, setConfirmRejectWDId] = useState(null);

  // Date range state for Export reports
  const [exportStartDate, setExportStartDate] = useState('2026-06-01');
  const [exportEndDate, setExportEndDate] = useState('2026-06-24');

  // Toast notifications
  const [toastMsg, setToastMsg] = useState('');

  const triggerToast = (msg, type = 'success') => {
    if (window.showToast) {
      window.showToast(msg, type);
    } else {
      setToastMsg(msg);
      setTimeout(() => setToastMsg(''), 3000);
    }
  };

  // Helper currency format
  const formatRupiah = (val) => {
    if (val >= 1e9) return `Rp ${(val / 1e9).toFixed(2)} M`;
    if (val >= 1e6) return `Rp ${(val / 1e6).toFixed(1)} Jt`;
    return `Rp ${val.toLocaleString('id-ID')}`;
  };

  const maskVA = (va) => {
    if (!va) return '';
    if (va.length <= 11) {
      return va.substring(0, 4) + '****' + va.substring(va.length - 4);
    }
    return va.substring(0, 7) + '****' + va.substring(va.length - 4);
  };

  // Calculations for Ringkasan Keuangan
  const overallEscrowTotal = escrowList
    .filter(e => e.escrowStatus === 'Ditahan')
    .reduce((sum, item) => sum + item.amount, 0);

  const totalUserBalance = 25400000000; // Mock Rp 25.4 M
  const totalVolumeTransaction = 45500000000; // Mock Rp 45.5 M

  // Commission revenue breakdowns
  const commissionDaily = 2450000; // Rp 2.45 Jt
  const commissionMonthly = 72800000; // Rp 72.8 Jt
  const commissionAnnual = 874000000; // Rp 874 Jt

  // Filters Top Up application
  const filteredTopUps = topUps.filter(tu => {
    const matchSearch = tu.user.toLowerCase().includes(searchTopUp.toLowerCase()) || 
      tu.id.toLowerCase().includes(searchTopUp.toLowerCase());
    const matchStatus = statusTopUpFilter === 'Semua' || tu.status === statusTopUpFilter;
    const matchMethod = methodTopUpFilter === 'Semua' || tu.method.includes(methodTopUpFilter);
    return matchSearch && matchStatus && matchMethod;
  });

  // Action Withdrawal Handlers
  const handleApproveWithdrawal = (wdId) => {
    setWithdrawals(prev => prev.map(wd => {
      if (wd.id === wdId) {
        return { ...wd, status: 'Berhasil' };
      }
      return wd;
    }));
    triggerToast('Persetujuan penarikan berhasil diproses.');
  };

  const handleRejectWithdrawal = (wdId) => {
    if (!rejectReason.trim()) {
      triggerToast('Mohon masukkan alasan penolakan.');
      return;
    }
    setWithdrawals(prev => prev.map(wd => {
      if (wd.id === wdId) {
        return { 
          ...wd, 
          status: 'Ditolak',
          rejectReason: rejectReason
        };
      }
      return wd;
    }));
    triggerToast(`Penarikan dana berhasil ditolak: ${rejectReason}`);
    setRejectReason('');
    setRejectingWD(null);
  };

  // Action Escrow release
  const handleReleaseEscrow = (questId, target) => {
    setEscrowList(prev => prev.map(e => {
      if (e.questId === questId) {
        return { ...e, escrowStatus: target === 'adventurer' ? 'Dilepas' : 'Di-refund' };
      }
      return e;
    }));
    triggerToast(
      target === 'adventurer' 
        ? `Dana escrow ${questId} berhasil dirilis ke Adventurer.` 
        : `Dana escrow ${questId} berhasil di-refund ke Creator.`
    );
  };

  // Report Export handler
  const handleExportReport = (e) => {
    e.preventDefault();
    alert(`Mengekspor data transaksi keuangan...\nPeriode: ${exportStartDate} s/d ${exportEndDate}\nFormat file: CSV/Excel\nStatus: Berhasil diunduh.`);
  };

  // State & Handlers for Manual Top Up Confirmation
  const [confirmManualTopUp, setConfirmManualTopUp] = useState(null);

  const handleCheckTopUpStatus = (txnId) => {
    triggerToast(`Mengecek status pembayaran untuk ${txnId}...`);
  };

  const handleInitiateManualConfirm = (tu) => {
    setConfirmManualTopUp(tu);
  };

  const handleConfirmManualTopUp = (txnId) => {
    setTopUps(prev => prev.map(tu => {
      if (tu.id === txnId) {
        return { ...tu, status: 'Berhasil' };
      }
      return tu;
    }));
    setConfirmManualTopUp(null);
    triggerToast(`Top up ${txnId} berhasil dikonfirmasi secara manual.`);
  };

  return (
    <div className="space-y-6">
      
      {/* TOAST PANEL */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-[100] bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-slate-800 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMsg}</span>
        </div>
      )}

      {/* TITLE & HEADER */}
      <div className="pb-2 border-b border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800">Manajemen Keuangan</h2>
        <p className="text-sm text-slate-500 mt-1">Pantau escrow, validasi penarikan dana, audit top up, dan analisis laporan pendapatan komisi.</p>
      </div>

      {/* TABS CONTAINER */}
      <div className="flex border-b border-slate-200 gap-6">
        {[
          { id: 'ringkasan', label: 'Ringkasan & Laporan' },
          { id: 'topup', label: 'Manajemen Top Up' },
          { id: 'penarikan', label: 'Manajemen Penarikan', badge: withdrawals.filter(w => w.status === 'Menunggu').length },
          { id: 'escrow', label: 'Manajemen Escrow', badge: escrowList.filter(e => e.escrowStatus === 'Ditahan' && (e.questStatus === 'Selesai' || e.questStatus === 'Dispute' || e.questStatus === 'Dibatalkan')).length }
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)} 
            className={`pb-3 font-bold text-sm border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === tab.id ? 'border-[#005139] text-[#005139]' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className="px-1.5 py-0.5 text-[9px] font-black bg-rose-500 text-white rounded-full">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: RINGKASAN & LAPORAN */}
      {activeTab === 'ringkasan' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Ringkasan Keuangan Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Escrow Total */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-3">
                <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">DANA DITAHAN DI ESCROW</p>
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Lock size={16}/></div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800">Rp {overallEscrowTotal.toLocaleString('id-ID')}</h3>
                <p className="text-[10px] text-slate-400 mt-2 font-medium">Uang jaminan quest berjalan</p>
              </div>
            </div>

            {/* Total Saldo Pengguna */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-3">
                <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">SALDO DOMPET PENGGUNA</p>
                <div className="p-2 bg-emerald-50 text-[#005139] rounded-lg"><Wallet size={16}/></div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800">{formatRupiah(totalUserBalance)}</h3>
                <p className="text-[10px] text-slate-400 mt-2 font-medium">Dana mengendap di dompet pengguna</p>
              </div>
            </div>

            {/* Pendapatan Komisi Platform (Harian/Bulanan/Tahunan) */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-2">
                <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">KOMISI PLATFORM (10%)</p>
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Banknote size={16}/></div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Harian:</span>
                  <span className="text-[#005139]">Rp {commissionDaily.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 border-t border-slate-50 pt-1">
                  <span>Bulanan:</span>
                  <span className="text-[#005139]">Rp {(commissionMonthly/1e6).toFixed(1)} Jt</span>
                </div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 border-t border-slate-50 pt-1">
                  <span>Tahunan:</span>
                  <span className="text-[#005139]">Rp {(commissionAnnual/1e6).toFixed(0)} Jt</span>
                </div>
              </div>
            </div>

            {/* Total Volume Transaksi */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-3">
                <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">TOTAL VOLUME TRANSAKSI</p>
                <div className="p-2 bg-purple-50 text-purple-650 rounded-lg"><TrendingUp size={16}/></div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800">{formatRupiah(totalVolumeTransaction)}</h3>
                <p className="text-[10px] text-emerald-600 font-bold mt-2 flex items-center gap-0.5"><TrendingUp size={12}/> +12.5% vs bulan lalu</p>
              </div>
            </div>

          </div>

          {/* Laporan Keuangan Export & Recharts Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Laporan Export Card */}
            <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[300px]">
              <div>
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                  <Download size={18} className="text-slate-400" />
                  <h3 className="font-bold text-slate-800 text-sm">Ekspor Laporan Keuangan</h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Unduh laporan audit transaksi komisi, top up, penarikan dana, dan escrow dalam berkas spreadsheet terenkripsi.
                </p>
                
                <form onSubmit={handleExportReport} className="space-y-3.5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase">TANGGAL MULAI</label>
                    <input 
                      type="date" 
                      value={exportStartDate} 
                      onChange={(e) => setExportStartDate(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-250 bg-white rounded-lg text-xs font-semibold outline-none focus:border-[#005139]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase">TANGGAL SELESAI</label>
                    <input 
                      type="date" 
                      value={exportEndDate} 
                      onChange={(e) => setExportEndDate(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-250 bg-white rounded-lg text-xs font-semibold outline-none focus:border-[#005139]"
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="w-full py-2 bg-[#005139] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Download size={14} /> Ekspor Data XLS / CSV
                  </button>
                </form>
              </div>
            </div>

            {/* Recharts Area: Pendapatan Komisi per Bulan */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[300px]">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Grafik Pendapatan Komisi</h3>
                <p className="text-[11px] text-slate-450 mt-0.5">Arus kas profit bersih platform (komisi 10%) per bulan</p>
              </div>
              <div className="h-48 w-full mt-4 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyCommissionData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorCommission" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#005139" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#005139" stopOpacity={0.01}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#64748b', fontSize: 10}}
                      tickFormatter={(val) => `Rp ${(val/1e6).toFixed(0)} Jt`}
                    />
                    <Tooltip 
                      formatter={(value) => [`Rp ${value.toLocaleString('id-ID')}`, 'Komisi Platform']}
                      contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                    />
                    <Area type="monotone" dataKey="komisi" name="Komisi" stroke="#005139" strokeWidth={2} fillOpacity={1} fill="url(#colorCommission)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Breakdown Pendapatan per Kategori Quest */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <div className="mb-4">
              <h3 className="font-bold text-slate-800 text-sm">Breakdown Komisi Berdasarkan Kategori Quest</h3>
              <p className="text-[11px] text-slate-450 mt-0.5">Distribusi pemasukan platform berdasarkan pembagian kategori tugas</p>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              {/* Piechart visual */}
              <div className="w-full md:w-1/3 h-48 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryRevenueData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {categoryRevenueData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [formatRupiah(value), 'Komisi Kategori']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Progress bars list */}
              <div className="flex-1 space-y-3">
                {categoryRevenueData.map((cat, idx) => {
                  const total = categoryRevenueData.reduce((sum, item) => sum + item.value, 0);
                  const percentage = ((cat.value / total) * 100).toFixed(0);
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                          <span>{cat.name}</span>
                        </div>
                        <span>Rp {cat.value.toLocaleString('id-ID')} ({percentage}%)</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${percentage}%`, backgroundColor: cat.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

        </div>
      )}

      {/* TAB 2: MANAJEMEN TOP UP */}
      {activeTab === 'topup' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col animate-in fade-in duration-200">
          
          {/* Filters Top Up */}
          <div className="p-4 border-b border-slate-150 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-800 text-sm">Transaksi Top Up Saldo</h3>
              <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-[#005139] rounded-md font-extrabold border border-emerald-100">
                {filteredTopUps.length} Transaksi
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-450" size={13} />
                <input 
                  type="text" 
                  placeholder="Cari ID / User..." 
                  value={searchTopUp} 
                  onChange={(e) => setSearchTopUp(e.target.value)} 
                  className="pl-8 pr-3 py-1.5 border border-slate-250 bg-white rounded-lg text-xs font-semibold outline-none focus:border-[#005139]"
                />
              </div>

              {/* Status Filter */}
              <select 
                value={statusTopUpFilter} 
                onChange={(e) => setStatusTopUpFilter(e.target.value)} 
                className="px-3 py-1.5 border border-slate-250 bg-white rounded-lg text-xs font-bold text-slate-655 outline-none focus:border-[#005139]"
              >
                <option value="Semua">Semua Status</option>
                <option value="Berhasil">Berhasil</option>
                <option value="Pending">Pending</option>
                <option value="Gagal">Gagal</option>
              </select>

              {/* Method Filter */}
              <select 
                value={methodTopUpFilter} 
                onChange={(e) => setMethodTopUpFilter(e.target.value)} 
                className="px-3 py-1.5 border border-slate-250 bg-white rounded-lg text-xs font-bold text-slate-655 outline-none focus:border-[#005139]"
              >
                <option value="Semua">Semua Metode</option>
                <option value="Virtual Account">Virtual Account</option>
                <option value="GoPay">GoPay</option>
              </select>
            </div>
          </div>

          {/* Top Up Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-650">
              <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">ID Transaksi</th>
                  <th className="px-6 py-4">Nama Pengguna</th>
                  <th className="px-6 py-4">Waktu</th>
                  <th className="px-6 py-4">Metode Pembayaran</th>
                  <th className="px-6 py-4">Nomor VA</th>
                  <th className="px-6 py-4">Jumlah Top Up</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4"><div className="h-3 bg-slate-200 rounded w-16"></div></td>
                      <td className="px-6 py-4"><div className="h-3.5 bg-slate-200 rounded w-24"></div></td>
                      <td className="px-6 py-4"><div className="h-3 bg-slate-200 rounded w-28"></div></td>
                      <td className="px-6 py-4"><div className="h-3 bg-slate-200 rounded w-24"></div></td>
                      <td className="px-6 py-4"><div className="h-3 bg-slate-200 rounded w-28 font-mono"></div></td>
                      <td className="px-6 py-4"><div className="h-3.5 bg-slate-200 rounded w-20"></div></td>
                      <td className="px-6 py-4"><div className="h-5 bg-slate-200 rounded-full w-14"></div></td>
                      <td className="px-6 py-4 text-center"><div className="h-6 bg-slate-200 rounded w-16 mx-auto"></div></td>
                    </tr>
                  ))
                ) : filteredTopUps.length === 0 ? (
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
                            setSearchTopUp('');
                            setStatusTopUpFilter('Semua');
                            setMethodTopUpFilter('Semua');
                          }}
                          className="px-3.5 py-1.5 bg-[#005139] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer border-0"
                        >
                          Reset Filter
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTopUps.map((tu) => (
                    <tr key={tu.id} className="hover:bg-slate-55/40 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-bold text-slate-700">{tu.id}</td>
                      <td className="px-6 py-4 font-bold text-slate-800">{tu.user}</td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-600">{tu.time}</td>
                      <td className="px-6 py-4 text-xs font-semibold text-slate-700">{tu.method}</td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-600">{maskVA(tu.vaNumber)}</td>
                      <td className="px-6 py-4 font-extrabold text-[#005139] text-xs">Rp {tu.amount.toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                          tu.status === 'Berhasil' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                          tu.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                          'bg-rose-50 text-rose-700 border border-rose-100'
                        }`}>
                          {tu.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {tu.status === 'Pending' ? (
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => handleCheckTopUpStatus(tu.id)}
                              className="px-2.5 py-1 text-[10px] font-bold text-blue-650 border border-blue-200 bg-white hover:bg-blue-50 rounded transition-all cursor-pointer whitespace-nowrap"
                            >
                              Cek Status
                            </button>
                            <button 
                              onClick={() => handleInitiateManualConfirm(tu)}
                              className="px-2.5 py-1 text-[10px] font-bold text-white bg-[#005139] hover:bg-emerald-800 rounded transition-all cursor-pointer whitespace-nowrap"
                            >
                              Konfirmasi Manual
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-medium">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* TAB 3: MANAJEMEN PENARIKAN (WITHDRAWALS) */}
      {activeTab === 'penarikan' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* PENDING QUEUE */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-sm">Antrian Penarikan Menunggu Proses</h3>
              <span className="px-2 py-0.5 bg-rose-50 text-rose-700 text-[10px] font-black rounded-md border border-rose-100">
                {withdrawals.filter(w => w.status === 'Menunggu').length} Butuh Mediasi
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-650">
                <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">ID Request</th>
                    <th className="px-6 py-4">Nama Pengguna</th>
                    <th className="px-6 py-4">Waktu Request</th>
                    <th className="px-6 py-4">Rekening Tujuan</th>
                    <th className="px-6 py-4">Nominal</th>
                    <th className="px-6 py-4 text-center">Aksi Operasional</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-6 py-4"><div className="h-3 bg-slate-200 rounded w-16"></div></td>
                        <td className="px-6 py-4"><div className="h-3.5 bg-slate-200 rounded w-24"></div></td>
                        <td className="px-6 py-4"><div className="h-3 bg-slate-200 rounded w-28"></div></td>
                        <td className="px-6 py-4 space-y-1.5">
                          <div className="h-3.5 bg-slate-200 rounded w-32"></div>
                          <div className="h-2 bg-slate-200 rounded w-20"></div>
                        </td>
                        <td className="px-6 py-4"><div className="h-3.5 bg-slate-200 rounded w-16"></div></td>
                        <td className="px-6 py-4 text-center"><div className="h-6 bg-slate-200 rounded w-24 mx-auto"></div></td>
                      </tr>
                    ))
                  ) : withdrawals.filter(w => w.status === 'Menunggu').length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                          </svg>
                          <span className="font-extrabold text-sm text-slate-500">Tidak ada data ditemukan</span>
                          <button 
                            type="button" 
                            onClick={() => {
                              // Reset filters
                            }}
                            className="px-3.5 py-1.5 bg-[#005139] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer border-0"
                          >
                            Reset Filter
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    withdrawals.filter(w => w.status === 'Menunggu').map((wd) => (
                      <tr key={wd.id} className="hover:bg-slate-55/40 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs font-bold text-slate-700">{wd.id}</td>
                        <td className="px-6 py-4 font-bold text-slate-800">{wd.user}</td>
                        <td className="px-6 py-4 text-xs font-semibold text-slate-500">{wd.time}</td>
                        <td className="px-6 py-4 text-xs font-semibold text-slate-700">
                          {wd.targetBank} • A/N: {wd.user} • Rek: ••••{wd.targetAccount.substring(wd.targetAccount.length - 4)}
                        </td>
                        <td className="px-6 py-4 font-extrabold text-[#005139] text-xs">Rp {wd.amount.toLocaleString('id-ID')}</td>
                        
                        {/* Action buttons */}
                        <td className="px-6 py-4">
                          {rejectingWD?.id === wd.id ? (
                            <div className="flex flex-col gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg max-w-[280px] mx-auto">
                              <input 
                                type="text"
                                placeholder="Masukkan alasan penolakan..."
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                className="w-full px-2 py-1 border border-slate-200 bg-white rounded text-[11px] font-semibold outline-none focus:border-rose-500"
                              />
                              <div className="flex gap-1.5 justify-end">
                                <button 
                                  onClick={() => {
                                    if (!rejectReason.trim()) {
                                      triggerToast('Mohon masukkan alasan penolakan.', 'error');
                                      return;
                                    }
                                    setConfirmRejectWDId(wd.id);
                                  }}
                                  className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[10px] font-bold cursor-pointer"
                                >
                                  Tolak
                                </button>
                                <button 
                                  onClick={() => {
                                    setRejectingWD(null);
                                    setRejectReason('');
                                  }}
                                  className="px-2 py-1 bg-slate-200 text-slate-700 rounded text-[10px] font-bold cursor-pointer"
                                >
                                  Batal
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                onClick={() => handleApproveWithdrawal(wd.id)}
                                className="px-3 py-1 bg-[#005139] hover:bg-emerald-800 text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer shadow-3xs"
                              >
                                Setujui & Proses
                              </button>
                              <button 
                                onClick={() => setRejectingWD(wd)}
                                className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-[10px] font-bold transition-all border border-rose-100 cursor-pointer"
                              >
                                Tolak
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* PROCESSED HISTORY */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-sm">Riwayat Penarikan Dana Selesai</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-650">
                <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">ID Request</th>
                    <th className="px-6 py-4">Nama Pengguna</th>
                    <th className="px-6 py-4">Waktu Selesai</th>
                    <th className="px-6 py-4">Tujuan Transfer</th>
                    <th className="px-6 py-4">Nominal</th>
                    <th className="px-6 py-4">Status & Detail Log</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {withdrawals.filter(w => w.status !== 'Menunggu').map((wd) => (
                    <tr key={wd.id} className="hover:bg-slate-55/40 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-bold text-slate-700">{wd.id}</td>
                      <td className="px-6 py-4 font-bold text-slate-800">{wd.user}</td>
                      <td className="px-6 py-4 text-xs font-semibold text-slate-500">{wd.time}</td>
                      <td className="px-6 py-4 text-xs font-semibold text-slate-700">{wd.targetBank} • A/N: {wd.user} • Rek: ••••{wd.targetAccount.substring(wd.targetAccount.length - 4)}</td>
                      <td className="px-6 py-4 font-extrabold text-[#005139] text-xs">Rp {wd.amount.toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4 text-xs">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black inline-block ${
                          wd.status === 'Berhasil' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
                        }`}>
                          {wd.status}
                        </span>
                        {wd.rejectReason && (
                          <p className="text-[10px] text-rose-550 mt-1 italic leading-normal">
                            *Alasan: "{wd.rejectReason}"
                          </p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: MANAJEMEN ESCROW */}
      {activeTab === 'escrow' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Escrow overview card */}
          <div className="bg-slate-900 text-slate-350 p-6 rounded-xl border border-slate-800 flex justify-between items-center shadow-lg relative overflow-hidden">
            <div>
              <p className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">DANA ESCROW DIJAMIN SISTEM</p>
              <h3 className="text-3xl font-black text-white mt-1.5">Rp {overallEscrowTotal.toLocaleString('id-ID')}</h3>
              <p className="text-xs text-slate-400 mt-2 font-medium">Platform Sambilan menjamin 100% dana escrow disimpan aman sebelum rilis.</p>
            </div>
            <div className="p-3.5 bg-slate-800 text-emerald-400 rounded-2xl border border-slate-700">
              <Lock size={28} />
            </div>
            <div className="absolute right-0 bottom-0 top-0 opacity-5 pointer-events-none select-none">
              <DollarSign size={200} />
            </div>
          </div>

          {/* Dana Escrow yang Perlu Dilepas (Finishing Queue) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-sm">Dana Escrow Siap Rilis (Quest / Dispute Selesai)</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-650">
                <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">ID Quest</th>
                    <th className="px-6 py-4">Judul Tugas</th>
                    <th className="px-6 py-4">Pihak Kontrak</th>
                    <th className="px-6 py-4">Dana Jaminan</th>
                    <th className="px-6 py-4">Status Quest</th>
                    <th className="px-6 py-4">Escrow Status</th>
                    <th className="px-6 py-4 text-center">Tindakan Rilis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {escrowList.filter(e => e.escrowStatus === 'Ditahan' && (e.questStatus === 'Selesai' || e.questStatus === 'Dispute' || e.questStatus === 'Dibatalkan')).length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center text-slate-400 font-medium">
                        Tidak ada antrian rilis dana escrow mendesak saat ini.
                      </td>
                    </tr>
                  ) : (
                    escrowList.filter(e => e.escrowStatus === 'Ditahan' && (e.questStatus === 'Selesai' || e.questStatus === 'Dispute' || e.questStatus === 'Dibatalkan')).map((e) => (
                      <tr key={e.questId} className="hover:bg-slate-55/40 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs font-bold text-slate-700">{e.questId}</td>
                        <td className="px-6 py-4 font-bold text-slate-800 text-xs truncate max-w-[200px]">{e.title}</td>
                        <td className="px-6 py-4 text-xs">
                          <p className="font-semibold text-slate-700">Creator: {e.creator}</p>
                          {e.adventurer && <p className="text-[10px] text-slate-450 mt-0.5">Adventurer: {e.adventurer}</p>}
                        </td>
                        <td className="px-6 py-4 font-extrabold text-[#005139] text-xs">Rp {e.amount.toLocaleString('id-ID')}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                            e.questStatus === 'Selesai' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                            e.questStatus === 'Dispute' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                            'bg-slate-50 text-slate-500 border border-slate-200'
                          }`}>
                            {e.questStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-semibold text-amber-600 flex items-center gap-1">
                            <Clock size={12} /> {e.escrowStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center gap-1.5">
                            {e.questStatus === 'Selesai' && (
                              <button 
                                onClick={() => handleReleaseEscrow(e.questId, 'adventurer')}
                                className="px-2.5 py-1 bg-[#005139] hover:bg-emerald-800 text-white rounded text-[10px] font-bold transition-all cursor-pointer"
                              >
                                Rilis ke Adventurer
                              </button>
                            )}
                            {e.questStatus === 'Dibatalkan' && (
                              <button 
                                onClick={() => handleReleaseEscrow(e.questId, 'creator')}
                                className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded text-[10px] font-bold border border-amber-100 transition-all cursor-pointer"
                              >
                                Refund ke Creator
                              </button>
                            )}
                            {e.questStatus === 'Dispute' && (
                              <div className="flex gap-1">
                                <button 
                                  onClick={() => handleReleaseEscrow(e.questId, 'adventurer')}
                                  className="px-2 py-0.5 bg-[#005139] hover:bg-emerald-800 text-white rounded text-[9px] font-bold cursor-pointer"
                                >
                                  Rilis (Adv)
                                </button>
                                <button 
                                  onClick={() => handleReleaseEscrow(e.questId, 'creator')}
                                  className="px-2 py-0.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded text-[9px] font-bold border border-rose-100 cursor-pointer"
                                >
                                  Refund (Cre)
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* DAFTAR DANA ESCROW KESELURUHAN (ALL QUEST ACTIVE HELD) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-sm">Daftar Jaminan Escrow Aktif (Per Quest Berjalan)</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-650">
                <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">ID Quest</th>
                    <th className="px-6 py-4">Judul Tugas</th>
                    <th className="px-6 py-4">Pihak Kontrak</th>
                    <th className="px-6 py-4">Dana Jaminan</th>
                    <th className="px-6 py-4">Status Quest</th>
                    <th className="px-6 py-4">Escrow Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-6 py-4"><div className="h-3 bg-slate-200 rounded w-16"></div></td>
                        <td className="px-6 py-4"><div className="h-3.5 bg-slate-200 rounded w-44"></div></td>
                        <td className="px-6 py-4 space-y-1.5">
                          <div className="h-3 bg-slate-200 rounded w-24"></div>
                          <div className="h-2 bg-slate-200 rounded w-16"></div>
                        </td>
                        <td className="px-6 py-4"><div className="h-3.5 bg-slate-200 rounded w-20"></div></td>
                        <td className="px-6 py-4"><div className="h-5 bg-slate-200 rounded-full w-16"></div></td>
                        <td className="px-6 py-4"><div className="h-5 bg-slate-200 rounded-full w-14"></div></td>
                      </tr>
                    ))
                  ) : escrowList.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                          </svg>
                          <span className="font-extrabold text-sm text-slate-500">Tidak ada data ditemukan</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    escrowList.map((e) => (
                      <tr key={e.questId} className="hover:bg-slate-55/40 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs font-bold text-slate-700">{e.questId}</td>
                        <td className="px-6 py-4 font-bold text-slate-800 text-xs truncate max-w-[240px]">{e.title}</td>
                        <td className="px-6 py-4 text-xs">
                          <p className="font-semibold text-slate-700">Creator: {e.creator}</p>
                          {e.adventurer && <p className="text-[10px] text-slate-450 mt-0.5">Adventurer: {e.adventurer}</p>}
                        </td>
                        <td className="px-6 py-4 font-extrabold text-[#005139] text-xs">Rp {e.amount.toLocaleString('id-ID')}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                            e.questStatus === 'Selesai' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                            e.questStatus === 'Dalam Proses' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                            e.questStatus === 'Dispute' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                            'bg-slate-50 text-slate-500 border border-slate-200'
                          }`}>
                            {e.questStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            e.escrowStatus === 'Ditahan' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                            e.escrowStatus === 'Dilepas' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {e.escrowStatus}
                          </span>
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

      {/* MANUAL TOP UP CONFIRMATION DIALOG */}
      {confirmManualTopUp && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start gap-3 text-slate-800">
              <div className="p-2 bg-emerald-50 text-[#005139] rounded-lg shrink-0">
                <Banknote size={20} />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-850">Konfirmasi Manual Top Up</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Apakah Anda yakin ingin mengkonfirmasi top up sebesar <strong className="text-slate-850">Rp {confirmManualTopUp.amount.toLocaleString('id-ID')}</strong> untuk <strong className="text-slate-850">{confirmManualTopUp.user}</strong> secara manual?
                </p>
                <p className="text-[11px] text-slate-455 mt-1.5 leading-normal">
                  Tindakan ini akan langsung menambahkan saldo ke akun pengguna.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button 
                onClick={() => setConfirmManualTopUp(null)}
                className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-250 rounded-xl text-xs font-bold transition-all cursor-pointer font-sans"
              >
                Batalkan
              </button>
              <button 
                onClick={() => handleConfirmManualTopUp(confirmManualTopUp.id)}
                className="px-3.5 py-2 bg-[#005139] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer font-sans"
              >
                Ya, Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECT WITHDRAWAL CONFIRMATION DIALOG */}
      {confirmRejectWDId && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200 text-center">
            <div className="mx-auto w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center">
              <XCircle size={24} />
            </div>
            <h3 className="font-extrabold text-sm text-slate-850">⚠️ Konfirmasi Tolak Penarikan</h3>
            <p className="text-xs text-slate-650 leading-relaxed">
              Apakah Anda yakin ingin menolak request penarikan saldo ini? Dana jaminan penarikan akan dikembalikan ke dompet saldo pengguna.
            </p>
            
            <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button 
                onClick={() => {
                  setConfirmRejectWDId(null);
                  triggerToast('Aksi dibatalkan', 'error');
                }}
                className="flex-1 py-2 bg-white hover:bg-slate-50 text-slate-750 border border-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer font-sans"
              >
                Batalkan
              </button>
              <button 
                onClick={() => {
                  handleRejectWithdrawal(confirmRejectWDId);
                  setConfirmRejectWDId(null);
                }}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer font-sans border-0"
              >
                Ya, Tolak Penarikan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}