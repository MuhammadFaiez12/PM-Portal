import { useMutation } from '@tanstack/react-query';
import { FolderKanban, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { projectsApi } from '@/api/endpoints';
import type { Project } from '@/api/types';
import { Button } from '@/components/ui/button';
import { DataPanel } from '../DataPanel';
import { EmptyState } from '../EmptyState';
import type { TeamTabProps } from '../types';
import { CreateProjectModal, EditProjectModal } from './ProjectModals';
import { ProjectTable } from './ProjectTable';

export function ProjectsTab({ employees, projects, toast, onInvalidate }: TeamTabProps) {
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);

  const activeEmployees = useMemo(
    () => employees.filter((e) => e.isActive),
    [employees],
  );

  const deactivateMut = useMutation({
    mutationFn: projectsApi.deactivate,
    onSuccess: () => {
      onInvalidate();
      toast('Project deactivated!');
    },
  });

  const filtered = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <DataPanel
        title="Projects"
        description="Employees select these when submitting daily reports"
        action={
          <Button onClick={() => setShowCreate(true)} className="shadow-sm">
            <Plus className="h-4 w-4" />
            Add Project
          </Button>
        }
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search projects..."
      >
        {filtered.length === 0 ? (
          <EmptyState
            icon={FolderKanban}
            title={search ? 'No projects found' : 'No projects yet'}
            description={
              search
                ? 'Try a different search term.'
                : 'Click "Add Project" to create your first project.'
            }
          />
        ) : (
          <ProjectTable
            projects={filtered}
            employees={employees}
            onEdit={setEditProject}
            onDeactivate={(id, name) => {
              if (confirm(`Deactivate ${name}?`)) deactivateMut.mutate(id);
            }}
            isDeactivating={deactivateMut.isPending}
          />
        )}
      </DataPanel>

      <CreateProjectModal
        open={showCreate}
        onOpenChange={setShowCreate}
        activeEmployees={activeEmployees}
        onInvalidate={onInvalidate}
        toast={toast}
      />

      <EditProjectModal
        project={editProject}
        activeEmployees={activeEmployees}
        onClose={() => setEditProject(null)}
        onInvalidate={onInvalidate}
        toast={toast}
      />
    </>
  );
}
