import { useState, type ReactNode } from 'react';
import { LoadingButton } from '@/components/feedback/LoadingButton';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { MoreVertical } from 'lucide-react';

export type TableRowAction = {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  variant?: 'default' | 'destructive';
  loading?: boolean;
  hidden?: boolean;
};

type TableRowActionsMenuProps = {
  actions: TableRowAction[];
  label?: string;
  align?: 'start' | 'center' | 'end';
};

export function TableRowActionsMenu({
  actions,
  label = 'Open row actions',
  align = 'end',
}: TableRowActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const visibleActions = actions.filter((action) => !action.hidden);

  if (visibleActions.length === 0) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a]"
        >
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">{label}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-1" align={align}>
        {visibleActions.map((action) => {
          const handleClick = () => {
            setOpen(false);
            action.onClick();
          };

          const isDestructive = action.variant === 'destructive';
          const itemClassName = cn(
            'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm',
            isDestructive
              ? 'text-[#ef4444] hover:bg-[#fef2f2] hover:text-[#dc2626]'
              : 'text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a]',
          );

          if (action.loading !== undefined) {
            return (
              <LoadingButton
                key={action.label}
                size="sm"
                variant="ghost"
                className={cn(
                  'h-auto w-full justify-start gap-2 rounded-md px-3 py-2 text-sm font-normal',
                  isDestructive && 'text-[#ef4444] hover:bg-[#fef2f2] hover:text-[#dc2626]',
                )}
                loading={action.loading}
                onClick={handleClick}
              >
                {action.icon}
                {action.label}
              </LoadingButton>
            );
          }

          return (
            <button
              key={action.label}
              type="button"
              className={itemClassName}
              onClick={handleClick}
            >
              {action.icon}
              {action.label}
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
