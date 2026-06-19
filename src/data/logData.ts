export type NavItem = {
  path: string;
  label: string;
  icon: string;
};

export const ANALYTICS_NAV: NavItem[] = [
  { path: '/dashboard/overview', label: 'Overview', icon: 'LayoutDashboard' },
  { path: '/dashboard/employee', label: 'Employee Performance', icon: 'UserRound' },
  { path: '/dashboard/monthly', label: 'Monthly Analysis', icon: 'CalendarDays' },
  { path: '/dashboard/team', label: 'Team Comparison', icon: 'UsersRound' },
];

export const ADMIN_NAV: NavItem[] = [
  { path: '/settings/forms', label: 'Forms', icon: 'FileText' },
  { path: '/settings/employees', label: 'Employees', icon: 'Users' },
  { path: '/settings/slack', label: 'Slack Config', icon: 'MessageSquare' },
  { path: '/settings/system', label: 'System', icon: 'Settings' },
  { path: '/settings/database', label: 'Database', icon: 'Database' },
];

export const PAGE_TITLES: Record<string, string> = {
  '/dashboard/overview': 'Overview',
  '/dashboard/employee': 'Employee Performance',
  '/dashboard/monthly': 'Monthly Analysis',
  '/dashboard/team': 'Team Comparison',
  '/settings/forms': 'Forms',
  '/settings/employees': 'Employees',
  '/settings/slack': 'Slack Config',
  '/settings/system': 'System Settings',
  '/settings/database': 'Database Viewer',
};

export const MOOD_OPTIONS = [
  { value: 1, emoji: '😴', label: 'Exhausted' },
  { value: 2, emoji: '😕', label: 'Low Energy' },
  { value: 3, emoji: '😐', label: 'Neutral' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 5, emoji: '🔥', label: 'On Fire' },
] as const;

export const MOOD_EMOJIS: Record<number, string> = {
  1: '😴',
  2: '😕',
  3: '😐',
  4: '🙂',
  5: '🔥',
};

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const currentYear = new Date().getFullYear();
export const YEAR_OPTIONS = Array.from(
  { length: 5 },
  (_, i) => currentYear - 2 + i,
);

export const FORM_SECTIONS = [
  { title: 'Basic Info', accent: '#3b82f6' },
  { title: 'Work Details', accent: '#6366f1' },
  { title: 'Planning & Wellbeing', accent: '#10b981' },
] as const;

export const HEATMAP_COLORS = {
  submitted: '#10b981',
  todayMissing: '#fca5a5',
  missing: '#fee2e2',
} as const;

export const CHART_COLORS = {
  primary: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
} as const;
