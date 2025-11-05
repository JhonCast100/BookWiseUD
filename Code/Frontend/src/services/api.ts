import { apiClient } from './axiosConfig';

export interface ApiCategory {
  category_id: number;
  name: string;
  description?: string;
}

export interface ApiUser {
  user_id?: number;
  full_name: string;
  email: string;
  phone?: string;
  status?: string;
  auth_id?: number;
}

export interface ApiBook {
  book_id?: number;
  title: string;
  author: string;
  publication_year?: number;
  isbn: string;
  status?: string;
  category_id?: number;
}

export interface ApiLoan {
  loan_id?: number;
  book_id: number;
  user_id?: number;
  loan_date?: string;
  return_date?: string;
  status?: string;
}


class ApiService {
  // ==================== CATEGORY ENDPOINTS ====================
  async getCategories(): Promise<ApiCategory[]> {
    const response = await apiClient.get('/categories/');
    return response.data;
  }
  // ==================== USER ENDPOINTS ====================
  async getUsers(): Promise<ApiUser[]> {
    const response = await apiClient.get('/users/');
    return response.data;
  }

  async getUser(userId: number): Promise<ApiUser> {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  }

  async createUser(user: ApiUser): Promise<ApiUser> {
    const response = await apiClient.post('/users/', user);
    return response.data;
  }

  async updateUser(userId: number, user: ApiUser): Promise<ApiUser> {
    const response = await apiClient.put(`/users/${userId}`, user);
    return response.data;
  }

  async deleteUser(userId: number): Promise<{ message: string }> {
    const response = await apiClient.delete(`/users/${userId}`);
    return response.data;
  }

  // ==================== BOOK ENDPOINTS ====================
  async getBooks(): Promise<ApiBook[]> {
    const response = await apiClient.get('/books/');
    return response.data;
  }

  async getBook(bookId: number): Promise<ApiBook> {
    const response = await apiClient.get(`/books/${bookId}`);
    return response.data;
  }

  async createBook(book: ApiBook): Promise<ApiBook> {
    const response = await apiClient.post('/books/', book);
    return response.data;
  }

  async updateBook(bookId: number, book: ApiBook): Promise<ApiBook> {
    const response = await apiClient.put(`/books/${bookId}`, book);
    return response.data;
  }

  async deleteBook(bookId: number): Promise<{ message: string }> {
    const response = await apiClient.delete(`/books/${bookId}`);
    return response.data;
  }

  async getAvailableBooks(): Promise<ApiBook[]> {
    const response = await apiClient.get('/books/available');
    return response.data;
  }

  async searchBooks(search: string): Promise<ApiBook[]> {
    const response = await apiClient.get(`/books/search?search=${encodeURIComponent(search)}`);
    return response.data;
  }

  // ==================== LOAN ENDPOINTS ====================
  
  // Solo para bibliotecarios: ver todos los préstamos
  async getAllLoans(): Promise<ApiLoan[]> {
    const response = await apiClient.get('/loans/');
    return response.data;
  }

  // Para usuarios: ver sus propios préstamos
  async getMyLoans(): Promise<ApiLoan[]> {
    const response = await apiClient.get('/loans/me');
    return response.data;
  }

  async getActiveLoans(): Promise<ApiLoan[]> {
    const response = await apiClient.get('/loans/active');
    return response.data;
  }

  async getLoan(loanId: number): Promise<ApiLoan> {
    const response = await apiClient.get(`/loans/${loanId}`);
    return response.data;
  }

  // Crear préstamo (usuario solicita, se asocia automáticamente con su user_id)
  async createLoan(loan: { book_id: number; loan_date?: string }): Promise<ApiLoan> {
    const response = await apiClient.post('/loans/', loan);
    return response.data;
  }

  async returnLoan(loanId: number): Promise<ApiLoan> {
    const response = await apiClient.put(`/loans/return/${loanId}`);
    return response.data;
  }

  async deleteLoan(loanId: number): Promise<{ message: string }> {
    const response = await apiClient.delete(`/loans/${loanId}`);
    return response.data;
  }

  // ==================== DASHBOARD STATS ====================
  async getDashboardStats(): Promise<{
    total_books: number;
    total_users: number;
    active_loans: number;
    available_books: number;
  }> {
    const response = await apiClient.get('/stats/dashboard');
    return response.data;
  }
}

export const apiService = new ApiService();