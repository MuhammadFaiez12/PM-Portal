import { PanelHeader } from './PanelHeader';
import { SearchBar } from './SearchBar';

type DataPanelProps = {
  title: string;
  description: string;
  action: React.ReactNode;
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  children: React.ReactNode;
};

export function DataPanel({
  title,
  description,
  action,
  search,
  onSearchChange,
  searchPlaceholder,
  children,
}: DataPanelProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">
      <PanelHeader title={title} description={description} action={action} />
      <SearchBar value={search} onChange={onSearchChange} placeholder={searchPlaceholder} />
      {children}
    </div>
  );
}
