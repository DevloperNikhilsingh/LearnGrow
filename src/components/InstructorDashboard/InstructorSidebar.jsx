/**
 * components/UserDashboard/Sidebar.jsx
 */
import React from 'react';
import { X, ChevronRight, LogOut } from 'lucide-react';

export default function InstructorSidebar({
  mobile = false,
  user,
  InstructorCourses=[],
  totalProgress,
  NAV_ITEMS,
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  handleLogout,
}) {
  return (
    <aside className={mobile
      ? 'fixed inset-0 z-50 flex'
      : 'w-64 bg-navy text-white h-full hidden lg:flex flex-col border-r border-white/10 shrink-0 overflow-y-auto border-t-2 border-navy'
    }>
      {mobile && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}
      <div className={`${mobile ? 'relative z-10 w-72 max-w-[85vw] bg-navy flex flex-col h-full overflow-y-auto' : 'flex flex-col flex-1'}`}>
        {/* User Profile */}
        <div className="p-6 border-b border-white/10">
          {mobile && (
            <button aria-label='close' onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 text-white/60 hover:text-white">
              <X size={20} />
            </button>
          )}
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center text-white font-bold text-lg shrink-0">
              {user?.avatar || 'U'}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-white text-sm truncate">{user?.name || 'Learner'}</p>
              <p className="text-white/50 text-xs truncate">{user?.email}</p>
            </div>
          </div>
          {/* Mini Stats */}
          <div className="flex gap-3 mt-4">
            <div className="flex-1 bg-white/10 rounded-lg p-2 text-center">
              <p className="text-lg font-bold text-white">{InstructorCourses.length}</p>
              <p className="text-white/50 text-xs">Courses</p>
            </div>
            <div className="flex-1 bg-white/10 rounded-lg p-2 text-center">
              <p className="text-lg font-bold text-amber">{totalProgress}%</p>
              <p className="text-white/50 text-xs">Progress</p>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="p-4 flex-1 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
            
              key={item.id}
              onClick={() => { setActiveTab(item.id); if (mobile) setSidebarOpen(false); }}
              className={`flex items-center gap-3 w-full px-4 py-3 text-left rounded-xl transition-all duration-200 text-sm font-medium ${activeTab === item.id
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}
            >
              <item.icon size={18} />
              {item.name}
              {activeTab === item.id && <ChevronRight size={14} className="ml-auto" />}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
          aria-label='logout'
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-white/5 rounded-xl transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}