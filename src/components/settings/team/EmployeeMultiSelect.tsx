import { X } from 'lucide-react';
import { useState } from 'react';
import type { Employee } from '@/api/types';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type EmployeeMultiSelectProps = {
  employees: Employee[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
};

export function EmployeeMultiSelect({
  employees,
  selectedIds,
  onChange,
}: EmployeeMultiSelectProps) {
  const [selectKey, setSelectKey] = useState(0);

  if (employees.length === 0) {
    return (
      <p className="py-4 text-center text-xs text-[#94a3b8]">No active employees available.</p>
    );
  }

  const available = employees.filter((employee) => !selectedIds.includes(employee.id));
  const selected = employees.filter((employee) => selectedIds.includes(employee.id));

  const handleAdd = (id: string) => {
    if (!selectedIds.includes(id)) {
      onChange([...selectedIds, id]);
    }
    setSelectKey((key) => key + 1);
  };

  const handleRemove = (id: string) => {
    onChange(selectedIds.filter((selectedId) => selectedId !== id));
  };

  return (
    <div className="space-y-2">
      <Select key={selectKey} onValueChange={handleAdd} disabled={available.length === 0}>
        <SelectTrigger>
          <SelectValue
            placeholder={
              available.length === 0 ? 'All employees added' : 'Add team member...'
            }
          />
        </SelectTrigger>
        <SelectContent>
          {available.map((employee) => (
            <SelectItem key={employee.id} value={employee.id}>
              {employee.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((employee) => (
            <Badge key={employee.id} variant="default" className="gap-1 pr-1">
              {employee.name}
              <button
                type="button"
                onClick={() => handleRemove(employee.id)}
                className="rounded-full p-0.5 hover:bg-[#dbeafe]"
                aria-label={`Remove ${employee.name}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
