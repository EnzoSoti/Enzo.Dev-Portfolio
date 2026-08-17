import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      api.verifyAdminToken(token).then((valid) => {
        if (valid) navigate('/admin/dashboard');
      });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.adminLogin({ email, password });
      localStorage.setItem('adminToken', data.token);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setError(err.message || 'Invalid credentials. Access denied.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0E0C] grid-bg flex items-center justify-center font-mono text-cream p-4 relative">
      {/* Decorative accent top bar */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-40" />

      <div className="w-full max-w-sm animate-fade-up">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-accent text-xs tracking-[0.5em] uppercase font-semibold">EPD.dev</span>
          <h1 className="font-display text-3xl mt-3 font-normal tracking-tight">Control Room</h1>
          <p className="text-xs opacity-30 mt-2 tracking-wider">ADMIN ACCESS ONLY</p>
        </div>

        {/* Login Card */}
        <div
          className={`glass rounded-sm p-8 login-glow transition-transform ${
            shake ? 'animate-shake' : ''
          }`}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-[10px] uppercase tracking-widest opacity-40 block mb-2">Email</label>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@enzo.dev"
                className="w-full bg-transparent border-b border-cream/10 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors duration-300 placeholder-cream/20 text-cream"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest opacity-40 block mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent border-b border-cream/10 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors duration-300 placeholder-cream/20 text-cream"
              />
            </div>

            {error && (
              <div className="text-xs text-red-400 tracking-wider py-2 px-3 border border-red-500/20 bg-red-500/5 rounded-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-accent text-cream text-xs tracking-[0.2em] uppercase hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70"
            >
              <span>{loading ? 'Authenticating...' : 'Authenticate'}</span>
              <span>{loading ? '⋯' : '→'}</span>
            </button>
          </form>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-8">
          <p className="text-[10px] opacity-20 tracking-wider">
            Session-based authentication • Static credentials for testing
          </p>
        </div>

        <div className="text-center mt-4">
          <Link
            to="/"
            className="text-xs text-accent/60 hover:text-accent transition-colors tracking-wider uppercase"
          >
            ← Back to Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
};
