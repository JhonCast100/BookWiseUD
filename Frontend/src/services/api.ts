const API_BASE_URL = 'http://127.0.0.1:8000';

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
  user_id: number;
  loan_date?: string;
  return_date?: string;
  status?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      // Si la respuesta es 204 No Content, retornar un objeto vacío
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // User endpoints
  async getUsers(): Promise<ApiUser[]> {
    return this.request<ApiUser[]>('/users/');
  }

  async getUser(userId: number): Promise<ApiUser> {
    return this.request<ApiUser>(`/users/${userId}`);
  }

  async createUser(user: ApiUser): Promise<ApiUser> {
    return this.request<ApiUser>('/users/', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  async updateUser(userId: number, user: ApiUser): Promise<ApiUser> {
    return this.request<ApiUser>(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    });
  }

  async deleteUser(userId: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/users/${userId}`, {
      method: 'DELETE',
    });
  }

  // Book endpoints
  async getBooks(): Promise<ApiBook[]> {
    return this.request<ApiBook[]>('/books/');
  }

  async getBook(bookId: number): Promise<ApiBook> {
    return this.request<ApiBook>(`/books/${bookId}`);
  }

  async createBook(book: ApiBook): Promise<ApiBook> {
    return this.request<ApiBook>('/books/', {
      method: 'POST',
      body: JSON.stringify(book),
    });
  }

  async updateBook(bookId: number, book: ApiBook): Promise<ApiBook> {
    return this.request<ApiBook>(`/books/${bookId}`, {
      method: 'PUT',
      body: JSON.stringify(book),
    });
  }

  async deleteBook(bookId: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/books/${bookId}`, {
      method: 'DELETE',
    });
  }

  async getAvailableBooks(): Promise<ApiBook[]> {
    return this.request<ApiBook[]>('/books/available');
  }

  async searchBooks(search: string): Promise<ApiBook[]> {
    return this.request<ApiBook[]>(`/books/search?search=${encodeURIComponent(search)}`);
  }

  // Loan endpoints
  async getLoans(): Promise<ApiLoan[]> {
    return this.request<ApiLoan[]>('/loans/');
  }

  async getActiveLoans(): Promise<ApiLoan[]> {
    return this.request<ApiLoan[]>('/loans/active');
  }

  async getLoan(loanId: number): Promise<ApiLoan> {
    return this.request<ApiLoan>(`/loans/${loanId}`);
  }

  async createLoan(loan: ApiLoan): Promise<ApiLoan> {
    return this.request<ApiLoan>('/loans/', {
      method: 'POST',
      body: JSON.stringify(loan),
    });
  }

  async returnLoan(loanId: number): Promise<ApiLoan> {
    return this.request<ApiLoan>(`/loans/return/${loanId}`, {
      method: 'PUT',
    });
  }

  async deleteLoan(loanId: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/loans/${loanId}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();