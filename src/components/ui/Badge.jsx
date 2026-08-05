/**
 * components/ui/Badge.jsx
 * Course badge: Bestseller, New, Free, Live
 */
import React from 'react';

const badgeConfig = {
  Bestseller: 'bg-amber text-navy',
  New:        'bg-primary text-white',
  Free:       'bg-success text-white',
  Live:       'bg-red-600 text-white',
  default:    'bg-gray-200 text-gray-700',
};

export default function Badge({ label, className = '' }) {
  const cls = badgeConfig[label] || badgeConfig.default;
  return (
    <span
      className={`
        inline-block px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide
        ${cls} ${className}
      `}
    >
      {label}
    </span>
  );
}
