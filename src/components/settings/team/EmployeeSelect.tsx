import type { Employee } from '@/api/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

type EmployeeSelectProps = {
  employees: Employee[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  valueKey?: 'id' | 'name';
};

export function EmployeeSelect({
  employees,
  value,
  onValueChange,
  placeholder = 'Select employee...',
  disabled,
  className,
  valueKey = 'id',
}: EmployeeSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      disabled={disabled || employees.length === 0}
    >
      <SelectTrigger className={cn(className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {employees.map((employee) => (
          <SelectItem
            key={employee.id}
            value={valueKey === 'name' ? employee.name : employee.id}
          >
            {employee.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
