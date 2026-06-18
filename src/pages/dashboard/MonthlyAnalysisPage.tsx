import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Download, Sparkles } from 'lucide-react';
import { aiApi, dashboardApi, reportsApi } from '@/api/endpoints';
import { Skeleton } from '@/components/feedback/skeletons';
import { LoadingButton } from '@/components/feedback/LoadingButton';
import { MOOD_EMOJIS, MONTH_NAMES, YEAR_OPTIONS } from '@/data/logData';

export default function MonthlyAnalysisPage() {
  const now = new Date();
  const [selMonth, setSelMonth] = useState(now.getMonth());
  const [selYear, setSelYear] = useState(now.getFullYear());
  const [aiSummary, setAiSummary] = useState('');
  const [aiError, setAiError] = useState('');

  const { data: monthly, isLoading } = useQuery({
    queryKey: ['dashboard', 'monthly', selMonth + 1, selYear],
    queryFn: () => dashboardApi.monthly(selMonth + 1, selYear),
  });

  const aiMutation = useMutation({
    mutationFn: () => aiApi.monthlySummary(selMonth + 1, selYear),
    onSuccess: (data) => {
      setAiSummary(data.summary);
      setAiError('');
    },
    onError: () => setAiError('Generation failed. Please try again.'),
  });

  const handleExport = async () => {
    const res = await reportsApi.exportCsv(selMonth + 1, selYear);
    const url = URL.createObjectURL(res.data);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report_${selYear}_${String(selMonth + 1).padStart(2, '0')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const summary = monthly?.summary || [];
  const aiParas = aiSummary ? aiSummary.split('\n\n').filter((p) => p.trim()) : [];

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <select
          value={selMonth}
          onChange={(e) => setSelMonth(Number(e.target.value))}
          className="rounded-lg border border-[#e2e8f0] px-3 py-2 text-sm"
        >
          {MONTH_NAMES.map((m, i) => (
            <option key={m} value={i}>
              {m}
            </option>
          ))}
        </select>
        <select
          value={selYear}
          onChange={(e) => setSelYear(Number(e.target.value))}
          className="rounded-lg border border-[#e2e8f0] px-3 py-2 text-sm"
        >
          {YEAR_OPTIONS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <LoadingButton variant="ai" size="sm" loading={aiMutation.isPending} onClick={() => aiMutation.mutate()}>
          <Sparkles className="mr-1.5 h-3.5 w-3.5" />
          AI Summary
        </LoadingButton>
        <LoadingButton variant="outline" size="sm" onClick={handleExport}>
          <Download className="mr-1.5 h-3.5 w-3.5" />
          Export CSV
        </LoadingButton>
      </div>

      {aiMutation.isPending && (
        <div className="mb-5 rounded-xl border border-[#e2e8f0] bg-white p-5">
          <Skeleton className="mb-2 h-4 w-48" />
          <Skeleton className="h-20 w-full" />
        </div>
      )}

      {aiError && (
        <div className="mb-5 rounded-xl border border-[#fecaca] bg-[#fef2f2] p-4 text-sm text-[#dc2626]">
          {aiError}
        </div>
      )}

      {aiParas.length > 0 && (
        <div className="mb-5 rounded-xl border border-[#e0e7ff] bg-gradient-to-br from-[#eef2ff] to-[#f5f3ff] p-5">
          <h3 className="mb-3 text-sm font-bold">
            AI Performance Summary — {MONTH_NAMES[selMonth]} {selYear}
          </h3>
          {aiParas.map((p, i) => (
            <p key={i} className="mb-2 text-sm leading-relaxed text-[#374151]">
              {p.replace(/\*\*/g, '')}
            </p>
          ))}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-[#e2e8f0] bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-[#e2e8f0] bg-[#f8fafc]">
            <tr>
              {['Employee', 'Days', 'Avg Hours', 'Avg Progress', 'Avg Mood', 'Blockers'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#64748b]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {summary.map((row) => (
              <tr key={row.employee} className="border-b border-[#f1f5f9]">
                <td className="px-4 py-3 font-medium">{row.employee}</td>
                <td className="px-4 py-3">{row.daysSubmitted}</td>
                <td className="px-4 py-3">{row.avgHours}h</td>
                <td className="px-4 py-3">{row.avgProgress}%</td>
                <td className="px-4 py-3">
                  {MOOD_EMOJIS[Math.round(Number(row.avgMood))] || '😐'} {row.avgMood}
                </td>
                <td className="px-4 py-3">{row.totalBlockers}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
