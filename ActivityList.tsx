import { Transaction } from '@/types/finance';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ShoppingBag, Home, Zap, Coffee, Wallet, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

interface Props {
  transactions: Transaction[];
  onDelete: (id: number) => void;
}

const getIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'makanan': return <Coffee size={18} />;
    case 'belanja': return <ShoppingBag size={18} />;
    case 'sewa': return <Home size={18} />;
    case 'tagihan': return <Zap size={18} />;
    default: return <Wallet size={18} />;
  }
};

export default function ActivityList({ transactions, onDelete }: Props) {
  return (
    <div className="px-6 pb-32 pt-2">
      <div className="space-y-1">
        {transactions.length === 0 ? (
          <div className="text-center py-10">
             <p className="text-zinc-600 text-sm">No transactions yet.</p>
          </div>
        ) : (
          transactions.map((t) => (
            <div key={t.id} className="py-3 flex items-center justify-between group border-b border-border/40 last:border-0 hover:bg-white/[0.02] -mx-2 px-2 rounded-xl transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border border-border ${t.type === 'income' ? 'bg-primary/10 text-primary' : 'bg-zinc-800 text-zinc-300'}`}>
                  {getIcon(t.category)}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{t.category}</p>
                  <p className="text-zinc-500 text-[10px] mt-0.5">{formatDate(t.date)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-medium text-sm ${t.type === 'income' ? 'text-primary' : 'text-white'}`}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </p>
                <button 
                  onClick={() => t.id && onDelete(t.id)}
                  className="text-zinc-600 text-[10px] mt-1 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
