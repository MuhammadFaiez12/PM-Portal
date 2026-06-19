import { useMutation } from '@tanstack/react-query';
import { FolderKanban, Pencil, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { projectsApi } from '@/api/endpoints';
import type { Employee, Project } from '@/api/types';
import { LoadingButton } from '@/components/feedback/LoadingButton';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { EmployeeMultiSelect } from '../EmployeeMultiSelect';
import { FormField } from '../FormField';
import { FormModal } from '../FormModal';
import { StatusSelect } from '../StatusSelect';
import type { InvalidateFn, ToastFn } from '../types';
import { getPKTDate } from '@/lib/utils';

type ProjectFormFieldsProps = {
  name: string;
  description: string;
  startDate: string;
  employeeIds: string[];
  activeEmployees: Employee[];
  onNameChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
  onStartDateChange: (v: string) => void;
  onEmployeeIdsChange: (ids: string[]) => void;
  nameRequired?: boolean;
  autoFocus?: boolean;
};

function ProjectFormFields({
  name,
  description,
  startDate,
  employeeIds,
  activeEmployees,
  onNameChange,
  onDescriptionChange,
  onStartDateChange,
  onEmployeeIdsChange,
  nameRequired,
  autoFocus,
}: ProjectFormFieldsProps) {
  return (
    <>
      <FormField label="Project Name" required={nameRequired}>
        <Input
          placeholder="e.g. Website Redesign"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          autoFocus={autoFocus}
        />
      </FormField>
      <FormField label="Start Date">
        <DatePicker value={startDate} onChange={onStartDateChange} placeholder="Select start date" />
      </FormField>
      <FormField label="Description">
        <Textarea
          placeholder="Brief description (optional)"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={3}
        />
      </FormField>
      <FormField
        label="Team Members"
        hint="Leave empty to show this project to all employees.">
        <EmployeeMultiSelect
          employees={activeEmployees}
          selectedIds={employeeIds}
          onChange={onEmployeeIdsChange}
        />
      </FormField>
    </>
  );
}

type CreateProjectModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeEmployees: Employee[];
  onInvalidate: InvalidateFn;
  toast: ToastFn;
};

export function CreateProjectModal({
  open,
  onOpenChange,
  activeEmployees,
  onInvalidate,
  toast,
}: CreateProjectModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(getPKTDate);
  const [employeeIds, setEmployeeIds] = useState<string[]>([]);

  const createMut = useMutation({
    mutationFn: () => projectsApi.create({ name, description, startDate, employeeIds }),
    onSuccess: () => {
      onInvalidate();
      setName('');
      setDescription('');
      setStartDate(getPKTDate());
      setEmployeeIds([]);
      onOpenChange(false);
      toast('Project created successfully!');
    },
  });

  const handleClose = (next: boolean) => {
    if (!next) {
      setName('');
      setDescription('');
      setStartDate(getPKTDate());
      setEmployeeIds([]);
    }
    onOpenChange(next);
  };

  return (
    <FormModal
      open={open}
      onOpenChange={handleClose}
      accent="green"
      icon={FolderKanban}
      title="Create New Project"
      description="Add a project and optionally assign team members who work on it."
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
            Create Project
          </LoadingButton>
        </>
      }
    >
      <ProjectFormFields
        name={name}
        description={description}
        startDate={startDate}
        employeeIds={employeeIds}
        activeEmployees={activeEmployees}
        onNameChange={setName}
        onDescriptionChange={setDescription}
        onStartDateChange={setStartDate}
        onEmployeeIdsChange={setEmployeeIds}
        nameRequired
        autoFocus
      />
    </FormModal>
  );
}

type EditProjectModalProps = {
  project: Project | null;
  activeEmployees: Employee[];
  onClose: () => void;
  onInvalidate: InvalidateFn;
  toast: ToastFn;
};

export function EditProjectModal({
  project,
  activeEmployees,
  onClose,
  onInvalidate,
  toast,
}: EditProjectModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [employeeIds, setEmployeeIds] = useState<string[]>([]);

  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description);
      setStartDate(project.startDate);
      setIsActive(project.isActive);
      setEmployeeIds([...project.employeeIds]);
    }
  }, [project]);

  const updateMut = useMutation({
    mutationFn: () =>
      projectsApi.update(project!.id, {
        name,
        description,
        startDate,
        employeeIds,
        isActive,
      }),
    onSuccess: () => {
      onInvalidate();
      onClose();
      toast('Project updated!');
    },
  });

  return (
    <FormModal
      open={!!project}
      onOpenChange={(open) => !open && onClose()}
      accent="green"
      icon={Pencil}
      title="Edit Project"
      description="Update project details and team assignments."
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
      <ProjectFormFields
        name={name}
        description={description}
        startDate={startDate}
        employeeIds={employeeIds}
        activeEmployees={activeEmployees}
        onNameChange={setName}
        onDescriptionChange={setDescription}
        onStartDateChange={setStartDate}
        onEmployeeIdsChange={setEmployeeIds}
      />
      <FormField label="Status">
        <StatusSelect value={isActive} onChange={setIsActive} />
      </FormField>
    </FormModal>
  );
}
