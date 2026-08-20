/**
 * components/InstructorDashboard/InstructorEditCourse.jsx
 *
 * Short/admin-style edit form (matches admin's field set):
 * title, instructor, category, thumbnail, isFree, price, description.
 * Now with validation + full mobile -> desktop responsiveness.
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, X, CheckCircle2 } from 'lucide-react';
import Button from '../ui/Button';
import instructorCourses from '../../data/InstructorCourses';

export default function InstructorEditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const [form, setForm] = useState({
    title: '',
    instructor: '',
    categoryName: '',
    price: '',
    isFree: false,
    thumbnail: '',
    description: '',
  });

  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState(null);

  useEffect(() => {
    loadCourse();
  }, [id]);

  const loadCourse = () => {
    setLoading(true);
    const data = instructorCourses.find(c => String(c.id) === String(id));
    if (!data) {
      setError('Course load nahi ho paaya. Shayad ye course exist nahi karta.');
      setLoading(false);
      return;
    }
    setForm({
      title: data.title || '',
      instructor: data.instructor || '',
      categoryName: data.categoryName || '',
      price: data.price || '',
      isFree: data.isFree || false,
      thumbnail: data.thumbnail || '',
      description: data.description || '',
    });
    setThumbnailPreview(data.thumbnail || '');
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbnailFile(file);
    const previewUrl = URL.createObjectURL(file);
    setThumbnailPreview(previewUrl);
    setForm((prev) => ({ ...prev, thumbnail: previewUrl }));
    setErrors((prev) => ({ ...prev, thumbnail: '' }));
  };

  const removeThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview('');
    setForm((prev) => ({ ...prev, thumbnail: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Course title is required';
    if (!form.instructor.trim()) newErrors.instructor = 'Instructor name is required';
    if (!form.categoryName.trim()) newErrors.categoryName = 'Category is required';
    if (!form.thumbnail) newErrors.thumbnail = 'Thumbnail image is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.isFree) {
      if (form.price === '' || form.price === null || Number(form.price) <= 0) {
        newErrors.price = 'Enter a valid price';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      const firstErrorEl = document.querySelector('[data-error="true"]');
      if (firstErrorEl) firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    try {
      setSaving(true);
      const index = instructorCourses.findIndex(c => String(c.id) === String(id));
      if (index === -1) throw new Error('Course not found');
      instructorCourses[index] = {
        ...instructorCourses[index],
        ...form,
        price: form.isFree ? 0 : Number(form.price),
        status: 'pending', // edit ke baad dobara admin approval ke liye
      };
      navigate('/instructor/courses');
    } catch (err) {
      setError('Course update karte waqt error aaya.');
    } finally {
      setSaving(false);
    }
  };

  const inputCls = (field) =>
    `w-full p-2 border ${errors[field] ? 'border-red-500' : 'border-border'} rounded-md shadow-sm text-sm focus:outline-none focus:border-primary bg-white`;
  const labelCls = 'block mb-1.5 sm:mb-2 text-sm font-semibold text-[#1F1F1F]';
  const errorText = (field) =>
    errors[field] ? (
      <p data-error="true" className="text-xs text-red-500 mt-1">{errors[field]}</p>
    ) : null;

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-12 px-4 text-center">
        <p className="text-muted text-sm sm:text-base">Loading course...</p>
      </div>
    );
  }

  return (
    <div className="w-full px-2 sm:px-4 lg:px-0">
      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 mb-4 px-0.5">
        <div className="flex items-center gap-2 min-w-0">
          <button
            aria-label="back"
            onClick={() => navigate('/instructordashboard')}
            className="p-2 rounded hover:bg-surface text-muted hover:text-primary transition-colors shrink-0"
            title="Back"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-base sm:text-lg lg:text-xl font-bold text-[#1F1F1F] truncate">Edit Course</h1>
        </div>
        <Button
          variant="primary"
          size="sm"
          className="gap-1 shrink-0"
          onClick={handleSubmit}
          disabled={saving}
        >
          <Save size={16} /> <span className="hidden sm:inline">{saving ? 'Saving...' : 'Save Changes'}</span>
          <span className="sm:hidden">{saving ? '...' : 'Save'}</span>
        </Button>
      </div>

      <div className="w-full max-w-full sm:max-w-xl lg:max-w-3xl mx-auto">
        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-50 text-red-600 text-sm border border-red-200">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-white rounded-card shadow-sm border border-border p-3 sm:p-6 lg:p-8 space-y-4 sm:space-y-5 lg:space-y-6"
        >

          <div>
            <label className={labelCls}>Course Title *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className={inputCls('title')}
            />
            {errorText('title')}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className={labelCls}>Instructor *</label>
              <input
                type="text"
                name="instructor"
                value={form.instructor}
                onChange={handleChange}
                className={inputCls('instructor')}
              />
              {errorText('instructor')}
            </div>

            <div>
              <label className={labelCls}>Category *</label>
              <input
                type="text"
                name="categoryName"
                value={form.categoryName}
                onChange={handleChange}
                className={inputCls('categoryName')}
              />
              {errorText('categoryName')}
            </div>
          </div>

          <div>
            <label className={labelCls}>Thumbnail *</label>

            {thumbnailPreview ? (
              <div className="relative w-full sm:w-64 lg:w-72">
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="w-full aspect-video object-cover rounded-md border border-border"
                />
                <button
                  aria-label="close"
                  type="button"
                  onClick={removeThumbnail}
                  className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                  title="Remove"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label
                htmlFor="thumbnail-upload"
                className={`flex flex-col items-center justify-center gap-2 w-full sm:w-64 lg:w-72 aspect-video rounded-md border-2 border-dashed ${errors.thumbnail ? 'border-red-500' : 'border-border'} hover:border-primary hover:bg-primary/5 cursor-pointer transition-colors text-muted text-xs sm:text-sm`}
              >
                Click to upload thumbnail
              </label>
            )}

            <input
              id="thumbnail-upload"
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="hidden"
            />
            {errorText('thumbnail')}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isFree"
              name="isFree"
              checked={form.isFree}
              onChange={handleChange}
              className="accent-primary w-4 h-4"
            />
            <label htmlFor="isFree" className="text-sm font-semibold text-[#1F1F1F]">
              This course is Free
            </label>
          </div>

          {!form.isFree && (
            <div className="sm:w-1/2">
              <label className={labelCls}>Price (₹) *</label>
              <input
                type="number"
                name="price"
                min={0}
                value={form.price}
                onChange={handleChange}
                className={inputCls('price')}
              />
              {errorText('price')}
            </div>
          )}

          <div>
            <label className={labelCls}>Description *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              className={`${inputCls('description')} h-28 sm:h-32 lg:h-36 resize-y`}
            />
            {errorText('description')}
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="w-full sm:w-auto"
              onClick={() => navigate('/instructor/courses')}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" className="gap-1 w-full sm:w-auto" disabled={saving}>
              <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}