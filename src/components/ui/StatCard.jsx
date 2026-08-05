/**
 * components/ui/StatCard.jsx
 * Admin/dashboard stat card
 */
import React from 'react';

export default function StatCard({ icon: Icon, label, value, color = 'text-primary', bgColor = 'bg-blue-50' }) {
  return (
    <div className="bg-white border border-border rounded-card p-6 flex items-center gap-4 shadow-card">
      <div className={`${bgColor} p-3 rounded-xl`}>
        {Icon && <Icon size={24} className={color} />}
      </div>
      <div>
        <p className="text-caption text-muted font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-[#1F1F1F] mt-0.5">{value}</p>
      </div>
    </div>
  );
}
