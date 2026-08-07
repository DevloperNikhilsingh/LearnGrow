/**
 * UserDashboard/Overview.jsx
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Video, Award, Target, ChevronRight } from 'lucide-react';
import ProgressBar from '../../components/ui/ProgressBar';

export default function Overview({ user, courses, liveClasses, progressData, totalProgress, activeLiveClass, setActiveTab, certificatesCount, activity }) {
  return (
    <div className="space-y-6 fade-in">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-navy to-[#1a3a6b] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10">
          <BookOpen size={160} />
        </div>
        <div className="relative z-10">
          <p className="text-white/60 text-sm font-medium">Welcome back,</p>
          <h2 className="text-2xl font-bold mt-0.5">{user?.name || 'Learner'} 👋</h2>
          <p className="text-white/70 text-sm mt-2">
            You've completed <span className="text-amber font-bold">{totalProgress}%</span> of your enrolled courses. Keep going!
          </p>
          <button
            onClick={() => setActiveTab('courses')}
            className="mt-4 bg-amber text-navy text-sm font-semibold px-5 py-2 rounded-lg hover:brightness-110 transition-all flex items-center gap-2"
          >
            Continue Learning <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Active Live Class Banner */}
      {activeLiveClass && (
        <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full shrink-0">
              <Video size={22} className="animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-red-100">🔴 Live Now</p>
              <h3 className="font-bold text-lg leading-tight">{activeLiveClass.title}</h3>
              <p className="text-red-100 text-sm">{activeLiveClass.instructor}</p>
            </div>
          </div>
          <a
            href={activeLiveClass.zoomLink}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 bg-white text-red-600 font-bold px-6 py-2.5 rounded-xl hover:bg-red-50 transition-colors shadow-md text-sm"
          >
            Join on Zoom →
          </a>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Enrolled', value: courses.length, icon: BookOpen, color: 'bg-blue-50 text-primary', border: 'border-blue-100' },
          { label: 'Certificates', value: certificatesCount, icon: Award, color: 'bg-amber/10 text-amber', border: 'border-amber/20' },
          { label: 'Live Classes', value: liveClasses.length, icon: Video, color: 'bg-red-50 text-red-500', border: 'border-red-100' },
          { label: 'Avg Progress', value: `${totalProgress}%`, icon: Target, color: 'bg-green-50 text-green-600', border: 'border-green-100' },
        ].map((stat) => (
          <div key={stat.label} className={`bg-white rounded-xl p-4 border ${stat.border} shadow-sm flex flex-col gap-2`}>
            <div className={`w-9 h-9 rounded-lg ${stat.color} flex items-center justify-center`}>
              <stat.icon size={18} />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1F1F1F]">{stat.value}</p>
              <p className="text-xs text-muted">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Continue Learning */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[#1F1F1F]">Continue Learning</h3>
          <button onClick={() => setActiveTab('courses')} className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
            View all <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.slice(0, 2).map((course) => (
            <div key={course.id} className="bg-white border border-border rounded-xl p-4 flex gap-4 items-center shadow-sm hover:shadow-md transition-shadow group">
              <img src={course.thumbnail} alt={course.title} className="w-20 h-14 object-cover rounded-lg shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-[#1F1F1F] text-sm line-clamp-1">{course.title}</h4>
                <p className="text-xs text-muted mb-2">{course.instructor}</p>
                <ProgressBar value={progressData[course.id] || 0} />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted">{progressData[course.id] || 0}% done</span>
                  <Link to={`/dashboard/course/${course.slug}`} className="text-xs text-primary font-semibold hover:underline">
                    Resume →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-lg font-bold text-[#1F1F1F] mb-4">Recent Activity</h3>
        <div className="bg-white border border-border rounded-xl divide-y divide-gray-50 shadow-sm">
          {activity.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4 hover:bg-surface transition-colors">
              <div className={`w-9 h-9 rounded-full ${item.color} flex items-center justify-center shrink-0`}>
                <item.icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#1F1F1F] font-medium">{item.text}</p>
                <p className="text-xs text-muted">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}