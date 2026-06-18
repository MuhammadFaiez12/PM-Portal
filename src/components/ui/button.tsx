import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-[#3b82f6] text-white hover:bg-[#2563eb]',
        gradient:
          'bg-gradient-to-br from-[#3b82f6] to-[#6366f1] text-white shadow-[0_4px_14px_rgba(99,102,241,0.35)]',
        outline:
          'border-[1.5px] border-[#e2e8f0] bg-[#f8fafc] text-[#64748b] hover:bg-[#f1f5f9]',
        ghost: 'bg-transparent text-[#64748b] hover:bg-[#f1f5f9]',
        warning: 'bg-[#f59e0b] text-white hover:bg-[#d97706]',
        destructive: 'bg-[#ef4444] text-white hover:bg-[#dc2626]',
        ai: 'bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-white',
      },
      size: {
        default: 'h-11 px-4 py-2',
        sm: 'h-9 px-3 text-xs',
        lg: 'h-[52px] px-6 text-base',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
  };

export function Button({
  className,
  variant,
  size,
  asChild = false,
  loading,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      )}
      {children}
    </Comp>
  );
}
