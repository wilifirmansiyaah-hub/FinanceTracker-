'use client';
import { useState } from 'react';
import { WishlistItem } from '@/types/finance';
import { formatCurrency } from '@/lib/utils';
import { X, Target, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface Props {
  item: WishlistItem | null;
  onClose: () => void;
  onUpdate: (item: WishlistItem) => void;
  onDelete: (id: number) => void;
}

export default function WishlistDetailModal({ item, onClose, onUpdate, onDelete }: Props) {
  const [addAmount, setAddAmount] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  if (!item) return null;

  const percentage = item.targetAmount > 0 ? Math.min(Math.round((item.currentAmount / item.targetAmount) * 100), 100) : 0;
  const remaining = Math.max(0, item.targetAmount - item.currentAmount);
  const isCompleted = percentage >= 100;

  const handleAddSavings = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(addAmount);
    if (amount <= 0) return;

    onUpdate({
      ...item,
      currentAmount: item.currentAmount + amount,
    });
    setAddAmount('');
    setIsAdding(false);
  };

  const handleDelete = () => {
    if (confirm(`Yakin ingin menghapus target "${item.name}"?`)) {
      if (item.id) onDelete(item.id);
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-background animate-in slide-in-from-right-full duration-300">
      
      {/* Header & Foto Sampul */}
      <div className="relative h-72 bg-zinc-900 shrink-0">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover opacity-60" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-900/50 pattern-dots-md text-zinc-800">
            <Target size={64} className="text-zinc-800/50" />
          </div>
        )}
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
        
        {/* Close & Delete Buttons */}
        <div className="absolute top-6 left-6 right-6 flex justify-between z-10">
            <button onClick={onClose} className="p-2.5 bg-black/40 backdrop-blur-md rounded-full text-white border border-white/10 hover:bg-black/60 transition-all">
              <X size={20} />
            </button>
            <button onClick={handleDelete} className="p-2.5 bg-black/40 backdrop-blur-md rounded-full text-red-500 border border-white/10 hover:bg-red-500/20 transition-all group">
              <Trash2 size={20} className="group-hover:scale-110 transition-transform" />
            </button>
        </div>

        {/* Judul & Info Utama */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
           <div className="flex items-start gap-3 mb-2">
                <Target className="text-primary shrink-0 mt-1" size={20}/>
                <h2 className="text-2xl font-bold text-white leading-tight">{item.name}</h2>
           </div>
           <p className="text-sm text-zinc-400 font-medium pl-8">Target: <span className="text-white">{formatCurrency(item.targetAmount)}</span></p>
        </div>
      </div>

      {/* Content Progres & Aksi */}
      <div className="flex-1 px-6 pt-6 pb-6 flex flex-col overflow-y-auto">
        
        {/* Status Card Besar */}
        <div className={`bg-card rounded-[32px] p-6 border relative overflow-hidden mb-6 ${isCompleted ? 'border-primary/50 shadow-[0_0_30px_#D9F15420]' : 'border-border'}`}>
            
            {isCompleted && (
                <div className="absolute top-0 right-0 bg-primary text-black text-[10px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-bl-2xl flex items-center gap-1">
                    <CheckCircle2 size={12}/> Tercapai
                </div>
            )}

            <div className="flex justify-between items-end mb-6">
                <div>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1.5">Terkumpul Saat Ini</p>
                    <h3 className={`text-4xl font-extrabold tracking-tight ${isCompleted ? 'text-primary' : 'text-white'}`}>{formatCurrency(item.currentAmount)}</h3>
                </div>
                <div className="text-right mb-1">
                    <span className={`text-3xl font-extrabold ${isCompleted ? 'text-primary' : 'text-zinc-300'}`}>{percentage}</span>
                    <span className="text-lg text-zinc-500 font-bold">%</span>
                </div>
            </div>

            {/* Big Progress Bar */}
            <div className="w-full bg-zinc-800/50 h-5 rounded-full overflow-hidden border border-white/5 mb-4 p-1">
                <div 
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${isCompleted ? 'bg-primary shadow-[0_0_15px_#D9F154]' : 'bg-primary/80'}`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
            
            {!isCompleted ? (
               <p className="text-sm text-zinc-400 text-center font-medium">
                 Kurang <span className="text-white font-bold">{formatCurrency(remaining)}</span> lagi untuk mencapai target.
               </p>
            ) : (
               <p className="text-sm text-primary font-bold text-center uppercase tracking-wider flex justify-center items-center gap-2">
                 🎉 Selamat! Target telah tercapai.
               </p>
            )}
        </div>

        {/* Form Tambah Tabungan (Floating Bottom) */}
        <div className="mt-auto pt-4">
          {!isAdding ? (
             <button 
               onClick={() => setIsAdding(true)}
               disabled={isCompleted}
               className="w-full bg-primary text-black font-bold py-4 rounded-[20px] flex items-center justify-center gap-2 hover:bg-[#cbe63d] active:scale-[0.98] transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
             >
               <Plus size={20} strokeWidth={3} /> Tambah Tabungan
             </button>
          ) : (
             <form onSubmit={handleAddSavings} className="bg-card p-4 rounded-[24px] border border-primary/30 animate-in slide-in-from-bottom-5 shadow-[0_0_30px_#D9F15410]">
                <div className="flex justify-between items-center mb-4 px-2">
                   <p className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-2"><Plus size={14}/> Input Nominal Tabungan</p>
                   <button type="button" onClick={() => setIsAdding(false)} className="p-1 bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors"><X size={16}/></button>
                </div>
                <div className="flex gap-3">
                   <div className="flex-1 relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">Rp</span>
                        <input 
                            type="number"
                            required
                            autoFocus
                            min="1"
                            value={addAmount}
                            onChange={(e) => setAddAmount(e.target.value)}
                            className="w-full bg-zinc-900 text-white rounded-xl pl-12 pr-4 py-4 outline-none border border-border focus:border-primary font-bold text-xl"
                            placeholder="0"
                        />
                   </div>
                   <button type="submit" className="bg-primary text-black px-6 rounded-xl font-bold hover:bg-[#cbe63d] active:scale-[0.95] transition-all flex flex-col items-center justify-center">
                      <Plus size={24} strokeWidth={3} className="mb-1"/>
                      <span className="text-[10px] uppercase tracking-wider">Simpan</span>
                   </button>
                </div>
             </form>
          )}
        </div>
      </div>
    </div>
  );
}
