import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <div className="flex-1 flex flex-col justify-center px-6 py-12 safe-bottom">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎤</div>
            <h1 className="text-headline-md text-primary font-bold">MediVoice</h1>
            <p className="text-body-md text-on-surface-variant mt-2">
              Clinical Voice-to-Text Notes
            </p>
          </div>
          
          <div className="bg-white rounded-3xl shadow-elevation-2 p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
