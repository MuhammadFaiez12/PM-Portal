import { useMutation } from '@tanstack/react-query';
import { FolderKanban, Pencil, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { projectsApi } from '@/api/endpoints';
import type { Employee, Project } from '@/api/types';
import { LoadingButton } from '@/components/feedback/LoadingButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmployeeCheckboxList } from '../EmployeeCheckboxList';
import { FormField } from '../FormField';
import { FormModal } from '../FormModal';
import { StatusSelect } from '../StatusSelect';
import type { InvalidateFn, ToastFn } from '../types';
import { toggleIdInList } from '../utils';

type ProjectFormFieldsProps = {
  name: string;
  description: string;
  employeeIds: string[];
  activeEmployees: Employee[];
  onNameChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
  onToggleEmployee: (id: string) => void;
  nameRequired?: boolean;
  autoFocus?: boolean;
};

function ProjectFormFields({
  name,
  description,
  employeeIds,
  activeEmployees,
  onNameChange,
  onDescriptionChange,
  onToggleEmployee,
  nameRequired,
  autoFocus,
}: ProjectFormFieldsProps) {
  return (
    <>
      <FormField label="Project Name" required={nameRequired}>
        <Input
          placeholder="e.g. Client Portal"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          autoFocus={autoFocus}
        />
      </FormField>
      <FormField label="Description">
        <Input
          placeholder="Brief description (optional)"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />
      </FormField>
      <FormField
        label="Team Members"
        hint="Leave empty to show this project to all employees."
      >
        <EmployeeCheckboxList
          employees={activeEmployees}
          selectedIds={employeeIds}
          onToggle={onToggleEmployee}
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
  const [employeeIds, setEmployeeIds] = useState<string[]>([]);

  const createMut = useMutation({
    mutationFn: () => projectsApi.create({ name, description, employeeIds }),
    onSuccess: () => {
      onInvalidate();
      setName('');
      setDescription('');
      setEmployeeIds([]);
      onOpenChange(false);
      toast('Project created successfully!');
    },
  });

  const handleClose = (next: boolean) => {
    if (!next) {
      setName('');
      setDescription('');
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
        employeeIds={employeeIds}
        activeEmployees={activeEmployees}
        onNameChange={setName}
        onDescriptionChange={setDescription}
        onToggleEmployee={(id) => setEmployeeIds((prev) => toggleIdInList(prev, id))}
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
  const [isActive, setIsActive] = useState(true);
  const [employeeIds, setEmployeeIds] = useState<string[]>([]);

  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description);
      setIsActive(project.isActive);
      setEmployeeIds([...project.employeeIds]);
    }
  }, [project]);

  const updateMut = useMutation({
    mutationFn: () =>
      projectsApi.update(project!.id, {
        name,
        description,
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
      <FormField label="Project Name">
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </FormField>
      <FormField label="Description">
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description"
        />
      </FormField>
      <FormField label="Status">
        <StatusSelect value={isActive} onChange={setIsActive} />
      </FormField>
      <FormField
        label="Team Members"
        hint="Leave empty to show this project to all employees."
      >
        <EmployeeCheckboxList
          employees={activeEmployees}
          selectedIds={employeeIds}
          onToggle={(id) => setEmployeeIds((prev) => toggleIdInList(prev, id))}
        />
      </FormField>
    </FormModal>
  );
}
