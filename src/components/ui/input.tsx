import * as React from 'react';
import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        'flex w-full rounded-lg border-[1.5px] border-[#e2e8f0] bg-white px-3 py-2.5 text-sm text-[#0f172a] placeholder:text-[#94a3b8]',
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Input.displayName = 'Input';
