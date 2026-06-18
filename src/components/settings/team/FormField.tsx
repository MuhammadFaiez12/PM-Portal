import { Label } from '@/components/ui/label';

type FormFieldProps = {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
};

export function FormField({ label, required, hint, children }: FormFieldProps) {
  return (
    <div>
      <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#64748b]">
        {label}
        {required && <span className="text-[#ef4444]"> *</span>}
      </Label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-[#94a3b8]">{hint}</p>}
    </div>
  );
}
