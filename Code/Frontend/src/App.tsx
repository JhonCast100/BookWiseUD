import { useState, useEffect } from 'react';
import { ViewType } from './types';
// import { initializeSampleData } from './utils/storage'; // Comentado temporalmente
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Dashboard from './components/librarian/Dashboard';
import BookManagement from './components/librarian/BookManagement';
import UserManagement from './components/librarian/UserManagement';
import LoanManagement from './components/librarian/LoanManagement';
import Home from './components/layout/Home';
import Login from './components/layout/Login';
import Header from './components/Header';
import Footer from './components/Footer';
import UserProfile from './components/user/UserProfile';
import { LayoutDashboard, BookOpen, Users, BookMarked, Library } from 'lucide-react';

function AppContent() {
  const { user, userProfile, loading, signOut } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [showProfile, setShowProfile] = useState(false);

  // Comentado temporalmente - ya no necesitamos datos de muestra
  // useEffect(() => {
  //   initializeSampleData();
  // }, []);

  const getNavigation = () => {
    if (!user) {
      return [
        { id: 'home' as ViewType, label: 'Home', icon: Library, public: true },
      ];
    }

    if (userProfile?.role === 'librarian') {
      return [
        { id: 'dashboard' as ViewType, label: 'Dashboard', icon: LayoutDashboard },
        { id: 'books' as ViewType, label: 'Books', icon: BookOpen },
        { id: 'users' as ViewType, label: 'Users', icon: Users },
        { id: 'loans' as ViewType, label: 'Loans', icon: BookMarked },
      ];
    } else {
      return [
        { id: 'books' as ViewType, label: 'Books', icon: BookOpen },
        { id: 'loans' as ViewType, label: 'Loans', icon: BookMarked },
      ];
    }
  };

  const navigation = getNavigation();

  const renderView = () => {
    if (!user && currentView !== 'home') {
      return <Login />;
    }

    switch (currentView) {
      case 'home':
        return user ? (userProfile?.role === 'librarian' ? <Dashboard /> : <BookManagement />) : <Home />;
      case 'dashboard':
        return userProfile?.role === 'librarian' ? <Dashboard /> : <Home />;
      case 'books':
        return <BookManagement />;
      case 'users':
        return userProfile?.role === 'librarian' ? <UserManagement /> : <Home />;
      case 'loans':
        return <LoanManagement />;
      default:
        return <Home />;
    }
  };

  useEffect(() => {
    if (user && (currentView === 'home' || !currentView)) {
      if (userProfile?.role === 'librarian') {
        setCurrentView('dashboard');
      } else {
        setCurrentView('books');
      }
    } else if (!user && currentView !== 'home') {
      setCurrentView('home');
    }
  }, [user, userProfile]);

  const handleLogout = async () => {
    await signOut();
    setCurrentView('home');
    setShowProfile(false);
  };

  const handleProfileClick = () => {
    setShowProfile(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
        <div className="text-center">
          <div className="inline-flex items-center justify-center bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 rounded-full mb-4">
            <Library className="text-white animate-pulse" size={40} />
          </div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 flex flex-col">
      <Header
        navigation={navigation}
        currentView={currentView}
        onNavigate={setCurrentView}
        onLogout={handleLogout}
        onProfileClick={handleProfileClick}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderView()}
      </main>

      <Footer />

      {showProfile && <UserProfile onClose={() => setShowProfile(false)} />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;