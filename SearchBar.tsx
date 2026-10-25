import React from 'react';
import { Search, X } from 'lucide-react';
import { ThemeMode } from '../types';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  theme: ThemeMode;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  theme
}) => {
  const isDark = theme === 'dark';

  return (
    <div className="w-full px-4 sm:px-6 mb-4">
      {/* Search Input Box */}
      <div className="relative w-full">
        <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
          isDark ? 'text-neutral-500' : 'text-neutral-400'
        }`} />

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Pesquisar entre os 15 truques..."
          className={`w-full pl-10 pr-10 py-3 rounded-2xl text-xs sm:text-sm font-medium outline-none transition-all duration-200 border ${
            isDark
              ? 'bg-neutral-900 border-neutral-800 text-white placeholder-neutral-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30'
              : 'bg-white border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 shadow-sm'
          }`}
        />

        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            aria-label="Limpar pesquisa"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
