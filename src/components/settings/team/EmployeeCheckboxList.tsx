import type { Employee } from '@/api/types';
import { cn } from '@/lib/utils';
import { EmployeeAvatar } from './EmployeeAvatar';

type EmployeeCheckboxListProps = {
  employees: Employee[];
  selectedIds: string[];
  onToggle: (id: string) => void;
};

export function EmployeeCheckboxList({
  employees,
  selectedIds,
  onToggle,
}: EmployeeCheckboxListProps) {
  if (employees.length === 0) {
    return (
      <p className="py-4 text-center text-xs text-[#94a3b8]">No active employees available.</p>
    );
  }

  return (
    <div className="max-h-52 space-y-1 overflow-y-auto rounded-xl border border-[#e2e8f0] bg-[#fafbfc] p-2">
      {employees.map((emp) => {
        const checked = selectedIds.includes(emp.id);
        return (
          <label
            key={emp.id}
            className={cn(
              'flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition-all',
              checked ? 'bg-white shadow-sm ring-1 ring-[#dbeafe]' : 'hover:bg-white/70',
            )}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => onToggle(emp.id)}
              className="h-4 w-4 rounded border-[#cbd5e1] accent-[#3b82f6]"
            />
            <EmployeeAvatar name={emp.name} size="sm" />
            <span className="text-sm font-medium text-[#0f172a]">{emp.name}</span>
          </label>
        );
      })}
    </div>
  );
}
