import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '../types';
import axios from 'axios';


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
      // 🟢 Send request to Spring Boot backend
      const response = await axios.post('http://localhost:8080/auth/login', {
        username: email, 
        password
      });


      // Backend returns a JWT token
      const token = response.data.token;
      console.log('✅ JWT received:', token);

      // Save token in localStorage
      localStorage.setItem('token', token);

      // Temporary mock profile (until backend returns user data)
      const mockProfile: UserProfile = {
        id: '1',
        email: email,
        full_name: email.split('@')[0],
        role: email.includes('librarian') ? 'librarian' : 'user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setUser({ id: '1', email });
      setUserProfile(mockProfile);

      // Save session data locally
      localStorage.setItem('mock_user', JSON.stringify({ id: '1', email }));
      localStorage.setItem('mock_profile', JSON.stringify(mockProfile));

      return { error: null };
    } catch (error: any) {
      console.error('❌ Login error:', error);
      return { error: new Error('Login failed') };
    }
  };


  const signUp = async (email: string, password: string, fullName: string, role: 'librarian' | 'user') => {
    try {
      // 🟢 Send registration data to backend
      const response = await axios.post('http://localhost:8080/auth/register', {
        email,
        password,
        fullName,
        role
      });

      // Receive JWT token from backend
      const token = response.data.token;
      console.log('✅ Token received on registration:', token);

      // Save token in browser
      localStorage.setItem('token', token);

      // Create local user and profile (for compatibility)
      const mockUser: User = {
        id: Date.now().toString(),
        email: email,
      };

      const mockProfile: UserProfile = {
        id: mockUser.id,
        email,
        full_name: fullName,
        role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setUser(mockUser);
      setUserProfile(mockProfile);

      // Save in localStorage for session persistence
      localStorage.setItem('mock_user', JSON.stringify(mockUser));
      localStorage.setItem('mock_profile', JSON.stringify(mockProfile));

      return { error: null };
    } catch (error: any) {
      console.error('❌ Registration error:', error);
      return { error: new Error('Registration failed') };
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