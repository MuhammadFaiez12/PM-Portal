import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type StatusSelectProps = {
  value: boolean;
  onChange: (active: boolean) => void;
};

export function StatusSelect({ value, onChange }: StatusSelectProps) {
  return (
    <Select
      value={value ? 'active' : 'inactive'}
      onValueChange={(v) => onChange(v === 'active')}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="active">Active</SelectItem>
        <SelectItem value="inactive">Inactive</SelectItem>
      </SelectContent>
    </Select>
  );
}
