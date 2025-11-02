import { Library, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ViewType } from '../types';
import { LucideIcon } from 'lucide-react';

interface HeaderProps {
  navigation: Array<{
    id: ViewType;
    label: string;
    icon: LucideIcon;
    public?: boolean;
  }>;
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  onLogout: () => void;
  onProfileClick: () => void;
}

export default function Header({ navigation, currentView, onNavigate, onLogout, onProfileClick }: HeaderProps) {
  const { user, userProfile } = useAuth();

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-2 rounded-lg">
              <Library className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">BookwiseUD</h1>
              <p className="text-xs text-slate-600">Library Management System</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon size={20} />
                  {item.label}
                </button>
              );
            })}

            {user && (
              <button
                onClick={onProfileClick}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-slate-700 hover:bg-slate-100 transition-all"
              >
                <User size={20} />
                <span className="hidden lg:inline">{userProfile?.full_name || 'Profile'}</span>
              </button>
            )}

            {!user ? (
              <button
                onClick={() => onNavigate('login')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-emerald-600 hover:bg-emerald-50 transition-all"
              >
                <LogOut size={20} />
                Login
              </button>
            ) : (
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-all"
              >
                <LogOut size={20} />
                Logout
              </button>
            )}
          </div>
        </div>

        <div className="md:hidden flex gap-2 pb-3 overflow-x-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}

          {user && (
            <button
              onClick={onProfileClick}
              className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-slate-700 hover:bg-slate-100 transition-all whitespace-nowrap"
            >
              <User size={18} />
              Profile
            </button>
          )}

          {!user ? (
            <button
              onClick={() => onNavigate('login')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-emerald-600 hover:bg-emerald-50 transition-all whitespace-nowrap"
            >
              <LogOut size={18} />
              Login
            </button>
          ) : (
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-all whitespace-nowrap"
            >
              <LogOut size={18} />
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
