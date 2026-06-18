import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthContext';
import { loadStoredTokens } from '@/api/client';
import { ProtectedLayout } from '@/components/layout/ProtectedLayout';
import SubmitPage from '@/pages/SubmitPage';
import OverviewPage from '@/pages/dashboard/OverviewPage';
import EmployeePerformancePage from '@/pages/dashboard/EmployeePerformancePage';
import MonthlyAnalysisPage from '@/pages/dashboard/MonthlyAnalysisPage';
import TeamComparisonPage from '@/pages/dashboard/TeamComparisonPage';
import EmployeesPage from '@/pages/settings/EmployeesPage';
import SlackConfigPage from '@/pages/settings/SlackConfigPage';
import SystemSettingsPage from '@/pages/settings/SystemSettingsPage';
import DatabasePage from '@/pages/settings/DatabasePage';

loadStoredTokens();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/submit" replace />} />
            <Route path="/submit" element={<SubmitPage />} />

            <Route element={<ProtectedLayout />}>
              <Route path="/dashboard" element={<Navigate to="/dashboard/overview" replace />} />
              <Route path="/dashboard/overview" element={<OverviewPage />} />
              <Route path="/dashboard/employee" element={<EmployeePerformancePage />} />
              <Route path="/dashboard/monthly" element={<MonthlyAnalysisPage />} />
              <Route path="/dashboard/team" element={<TeamComparisonPage />} />

              <Route path="/settings" element={<Navigate to="/settings/employees" replace />} />
              <Route path="/settings/employees" element={<EmployeesPage />} />
              <Route path="/settings/slack" element={<SlackConfigPage />} />
              <Route path="/settings/system" element={<SystemSettingsPage />} />
              <Route path="/settings/database" element={<DatabasePage />} />
            </Route>

            <Route path="*" element={<Navigate to="/submit" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
