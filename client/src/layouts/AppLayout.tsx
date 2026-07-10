import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiHome, HiMicrophone, HiClock, HiCog, HiLogout } from 'react-icons/hi';

const navItems = [
  { path: '/', icon: HiHome, label: 'Home' },
  { path: '/record', icon: HiMicrophone, label: 'Record' },
  { path: '/history', icon: HiClock, label: 'History' },
  { path: '/settings', icon: HiCog, label: 'Settings' },
];

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Top Bar */}
      <header className="bg-white border-b border-outline-variant px-6 py-4 safe-top">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div>
            <h1 className="text-title-lg text-primary">MediVoice</h1>
            {user && (
              <p className="text-body-sm text-on-surface-variant">
                {user.fullName || user.email}
              </p>
            )}
          </div>
          <button
            onClick={logout}
            className="p-2 text-on-surface-variant hover:text-error rounded-full hover:bg-error-50 transition-colors"
            title="Sign Out"
          >
            <HiLogout className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-6 py-4 max-w-4xl mx-auto w-full">
        <Outlet />
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="bg-white border-t border-outline-variant safe-bottom md:hidden">
        <div className="flex justify-around px-4 py-2">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`flex flex-col items-center px-3 py-1 rounded-lg transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-label-sm mt-1">{label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
