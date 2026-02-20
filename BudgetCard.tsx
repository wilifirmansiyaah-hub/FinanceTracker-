import { formatCurrency } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';

interface Props {
  expense: number;
  limit?: number;
}

export default function BudgetCard({ expense, limit = 5000000 }: Props) {
  const percentage = Math.min(Math.round((expense / limit) * 100), 100);

  return (
    <div className="px-6 py-4 shrink-0">
      <div className="bg-card rounded-[28px] p-6 border border-border relative overflow-hidden group">
        
        {/* Decorative subtle background circle */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

        <div className="flex justify-between items-start mb-6">
          <span className="bg-white/5 text-zinc-300 px-3 py-1 rounded-full text-[10px] font-medium border border-white/5">
            Main Wallet
          </span>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black">
            <ArrowUpRight size={16} />
          </div>
        </div>

        <div className="mb-6">
           <p className="text-zinc-400 text-xs font-medium mb-1">Total Balance</p>
           <h2 className="text-3xl font-bold text-white tracking-tight">
             {formatCurrency(expense)}
           </h2>
        </div>

        {/* Progress Minimalis */}
        <div>
          <div className="flex justify-between text-[10px] text-zinc-500 mb-2 font-medium uppercase tracking-wider">
            <span>Monthly Budget</span>
            <span className="text-white">{percentage}%</span>
          </div>
          <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full bg-primary transition-all duration-700 ease-out" 
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>

      </div>
    </div>
  );
}
