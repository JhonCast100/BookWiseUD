// src/components/librarian/Dashboard.tsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
import { BookOpen, Users, BookMarked, CheckCircle } from 'lucide-react';
import Alert, { AlertType } from '../layout/Alert';

interface DashboardStats {
  total_books: number;
  total_users: number;
  active_loans: number;
  available_books: number;
}

export default function Dashboard() {
  const { userProfile } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    total_books: 0,
    total_users: 0,
    active_loans: 0,
    available_books: 0
  });
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: AlertType; title?: string; message: string } | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setAlert(null);

      const isLibrarian = userProfile?.role === 'librarian';

      // Cargar datos según el rol
      const books = await apiService.getBooks();
      
      let users = [];
      let loans = [];
      
      try {
        if (isLibrarian) {
          // Solo librarians pueden ver todos los usuarios y préstamos
          users = await apiService.getUsers();
          loans = await apiService.getAllLoans();
        } else {
          // Usuarios normales solo ven sus préstamos
          loans = await apiService.getMyLoans();
        }
      } catch (err: any) {
        console.warn('Error loading users/loans:', err);
        // Si hay error 403, el usuario no tiene permisos
        if (err.response?.status === 403) {
          console.log('User does not have admin permissions');
        }
      }

      setStats({
        total_books: books.length,
        total_users: users.length,
        active_loans: loans.filter((l: any) => l.status === 'active').length,
        available_books: books.filter((b: any) => b.status === 'available').length
      });
      } catch (err: any) {
      console.error('Dashboard error:', err);
      setAlert({ type: 'error', message: err.response?.data?.detail || 'Error loading dashboard data' });
    } finally {
      setLoading(false);
    }
  };

  const isLibrarian = userProfile?.role === 'librarian';

  const statsCards = isLibrarian ? [
    {
      title: 'Total Books',
      value: stats.total_books,
      icon: BookOpen,
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Total Users',
      value: stats.total_users,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Loans',
      value: stats.active_loans,
      icon: BookMarked,
      color: 'bg-amber-500',
      bgColor: 'bg-amber-50'
    },
    {
      title: 'Available Books',
      value: stats.available_books,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50'
    }
  ] : [
    {
      title: 'My Active Loans',
      value: stats.active_loans,
      icon: BookMarked,
      color: 'bg-amber-500',
      bgColor: 'bg-amber-50'
    },
    {
      title: 'Available Books',
      value: stats.available_books,
      icon: BookOpen,
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-50'
    }
  ];

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Loading dashboard...</p>
      </div>
    );
  }
  if (alert) {
    return (
      <div className="space-y-4">
        <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} autoClose={true} />
        <button
          onClick={() => { setAlert(null); loadStats(); }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">
          Welcome, {userProfile?.full_name || 'User'}!
        </h2>
        <p className="text-slate-600 mt-2">
          {isLibrarian 
            ? 'Manage your library from this dashboard' 
            : 'Browse books and track your loans'}
        </p>
      </div>

      <div className={`grid grid-cols-1 ${isLibrarian ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2'} gap-6`}>
        {statsCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-slate-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className="text-emerald-600" size={24} />
              </div>
            </div>
            <p className="text-slate-600 text-sm mb-1">{stat.title}</p>
            <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg p-8 text-white">
        <h3 className="text-2xl font-bold mb-2">
          {isLibrarian ? 'Library Management System' : 'Your Library Portal'}
        </h3>
        <p className="text-emerald-50 mb-6">
          {isLibrarian 
            ? 'Manage books, users, and loans efficiently' 
            : 'Discover and borrow your favorite books'}
        </p>
        <button
          onClick={loadStats}
          className="bg-white text-emerald-600 px-6 py-2 rounded-lg font-medium hover:bg-emerald-50 transition-colors"
        >
          Refresh Data
        </button>
      </div>
    </div>
  );
}