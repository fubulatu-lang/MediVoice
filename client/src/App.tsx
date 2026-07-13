import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AppLayout from './layouts/AppLayout';
import DashboardPage from './features/dashboard/DashboardPage';
import RecordingPage from './features/recording/RecordingPage';
import SessionHistory from './features/history/SessionHistory';  // ← ADD THIS
import SettingsPage from './features/settings/SettingsPage';    // ← ADD THIS

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="record" element={<RecordingPage />} />
            <Route path="history" element={<SessionHistory />} />   {/* ← ADD THIS */}
            <Route path="settings" element={<SettingsPage />} />    {/* ← ADD THIS */}
          </Route>
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
