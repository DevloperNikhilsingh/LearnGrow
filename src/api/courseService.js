/**
 * api/courseService.js
 * -------------------------------------------------
 * Course-related API service.
 * Currently: resolves from mock JSON.
 * -------------------------------------------------
 */

import coursesData from '../data/courses.json';
import categoriesData from '../data/categories.json';

// Centralized mock data store for courses
export let mockCourses = [...coursesData];

/** Get all dynamic categories */
export function getDynamicCategories() {
  const categoriesMap = new Map();
  // Load base categories
  categoriesData.forEach(c => categoriesMap.set(c.slug, c));
  
  // Extract custom categories from courses
  mockCourses.forEach(c => {
    if (c.category && !categoriesMap.has(c.category)) {
      categoriesMap.set(c.category, {
        id: Date.now() + Math.random(),
        slug: c.category,
        name: c.categoryName || c.category,
        icon: '/webdevelopment.svg', // default icon
        description: `Explore all courses related to ${c.categoryName || c.category}`,
        color: '#0056D2'
      });
    }
  });

  return Array.from(categoriesMap.values());
}

/** Get all courses */
export async function getCourses() {
  return Promise.resolve([...mockCourses]);
}

/** Get courses filtered by category slug */
export async function getCoursesByCategory(categorySlug) {
  const filtered = mockCourses.filter((c) => c.category === categorySlug);
  return Promise.resolve(filtered);
}

/** Get a single course by its URL slug */
export async function getCourseBySlug(slug) {
  const course = mockCourses.find((c) => c.slug === slug) ?? null;
  return Promise.resolve(course);
}

/** Search courses by query string */
export async function searchCourses(query) {
  if (!query) return Promise.resolve([...mockCourses]);
  const q = query.toLowerCase().trim();
  const results = mockCourses.filter(
    (c) =>
      c.title.toLowerCase().includes(q) ||
      (c.categoryName || '').toLowerCase().includes(q) ||
      (c.category || '').toLowerCase().includes(q) ||
      (c.instructor || '').toLowerCase().includes(q) ||
      (c.keywords && c.keywords.some(k => k.toLowerCase().includes(q))) ||
      (c.shortDescription || '').toLowerCase().includes(q)
  );
  return Promise.resolve(results);
}

/** Get courses filtered by multiple criteria */
export async function getFilteredCourses({ category, price, rating, level, language, sort, search } = {}) {
  let result = [...mockCourses];

  if (search) {
    const q = search.toLowerCase().trim();
    result = result.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        (c.categoryName || '').toLowerCase().includes(q) ||
        (c.category || '').toLowerCase().includes(q) ||
        (c.instructor || '').toLowerCase().includes(q) ||
        (c.keywords && c.keywords.some(k => k.toLowerCase().includes(q))) ||
        (c.shortDescription || '').toLowerCase().includes(q)
    );
  }

  if (category && category !== 'all') result = result.filter((c) => c.category === category);
  if (price === 'free') result = result.filter((c) => c.isFree);
  if (price === 'paid') result = result.filter((c) => !c.isFree);
  if (rating) result = result.filter((c) => c.rating >= Number(rating));
  if (level) result = result.filter((c) => c.level.toLowerCase().includes(level.toLowerCase()));
  if (language) result = result.filter((c) => c.language.toLowerCase().includes(language.toLowerCase()));

  if (sort === 'newest') result.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
  if (sort === 'price-low') result.sort((a, b) => a.price - b.price);
  if (sort === 'price-high') result.sort((a, b) => b.price - a.price);
  if (sort === 'rating') result.sort((a, b) => b.rating - a.rating);

  return Promise.resolve(result);
}
