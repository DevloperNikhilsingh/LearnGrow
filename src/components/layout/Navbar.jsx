/**
 * components/layout/Navbar.jsx
 * Main navigation bar
 */
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, BookOpen, ChevronDown } from 'lucide-react';
import { isAuthenticated, getCurrentUser, logout } from '../../services/authService';
import { getDynamicCategories } from '../../services/courseService';
import { useCart } from '../../context/CartContext';

export default function Navbar() {

  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [searchQuery, setSearchQuery] = useState('');
  const exploreRef = useRef(null);
  const user = getCurrentUser();
  const isLoggedIn = isAuthenticated();

  const categories = getDynamicCategories();

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isDesktop || !isExploreOpen) return;
    const handleOutsideClick = (e) => {
      if (exploreRef.current && !exploreRef.current.contains(e.target)) {
        setIsExploreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isDesktop, isExploreOpen]);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-navy sticky top-0 z-40 border-b border-navy shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-7">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Explore */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 text-white hover:text-amber transition-colors">
              <BookOpen className="text-amber" size={28} />
              <span className="font-bold text-xl tracking-tight">LearnGrow</span>
            </Link>

            {/* Explore Dropdown (Desktop) */}
            <div
              ref={exploreRef}
              className="hidden md:relative md:block"
              onMouseEnter={() => { if (isDesktop) setIsExploreOpen(true); }}
              onMouseLeave={() => { if (isDesktop) setIsExploreOpen(false); }}
            >
              <button
                onClick={() => { if (!isDesktop) setIsExploreOpen(prev => !prev); }}
                className="flex items-center gap-1 text-white/90 hover:text-white font-medium text-sm transition-colors py-2"
              >
                Explore <ChevronDown size={16} className={`transition-transform duration-200 ${isExploreOpen ? 'rotate-180' : ''}`} />
              </button>

              {isExploreOpen && (
                <div className="absolute top-full left-0 w-64 bg-white rounded-b-card shadow-card-hover border border-border overflow-hidden fade-in py-2 z-20">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      to={`/courses?category=${cat.slug}`}
                      className="block px-4 py-2 text-sm text-[#1F1F1F] hover:bg-surface hover:text-primary transition-colors"
                      onClick={() => setIsExploreOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                  <div className="border-t border-border mt-2 pt-2">
                    <Link
                      to="/courses"
                      className="block px-4 py-2 text-sm font-semibold text-primary hover:bg-surface transition-colors"
                      onClick={() => setIsExploreOpen(false)}
                    >
                      All Courses
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <Link to="/contact" className="hidden md:block text-white/90 hover:text-white font-medium text-sm transition-colors">
              Contact
            </Link>
            <Link to="/about" className="hidden md:block text-white/90 hover:text-white font-medium text-sm transition-colors">
              About
            </Link>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full bg-white/10 border border-white/20 rounded-full py-1.5 pl-10 pr-4 text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all text-sm"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={16} />
            </div>
          </div>

          {/* Right Actions (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/cart" className="text-white/90 hover:text-white transition-colors relative">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber text-navy text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">{cartCount}</span>
              )}
            </Link>

            {isLoggedIn ? (
              <div className="flex items-center gap-4 ml-2">
                <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} className="text-white text-sm font-medium hover:text-amber transition-colors">
                  {user?.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
                </Link>
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold border border-white/20">
                  {user?.avatar || 'U'}
                </div>
                <button onClick={handleLogout} className="text-white/70 hover:text-white text-sm transition-colors">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-2">
                <Link to="/login" className="text-white hover:text-amber text-sm font-medium transition-colors">Log In</Link>
                <Link to="/signup" className="bg-amber text-navy hover:brightness-90 px-4 py-1.5 rounded-btn text-sm font-semibold transition-all">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <Link to="/cart" className="text-white relative">
              <ShoppingCart size={20} />
            </Link>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-navy border-t border-white/10 px-4 py-4 space-y-4 fade-in">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="w-full bg-white/10 border border-white/20 rounded-btn py-2 pl-10 pr-4 text-white placeholder-white/50 focus:outline-none text-sm"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={16} />
          </div>

          <div className="space-y-2">
            <p className="text-white/50 text-xs font-semibold uppercase tracking-wider">Categories</p>
            {categories.map((cat) => (
              <Link key={cat.slug} to={`/courses?category=${cat.slug}`} className="block text-white hover:text-amber text-sm" onClick={() => setIsMobileMenuOpen(false)}>
                {cat.name}
              </Link>
            ))}
            <Link to="/courses" className="block text-primary font-semibold text-sm" onClick={() => setIsMobileMenuOpen(false)}>All Courses</Link>
            <Link to="/contact" className="block text-white font-medium text-sm">Contact</Link>
            <Link to="/about" className="block text-white font-medium text-sm">About</Link>
          </div>

          <hr className="border-white/10" />

          {isLoggedIn ? (
            <div className="space-y-3">
              <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} className="block text-white font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                {user?.role === 'admin' ? 'Admin Panel' : 'My Dashboard'}
              </Link>
              <button onClick={handleLogout} className="block text-white/70">Logout</button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link to="/login" className="text-center text-white border border-white/20 rounded-btn py-2 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Log In</Link>
              <Link to="/signup" className="text-center bg-amber text-navy rounded-btn py-2 font-semibold" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}