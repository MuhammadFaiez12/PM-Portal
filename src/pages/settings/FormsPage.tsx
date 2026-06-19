import { Copy, ExternalLink, FileText, Link2, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSettingsToast } from '@/components/layout/ProtectedLayout';
import { getJoinFormUrl, getSubmitFormUrl } from '@/data/employeeData';

type FormLinkCardProps = {
  title: string;
  description: string;
  url: string;
  icon: typeof FileText;
  accent: string;
  border: string;
  onCopy: () => void;
};

function FormLinkCard({
  title,
  description,
  url,
  icon: Icon,
  accent,
  border,
  onCopy,
}: FormLinkCardProps) {
  return (
    <div
      className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
      style={{ borderColor: border, backgroundColor: `${accent}08` }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white"
          style={{ color: accent }}
        >
          <Icon className="h-4 w-4" style={{ color: accent }} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold" style={{ color: accent }}>
            {title}
          </p>
          <p className="mt-0.5 text-xs text-[#64748b]">{description}</p>
          <code className="mt-2 block truncate text-xs" style={{ color: accent }}>
            {url}
          </code>
        </div>
      </div>
      <div className="flex shrink-0 gap-2">
        <Button variant="outline" className="bg-white" onClick={onCopy}>
          <Copy className="h-4 w-4" />
          Copy Link
        </Button>
        <Button
          variant="outline"
          className="bg-white"
          onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
        >
          <ExternalLink className="h-4 w-4" />
          View
        </Button>
      </div>
    </div>
  );
}

export default function FormsPage() {
  const { toast } = useSettingsToast();

  const copyLink = async (url: string, label: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast(`${label} link copied!`);
    } catch {
      toast(`Could not copy link. Copy manually: ${url}`);
    }
  };

  const submitUrl = getSubmitFormUrl();
  const joinUrl = getJoinFormUrl();

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <div className="mb-1 flex items-center gap-2">
          <Link2 className="h-5 w-5 text-[#3b82f6]" />
          <h2 className="text-2xl font-bold tracking-tight text-[#0f172a]">Forms</h2>
        </div>
        <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-[#64748b]">
          Share these links with your team. Copy a link to send it, or open the form to preview it.
        </p>
      </div>

      <div className="space-y-4">
        <FormLinkCard
          title="Daily Work Report"
          description="Employees use this form to submit their daily work reports."
          url={submitUrl}
          icon={FileText}
          accent="#1e40af"
          border="#dbeafe"
          onCopy={() => copyLink(submitUrl, 'Daily report')}
        />
        <FormLinkCard
          title="Team Registration"
          description="New members register themselves here. Each email can only register once."
          url={joinUrl}
          icon={UserPlus}
          accent="#15803d"
          border="#bbf7d0"
          onCopy={() => copyLink(joinUrl, 'Registration')}
        />
      </div>
    </div>
  );
}
