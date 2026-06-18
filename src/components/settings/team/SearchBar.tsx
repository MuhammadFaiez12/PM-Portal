import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
};

export function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  return (
    <div className="border-b border-[#f1f5f9] px-5 py-3">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 pl-9"
        />
      </div>
    </div>
  );
}
