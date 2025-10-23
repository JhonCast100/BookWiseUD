import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '../types';

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string, role: 'librarian' | 'user') => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario de localStorage al iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem('mock_user');
    const savedProfile = localStorage.getItem('mock_profile');
    
    if (savedUser && savedProfile) {
      try {
        setUser(JSON.parse(savedUser));
        setUserProfile(JSON.parse(savedProfile));
      } catch (error) {
        console.error('Error loading saved session:', error);
        localStorage.removeItem('mock_user');
        localStorage.removeItem('mock_profile');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Mock authentication - TODO: Replace with Java backend
      if (email && password) {
        const mockUser: User = {
          id: '1',
          email: email,
        };
        
        const mockProfile: UserProfile = {
          id: '1',
          email: email,
          full_name: email.split('@')[0],
          role: email.includes('librarian') ? 'librarian' : 'user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        setUser(mockUser);
        setUserProfile(mockProfile);
        
        // Guardar en localStorage para persistencia
        localStorage.setItem('mock_user', JSON.stringify(mockUser));
        localStorage.setItem('mock_profile', JSON.stringify(mockProfile));
        
        return { error: null };
      }
      
      return { error: new Error('Email and password required') };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: 'librarian' | 'user') => {
    try {
      // Mock sign up - TODO: Replace with Java backend
      if (email && password && fullName) {
        const mockUser: User = {
          id: Date.now().toString(),
          email: email,
        };
        
        const mockProfile: UserProfile = {
          id: mockUser.id,
          email: email,
          full_name: fullName,
          role: role,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        setUser(mockUser);
        setUserProfile(mockProfile);
        
        localStorage.setItem('mock_user', JSON.stringify(mockUser));
        localStorage.setItem('mock_profile', JSON.stringify(mockProfile));
        
        return { error: null };
      }
      
      return { error: new Error('All fields required') };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    setUser(null);
    setUserProfile(null);
    localStorage.removeItem('mock_user');
    localStorage.removeItem('mock_profile');
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}