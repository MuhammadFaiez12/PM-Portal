import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker, getDefaultClassNames } from 'react-day-picker';
import { cn } from '@/lib/utils';

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const defaults = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      navLayout="around"
      className={cn('rdp-themed p-3', className)}
      classNames={{
        ...defaults,
        month_caption: cn(defaults.month_caption, 'relative mb-2'),
        caption_label: cn(defaults.caption_label, 'text-sm font-semibold text-[#0f172a]'),
        button_previous: cn(
          defaults.button_previous,
          'rounded-md text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a]',
        ),
        button_next: cn(
          defaults.button_next,
          'rounded-md text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a]',
        ),
        weekday: cn(defaults.weekday, 'text-[0.75rem] font-medium text-[#94a3b8]'),
        day_button: cn(
          defaults.day_button,
          'rounded-md text-[#0f172a] hover:bg-[#f1f5f9]',
        ),
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: chevronClassName, ...chevronProps }) => {
          const Icon = orientation === 'left' ? ChevronLeft : ChevronRight;
          return (
            <Icon className={cn('h-4 w-4', chevronClassName)} {...chevronProps} />
          );
        },
      }}
      {...props}
    />
  );
}

export { Calendar };
