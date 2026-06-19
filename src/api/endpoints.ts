import { api } from './client';
import type {
  AppSettings,
  AuthTokens,
  DashboardOverview,
  Employee,
  EmployeeStats,
  MonthlySummaryRow,
  Project,
  RegisterEmployeePayload,
  Report,
  TeamMember,
} from './types';

export const authApi = {
  login: (pin: string) =>
    api.post<AuthTokens>('/auth/login', { pin }).then((r) => r.data),
  logout: (refreshToken: string) =>
    api.post('/auth/logout', { refreshToken }).then((r) => r.data),
};

export const employeesApi = {
  listActive: () =>
    api.get<Employee[]>('/employees').then((r) => r.data),
  listAll: () =>
    api.get<Employee[]>('/employees/all').then((r) => r.data),
  register: (data: RegisterEmployeePayload) =>
    api.post<Employee>('/employees/register', data).then((r) => r.data),
  create: (data: Partial<RegisterEmployeePayload> & { name: string; slackUserId?: string }) =>
    api.post<Employee>('/employees', data).then((r) => r.data),
  update: (
    id: string,
    data: Partial<RegisterEmployeePayload> & {
      name: string;
      slackUserId?: string;
      isActive?: boolean;
    },
  ) => api.put(`/employees/${id}`, data).then((r) => r.data),
  deactivate: (id: string) =>
    api.delete(`/employees/${id}`).then((r) => r.data),
};

export const projectsApi = {
  listActive: (employeeName?: string) =>
    api
      .get<Project[]>('/projects', {
        params: employeeName ? { employee: employeeName } : undefined,
      })
      .then((r) => r.data),
  listAll: () =>
    api.get<Project[]>('/projects/all').then((r) => r.data),
  create: (data: {
    name: string;
    description?: string;
    startDate?: string;
    employeeIds?: string[];
  }) => api.post<Project>('/projects', data).then((r) => r.data),
  update: (
    id: string,
    data: {
      name: string;
      description?: string;
      startDate?: string;
      employeeIds?: string[];
      isActive?: boolean;
    },
  ) => api.put(`/projects/${id}`, data).then((r) => r.data),
  deactivate: (id: string) =>
    api.delete(`/projects/${id}`).then((r) => r.data),
};

export const reportsApi = {
  submit: (data: Record<string, unknown>) =>
    api
      .post<{ success: boolean; action: string; slackNotified: boolean }>(
        '/reports',
        data,
      )
      .then((r) => r.data),
  checkDuplicate: (employee: string, date: string) =>
    api
      .get<Report[]>('/reports/check', { params: { employee, date } })
      .then((r) => r.data),
  list: (params?: Record<string, string>) =>
    api.get<Report[]>('/reports', { params }).then((r) => r.data),
  delete: (id: string) =>
    api.delete(`/reports/${id}`).then((r) => r.data),
  exportCsv: (month: number, year: number) =>
    api.get('/reports/export', {
      params: { month, year },
      responseType: 'blob',
    }),
};

export const dashboardApi = {
  overview: (date?: string) =>
    api
      .get<DashboardOverview>('/dashboard/overview', { params: { date } })
      .then((r) => r.data),
  employee: (name: string) =>
    api
      .get<EmployeeStats>(`/dashboard/employee/${encodeURIComponent(name)}`)
      .then((r) => r.data),
  monthly: (month: number, year: number) =>
    api
      .get<{
        reports: Report[];
        summary: MonthlySummaryRow[];
        month: number;
        year: number;
      }>('/dashboard/monthly', { params: { month, year } })
      .then((r) => r.data),
  team: () =>
    api
      .get<{ team: TeamMember[]; workDays: number; month: number; year: number }>(
        '/dashboard/team',
      )
      .then((r) => r.data),
};

export const settingsApi = {
  get: () => api.get<AppSettings>('/settings').then((r) => r.data),
  update: (data: Partial<AppSettings & { slackBotToken?: string }>) =>
    api.put('/settings', data).then((r) => r.data),
  updatePin: (currentPin: string, newPin: string) =>
    api.put('/settings/pin', { currentPin, newPin }).then((r) => r.data),
};

export const aiApi = {
  monthlySummary: (month: number, year: number) =>
    api
      .post<{ summary: string }>('/ai/monthly-summary', { month, year })
      .then((r) => r.data),
};
