import type { Employee, Project } from '@/api/types';

export function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function buildEmployeeProjectMap(employees: Employee[], projects: Project[]) {
  const map = new Map<string, string[]>();
  for (const emp of employees) {
    map.set(
      emp.id,
      projects
        .filter((p) => p.isActive && p.employeeIds.includes(emp.id))
        .map((p) => p.name),
    );
  }
  return map;
}

export function getEmployeeName(employees: Employee[], id: string) {
  return employees.find((e) => e.id === id)?.name ?? 'Unknown';
}
