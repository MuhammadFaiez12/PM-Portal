import { cn } from '@/lib/utils';
import { getInitials } from './utils';

type EmployeeAvatarProps = {
  name: string;
  size?: 'sm' | 'md';
};

const SIZE_CLASSES = {
  sm: 'h-7 w-7 text-[10px]',
  md: 'h-9 w-9 text-xs shadow-sm',
};

export function EmployeeAvatar({ name, size = 'md' }: EmployeeAvatarProps) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#3b82f6] to-[#6366f1] font-bold text-white',
        SIZE_CLASSES[size],
      )}
    >
      {getInitials(name)}
    </div>
  );
}
