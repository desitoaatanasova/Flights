import { Search, X } from 'lucide-react';

export default function SearchBar({ placeholder = 'Search...', value, onChange, onClear, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
      <input
        type="text"
        placeholder={placeholder}
        value={value || ''}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-sky-500/50 transition"
      />
      {value && (
        <button onClick={onClear} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
