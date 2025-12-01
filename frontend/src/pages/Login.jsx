import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, ArrowRight } from 'lucide-react';
import api from '../utils/api';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Reload page to trigger navbar update
      window.location.href = '/journeys';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-3 sm:px-4 py-4 sm:py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-5 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            <Globe className="text-blue-600 w-7 h-7 sm:w-8 sm:h-8" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Globe Link</h1>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Welcome Back</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Sign in to your account</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-3 sm:px-4 py-2 sm:py-3 rounded-lg mb-4 sm:mb-6 text-xs sm:text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Email</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="input-field text-sm sm:text-base h-10 sm:h-11"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Password</label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="input-field text-sm sm:text-base h-10 sm:h-11"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 h-10 sm:h-11 text-sm sm:text-base disabled:opacity-50 mt-2 sm:mt-4"
            >
              {loading ? 'Signing in...' : 'Sign In'}
              <ArrowRight size={18} className="sm:w-5 sm:h-5" />
            </button>
          </form>

          <p className="text-center text-gray-600 mt-4 sm:mt-6 text-xs sm:text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
