import { useState, useEffect } from 'react';
import { Book, User, Loan } from '../types';
import { storage } from '../utils/storage';
import { BookOpen, Users, BookMarked, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export default function Dashboard() {
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setBooks(storage.getBooks());
    setUsers(storage.getUsers());
    setLoans(storage.getLoans());
  };

  const totalBooks = books.reduce((sum, book) => sum + book.copies, 0);
  const availableBooks = books.reduce((sum, book) => sum + book.availableCopies, 0);
  const activeUsers = users.filter(u => u.status === 'active').length;
  const activeLoans = loans.filter(l => l.status === 'active').length;
  const overdueLoans = loans.filter(l => l.status === 'overdue').length;
  const returnedLoans = loans.filter(l => l.status === 'returned').length;

  const getBookTitle = (bookId: string) => {
    const book = books.find(b => b.id === bookId);
    return book ? book.title : 'Book not found';
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'User not found';
  };

  const recentLoans = [...loans]
    .sort((a, b) => new Date(b.loanDate).getTime() - new Date(a.loanDate).getTime())
    .slice(0, 5);

  const topCategories = books.reduce((acc, book) => {
    acc[book.category] = (acc[book.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryData = Object.entries(topCategories)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
        <p className="text-slate-600 mt-1">General overview of the library system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <BookOpen size={28} />
            </div>
            <TrendingUp size={24} className="opacity-70" />
          </div>
          <h3 className="text-3xl font-bold mb-1">{totalBooks}</h3>
          <p className="text-emerald-100">Total Books</p>
          <p className="text-sm text-emerald-100 mt-2">{availableBooks} available</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <Users size={28} />
            </div>
            <TrendingUp size={24} className="opacity-70" />
          </div>
          <h3 className="text-3xl font-bold mb-1">{users.length}</h3>
          <p className="text-blue-100">Total Users</p>
          <p className="text-sm text-blue-100 mt-2">{activeUsers} active</p>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <BookMarked size={28} />
            </div>
            <Clock size={24} className="opacity-70" />
          </div>
          <h3 className="text-3xl font-bold mb-1">{activeLoans}</h3>
          <p className="text-amber-100">Active Loans</p>
          <p className="text-sm text-amber-100 mt-2">{loans.length} total</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <AlertCircle size={28} />
            </div>
            <AlertCircle size={24} className="opacity-70" />
          </div>
          <h3 className="text-3xl font-bold mb-1">{overdueLoans}</h3>
          <p className="text-red-100">Overdue Loans</p>
          <p className="text-sm text-red-100 mt-2">Require attention</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Loan Activity</h3>
          <div className="space-y-4">
            {recentLoans.length > 0 ? (
              recentLoans.map(loan => (
                <div key={loan.id} className="flex items-start gap-3 pb-4 border-b border-slate-200 last:border-0">
                  <div className={`p-2 rounded-lg ${
                    loan.status === 'active' ? 'bg-blue-100' :
                    loan.status === 'returned' ? 'bg-green-100' :
                    'bg-red-100'
                  }`}>
                    {loan.status === 'active' ? (
                      <Clock size={20} className="text-blue-600" />
                    ) : loan.status === 'returned' ? (
                      <CheckCircle size={20} className="text-green-600" />
                    ) : (
                      <AlertCircle size={20} className="text-red-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 truncate">{getBookTitle(loan.bookId)}</p>
                    <p className="text-sm text-slate-600 truncate">{getUserName(loan.userId)}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(loan.loanDate).toLocaleDateString('en-US')}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                    loan.status === 'active' ? 'bg-blue-100 text-blue-700' :
                    loan.status === 'returned' ? 'bg-green-100 text-green-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {loan.status === 'active' ? 'Active' :
                     loan.status === 'returned' ? 'Returned' : 'Overdue'}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-slate-500 py-8">No loans registered</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Most Popular Categories</h3>
          <div className="space-y-4">
            {categoryData.length > 0 ? (
              categoryData.map(([category, count], index) => {
                const percentage = (count / books.length) * 100;
                return (
                  <div key={category}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-slate-700">{category}</span>
                      <span className="text-sm text-slate-600">{count} books</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${
                          index === 0 ? 'bg-emerald-500' :
                          index === 1 ? 'bg-blue-500' :
                          index === 2 ? 'bg-amber-500' :
                          index === 3 ? 'bg-rose-500' :
                          'bg-slate-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-slate-500 py-8">No categories available</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Returns</h3>
              <p className="text-sm text-slate-600">This month</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-800">{returnedLoans}</p>
          <p className="text-sm text-slate-600 mt-2">Books returned</p>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-amber-100 p-3 rounded-lg">
              <BookMarked className="text-amber-600" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Usage Rate</h3>
              <p className="text-sm text-slate-600">Books on loan</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-800">
            {totalBooks > 0 ? Math.round(((totalBooks - availableBooks) / totalBooks) * 100) : 0}%
          </p>
          <p className="text-sm text-slate-600 mt-2">Of collection</p>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="text-blue-600" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Active Members</h3>
              <p className="text-sm text-slate-600">Registered users</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-800">{activeUsers}</p>
          <p className="text-sm text-slate-600 mt-2">With active membership</p>
        </div>
      </div>
    </div>
  );
}
