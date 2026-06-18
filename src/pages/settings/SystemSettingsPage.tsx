import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { settingsApi } from '@/api/endpoints';
import { Skeleton } from '@/components/feedback/skeletons';
import { LoadingButton } from '@/components/feedback/LoadingButton';
import { useSettingsToast } from '@/components/layout/ProtectedLayout';
import { Input } from '@/components/ui/input';

export default function SystemSettingsPage() {
  const { saveMsg, toast } = useSettingsToast();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: settingsApi.get,
  });
  const [formUrl, setFormUrl] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');

  const saveMut = useMutation({
    mutationFn: () =>
      settingsApi.update({
        formUrl: formUrl || data?.formUrl,
        reminderTime: reminderTime || data?.reminderTime,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['settings'] });
      toast('Settings saved!');
    },
  });

  const pinMut = useMutation({
    mutationFn: () => settingsApi.updatePin(currentPin, newPin),
    onSuccess: () => {
      setCurrentPin('');
      setNewPin('');
      toast('PIN updated!');
    },
  });

  if (isLoading) return <Skeleton className="h-48 w-full" />;

  return (
    <div className="max-w-2xl space-y-6">
      {saveMsg && (
        <div className="rounded-lg bg-[#f0fdf4] px-4 py-2 text-center text-sm font-medium text-[#15803d]">
          {saveMsg}
        </div>
      )}

      <div className="rounded-xl border border-[#e2e8f0] bg-white p-6">
        <h2 className="mb-4 text-base font-bold">System Settings</h2>
        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium">Form URL</label>
          <Input
            value={formUrl || data?.formUrl || ''}
            onChange={(e) => setFormUrl(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="mb-1.5 block text-sm font-medium">Reminder Time (MM HH UTC)</label>
          <Input
            value={reminderTime || data?.reminderTime || '30 11'}
            onChange={(e) => setReminderTime(e.target.value)}
          />
        </div>
        <LoadingButton loading={saveMut.isPending} onClick={() => saveMut.mutate()}>
          Save Settings
        </LoadingButton>
      </div>

      <div className="rounded-xl border border-[#e2e8f0] bg-white p-6">
        <h2 className="mb-4 text-base font-bold">Change Dashboard PIN</h2>
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Current PIN</label>
            <Input
              type="password"
              value={currentPin}
              onChange={(e) => setCurrentPin(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">New PIN</label>
            <Input type="password" value={newPin} onChange={(e) => setNewPin(e.target.value)} />
          </div>
        </div>
        <LoadingButton
          loading={pinMut.isPending}
          disabled={!currentPin || !newPin}
          onClick={() => pinMut.mutate()}
        >
          Update PIN
        </LoadingButton>
      </div>
    </div>
  );
}
