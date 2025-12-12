import { Book, User, Loan } from '../types';

const BOOKS_KEY = 'library_books';
const USERS_KEY = 'library_users';
const LOANS_KEY = 'library_loans';

export const storage = {

  getBooks: (): Book[] => {
    const data = localStorage.getItem(BOOKS_KEY);
    return data ? JSON.parse(data) : [];
  },

  setBooks: (books: Book[]) => {
    localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
  },

  getUsers: (): User[] => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  setUsers: (users: User[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  getLoans: (): Loan[] => {
    const data = localStorage.getItem(LOANS_KEY);
    return data ? JSON.parse(data) : [];
  },

  setLoans: (loans: Loan[]) => {
    localStorage.setItem(LOANS_KEY, JSON.stringify(loans));
  },

  clearAll: () => {
    localStorage.removeItem(BOOKS_KEY);
    localStorage.removeItem(USERS_KEY);
    localStorage.removeItem(LOANS_KEY);
  },
  
  // Métodos para datos de sesión (estos SÍ se usan)
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  setToken: (token: string) => {
    localStorage.setItem('token', token);
  },

  removeToken: () => {
    localStorage.removeItem('token');
  },

  getUserProfile: () => {
    const data = localStorage.getItem('mock_profile');
    return data ? JSON.parse(data) : null;
  },

  setUserProfile: (profile: any) => {
    localStorage.setItem('mock_profile', JSON.stringify(profile));
  },

  clearSession: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('mock_user');
    localStorage.removeItem('mock_profile');
  }
};

export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Ya NO inicializamos datos de muestra porque vienen del backend
export const initializeSampleData = () => {
  console.log('Sample data initialization disabled - using backend data');
};