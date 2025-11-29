import { useState, useEffect } from 'react';
import { apiService, ApiUser } from '../../services/api';
import { Users, Plus, Search, CreditCard as Edit2, Trash2, X, Mail, Phone } from 'lucide-react';
import Alert, { AlertType } from '../layout/Alert';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

interface UserFormData extends Partial<ApiUser> {
  password?: string;
  role?: 'USER' | 'ADMIN';
}

export default function UserManagement() {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<ApiUser | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    full_name: '',
    email: '',
    phone: '',
    status: 'active',
    password: '',
    role: 'USER'
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: AlertType; title?: string; message: string } | null>(null);
  const [confirmUserId, setConfirmUserId] = useState<number | null>(null);

  // Cliente para Spring Boot Auth
  const authClient = axios.create({
    baseURL: 'http://localhost:8080',
    headers: { 'Content-Type': 'application/json' },
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setAlert(null);
      const data = await apiService.getUsers();
      setUsers(data);
    } catch (err) {
      setAlert({ type: 'error', message: 'Error loading users' });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.phone && user.phone.includes(searchTerm))
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);
    setLoading(true);

    try {
      let authId: number | undefined = editingUser?.auth_id;

      // Si es nuevo usuario, crear en Spring Boot (MySQL)
      if (!editingUser) {
        if (!formData.password) {
          setAlert({ type: 'error', message: 'Password is required for new users' });
          setLoading(false);
          return;
        }

        const response = await authClient.post('/auth/register', {
          username: formData.email,  // Spring espera username
          password: formData.password,
          role: formData.role
        });

        const token = response.data.token;
        const decoded = jwtDecode<{ id: number }>(token);
        authId = decoded.id;

        if (!authId) {
          throw new Error('ID not found in token');
        }
      }

      // Crear o actualizar en PostgreSQL
      const userData: ApiUser = {
        full_name: formData.full_name || '',
        email: formData.email || '',
        phone: formData.phone,
        status: formData.status || 'active',
        auth_id: authId
      };

      if (editingUser && editingUser.user_id) {
        await apiService.updateUser(editingUser.user_id, userData);
        setAlert({ type: 'success', message: 'User updated successfully' });
      } else {
        await apiService.createUser(userData);
        setAlert({ type: 'success', message: 'User created successfully' });
      }

      await loadUsers();
      closeModal();
    } catch (err: any) {
      console.error(err);
      setAlert({ type: 'error', message: err.response?.data?.message || err.message || 'Error saving user' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    setConfirmUserId(id);
  };

  const openModal = (user?: ApiUser) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        status: user.status
      });
    } else {
      setEditingUser(null);
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        status: 'active',
        password: '',
        role: 'USER'
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setAlert(null);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'inactive': return 'bg-slate-100 text-slate-700';
      case 'suspended': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
          <p className="text-slate-600 mt-1">Manage library members</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={20} /> Add User
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Search by name, email or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Alerts */}
      {alert && (
        <Alert
          type={alert.type}
          title={alert.type === 'error' ? 'Error' : undefined}
          message={alert.message}
          onClose={() => setAlert(null)}
          autoClose={true}
        />
      )}

      {confirmUserId !== null && (
        <Alert
          type="info"
          message={'Are you sure you want to deactivate this user?'}
          onConfirm={async () => {
            const id = confirmUserId;
            try {
              setLoading(true);
              setAlert(null);
              await apiService.deleteUser(id!);
              await loadUsers();
              setAlert({ type: 'success', message: 'User deactivated successfully' });
            } catch (err) {
              setAlert({ type: 'error', message: 'Error deactivating user' });
              console.error(err);
            } finally {
              setLoading(false);
              setConfirmUserId(null);
            }
          }}
          onClose={() => setConfirmUserId(null)}
          showCancel={true}
        />
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-8">
          <p className="text-slate-500">Loading...</p>
        </div>
      )}

      {/* Users Grid */}
      {!loading && filteredUsers.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredUsers.map(user => (
            <div key={user.user_id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-slate-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Users className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">{user.full_name}</h3>
                    {user.auth_id && <span className="text-xs text-slate-500">Auth ID: {user.auth_id}</span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openModal(user)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                    <Edit2 size={18} className="text-slate-600" />
                  </button>
                  <button onClick={() => user.user_id && handleDelete(user.user_id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={18} className="text-red-600" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail size={16} />
                  <span className="text-sm">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone size={16} />
                    <span className="text-sm">{user.phone}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(user.status)}`}>
                  {user.status === 'active' ? 'Active' : user.status === 'inactive' ? 'Inactive' : 'Suspended'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No users */}
      {!loading && filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto text-slate-300 mb-4" size={64} />
          <p className="text-slate-500 text-lg">No users found</p>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-slate-200">
              <h3 className="text-xl font-bold text-slate-800">{editingUser ? 'Edit User' : 'Add New User'}</h3>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={24} className="text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    disabled={!!editingUser}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                  />
                  {editingUser && <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {!editingUser && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Password *</label>
                      <input
                        type="password"
                        required
                        value={formData.password || ''}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        minLength={6}
                      />
                      <p className="text-xs text-slate-500 mt-1">Minimum 6 characters</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Role *</label>
                      <select
                        required
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value as 'USER' | 'ADMIN' })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="USER">User</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Status *</label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : editingUser ? 'Update User' : 'Create User'}
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
