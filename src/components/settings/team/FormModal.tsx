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
      <DialogContent className="max-w-md gap-0 p-0 max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#e2e8f0] scrollbar-track-[#fafbfc] [&>button]:right-3 [&>button]:top-3">
        <div className={cn('border-b border-[#e2e8f0] px-4 py-3', styles.header)}>
          <DialogHeader className="mb-0 gap-0">
            <div className="flex items-start gap-3 pr-6">
              <div
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1',
                  styles.ring,
                )}
              >
                <Icon className={cn('h-4 w-4', styles.icon)} />
              </div>
              <div className="min-w-0 flex-1 space-y-0.5 pt-0.5">
                <DialogTitle className="text-base leading-tight">{title}</DialogTitle>
                <DialogDescription className="text-xs leading-snug">{description}</DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>
        <div className="space-y-3 px-4 py-3">{children}</div>
        <DialogFooter className="mt-0 border-t border-[#e2e8f0] bg-[#fafbfc] px-4 py-3">
          {footer}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
