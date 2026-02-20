import { Home, BarChart2, Plus, Target, User } from 'lucide-react'; // Import User

interface Props {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onAddClick: () => void;
}

export default function BottomNav({ currentTab, onTabChange, onAddClick }: Props) {
  const isActive = (tab: string) => currentTab === tab ? 'text-primary' : 'text-zinc-600 hover:text-zinc-400';
  
  return (
    <div className="absolute bottom-6 left-0 right-0 px-6 z-40 flex justify-center pointer-events-none">
      {/* Container Navigasi: Lebar disesuaikan agar muat 5 icon */}
      <div className="bg-[#18181B] border border-zinc-800 rounded-[32px] px-6 py-3 shadow-2xl shadow-black/80 flex items-center justify-between gap-6 pointer-events-auto backdrop-blur-xl w-full max-w-[360px]">
        
        {/* KIRI: Home & Wishlist */}
        <button onClick={() => onTabChange('home')} className={`transition-all p-1 rounded-full group ${isActive('home')}`}>
          <Home size={22} strokeWidth={currentTab === 'home' ? 2.5 : 2} className="group-hover:scale-110 transition-transform"/>
        </button>

        <button onClick={() => onTabChange('wishlist')} className={`transition-all p-1 rounded-full group ${isActive('wishlist')}`}>
          <Target size={22} strokeWidth={currentTab === 'wishlist' ? 2.5 : 2} className="group-hover:scale-110 transition-transform"/>
        </button>

        {/* TENGAH: Add Button */}
        <button 
          onClick={onAddClick}
          className="bg-primary text-black p-3.5 rounded-[18px] hover:scale-105 hover:-translate-y-1 transition-all -mt-8 border-[4px] border-background shadow-[0_8px_16px_-4px_#D9F15460] group relative overflow-hidden"
        >
          <Plus size={24} strokeWidth={3} className="relative z-10" />
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        </button>
        
        {/* KANAN: Stats & Profile */}
        <button onClick={() => onTabChange('stats')} className={`transition-all p-1 rounded-full group ${isActive('stats')}`}>
          <BarChart2 size={22} strokeWidth={currentTab === 'stats' ? 2.5 : 2} className="group-hover:scale-110 transition-transform"/>
        </button>

        <button onClick={() => onTabChange('profile')} className={`transition-all p-1 rounded-full group ${isActive('profile')}`}>
           <User size={22} strokeWidth={currentTab === 'profile' ? 2.5 : 2} className="group-hover:scale-110 transition-transform"/>
        </button>

      </div>
    </div>
  );
}
