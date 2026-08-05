/**
 * components/ui/Button.jsx
 * Reusable button component with variant support
 */
import React from 'react';

const variantClasses = {
  primary:  'bg-primary text-white hover:bg-blue-700 border-transparent',
  outline:  'border border-primary text-primary hover:bg-primary hover:text-white',
  amber:    'bg-amber text-navy hover:brightness-90',
  danger:   'bg-red-600 text-white hover:bg-red-700 border-transparent',
  ghost:    'text-primary hover:bg-blue-50 border-transparent',
  secondary:'bg-surface text-[#1F1F1F] hover:bg-gray-200 border-border',
};

const sizeClasses = {
  sm:  'px-3 py-1.5 text-sm',
  md:  'px-5 py-2.5 text-[15px]',
  lg:  'px-7 py-3.5 text-[15px]',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  ...rest
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2
        font-semibold rounded-btn border
        transition-all duration-200 active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      {...rest}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
