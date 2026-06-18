type EmptyStateProps = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
};

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f1f5f9]">
        <Icon className="h-6 w-6 text-[#94a3b8]" />
      </div>
      <p className="text-sm font-semibold text-[#0f172a]">{title}</p>
      <p className="mt-1 max-w-xs text-xs leading-relaxed text-[#94a3b8]">{description}</p>
    </div>
  );
}
