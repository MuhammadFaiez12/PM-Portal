import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { AlertTriangle } from 'lucide-react';
import { dashboardApi, employeesApi } from '@/api/endpoints';
import { BarChart, LineChart } from '@/components/charts/Charts';
import { PageSkeleton } from '@/components/feedback/skeletons';
import { ChartCard, StatCard } from '@/components/layout/AppLayout';
import { HEATMAP_COLORS } from '@/data/logData';
import { getPKTDate, getRecentWeekdays } from '@/lib/utils';

export default function OverviewPage() {
  const { data: employees = [] } = useQuery({
    queryKey: ['employees', 'active'],
    queryFn: employeesApi.listActive,
  });

  const empNames = employees.map((e) => e.name);
  const weekDates = useMemo(() => getRecentWeekdays(7), []);
  const todayPKT = getPKTDate();

  const { data: overview, isLoading: overviewLoading } = useQuery({
    queryKey: ['dashboard', 'overview'],
    queryFn: () => dashboardApi.overview(),
  });

  const { data: monthly } = useQuery({
    queryKey: ['dashboard', 'monthly', new Date().getMonth() + 1, new Date().getFullYear()],
    queryFn: () => dashboardApi.monthly(new Date().getMonth() + 1, new Date().getFullYear()),
  });

  const heatmapRows = useMemo(() => {
    const reports = monthly?.reports || [];
    return empNames.map((emp) => ({
      name: emp,
      cells: weekDates.map((wd) => {
        const sub = reports.find((r) => r.employeeName === emp && r.date === wd.date);
        if (sub) return { color: HEATMAP_COLORS.submitted, title: `Submitted ${wd.label}` };
        return {
          color: wd.date === todayPKT ? HEATMAP_COLORS.todayMissing : HEATMAP_COLORS.missing,
          title: `Missing ${wd.label}`,
        };
      }),
    }));
  }, [empNames, weekDates, monthly?.reports, todayPKT]);

  const moodWeekData = weekDates.map((wd) => {
    const dayReps = (monthly?.reports || []).filter((r) => r.date === wd.date);
    const avg =
      dayReps.length > 0 ? dayReps.reduce((a, r) => a + r.mood, 0) / dayReps.length : 0;
    return { v: avg, l: wd.shortLabel };
  });

  if (overviewLoading) return <PageSkeleton />;

  const submittedCnt = overview?.submitted.length ?? 0;
  const totalEmps = overview?.total ?? 0;
  const missingCnt = overview?.missing.length ?? 0;

  return (
    <div>
      <div className="mb-5 grid grid-cols-4 gap-4">
        <StatCard label="Team Size" value={totalEmps} sub="employees" />
        <StatCard
          label="Submitted Today"
          value={submittedCnt}
          sub={`of ${totalEmps} members`}
          color="#10b981"
          labelColor="#10b981"
        />
        <StatCard
          label="Missing Today"
          value={missingCnt}
          sub="not submitted"
          color="#ef4444"
          labelColor="#ef4444"
        />
        <StatCard
          label="Avg Mood Today"
          value={overview?.avgMood ?? 'N/A'}
          sub="out of 5.0"
          color="#f59e0b"
          labelColor="#f59e0b"
        />
      </div>

      {(overview?.missing.length ?? 0) > 0 && (
        <div className="mb-5 flex items-center gap-2 rounded-xl border border-[#fecaca] bg-[#fff5f5] px-5 py-4">
          <AlertTriangle className="h-4 w-4 shrink-0 text-[#dc2626]" />
          <p className="m-0 text-sm font-semibold text-[#dc2626]">
            Missing submissions today: {overview?.missing.join(', ')}
          </p>
        </div>
      )}

      <div className="mb-5 rounded-xl border border-[#e2e8f0] bg-white p-5">
        <h3 className="mb-4 text-sm font-bold">Submission Heatmap (Last 7 Weekdays)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="pb-2 text-left font-medium text-[#64748b]">Employee</th>
                {weekDates.map((d, i) => (
                  <th key={i} className="pb-2 text-center font-medium text-[#64748b]">
                    {d.shortLabel}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heatmapRows.map((row) => (
                <tr key={row.name}>
                  <td className="py-1.5 font-medium">{row.name}</td>
                  {row.cells.map((cell, i) => (
                    <td key={i} className="py-1.5 text-center">
                      <div
                        className="mx-auto h-6 w-6 rounded"
                        style={{ background: cell.color }}
                        title={cell.title}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ChartCard title="Team Mood Trend (7 Days)">
        <LineChart data={moodWeekData} color="#f59e0b" yMin={1} yMax={5} />
      </ChartCard>
    </div>
  );
}
