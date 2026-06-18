import { cn } from '@/lib/utils';

const ACCENT_STYLES = {
  blue: { bg: 'bg-[#eff6ff]', icon: 'text-[#3b82f6]', ring: 'ring-[#dbeafe]' },
  green: { bg: 'bg-[#f0fdf4]', icon: 'text-[#16a34a]', ring: 'ring-[#bbf7d0]' },
} as const;

type StatCardProps = {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  accent: keyof typeof ACCENT_STYLES;
};

export function StatCard({ label, value, icon: Icon, accent }: StatCardProps) {
  const styles = ACCENT_STYLES[accent];

  return (
    <div
      className={cn(
        'flex min-w-[140px] items-center gap-3 rounded-xl border border-[#e2e8f0] bg-white px-4 py-3.5 shadow-sm ring-1',
        styles.ring,
      )}
    >
      <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', styles.bg)}>
        <Icon className={cn('h-5 w-5', styles.icon)} />
      </div>
      <div>
        <p className="text-2xl font-bold tabular-nums text-[#0f172a]">{value}</p>
        <p className="text-xs font-medium text-[#94a3b8]">{label}</p>
      </div>
    </div>
  );
}
