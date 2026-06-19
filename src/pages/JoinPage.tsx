import { useMutation } from '@tanstack/react-query';
import { AlertTriangle, CheckCircle2, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { isAxiosError } from 'axios';
import { employeesApi } from '@/api/endpoints';
import { LoadingButton } from '@/components/feedback/LoadingButton';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EXPERIENCE_LEVELS, parseTechStack } from '@/data/employeeData';

type Screen = 'form' | 'success';

export default function JoinPage() {
  const [screen, setScreen] = useState<Screen>('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [techStackInput, setTechStackInput] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [githubUsername, setGithubUsername] = useState('');
  const [errMsg, setErrMsg] = useState('');

  const registerMut = useMutation({
    mutationFn: () =>
      employeesApi.register({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        techStack: parseTechStack(techStackInput),
        experienceLevel,
        githubUsername: githubUsername.trim().replace(/^@/, ''),
      }),
    onSuccess: () => setScreen('success'),
    onError: (err) => {
      if (isAxiosError(err) && err.response?.status === 409) {
        setErrMsg(
          (err.response.data as { message?: string })?.message ||
            'This email is already registered.',
        );
        return;
      }
      setErrMsg('Registration failed. Please check your details and try again.');
    },
  });

  const handleSubmit = () => {
    setErrMsg('');
    const stack = parseTechStack(techStackInput);
    if (!name.trim() || !email.trim() || !phone.trim() || !experienceLevel || !githubUsername.trim()) {
      setErrMsg('Please fill in all required fields.');
      return;
    }
    if (stack.length === 0) {
      setErrMsg('Please add at least one technology in your tech stack.');
      return;
    }
    registerMut.mutate();
  };

  if (screen === 'success') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f1f5f9] p-6">
        <div className="w-full max-w-[460px] rounded-[20px] bg-white p-12 text-center shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#f0fdf4]">
            <CheckCircle2 className="h-10 w-10 text-[#15803d]" strokeWidth={2} />
          </div>
          <h1 className="mb-2.5 text-[22px] font-bold">Welcome to the Team!</h1>
          <p className="mb-6 text-[15px] leading-relaxed text-[#64748b]">
            Thanks, <strong className="text-[#0f172a]">{name}</strong>! Your profile
            has been created. You can now submit daily work reports using your name.
          </p>
          <a
            href="/submit"
            className="inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-[#3b82f6] to-[#6366f1] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
          >
            Go to Daily Report Form →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9] px-4 pb-16 pt-4">
      <div className="mx-auto mb-5 max-w-[600px]">
        <div className="flex items-center gap-3.5 py-5">
          <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#6366f1]">
            <UserPlus className="h-[22px] w-[22px] text-white" strokeWidth={2} />
          </div>
          <div>
            <h1 className="m-0 text-[19px] font-bold">Join the Team</h1>
            <p className="m-0 text-[13px] text-[#94a3b8]">
              Fill in your details to register as a team member
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[600px] space-y-3.5">
        <div className="rounded-[14px] bg-white p-[22px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <div className="space-y-3.5">
            <Field label="Full Name" required>
              <Input
                placeholder="e.g. Ahmed Khan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </Field>
            <Field label="Email" required>
              <Input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
            <Field label="Phone" required>
              <Input
                type="tel"
                placeholder="+92 300 1234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Field>
            <Field label="Tech Stack" required>
              <Textarea
                placeholder="React, Node.js, MongoDB, TypeScript..."
                value={techStackInput}
                onChange={(e) => setTechStackInput(e.target.value)}
                rows={3}
              />
              <p className="mt-1.5 text-xs text-[#94a3b8]">Separate technologies with commas</p>
            </Field>
            <Field label="Experience Level" required>
              <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your level..." />
                </SelectTrigger>
                <SelectContent>
                  {EXPERIENCE_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="GitHub Username" required>
              <Input
                placeholder="johndoe"
                value={githubUsername}
                onChange={(e) => setGithubUsername(e.target.value)}
              />
            </Field>
          </div>
        </div>

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
          loading={registerMut.isPending}
          onClick={handleSubmit}
        >
          Submit Registration →
        </LoadingButton>
        <p className="text-center text-xs leading-relaxed text-[#cbd5e1]">
          Each email can only register once.
          <br />
          Contact your PM if you need to update your details.
        </p>
      </div>
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
