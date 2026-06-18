type PanelHeaderProps = {
  title: string;
  description: string;
  action: React.ReactNode;
};

export function PanelHeader({ title, description, action }: PanelHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-[#e2e8f0] bg-[#fafbfc] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-sm font-bold text-[#0f172a]">{title}</h2>
        <p className="mt-0.5 text-xs text-[#94a3b8]">{description}</p>
      </div>
      {action}
    </div>
  );
}
