import { useMutation } from '@tanstack/react-query';
import { Pencil, Plus, UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { employeesApi } from '@/api/endpoints';
import type { Employee } from '@/api/types';
import { LoadingButton } from '@/components/feedback/LoadingButton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '../FormField';
import { FormModal } from '../FormModal';
import { StatusSelect } from '../StatusSelect';
import type { InvalidateFn, ToastFn } from '../types';

type CreateEmployeeModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvalidate: InvalidateFn;
  toast: ToastFn;
};

export function CreateEmployeeModal({
  open,
  onOpenChange,
  onInvalidate,
  toast,
}: CreateEmployeeModalProps) {
  const [name, setName] = useState('');
  const [slackUserId, setSlackUserId] = useState('');

  const createMut = useMutation({
    mutationFn: () => employeesApi.create({ name, slackUserId }),
    onSuccess: () => {
      onInvalidate();
      setName('');
      setSlackUserId('');
      onOpenChange(false);
      toast('Employee added successfully!');
    },
  });

  const handleClose = (next: boolean) => {
    if (!next) {
      setName('');
      setSlackUserId('');
    }
    onOpenChange(next);
  };

  return (
    <FormModal
      open={open}
      onOpenChange={handleClose}
      accent="blue"
      icon={UserPlus}
      title="Add New Employee"
      description="This person will appear in the daily report form dropdown."
      footer={
        <>
          <Button variant="ghost" onClick={() => handleClose(false)}>
            Cancel
          </Button>
          <LoadingButton
            loading={createMut.isPending}
            disabled={!name.trim()}
            onClick={() => createMut.mutate()}
          >
            <Plus className="h-4 w-4" />
            Create Employee
          </LoadingButton>
        </>
      }
    >
      <FormField label="Full Name" required>
        <Input
          placeholder="e.g. Ahmed Khan"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
      </FormField>
      <FormField
        label="Slack User ID"
        hint="Used for @mentions in missing-submission reminders."
      >
        <Input
          placeholder="U0123456789"
          value={slackUserId}
          onChange={(e) => setSlackUserId(e.target.value)}
        />
      </FormField>
    </FormModal>
  );
}

type EditEmployeeModalProps = {
  employee: Employee | null;
  assignedProjects: string[];
  onClose: () => void;
  onInvalidate: InvalidateFn;
  toast: ToastFn;
};

export function EditEmployeeModal({
  employee,
  assignedProjects,
  onClose,
  onInvalidate,
  toast,
}: EditEmployeeModalProps) {
  const [name, setName] = useState('');
  const [slackUserId, setSlackUserId] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (employee) {
      setName(employee.name);
      setSlackUserId(employee.slackUserId);
      setIsActive(employee.isActive);
    }
  }, [employee]);

  const updateMut = useMutation({
    mutationFn: () =>
      employeesApi.update(employee!.id, { name, slackUserId, isActive }),
    onSuccess: () => {
      onInvalidate();
      onClose();
      toast('Employee updated!');
    },
  });

  return (
    <FormModal
      open={!!employee}
      onOpenChange={(open) => !open && onClose()}
      accent="blue"
      icon={Pencil}
      title="Edit Employee"
      description="Update employee details and status."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <LoadingButton
            loading={updateMut.isPending}
            disabled={!name.trim()}
            onClick={() => updateMut.mutate()}
          >
            Save Changes
          </LoadingButton>
        </>
      }
    >
      <FormField label="Full Name">
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </FormField>
      <FormField label="Slack User ID">
        <Input
          value={slackUserId}
          onChange={(e) => setSlackUserId(e.target.value)}
          placeholder="U0123456789"
        />
      </FormField>
      <FormField label="Status">
        <StatusSelect value={isActive} onChange={setIsActive} />
      </FormField>
      {assignedProjects.length > 0 && (
        <div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#64748b]">
            Assigned Projects
          </p>
          <div className="flex flex-wrap gap-1.5">
            {assignedProjects.map((projectName) => (
              <Badge key={projectName}>{projectName}</Badge>
            ))}
          </div>
          <p className="mt-2.5 text-xs text-[#94a3b8]">
            Manage project assignments from the Projects tab.
          </p>
        </div>
      )}
    </FormModal>
  );
}
