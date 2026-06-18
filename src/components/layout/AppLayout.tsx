import { Outlet, useLocation } from 'react-router-dom';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { PAGE_TITLES } from '@/data/logData';
import { formatTodayLabel } from '@/lib/utils';

export function StatCard({
  label,
  value,
  sub,
  color = '#0f172a',
  labelColor = '#64748b',
}: {
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
  labelColor?: string;
}) {
  return (
    <div className="rounded-xl border border-[#e2e8f0] bg-white p-5">
      <div
        className="mb-2 text-[11px] font-semibold uppercase tracking-wide"
        style={{ color: labelColor }}
      >
        {label}
      </div>
      <div className="text-[30px] font-bold leading-none" style={{ color }}>
        {value}
      </div>
      {sub && <div className="mt-1 text-xs text-[#94a3b8]">{sub}</div>}
    </div>
  );
}

export function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[#e2e8f0] bg-white p-5">
      <h3 className="mb-4 text-sm font-bold">{title}</h3>
      {children}
    </div>
  );
}

export function AppLayout() {
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] ?? 'Dashboard';

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />
      <main className="flex flex-1 flex-col overflow-hidden bg-[#f8fafc]">
        <header className="flex h-[58px] shrink-0 items-center gap-3 border-b border-[#e2e8f0] bg-white px-6">
          <div className="flex-1">
            <h1 className="m-0 text-base font-bold">{title}</h1>
            <p className="m-0 text-xs text-[#94a3b8]">{formatTodayLabel()}</p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-3 py-1.5">
            <div className="h-2 w-2 rounded-full bg-[#10b981]" />
            <span className="text-xs font-medium text-[#374151]">Live</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
