/**
 * pages/CourseListing.jsx
 */
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams, Link } from 'react-router-dom';
import { SearchX, ChevronDown } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import FilterSidebar from '../components/course/FilterSidebar';
import CourseCard from '../components/course/CourseCard';
import { getFilteredCourses } from '../services/courseService';

export default function CourseListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize state from URL params
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    price: searchParams.get('price') || '',
    rating: searchParams.get('rating') || '',
    level: searchParams.get('level') || '',
    language: searchParams.get('language') || '',
    sort: searchParams.get('sort') || 'popular',
  });

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // NEW: controls whether the filter panel is open on mobile/tablet (lg and below).
  // On lg+ screens this is ignored (filters always visible) via CSS classes below.
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Sync state changes to URL params
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params);
  };

  const handleReset = () => {
    handleFilterChange({
      search: '', category: '', price: '', rating: '', level: '', language: '', sort: 'popular'
    });
  };

  // NEW: Sync filters state whenever URL params change (e.g. Navbar dropdown click)
  useEffect(() => {
    setFilters({
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
      price: searchParams.get('price') || '',
      rating: searchParams.get('rating') || '',
      level: searchParams.get('level') || '',
      language: searchParams.get('language') || '',
      sort: searchParams.get('sort') || 'popular',
    });
  }, [searchParams]);

  // Fetch data when filters change
  useEffect(() => {
    setLoading(true);
    getFilteredCourses(filters).then((data) => {
      setCourses(data);
      setLoading(false);
    });
  }, [filters]);

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Helmet>
        <title>All Courses | LearnGrow</title>
        <meta name="description" content="Browse our complete catalog of professional courses." />
      </Helmet>

      <Navbar />

      {/* Page Header */}
      <div className="bg-navy py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-2">Browse Courses</h1>
          <p className="text-white/70">Find the perfect course to advance your career.</p>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-card shadow-sm border border-border lg:sticky lg:top-24 lg:p-5">
              {/* NEW: Toggle header - visible only below lg breakpoint */}
              <button
                type="button"
                onClick={() => setIsFilterOpen((prev) => !prev)}
                className="w-full flex items-center justify-between p-5 lg:hidden"
                aria-expanded={isFilterOpen}
                aria-controls="filter-sidebar-content"
              >
                <span className="font-bold text-[#1F1F1F]">Filters</span>
                <ChevronDown
                  size={20}
                  className={`text-[#1F1F1F] transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Filter content - collapsible on <lg, always open on lg+ */}
              <div
                id="filter-sidebar-content"
                className={`${isFilterOpen ? 'block' : 'hidden'} lg:block px-5 pb-5 lg:p-0`}
              >
                <FilterSidebar 
                  filters={filters} 
                  onChange={handleFilterChange} 
                  onReset={handleReset} 
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Top Bar (Results count & Sort) */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-card shadow-sm border border-border mb-6 gap-4">
              <p className="text-[#1F1F1F] font-medium text-sm">
                Showing <span className="font-bold">{courses.length}</span> results
              </p>
              <div className="flex items-center gap-2">
                <label htmlFor="sort" className="text-sm text-muted font-medium">Sort by:</label>
                <select 
                  id="sort"
                  value={filters.sort}
                  onChange={(e) => handleFilterChange({ ...filters, sort: e.target.value })}
                  className="bg-surface border border-border text-[#1F1F1F] text-sm rounded-btn px-3 py-1.5 focus:outline-none focus:border-primary"
                >
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Course Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="animate-pulse bg-gray-200 rounded-card aspect-[3/4]" />
                ))}
              </div>
            ) : courses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 fade-in">
                {courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-card shadow-sm border border-border p-16 text-center fade-in flex flex-col items-center">
                <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <SearchX className="text-primary" size={40} />
                </div>
                <h3 className="text-2xl font-bold text-[#1F1F1F] mb-3">No courses found</h3>
                <p className="text-muted mb-8 max-w-md mx-auto">
                  We couldn't find any courses matching your search {filters.search ? `"${filters.search}"` : 'criteria'}. Try adjusting your filters or search for something else.
                </p>
                <div className="flex gap-4">
                  <button onClick={handleReset} className="bg-surface hover:bg-gray-200 text-[#1F1F1F] font-semibold py-2 px-6 rounded-btn transition-colors border border-border">Clear Search</button>
                  <Link to="/" className="bg-primary hover:bg-navy text-white font-semibold py-2 px-6 rounded-btn transition-colors">Browse All</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}