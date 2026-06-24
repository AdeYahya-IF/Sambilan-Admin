import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function Login({ onLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');

  // Fungsi saat tombol Masuk ditekan
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Format email tidak valid (contoh: nama@email.com)');
      return;
    }

    setEmailError('');
    // Di aplikasi asli, di sini ada pengecekan API/Database.
    // Untuk demo, kita langsung loloskan login.
    onLogin();
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-800">
      
      {/* SISI KIRI - BRANDING (Tampil di Desktop) */}
      <div className="hidden lg:flex w-1/2 bg-emerald-50/50 flex-col justify-center items-center p-12 border-r border-slate-200 relative overflow-hidden">
        {/* Dekorasi Background Latar */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-emerald-100/50 blur-3xl"></div>
          <div className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-emerald-100/50 blur-3xl"></div>
        </div>

        <img src="/LOGO SAMBILAN.png" alt="Sambilan Logo" className="w-56 h-56 object-contain mb-8 drop-shadow-md" />
        <h1 className="text-5xl font-extrabold text-[#005139] mb-4 tracking-tight">Sambilan</h1>
        <p className="text-lg text-slate-600 text-center max-w-md font-medium leading-relaxed">
          Solusi praktis untuk kebutuhan harianmu. Temukan bantuan atau bantu sesama.
        </p>
      </div>

      {/* SISI KANAN - FORMULIR LOGIN */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-3">Selamat Datang Kembali</h2>
            <p className="text-slate-500 font-medium">Masuk untuk melanjutkan petualanganmu di Sambilan.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Alamat Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                  placeholder="nama@email.com"
                  className={`w-full pl-12 pr-4 py-3.5 border ${emailError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-[#005139] focus:ring-1 focus:ring-[#005139]'} rounded-xl outline-none font-semibold text-slate-700 transition-all`}
                  required
                />
              </div>
              {emailError && (
                <p className="mt-1.5 text-xs text-red-600 font-semibold">{emailError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Kata Sandi</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 border border-slate-300 rounded-xl outline-none focus:border-[#005139] focus:ring-1 focus:ring-[#005139] font-semibold text-slate-700 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#005139] transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="flex justify-end mt-3">
                <button type="button" className="text-sm font-bold text-[#005139] hover:text-emerald-800 transition-colors">Lupa Kata Sandi?</button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#005139] text-white rounded-xl font-bold text-lg hover:bg-emerald-800 transition-all flex justify-center items-center gap-2 shadow-lg shadow-emerald-900/20 active:scale-[0.98]"
            >
              Masuk Sekarang <ArrowRight size={20} />
            </button>
          </form>

          {/* QUICK LOGIN DEMO ACCOUNT CARD */}
          <div className="mt-8 border border-emerald-100 bg-emerald-50/20 rounded-2xl p-5 text-center space-y-3 shadow-2xs">
            <div className="text-xs font-bold text-[#005139] uppercase tracking-wider flex items-center justify-center gap-1.5">
              <span>⚡ Akses Uji Coba (Demo Admin)</span>
            </div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Gunakan mode demo untuk langsung masuk ke Panel Admin Sambilan dengan hak akses penuh secara instan.
            </p>
            <button
              type="button"
              onClick={() => {
                setEmail('admin@sambilan.com');
                setPassword('admin123');
                onLogin();
              }}
              className="w-full py-3 bg-emerald-50 hover:bg-emerald-100 text-[#005139] border border-emerald-200 rounded-xl font-bold text-sm transition-all active:scale-[0.98] cursor-pointer"
            >
              Masuk sebagai Demo Admin
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}