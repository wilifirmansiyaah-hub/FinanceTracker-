'use client';
import { useState, useRef } from 'react';
import { WishlistItem } from '@/types/finance';
import { X, Camera } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: WishlistItem) => void;
}

export default function AddWishlistModal({ isOpen, onClose, onSave }: Props) {
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle file upload (convert to Base64)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validasi ukuran (misal max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran foto terlalu besar (Maks. 2MB)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !target || Number(target) <= 0) return;

    onSave({
      name,
      targetAmount: Number(target),
      currentAmount: 0,
      imageUrl: image || undefined,
      createdAt: new Date().toISOString(),
    });

    // Reset form
    setName('');
    setTarget('');
    setImage(null);
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-background animate-in slide-in-from-bottom-10 duration-200">
      <div className="px-6 py-6 flex justify-between items-center border-b border-border/50">
        <h2 className="text-lg font-semibold text-white">Buat Target Baru</h2>
        <button onClick={onClose} className="p-2 bg-card rounded-full text-zinc-400 hover:text-white border border-border">
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 px-6 flex flex-col overflow-y-auto py-6">
        
        {/* Upload Foto */}
        <div className="flex justify-center mb-8">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-32 h-32 rounded-[24px] bg-card border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-white/5 transition-all overflow-hidden relative group"
          >
            {image ? (
              <>
                 <img src={image} alt="Preview" className="w-full h-full object-cover opacity-50 group-hover:opacity-30 transition-opacity" />
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Camera size={28} className="text-white mb-1 drop-shadow-md" />
                    <span className="text-[10px] text-white font-medium drop-shadow-md">Ubah Foto</span>
                 </div>
              </>
            ) : (
              <>
                <Camera size={28} className="text-zinc-600 mb-2 group-hover:text-primary transition-colors" />
                <span className="text-[10px] text-zinc-600 font-medium group-hover:text-zinc-400 transition-colors">Upload Foto</span>
              </>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/png, image/jpeg, image/jpg" 
              className="hidden" 
            />
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-6 mb-auto">
            <div>
              <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2 block px-1">Nama Target</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-card text-white rounded-xl p-4 outline-none text-sm border border-border placeholder-zinc-700 focus:border-primary/50 transition-all font-medium"
                placeholder="Misal: Beli Laptop Baru"
              />
            </div>

            <div>
              <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2 block px-1">Target Harga (Rp)</label>
              <input 
                type="number" 
                required
                min="1"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full bg-card text-white rounded-xl p-4 outline-none text-sm border border-border placeholder-zinc-700 focus:border-primary/50 transition-all font-bold"
                placeholder="0"
              />
            </div>
        </div>

        <div className="pb-8 pt-4">
          <button type="submit" className="w-full bg-primary text-black font-semibold py-4 rounded-xl hover:bg-[#cbe63d] active:scale-[0.98] transition-all shadow-lg shadow-primary/10">
            Simpan Target
          </button>
        </div>
      </form>
    </div>
  );
}
