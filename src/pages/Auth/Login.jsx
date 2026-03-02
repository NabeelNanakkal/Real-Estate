import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock } from 'react-icons/fi';
import { authService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const { user, publicProfile } = useAuth();
  const activeProfile = user || publicProfile;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await authService.login(formData);
      if (data.success) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data));
        toast.success(`Welcome back, ${data.data.name}!`);
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen gradient-dark flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            {activeProfile?.companyLogo ? (
              <div className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-xl p-1 backdrop-blur-sm">
                 <img src={activeProfile.companyLogo.startsWith('http') ? activeProfile.companyLogo : `http://localhost:5000${activeProfile.companyLogo}`} alt="Logo" className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-2xl">{activeProfile?.company?.charAt(0) || 'E'}</span>
              </div>
            )}
            <span className="text-3xl font-bold text-white">{activeProfile?.company || 'EstateHub'}</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Login</h1>
          <p className="text-gray-300">Enter your credentials to access dashboard</p>
        </div>

        <div className="glass rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-white border-0 focus:ring-2 focus:ring-primary"
                  placeholder="admin@estatehub.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-white border-0 focus:ring-2 focus:ring-primary"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-lg font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
