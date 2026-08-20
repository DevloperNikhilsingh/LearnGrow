/**
 * pages/Signup.jsx
 */
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Mail, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';
import { register } from '../services/authService';

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.returnTo;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [role, setRole] = useState('student');

  const handleSubmit = async (e) => {

    console.log('selected role is', role);

    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      await register({ name, email, password, role });
      setSuccess(true);
      // After 2 seconds, redirect to login page
      setTimeout(() => {
        navigate('/login', { state: { returnTo } });
      }, 2000);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1729] via-[#1a2640] to-[#0d1b35] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Sign Up | LearnGrow</title>
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

          {/* Success State */}
          {success ? (
            <div className="text-center py-6 fade-in">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="text-green-400" size={36} />
                </div>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Account Created!</h2>
              <p className="text-white/50 text-sm mb-4">
                Your account has been successfully created. Redirecting you to login...
              </p>
              <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : (
            <>
              {/* Heading */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">Create your account</h1>
                <p className="text-white/50 text-sm mt-1">Join thousands of learners on LearnGrow</p>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-xl mb-5">
                  {error}
                </div>
              )}

              <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 pl-10 text-white placeholder-white/30 focus:outline-none focus:border-primary focus:bg-white/15 transition-all text-sm"
                    />
                  </div>
                </div>

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
                      placeholder="Min. 6 characters"
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
                  <p className="text-white/30 text-xs mt-1.5">Must be at least 6 characters</p>
                </div>

                {/* Role info badge — always User */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Create Account as a</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole('student')}
                      className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-semibold transition-all ${role === 'student'
                          ? 'bg-primary/15 border-primary text-primary'
                          : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20'
                        }`}
                    >
                      <User size={16} /> Student
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole('instructor')}
                      className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-semibold transition-all ${role === 'instructor'
                          ? 'bg-amber/15 border-amber text-amber'
                          : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20'
                        }`}
                    >
                      <BookOpen size={16} /> Instructor
                    </button>
                  </div>
                  
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-sm bg-primary text-white hover:bg-blue-700 shadow-lg shadow-primary/20 transition-all duration-200 active:scale-95 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Create Account
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-white/40">
                Already have an account?{' '}
                <Link to="/login" state={{ returnTo }} className="text-primary font-semibold hover:text-blue-400 transition-colors">
                  Log in here
                </Link>
              </p>
            </>
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