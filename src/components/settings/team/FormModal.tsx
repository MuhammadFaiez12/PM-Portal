import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const ACCENT_STYLES = {
  blue: {
    header: 'bg-gradient-to-r from-[#eff6ff] to-white',
    ring: 'ring-[#dbeafe]',
    icon: 'text-[#3b82f6]',
  },
  green: {
    header: 'bg-gradient-to-r from-[#f0fdf4] to-white',
    ring: 'ring-[#bbf7d0]',
    icon: 'text-[#16a34a]',
  },
} as const;

type FormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accent: keyof typeof ACCENT_STYLES;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  footer: React.ReactNode;
  children: React.ReactNode;
};

export function FormModal({
  open,
  onOpenChange,
  accent,
  icon: Icon,
  title,
  description,
  footer,
  children,
}: FormModalProps) {
  const styles = ACCENT_STYLES[accent];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-0 p-0 max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#e2e8f0] scrollbar-track-[#fafbfc]">
        <div className={cn('border-b border-[#e2e8f0] px-6 py-5', styles.header)}>
          <DialogHeader className="mb-0">
            <div
              className={cn(
                'mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm ring-1',
                styles.ring,
              )}
            >
              <Icon className={cn('h-5 w-5', styles.icon)} />
            </div>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
        </div>
        <div className="space-y-4 px-6 py-5">{children}</div>
        <DialogFooter className="border-t border-[#e2e8f0] bg-[#fafbfc] px-6 py-4">
          {footer}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
