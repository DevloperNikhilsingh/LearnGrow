import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import instructorCourses from '../../data/InstructorCourses';
import { div } from 'framer-motion/client';

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = () => {
    setCourses(instructorCourses);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      setCourses(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleEdit = (id) => {
    navigate(`/instructor/courses/edit/${id}`);
  };

  const filteredCourses = courses.filter((course) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    return (
      course.title?.toLowerCase().includes(term) ||
      course.categoryName?.toLowerCase().includes(term)
    );
  });

  const getStatusBadge = (status) => {
    if (status === 'approved') return <Badge label="Live" className="bg-green-50 text-green-600" />;
    if (status === 'pending') return <Badge label="Pending Review" className="bg-amber-50 text-amber-600" />;
    return <Badge label="Rejected" className="bg-red-50 text-red-600" />;
  };

  return (

    <>
    <div className='w-full bg-white lg:bg-navy  flex justify-between items-center p-4 mt-10 lg:mt-0'>
       <h1 className="text-lg sm:text-xl font-bold text-white">My Courses</h1>
      <a href="/instructor/courses/new" >
      <Button>
        <Plus size={20}/>Add Course
      </Button>
      </a>
    </div>
      <div className="bg-white rounded-card shadow-sm border border-border overflow-hidden p-4">
        
        <div className="p-4 border-b border-border flex justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search your courses..."
              className="w-full bg-white border border-border rounded-btn py-1.5 pl-9 pr-4 text-sm focus:outline-none focus:border-primary"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={14} />
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm text-[#1F1F1F]">
            <thead className="bg-surface text-muted uppercase font-semibold text-xs border-b border-border">
              <tr>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Students</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCourses.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-muted">No courses found.</td></tr>
              ) : filteredCourses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img src={course.thumbnail} alt="" className="w-16 h-10 object-cover rounded bg-gray-200 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-[#1F1F1F] line-clamp-1">{course.title}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{course.categoryName}</td>
                  <td className="px-6 py-4 font-medium">
                    {course.isFree ? 'Free' : `₹${course.price}`}
                  </td>
                  <td className="px-6 py-4">{course.studentsEnrolled || '-'}</td>
                  <td className="px-6 py-4">
                    {getStatusBadge(course.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        aria-label='edit course detail'
                        onClick={() => handleEdit(course.id)}
                        className="p-1.5 text-muted hover:text-primary transition-colors bg-surface rounded"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        aria-label='delete course'
                        onClick={() => handleDelete(course.id, course.title)}
                        className="p-1.5 text-muted hover:text-red-600 transition-colors bg-surface rounded"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-border">
          {filteredCourses.length === 0 ? (
            <p className="p-8 text-center text-muted text-sm">No courses found.</p>
          ) : filteredCourses.map((course) => (
            <div key={course.id} className="p-4 flex gap-3">
              <img src={course.thumbnail} alt="" className="w-16 h-16 rounded-lg object-cover bg-gray-200 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#1F1F1F] text-sm line-clamp-1">{course.title}</p>
                <p className="text-xs text-muted mt-0.5">{course.categoryName}</p>
                <div className="flex items-center justify-between mt-2 gap-2">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="font-medium">{course.isFree ? 'Free' : `₹${course.price}`}</span>
                    <span>·</span>
                    <span>{course.studentsEnrolled || 0} students</span>
                  </div>
                  {getStatusBadge(course.status)}
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    aria-label='edit course detail'
                    onClick={() => handleEdit(course.id)}
                    className="flex items-center gap-1 text-xs border border-border rounded-lg px-3 py-1.5 hover:bg-gray-50"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button
                    aria-label='delete course'
                    onClick={() => handleDelete(course.id, course.title)}
                    className="flex items-center gap-1 text-xs border border-border rounded-lg px-3 py-1.5 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
      </>
  );
}