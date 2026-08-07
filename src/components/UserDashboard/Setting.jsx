/**
 * UserDashboard/Settings.jsx
 */
import React from 'react';
import { CheckCircle, LogOut } from 'lucide-react';

export default function Setting({
  user,
  userName,
  setUserName,
  notifications,
  toggleNotif,
  settingsSaved,
  handleSaveSettings,
  handleLogout,
}) {
  return (
    <div className="fade-in max-w-2xl">
      <h2 className="text-2xl font-bold text-[#1F1F1F] mb-6">Account Settings</h2>

      {settingsSaved && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm p-3 rounded-xl mb-6 fade-in">
          <CheckCircle size={16} /> Settings saved successfully!
        </div>
      )}

      <div className="space-y-6">
        {/* Profile Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
          <h3 className="text-base font-bold text-[#1F1F1F] border-b border-border pb-3 mb-5">Profile Information</h3>
          <div className="flex items-center gap-5 mb-6">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center text-white text-2xl font-bold shadow-md shrink-0">
              {user?.avatar || 'U'}
            </div>
            <div>
              <p className="font-semibold text-[#1F1F1F]">{user?.name}</p>
              <p className="text-sm text-muted">{user?.email}</p>
              <button className="mt-2 text-xs text-primary font-semibold border border-primary/30 rounded-lg px-3 py-1 hover:bg-primary hover:text-white transition-colors">
                Change Photo
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1F1F1F] mb-1.5">Full Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full border border-border rounded-xl px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 bg-surface text-sm transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1F1F1F] mb-1.5">Email Address</label>
              <input
                type="email"
                defaultValue={user?.email}
                disabled
                className="w-full border border-border rounded-xl px-4 py-2.5 text-muted bg-gray-50 cursor-not-allowed text-sm"
              />
            </div>
          </div>
        </div>

        {/* Password */}
        <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
          <h3 className="text-base font-bold text-[#1F1F1F] border-b border-border pb-3 mb-5">Change Password</h3>
          <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1F1F1F] mb-1.5">New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                className="w-full border border-border rounded-xl px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 bg-surface text-sm transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1F1F1F] mb-1.5">Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                className="w-full border border-border rounded-xl px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 bg-surface text-sm transition-all"
              />
            </div>
          </form>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
          <h3 className="text-base font-bold text-[#1F1F1F] border-b border-border pb-3 mb-5">Notifications</h3>
          <div className="space-y-4">
            {[
              { key: 'email', label: 'Email notifications', desc: 'Receive updates about your courses via email' },
              { key: 'liveClasses', label: 'Live class reminders', desc: 'Get notified 30 minutes before a live session' },
              { key: 'newCourses', label: 'New course announcements', desc: 'Be the first to know about new courses' },
            ].map((notif) => (
              <div key={notif.key} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-[#1F1F1F]">{notif.label}</p>
                  <p className="text-xs text-muted mt-0.5">{notif.desc}</p>
                </div>
                <button
                  onClick={() => toggleNotif(notif.key)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${notifications[notif.key] ? 'bg-primary' : 'bg-gray-200'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${notifications[notif.key] ? 'left-6' : 'left-1'} shadow-sm`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-3">
          <button onClick={handleSaveSettings} className="btn-primary px-8">
            Save Changes
          </button>
          <button onClick={handleLogout} className="flex items-center gap-2 border border-red-200 text-red-500 font-semibold text-sm px-5 py-2.5 rounded-btn hover:bg-red-50 transition-colors">
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}