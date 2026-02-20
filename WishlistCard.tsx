import { WishlistItem } from '@/types/finance';
import { formatCurrency } from '@/lib/utils';
import { Image as ImageIcon, Target } from 'lucide-react';

interface Props {
  item: WishlistItem;
  onClick: () => void;
}

export default function WishlistCard({ item, onClick }: Props) {
  const percentage = item.targetAmount > 0 ? Math.min(Math.round((item.currentAmount / item.targetAmount) * 100), 100) : 0;

  return (
    <button 
      onClick={onClick}
      className="w-full bg-card rounded-[24px] p-4 border border-border flex items-center gap-4 hover:bg-white/5 transition-all text-left group relative overflow-hidden"
    >
      {/* Foto / Placeholder */}
      <div className="w-20 h-20 rounded-2xl bg-zinc-900 border border-border flex items-center justify-center overflow-hidden shrink-0 relative">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <ImageIcon className="text-zinc-700" size={24} />
        )}
      </div>

      {/* Info & Progress */}
      <div className="flex-1 overflow-hidden z-10">
        <h3 className="text-white font-semibold text-sm truncate mb-1">{item.name}</h3>
        
        <div className="flex items-center gap-1 text-[10px] text-zinc-400 mb-3 font-medium">
          <Target size={12} className="text-primary" />
          <span>Target: {formatCurrency(item.targetAmount)}</span>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-[10px] mb-1.5 font-bold tracking-wider">
            <span className="text-primary">{formatCurrency(item.currentAmount)}</span>
            <span className="text-zinc-500">{percentage}%</span>
          </div>
          <div className="w-full bg-zinc-800/50 h-2 rounded-full overflow-hidden border border-white/5">
            <div 
              className="h-full rounded-full bg-primary transition-all duration-700 ease-out shadow-[0_0_10px_#D9F15450]" 
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Subtle glow effect on hover */}
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
    </button>
  );
}
