import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { AlertTriangle, BarChart3, CheckCircle2, ClipboardList } from 'lucide-react';
import { employeesApi, projectsApi, reportsApi } from '@/api/endpoints';
import { LoadingButton } from '@/components/feedback/LoadingButton';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FORM_SECTIONS, MOOD_OPTIONS } from '@/data/logData';
import { getPKTDate } from '@/lib/utils';

type Screen = 'form' | 'success' | 'dup';

const OTHER_PROJECT_VALUE = '__other__';

export default function SubmitPage() {
  const [screen, setScreen] = useState<Screen>('form');
  const [empName, setEmpName] = useState('');
  const [date, setDate] = useState(getPKTDate());
  const [projectId, setProjectId] = useState('');
  const [customProject, setCustomProject] = useState('');
  const [taskName, setTaskName] = useState('');
  const [workDone, setWorkDone] = useState('');
  const [hours, setHours] = useState(8);
  const [blockers, setBlockers] = useState('');
  const [tomorrow, setTomorrow] = useState('');
  const [mood, setMood] = useState(3);
  const [progress, setProgress] = useState(50);
  const [errMsg, setErrMsg] = useState('');
  const [allowUpdate, setAllowUpdate] = useState(false);

  const { data: employees = [] } = useQuery({
    queryKey: ['employees', 'active'],
    queryFn: employeesApi.listActive,
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects', 'active', empName],
    queryFn: () => projectsApi.listActive(empName),
    enabled: !!empName,
  });

  useEffect(() => {
    setProjectId('');
    setCustomProject('');
  }, [empName]);

  const submitMutation = useMutation({
    mutationFn: reportsApi.submit,
    onSuccess: () => setScreen('success'),
    onError: () => setErrMsg('Submission failed. Please try again.'),
  });

  const resetForm = () => {
    setScreen('form');
    setEmpName('');
    setProjectId('');
    setCustomProject('');
    setTaskName('');
    setWorkDone('');
    setHours(8);
    setBlockers('');
    setTomorrow('');
    setMood(3);
    setProgress(50);
    setErrMsg('');
    setAllowUpdate(false);
    setDate(getPKTDate());
  };

  const resolvedProjectName = () => {
    if (projectId === OTHER_PROJECT_VALUE) return customProject.trim();
    const selected = projects.find((p) => p.id === projectId);
    return selected?.name ?? '';
  };

  const buildPayload = () => ({
    employeeName: empName,
    date,
    projectId: projectId === OTHER_PROJECT_VALUE ? '' : projectId,
    projectTask: [resolvedProjectName(), taskName.trim()].filter(Boolean).join(' — '),
    workDone,
    hoursSpent: hours,
    blockers: blockers || 'None',
    tomorrowPlan: tomorrow,
    mood,
    progressPercent: progress,
  });

  const handleSubmit = async () => {
    setErrMsg('');
    const projectName = resolvedProjectName();
    if (!empName || !date || !projectId || !workDone || !tomorrow) {
      setErrMsg('Please fill in all required fields.');
      return;
    }
    if (projectId === OTHER_PROJECT_VALUE && !projectName) {
      setErrMsg('Please enter a project or task name for "Other".');
      return;
    }
    if (!allowUpdate) {
      const existing = await reportsApi.checkDuplicate(empName, date);
      if (existing.length > 0) {
        setScreen('dup');
        return;
      }
    }
    submitMutation.mutate(buildPayload());
  };

  if (screen === 'success') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f1f5f9] p-6">
        <div className="w-full max-w-[460px] rounded-[20px] bg-white p-12 text-center shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#f0fdf4]">
            <CheckCircle2 className="h-10 w-10 text-[#15803d]" strokeWidth={2} />
          </div>
          <h1 className="mb-2.5 text-[22px] font-bold">Report Submitted!</h1>
          <p className="mb-6 text-[15px] leading-relaxed text-[#64748b]">
            Great work, <strong className="text-[#0f172a]">{empName}</strong>! Your
            daily report for <strong className="text-[#0f172a]">{date}</strong> has
            been saved and shared with the PM.
          </p>
          <div className="mb-7 flex items-center gap-2.5 rounded-[10px] border border-[#bbf7d0] bg-[#f0fdf4] p-3.5 text-left">
            <BarChart3 className="h-4 w-4 shrink-0 text-[#15803d]" />
            <p className="m-0 text-[13px] font-medium text-[#15803d]">
              Your PM has been notified via Slack.
            </p>
          </div>
          <LoadingButton className="w-full" onClick={resetForm}>
            Submit Another Report
          </LoadingButton>
        </div>
      </div>
    );
  }

  if (screen === 'dup') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f1f5f9] p-6">
        <div className="w-full max-w-[460px] rounded-[20px] bg-white p-12 text-center shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#fffbeb]">
            <AlertTriangle className="h-10 w-10 text-[#f59e0b]" strokeWidth={2} />
          </div>
          <h1 className="mb-2.5 text-[22px] font-bold">Already Submitted</h1>
          <p className="mb-7 text-[15px] leading-relaxed text-[#64748b]">
            <strong className="text-[#0f172a]">{empName}</strong> has already
            submitted a report for today. Would you like to update it?
          </p>
          <div className="flex gap-3">
            <LoadingButton variant="outline" className="flex-1" onClick={resetForm}>
              Cancel
            </LoadingButton>
            <LoadingButton
              variant="warning"
              className="flex-1"
              loading={submitMutation.isPending}
              onClick={async () => {
                setAllowUpdate(true);
                setScreen('form');
                setErrMsg('');
                if (!empName || !date || !projectId || !workDone || !tomorrow) {
                  setErrMsg('Please fill in all required fields.');
                  return;
                }
                if (projectId === OTHER_PROJECT_VALUE && !customProject.trim()) {
                  setErrMsg('Please enter a project or task name for "Other".');
                  return;
                }
                submitMutation.mutate(buildPayload());
              }}
            >
              Update Report
            </LoadingButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9] px-4 pb-16 pt-4">
      <div className="mx-auto mb-5 max-w-[600px]">
        <div className="flex items-center gap-3.5 py-5">
          <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#6366f1]">
            <ClipboardList className="h-[22px] w-[22px] text-white" strokeWidth={2} />
          </div>
          <div>
            <h1 className="m-0 text-[19px] font-bold">Daily Work Report</h1>
            <p className="m-0 text-[13px] text-[#94a3b8]">
              Submit before 5:00 PM PKT every working day
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[600px] space-y-3.5">
        <Card title={FORM_SECTIONS[0].title} accent={FORM_SECTIONS[0].accent}>
          <Field label="Employee Name" required>
            <Select value={empName} onValueChange={setEmpName}>
              <SelectTrigger>
                <SelectValue placeholder="Select your name..." />
              </SelectTrigger>
              <SelectContent>
                {employees.map((e) => (
                  <SelectItem key={e.id} value={e.name}>
                    {e.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Date" required>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
          <Field label="Project" required>
            <Select
              value={projectId}
              onValueChange={setProjectId}
              disabled={!empName}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={empName ? 'Select project you worked on...' : 'Select employee first'}
                />
              </SelectTrigger>
              <SelectContent>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
                <SelectItem value={OTHER_PROJECT_VALUE}>Other / General work</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          {projectId === OTHER_PROJECT_VALUE && (
            <Field label="Project / Task Name" required>
              <Input
                value={customProject}
                onChange={(e) => setCustomProject(e.target.value)}
                placeholder="e.g. Sprint Planning, Internal meeting..."
              />
            </Field>
          )}
          <Field label="Task focus (optional)">
            <Input
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="e.g. Login page, API integration..."
            />
          </Field>
        </Card>

        <Card title={FORM_SECTIONS[1].title} accent={FORM_SECTIONS[1].accent}>
          <Field label="Work Done Today" required>
            <textarea
              value={workDone}
              onChange={(e) => setWorkDone(e.target.value)}
              rows={4}
              placeholder="Describe in detail what you completed today..."
              className="w-full resize-y rounded-lg border-[1.5px] border-[#e2e8f0] px-3 py-2.5 text-sm leading-relaxed"
            />
          </Field>
          <Field label="Hours Spent" required>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                min={1}
                max={12}
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="w-[90px] text-center font-semibold"
              />
              <span className="text-[13px] text-[#94a3b8]">hours today (1–12)</span>
            </div>
          </Field>
          <Field label="Blockers / Issues">
            <textarea
              value={blockers}
              onChange={(e) => setBlockers(e.target.value)}
              rows={3}
              placeholder="Any blockers? Type 'None' if all is clear."
              className="w-full resize-y rounded-lg border-[1.5px] border-[#e2e8f0] px-3 py-2.5 text-sm"
            />
          </Field>
        </Card>

        <Card title={FORM_SECTIONS[2].title} accent={FORM_SECTIONS[2].accent}>
          <Field label="Tomorrow's Plan" required>
            <textarea
              value={tomorrow}
              onChange={(e) => setTomorrow(e.target.value)}
              rows={3}
              placeholder="What will you focus on tomorrow?"
              className="w-full resize-y rounded-lg border-[1.5px] border-[#e2e8f0] px-3 py-2.5 text-sm"
            />
          </Field>
          <Field label="Mood / Energy Level" required>
            <div className="flex gap-2">
              {MOOD_OPTIONS.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setMood(m.value)}
                  className="flex flex-1 cursor-pointer flex-col items-center gap-1 rounded-[10px] border-2 px-1 py-2.5"
                  style={{
                    borderColor: mood === m.value ? '#3b82f6' : '#e2e8f0',
                    background: mood === m.value ? '#eff6ff' : 'white',
                  }}
                >
                  <span className="text-2xl">{m.emoji}</span>
                  <span className="text-center text-[10px] font-medium leading-tight text-[#64748b]">
                    {m.label}
                  </span>
                </button>
              ))}
            </div>
          </Field>
          <div>
            <div className="mb-3 flex items-center justify-between">
              <label className="text-[13px] font-medium text-[#374151]">
                Overall Task Progress
              </label>
              <div className="rounded-full border-[1.5px] border-[#bfdbfe] bg-[#eff6ff] px-3 py-0.5">
                <span className="text-base font-bold text-[#3b82f6]">{progress}%</span>
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
            />
            <div className="mt-1.5 flex justify-between text-[11px] text-[#cbd5e1]">
              <span>Just Started</span>
              <span>Completed ✓</span>
            </div>
          </div>
        </Card>

        {errMsg && (
          <div className="flex items-center gap-2.5 rounded-[10px] border border-[#fecaca] bg-[#fef2f2] px-4 py-3">
            <AlertTriangle className="h-4 w-4 shrink-0 text-[#dc2626]" />
            <p className="m-0 text-sm font-medium text-[#dc2626]">{errMsg}</p>
          </div>
        )}

        <LoadingButton
          variant="gradient"
          size="lg"
          className="w-full"
          loading={submitMutation.isPending}
          onClick={handleSubmit}
        >
          Submit Daily Report →
        </LoadingButton>
        <p className="text-center text-xs leading-relaxed text-[#cbd5e1]">
          Your report is saved securely and shared with your PM.
          <br />
          Contact your PM for any issues.
        </p>
      </div>
    </div>
  );
}

function Card({
  title,
  accent,
  children,
}: {
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[14px] bg-white p-[22px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      <div className="mb-[18px] flex items-center gap-2">
        <div className="h-[18px] w-1 rounded-sm" style={{ background: accent }} />
        <h2
          className="m-0 text-xs font-semibold uppercase tracking-wider"
          style={{ color: accent }}
        >
          {title}
        </h2>
      </div>
      <div className="space-y-3.5">{children}</div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-medium text-[#374151]">
        {label}{' '}
        {required ? (
          <span className="text-[#ef4444]">*</span>
        ) : (
          <span className="font-normal text-[#94a3b8]">(optional)</span>
        )}
      </label>
      {children}
    </div>
  );
}
