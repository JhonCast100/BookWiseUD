
import { useState, useEffect } from 'react';
import { apiService, ApiLoan, ApiBook } from '../../services/api';
import { BookMarked, Calendar, CheckCircle, Clock, BookOpen, AlertCircle } from 'lucide-react';
import Alert, { AlertType } from '../layout/Alert';

export default function MyLoans() {
  const [loans, setLoans] = useState<ApiLoan[]>([]);
  const [books, setBooks] = useState<ApiBook[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'returned'>('all');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: AlertType; title?: string; message: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setAlert(null);
      const [loansData, booksData] = await Promise.all([
        apiService.getMyLoans(),
        apiService.getBooks()
      ]);
      setLoans(loansData);
      setBooks(booksData);
    } catch (err: any) {
      setAlert({ type: 'error', message: err.response?.data?.detail || 'Error loading loans' });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getBookTitle = (bookId: number) => {
    const book = books.find(b => b.book_id === bookId);
    return book ? book.title : 'Book not found';
  };

  const getBookAuthor = (bookId: number) => {
    const book = books.find(b => b.book_id === bookId);
    return book ? book.author : 'Unknown';
  };

  const getBookDetails = (bookId: number) => {
    return books.find(b => b.book_id === bookId);
  };

  const filteredLoans = loans.filter(loan => {
    if (filterStatus === 'all') return true;
    return loan.status === filterStatus;
  });

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

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'active':
        return <Clock size={20} className="text-blue-600" />;
      case 'returned':
        return <CheckCircle size={20} className="text-green-600" />;
      default:
        return <AlertCircle size={20} className="text-slate-600" />;
    }
  };

  const calculateDaysElapsed = (loanDate: string) => {
    const loan = new Date(loanDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - loan.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const activeLoans = loans.filter(l => l.status === 'active').length;
  const returnedLoans = loans.filter(l => l.status === 'returned').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">My Loans</h2>
        <p className="text-slate-600 mt-1">Track your borrowed books</p>
      </div>

      {/* Resumen de préstamos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm mb-1">Total Loans</p>
              <p className="text-3xl font-bold text-slate-800">{loans.length}</p>
            </div>
            <div className="bg-slate-100 p-3 rounded-lg">
              <BookMarked className="text-slate-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm mb-1">Active Loans</p>
              <p className="text-3xl font-bold text-blue-600">{activeLoans}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Clock className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm mb-1">Returned</p>
              <p className="text-3xl font-bold text-green-600">{returnedLoans}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
          className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Loans</option>
          <option value="active">Active</option>
          <option value="returned">Returned</option>
        </select>
        <button
          onClick={loadData}
          className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Refresh
        </button>
      </div>

      {alert && (
        <Alert
          type={alert.type}
          title={alert.type === 'error' ? 'Error' : undefined}
          message={alert.message}
          onClose={() => setAlert(null)}
          autoClose={true}
        />
      )}

      {loading && (
        <div className="text-center py-8">
          <p className="text-slate-500">Loading your loans...</p>
        </div>
      )}

      {!loading && (
        <div className="space-y-4">
          {filteredLoans.map(loan => {
            const book = getBookDetails(loan.book_id);
            const daysElapsed = loan.loan_date ? calculateDaysElapsed(loan.loan_date) : 0;

            return (
              <div 
                key={loan.loan_id} 
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-slate-200"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="bg-amber-100 p-3 rounded-lg">
                      <BookOpen className="text-amber-600" size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-slate-800 mb-1">
                        {getBookTitle(loan.book_id)}
                      </h3>
                      <p className="text-slate-600 mb-2">
                        by {getBookAuthor(loan.book_id)}
                      </p>
                      {book?.isbn && (
                        <p className="text-slate-500 text-sm mb-2">ISBN: {book.isbn}</p>
                      )}
                      <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                        {loan.loan_date && (
                          <div className="flex items-center gap-1">
                            <Calendar size={16} />
                            <span>Loaned: {new Date(loan.loan_date).toLocaleDateString('en-US')}</span>
                          </div>
                        )}
                        {loan.return_date && (
                          <div className="flex items-center gap-1">
                            <CheckCircle size={16} />
                            <span>Returned: {new Date(loan.return_date).toLocaleDateString('en-US')}</span>
                          </div>
                        )}
                        {loan.status === 'active' && loan.loan_date && (
                          <div className="flex items-center gap-1">
                            <Clock size={16} />
                            <span className="text-amber-600 font-medium">
                              {daysElapsed} {daysElapsed === 1 ? 'day' : 'days'} elapsed
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${getStatusColor(loan.status)}`}>
                      {getStatusIcon(loan.status)}
                      {getStatusLabel(loan.status)}
                    </div>
                  </div>
                </div>

                {loan.status === 'active' && (
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
                      <p className="font-medium">📖 Remember to return this book on time!</p>
                      <p className="text-blue-600 mt-1">Contact the librarian if you need an extension.</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {filteredLoans.length === 0 && !loading && (
        <div className="text-center py-12">
          <BookMarked className="mx-auto text-slate-300 mb-4" size={64} />
          <p className="text-slate-500 text-lg">
            {filterStatus === 'all' ? 'No loans found' : `No ${filterStatus} loans`}
          </p>
          <p className="text-slate-400 text-sm mt-2">
            {filterStatus === 'active' 
              ? 'Visit the catalog to borrow books' 
              : 'Your loan history will appear here'}
          </p>
        </div>
      )}
    </div>
  );
}