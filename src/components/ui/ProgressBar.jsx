/**
 * components/ui/ProgressBar.jsx
 */
import React from 'react';

export default function ProgressBar({ value = 0, className = '', showLabel = true }) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-1">
        {showLabel && (
          <span className="text-caption text-muted font-medium">{clamped}% complete</span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-500"
          style={{ width: `${clamped}%` }}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
