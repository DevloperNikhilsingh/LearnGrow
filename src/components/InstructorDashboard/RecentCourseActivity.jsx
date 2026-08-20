/**
 * components/InstructorDashboard/RecentCourseActivity.jsx
 * Shows the most recently updated courses with a status badge,
 * matching the "Recent Course Activity" card design.
 */
import React from 'react';
import { ArrowRight } from 'lucide-react';

const STATUS_BADGE = {
  approved: { label: 'Live', className: 'bg-success/10 text-success' },
  pending: { label: 'Pending Review', className: 'bg-amber/10 text-amber' },
  rejected: { label: 'Rejected', className: 'bg-red-50 text-red-500' },
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function RecentCourseActivity({ courses = [], onViewAll }) {
  const recent = [...courses]
    .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
    .slice(0, 3);

  return (
    <div className="bg-white rounded-card border border-border p-5 sm:p-6">
      <h3 className="font-bold text-[#1F1F1F] text-sm sm:text-base mb-4">
        Recent Course Activity
      </h3>

      <div className="space-y-4">
        {recent.map((course) => {
          const badge = STATUS_BADGE[course.status] || STATUS_BADGE.pending;
          const dateLabel =
            course.status === 'rejected'
              ? `Rejected on ${formatDate(course.lastUpdated)}`
              : `Submitted on ${formatDate(course.lastUpdated)}`;

          return (
            <div key={course.id} className="flex items-center gap-3">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-11 h-11 rounded-lg object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1F1F1F] truncate">
                  {course.title}
                </p>
                <p className="text-xs text-muted">{dateLabel}</p>
              </div>
              <span
                className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${badge.className}`}
              >
                {badge.label}
              </span>
            </div>
          );
        })}

        {recent.length === 0 && (
          <p className="text-sm text-muted text-center py-4">No recent activity yet.</p>
        )}
      </div>

      {courses.length > 0 && (
        <button
          onClick={onViewAll}
          className="mt-4 text-primary text-sm font-semibold hover:underline flex items-center gap-1"
        >
          View all courses <ArrowRight size={14} />
        </button>
      )}
    </div>
  );
}