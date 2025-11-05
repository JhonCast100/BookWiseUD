// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '../types';
import { authClient } from '../services/axiosConfig';

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

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('token');
      const savedProfile = localStorage.getItem('mock_profile');

      if (token && savedProfile) {
        try {
          const profile = JSON.parse(savedProfile);
          setUser({ id: profile.id, email: profile.email });
          setUserProfile(profile);
        } catch (error) {
          console.error('Error loading session:', error);
          localStorage.clear();
        }
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Logging in...');
      
      const response = await authClient.post('/auth/login', {
        username: email, 
        password
      });

      const { token, role, email: userEmail } = response.data;
      console.log('✅ JWT received');
      console.log('✅ Role:', role);

      // Guardar token
      localStorage.setItem('token', token);

      // Determinar el rol correcto
      let userRole: 'librarian' | 'user' = 'user';
      if (role === 'ADMIN' || role === 'ROLE_ADMIN' || role === 'LIBRARIAN' || role === 'ROLE_LIBRARIAN') {
        userRole = 'librarian';
      }

      const mockProfile: UserProfile = {
        id: '1',
        email: userEmail || email,
        full_name: (userEmail || email).split('@')[0],
        role: userRole,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setUser({ id: '1', email: userEmail || email });
      setUserProfile(mockProfile);

      localStorage.setItem('mock_user', JSON.stringify({ id: '1', email: userEmail || email }));
      localStorage.setItem('mock_profile', JSON.stringify(mockProfile));

      console.log('✅ Login successful - Role:', userRole);

      return { error: null };
    } catch (error: any) {
      console.error('❌ Login error:', error);
      localStorage.clear();
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Login failed. Please check your credentials.';
      
      return { error: new Error(errorMessage) };
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: 'librarian' | 'user') => {
    try {
      console.log('📝 Registering...');
      
      // Convertir rol para el backend
      const backendRole = role === 'librarian' ? 'ADMIN' : 'USER';
      
      const response = await authClient.post('/auth/register', {
        email,
        password,
        fullName,
        role: backendRole
      });

      const { token, role: returnedRole } = response.data;
      console.log('✅ Registration successful');
      console.log('✅ Token received');

      localStorage.setItem('token', token);

      // Determinar el rol correcto
      let userRole: 'librarian' | 'user' = 'user';
      if (returnedRole === 'ADMIN' || returnedRole === 'ROLE_ADMIN' || returnedRole === 'LIBRARIAN') {
        userRole = 'librarian';
      }

      const mockUser: User = {
        id: Date.now().toString(),
        email: email,
      };

      const mockProfile: UserProfile = {
        id: mockUser.id,
        email,
        full_name: fullName,
        role: userRole,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setUser(mockUser);
      setUserProfile(mockProfile);

      localStorage.setItem('mock_user', JSON.stringify(mockUser));
      localStorage.setItem('mock_profile', JSON.stringify(mockProfile));

      return { error: null };
    } catch (error: any) {
      console.error('❌ Registration error:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Registration failed. Please try again.';
      
      return { error: new Error(errorMessage) };
    }
  };

  const signOut = async () => {
    console.log('👋 Signing out...');
    setUser(null);
    setUserProfile(null);
    localStorage.clear();
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