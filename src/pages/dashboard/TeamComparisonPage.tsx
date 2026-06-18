import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/api/endpoints';
import { BarChart } from '@/components/charts/Charts';
import { PageSkeleton } from '@/components/feedback/skeletons';
import { ChartCard } from '@/components/layout/AppLayout';

export default function TeamComparisonPage() {
  const { data: team, isLoading } = useQuery({
    queryKey: ['dashboard', 'team'],
    queryFn: dashboardApi.team,
  });

  if (isLoading) return <PageSkeleton />;

  const members = team?.team || [];
  const workDays = team?.workDays || 1;

  const hoursData = members.map((t) => ({
    v: t.totalHours,
    l: t.employee.split(' ')[0],
    color: '#3b82f6',
  }));
  const rateData = members.map((t) => ({
    v: t.submissionRate,
    l: t.employee.split(' ')[0],
    color: '#10b981',
  }));

  return (
    <div>
      <p className="mb-5 text-sm text-[#64748b]">
        Current month comparison — {workDays} work days tracked
      </p>
      <div className="mb-5 grid grid-cols-2 gap-4">
        <ChartCard title="Total Hours This Month">
          <BarChart data={hoursData} />
        </ChartCard>
        <ChartCard title="Submission Rate %">
          <BarChart data={rateData} color="#10b981" />
        </ChartCard>
      </div>
      <div className="overflow-hidden rounded-xl border border-[#e2e8f0] bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-[#e2e8f0] bg-[#f8fafc]">
            <tr>
              {['Employee', 'Total Hours', 'Days Submitted', 'Rate %', 'Avg Mood'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#64748b]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.map((t) => (
              <tr key={t.employee} className="border-b border-[#f1f5f9]">
                <td className="px-4 py-3 font-medium">{t.employee}</td>
                <td className="px-4 py-3">{t.totalHours}h</td>
                <td className="px-4 py-3">{t.daysSubmitted}</td>
                <td className="px-4 py-3">{t.submissionRate}%</td>
                <td className="px-4 py-3">{t.avgMood}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
