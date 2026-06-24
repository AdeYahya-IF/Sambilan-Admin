import { Search, Bell, HelpCircle } from 'lucide-react';

export default function Header({ title, adminRole = 'Super Admin' }) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
      <div className="text-sm text-slate-500 flex gap-2">
        <span>Admin</span><span>/</span><span className="font-semibold text-slate-800">{title}</span>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input type="text" placeholder="Cari..." className="pl-10 pr-4 py-2 bg-slate-100 rounded-full text-sm focus:outline-none w-64" />
        </div>
        <div className="flex items-center gap-4 text-slate-500">
          <Bell size={20} className="cursor-pointer hover:text-slate-800" />
          <HelpCircle size={20} className="cursor-pointer hover:text-slate-800" />
        </div>
        <div className="flex items-center gap-3 border-l pl-6 border-slate-200 cursor-pointer">
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-800">Admin User</p>
            <p className="text-xs text-slate-500">{adminRole}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center text-sm font-bold">AU</div>
        </div>
      </div>
    </header>
  );
}