import { PinGate } from '@/components/layout/PinGate';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export function ProtectedLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <PinGate
        title="PM Dashboard"
        subtitle="Enter your PIN to access analytics and settings"
      />
    );
  }

  return <AppLayout />;
}

export function useSettingsToast() {
  const [saveMsg, setSaveMsg] = useState('');

  const toast = (msg: string) => {
    setSaveMsg(msg);
    setTimeout(() => setSaveMsg(''), 3000);
  };

  return { saveMsg, toast };
}
