import { useState, useEffect } from 'react';
import { apiService, ApiLoan, ApiBook, ApiUser } from '../../services/api';
import { BookMarked, Plus, Search, X, CheckCircle, AlertCircle, Calendar } from 'lucide-react';

export default function LoanManagement() {
  const [loans, setLoans] = useState<ApiLoan[]>([]);
  const [books, setBooks] = useState<ApiBook[]>([]);
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'returned'>('all');
  const [formData, setFormData] = useState({
    book_id: 0,
    user_id: 0,
    loan_date: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [loansData, booksData, usersData] = await Promise.all([
        apiService.getAllLoans(),
        apiService.getBooks(),
        apiService.getUsers()
      ]);
      setLoans(loansData);
      setBooks(booksData);
      setUsers(usersData);
    } catch (err) {
      setError('Error loading data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getBookTitle = (bookId: number) => {
    const book = books.find(b => b.book_id === bookId);
    return book ? book.title : 'Book not found';
  };

  const getUserName = (userId: number) => {
    const user = users.find(u => u.user_id === userId);
    return user ? user.full_name : 'User not found';
  };

  const filteredLoans = loans.filter(loan => {
    const matchesSearch =
      getBookTitle(loan.book_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getUserName(loan.user_id).toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === 'all' || loan.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.book_id || !formData.user_id) {
      setError('Please select both book and user');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const loanData: ApiLoan = {
        book_id: formData.book_id,
        user_id: formData.user_id,
        loan_date: formData.loan_date
      };

      await apiService.createLoan(loanData);
      await loadData();
      closeModal();
    } catch (err) {
      setError('Error creating loan. Book may not be available.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (loanId: number) => {
    if (confirm('Confirm the return of this loan?')) {
      try {
        setLoading(true);
        setError(null);
        await apiService.returnLoan(loanId);
        await loadData();
      } catch (err) {
        setError('Error returning loan');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const openModal = () => {
    setFormData({
      book_id: 0,
      user_id: 0,
      loan_date: new Date().toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setError(null);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-700';
      case 'returned':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'returned':
        return 'Returned';
      default:
        return status || 'Unknown';
    }
  };

  const availableBooks = books.filter(b => b.status === 'available');
  const activeUsers = users.filter(u => u.status === 'active');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Loan Management</h2>
          <p className="text-slate-600 mt-1">Manage loans and returns</p>
        </div>
        <button
          onClick={openModal}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={20} />
          New Loan
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search by book or user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
          className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="returned">Returned</option>
        </select>
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
        <div className="space-y-4">
          {filteredLoans.map(loan => (
            <div key={loan.loan_id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-slate-200">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="bg-amber-100 p-3 rounded-lg">
                    <BookMarked className="text-amber-600" size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-slate-800 mb-1">{getBookTitle(loan.book_id)}</h3>
                    <p className="text-slate-600 mb-2">User: {getUserName(loan.user_id)}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                      {loan.loan_date && (
                        <div className="flex items-center gap-1">
                          <Calendar size={16} />
                          <span>Loan: {new Date(loan.loan_date).toLocaleDateString('en-US')}</span>
                        </div>
                      )}
                      {loan.return_date && (
                        <div className="flex items-center gap-1">
                          <CheckCircle size={16} />
                          <span>Returned: {new Date(loan.return_date).toLocaleDateString('en-US')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(loan.status)}`}>
                    {getStatusLabel(loan.status)}
                  </span>

                  {loan.status === 'active' && loan.loan_id && (
                    <button
                      onClick={() => handleReturn(loan.loan_id!)}
                      className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                    >
                      <CheckCircle size={16} />
                      Return
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredLoans.length === 0 && !loading && (
        <div className="text-center py-12">
          <BookMarked className="mx-auto text-slate-300 mb-4" size={64} />
          <p className="text-slate-500 text-lg">No loans found</p>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b border-slate-200">
              <h3 className="text-xl font-bold text-slate-800">New Loan</h3>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={24} className="text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Book *</label>
                <select
                  required
                  value={formData.book_id}
                  onChange={(e) => setFormData({ ...formData, book_id: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value={0}>Select book</option>
                  {availableBooks.map(book => (
                    <option key={book.book_id} value={book.book_id}>
                      {book.title} - {book.author}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">User *</label>
                <select
                  required
                  value={formData.user_id}
                  onChange={(e) => setFormData({ ...formData, user_id: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value={0}>Select user</option>
                  {activeUsers.map(user => (
                    <option key={user.user_id} value={user.user_id}>
                      {user.full_name} - {user.email}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Loan Date *</label>
                <input
                  type="date"
                  required
                  value={formData.loan_date}
                  onChange={(e) => setFormData({ ...formData, loan_date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-slate-700">
                <p className="font-medium mb-1">Information:</p>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li>Only available books can be loaned</li>
                  <li>Only active users can take loans</li>
                </ul>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating...' : 'Register Loan'}
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
