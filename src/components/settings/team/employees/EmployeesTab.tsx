import { useMutation } from '@tanstack/react-query';
import { Plus, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { employeesApi } from '@/api/endpoints';
import type { Employee } from '@/api/types';
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { DataPanel } from '../DataPanel';
import { EmptyState } from '../EmptyState';
import type { TeamTabProps } from '../types';
import { buildEmployeeProjectMap } from '../utils';
import { CreateEmployeeModal, EditEmployeeModal } from './EmployeeModals';
import { EmployeeTable } from './EmployeeTable';

export function EmployeesTab({ employees, projects, toast, onInvalidate }: TeamTabProps) {
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<{ id: string; name: string } | null>(
    null,
  );

  const deactivateMut = useMutation({
    mutationFn: employeesApi.deactivate,
    onSuccess: () => {
      setDeactivateTarget(null);
      onInvalidate();
      toast('Employee deactivated!');
    },
  });

  const employeeProjects = useMemo(
    () => buildEmployeeProjectMap(employees, projects),
    [employees, projects],
  );

  const filtered = employees.filter((e) => {
    const q = search.toLowerCase();
    return (
      e.name.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.githubUsername.toLowerCase().includes(q)
    );
  });

  const assignedForEdit = editEmployee
    ? employeeProjects.get(editEmployee.id) ?? []
    : [];

  return (
    <>
      <DataPanel
        title="Team Members"
        description="Employees appear in the daily report submission form"
        action={
          <Button onClick={() => setShowCreate(true)} className="shadow-sm">
            <Plus className="h-4 w-4" />
            Add Employee
          </Button>
        }
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by name, email, or GitHub..."
      >
        {filtered.length === 0 ? (
          <EmptyState
            icon={Users}
            title={search ? 'No employees found' : 'No employees yet'}
            description={
              search
                ? 'Try a different search term.'
                : 'Click "Add Employee" to add your first team member.'
            }
          />
        ) : (
          <EmployeeTable
            employees={filtered}
            employeeProjects={employeeProjects}
            onEdit={setEditEmployee}
            onDeactivate={(id, name) => setDeactivateTarget({ id, name })}
            isDeactivating={deactivateMut.isPending}
          />
        )}
      </DataPanel>

      <CreateEmployeeModal
        open={showCreate}
        onOpenChange={setShowCreate}
        onInvalidate={onInvalidate}
        toast={toast}
      />

      <EditEmployeeModal
        employee={editEmployee}
        assignedProjects={assignedForEdit}
        onClose={() => setEditEmployee(null)}
        onInvalidate={onInvalidate}
        toast={toast}
      />

      <ConfirmModal
        open={!!deactivateTarget}
        onOpenChange={(open) => !open && setDeactivateTarget(null)}
        title={`Deactivate ${deactivateTarget?.name}?`}
        description="This employee will no longer appear in the daily report submission form."
        confirmLabel="Deactivate"
        onConfirm={() => deactivateTarget && deactivateMut.mutate(deactivateTarget.id)}
        isLoading={deactivateMut.isPending}
      />
    </>
  );
}
