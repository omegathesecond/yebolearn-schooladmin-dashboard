import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';

// Pages
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { StudentsPage } from '@/pages/StudentsPage';
import { AddStudentPage } from '@/pages/AddStudentPage';
import { EditStudentPage } from '@/pages/EditStudentPage';
import { AttendancePage } from '@/pages/AttendancePage';
import { StaffPage } from '@/pages/StaffPage';
import { AddStaffPage } from '@/pages/AddStaffPage';
import { EditStaffPage } from '@/pages/EditStaffPage';
import { FeesPage } from '@/pages/FeesPage';
import { ClassesPage } from '@/pages/ClassesPage';
import { SettingsPage } from '@/pages/SettingsPage';
import StudentAnalyticsPage from '@/pages/analytics/StudentAnalyticsPage';
import TeacherPerformancePage from '@/pages/analytics/TeacherPerformancePage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/students" element={<StudentsPage />} />
                <Route path="/students/add" element={<AddStudentPage />} />
                <Route path="/students/:id/edit" element={<EditStudentPage />} />
                <Route path="/attendance" element={<AttendancePage />} />
                <Route path="/staff" element={<StaffPage />} />
                <Route path="/staff/add" element={<AddStaffPage />} />
                <Route path="/staff/:id/edit" element={<EditStaffPage />} />
                <Route path="/fees" element={<FeesPage />} />
                <Route path="/classes" element={<ClassesPage />} />
                <Route path="/analytics/students" element={<StudentAnalyticsPage />} />
                <Route path="/analytics/teachers" element={<TeacherPerformancePage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
