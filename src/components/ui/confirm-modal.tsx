import { AlertTriangle } from 'lucide-react';
import { LoadingButton } from '@/components/feedback/LoadingButton';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

type ConfirmModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  isLoading?: boolean;
  variant?: 'destructive' | 'default';
};

export function ConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  isLoading = false,
  variant = 'destructive',
}: ConfirmModalProps) {
  const isDestructive = variant === 'destructive';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-0 p-0 [&>button]:right-3 [&>button]:top-3">
        <div
          className={cn(
            'border-b border-[#e2e8f0] px-4 py-3',
            isDestructive
              ? 'bg-gradient-to-r from-[#fef2f2] to-white'
              : 'bg-gradient-to-r from-[#eff6ff] to-white',
          )}
        >
          <DialogHeader className="mb-0 gap-0">
            <div className="flex items-start gap-3 pr-6">
              <div
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1',
                  isDestructive ? 'ring-[#fecaca]' : 'ring-[#dbeafe]',
                )}
              >
                <AlertTriangle
                  className={cn('h-4 w-4', isDestructive ? 'text-[#ef4444]' : 'text-[#3b82f6]')}
                />
              </div>
              <div className="min-w-0 flex-1 space-y-0.5 pt-0.5">
                <DialogTitle className="text-base leading-tight">{title}</DialogTitle>
                {description && (
                  <DialogDescription className="text-xs leading-snug">{description}</DialogDescription>
                )}
              </div>
            </div>
          </DialogHeader>
        </div>
        <DialogFooter className="mt-0 px-4 py-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <LoadingButton
            variant={isDestructive ? 'destructive' : 'default'}
            loading={isLoading}
            onClick={onConfirm}
          >
            {confirmLabel}
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
