import { useState } from 'react';
import { format, parse, isValid } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn, formatShortDate } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type DatePickerProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

function parseDateString(dateStr: string): Date | undefined {
  if (!dateStr) return undefined;
  const parsed = parse(dateStr, 'yyyy-MM-dd', new Date());
  return isValid(parsed) ? parsed : undefined;
}

function toDateString(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Pick a date',
  className,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const selected = parseDateString(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'flex w-full items-center justify-between rounded-lg border-[1.5px] border-[#e2e8f0] bg-white px-3 py-2.5 text-sm transition-colors hover:border-[#cbd5e1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6]/20',
            value ? 'text-[#0f172a]' : 'text-[#94a3b8]',
            className,
          )}
        >
          <span>{value ? formatShortDate(value) : placeholder}</span>
          <CalendarIcon className="h-4 w-4 shrink-0 text-[#94a3b8]" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start" sideOffset={8}>
        <Calendar
          mode="single"
          selected={selected}
          defaultMonth={selected}
          onSelect={(date) => {
            if (date) {
              onChange(toDateString(date));
              setOpen(false);
            }
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
