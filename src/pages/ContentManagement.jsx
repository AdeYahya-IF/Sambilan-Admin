import { useState, useRef } from 'react';
import { 
  Megaphone, 
  Plus, 
  Trash2, 
  Edit2, 
  CheckCircle, 
  CheckCircle2, 
  X, 
  ArrowUp, 
  ArrowDown, 
  Save, 
  Calendar, 
  Clock, 
  FolderPlus, 
  FileText, 
  HelpCircle, 
  Image as ImageIcon,
  MessageSquare,
  Sparkles,
  Truck,
  ShoppingBag,
  Laptop,
  Car,
  Package,
  Home,
  HeartPulse,
  Star,
  UserCheck,
  Send,
  LifeBuoy,
  Search,
  ShieldAlert
} from 'lucide-react';

// --- INITIAL DATASETS ---

const initialNotifications = [
  { id: 'NTF-001', type: 'Push Notification', segment: 'Semua Pengguna', title: 'Pemeliharaan Sistem Malam Ini', message: 'Sistem akan offline singkat pada pukul 23:00 WIB untuk pemeliharaan rutin database.', date: '24 Jun 2026, 12:00' },
  { id: 'NTF-002', type: 'Push Notification', segment: 'Hanya Adventurer', title: 'Bonus Quest Akhir Pekan!', message: 'Selesaikan 3 quest kurir akhir pekan ini dan dapatkan bonus saldo Rp 25.000.', date: '23 Jun 2026, 14:00' },
  { id: 'NTF-003', type: 'Popup Aplikasi', segment: 'Pengguna Kota Bandung', title: 'Jasa Bersih Express Hadir!', message: 'Kini Anda bisa memesan jasa bersih-bersih kos express dalam 1 jam!', date: '21 Jun 2026, 09:00' }
];

const initialCategories = [
  { id: 'CAT-01', name: 'Kurir & Logistik', iconName: 'Truck', order: 1, status: 'Aktif' },
  { id: 'CAT-02', name: 'Jasa Bersih-bersih', iconName: 'Sparkles', order: 2, status: 'Aktif' },
  { id: 'CAT-03', name: 'Belanja & Titip', iconName: 'ShoppingBag', order: 3, status: 'Aktif' },
  { id: 'CAT-04', name: 'Bantuan IT & Desain', iconName: 'Laptop', order: 4, status: 'Aktif' },
  { id: 'CAT-05', name: 'Jasa Antar Jemput', iconName: 'Car', order: 5, status: 'Aktif' },
  { id: 'CAT-06', name: 'Jasa Antar Ambil Barang', iconName: 'Package', order: 6, status: 'Aktif' },
  { id: 'CAT-07', name: 'Jasa Angkut', iconName: 'Truck', order: 7, status: 'Aktif' },
  { id: 'CAT-08', name: 'Jasa Pindahan', iconName: 'Home', order: 8, status: 'Aktif' },
  { id: 'CAT-09', name: 'Antar Orang Sakit / Obat', iconName: 'HeartPulse', order: 9, status: 'Aktif' },
  { id: 'CAT-10', name: 'Lain-lain', iconName: 'HelpCircle', order: 10, status: 'Aktif' }
];

const initialFAQs = [
  { id: 'FAQ-01', question: 'Bagaimana cara mendaftar sebagai Adventurer?', answer: 'Anda dapat mendaftar dengan mengunduh aplikasi Sambilan, melengkapi informasi profil, dan mengunggah kartu identitas KTP untuk verifikasi KYC.' },
  { id: 'FAQ-02', question: 'Berapa potongan komisi untuk setiap Quest?', answer: 'Platform Sambilan memotong komisi tetap sebesar 10% untuk biaya pemeliharaan escrow dan layanan operasional.' },
  { id: 'FAQ-03', question: 'Berapa lama pencairan dana masuk ke rekening bank?', answer: 'Pencairan dana biasanya diproses admin dalam waktu maksimal 1x24 jam hari kerja setelah disetujui.' }
];

const initialAboutContent = "Sambilan adalah platform on-demand marketplace yang mempertemukan Creator (pemberi tugas lokal) dengan Adventurer (pekerja lepas independen) untuk menyelesaikan berbagai tugas sehari-hari secara aman menggunakan sistem rekening bersama (Escrow). Misi kami adalah memberdayakan tenaga kerja mikro Indonesia dengan peluang pendapatan fleksibel dan aman.";

const initialBanners = [
  { id: 'BNR-01', title: 'Promo Ramadhan Ceria', imageUrl: 'banner_ramadhan.jpg', startDate: '2026-06-01', endDate: '2026-06-30', status: 'Aktif' },
  { id: 'BNR-02', title: 'Cashback Escrow 5%', imageUrl: 'banner_cashback.jpg', startDate: '2026-06-15', endDate: '2026-07-15', status: 'Aktif' }
];

const initialCSTickets = [
  {
    id: 'TKT-101',
    user: 'Siti Aminah',
    title: 'Lupa Password Akun & Email Mati',
    status: 'Open', // 'Open', 'In Progress', 'Resolved'
    assignedTo: 'Belum Ditugaskan',
    time: '15 menit lalu',
    date: '24 Jun 2026',
    complaint: 'Halo admin, saya ingin masuk ke akun lama saya tapi saya lupa password, dan email lama saya sudah mati. Hubungi saya di nomor HP 0852-1122-3344 di alamat kosan saya Gang Melati No. 5 atau hubungi link WA wa.me/6285211223344.',
    chatHistory: [
      { sender: 'Siti Aminah', time: '01:05', message: 'Halo min, mohon bantuannya akun saya tidak bisa login karena lupa password & emailnya mati.' }
    ]
  },
  {
    id: 'TKT-102',
    user: 'Budi Kusuma',
    title: 'Saldo E-Wallet Belum Masuk',
    status: 'In Progress',
    assignedTo: 'Naila Rona (Ops)',
    time: '1 jam lalu',
    date: '23 Jun 2026',
    complaint: 'Saya sudah melakukan top up saldo via BCA Virtual Account sebesar Rp 50.000 sekitar 2 jam yang lalu, mutasi rekening BCA saya sudah terpotong tapi saldo di aplikasi Sambilan masih belum terupdate.',
    chatHistory: [
      { sender: 'Budi Kusuma', time: '23:15', message: 'Malam min, mau tanya top up saya kok belum masuk ya?' },
      { sender: 'CS Agent (Rona)', time: '23:30', message: 'Halo pak Budi, mohon maaf atas ketidaknyamanannya. Bisa lampirkan kode VA dan bukti transfer mutasinya?' },
      { sender: 'Budi Kusuma', time: '23:45', message: 'Ini bukti transfer dari m-banking BCA saya, no VA 88012081234567890.' }
    ]
  },
  {
    id: 'TKT-103',
    user: 'Agus Wijaya',
    title: 'Cara Mengubah Nomor Telepon',
    status: 'Resolved',
    assignedTo: 'Ade Yahya (Ops)',
    time: 'Kemarin',
    date: '22 Jun 2026',
    complaint: 'Bagaimana cara mengganti nomor hp yang terdaftar di akun Sambilan? Saya ganti nomor baru karena nomor lama sudah hangus masa berlakunya.',
    chatHistory: [
      { sender: 'Agus Wijaya', time: '10:00', message: 'Siang min, cara ganti nomor hp di profil gimana ya?' },
      { sender: 'CS Agent (Ade)', time: '10:15', message: 'Halo pak Agus, silakan masuk ke menu Pengaturan > Keamanan > Ubah Nomor Telepon lalu masukkan kode OTP yang dikirim ke email.' },
      { sender: 'Agus Wijaya', time: '10:30', message: 'Oh baik sudah bisa pak, terima kasih bantuannya!' }
    ]
  }
];

// Helper to sanitize and mask contact details from CS Ticket previews
const sanitizeCSPreview = (text) => {
  if (!text) return '';
  
  // 1. Phone numbers (Indonesian formats: e.g. 08123456789, +62 812-3456-7890, 62812 3456 7890)
  const phoneRegex = /(?:\+62|62|0)8[1-9](?:\s*-*\s*\d){7,11}\b/g;
  
  // 2. URLs / Web links (including http, https, www, wa.me, whatsapp.com, etc.)
  const urlRegex = /(?:https?:\/\/|www\.)[a-zA-Z0-9-./?=&%+_]+|(?:wa\.me|whatsapp\.com)\/[a-zA-Z0-9-./?=&%+_]+|(?:[a-zA-Z0-9-]+\.)+(?:com|org|net|me|gov|edu|mil|info|biz|co|id|us|uk|de|fr|app)(?:\/[a-zA-Z0-9-./?=&%+_]*)?/gi;
  
  // 3. Addresses (starting with Jl., Jalan, Gg., Gang, Ruko, Apartemen, Kosan, Perumahan, Komplek)
  const addressRegex = /(?:jl\.|jalan|gg\.|gang|ruko|apartemen|kosan|perumahan|komplek)\s+[a-zA-Z0-9\s.,-]{3,50}\b/gi;

  let sanitized = text;
  sanitized = sanitized.replace(phoneRegex, '[DATA KONTAK]');
  sanitized = sanitized.replace(urlRegex, '[DATA KONTAK]');
  sanitized = sanitized.replace(addressRegex, '[DATA KONTAK]');
  
  // Truncate to max 80 characters
  if (sanitized.length > 80) {
    return sanitized.substring(0, 80) + '...';
  }
  return sanitized;
};

export default function ContentManagement({ adminRole = 'Super Admin', setAdminRole = () => {} }) {
  const [activeTab, setActiveTab] = useState('notifikasi'); // 'notifikasi' | 'kategori' | 'faq' | 'banner' | 'cs'

  // States
  const [notifications, setNotifications] = useState(initialNotifications);
  const [categories, setCategories] = useState(initialCategories);
  const [faqs, setFaqs] = useState(initialFAQs);
  const [aboutContent, setAboutContent] = useState(initialAboutContent);
  const [banners, setBanners] = useState(initialBanners);
  const [csTickets, setCsTickets] = useState(initialCSTickets);

  // Forms states
  const [notifType, setNotifType] = useState('Push Notification');
  const [notifSegment, setNotifSegment] = useState('Semua Pengguna');
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');

  // Quest Category state
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('HelpCircle');

  // FAQ state
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  const [editingFaq, setEditingFaq] = useState(null);
  const [isAddingFaq, setIsAddingFaq] = useState(false);

  // Banner state
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerStart, setBannerStart] = useState('2026-06-24');
  const [bannerEnd, setBannerEnd] = useState('2026-07-24');
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (file) => {
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setBannerPreviewUrl(url);
    }
  };

  const handleRemoveImage = (e) => {
    if (e) e.stopPropagation();
    if (bannerPreviewUrl) {
      URL.revokeObjectURL(bannerPreviewUrl);
    }
    setBannerPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // Customer Service ticket interaction state
  const [searchCSTerm, setSearchCSTerm] = useState('');
  const [statusCSFilter, setStatusCSFilter] = useState('Semua');
  const [selectedTicket, setSelectedTicket] = useState(csTickets[0] || null);
  const [replyMessage, setReplyMessage] = useState('');

  // Toast
  const [toastMsg, setToastMsg] = useState('');

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // 1. Notifikasi & Pengumuman Actions
  const handleSendNotification = (e) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifMessage.trim()) return;
    
    const newNotif = {
      id: `NTF-${Math.floor(100 + Math.random() * 900)}`,
      type: notifType,
      segment: notifSegment,
      title: notifTitle,
      message: notifMessage,
      date: '24 Jun 2026, 01:20'
    };

    setNotifications(prev => [newNotif, ...prev]);
    setNotifTitle('');
    setNotifMessage('');
    triggerToast('Notifikasi / pengumuman berhasil disebarkan ke pengguna.');
  };

  // 2. Kategori Quest Actions
  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    
    const newCat = {
      id: `CAT-${Math.floor(10 + Math.random() * 90)}`,
      name: newCatName,
      iconName: newCatIcon,
      order: categories.length + 1,
      status: 'Aktif'
    };

    setCategories(prev => [...prev, newCat]);
    setNewCatName('');
    triggerToast(`Kategori '${newCatName}' berhasil ditambahkan.`);
  };

  const handleToggleCategoryStatus = (id, name, current) => {
    const nextStatus = current === 'Aktif' ? 'Nonaktif' : 'Aktif';
    setCategories(prev => prev.map(c => c.id === id ? { ...c, status: nextStatus } : c));
    triggerToast(`Kategori '${name}' diubah menjadi ${nextStatus}.`);
  };

  const handleMoveCategoryOrder = (id, direction) => {
    const idx = categories.findIndex(c => c.id === id);
    if (idx === -1) return;

    if (direction === 'up' && idx > 0) {
      const nextCats = [...categories];
      const tempOrder = nextCats[idx].order;
      nextCats[idx].order = nextCats[idx - 1].order;
      nextCats[idx - 1].order = tempOrder;
      
      const temp = nextCats[idx];
      nextCats[idx] = nextCats[idx - 1];
      nextCats[idx - 1] = temp;
      setCategories(nextCats);
    } else if (direction === 'down' && idx < categories.length - 1) {
      const nextCats = [...categories];
      const tempOrder = nextCats[idx].order;
      nextCats[idx].order = nextCats[idx + 1].order;
      nextCats[idx + 1].order = tempOrder;

      const temp = nextCats[idx];
      nextCats[idx] = nextCats[idx + 1];
      nextCats[idx + 1] = temp;
      setCategories(nextCats);
    }
  };

  // 3. FAQ Actions
  const handleAddFAQ = (e) => {
    e.preventDefault();
    if (!faqQuestion.trim() || !faqAnswer.trim()) return;

    if (editingFaq) {
      setFaqs(prev => prev.map(f => f.id === editingFaq.id ? { ...f, question: faqQuestion, answer: faqAnswer } : f));
      setEditingFaq(null);
      triggerToast('FAQ berhasil diperbarui.');
    } else {
      const newFaq = {
        id: `FAQ-${Math.floor(10 + Math.random() * 90)}`,
        question: faqQuestion,
        answer: faqAnswer
      };
      setFaqs(prev => [...prev, newFaq]);
      triggerToast('FAQ baru berhasil ditambahkan.');
    }

    setFaqQuestion('');
    setFaqAnswer('');
    setIsAddingFaq(false);
  };

  const handleEditFAQClick = (faq) => {
    setEditingFaq(faq);
    setFaqQuestion(faq.question);
    setFaqAnswer(faq.answer);
    setIsAddingFaq(true);
  };

  const handleDeleteFAQ = (id) => {
    setFaqs(prev => prev.filter(f => f.id !== id));
    triggerToast('FAQ berhasil dihapus.');
  };

  const handleSaveAbout = (e) => {
    e.preventDefault();
    triggerToast('Halaman Tentang Aplikasi berhasil disimpan.');
  };

  // 4. Banner Actions
  const handleAddBanner = (e) => {
    e.preventDefault();
    if (!bannerTitle.trim()) return;

    const newBanner = {
      id: `BNR-${Math.floor(10 + Math.random() * 90)}`,
      title: bannerTitle,
      imageUrl: bannerPreviewUrl || 'banner_custom.jpg',
      startDate: bannerStart,
      endDate: bannerEnd,
      status: 'Aktif'
    };

    setBanners(prev => [...prev, newBanner]);
    setBannerTitle('');
    setBannerPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    triggerToast('Banner promosi baru berhasil dipublikasi.');
  };

  const handleDeleteBanner = (id) => {
    setBanners(prev => prev.filter(b => b.id !== id));
    triggerToast('Banner promosi berhasil diturunkan.');
  };

  // 5. Customer Service Actions
  const handleSendCSMessage = (e) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTicket) return;

    const newReply = {
      sender: `CS Agent (${selectedTicket.assignedTo === 'Belum Ditugaskan' ? 'Admin' : selectedTicket.assignedTo.split(' ')[0]})`,
      time: '01:25',
      message: replyMessage
    };

    setCsTickets(prev => prev.map(t => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          status: t.status === 'Open' ? 'In Progress' : t.status,
          chatHistory: [...t.chatHistory, newReply]
        };
      }
      return t;
    }));

    setSelectedTicket(prev => ({
      ...prev,
      status: prev.status === 'Open' ? 'In Progress' : prev.status,
      chatHistory: [...prev.chatHistory, newReply]
    }));

    setReplyMessage('');
    triggerToast('Balasan CS berhasil dikirim ke pengguna.');
  };

  const handleAssignTicket = (ticketId, agentName) => {
    setCsTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return { ...t, assignedTo: agentName, status: t.status === 'Open' ? 'In Progress' : t.status };
      }
      return t;
    }));
    setSelectedTicket(prev => ({
      ...prev,
      assignedTo: agentName,
      status: prev.status === 'Open' ? 'In Progress' : prev.status
    }));
    triggerToast(`Tiket berhasil didelegasikan ke ${agentName}.`);
  };

  const handleChangeTicketStatus = (ticketId, newStatus) => {
    setCsTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return { ...t, status: newStatus };
      }
      return t;
    }));
    setSelectedTicket(prev => ({ ...prev, status: newStatus }));
    triggerToast(`Status tiket berhasil diubah menjadi ${newStatus}.`);
  };

  // CS Filters Application
  const filteredCSTickets = csTickets.filter(t => {
    const matchSearch = t.user.toLowerCase().includes(searchCSTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchCSTerm.toLowerCase()) ||
      t.title.toLowerCase().includes(searchCSTerm.toLowerCase());
    const matchStatus = statusCSFilter === 'Semua' || t.status === statusCSFilter;
    return matchSearch && matchStatus;
  });

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
      <div className="pb-2 border-b border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800">Manajemen Konten & Komunikasi</h2>
        <p className="text-sm text-slate-500 mt-1">Broadcast pengumuman, audit navigasi kategori quest, sunting FAQ bantuan, tayangkan banner promo, dan selesaikan aduan Customer Service.</p>
      </div>

      {/* TABS CONTAINER */}
      <div className="flex border-b border-slate-200 gap-6">
        {[
          { id: 'notifikasi', label: 'Notifikasi & Pengumuman' },
          { id: 'kategori', label: 'Kategori Quest' },
          { id: 'faq', label: 'FAQ & Bantuan' },
          { id: 'banner', label: 'Banner & Promo' },
          { id: 'cs', label: 'Customer Service' }
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)} 
            className={`pb-3 font-bold text-sm border-b-2 transition-all cursor-pointer ${
              activeTab === tab.id ? 'border-[#005139] text-[#005139]' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: NOTIFIKASI & PENGUMUMAN */}
      {activeTab === 'notifikasi' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
          
          {/* SENDER FORM */}
          <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Megaphone size={18} className="text-[#005139]" />
              <h3 className="font-bold text-slate-800 text-sm">Kirim Notifikasi / Banner</h3>
            </div>
            
            <form onSubmit={handleSendNotification} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase">TIPE KOMUNIKASI</label>
                <select 
                  value={notifType} 
                  onChange={(e) => setNotifType(e.target.value)} 
                  className="w-full px-3 py-2 border border-slate-250 bg-white rounded-lg text-xs font-bold text-slate-655 outline-none focus:border-[#005139]"
                >
                  <option value="Push Notification">Push Notification (Notif HP)</option>
                  <option value="Popup Aplikasi">Popup Aplikasi (Banner Modal)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase">SEGMEN PENGGUNA TARGET</label>
                <select 
                  value={notifSegment} 
                  onChange={(e) => setNotifSegment(e.target.value)} 
                  className="w-full px-3 py-2 border border-slate-250 bg-white rounded-lg text-xs font-bold text-slate-655 outline-none focus:border-[#005139]"
                >
                  <option value="Semua Pengguna">Semua Pengguna</option>
                  <option value="Hanya Adventurer">Hanya Adventurer (Pekerja)</option>
                  <option value="Hanya Creator">Hanya Creator (Pemberi Tugas)</option>
                  <option value="Pengguna Kota Bandung">Segmen Kota: Bandung</option>
                  <option value="Pengguna Kota Jakarta">Segmen Kota: Jakarta</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase">JUDUL PENGUMUMAN</label>
                <input 
                  type="text"
                  placeholder="Ketik judul notif..."
                  value={notifTitle}
                  onChange={(e) => setNotifTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-250 bg-white rounded-lg text-xs font-semibold outline-none focus:border-[#005139]"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase">ISI PESAN NOTIFIKASI</label>
                <textarea 
                  rows="3"
                  placeholder="Tulis detail isi pengumuman broadcast..."
                  value={notifMessage}
                  onChange={(e) => setNotifMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-250 bg-white rounded-lg text-xs font-semibold outline-none focus:border-[#005139]"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full py-2.5 bg-[#005139] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Megaphone size={14} /> Kirim Broadcast Real-time
              </button>
            </form>
          </div>

          {/* HISTORY BROWSER */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-sm">Riwayat Pengumuman Terkirim</h3>
              <span className="px-2.5 py-0.5 bg-emerald-50 text-[#005139] text-[10px] font-black rounded-full border border-emerald-100">
                {notifications.length} Terkirim
              </span>
            </div>

            <div className="divide-y divide-slate-100 overflow-y-auto max-h-[500px]">
              {notifications.map((ntf) => (
                <div key={ntf.id} className="p-4 space-y-2 hover:bg-slate-55/30 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black ${
                        ntf.type === 'Push Notification' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-purple-50 text-purple-700 border border-purple-100'
                      }`}>
                        {ntf.type}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold font-mono">{ntf.id}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                      <Clock size={11} /> {ntf.date}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-xs">{ntf.title}</h4>
                  <p className="text-xs text-slate-650 leading-relaxed">"{ntf.message}"</p>
                  <div className="text-[10px] text-slate-400">
                    Target Segmen: <span className="font-bold text-slate-600">{ntf.segment}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: KATEGORI QUEST */}
      {activeTab === 'kategori' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
          
          {/* ADD CATEGORY FORM */}
          <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <FolderPlus size={18} className="text-[#005139]" />
              <h3 className="font-bold text-slate-800 text-sm">Tambah Kategori Baru</h3>
            </div>
            
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase">NAMA KATEGORI</label>
                <input 
                  type="text"
                  placeholder="Contoh: Jasa Antar Air Galon..."
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-250 bg-white rounded-lg text-xs font-semibold outline-none focus:border-[#005139]"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase">PILIKAN IKON PRESET</label>
                <select 
                  value={newCatIcon} 
                  onChange={(e) => setNewCatIcon(e.target.value)} 
                  className="w-full px-3 py-2 border border-slate-250 bg-white rounded-lg text-xs font-bold text-slate-655 outline-none focus:border-[#005139]"
                >
                  <option value="Truck">Truck (Kurir)</option>
                  <option value="Sparkles">Sparkles (Kebersihan)</option>
                  <option value="ShoppingBag">Shopping Bag (Belanja)</option>
                  <option value="Laptop">Laptop (IT/Desain)</option>
                  <option value="Car">Car (Antar Jemput)</option>
                  <option value="Package">Package (Antar Ambil Barang)</option>
                  <option value="Home">Home (Pindahan)</option>
                  <option value="HeartPulse">Heart Pulse (Kesehatan/Obat)</option>
                  <option value="HelpCircle">HelpCircle (Lainnya)</option>
                </select>
              </div>

              <button 
                type="submit"
                className="w-full py-2 bg-[#005139] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer"
              >
                <Plus size={14} /> Daftarkan Kategori
              </button>
            </form>
          </div>

          {/* LIST CATEGORIES */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-sm">Urutan & Tampilan Kategori Quest</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-655">
                <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-center">Urutan</th>
                    <th className="px-6 py-4">Nama Kategori</th>
                    <th className="px-6 py-4">Ikon Preset</th>
                    <th className="px-6 py-4">Status Tampilan</th>
                    <th className="px-6 py-4 text-center">Aksi Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {categories.map((cat, idx) => {
                    return (
                      <tr key={cat.id} className="hover:bg-slate-55/40 transition-colors">
                        
                        {/* Display Order with Shift Controls */}
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => handleMoveCategoryOrder(cat.id, 'up')}
                              disabled={idx === 0}
                              className={`p-1 rounded transition-all cursor-pointer ${idx === 0 ? 'text-slate-200' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'}`}
                            >
                              <ArrowUp size={12} />
                            </button>
                            <span className="font-black text-slate-800 text-xs w-4 text-center">{cat.order}</span>
                            <button 
                              onClick={() => handleMoveCategoryOrder(cat.id, 'down')}
                              disabled={idx === categories.length - 1}
                              className={`p-1 rounded transition-all cursor-pointer ${idx === categories.length - 1 ? 'text-slate-200' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'}`}
                            >
                              <ArrowDown size={12} />
                            </button>
                          </div>
                        </td>

                        {/* Name */}
                        <td className="px-6 py-4 font-bold text-slate-800 text-xs">
                          {cat.name}
                        </td>

                        {/* Icon Preset */}
                        <td className="px-6 py-4 text-xs font-semibold text-slate-500">
                          <span className="inline-flex items-center gap-1.5">
                            {cat.iconName === 'Truck' && <Truck size={14} />}
                            {cat.iconName === 'Sparkles' && <Sparkles size={14} />}
                            {cat.iconName === 'ShoppingBag' && <ShoppingBag size={14} />}
                            {cat.iconName === 'Laptop' && <Laptop size={14} />}
                            {cat.iconName === 'Car' && <Car size={14} />}
                            {cat.iconName === 'Package' && <Package size={14} />}
                            {cat.iconName === 'Home' && <Home size={14} />}
                            {cat.iconName === 'HeartPulse' && <HeartPulse size={14} />}
                            {cat.iconName === 'HelpCircle' && <HelpCircle size={14} />}
                            <span className="font-mono text-[10px]">{cat.iconName}</span>
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 text-xs">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                            cat.status === 'Aktif' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-50 text-slate-500 border border-slate-200'
                          }`}>
                            {cat.status}
                          </span>
                        </td>

                        {/* Actions status toggle */}
                        <td className="px-6 py-4 text-center">
                          <button 
                            onClick={() => handleToggleCategoryStatus(cat.id, cat.name, cat.status)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                              cat.status === 'Aktif' 
                                ? 'bg-rose-50 border-rose-100 text-rose-600 hover:bg-rose-100' 
                                : 'bg-emerald-50 border-emerald-100 text-emerald-700 hover:bg-emerald-100'
                            }`}
                          >
                            {cat.status === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan'}
                          </button>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: FAQ & BANTUAN */}
      {activeTab === 'faq' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-200">
          
          {/* FAQ CRUD MANAGER */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle size={18} className="text-[#005139]" />
                <h3 className="font-bold text-slate-800 text-sm">Daftar Tanya Jawab FAQ</h3>
              </div>
              {!isAddingFaq && (
                <button 
                  onClick={() => {
                    setEditingFaq(null);
                    setFaqQuestion('');
                    setFaqAnswer('');
                    setIsAddingFaq(true);
                  }}
                  className="text-xs font-bold text-[#005139] hover:underline cursor-pointer"
                >
                  + Tambah FAQ
                </button>
              )}
            </div>

            {isAddingFaq ? (
              <form onSubmit={handleAddFAQ} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4 animate-in slide-in-from-top-2 duration-200">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-700">
                    {editingFaq ? 'Sunting Pertanyaan FAQ' : 'Tambah FAQ Baru'}
                  </span>
                  <button type="button" onClick={() => {
                    setIsAddingFaq(false);
                    setEditingFaq(null);
                  }}><X size={16} className="text-slate-400"/></button>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase">PERTANYAAN</label>
                  <input 
                    type="text"
                    placeholder="Contoh: Bagaimana cara rilis dana?"
                    value={faqQuestion}
                    onChange={(e) => setFaqQuestion(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-250 bg-white rounded-lg text-xs font-semibold outline-none focus:border-[#005139]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase">JAWABAN</label>
                  <textarea 
                    rows="4"
                    placeholder="Tuliskan jawaban penjelasan detail..."
                    value={faqAnswer}
                    onChange={(e) => setFaqAnswer(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-250 bg-white rounded-lg text-xs font-semibold outline-none focus:border-[#005139]"
                    required
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-[#005139] text-white text-xs font-bold rounded-lg cursor-pointer"
                  >
                    {editingFaq ? 'Simpan Suntingan' : 'Daftarkan FAQ'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setIsAddingFaq(false);
                      setEditingFaq(null);
                      setFaqQuestion('');
                      setFaqAnswer('');
                    }}
                    className="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3.5 overflow-y-auto max-h-[420px] pr-1">
                {faqs.map((faq) => (
                  <div key={faq.id} className="p-3.5 border border-slate-200 rounded-xl space-y-2 hover:border-slate-350 transition-all bg-slate-50/10">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-slate-800 text-xs leading-normal pr-4">Q: {faq.question}</h4>
                      <div className="flex gap-1.5 shrink-0">
                        <button onClick={() => handleEditFAQClick(faq)} className="p-1 text-slate-400 hover:text-slate-650 hover:bg-slate-100 rounded transition-all cursor-pointer"><Edit2 size={12}/></button>
                        <button onClick={() => handleDeleteFAQ(faq.id)} className="p-1 text-slate-400 hover:text-rose-650 hover:bg-rose-50 rounded transition-all cursor-pointer"><Trash2 size={12}/></button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">A: {faq.answer}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* TENTANG APLIKASI EDITOR */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <FileText size={18} className="text-[#005139]" />
              <h3 className="font-bold text-slate-800 text-sm">Halaman "Tentang Aplikasi"</h3>
            </div>
            
            <form onSubmit={handleSaveAbout} className="space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  SUNTING KONTEN HALAMAN (ABOUT APP)
                </label>
                <textarea 
                  rows="10"
                  value={aboutContent}
                  onChange={(e) => setAboutContent(e.target.value)}
                  className="w-full px-3.5 py-3 border border-slate-250 bg-white rounded-lg text-xs font-semibold leading-relaxed outline-none focus:border-[#005139] flex-1 min-h-[220px]"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full py-2.5 bg-[#005139] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer mt-4"
              >
                <Save size={14} /> Simpan Konten Tentang Aplikasi
              </button>
            </form>
          </div>

        </div>
      )}

      {/* TAB 4: BANNER & PROMO */}
      {activeTab === 'banner' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
          
          {/* UPLOAD FORM */}
          <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <ImageIcon size={18} className="text-[#005139]" />
              <h3 className="font-bold text-slate-800 text-sm">Upload Banner Promosi</h3>
            </div>
            
            <form onSubmit={handleAddBanner} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase">JUDUL PROMO / BANNER</label>
                <input 
                  type="text"
                  placeholder="Contoh: Cashback Pembayaran Quest..."
                  value={bannerTitle}
                  onChange={(e) => setBannerTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-250 bg-white rounded-lg text-xs font-semibold outline-none focus:border-[#005139]"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase">DOKUMEN BANNER</label>
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => handleFileChange(e.target.files[0])}
                  accept="image/*"
                  className="hidden"
                />
                
                {bannerPreviewUrl ? (
                  <div className="relative w-full aspect-[2/1] border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <img 
                      src={bannerPreviewUrl} 
                      alt="Banner Preview" 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 w-6 h-6 bg-slate-900/70 hover:bg-slate-900 text-white rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-md border-0"
                      title="Hapus Gambar"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <div 
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-5 text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all duration-200 ${
                      isDragging 
                        ? 'border-[#005139] bg-emerald-50/30' 
                        : 'border-slate-350 bg-slate-50 hover:bg-slate-100/50'
                    }`}
                  >
                    <ImageIcon size={22} className={isDragging ? 'text-[#005139]' : 'text-slate-400'} />
                    <span className="text-[10px] font-bold text-slate-600">
                      Seret gambar ke sini atau klik untuk memilih
                    </span>
                    <span className="text-[8px] text-slate-400">
                      Rekomendasi: 1200x600px (.jpg, .png)
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase">TANGGAL TAYANG</label>
                  <input 
                    type="date"
                    value={bannerStart}
                    onChange={(e) => setBannerStart(e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-250 bg-white rounded-lg text-xs font-semibold outline-none focus:border-[#005139]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase">TANGGAL BERAKHIR</label>
                  <input 
                    type="date"
                    value={bannerEnd}
                    onChange={(e) => setBannerEnd(e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-250 bg-white rounded-lg text-xs font-semibold outline-none focus:border-[#005139]"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-2 bg-[#005139] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer"
              >
                <Plus size={14} /> Terbitkan Banner Promo
              </button>
            </form>
          </div>

          {/* ACTIVE BANNERS LIST */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-sm">Daftar Banner Promosi Berjalan</h3>
              <span className="px-2.5 py-0.5 bg-emerald-50 text-[#005139] text-[10px] font-black rounded-full border border-emerald-100">
                {banners.length} Active Banners
              </span>
            </div>

            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {banners.map((bnr) => (
                <div key={bnr.id} className="border border-slate-200 bg-slate-50/20 p-4 rounded-xl flex flex-col justify-between hover:border-slate-350 transition-all">
                  <div className="space-y-3">
                    
                    {/* Mock Banner Graphic Box */}
                    <div className="w-full aspect-[2/1] border border-slate-250 bg-indigo-50 text-indigo-700 flex flex-col items-center justify-center rounded-lg relative overflow-hidden shadow-3xs p-2">
                      {bnr.imageUrl && (bnr.imageUrl.startsWith('blob:') || bnr.imageUrl.startsWith('data:') || bnr.imageUrl.startsWith('http') || bnr.imageUrl.startsWith('/')) ? (
                        <img src={bnr.imageUrl} className="w-full h-full object-cover absolute inset-0" alt={bnr.title} />
                      ) : (
                        <>
                          <ImageIcon size={28} className="text-indigo-400" />
                          <span className="text-[10px] font-bold text-center mt-2 truncate max-w-full">"{bnr.title}"</span>
                          <span className="text-[8px] text-indigo-500 font-mono mt-1">{bnr.imageUrl}</span>
                        </>
                      )}
                      <span className="absolute top-2 right-2 bg-emerald-500 text-white text-[8px] px-1.5 py-0.2 font-black rounded z-10">
                        {bnr.status}
                      </span>
                    </div>

                    <div className="text-xs space-y-1 font-semibold text-slate-600">
                      <p className="text-slate-800 font-extrabold text-sm">{bnr.title}</p>
                      <div className="flex items-center gap-1 text-[10px] text-slate-450 mt-1.5">
                        <Calendar size={11} />
                        <span>Mulai: <span className="font-bold text-slate-655">{bnr.startDate}</span></span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-450">
                        <Calendar size={11} />
                        <span>Selesai: <span className="font-bold text-slate-655">{bnr.endDate}</span></span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleDeleteBanner(bnr.id)}
                    className="w-full py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer mt-4"
                  >
                    <Trash2 size={13} /> Turunkan Banner
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 5: CUSTOMER SERVICE */}
      {activeTab === 'cs' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          

          {/* CS STATISTICS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Avg Response Time */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1">RATA-RATA WAKTU RESPONS</p>
                <h3 className="text-3xl font-black text-slate-850">12.5 Menit</h3>
              </div>
              <span className="text-[10px] text-slate-405 mt-3 font-semibold flex items-center gap-1">
                <Clock size={12} className="text-emerald-500"/> Tercepat di kelas SLA CS
              </span>
            </div>

            {/* Total Resolved */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1">TOTAL TIKET DISELESAIKAN</p>
                <h3 className="text-3xl font-black text-slate-850">245 Tiket</h3>
              </div>
              <span className="text-[10px] text-slate-405 mt-3 font-medium">
                Penyelesaian 98.2% minggu ini
              </span>
            </div>

            {/* Satisfaction Rate */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1">TINGKAT KEPUASAN (CSAT)</p>
                <h3 className="text-3xl font-black text-slate-850 flex items-center gap-1 text-[#005139]">
                  <Star size={24} className="fill-amber-400 text-amber-450"/> 94.8%
                </h3>
              </div>
              <span className="text-[9px] text-slate-405 mt-3 font-medium">
                Berdasarkan 180 penilaian feedback pengguna
              </span>
            </div>

          </div>

          {/* CRM QUEUE & CHAT INTERACTION */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* TICKET QUEUE LEFT PANEL */}
            <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden max-h-[500px]">
              <div className="p-4 border-b border-slate-150 bg-slate-50/50 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-850 text-sm">Daftar Tiket Aduan</h3>
                  <span className="px-2 py-0.5 bg-rose-50 text-rose-800 text-[10px] font-black rounded-full border border-rose-100">
                    {filteredCSTickets.filter(t => t.status !== 'Resolved').length} Aktif
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {/* Search CS */}
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
                    <input 
                      type="text" 
                      placeholder="Cari User / Tiket..." 
                      value={searchCSTerm} 
                      onChange={(e) => setSearchCSTerm(e.target.value)} 
                      className="w-full pl-7.5 pr-2.5 py-1 border border-slate-200 bg-white rounded-lg text-[11px] font-semibold outline-none focus:border-[#005139]"
                    />
                  </div>

                  {/* Filter Status CS */}
                  <select 
                    value={statusCSFilter} 
                    onChange={(e) => setStatusCSFilter(e.target.value)} 
                    className="px-2.5 py-1 border border-slate-200 bg-white rounded-lg text-[11px] font-bold text-slate-655 outline-none focus:border-[#005139]"
                  >
                    <option value="Semua">Semua Status</option>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>

              {/* Tickets list scroll container */}
              <div className="overflow-y-auto divide-y divide-slate-100 flex-1">
                {filteredCSTickets.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2 h-full">
                    <CheckCircle size={32} className="text-emerald-500 animate-pulse" />
                    <span className="font-bold">Antrian Tiket Bersih!</span>
                  </div>
                ) : (
                  filteredCSTickets.map((t) => {
                    let badgeCol = 'bg-slate-150 text-slate-600';
                    if (t.status === 'Open') badgeCol = 'bg-rose-50 text-rose-700 border border-rose-100';
                    else if (t.status === 'In Progress') badgeCol = 'bg-amber-50 text-amber-705 border border-amber-100';
                    else if (t.status === 'Resolved') badgeCol = 'bg-emerald-50 text-emerald-700 border border-emerald-100';

                    return (
                      <div 
                        key={t.id}
                        onClick={() => setSelectedTicket(t)}
                        className={`p-3.5 flex flex-col gap-1.5 cursor-pointer transition-colors ${
                          selectedTicket?.id === t.id ? 'bg-emerald-50/20 border-l-4 border-l-[#005139]' : 'hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-[9px] font-bold text-slate-400">{t.id}</span>
                          <span className={`px-2 py-0.2 rounded text-[8px] font-black ${badgeCol}`}>
                            {t.status}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-800 text-xs truncate">{t.title}</h4>
                        <p className="text-[10px] text-slate-450 leading-normal line-clamp-1">Keluhan: {sanitizeCSPreview(t.complaint)}</p>
                        <div className="flex justify-between text-[9px] text-slate-400 font-semibold mt-1">
                          <span>User: {t.user}</span>
                          <span>Assigned: {t.assignedTo.split(' ')[0]}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* CHAT & DELEGATION RIGHT PANEL */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between min-h-[500px]">
              {selectedTicket ? (
                (adminRole === 'Finance' || adminRole === 'Moderator') ? (
                  <div className="flex flex-col items-center justify-center gap-3 text-slate-500 py-16 flex-1 text-center">
                    <ShieldAlert size={48} className="text-rose-600 animate-bounce" />
                    <span className="font-extrabold text-sm text-rose-705">Anda tidak memiliki akses ke tiket CS</span>
                    <span className="text-xs text-slate-400 max-w-xs font-semibold leading-normal">
                      Akses ke tiket bantuan dibatasi berdasarkan kebijakan privasi data pengguna platform Sambilan.
                    </span>
                  </div>
                ) : (
                  <div className="space-y-4 flex-1 flex flex-col justify-between min-h-0">
                    
                    {/* Ticket control bar */}
                    <div className="border-b border-slate-150 pb-3">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-slate-800 text-sm">{selectedTicket.title} (ID: {selectedTicket.id})</h3>
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-slate-50 border border-slate-200 text-slate-500 rounded text-[9px] font-bold cursor-help group relative">
                              🔒 Data Terlindungi
                              <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block w-48 bg-slate-800 text-white text-[9px] font-medium p-2 rounded-lg shadow-xl text-center leading-normal z-[100] normal-case">
                                Konten tiket ini hanya dapat diakses oleh staff CS yang ditugaskan
                              </span>
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-450 mt-0.5">
                            Pelapor: <span className="font-bold text-slate-600">{selectedTicket.user}</span> • Masuk: <span className="font-medium">{selectedTicket.date}</span>
                          </p>
                        </div>

                      <div className="flex items-center gap-2">
                        {/* Assign CS selector */}
                        <div className="flex items-center gap-1 text-[11px] font-bold text-slate-550 shrink-0">
                          <UserCheck size={14} className="text-slate-400" />
                          <span>Petugas:</span>
                          <select 
                            value={selectedTicket.assignedTo}
                            onChange={(e) => handleAssignTicket(selectedTicket.id, e.target.value)}
                            className="ml-1 px-2 py-1 border border-slate-200 bg-white rounded-lg text-[10px] font-bold outline-none focus:border-[#005139]"
                          >
                            <option value="Belum Ditugaskan">Belum Ditugaskan</option>
                            <option value="Ade Yahya (Ops)">Ade Yahya (Ops)</option>
                            <option value="Naila Rona (Ops)">Naila Rona (Ops)</option>
                            <option value="CS Agent 1">CS Agent 1</option>
                            <option value="CS Agent 2">CS Agent 2</option>
                          </select>
                        </div>

                        {/* Status selector */}
                        <select 
                          value={selectedTicket.status}
                          onChange={(e) => handleChangeTicketStatus(selectedTicket.id, e.target.value)}
                          className="px-2 py-1 border border-slate-200 bg-white rounded-lg text-[10px] font-black outline-none focus:border-[#005139]"
                        >
                          <option value="Open">Open</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Complaint detail statement */}
                  <div className="space-y-1 shrink-0">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Isi Keluhan Pengguna</span>
                    <p className="text-xs text-slate-700 bg-slate-50 border border-slate-200 p-3 rounded-lg leading-relaxed italic">
                      "{selectedTicket.complaint}"
                    </p>
                  </div>

                  {/* Bubble chat history panel */}
                  <div className="flex-1 border border-slate-200 bg-slate-50/20 rounded-xl flex flex-col overflow-hidden min-h-[180px] max-h-[260px]">
                    <div className="p-2.5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-1.5 shrink-0">
                      <MessageSquare size={13} className="text-slate-400" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Obrolan CS & User</span>
                    </div>

                    <div className="p-4 space-y-3 overflow-y-auto flex-1 text-xs">
                      {selectedTicket.chatHistory.map((chat, idx) => {
                        const isUser = chat.sender === selectedTicket.user;
                        return (
                          <div key={idx} className={`flex flex-col ${isUser ? 'items-start' : 'items-end'}`}>
                            <span className="text-[8px] text-slate-400 font-bold mb-0.5">{chat.sender}</span>
                            <div className={`px-2.5 py-1.5 rounded-xl max-w-[80%] leading-relaxed ${
                              isUser ? 'bg-slate-200 text-slate-800 rounded-tl-none font-medium' : 'bg-[#005139] text-white rounded-tr-none font-medium'
                            }`}>
                              {chat.message}
                            </div>
                            <span className="text-[8px] text-slate-400 mt-0.5">{chat.time}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Send chat message reply form */}
                  {selectedTicket.status !== 'Resolved' ? (
                    <form onSubmit={handleSendCSMessage} className="flex gap-2 shrink-0 pt-1">
                      <input 
                        type="text" 
                        placeholder="Balas pesan aduan pengguna..."
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        className="flex-1 px-3 py-2 bg-slate-50 border border-slate-250 rounded-xl text-xs font-semibold outline-none focus:border-[#005139]"
                        required
                      />
                      <button 
                        type="submit"
                        className="p-2 bg-[#005139] hover:bg-emerald-800 text-white rounded-xl transition-all cursor-pointer shadow-3xs flex items-center justify-center shrink-0"
                      >
                        <Send size={14} className="ml-0.5" />
                      </button>
                    </form>
                  ) : (
                    <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-800 shrink-0">
                      <CheckCircle2 size={16} />
                      <span>Tiket CS ini telah diselesaikan (Resolved). Kolom obrolan dikunci.</span>
                    </div>
                  )}

                </div>
                )
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 text-slate-400 py-16 flex-1">
                  <LifeBuoy size={40} className="text-slate-350 animate-spin" />
                  <span className="font-bold">Tidak ada tiket CS terpilih</span>
                  <span>Pilih tiket aduan di antrian kiri untuk mulai menengahi keluhan.</span>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
