import { NavLink } from 'react-router-dom';
import {
  BarChart3,
  CalendarDays,
  Database,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
  UserRound,
  Users,
  UsersRound,
  type LucideIcon,
} from 'lucide-react';
import { ADMIN_NAV, ANALYTICS_NAV } from '@/data/logData';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  UserRound,
  CalendarDays,
  UsersRound,
  Users,
  MessageSquare,
  Settings,
  Database,
};

function NavItemLink({ path, label, icon }: { path: string; label: string; icon: string }) {
  const Icon = ICON_MAP[icon] ?? LayoutDashboard;

  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        cn(
          'flex w-full items-center gap-2.5 px-5 py-3 text-left transition-colors',
          isActive
            ? 'border-r-2 border-[#3b82f6] bg-[#1e293b]'
            : 'border-r-2 border-transparent hover:bg-[#1e293b]/50',
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={cn('h-4 w-4 shrink-0', isActive ? 'text-[#3b82f6]' : 'text-[#64748b]')}
            strokeWidth={2}
          />
          <span
            className={cn(
              'text-[13px] font-medium',
              isActive ? 'text-white' : 'text-[#64748b]',
            )}
          >
            {label}
          </span>
        </>
      )}
    </NavLink>
  );
}

export function AppSidebar() {
  const { logout } = useAuth();

  return (
    <aside className="flex w-[240px] shrink-0 flex-col overflow-hidden bg-[#0f172a]">
      <div className="border-b border-[#1e293b] p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] bg-gradient-to-br from-[#3b82f6] to-[#6366f1]">
            <BarChart3 className="h-[18px] w-[18px] text-white" strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-[13px] font-bold leading-tight text-white">Work Reports</div>
            <div className="text-[11px] text-[#475569]">PM Analytics</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        <p className="px-5 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-[#475569]">
          Analytics
        </p>
        {ANALYTICS_NAV.map((item) => (
          <NavItemLink key={item.path} {...item} />
        ))}

        <p className="px-5 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-wider text-[#475569]">
          Admin
        </p>
        {ADMIN_NAV.map((item) => (
          <NavItemLink key={item.path} {...item} />
        ))}
      </nav>

      <div className="border-t border-[#1e293b] p-3">
        <NavLink
          to="/submit"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium text-[#64748b] hover:bg-[#1e293b]"
        >
          <FileText className="h-4 w-4 shrink-0" strokeWidth={2} />
          Employee Form
        </NavLink>
        <button
          type="button"
          onClick={() => logout()}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium text-[#64748b] hover:bg-[#1e293b]"
        >
          <LogOut className="h-4 w-4 shrink-0" strokeWidth={2} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
