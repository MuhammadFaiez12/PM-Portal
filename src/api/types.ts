export type Employee = {
  id: string;
  name: string;
  email: string;
  phone: string;
  techStack: string[];
  experienceLevel: string;
  githubUsername: string;
  slackUserId: string;
  isActive: boolean;
};

export type RegisterEmployeePayload = {
  name: string;
  email: string;
  phone: string;
  techStack: string[];
  experienceLevel: string;
  githubUsername: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  startDate: string;
  employeeIds: string[];
  isActive: boolean;
};

export type Report = {
  id: string;
  employeeName: string;
  date: string;
  projectId: string;
  projectTask: string;
  workDone: string;
  hoursSpent: number;
  blockers: string;
  tomorrowPlan: string;
  mood: number;
  progressPercent: number;
  submittedAt: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
};

export type DashboardOverview = {
  date: string;
  submitted: string[];
  missing: string[];
  total: number;
  avgMood: string | null;
};

export type EmployeeStats = {
  reports: Report[];
  stats: {
    avgHours: string;
    avgMood: string;
    avgProgress: number;
    blockers: number;
    total: number;
  };
};

export type MonthlySummaryRow = {
  employee: string;
  daysSubmitted: number;
  avgHours: string;
  avgProgress: number;
  avgMood: string;
  totalBlockers: number;
};

export type TeamMember = {
  employee: string;
  totalHours: number;
  daysSubmitted: number;
  submissionRate: number;
  avgMood: string;
};

export type AppSettings = {
  slackBotToken: string;
  slackChannelId: string;
  reminderTime: string;
  formUrl: string;
  hasSlackToken?: boolean;
};
