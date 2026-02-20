'use client';
import { useEffect, useState, useMemo } from 'react';
import Header from '@/components/Header';
import BudgetCard from '@/components/BudgetCard';
import ActivityList from '@/components/ActivityList';
import SpendingAnalysis from '@/components/SpendingAnalysis';
import BottomNav from '@/components/BottomNav';

// Komponen Halaman Baru
import ProfilePage from '@/components/Profile/ProfilePage'; // <-- Import Profile

// Modals
import AddTransactionModal from '@/components/AddTransactionModal';
import { Transaction, WishlistItem } from '@/types/finance';
import { 
  addTransaction, getTransactions, deleteTransaction,
  getWishlists, addWishlist, updateWishlist, deleteWishlist
} from '@/lib/db';
import WishlistCard from '@/components/Wishlist/WishlistCard';
import AddWishlistModal from '@/components/Wishlist/AddWishlistModal';
import WishlistDetailModal from '@/components/Wishlist/WishlistDetailModal';
import { Target, Plus } from 'lucide-react';

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);

  const [wishlists, setWishlists] = useState<WishlistItem[]>([]);
  const [isAddWishlistModalOpen, setIsAddWishlistModalOpen] = useState(false);
  const [selectedWishlist, setSelectedWishlist] = useState<WishlistItem | null>(null);

  const [activeTab, setActiveTab] = useState('home'); 

  const loadData = async () => {
    const txData = await getTransactions();
    setTransactions(txData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    const wishData = await getWishlists();
    setWishlists(wishData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

  useEffect(() => { loadData(); }, []);

  const stats = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    return { income, expense, total: income - expense };
  }, [transactions]);

  const handleAddTransaction = async (tx: Transaction) => { await addTransaction(tx); await loadData(); };
  const handleDeleteTransaction = async (id: number) => { if (confirm('Hapus transaksi?')) { await deleteTransaction(id); await loadData(); } };
  
  const handleAddWishlist = async (item: WishlistItem) => { await addWishlist(item); await loadData(); };
  const handleUpdateWishlist = async (item: WishlistItem) => { await updateWishlist(item); await loadData(); setSelectedWishlist(item); };
  const handleDeleteWishlist = async (id: number) => { await deleteWishlist(id); await loadData(); setSelectedWishlist(null); };

  const handleAddClick = () => {
    if (activeTab === 'wishlist') setIsAddWishlistModalOpen(true);
    else setIsTxModalOpen(true);
  };

  // --- RENDER HALAMAN PROFIL (FULL PAGE) ---
  if (activeTab === 'profile') {
    return (
      <main className="flex flex-col h-full w-full bg-background relative overflow-hidden">
        <ProfilePage />
        <BottomNav currentTab={activeTab} onTabChange={setActiveTab} onAddClick={handleAddClick} />
        {/* Modal tetap dirender agar transisi smooth jika dipanggil */}
        <AddTransactionModal isOpen={isTxModalOpen} onClose={() => setIsTxModalOpen(false)} onSave={handleAddTransaction} />
      </main>
    );
  }

  // --- RENDER HALAMAN UTAMA (HOME, WISHLIST, STATS) ---
  return (
    <main className="flex flex-col h-full w-full bg-background relative overflow-hidden">
      
      {/* 1. FIXED HEADER */}
      {activeTab === 'home' && (
        <div className="shrink-0 z-20 bg-background w-full">
          <Header />
          <BudgetCard expense={stats.expense} limit={5000000} />
          <div className="px-6 mt-2 pb-2 flex justify-between items-end border-b border-zinc-800/50">
             <h3 className="font-semibold text-white text-base">Riwayat Transaksi</h3>
             <button className="text-[10px] text-primary hover:underline uppercase tracking-wide">Lihat Semua</button>
          </div>
        </div>
      )}

      {/* Header Tab Wishlist & Stats */}
      {(activeTab === 'wishlist' || activeTab === 'stats') && (
        <div className="shrink-0 z-20 bg-background w-full pt-10 px-6 pb-6 border-b border-zinc-800/50">
            <div className="flex items-center gap-3">
                {activeTab === 'wishlist' && <Target className="text-primary" size={28} />}
                <h2 className="text-3xl font-extrabold text-white tracking-tight">
                    {activeTab === 'wishlist' ? 'Target Tabungan' : 'Analisis Keuangan'}
                </h2>
            </div>
             {activeTab === 'wishlist' && <p className="text-zinc-400 text-sm mt-1 font-medium">Wujudkan impianmu satu per satu.</p>}
        </div>
      )}

      {/* 2. SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto no-scrollbar w-full pb-36 relative">
        
        {activeTab === 'home' && (
          <ActivityList transactions={transactions} onDelete={handleDeleteTransaction} />
        )}

        {activeTab === 'wishlist' && (
          <div className="px-6 py-4 space-y-4 min-h-full">
             {wishlists.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-60 mt-10 border-2 border-dashed border-zinc-800 rounded-3xl">
                   <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-zinc-800">
                       <Target size={40} className="text-zinc-700" />
                   </div>
                   <h3 className="text-white font-bold text-lg mb-2">Belum Ada Target</h3>
                   <p className="text-zinc-500 text-sm max-w-[200px] leading-relaxed">Tekan tombol + di bawah untuk mulai membuat target impianmu.</p>
                </div>
             ) : (
                <>
                    {wishlists.map(item => (
                       <WishlistCard key={item.id} item={item} onClick={() => setSelectedWishlist(item)} />
                    ))}
                    <button onClick={() => setIsAddWishlistModalOpen(true)} className="w-full py-4 rounded-[24px] border-2 border-dashed border-zinc-800 text-zinc-500 text-sm font-bold hover:bg-white/5 hover:text-primary hover:border-primary/30 transition-all flex items-center justify-center gap-2 uppercase tracking-widest group mt-4">
                        <Plus size={18} className="group-hover:scale-110 transition-transform"/> Buat Target Baru
                    </button>
                </>
             )}
          </div>
        )}

        {activeTab === 'stats' && (
          <SpendingAnalysis transactions={transactions} />
        )}
      </div>

      {/* 3. NAVIGATION */}
      <BottomNav currentTab={activeTab} onTabChange={setActiveTab} onAddClick={handleAddClick} />

      {/* MODALS */}
      <AddTransactionModal isOpen={isTxModalOpen} onClose={() => setIsTxModalOpen(false)} onSave={handleAddTransaction} />
      <AddWishlistModal isOpen={isAddWishlistModalOpen} onClose={() => setIsAddWishlistModalOpen(false)} onSave={handleAddWishlist} />
      <WishlistDetailModal item={selectedWishlist} onClose={() => setSelectedWishlist(null)} onUpdate={handleUpdateWishlist} onDelete={handleDeleteWishlist} />

    </main>
  );
}
