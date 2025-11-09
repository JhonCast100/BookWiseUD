import { useState, useEffect } from 'react';
import { apiService, ApiBook } from '../../services/api';
import { BookOpen, Search, Calendar } from 'lucide-react';

export default function BookCatalog() {
  const [books, setBooks] = useState<ApiBook[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Book Catalog</h2>
        <p className="text-slate-600 mt-1">Browse available books</p>
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
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  book.status === 'available' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {book.status === 'available' ? 'Available' : 'Not Available'}
                </span>
              </div>

              <h3 className="font-bold text-lg text-slate-800 mb-2">{book.title}</h3>
              <p className="text-slate-600 mb-1">Author: {book.author}</p>
              <p className="text-slate-500 text-sm mb-1">ISBN: {book.isbn}</p>

              {book.publication_year && (
                <div className="flex items-center gap-1 text-slate-500 text-sm mt-3">
                  <Calendar size={16} />
                  <span>Published: {book.publication_year}</span>
                </div>
              )}
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
    </div>
  );
}