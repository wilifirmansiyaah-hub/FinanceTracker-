import { openDB, DBSchema } from 'idb';
import { Transaction, WishlistItem } from '@/types/finance'; // Import WishlistItem

interface FinanceDB extends DBSchema {
  transactions: {
    key: number;
    value: Transaction;
    indexes: { 'by-date': string };
  };
  // --- TAMBAHAN BARU: Store Wishlist ---
  wishlists: {
    key: number;
    value: WishlistItem;
  };
}

const DB_NAME = 'finance-tracker-sann404';

export const initDB = async () => {
  // PENTING: Naikkan versi DB ke 2 untuk memicu upgrade
  return openDB<FinanceDB>(DB_NAME, 2, { 
    upgrade(db, oldVersion) {
      // Migrasi versi 1 (Transaksi)
      if (oldVersion < 1) {
        if (!db.objectStoreNames.contains('transactions')) {
          const store = db.createObjectStore('transactions', { keyPath: 'id', autoIncrement: true });
          store.createIndex('by-date', 'date');
        }
      }
      // --- TAMBAHAN BARU: Migrasi versi 2 (Wishlist) ---
      if (oldVersion < 2) {
        if (!db.objectStoreNames.contains('wishlists')) {
          db.createObjectStore('wishlists', { keyPath: 'id', autoIncrement: true });
          console.log('Object store "wishlists" created!');
        }
      }
    },
  });
};

// ... (Fungsi Transaksi lama biarkan saja) ...
export const addTransaction = async (tx: Transaction) => {
  const db = await initDB();
  return db.add('transactions', tx);
};
export const getTransactions = async () => {
  const db = await initDB();
  return db.getAllFromIndex('transactions', 'by-date');
};
export const deleteTransaction = async (id: number) => {
  const db = await initDB();
  return db.delete('transactions', id);
};

// --- TAMBAHAN BARU: Fungsi CRUD Wishlist ---
export const getWishlists = async () => {
  const db = await initDB();
  return db.getAll('wishlists');
};

export const addWishlist = async (item: WishlistItem) => {
  const db = await initDB();
  return db.add('wishlists', item);
};

export const updateWishlist = async (item: WishlistItem) => {
  const db = await initDB();
  return db.put('wishlists', item);
};

export const deleteWishlist = async (id: number) => {
  const db = await initDB();
  return db.delete('wishlists', id);
};
