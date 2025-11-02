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
  }
};

export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const initializeSampleData = () => {
  if (storage.getBooks().length === 0) {
    const sampleBooks: Book[] = [
      {
        id: generateId(),
        title: 'Cien Años de Soledad',
        author: 'Gabriel García Márquez',
        isbn: '978-0307474728',
        category: 'Ficción',
        publishYear: 1967,
        copies: 5,
        availableCopies: 5,
        description: 'Una obra maestra de la literatura latinoamericana'
      },
      {
        id: generateId(),
        title: 'Don Quijote de la Mancha',
        author: 'Miguel de Cervantes',
        isbn: '978-8491050407',
        category: 'Clásicos',
        publishYear: 1605,
        copies: 3,
        availableCopies: 2,
        description: 'La novela más influyente de la literatura española'
      },
      {
        id: generateId(),
        title: 'El Principito',
        author: 'Antoine de Saint-Exupéry',
        isbn: '978-0156012195',
        category: 'Infantil',
        publishYear: 1943,
        copies: 8,
        availableCopies: 6,
        description: 'Un cuento filosófico sobre la vida y el amor'
      }
    ];
    storage.setBooks(sampleBooks);
  }

  if (storage.getUsers().length === 0) {
    const sampleUsers: User[] = [
      {
        id: generateId(),
        name: 'María González',
        email: 'maria.gonzalez@email.com',
        phone: '+34 600 123 456',
        address: 'Calle Principal 123, Madrid',
        membershipDate: new Date().toISOString(),
        status: 'active',
        type: 'student'
      }
    ];
    storage.setUsers(sampleUsers);
  }
};
