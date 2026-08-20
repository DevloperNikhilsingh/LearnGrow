
import React from 'react';

export default function StatCard({ icon: Icon, label, value, color = 'text-primary', bgColor = 'bg-blue-50' }) {
  return (
    <div className="bg-white border border-border rounded-card p-3 sm:p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 shadow-card">
      <div className={`${bgColor} p-2 sm:p-3 rounded-xl shrink-0`}>
        {Icon && <Icon size={20} className={`${color} sm:w-6 sm:h-6`} />}
      </div>
      <div>
        <p className="text-[11px] sm:text-caption text-muted font-medium uppercase tracking-wide">{label}</p>
        <p className="text-lg sm:text-xl md:text-2xl font-bold text-[#1F1F1F] mt-0.5">{value}</p>
      </div>
    </div>
  );
}