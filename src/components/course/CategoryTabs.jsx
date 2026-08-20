/**
 * components/course/CategoryTabs.jsx
 * Dynamic category tabs — driven entirely by categories array prop
 */
import React from 'react';

export default function CategoryTabs({ categories, activeSlug, onSelect }) {
  return (
    <nav
      aria-label="Course categories"
      className="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth pb-1 -mx-4 px-4 sm:mx-0 sm:px-0"
    >
      <button
        aria-label='all-courses'
        onClick={() => onSelect(null)}
        className={`shrink-0  whitespace-nowrap px-4 py-2 rounded-btn text-sm font-semibold border transition-all duration-200
          ${!activeSlug
            ? 'bg-primary text-white border-primary'
            : 'bg-white text-muted border-border hover:border-primary hover:text-primary'
          }`}
        aria-pressed={!activeSlug}
      >
        All Courses
      </button>

      {categories.map((cat) => (
        <button
          aria-label='category-tab'
          key={cat.slug}
          onClick={() => onSelect(cat.slug)}
          className={`shrink-0 whitespace-nowrap px-4 py-2 rounded-btn text-sm font-semibold border transition-all duration-200
            ${activeSlug === cat.slug
              ? 'bg-primary text-white border-primary'
              : 'bg-white text-muted border-border hover:border-primary hover:text-primary'
            }`}
          aria-pressed={activeSlug === cat.slug}
        >
          {cat.name}
        </button>
      ))}
    </nav>
  );
}