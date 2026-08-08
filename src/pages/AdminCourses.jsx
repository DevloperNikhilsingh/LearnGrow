/**
 * pages/AdminCourses.jsx
 */
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import AdminSidebar from '../components/admin/AdminSidebar';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { getAdminCourses, deleteCourse } from '../services/adminService';

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = () => {
    getAdminCourses().then(data => {
      setCourses(data);
      setLoading(false);
    });
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      await deleteCourse(id);
      loadCourses();
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/courses/edit/${id}`);
  };

  const filteredCourses = courses.filter((course) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    return (
      course.title?.toLowerCase().includes(term) ||
      course.instructor?.toLowerCase().includes(term) ||
      course.categoryName?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-surface flex">
      <Helmet>
        <title>Manage Courses | Admin</title>
      </Helmet>

      <AdminSidebar />

      <main className="flex-1 overflow-y-auto min-w-0">
        <div className="bg-white border-b border-border min-h-16 flex flex-wrap items-center justify-between gap-3 pl-16 pr-4 py-3 sm:pr-8 lg:px-8 shadow-sm">
          <h1 className="text-lg sm:text-xl font-bold text-[#1F1F1F]">Manage Courses</h1>
          <Link to="/admin/courses/new">
            <Button variant="primary" size="sm" className="gap-1"><Plus size={16}/> <span className="hidden xs:inline">Add Course</span><span className="xs:hidden">Add</span></Button>
          </Link>
        </div>

        <div className="p-4 sm:p-8 max-w-7xl mx-auto">
          
          <div className="bg-white rounded-card shadow-sm border border-border overflow-hidden">
            <div className="p-4 border-b border-border flex justify-between items-center bg-gray-50/50">
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search courses..."
                  className="w-full bg-white border border-border rounded-btn py-1.5 pl-9 pr-4 text-sm focus:outline-none focus:border-primary"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={14} />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-[#1F1F1F] min-w-[640px]">
                <thead className="bg-surface text-muted uppercase font-semibold text-xs border-b border-border">
                  <tr>
                    <th className="px-6 py-4">Course</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? (
                    <tr><td colSpan="5" className="p-8 text-center text-muted">Loading...</td></tr>
                  ) : filteredCourses.length === 0 ? (
                    <tr><td colSpan="5" className="p-8 text-center text-muted">No courses found.</td></tr>
                  ) : filteredCourses.map((course) => (
                    <tr key={course.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img src={course.thumbnail} alt="" className="w-16 h-10 object-cover rounded bg-gray-200 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-[#1F1F1F] line-clamp-1">{course.title}</p>
                            <p className="text-xs text-muted">{course.instructor}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">{course.categoryName}</td>
                      <td className="px-6 py-4 font-medium">
                        {course.isFree ? 'Free' : `₹${course.price}`}
                      </td>
                      <td className="px-6 py-4">
                        <Badge label="Published" className="bg-success/10 text-success" />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(course.id)}
                            className="p-1.5 text-muted hover:text-primary transition-colors bg-surface rounded"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
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
          </div>

        </div>
      </main>
    </div>
  );
}