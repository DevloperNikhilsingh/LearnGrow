/**
 * pages/Login.jsx
 */
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Mail, Lock, ShieldCheck, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { login } from '../services/authService';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.returnTo || '/dashboard';

  const [role, setRole] = useState('user'); // 'user' or 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleSwitch = (newRole) => {
    setRole(newRole);
    setEmail('');
    setPassword('');
    setError('');
    // Auto-fill admin credentials when admin tab selected
    if (newRole === 'admin') {
      setEmail('admin@learngrow.in');
      setPassword('admin123');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login({ email, password });
      if (role === 'admin' && user.role !== 'admin') {
        setError('Access denied. You are not an admin.');
        setLoading(false);
        return;
      }
      if (role === 'user' && user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(user.role === 'admin' ? '/admin' : returnTo);
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1729] via-[#1a2640] to-[#0d1b35] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Log In | LearnGrow</title>
      </Helmet>

      {/* Background decorative circles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md w-full">
        {/* Logo */}
        <Link to="/" className="flex justify-center items-center gap-2 mb-8 hover:opacity-80 transition-opacity">
          <div className="bg-amber/20 p-2 rounded-xl">
            <BookOpen className="text-amber" size={28} />
          </div>
          <span className="font-bold text-2xl tracking-tight text-white">LearnGrow</span>
        </Link>

        {/* Card */}
        <div className="bg-white/[0.06] backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-8">
          
          {/* Role Switcher */}
          <div className="flex bg-white/10 rounded-xl p-1 mb-8 gap-1">
            <button
              type="button"
              onClick={() => handleRoleSwitch('user')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                role === 'user'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              <User size={16} />
              User Login
            </button>
            <button
              type="button"
              onClick={() => handleRoleSwitch('admin')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                role === 'admin'
                  ? 'bg-amber text-navy shadow-md'
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              <ShieldCheck size={16} />
              Admin Login
            </button>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">
              {role === 'admin' ? 'Admin Portal' : 'Welcome back!'}
            </h1>
            <p className="text-white/50 text-sm mt-1">
              {role === 'admin' 
                ? 'Sign in with your admin credentials' 
                : 'Log in to continue your learning journey'}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-xl mb-5">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 pl-10 text-white placeholder-white/30 focus:outline-none focus:border-primary focus:bg-white/15 transition-all text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 pl-10 pr-12 text-white placeholder-white/30 focus:outline-none focus:border-primary focus:bg-white/15 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-95 ${
                role === 'admin'
                  ? 'bg-amber text-navy hover:brightness-110 shadow-lg shadow-amber/20'
                  : 'bg-primary text-white hover:bg-blue-700 shadow-lg shadow-primary/20'
              } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {role === 'admin' ? 'Access Admin Panel' : 'Log In'}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Footer links — only for user */}
          {role === 'user' && (
            <p className="mt-6 text-center text-sm text-white/40">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary font-semibold hover:text-blue-400 transition-colors">
                Register here
              </Link>
            </p>
          )}

          {/* Admin info note */}
          {role === 'admin' && (
            <p className="mt-6 text-center text-xs text-white/30">
              Admin access is restricted. Contact system administrator for credentials.
            </p>
          )}
        </div>

        {/* Bottom tag */}
        <p className="mt-6 text-center text-xs text-white/20">
          © 2026 LearnGrow. All rights reserved.
        </p>
      </div>
    </div>
  );
}
