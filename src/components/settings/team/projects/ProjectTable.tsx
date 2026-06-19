import type { Employee, Project } from '@/api/types';
import { Badge } from '@/components/ui/badge';
import { TableRowActionsMenu } from '@/components/ui/table-row-actions-menu';
import { FolderKanban, MoreHorizontal, Pencil } from 'lucide-react';
import { formatShortDate } from '@/lib/utils';
import { getEmployeeName } from '../utils';

type ProjectTableProps = {
  projects: Project[];
  employees: Employee[];
  onEdit: (project: Project) => void;
  onDeactivate: (id: string, name: string) => void;
  isDeactivating: boolean;
};

export function ProjectTable({
  projects,
  employees,
  onEdit,
  onDeactivate,
  isDeactivating,
}: ProjectTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#e2e8f0] text-left text-[11px] font-semibold uppercase tracking-wider text-[#94a3b8]">
            <th className="px-5 py-3">Project</th>
            <th className="px-5 py-3">Start Date</th>
            <th className="px-5 py-3">Team</th>
            <th className="px-5 py-3">Status</th>
            <th className="px-5 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr
              key={project.id}
              className="group border-b border-[#f8fafc] transition-colors last:border-0 hover:bg-[#fafbfc]"
            >
              <td className="max-w-[280px] px-5 py-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7] ring-1 ring-[#bbf7d0]">
                    <FolderKanban className="h-4 w-4 text-[#16a34a]" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-[#0f172a]" title={project.name}>
                      {project.name}
                    </p>
                    {project.description && (
                      <p
                        className="mt-0.5 truncate text-xs text-[#94a3b8]"
                        title={project.description}
                      >
                        {project.description}
                      </p>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-5 py-4 text-xs text-[#64748b]">
                {formatShortDate(project.startDate)}
              </td>
              <td className="px-5 py-4">
                {project.employeeIds.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {project.employeeIds.slice(0, 3).map((id) => (
                      <Badge key={id} variant="muted">
                        {getEmployeeName(employees, id)}
                      </Badge>
                    ))}
                    {project.employeeIds.length > 3 && (
                      <Badge variant="muted">
                        <MoreHorizontal className="h-3 w-3" />
                        +{project.employeeIds.length - 3}
                      </Badge>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-[#94a3b8]">All employees</span>
                )}
              </td>
              <td className="px-5 py-4">
                <Badge variant={project.isActive ? 'success' : 'danger'}>
                  {project.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </td>
              <td className="px-5 py-4">
                <div className="flex justify-end">
                  <TableRowActionsMenu
                    label="Open project actions"
                    actions={[
                      {
                        label: 'Edit',
                        icon: <Pencil className="h-3.5 w-3.5" />,
                        onClick: () => onEdit(project),
                      },
                      {
                        label: 'Deactivate',
                        onClick: () => onDeactivate(project.id, project.name),
                        variant: 'destructive',
                        loading: isDeactivating,
                        hidden: !project.isActive,
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
  );
}
