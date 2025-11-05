import { useState, useEffect } from 'react';
import { apiService, ApiBook, ApiCategory } from '../../services/api';
import { BookOpen, Plus, Search, CreditCard as Edit2, Trash2, X } from 'lucide-react';

export default function BookManagement() {
  const [books, setBooks] = useState<ApiBook[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<ApiBook | null>(null);
  const [formData, setFormData] = useState<Partial<ApiBook>>({
    title: '',
    author: '',
    isbn: '',
    publication_year: new Date().getFullYear(),
    status: 'available'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getBooks();
      setBooks(data);
    } catch (err) {
      setError('Error loading books');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbn.includes(searchTerm)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const bookData: ApiBook = {
        title: formData.title || '',
        author: formData.author || '',
        isbn: formData.isbn || '',
        publication_year: formData.publication_year,
        status: formData.status || 'available',
        category_id: formData.category_id
      };

      if (editingBook && editingBook.book_id) {
        await apiService.updateBook(editingBook.book_id, bookData);
      } else {
        await apiService.createBook(bookData);
      }

      await loadBooks();
      closeModal();
    } catch (err) {
      setError('Error saving book');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this book?')) {
      try {
        setLoading(true);
        setError(null);
        await apiService.deleteBook(id);
        await loadBooks();
      } catch (err) {
        setError('Error deleting book');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const openModal = async (book?: ApiBook) => {
    try {
      const cats = await apiService.getCategories();
      setCategories(cats);
    } catch (err) {
      setCategories([]);
    }
    if (book) {
      setEditingBook(book);
      setFormData(book);
    } else {
      setEditingBook(null);
      setFormData({
        title: '',
        author: '',
        isbn: '',
        publication_year: new Date().getFullYear(),
        status: 'available',
        category_id: categories.length > 0 ? categories[0].category_id : undefined
      });
    }
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBook(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Book Management</h2>
          <p className="text-slate-600 mt-1">Manage the library catalog</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={20} />
          Add Book
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Search by title, author or ISBN..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <p className="text-slate-500">Loading...</p>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map(book => (
            <div key={book.book_id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-slate-200">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-emerald-100 p-3 rounded-lg">
                  <BookOpen className="text-emerald-600" size={24} />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(book)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Edit2 size={18} className="text-slate-600" />
                  </button>
                  <button
                    onClick={() => book.book_id && handleDelete(book.book_id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} className="text-red-600" />
                  </button>
                </div>
              </div>

              <h3 className="font-bold text-lg text-slate-800 mb-2">{book.title}</h3>
              <p className="text-slate-600 mb-1">Author: {book.author}</p>
              <p className="text-slate-500 text-sm mb-1">ISBN: {book.isbn}</p>

              <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                <span className={`text-sm font-semibold ${book.status === 'available' ? 'text-green-600' : 'text-red-600'}`}>
                  {book.status === 'available' ? 'Available' : 'Not Available'}
                </span>
                {book.publication_year && (
                  <span className="text-sm text-slate-500">Year: {book.publication_year}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredBooks.length === 0 && !loading && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto text-slate-300 mb-4" size={64} />
          <p className="text-slate-500 text-lg">No books found</p>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-slate-200">
              <h3 className="text-xl font-bold text-slate-800">
                {editingBook ? 'Edit Book' : 'Add New Book'}
              </h3>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={24} className="text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Author *</label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">ISBN *</label>
                  <input
                    type="text"
                    required
                    value={formData.isbn}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Publication Year</label>
                  <input
                    type="number"
                    value={formData.publication_year || ''}
                    onChange={(e) => setFormData({ ...formData, publication_year: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Category *</label>
                  <select
                    required
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Status *</label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : editingBook ? 'Update Book' : 'Add Book'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-3 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
