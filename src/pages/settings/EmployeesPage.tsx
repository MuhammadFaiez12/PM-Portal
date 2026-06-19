import { useState } from 'react';
import { FolderKanban, Users } from 'lucide-react';
import { Skeleton } from '@/components/feedback/skeletons';
import { useSettingsToast } from '@/components/layout/ProtectedLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmployeesTab } from '@/components/settings/team/employees/EmployeesTab';
import { ProjectsTab } from '@/components/settings/team/projects/ProjectsTab';
import { TeamPageHeader } from '@/components/settings/team/TeamPageHeader';
import { useTeamQueries } from '@/components/settings/team/useTeamQueries';

export default function EmployeesPage() {
  const { saveMsg, toast } = useSettingsToast();
  const [tab, setTab] = useState('employees');
  const { employees, projects, isLoading, invalidate } = useTeamQueries();
  if (isLoading) return <Skeleton className="h-64 w-full" />;
  return (
    <div className="space-y-2">
      {saveMsg && (
        <div className="rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] px-4 py-3 text-center text-sm font-medium text-[#15803d]">
          {saveMsg}
        </div>
      )}

      <TeamPageHeader /> 
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="employees" className="group cursor-pointer flex-1 sm:flex-none">
            <Users className="h-4 w-4" />
            Employees
            <TabCount count={employees.length} variant="employees" />
          </TabsTrigger>
          <TabsTrigger value="projects" className="group cursor-pointer flex-1 sm:flex-none">
            <FolderKanban className="h-4 w-4" />
            Projects
            <TabCount count={projects.length} variant="projects" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="employees">
          <EmployeesTab
            employees={employees}
            projects={projects}
            toast={toast}
            onInvalidate={invalidate}
          />
        </TabsContent>

        <TabsContent value="projects">
          <ProjectsTab
            employees={employees}
            projects={projects}
            toast={toast}
            onInvalidate={invalidate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { cn } from '@/lib/utils';

function TabCount({
  count,
  variant,
}: {
  count: number;
  variant: 'employees' | 'projects';
}) {
  return (
    <span
      className={cn(
        'ml-1 rounded-full bg-[#e2e8f0] px-1.5 py-0.5 text-[10px] font-bold text-[#64748b]',
        variant === 'employees' && 'group-data-[state=active]:bg-[#dbeafe] group-data-[state=active]:text-[#1d4ed8]',
        variant === 'projects' && 'group-data-[state=active]:bg-[#dcfce7] group-data-[state=active]:text-[#15803d]',
      )}
    >
      {count}
    </span>
  );
}
