import { FolderKanban, Users } from 'lucide-react';
import { StatCard } from './StatCard';

type TeamPageHeaderProps = {
  activeEmployees: number;
  activeProjects: number;
};

export function TeamPageHeader({ activeEmployees, activeProjects }: TeamPageHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
      <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-gradient-to-br from-[#eff6ff] to-[#e0e7ff] opacity-80" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#3b82f6]">
            Organization
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-[#0f172a]">Team & Projects</h1>
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-[#64748b]">
            Manage your workforce, assign projects, and control what employees see on the daily
            report form.
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <StatCard label="Active employees" value={activeEmployees} icon={Users} accent="blue" />
          <StatCard
            label="Active projects"
            value={activeProjects}
            icon={FolderKanban}
            accent="green"
          />
        </div>
      </div>
    </div>
  );
}
