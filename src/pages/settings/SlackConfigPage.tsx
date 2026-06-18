import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { settingsApi } from '@/api/endpoints';
import { Skeleton } from '@/components/feedback/skeletons';
import { LoadingButton } from '@/components/feedback/LoadingButton';
import { useSettingsToast } from '@/components/layout/ProtectedLayout';
import { Input } from '@/components/ui/input';

export default function SlackConfigPage() {
  const { saveMsg, toast } = useSettingsToast();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: settingsApi.get,
  });
  const [token, setToken] = useState('');
  const [channel, setChannel] = useState('');

  const saveMut = useMutation({
    mutationFn: () =>
      settingsApi.update({
        slackBotToken: token || undefined,
        slackChannelId: channel,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['settings'] });
      setToken('');
      toast('Slack settings saved!');
    },
  });

  if (isLoading) return <Skeleton className="h-48 w-full" />;

  return (
    <div>
      {saveMsg && (
        <div className="mb-4 rounded-lg bg-[#f0fdf4] px-4 py-2 text-center text-sm font-medium text-[#15803d]">
          {saveMsg}
        </div>
      )}

      <div className="max-w-2xl rounded-xl border border-[#e2e8f0] bg-white p-6">
        <h2 className="mb-1 text-base font-bold">Slack Integration</h2>
        <p className="mb-6 text-sm text-[#94a3b8]">
          Configure the reminder bot and channel settings
        </p>
        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium">Bot Token</label>
          <Input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder={data?.hasSlackToken ? data.slackBotToken : 'xoxb-your-token-here'}
          />
          <p className="mt-1 text-xs text-[#94a3b8]">
            Leave blank to keep existing token. Get from Slack App → OAuth & Permissions
          </p>
        </div>
        <div className="mb-6">
          <label className="mb-1.5 block text-sm font-medium">Channel ID</label>
          <Input
            value={channel || data?.slackChannelId || ''}
            onChange={(e) => setChannel(e.target.value)}
            placeholder="C0123456789"
          />
        </div>
        <LoadingButton loading={saveMut.isPending} onClick={() => saveMut.mutate()}>
          Save Slack Settings
        </LoadingButton>
      </div>
    </div>
  );
}
