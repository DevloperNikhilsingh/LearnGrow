/**
 * components/course/FilterSidebar.jsx
 * Left sidebar filters for Course Listing page
 */
import React from 'react';
import categories from '../../data/categories';

const levels = ['Beginner', 'Intermediate', 'Advanced'];
const languages = ['English', 'Hindi + English', 'Hindi'];
const ratings = [4.5, 4.0, 3.5, 3.0];

export default function FilterSidebar({ filters, onChange, onReset }) {
  const set = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <aside aria-label="Course filters" className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-[#1F1F1F]">Filters</h2>
        <button onClick={onReset} className="text-primary text-sm hover:underline">Clear all</button>
      </div>

      {/* Category */}
      <div>
        <h3 className="text-sm font-semibold text-[#1F1F1F] mb-2">Category</h3>
        <ul className="space-y-1.5">
          {categories.map((cat) => (
            <li key={cat.slug}>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-[#1F1F1F] hover:text-primary">
                <input
                  type="radio"
                  name="category"
                  value={cat.slug}
                  checked={filters.category === cat.slug}
                  onChange={() => set('category', cat.slug)}
                  className="accent-primary"
                />
                {cat.name}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <hr className="border-border" />

      {/* Price */}
      <div>
        <h3 className="text-sm font-semibold text-[#1F1F1F] mb-2">Price</h3>
        <ul className="space-y-1.5">
          {[['free', 'Free'], ['paid', 'Paid']].map(([val, label]) => (
            <li key={val}>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-[#1F1F1F] hover:text-primary">
                <input
                  type="radio"
                  name="price"
                  value={val}
                  checked={filters.price === val}
                  onChange={() => set('price', val)}
                  className="accent-primary"
                />
                {label}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <hr className="border-border" />

      {/* Rating */}
      <div>
        <h3 className="text-sm font-semibold text-[#1F1F1F] mb-2">Rating</h3>
        <ul className="space-y-1.5">
          {ratings.map((r) => (
            <li key={r}>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-[#1F1F1F] hover:text-primary">
                <input
                  type="radio"
                  name="rating"
                  value={r}
                  checked={Number(filters.rating) === r}
                  onChange={() => set('rating', r)}
                  className="accent-primary"
                />
                {r}★ & above
              </label>
            </li>
          ))}
        </ul>
      </div>

      <hr className="border-border" />

      {/* Level */}
      <div>
        <h3 className="text-sm font-semibold text-[#1F1F1F] mb-2">Level</h3>
        <ul className="space-y-1.5">
          {levels.map((lvl) => (
            <li key={lvl}>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-[#1F1F1F] hover:text-primary">
                <input
                  type="checkbox"
                  checked={filters.level === lvl}
                  onChange={() => set('level', filters.level === lvl ? '' : lvl)}
                  className="accent-primary"
                />
                {lvl}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <hr className="border-border" />

      {/* Language */}
      <div>
        <h3 className="text-sm font-semibold text-[#1F1F1F] mb-2">Language</h3>
        <ul className="space-y-1.5">
          {languages.map((lang) => (
            <li key={lang}>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-[#1F1F1F] hover:text-primary">
                <input
                  type="checkbox"
                  checked={filters.language === lang}
                  onChange={() => set('language', filters.language === lang ? '' : lang)}
                  className="accent-primary"
                />
                {lang}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
