'use client';
import { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, // KUNCI UTAMA: Combo Chart
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Area 
} from 'recharts';
import { Transaction } from '@/types/finance';
import { formatCurrency } from '@/lib/utils';
import { Coffee, ShoppingBag, Home, Zap, Wallet, TrendingUp } from 'lucide-react';

interface Props {
  transactions: Transaction[];
}

export default function SpendingAnalysis({ transactions }: Props) {
  const [range, setRange] = useState<'week' | 'month'>('week');

  // Logic Filter Data
  const chartData = useMemo(() => {
    const now = new Date();
    // Buat template data 7 hari terakhir (jika week) atau range bulan
    // Agar grafik tetap jalan dari kiri ke kanan meski data kosong
    const days = range === 'week' ? 7 : 30;
    const dataMap = new Map();

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const key = d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' }); // Sen 12
      dataMap.set(key, { name: key, income: 0, expense: 0, rawDate: d });
    }

    transactions.forEach(t => {
      const tDate = new Date(t.date);
      // Filter sederhana berdasarkan hari
      const diffTime = Math.abs(now.getTime() - tDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

      if (diffDays <= days) {
        const key = tDate.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' });
        if (dataMap.has(key)) {
          const entry = dataMap.get(key);
          if (t.type === 'income') entry.income += t.amount;
          else entry.expense += t.amount;
        }
      }
    });

    return Array.from(dataMap.values());
  }, [transactions, range]);

  // Logic Top Kategori
  const topCategories = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const grouped: any = {};
    const total = expenses.reduce((acc, t) => acc + t.amount, 0);

    expenses.forEach(t => {
      grouped[t.category] = (grouped[t.category] || 0) + t.amount;
    });

    return Object.keys(grouped).map(k => ({
      name: k,
      amount: grouped[k],
      percent: total === 0 ? 0 : Math.round((grouped[k] / total) * 100)
    })).sort((a, b) => b.amount - a.amount).slice(0, 4);
  }, [transactions]);

  const getIcon = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'makanan': return <Coffee size={16} className="text-yellow-400" />;
      case 'belanja': return <ShoppingBag size={16} className="text-purple-400" />;
      case 'sewa': return <Home size={16} className="text-blue-400" />;
      case 'tagihan': return <Zap size={16} className="text-cyan-400" />;
      default: return <Wallet size={16} className="text-slate-400" />;
    }
  };

  return (
    <div className="pb-28 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Section */}
      <div className="px-6 mb-6 pt-2 flex justify-between items-center">
        <div>
           <h2 className="text-xl font-bold text-white">Analisis Pasar</h2>
           <p className="text-slate-500 text-xs">Realtime Spending Data</p>
        </div>
        <div className="bg-[#151A2D] p-1 rounded-lg border border-slate-800 flex">
          {(['week', 'month'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                range === r ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {r === 'week' ? '7 Hari' : '30 Hari'}
            </button>
          ))}
        </div>
      </div>

      {/* COMBO CHART (LINE + BAR) */}
      <div className="h-[250px] w-full px-2 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.5}/>
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
            <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#64748b', fontSize: 10}} 
                dy={10}
            />
            <Tooltip 
                cursor={{fill: '#1e293b', opacity: 0.4}}
                contentStyle={{ 
                    backgroundColor: '#0F172A', 
                    borderRadius: '12px', 
                    border: '1px solid #1e293b', 
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' 
                }}
                labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
            />
            {/* AREA/LINE UNTUK PEMASUKAN (Trend) */}
            <Area 
                type="monotone" 
                dataKey="income" 
                stroke="#06b6d4" 
                strokeWidth={3}
                fill="url(#lineGradient)" 
            />
            {/* BAR UNTUK PENGELUARAN (Volume) */}
            <Bar 
                dataKey="expense" 
                fill="url(#barGradient)" 
                radius={[4, 4, 0, 0]} 
                barSize={16} 
            />
          </ComposedChart>
        </ResponsiveContainer>
        
        {/* Legend */}
        <div className="flex justify-center gap-6 mt-2">
           <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
              <span className="text-[10px] text-slate-400">Pengeluaran (Bar)</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-3 h-1 bg-cyan-400 rounded-full"></div>
              <span className="text-[10px] text-slate-400">Pemasukan (Line)</span>
           </div>
        </div>
      </div>

      {/* TOP KATEGORI */}
      <div className="px-6">
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-white text-sm">Top Kategori</h3>
            <TrendingUp size={16} className="text-slate-500" />
        </div>
        
        <div className="space-y-3">
          {topCategories.map((cat, idx) => (
            <div key={idx} className="bg-[#151A2D] p-3 rounded-xl border border-slate-800/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                  {getIcon(cat.name)}
                </div>
                <div>
                  <p className="font-bold text-slate-200 text-xs">{cat.name}</p>
                  <p className="text-slate-500 text-[10px]">Total: {formatCurrency(cat.amount)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                 <div className="text-right">
                    <p className="text-xs font-bold text-white">{cat.percent}%</p>
                    <div className="w-16 h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                       <div 
                          className="h-full bg-blue-500 rounded-full" 
                          style={{ width: `${cat.percent}%` }}
                       ></div>
                    </div>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
