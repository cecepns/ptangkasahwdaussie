import { Search } from "lucide-react";

export default function SearchInput({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-colors"
      />
    </div>
  );
}
