/**
 * pages/AdminEditCourse.jsx
 */
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import AdminSidebar from '../components/admin/AdminSidebar';
import Button from '../components/ui/Button';
import { getCourseById, updateCourse } from '../services/adminService';

export default function AdminEditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: '',
    instructor: '',
    categoryName: '',
    price: '',
    isFree: false,
    thumbnail: '',
    description: '',
  });

  useEffect(() => {
    loadCourse();
  }, [id]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      const data = await getCourseById(id);
      setForm({
        title: data.title || '',
        instructor: data.instructor || '',
        categoryName: data.categoryName || '',
        price: data.price || '',
        isFree: data.isFree || false,
        thumbnail: data.thumbnail || '',
        description: data.description || '',
      });
    } catch (err) {
      setError('Course load nahi ho paaya. Shayad ye course exist nahi karta.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateCourse(id, form);
      navigate('/admin/courses');
    } catch (err) {
      setError('Course update karte waqt error aaya.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex">
        <AdminSidebar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted">Loading course...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex">
      <Helmet>
        <title>Edit Course | Admin</title>
      </Helmet>

      <AdminSidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="bg-white border-b border-border h-16 flex items-center justify-between pl-16 pr-8 lg:px-8 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin/courses')}
              className="p-2 rounded hover:bg-surface text-muted hover:text-primary transition-colors"
              title="Back"
            >
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-xl font-bold text-[#1F1F1F]">Edit Course</h1>
          </div>
          <Button
            variant="primary"
            size="sm"
            className="gap-1"
            onClick={handleSubmit}
            disabled={saving}
          >
            <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        <div className="p-8 max-w-3xl mx-auto">
          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-50 text-red-600 text-sm border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-card shadow-sm border border-border p-6 space-y-5">

            <div>
              <label className="block mb-2 text-sm font-semibold text-[#1F1F1F]">Course Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full p-2 border border-border rounded-md shadow-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-[#1F1F1F]">Instructor</label>
              <input
                type="text"
                name="instructor"
                value={form.instructor}
                onChange={handleChange}
                className="w-full p-2 border border-border rounded-md shadow-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-[#1F1F1F]">Category</label>
              <input
                type="text"
                name="categoryName"
                value={form.categoryName}
                onChange={handleChange}
                className="w-full p-2 border border-border rounded-md shadow-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-[#1F1F1F]">Thumbnail URL</label>
              <input
                type="text"
                name="thumbnail"
                value={form.thumbnail}
                onChange={handleChange}
                className="w-full p-2 border border-border rounded-md shadow-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isFree"
                name="isFree"
                checked={form.isFree}
                onChange={handleChange}
              />
              <label htmlFor="isFree" className="text-sm font-semibold text-[#1F1F1F]">
                This course is Free
              </label>
            </div>

            {!form.isFree && (
              <div>
                <label className="block mb-2 text-sm font-semibold text-[#1F1F1F]">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full p-2 border border-border rounded-md shadow-sm focus:outline-none focus:border-primary"
                />
              </div>
            )}

            <div>
              <label className="block mb-2 text-sm font-semibold text-[#1F1F1F]">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full p-2 border border-border rounded-md shadow-sm h-28 focus:outline-none focus:border-primary"
              ></textarea>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => navigate('/admin/courses')}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" className="gap-1" disabled={saving}>
                <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}