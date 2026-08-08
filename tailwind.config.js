/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  safelist: [
    'bg-blue-600',
    'bg-emerald-600',
    'bg-amber-500',
    'bg-primary',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Source Sans 3', 'sans-serif'],
      },
      colors: {
        primary:  '#0056D2',
        navy:     '#0a1128',
        amber:    '#F9AB00',
        success:  '#00822B',
        muted:    '#6B7280',
        border:   '#E5E7EB',
        surface:  '#F5F5F5',
      },
      fontSize: {
        'h1': ['40px', { lineHeight: '1.15', fontWeight: '700' }],
        'h2': ['28px', { lineHeight: '1.25', fontWeight: '600' }],
        'h3': ['20px', { lineHeight: '1.3',  fontWeight: '600' }],
        'sm-caption': ['13px', { lineHeight: '1.4' }],
      },
      borderRadius: {
        card: '10px',
        btn: '8px',
      },
      boxShadow: {
        card: '0 1px 4px rgba(0,0,0,0.08)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
};
