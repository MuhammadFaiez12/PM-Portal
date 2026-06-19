import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { reportsApi } from '@/api/endpoints';
import type { Report } from '@/api/types';
import { Skeleton } from '@/components/feedback/skeletons';
import { useSettingsToast } from '@/components/layout/ProtectedLayout';
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { TableRowActionsMenu } from '@/components/ui/table-row-actions-menu';

export default function DatabasePage() {
  const { saveMsg, toast } = useSettingsToast();
  const qc = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState<Report | null>(null);
  const { data: reports = [], isLoading, refetch } = useQuery({
    queryKey: ['reports', 'all'],
    queryFn: () => reportsApi.list(),
  });

  const deleteMut = useMutation({
    mutationFn: reportsApi.delete,
    onSuccess: () => {
      setDeleteTarget(null);
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
                <th
                  key={h}
                  className={`px-3 py-2 font-semibold text-[#64748b] ${h === 'Actions' ? 'text-right' : 'text-left'}`}
                >
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
                  <div className="flex justify-end">
                    <TableRowActionsMenu
                      label="Open report actions"
                      actions={[
                        {
                          label: 'Delete',
                          onClick: () => setDeleteTarget(r),
                          variant: 'destructive',
                          loading: deleteMut.isPending && deleteTarget?.id === r.id,
                        },
                      ]}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this report?"
        description={
          deleteTarget
            ? `${deleteTarget.employeeName} · ${deleteTarget.date} · ${deleteTarget.projectTask}`
            : undefined
        }
        confirmLabel="Delete"
        onConfirm={() => deleteTarget && deleteMut.mutate(deleteTarget.id)}
        isLoading={deleteMut.isPending}
      />
    </div>
  );
}
