import type { Employee, Project } from '@/api/types';

export type ToastFn = (msg: string) => void;
export type InvalidateFn = () => void;

export type TeamTabProps = {
  employees: Employee[];
  projects: Project[];
  toast: ToastFn;
  onInvalidate: InvalidateFn;
};
