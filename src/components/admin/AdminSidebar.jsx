/**
 * components/admin/AdminSidebar.jsx
 */
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Book, Users, Video, LogOut, BookOpen, Menu, X, Tag, Quote, Award, Star } from 'lucide-react';

const navItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { path: '/admin/courses', icon: Book, label: 'Courses' },
  { path: '/admin/categories', icon: Tag, label: 'Categories' },
  { path: '/admin/students', icon: Users, label: 'Students' },
  { path: '/admin/live-classes', icon: Video, label: 'Live Classes' },
  { path: '/admin/testimonal', icon: Star, label: 'Testimonal'}
];

function SidebarContent({ onClose }) {
  return (
    <div className="flex flex-col h-full bg-navy text-white">
      {/* Header */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <BookOpen className="text-amber" size={24} />
          <span className="font-bold text-xl tracking-tight">LearnGrow Admin</span>
        </div>
        {/* Close button — only visible on mobile/tablet */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden text-white/70 hover:text-white transition-colors p-1 rounded"
            aria-label="Close sidebar"
          >
            <X size={22} />
          </button>
        )}
      </div>

      {/* Nav links */}
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              onClick={onClose}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-btn text-sm font-medium transition-colors
                ${isActive ? 'bg-primary text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}
              `}
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <NavLink
          to="/"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-btn text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
        >
          <LogOut size={18} />
          Exit to Website
        </NavLink>
      </div>
    </div>
  );
}

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ─── Desktop sidebar (lg+) ─── */}
      <aside className="hidden lg:flex w-64 flex-col bg-navy text-white h-screen sticky top-0 flex-shrink-0">
        <SidebarContent onClose={null} />
      </aside>

      {/* ─── Mobile / Tablet: Hamburger trigger ─── */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-navy text-white p-2 rounded-lg shadow-lg hover:bg-navy/90 transition-colors"
        aria-label="Open sidebar"
      >
        <Menu size={22} />
      </button>

      {/* ─── Mobile / Tablet: Backdrop overlay ─── */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ─── Mobile / Tablet: Slide-in drawer ─── */}
      <aside
        className={`lg:hidden fixed top-0 left-0 z-50 h-full w-64 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent onClose={() => setOpen(false)} />
      </aside>
    </>
  );
}
