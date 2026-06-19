import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { Pencil, Plus, UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { employeesApi } from '@/api/endpoints';
import type { Employee } from '@/api/types';
import { LoadingButton } from '@/components/feedback/LoadingButton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  EXPERIENCE_LEVELS,
  formatTechStack,
  parseTechStack,
} from '@/data/employeeData';
import { FormField } from '../FormField';
import { FormModal } from '../FormModal';
import { StatusSelect } from '../StatusSelect';
import type { InvalidateFn, ToastFn } from '../types';

type EmployeeFormState = {
  name: string;
  email: string;
  phone: string;
  techStackInput: string;
  experienceLevel: string;
  githubUsername: string;
  slackUserId: string;
};

const emptyForm = (): EmployeeFormState => ({
  name: '',
  email: '',
  phone: '',
  techStackInput: '',
  experienceLevel: '',
  githubUsername: '',
  slackUserId: '',
});

function employeeToForm(employee: Employee): EmployeeFormState {
  return {
    name: employee.name,
    email: employee.email,
    phone: employee.phone,
    techStackInput: formatTechStack(employee.techStack),
    experienceLevel: employee.experienceLevel,
    githubUsername: employee.githubUsername,
    slackUserId: employee.slackUserId,
  };
}

function buildPayload(form: EmployeeFormState) {
  return {
    name: form.name.trim(),
    email: form.email.trim() || undefined,
    phone: form.phone.trim() || undefined,
    techStack: parseTechStack(form.techStackInput),
    experienceLevel: form.experienceLevel || undefined,
    githubUsername: form.githubUsername.trim().replace(/^@/, '') || undefined,
    slackUserId: form.slackUserId.trim() || undefined,
  };
}

function EmployeeFormFields({
  form,
  onChange,
}: {
  form: EmployeeFormState;
  onChange: (next: EmployeeFormState) => void;
}) {
  const set = <K extends keyof EmployeeFormState>(key: K, value: EmployeeFormState[K]) =>
    onChange({ ...form, [key]: value });

  return (
    <>
      <FormField label="Full Name" required>
        <Input
          placeholder="e.g. John Smith"
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          autoFocus
        />
      </FormField>
      <FormField label="Email">
        <Input
          type="email"
          placeholder="you@company.com"
          value={form.email}
          onChange={(e) => set('email', e.target.value)}
        />
      </FormField>
      <FormField label="Phone">
        <Input
          type="tel"
          placeholder="+92 300 1234567"
          value={form.phone}
          onChange={(e) => set('phone', e.target.value)}
        />
      </FormField>
      <FormField label="Tech Stack" hint="Separate technologies with commas">
        <Textarea
          placeholder="React, Node.js, MongoDB..."
          value={form.techStackInput}
          onChange={(e) => set('techStackInput', e.target.value)}
          rows={2}
        />
      </FormField>
      <FormField label="Experience Level">
        <Select
          value={form.experienceLevel || undefined}
          onValueChange={(v) => set('experienceLevel', v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select level..." />
          </SelectTrigger>
          <SelectContent>
            {EXPERIENCE_LEVELS.map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>
      <FormField label="GitHub Username">
        <Input
          placeholder="johndoe"
          value={form.githubUsername}
          onChange={(e) => set('githubUsername', e.target.value)}
        />
      </FormField>
      <FormField
        label="Slack User ID"
        hint="Used for @mentions in missing-submission reminders."
      >
        <Input
          placeholder="U0123456789"
          value={form.slackUserId}
          onChange={(e) => set('slackUserId', e.target.value)}
        />
      </FormField>
    </>
  );
}

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
  const [form, setForm] = useState(emptyForm);
  const [errMsg, setErrMsg] = useState('');

  const createMut = useMutation({
    mutationFn: () => employeesApi.create(buildPayload(form)),
    onSuccess: () => {
      onInvalidate();
      setForm(emptyForm());
      setErrMsg('');
      onOpenChange(false);
      toast('Employee added successfully!');
    },
    onError: (err) => {
      if (isAxiosError(err) && err.response?.status === 409) {
        setErrMsg(
          (err.response.data as { message?: string })?.message ||
            'Employee already exists.',
        );
        return;
      }
      setErrMsg('Failed to create employee.');
    },
  });

  const handleClose = (next: boolean) => {
    if (!next) {
      setForm(emptyForm());
      setErrMsg('');
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
      description="Manually add a team member, or share the registration link for self-signup."
      footer={
        <>
          <Button variant="ghost" onClick={() => handleClose(false)}>
            Cancel
          </Button>
          <LoadingButton
            loading={createMut.isPending}
            disabled={!form.name.trim()}
            onClick={() => createMut.mutate()}
          >
            <Plus className="h-4 w-4" />
            Create Employee
          </LoadingButton>
        </>
      }
    >
      <EmployeeFormFields form={form} onChange={setForm} />
      {errMsg && <p className="text-sm font-medium text-[#dc2626]">{errMsg}</p>}
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
  const [form, setForm] = useState(emptyForm);
  const [isActive, setIsActive] = useState(true);
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    if (employee) {
      setForm(employeeToForm(employee));
      setIsActive(employee.isActive);
      setErrMsg('');
    }
  }, [employee]);

  const updateMut = useMutation({
    mutationFn: () =>
      employeesApi.update(employee!.id, { ...buildPayload(form), isActive }),
    onSuccess: () => {
      onInvalidate();
      onClose();
      toast('Employee updated!');
    },
    onError: (err) => {
      if (isAxiosError(err) && err.response?.status === 409) {
        setErrMsg(
          (err.response.data as { message?: string })?.message ||
            'Employee already exists.',
        );
        return;
      }
      setErrMsg('Failed to update employee.');
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
            disabled={!form.name.trim()}
            onClick={() => updateMut.mutate()}
          >
            Save Changes
          </LoadingButton>
        </>
      }
    >
      <EmployeeFormFields form={form} onChange={setForm} />
      <FormField label="Status">
        <StatusSelect value={isActive} onChange={setIsActive} />
      </FormField>
      {assignedProjects.length > 0 && (
        <div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-3">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-[#64748b]">
            Assigned Projects
          </p>
          <div className="flex flex-wrap gap-1.5">
            {assignedProjects.map((projectName) => (
              <Badge key={projectName}>{projectName}</Badge>
            ))}
          </div>
          <p className="mt-2 text-xs text-[#94a3b8]">
            Manage project assignments from the Projects tab.
          </p>
        </div>
      )}
      {errMsg && <p className="text-sm font-medium text-[#dc2626]">{errMsg}</p>}
    </FormModal>
  );
}
