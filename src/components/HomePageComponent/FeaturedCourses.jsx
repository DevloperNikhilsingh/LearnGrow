/**
 * components/Home/FeaturedCourses.jsx
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import CategoryTabs from '../course/CategoryTabs';
import CourseCard from '../course/CourseCard';
import { getCourses, getDynamicCategories } from '../../services/courseService';

const MAX_VISIBLE_CATEGORIES = 4; // sirf pehle 4 category tabs dikhenge (All Courses ke alawa)

export default function FeaturedCourses() {
  const [courses, setCourses] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage, setCoursesPerPage] = useState(8);

  const allCategories = getDynamicCategories();
  const categories = allCategories.slice(0, MAX_VISIBLE_CATEGORIES);

  useEffect(() => {
    const updateCoursesPerPage = () => {
      setCoursesPerPage(window.innerWidth < 768 ? 4 : 8);
    };
    updateCoursesPerPage();
    window.addEventListener('resize', updateCoursesPerPage);
    return () => window.removeEventListener('resize', updateCoursesPerPage);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, coursesPerPage]);

  useEffect(() => {
    getCourses().then((data) => {
      setCourses(data);
      setLoading(false);
    });
  }, []);

  const categoryCourses = activeCategory
    ? courses.filter(c => c.category === activeCategory)
    : courses;

  const totalCoursePages = Math.max(1, Math.ceil(categoryCourses.length / coursesPerPage));
  const paginatedCourses = categoryCourses.slice(
    (currentPage - 1) * coursesPerPage,
    currentPage * coursesPerPage
  );

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-[#1F1F1F] mb-1.5">Featured Courses</h2>
            <p className="text-muted text-[15px]">Learn from the best. Hand-picked courses for you.</p>
          </div>
          <Link to="/courses" className="text-primary font-semibold flex items-center gap-1 hover:underline">
            View all courses <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mb-8">
          <CategoryTabs
            categories={categories}
            activeSlug={activeCategory}
            onSelect={setActiveCategory}
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="animate-pulse bg-gray-200 rounded-card aspect-[3/4]" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 fade-in">
              {paginatedCourses.length > 0 ? (
                paginatedCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))
              ) : (
                <p className="col-span-full text-center text-muted py-12">No courses found for this category.</p>
              )}
            </div>

            {totalCoursePages > 1 && (
              <div className="flex items-center justify-center flex-wrap gap-1.5 sm:gap-2 mt-10">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                  className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full border border-gray-300 hover:bg-navy hover:border-navy hover:text-white text-[#1F1F1F] disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-[#1F1F1F] disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowRight size={16} className="rotate-180" />
                </button>

                {Array.from({ length: totalCoursePages }).map((_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      aria-label={`Page ${page}`}
                      aria-current={currentPage === page ? 'page' : undefined}
                      className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full text-sm font-semibold border transition-colors ${currentPage === page
                        ? 'bg-navy border-navy text-white'
                        : 'border-gray-300 text-[#1F1F1F] hover:bg-navy hover:border-navy hover:text-white'
                        }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalCoursePages, p + 1))}
                  disabled={currentPage === totalCoursePages}
                  aria-label="Next page"
                  className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full border border-gray-300 hover:bg-navy hover:border-navy hover:text-white text-[#1F1F1F] disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-[#1F1F1F] disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}