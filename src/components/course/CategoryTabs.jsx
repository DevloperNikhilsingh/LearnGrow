/**
 * components/course/CategoryTabs.jsx
 * Dynamic category tabs — driven entirely by categories array prop
 */
import React from 'react';

export default function CategoryTabs({ categories, activeSlug, onSelect }) {
  return (
    <nav aria-label="Course categories" className="flex gap-2 flex-wrap">
      <button
        onClick={() => onSelect(null)}
        className={`px-4 py-2 rounded-btn text-sm font-semibold border transition-all duration-200
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
          key={cat.slug}
          onClick={() => onSelect(cat.slug)}
          className={`px-4 py-2 rounded-btn text-sm font-semibold border transition-all duration-200
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
