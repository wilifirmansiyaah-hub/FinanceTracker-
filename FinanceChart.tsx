'use client';
import { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell } from 'recharts';
import { Transaction } from '@/types/finance';

interface Props {
  data: Transaction[];
}

export default function FinanceChart({ data }: Props) {
  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');

  // Group data by day (Sen, Sel, Rab...)
  const chartData = data
    .filter(t => t.type === activeTab)
    .reduce((acc: any[], curr) => {
      const date = new Date(curr.date);
      const dayName = date.toLocaleDateString('id-ID', { weekday: 'short' }); // Sen, Sel
      const existing = acc.find(item => item.day === dayName);
      if (existing) {
        existing.amount += curr.amount;
      } else {
        acc.push({ day: dayName, amount: curr.amount, fullDate: date });
      }
      return acc;
    }, [])
    .sort((a, b) => a.fullDate - b.fullDate)
    .slice(-7); // Ambil 7 hari terakhir transaksi

  return (
    <div className="px-6 mb-24">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-slate-800">Analisis</h3>
        <div className="bg-slate-100 p-1 rounded-full flex text-xs font-medium">
          <button 
            onClick={() => setActiveTab('expense')}
            className={`px-3 py-1.5 rounded-full transition-all ${activeTab === 'expense' ? 'bg-[#0d9488] text-white shadow' : 'text-slate-500'}`}
          >
            Pengeluaran
          </button>
          <button 
            onClick={() => setActiveTab('income')}
            className={`px-3 py-1.5 rounded-full transition-all ${activeTab === 'income' ? 'bg-[#0d9488] text-white shadow' : 'text-slate-500'}`}
          >
            Pemasukan
          </button>
        </div>
      </div>

      <div className="h-[200px] w-full">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 12}} 
                dy={10}
              />
              <Tooltip 
                cursor={{fill: 'transparent'}}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="amount" radius={[6, 6, 6, 6]} barSize={16}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={activeTab === 'expense' ? '#0d9488' : '#10b981'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            Belum ada data grafik
          </div>
        )}
      </div>
    </div>
  );
}
