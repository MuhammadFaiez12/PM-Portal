import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RefreshCw } from 'lucide-react';
import { reportsApi } from '@/api/endpoints';
import type { Report } from '@/api/types';
import { Skeleton } from '@/components/feedback/skeletons';
import { LoadingButton } from '@/components/feedback/LoadingButton';
import { useSettingsToast } from '@/components/layout/ProtectedLayout';
import { Button } from '@/components/ui/button';

export default function DatabasePage() {
  const { saveMsg, toast } = useSettingsToast();
  const qc = useQueryClient();
  const { data: reports = [], isLoading, refetch } = useQuery({
    queryKey: ['reports', 'all'],
    queryFn: () => reportsApi.list(),
  });

  const deleteMut = useMutation({
    mutationFn: reportsApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reports'] });
      toast('Report deleted!');
    },
  });

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  return (
    <div>
      {saveMsg && (
        <div className="mb-4 rounded-lg bg-[#f0fdf4] px-4 py-2 text-center text-sm font-medium text-[#15803d]">
          {saveMsg}
        </div>
      )}

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-bold">Database Viewer ({reports.length} reports)</h2>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
          Refresh
        </Button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-[#e2e8f0] bg-white">
        <table className="w-full text-xs">
          <thead className="border-b border-[#e2e8f0] bg-[#f8fafc]">
            <tr>
              {['Employee', 'Date', 'Project', 'Hours', 'Mood', 'Progress', 'Actions'].map((h) => (
                <th key={h} className="px-3 py-2 text-left font-semibold text-[#64748b]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reports.slice(0, 100).map((r: Report) => (
              <tr key={r.id} className="border-b border-[#f1f5f9]">
                <td className="px-3 py-2 font-medium">{r.employeeName}</td>
                <td className="px-3 py-2">{r.date}</td>
                <td className="max-w-[120px] truncate px-3 py-2">{r.projectTask}</td>
                <td className="px-3 py-2">{r.hoursSpent}h</td>
                <td className="px-3 py-2">{r.mood}/5</td>
                <td className="px-3 py-2">{r.progressPercent}%</td>
                <td className="px-3 py-2">
                  <LoadingButton
                    size="sm"
                    variant="destructive"
                    loading={deleteMut.isPending}
                    onClick={() => {
                      if (confirm('Delete this report?')) {
                        deleteMut.mutate(r.id);
                      }
                    }}
                  >
                    Delete
                  </LoadingButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
