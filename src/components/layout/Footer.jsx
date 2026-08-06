/**
 * components/layout/Footer.jsx
 */
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Instagram, Twitter, Linkedin, BookOpen, Facebook } from 'lucide-react';
import categories from '../../data/categories';

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToFaq = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      // Already on home page — scroll directly to the FAQ section
      document.getElementById('FAQ')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // On another page — navigate home first, then scroll once it renders
      navigate('/');
      setTimeout(() => {
        document.getElementById('FAQ')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  };

  return (
    <footer className="bg-navy pt-16 pb-8 border-t border-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 text-white hover:text-amber transition-colors">
              <BookOpen className="text-amber" size={28} />
              <span className="font-bold text-2xl tracking-tight">LearnGrow</span>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed">
              Empowering learners worldwide with expert-led courses in technology, design, business, and health.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="text-white/50 hover:text-white transition-colors" aria-label="Facebook"><Facebook size={20} /></a>
              <a href="#" className="text-white/50 hover:text-white transition-colors" aria-label="Twitter"><Twitter size={20} /></a>
              <a href="#" className="text-white/50 hover:text-white transition-colors" aria-label="Instagram"><Instagram size={20} /></a>
              <a href="#" className="text-white/50 hover:text-white transition-colors" aria-label="LinkedIn"><Linkedin size={20} /></a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4 tracking-wide uppercase text-sm">Top Categories</h3>
            <ul className="space-y-3">
              {categories.slice(0, 4).map((cat) => (
                <li key={cat.slug}>
                  <Link to={`/courses?category=${cat.slug}`} className="text-white/70 hover:text-amber text-sm transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/courses" className="text-primary hover:text-white text-sm font-medium transition-colors">
                  View All Categories →
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 tracking-wide uppercase text-sm">LearnGrow</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-white/70 hover:text-amber text-sm transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="text-white/70 hover:text-amber text-sm transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="text-white/70 hover:text-amber text-sm transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4 tracking-wide uppercase text-sm">Support</h3>
            <ul className="space-y-3">
              <li><Link to="/help" className="text-white/70 hover:text-amber text-sm transition-colors">Help Center</Link></li>
              <li><Link to="/terms" className="text-white/70 hover:text-amber text-sm transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-white/70 hover:text-amber text-sm transition-colors">Privacy Policy</Link></li>
              <li>
                <a href="#FAQ" onClick={scrollToFaq} className="text-white/70 hover:text-amber text-sm transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm text-center md:text-left">
            © {new Date().getFullYear()} LearnGrow Inc. All rights reserved.
          </p>
          <div className="flex gap-4">
            <span className="text-white/50 text-sm">Made with ♥ in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}