export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id?: number;
  amount: number;
  type: TransactionType;
  category: string;
  description: string;
  date: string; // ISO String
}

// --- TAMBAHAN BARU: Tipe Data Wishlist ---
export interface WishlistItem {
  id?: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  imageUrl?: string; // Menyimpan foto dalam format Base64 string
  createdAt: string;
}
