import type { Employee } from '@/api/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingButton } from '@/components/feedback/LoadingButton';
import { Pencil } from 'lucide-react';
import { EmployeeAvatar } from '../EmployeeAvatar';

type EmployeeTableProps = {
  employees: Employee[];
  employeeProjects: Map<string, string[]>;
  onEdit: (emp: Employee) => void;
  onDeactivate: (id: string, name: string) => void;
  isDeactivating: boolean;
};

export function EmployeeTable({
  employees,
  employeeProjects,
  onEdit,
  onDeactivate,
  isDeactivating,
}: EmployeeTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#e2e8f0] text-left text-[11px] font-semibold uppercase tracking-wider text-[#94a3b8]">
            <th className="px-5 py-3">Employee</th>
            <th className="px-5 py-3">Slack ID</th>
            <th className="px-5 py-3">Projects</th>
            <th className="px-5 py-3">Status</th>
            <th className="px-5 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => {
            const assigned = employeeProjects.get(emp.id) || [];
            return (
              <tr
                key={emp.id}
                className="group border-b border-[#f8fafc] transition-colors last:border-0 hover:bg-[#fafbfc]"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <EmployeeAvatar name={emp.name} />
                    <span className="font-semibold text-[#0f172a]">{emp.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <code className="rounded-md bg-[#f1f5f9] px-2 py-0.5 font-mono text-xs text-[#64748b]">
                    {emp.slackUserId || '—'}
                  </code>
                </td>
                <td className="px-5 py-4">
                  {assigned.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {assigned.map((name) => (
                        <Badge key={name} variant="muted">
                          {name}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-[#cbd5e1]">Unassigned</span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <Badge variant={emp.isActive ? 'success' : 'danger'}>
                    {emp.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1.5 opacity-80 transition-opacity group-hover:opacity-100">
                    <Button size="sm" variant="outline" onClick={() => onEdit(emp)}>
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </Button>
                    {emp.isActive && (
                      <LoadingButton
                        size="sm"
                        variant="ghost"
                        className="text-[#ef4444] hover:bg-[#fef2f2] hover:text-[#dc2626]"
                        loading={isDeactivating}
                        onClick={() => onDeactivate(emp.id, emp.name)}
                      >
                        Deactivate
                      </LoadingButton>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
