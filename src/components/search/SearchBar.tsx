import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = "SEARCH..." }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-hoopland-dark" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-field pl-10 pr-10"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-hoopland-border rounded min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Clear search"
        >
          <X className="w-5 h-5 sm:w-4 sm:h-4 text-hoopland-dark" />
        </button>
      )}
    </div>
  );
}

