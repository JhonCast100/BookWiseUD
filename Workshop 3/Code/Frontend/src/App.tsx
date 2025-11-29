import { useState, useEffect } from 'react';
import { ViewType } from './types';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Alert from './components/layout/Alert';

// Componentes de Layout
import Home from './components/layout/Home';
import Login from './components/layout/Login';
import Header from '..//src/components/layout/Header';
import Footer from '..//src/components/layout/Footer';

// Componentes de Librarian
import LibrarianDashboard from './components/librarian/Dashboard';
import BookManagement from './components/librarian/BookManagement';
import UserManagement from './components/librarian/UserManagement';
import LoanManagement from './components/librarian/LoanManagement';

// Componentes de User
import BookCatalog from './components/user/BookCatalog';
import MyLoans from './components/user/MyLoans';
import UserProfile from './components/user/UserProfile';

// Icons
import { LayoutDashboard, BookOpen, Users, BookMarked, Library } from 'lucide-react';

function AppContent() {
  const { user, userProfile, loading, signOut } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [showProfile, setShowProfile] = useState(false);

  const isLibrarian = userProfile?.role === 'librarian';

  // --- Render global alert from AuthContext
  function AuthAlertRenderer() {
    const { alert, setAlert } = useAuth();
    if (!alert) return null;
    return (
      <div className="mb-6">
        <Alert
          type={alert.type}
          title={alert.type === 'error' ? 'Error' : undefined}
          message={alert.message}
          onClose={() => setAlert(null)}
          autoClose={true}
        />
      </div>
    );
  }

  // Navegación dinámica según el rol del usuario
  const getNavigation = () => {
    if (!user) {
      return [
        { id: 'home' as ViewType, label: 'Home', icon: Library, public: true },
      ];
    }

    if (isLibrarian) {
      return [
        { id: 'dashboard' as ViewType, label: 'Dashboard', icon: LayoutDashboard },
        { id: 'books' as ViewType, label: 'Books', icon: BookOpen },
        { id: 'users' as ViewType, label: 'Users', icon: Users },
        { id: 'loans' as ViewType, label: 'Loans', icon: BookMarked },
      ];
    } else {
      // Usuario normal
      return [
        { id: 'books' as ViewType, label: 'Catalog', icon: BookOpen },
        { id: 'loans' as ViewType, label: 'My Loans', icon: BookMarked },
      ];
    }
  };

  const navigation = getNavigation();

  // Renderiza la vista correcta según el rol y la vista actual
  const renderView = () => {
    // Si no hay usuario autenticado, mostrar Home o Login
    if (!user) {
      return currentView === 'home' ? <Home /> : <Login />;
    }

    // Usuario autenticado - renderizar según rol
    switch (currentView) {
      case 'home':
        // Redirigir a dashboard si está autenticado
        return isLibrarian ? <LibrarianDashboard /> : <BookCatalog />;

      case 'dashboard':
        // Dashboard diferente según el rol
        return isLibrarian ? <LibrarianDashboard /> : <BookCatalog />;

      case 'books':
        // Libros: Gestión completa para librarian, catálogo para users
        return isLibrarian ? <BookManagement /> : <BookCatalog />;

      case 'users':
        // Solo librarians pueden ver usuarios
        return isLibrarian ? <UserManagement /> : <BookCatalog />;

      case 'loans':
        // Préstamos: Gestión completa para librarian, solo ver los propios para users
        return isLibrarian ? <LoanManagement /> : <MyLoans />;

      default:
        return isLibrarian ? <LibrarianDashboard /> : <BookCatalog />;
    }
  };

  // Redirigir a la vista apropiada cuando el usuario inicia sesión
  useEffect(() => {
    if (user && (currentView === 'home' || !currentView)) {
      if (isLibrarian) {
        setCurrentView('dashboard');
      } else {
        setCurrentView('books'); // Usuarios van directo al catálogo
      }
    } else if (!user && currentView !== 'home') {
      setCurrentView('home');
    }
  }, [user, userProfile, isLibrarian]);

  const handleLogout = async () => {
    console.log('👋 Logging out...');
    await signOut();
    setCurrentView('home');
    setShowProfile(false);
  };

  const handleProfileClick = () => {
    setShowProfile(true);
  };

  // Loading state
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

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Global alert from AuthContext (visible across navigation) */}
        {/** useAuth is available in this component via hook in AppContent */}
        <AuthAlertRenderer />

        <main className="flex-1">
          {renderView()}
        </main>
      </div>

      <Footer />

      {/* Modal de perfil de usuario */}
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