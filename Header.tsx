import Image from 'next/image';
import { Bell } from 'lucide-react';

export default function Header() {
  return (
    <div className="flex justify-between items-center px-6 pt-8 pb-2 bg-background shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 relative">
          <Image 
            src="ae37854e0fddd035f48e05e5a0b63a37.jpg" 
            alt="Profile" 
            fill
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-zinc-400 text-[10px] font-medium tracking-wide uppercase">SANN404 FORUM</p>
          <h1 className="text-lg font-semibold text-white tracking-tight">Saanndec5ty</h1>
        </div>
      </div>
      
      <button className="w-10 h-10 flex items-center justify-center rounded-full border border-border text-white hover:bg-white/5 transition">
        <Bell size={18} className="text-zinc-300" />
      </button>
    </div>
  );
}
