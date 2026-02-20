import { Download } from 'lucide-react';

interface Props {
  month: number;
  year: number;
  onFilterChange: (month: number, year: number) => void;
  onExport: () => void;
}

export default function FilterBar({ month, year, onFilterChange, onExport }: Props) {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex gap-2">
        <select 
          value={month} 
          onChange={(e) => onFilterChange(Number(e.target.value), year)}
          className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white text-sm font-medium rounded-lg px-3 py-2 outline-none"
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i}>{new Date(0, i).toLocaleString('en', { month: 'short' })}</option>
          ))}
        </select>
        <select 
          value={year}
          onChange={(e) => onFilterChange(month, Number(e.target.value))}
          className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white text-sm font-medium rounded-lg px-3 py-2 outline-none"
        >
          {[2025, 2026, 2027].map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>
      <button onClick={onExport} className="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg">
        <Download size={18} />
      </button>
    </div>
  );
}
