import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { HiSun, HiMoon, HiTemplate, HiShieldCheck, HiLogout } from 'react-icons/hi';
import Card from '../../components/ui/Card';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [defaultTemplate, setDefaultTemplate] = useState('soap');

  const templates = [
    { id: 'soap', name: 'SOAP Note' },
    { id: 'consultation', name: 'Consultation Note' },
    { id: 'discharge', name: 'Discharge Summary' },
    { id: 'procedure', name: 'Procedure Note' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-headline-sm">Settings</h2>

      {/* Profile */}
      <Card>
        <h3 className="text-title-md mb-4">Profile</h3>
        <div className="space-y-2">
          <p className="text-body-md">
            <span className="text-on-surface-variant">Email:</span>{' '}
            <span className="font-semibold">{user?.email}</span>
          </p>
          {user?.fullName && (
            <p className="text-body-md">
              <span className="text-on-surface-variant">Name:</span>{' '}
              <span className="font-semibold">{user.fullName}</span>
            </p>
          )}
          <p className="text-body-md">
            <span className="text-on-surface-variant">Member since:</span>{' '}
            <span className="font-semibold">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </span>
          </p>
        </div>
      </Card>

      {/* Appearance */}
      <Card>
        <h3 className="text-title-md mb-4">Appearance</h3>
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between p-4 rounded-xl 
                   bg-surface-container hover:bg-primary-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            {theme === 'light' ? (
              <HiSun className="w-6 h-6 text-yellow-500" />
            ) : (
              <HiMoon className="w-6 h-6 text-blue-500" />
            )}
            <span className="text-body-lg">
              {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
            </span>
          </div>
          <span className="text-label-sm text-on-surface-variant">
            Tap to switch
          </span>
        </button>
      </Card>

      {/* Default Template */}
      <Card>
        <h3 className="text-title-md mb-4">
          <HiTemplate className="inline w-5 h-5 mr-2" />
          Default Note Template
        </h3>
        <div className="space-y-2">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => setDefaultTemplate(template.id)}
              className={`w-full text-left p-4 rounded-xl transition-colors ${
                defaultTemplate === template.id
                  ? 'bg-primary text-white'
                  : 'bg-surface-container hover:bg-primary-50'
              }`}
            >
              <span className="text-body-lg">{template.name}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Privacy */}
      <Card>
        <h3 className="text-title-md mb-4">
          <HiShieldCheck className="inline w-5 h-5 mr-2" />
          Privacy & Security
        </h3>
        <div className="space-y-3 text-body-md text-on-surface-variant">
          <div className="flex items-start gap-3">
            <span className="text-green-500 mt-1">✓</span>
            <p>Zero data retention - notes cleared on logout</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-green-500 mt-1">✓</span>
            <p>End-to-end encryption for all data</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-green-500 mt-1">✓</span>
            <p>Automatic session timeout after 10 minutes</p>
          </div>
        </div>
      </Card>

      {/* Logout */}
      <button
        onClick={logout}
        className="w-full btn-outline text-error border-error hover:bg-error-50 
                 flex items-center justify-center gap-2"
      >
        <HiLogout className="w-5 h-5" />
        Sign Out
      </button>
    </div>
  );
}
