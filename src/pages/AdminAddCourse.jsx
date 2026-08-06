/**
 * pages/AdminAddCourse.jsx
 */
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft, X, Info, Upload, Film } from 'lucide-react';
import AdminSidebar from '../components/admin/AdminSidebar';
import Button from '../components/ui/Button';
import { getDynamicCategories } from '../services/courseService';
import { addCourse } from '../services/adminService';

export default function AdminAddCourse() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Form State — matches all fields consumed by CourseDetail.jsx
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    description: '',
    category: '',
    badge: '',
    price: '',
    originalPrice: '',
    isFree: false,
    thumbnail: '',
    demoVideo: '',
    duration: '',
    level: '',
    language: '',
    lifetimeAccess: true,
    certificate: false,
    mobileAccess: true,
    whatYouLearn: [''],
    curriculum: [{ section: 'Section 1', lessons: [] }],
    instructorName: '',
    instructorTitle: '',
    instructorBio: '',
  });

  // Local file objects + preview URLs for thumbnail/video (frontend-only for now;
  // once backend is ready these files get sent via FormData in handleSubmit,
  // and formData.thumbnail / formData.demoVideo get set to the URL the server returns)
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [demoVideoFile, setDemoVideoFile] = useState(null);
  const [demoVideoPreview, setDemoVideoPreview] = useState('');

  // ─── Generic field handler ───────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // ─── Thumbnail file handler ──────────────────────────────────────────────
  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbnailFile(file);
    const previewUrl = URL.createObjectURL(file);
    setThumbnailPreview(previewUrl);
    // Store locally for now; backend will replace this with the uploaded file's real URL
    setFormData(prev => ({ ...prev, thumbnail: previewUrl }));
  };

  const removeThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview('');
    setFormData(prev => ({ ...prev, thumbnail: '' }));
  };

  // ─── Demo video file handler ─────────────────────────────────────────────
  const handleDemoVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDemoVideoFile(file);
    const previewUrl = URL.createObjectURL(file);
    setDemoVideoPreview(previewUrl);
    // Store locally for now; backend will replace this with the uploaded file's real URL
    setFormData(prev => ({ ...prev, demoVideo: previewUrl }));
  };

  const removeDemoVideo = () => {
    setDemoVideoFile(null);
    setDemoVideoPreview('');
    setFormData(prev => ({ ...prev, demoVideo: '' }));
  };

  // ─── What You'll Learn handlers ──────────────────────────────────────────
  const addLearnItem = () =>
    setFormData(prev => ({ ...prev, whatYouLearn: [...prev.whatYouLearn, ''] }));

  const updateLearnItem = (index, value) => {
    const updated = [...formData.whatYouLearn];
    updated[index] = value;
    setFormData(prev => ({ ...prev, whatYouLearn: updated }));
  };

  const removeLearnItem = (index) => {
    const updated = formData.whatYouLearn.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, whatYouLearn: updated.length ? updated : [''] }));
  };

  // ─── Curriculum handlers ─────────────────────────────────────────────────
  const addSection = () => {
    setFormData(prev => ({
      ...prev,
      curriculum: [
        ...prev.curriculum,
        { section: `Section ${prev.curriculum.length + 1}`, lessons: [] },
      ],
    }));
  };

  const removeSection = (sIndex) => {
    setFormData(prev => ({
      ...prev,
      curriculum: prev.curriculum.filter((_, i) => i !== sIndex),
    }));
  };

  const updateSectionTitle = (index, value) => {
    const updated = [...formData.curriculum];
    updated[index].section = value;
    setFormData({ ...formData, curriculum: updated });
  };

  const addLesson = (sectionIndex) => {
    const updated = [...formData.curriculum];
    updated[sectionIndex].lessons.push({
      id: Date.now().toString(),
      title: '',
      videoUrl: '',
      duration: '',
      type: 'video',
      isLive: false,
      completed: false,
    });
    setFormData({ ...formData, curriculum: updated });
  };

  const updateLesson = (sIndex, lIndex, field, value) => {
    const updated = [...formData.curriculum];
    updated[sIndex].lessons[lIndex][field] = value;
    // Keep 'type' in sync with isLive
    if (field === 'isLive') updated[sIndex].lessons[lIndex].type = value ? 'live' : 'video';
    setFormData({ ...formData, curriculum: updated });
  };

  // Lesson video file upload — mirrors thumbnail/demo-video pattern.
  // Stores the File + a local preview URL directly on the lesson object
  // (videoFile / videoUrl) so no separate parallel state is needed.
  // Once backend is ready: send lesson.videoFile via FormData on submit
  // and replace lesson.videoUrl with the server-returned URL.
  const handleLessonVideoChange = (sIndex, lIndex, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    const updated = [...formData.curriculum];
    updated[sIndex].lessons[lIndex].videoFile = file;
    updated[sIndex].lessons[lIndex].videoUrl = previewUrl;
    setFormData({ ...formData, curriculum: updated });
  };

  const removeLessonVideo = (sIndex, lIndex) => {
    const updated = [...formData.curriculum];
    updated[sIndex].lessons[lIndex].videoFile = null;
    updated[sIndex].lessons[lIndex].videoUrl = '';
    setFormData({ ...formData, curriculum: updated });
  };

  const removeLesson = (sIndex, lIndex) => {
    const updated = [...formData.curriculum];
    updated[sIndex].lessons = updated[sIndex].lessons.filter((_, i) => i !== lIndex);
    setFormData({ ...formData, curriculum: updated });
  };

  // ─── Derived: discount % ─────────────────────────────────────────────────
  const discountPercent = (() => {
    const p = Number(formData.price);
    const op = Number(formData.originalPrice);
    if (!formData.isFree && op > 0 && p >= 0 && op > p) {
      return Math.round(((op - p) / op) * 100);
    }
    return null;
  })();

  // ─── Submit ──────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const categories = getDynamicCategories();
      const catObj = categories.find(
        c => c.slug === formData.category ||
          c.name.toLowerCase() === formData.category.toLowerCase()
      );
      const finalCategorySlug = catObj
        ? catObj.slug
        : formData.category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const finalCategoryName = catObj ? catObj.name : formData.category;

      // Clean up whatYouLearn — remove blank entries
      const cleanWhatYouLearn = formData.whatYouLearn.filter(item => item.trim() !== '');

      // NOTE: Once the backend is ready, replace this with a FormData submission
      // (thumbnailFile / demoVideoFile appended as files) so the server can upload
      // them to storage and return real URLs to save in place of formData.thumbnail
      // / formData.demoVideo below.
      await addCourse({
        ...formData,
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: finalCategorySlug,
        categoryName: finalCategoryName,
        instructor: formData.instructorName || 'Admin User',
        instructorId: null,
        instructorTitle: formData.instructorTitle,
        instructorBio: formData.instructorBio,
        price: formData.isFree ? 0 : Number(formData.price),
        originalPrice: Number(formData.originalPrice) || Number(formData.price) || 0,
        whatYouLearn: cleanWhatYouLearn,
        rating: 0,
        reviewCount: 0,
        studentsEnrolled: 0,
        reviews: [],
        lastUpdated: new Date().toISOString().split('T')[0],
        liveClasses: formData.curriculum.some(s => s.lessons.some(l => l.isLive)),
      });

      navigate('/admin/courses');
    } catch (err) {
      alert('Error adding course');
      setLoading(false);
    }
  };

  // ─── Shared input class ──────────────────────────────────────────────────
  const inputCls =
    'w-full border border-border rounded-btn px-3 py-2 text-sm focus:border-primary focus:outline-none bg-white';
  const labelCls = 'block text-sm font-medium text-[#1F1F1F] mb-1';
  const sectionCardCls = 'bg-white p-6 rounded-card shadow-sm border border-border space-y-4';
  const sectionHeadingCls =
    'text-lg font-bold text-[#1F1F1F] border-b border-border pb-2';

  return (
    <div className="min-h-screen bg-surface flex">
      <Helmet><title>Add New Course | Admin</title></Helmet>
      <AdminSidebar />

      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <div className="bg-white border-b border-border h-16 flex items-center pl-16 pr-8 lg:px-8 shadow-sm">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 text-muted hover:text-[#1F1F1F]"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-[#1F1F1F]">Add New Course</h1>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-8">

          {/* ── 1. Basic Information ─────────────────────────────────────── */}
          <div className={sectionCardCls}>
            <h2 className={sectionHeadingCls}>Basic Information</h2>

            {/* Course Title */}
            <div>
              <label className={labelCls}>Course Title *</label>
              <input
                required
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. React JS — The Complete Guide"
                className={inputCls}
              />
            </div>

            {/* Category + Badge */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Category *</label>
                <input
                  required
                  type="text"
                  name="category"
                  list="category-list"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Select or type new category..."
                  className={inputCls}
                />
                <datalist id="category-list">
                  {getDynamicCategories().map(c => (
                    <option key={c.slug} value={c.slug}>{c.name}</option>
                  ))}
                </datalist>
              </div>

              <div>
                <label className={labelCls}>Badge</label>
                <select
                  name="badge"
                  value={formData.badge}
                  onChange={handleChange}
                  className={inputCls}
                >
                  <option value="">None</option>
                  <option value="Bestseller">Bestseller</option>
                  <option value="New">New</option>
                  <option value="Trending">Trending</option>
                </select>
              </div>
            </div>

            {/* Short Description */}
            <div>
              <label className={labelCls}>Short Description *</label>
              <textarea
                required
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                rows={2}
                placeholder="A brief one-liner shown on course cards and the header section..."
                className={inputCls}
              />
            </div>
          </div>

          {/* ── 2. Media ─────────────────────────────────────────────────── */}
          <div className={sectionCardCls}>
            <h2 className={sectionHeadingCls}>Media</h2>

            {/* Thumbnail upload */}
            <div>
              <label className={labelCls}>Thumbnail Image</label>

              {thumbnailPreview ? (
                <div className="relative w-full sm:w-72">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="w-full aspect-video object-cover rounded-lg border border-border"
                  />
                  <button
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
                  className="flex flex-col items-center justify-center gap-2 w-full sm:w-72 aspect-video rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 cursor-pointer transition-colors text-muted"
                >
                  <Upload size={22} />
                  <span className="text-xs font-medium">Click to upload thumbnail</span>
                  <span className="text-[11px] text-muted">JPG, PNG — recommended 16:9</span>
                </label>
              )}

              <input
                id="thumbnail-upload"
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="hidden"
              />

              {/* Helper note */}
              <p className="mt-2 flex items-start gap-1.5 text-xs text-muted leading-relaxed">
                <Info size={13} className="flex-shrink-0 mt-0.5 text-primary" />
                Upload a thumbnail image directly from your device. This will be shown on course cards and the course header.
              </p>
            </div>

            {/* Demo video upload */}
            <div>
              <label className={labelCls}>Demo Video</label>

              {demoVideoPreview ? (
                <div className="relative w-full sm:w-72">
                  <video
                    src={demoVideoPreview}
                    controls
                    className="w-full aspect-video object-cover rounded-lg border border-border bg-black"
                  />
                  <button
                    type="button"
                    onClick={removeDemoVideo}
                    className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                    title="Remove"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="demo-video-upload"
                  className="flex flex-col items-center justify-center gap-2 w-full sm:w-72 aspect-video rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 cursor-pointer transition-colors text-muted"
                >
                  <Film size={22} />
                  <span className="text-xs font-medium">Click to upload demo video</span>
                  <span className="text-[11px] text-muted">MP4 recommended</span>
                </label>
              )}

              <input
                id="demo-video-upload"
                type="file"
                accept="video/*"
                onChange={handleDemoVideoChange}
                className="hidden"
              />

              {demoVideoFile && (
                <p className="mt-1.5 text-xs text-muted">{demoVideoFile.name}</p>
              )}
            </div>
          </div>

          {/* ── 3. What You'll Learn ─────────────────────────────────────── */}
          <div className={sectionCardCls}>
            <div className="flex justify-between items-center border-b border-border pb-2">
              <h2 className="text-lg font-bold text-[#1F1F1F]">What You'll Learn</h2>
              <Button variant="outline" size="sm" type="button" onClick={addLearnItem}>
                <Plus size={14} /> Add Point
              </Button>
            </div>

            <p className="text-xs text-muted -mt-2">
              Add bullet points that will appear in the "What you'll learn" section of the course page.
            </p>

            <div className="space-y-2">
              {formData.whatYouLearn.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-success font-bold text-sm flex-shrink-0">✓</span>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateLearnItem(index, e.target.value)}
                    placeholder={`Learning point ${index + 1}...`}
                    className="flex-1 border border-border rounded-btn px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeLearnItem(index)}
                    className="text-muted hover:text-red-500 transition-colors p-1 flex-shrink-0"
                    title="Remove"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ── 4. Course Details ─────────────────────────────────────────── */}
          <div className={sectionCardCls}>
            <h2 className={sectionHeadingCls}>Course Details</h2>

            {/* Full Description */}
            <div>
              <label className={labelCls}>Full Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder="Detailed description of the course — what it covers, who it's for, what students will build..."
                className={inputCls}
              />
            </div>

            {/* Duration + Level + Language */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Total Duration</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g. 42 hours"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Level</label>
                <select name="level" value={formData.level} onChange={handleChange} className={inputCls}>
                  <option value="">Select level...</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Beginner to Intermediate">Beginner to Intermediate</option>
                  <option value="Beginner to Advanced">Beginner to Advanced</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Language</label>
                <input
                  type="text"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  placeholder="e.g. English"
                  className={inputCls}
                />
              </div>
            </div>
          </div>

          {/* ── 5. Curriculum ────────────────────────────────────────────── */}
          <div className={sectionCardCls}>
            <div className="flex justify-between items-center border-b border-border pb-2">
              <h2 className="text-lg font-bold text-[#1F1F1F]">Curriculum</h2>
              <Button variant="outline" size="sm" type="button" onClick={addSection}>
                <Plus size={16} /> Add Section
              </Button>
            </div>

            {formData.curriculum.map((section, sIndex) => (
              <div key={sIndex} className="border border-border rounded-lg bg-surface p-4 mb-4">
                {/* Section title row */}
                <div className="flex gap-2 mb-4 items-center">
                  <input
                    type="text"
                    value={section.section}
                    onChange={(e) => updateSectionTitle(sIndex, e.target.value)}
                    className="font-bold bg-transparent border-b border-gray-300 focus:border-primary focus:outline-none px-1 flex-1 text-[#1F1F1F]"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    type="button"
                    onClick={() => addLesson(sIndex)}
                  >
                    <Plus size={14} /> Lesson
                  </Button>
                  {formData.curriculum.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSection(sIndex)}
                      className="text-muted hover:text-red-500 transition-colors p-1"
                      title="Remove section"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                {/* Lessons */}
                <div className="space-y-2 pl-2">
                  {section.lessons.map((lesson, lIndex) => (
                    <div
                      key={lesson.id}
                      className="bg-white border border-border p-3 rounded flex flex-col sm:flex-row gap-2 items-start sm:items-center"
                    >
                      {/* Lesson Title */}
                      <input
                        type="text"
                        placeholder="Lesson Title"
                        value={lesson.title}
                        onChange={(e) => updateLesson(sIndex, lIndex, 'title', e.target.value)}
                        className="flex-[2] border border-border rounded px-2 py-1.5 text-sm w-full min-w-0"
                      />
                      {/* Lesson Video Upload */}
                      <div className="flex-[2] w-full min-w-0">
                        {lesson.videoUrl ? (
                          <div className="flex items-center gap-2 border border-border rounded px-2 py-1.5 text-sm bg-surface">
                            <Film size={14} className="text-primary flex-shrink-0" />
                            <span className="truncate flex-1 text-xs text-[#1F1F1F]">
                              {lesson.videoFile ? lesson.videoFile.name : 'Video attached'}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeLessonVideo(sIndex, lIndex)}
                              className="text-muted hover:text-red-500 transition-colors flex-shrink-0"
                              title="Remove video"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <label
                            htmlFor={`lesson-video-${sIndex}-${lIndex}`}
                            className="flex items-center justify-center gap-1.5 border border-dashed border-border rounded px-2 py-1.5 text-xs text-muted hover:border-primary hover:bg-primary/5 cursor-pointer transition-colors w-full"
                          >
                            <Upload size={13} />
                            Upload video
                          </label>
                        )}
                        <input
                          id={`lesson-video-${sIndex}-${lIndex}`}
                          type="file"
                          accept="video/*"
                          onChange={(e) => handleLessonVideoChange(sIndex, lIndex, e)}
                          className="hidden"
                        />
                      </div>
                      {/* Duration */}
                      <input
                        type="text"
                        placeholder="mm:ss"
                        value={lesson.duration}
                        onChange={(e) => updateLesson(sIndex, lIndex, 'duration', e.target.value)}
                        className="w-20 flex-shrink-0 border border-border rounded px-2 py-1.5 text-sm text-center"
                      />
                      {/* Live toggle */}
                      <label className="flex items-center gap-1 text-xs font-medium whitespace-nowrap flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={lesson.isLive}
                          onChange={(e) => updateLesson(sIndex, lIndex, 'isLive', e.target.checked)}
                          className="accent-primary"
                        />
                        Live
                      </label>
                      {/* Remove lesson */}
                      <button
                        type="button"
                        onClick={() => removeLesson(sIndex, lIndex)}
                        className="text-muted hover:text-red-500 transition-colors p-1 flex-shrink-0"
                        title="Remove lesson"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ))}
                  {section.lessons.length === 0 && (
                    <p className="text-xs text-muted py-1">No lessons yet — click &ldquo;Lesson&rdquo; to add.</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* ── 6. Instructor Details ─────────────────────────────────────── */}
          <div className={sectionCardCls}>
            <h2 className={sectionHeadingCls}>Instructor Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Instructor Name *</label>
                <input
                  required
                  type="text"
                  name="instructorName"
                  value={formData.instructorName}
                  onChange={handleChange}
                  placeholder="e.g. Priya Sharma"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Instructor Title</label>
                <input
                  type="text"
                  name="instructorTitle"
                  value={formData.instructorTitle}
                  onChange={handleChange}
                  placeholder="e.g. Digital Marketing Expert & Growth Strategist"
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <label className={labelCls}>Instructor Bio</label>
              <textarea
                name="instructorBio"
                value={formData.instructorBio}
                onChange={handleChange}
                rows={3}
                placeholder="Brief biography of the instructor — experience, achievements, expertise..."
                className={inputCls}
              />
            </div>
          </div>

          {/* ── 7. Pricing & Access ───────────────────────────────────────── */}
          <div className={sectionCardCls}>
            <h2 className={sectionHeadingCls}>Pricing & Access</h2>

            {/* isFree toggle */}
            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
              <input
                type="checkbox"
                name="isFree"
                checked={formData.isFree}
                onChange={handleChange}
                className="accent-primary w-4 h-4"
              />
              Mark this course as <span className="text-success font-semibold">Free</span>
            </label>

            {/* Price + Original Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Discounted Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  disabled={formData.isFree}
                  min={0}
                  placeholder="e.g. 2999"
                  className={`${inputCls} disabled:bg-gray-100 disabled:cursor-not-allowed`}
                />
              </div>
              <div>
                <label className={labelCls}>Original Price (₹)</label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  disabled={formData.isFree}
                  min={0}
                  placeholder="e.g. 7999"
                  className={`${inputCls} disabled:bg-gray-100 disabled:cursor-not-allowed`}
                />
              </div>
            </div>

            {/* Auto discount display */}
            {discountPercent !== null && (
              <p className="text-sm font-semibold text-success flex items-center gap-1">
                🎉 {discountPercent}% off — Students save ₹{(Number(formData.originalPrice) - Number(formData.price)).toLocaleString()}
              </p>
            )}

            {/* Access checkboxes */}
            <div>
              <p className={`${labelCls} mb-2`}>This course includes:</p>
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    name="lifetimeAccess"
                    checked={formData.lifetimeAccess}
                    onChange={handleChange}
                    className="accent-primary w-4 h-4"
                  />
                  Lifetime Access
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    name="certificate"
                    checked={formData.certificate}
                    onChange={handleChange}
                    className="accent-primary w-4 h-4"
                  />
                  Certificate of Completion
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    name="mobileAccess"
                    checked={formData.mobileAccess}
                    onChange={handleChange}
                    className="accent-primary w-4 h-4"
                  />
                  Mobile &amp; TV Access
                </label>
              </div>
            </div>
          </div>

          {/* ── Submit Actions ────────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 pb-12">
            <Button variant="outline" type="button" onClick={() => navigate('/admin/courses')}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={loading}>
              Save Course
            </Button>
          </div>

        </form>
      </main>
    </div>
  );
}