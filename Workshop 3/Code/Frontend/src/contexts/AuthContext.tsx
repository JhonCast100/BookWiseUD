// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode'; // ✅ Importación correcta
import { UserProfile } from '../types';
import { authClient } from '../services/axiosConfig';

interface TokenPayload {
  id: number;
  username: string;
  rol: 'USER' | 'ADMIN';
  sub: string;
  iat: number;
  exp: number;
  auth_id?: number;
}

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
  signOut: () => void;
  alert: { type: 'success' | 'error' | 'info' | 'warning'; title?: string; message: string } | null;
  setAlert: (a: { type: 'success' | 'error' | 'info' | 'warning'; title?: string; message: string } | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'info' | 'warning'; title?: string; message: string } | null>(null);

  // Cargar sesión desde localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedProfile = localStorage.getItem('mock_profile');

    if (token && savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        setUser({ id: profile.id, email: profile.email });
        setUserProfile(profile);
      } catch {
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  // LOGIN
  const signIn = async (email: string, password: string) => {
    try {

      const response = await authClient.post('/auth/login', {
        username: email,
        password
      });


      const { token } = response.data;

      if (!token) {
        throw new Error('No token received from server');
      }

      const decoded = jwtDecode<TokenPayload>(token);
      console.log('🔓 Token decoded:', decoded);

      const roleFront = decoded.rol === 'ADMIN' ? 'librarian' : 'user';

      const profile: UserProfile = {
        id: decoded.id.toString(),
        email: decoded.username,
        full_name: decoded.username.split('@')[0],
        role: roleFront,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setUser({ id: decoded.id.toString(), email: decoded.username });
      setUserProfile(profile);

      localStorage.setItem('token', token);
      localStorage.setItem('mock_user', JSON.stringify({ id: decoded.id.toString(), email: decoded.username }));
      localStorage.setItem('mock_profile', JSON.stringify(profile));

      console.log('✅ Login successful!');
      return { error: null };
    } catch (error: any) {
      console.error('❌ Login error:', error);
      console.error('❌ Error response:', error.response?.data);

      localStorage.clear();
      setUser(null);
      setUserProfile(null);

      // Map common auth HTTP status codes to friendly messages
      let errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Login failed';

      if (error.response?.status === 403) {
        errorMessage = 'Invalid credentials';
      }

      return { error: new Error(errorMessage) };
    }
  };

  // SIGNUP
  const signUp = async (email: string, password: string, fullName: string, role: 'librarian' | 'user') => {
    try {

      const backendRole = role === 'librarian' ? 'ADMIN' : 'USER';
      const response = await authClient.post('/auth/register', {
        username: email,
        password,
        role: backendRole,
      });

      const { token } = response.data;

      if (!token) {
        throw new Error('No token received from server');
      }

      // ✅ Decodificar JWT correctamente
      const decoded = jwtDecode<TokenPayload>(token);
      const roleFront = decoded.rol === 'ADMIN' ? 'librarian' : 'user';

      const profile: UserProfile = {
        id: decoded.id.toString(),
        email: decoded.username,
        full_name: fullName,
        role: roleFront,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setUser({ id: decoded.id.toString(), email: decoded.username });
      setUserProfile(profile);

      localStorage.setItem('token', token);
      localStorage.setItem('mock_user', JSON.stringify({ id: decoded.id.toString(), email: decoded.username }));
      localStorage.setItem('mock_profile', JSON.stringify(profile));

      return { error: null };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Registration failed';

      return { error: new Error(errorMessage) };
    }
  };

  // SIGNOUT
  const signOut = () => {
    console.log('👋 Signing out...');
    setUser(null);
    setUserProfile(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, signIn, signUp, signOut, alert, setAlert }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}