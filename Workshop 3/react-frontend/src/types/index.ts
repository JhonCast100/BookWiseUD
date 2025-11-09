export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  publishYear: number;
  copies: number;
  availableCopies: number;
  coverImage?: string;
  description?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  membershipDate: string;
  status: 'active' | 'inactive' | 'suspended';
  type: 'student' | 'teacher' | 'public';
}

export interface Loan {
  id: string;
  bookId: string;
  userId: string;
  loanDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'active' | 'returned' | 'overdue';
  renewalCount: number;
}

export type ViewType = 'home' | 'login' | 'dashboard' | 'books' | 'users' | 'loans';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'librarian' | 'user';
  created_at: string;
  updated_at: string;
}