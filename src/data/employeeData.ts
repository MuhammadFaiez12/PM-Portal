export const EXPERIENCE_LEVELS = [
  'Intern',
  'Junior',
  'Mid',
  'Senior',
  'Lead',
] as const;

export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];

export function parseTechStack(input: string): string[] {
  return input
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function formatTechStack(stack: string[]): string {
  return stack.join(', ');
}

export function getJoinFormUrl() {
  return `${window.location.origin}/join`;
}

export function getSubmitFormUrl() {
  return `${window.location.origin}/submit`;
}
