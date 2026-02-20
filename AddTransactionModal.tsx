'use client';
import { useState } from 'react';
import { Transaction, TransactionType } from '@/types/finance';
import { X, ChevronDown } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tx: Transaction) => void;
}

export default function AddTransactionModal({ isOpen, onClose, onSave }: Props) {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState('Makanan');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      amount: Number(amount),
      type,
      category,
      description,
      date: new Date().toISOString(),
    });
    setAmount('');
    setDescription('');
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-background animate-in slide-in-from-bottom-10 duration-200">
      <div className="px-6 py-6 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">New Transaction</h2>
        <button onClick={onClose} className="p-2 bg-card rounded-full text-zinc-400 hover:text-white border border-border">
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 px-6 flex flex-col">
        {/* Switcher */}
        <div className="bg-card p-1 rounded-xl flex mb-6 border border-border">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`flex-1 py-2.5 rounded-lg text-xs font-medium transition-all ${
              type === 'expense' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
            className={`flex-1 py-2.5 rounded-lg text-xs font-medium transition-all ${
              type === 'income' ? 'bg-primary text-black' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Income
          </button>
        </div>

        {/* Amount */}
        <div className="mb-8 text-center">
          <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2 block">Amount</label>
          <input 
            type="number" 
            required
            autoFocus
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-transparent text-4xl font-semibold text-white placeholder-zinc-800 outline-none text-center"
            placeholder="0"
          />
        </div>

        {/* Inputs */}
        <div className="space-y-4 mb-auto">
          <div className="relative">
             <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1.5 block px-1">Category</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-card text-white rounded-xl p-4 outline-none appearance-none text-sm border border-border"
            >
              <option>Makanan</option>
              <option>Sewa</option>
              <option>Belanja</option>
              <option>Transport</option>
              <option>Tagihan</option>
              <option>Gaji</option>
              <option>Investasi</option>
            </select>
            <ChevronDown className="absolute right-4 bottom-4 text-zinc-500 pointer-events-none" size={16} />
          </div>

           <div>
              <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1.5 block px-1">Note</label>
              <input 
                type="text" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-card text-white rounded-xl p-4 outline-none text-sm border border-border placeholder-zinc-600"
                placeholder="Description..."
              />
           </div>
        </div>

        <div className="pb-8 pt-4">
          <button type="submit" className="w-full bg-primary text-black font-semibold py-4 rounded-xl hover:bg-[#cbe63d] active:scale-[0.98] transition-all">
            Save Transaction
          </button>
        </div>
      </form>
    </div>
  );
}
