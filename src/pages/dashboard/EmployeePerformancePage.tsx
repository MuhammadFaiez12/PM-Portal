import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { dashboardApi, employeesApi } from '@/api/endpoints';
import { BarChart, LineChart } from '@/components/charts/Charts';
import { PageSkeleton } from '@/components/feedback/skeletons';
import { ChartCard, StatCard } from '@/components/layout/AppLayout';

export default function EmployeePerformancePage() {
  const [selEmp, setSelEmp] = useState('');

  const { data: employees = [] } = useQuery({
    queryKey: ['employees', 'active'],
    queryFn: employeesApi.listActive,
  });

  const empNames = employees.map((e) => e.name);
  const selectedEmp = selEmp || empNames[0] || '';

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard', 'employee', selectedEmp],
    queryFn: () => dashboardApi.employee(selectedEmp),
    enabled: !!selectedEmp,
  });

  if (isLoading) return <PageSkeleton />;

  const reports = stats?.reports || [];
  const hoursData = [...reports].reverse().slice(-14).map((r) => ({
    v: r.hoursSpent,
    l: r.date.slice(5),
  }));
  const moodData = [...reports].reverse().slice(-14).map((r) => ({
    v: r.mood,
    l: r.date.slice(5),
  }));
  const progData = [...reports].reverse().slice(-14).map((r) => ({
    v: r.progressPercent,
    l: r.date.slice(5),
  }));

  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <label className="text-sm font-medium">Select Employee:</label>
        <select
          value={selectedEmp}
          onChange={(e) => setSelEmp(e.target.value)}
          className="rounded-lg border border-[#e2e8f0] px-3 py-2 text-sm"
        >
          {employees.map((e) => (
            <option key={e.id} value={e.name}>
              {e.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-5 grid grid-cols-4 gap-4">
        <StatCard label="Avg Hours/Day" value={stats?.stats.avgHours ?? '0'} sub="last 30 reports" />
        <StatCard
          label="Avg Mood"
          value={stats?.stats.avgMood ?? '0'}
          sub="out of 5"
          color="#f59e0b"
          labelColor="#f59e0b"
        />
        <StatCard
          label="Avg Progress"
          value={`${stats?.stats.avgProgress ?? 0}%`}
          sub="task completion"
          color="#3b82f6"
          labelColor="#3b82f6"
        />
        <StatCard
          label="Blocker Days"
          value={stats?.stats.blockers ?? 0}
          sub="with issues"
          color="#ef4444"
          labelColor="#ef4444"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard title="Hours Spent">
          <BarChart data={hoursData} color="#3b82f6" />
        </ChartCard>
        <ChartCard title="Mood Trend">
          <LineChart data={moodData} color="#f59e0b" yMin={1} yMax={5} />
        </ChartCard>
        <ChartCard title="Progress %">
          <LineChart data={progData} color="#10b981" yMin={0} yMax={100} />
        </ChartCard>
      </div>
    </div>
  );
}
