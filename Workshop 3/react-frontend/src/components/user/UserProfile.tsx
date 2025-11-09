import { User, Mail, Shield, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface UserProfileProps {
  onClose: () => void;
}

export default function UserProfile({ onClose }: UserProfileProps) {
  const { user, userProfile } = useAuth();

  if (!user || !userProfile) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800">User Profile</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-center">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-full">
              <User className="text-white" size={64} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <User className="text-emerald-600" size={20} />
                <span className="text-sm font-medium text-slate-600">Full Name</span>
              </div>
              <p className="text-lg font-semibold text-slate-800 ml-8">
                {userProfile.full_name}
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Mail className="text-emerald-600" size={20} />
                <span className="text-sm font-medium text-slate-600">Email</span>
              </div>
              <p className="text-lg font-semibold text-slate-800 ml-8">
                {userProfile.email}
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="text-emerald-600" size={20} />
                <span className="text-sm font-medium text-slate-600">Role</span>
              </div>
              <p className="text-lg font-semibold text-slate-800 ml-8 capitalize">
                {userProfile.role}
              </p>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={onClose}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
