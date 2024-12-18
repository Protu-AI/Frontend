import { Search } from 'lucide-react';

export function SearchBar() {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
      <input
        type="text"
        placeholder="Search"
        className="w-full pl-9 pr-4 py-2 bg-search shadow-search rounded-lg font-archivo text-sm"
      />
    </div>
  );
}