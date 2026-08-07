/**
 * UserDashboard/MyCourses.jsx
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, PlayCircle, CheckCircle, Star, Clock } from 'lucide-react';
import ProgressBar from '../../components/ui/ProgressBar';

export default function MyCourses({ courses, progressData }) {
  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#1F1F1F]">My Courses</h2>
        <span className="text-sm text-muted bg-white border border-border rounded-full px-3 py-1">{courses.length} enrolled</span>
      </div>
      {courses.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-border p-12 text-center">
          <BookOpen size={56} className="text-gray-200 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-[#1F1F1F]">No courses yet</h3>
          <p className="text-muted mb-6">Explore our catalog and start learning today.</p>
          <Link to="/courses" className="btn-primary inline-block">Browse Courses</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {courses.map((course) => {
            const prog = progressData[course.id] || 0;
            const completed = course.completedLessons || Math.round((prog / 100) * (course.totalLessons || 10));
            return (
              <div key={course.id} className="max-h-96 bg-white border border-border rounded-2xl overflow-hidden flex flex-col group shadow-sm hover:shadow-md transition-all">
                <div className="relative ">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-40 object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <PlayCircle size={48} className="text-white drop-shadow-lg" />
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="bg-navy/80 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
                      {course.category}
                    </span>
                  </div>
                  {prog >= 90 && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle size={12} /> Done
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4  flex flex-col">
                  <h3 className="font-bold text-[#1F1F1F] mb-2 line-clamp-2 text-base">{course.title}</h3>
                  <p className="text-sm text-muted mb-1">{course.instructor}</p>
                  <div className="flex items-center gap-1 mb-4">
                    <Star size={13} className="text-amber fill-amber" />
                    <span className="text-xs font-semibold text-[#1F1F1F]">{course.rating}</span>
                    <span className="text-xs text-muted ml-2 flex items-center gap-1">
                      <Clock size={12} /> {course.duration}
                    </span>
                  </div>
                  <div className="mt-auto">
                    <div className="flex items-center justify-between text-xs text-muted mb-1.5">
                      <span>{completed}/{course.totalLessons || 10} lessons</span>
                      <span className="font-semibold text-primary">{prog}%</span>
                    </div>
                    <ProgressBar value={prog} />
                    <Link
                      to={`/dashboard/course/${course.slug}`}
                      className="mt-4 block text-center bg-primary hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
                    >
                      {prog > 0 ? 'Continue Learning' : 'Start Course'}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}