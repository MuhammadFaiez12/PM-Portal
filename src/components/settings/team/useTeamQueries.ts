import { useQuery, useQueryClient } from '@tanstack/react-query';
import { employeesApi, projectsApi } from '@/api/endpoints';

export function useTeamQueries() {
  const qc = useQueryClient();

  const employeesQuery = useQuery({
    queryKey: ['employees', 'all'],
    queryFn: employeesApi.listAll,
  });

  const projectsQuery = useQuery({
    queryKey: ['projects', 'all'],
    queryFn: projectsApi.listAll,
  });

  const employees = employeesQuery.data ?? [];
  const projects = projectsQuery.data ?? [];
  const isLoading = employeesQuery.isLoading || projectsQuery.isLoading;

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['employees'] });
    qc.invalidateQueries({ queryKey: ['projects'] });
  };

  return { employees, projects, isLoading, invalidate };
}
