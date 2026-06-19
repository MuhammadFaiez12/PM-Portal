import { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

export function PinGate({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  const { login, authError, clearAuthError } = useAuth();
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    clearAuthError();
    try {
      await login(pin);
    } catch {
      setPin('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f1f5f9] p-6">
      <div className="w-full max-w-[400px] rounded-[20px] bg-white p-10 text-center shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
        <div className="mx-auto mb-6 flex h-[72px] w-[72px] items-center justify-center rounded-[18px] bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6]">
          <BarChart3 className="h-9 w-9 text-white" strokeWidth={2} />
        </div>
        <h1 className="mb-1.5 text-[22px] font-bold text-[#0f172a]">{title}</h1>
        <p className="mb-7 text-sm text-[#64748b]">{subtitle}</p>
        <Input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          maxLength={8}
          placeholder="Enter PIN"
          className="mb-3 text-center text-lg tracking-[0.2em]"
        />
        {authError && (
          <p className="mb-3 text-[13px] font-medium text-[#ef4444]">{authError}</p>
        )}
        <Button className="w-full" onClick={handleSubmit} loading={loading}>
          Sign In
        </Button>
      </div>
    </div>
  );
}
