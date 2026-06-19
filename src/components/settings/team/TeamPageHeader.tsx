import { FolderKanban, Users } from 'lucide-react';
import { StatCard } from './StatCard';

type TeamPageHeaderProps = {
  activeEmployees: number;
  activeProjects: number;
};

export function TeamPageHeader() { 
  return (
    <div className=" " >
       <h1 className="text-2xl font-bold tracking-tight text-[#0f172a]">Team & Projects</h1>
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-[#64748b]">
            Manage your workforce, assign projects, and control what employees see on the daily
            report form.
          </p>
    </div>
  );
}
