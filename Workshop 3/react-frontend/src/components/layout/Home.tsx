import { BookOpen, Users, Clock, Shield } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-12">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-slate-800 mb-4">Welcome to BookwiseUD</h2>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Your comprehensive library management system for organizing books, managing users, and tracking loans efficiently.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6 hover:shadow-lg transition-shadow">
          <div className="bg-emerald-100 p-3 rounded-lg w-fit mb-4">
            <BookOpen className="text-emerald-600" size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Book Management</h3>
          <p className="text-slate-600">
            Organize and manage your entire book catalog with detailed information and tracking.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6 hover:shadow-lg transition-shadow">
          <div className="bg-blue-100 p-3 rounded-lg w-fit mb-4">
            <Users className="text-blue-600" size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">User Management</h3>
          <p className="text-slate-600">
            Keep track of library members, their status, and membership information.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6 hover:shadow-lg transition-shadow">
          <div className="bg-amber-100 p-3 rounded-lg w-fit mb-4">
            <Clock className="text-amber-600" size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Loan Tracking</h3>
          <p className="text-slate-600">
            Monitor active loans, due dates, and returns with automatic overdue detection.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6 hover:shadow-lg transition-shadow">
          <div className="bg-red-100 p-3 rounded-lg w-fit mb-4">
            <Shield className="text-red-600" size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Role-Based Access</h3>
          <p className="text-slate-600">
            Secure access control with different permissions for librarians and users.
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg shadow-lg p-8 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">Get Started Today</h3>
          <p className="text-emerald-100 mb-6">
            Log in to access your library management tools and start organizing your collection efficiently.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <p className="font-semibold mb-1">For Librarians</p>
              <p className="text-sm text-emerald-100">Full access to all management features</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <p className="font-semibold mb-1">For Users</p>
              <p className="text-sm text-emerald-100">Browse books and manage your loans</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
