/**
 * UserDashboard/LiveClasses.jsx
 */
import React from 'react';
import { Video, Calendar } from 'lucide-react';

export default function LiveClasses({ liveClasses }) {
  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#1F1F1F]">Live Classes</h2>
        <span className="text-sm text-muted bg-white border border-border rounded-full px-3 py-1">{liveClasses.length} sessions</span>
      </div>
      {liveClasses.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-border p-12 text-center">
          <Video size={56} className="text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#1F1F1F]">No live classes scheduled</h3>
          <p className="text-muted mt-2">Your enrolled courses don't have upcoming live sessions.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {liveClasses.map((lc) => {
            const dateObj = new Date(lc.date);
            const month = dateObj.toLocaleString('default', { month: 'short' });
            const day = dateObj.getDate();
            return (
              <div
                key={lc.id}
                className={`bg-white border rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm transition-all ${lc.isActive ? 'border-red-200 bg-red-50/30' : 'border-border hover:shadow-md'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`rounded-xl flex flex-col items-center justify-center min-w-[4.5rem] h-16 shrink-0 ${lc.isActive ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-primary'}`}>
                    <span className="text-xs font-bold uppercase">{month}</span>
                    <span className="text-2xl font-bold leading-none mt-0.5">{day}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-[#1F1F1F]">{lc.title}</h4>
                      {lc.isActive && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded-full animate-pulse">🔴 LIVE</span>
                      )}
                    </div>
                    <p className="text-sm text-muted mt-0.5">{lc.instructor}</p>
                    <p className="text-sm text-muted flex items-center gap-1.5 mt-1">
                      <Calendar size={13} /> {lc.time}
                    </p>
                  </div>
                </div>
                {lc.isActive ? (
                  <a
                    href={lc.zoomLink}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 w-full sm:w-auto text-center bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-colors text-sm"
                  >
                    Join Now →
                  </a>
                ) : (
                  <div className="shrink-0 w-full sm:w-auto text-center bg-surface border border-border text-muted font-medium py-2.5 px-6 rounded-xl text-sm">
                    Upcoming
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}