/**
 * pages/AdminCategories.jsx
 * Admin - Categories management (frontend/local state only)
 */
import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Tag, BookOpen, Upload, Link2, Trash2 } from 'lucide-react';
import AdminSidebar from '../components/admin/AdminSidebar';
import Modal from '../components/ui/Modal';
import categoriesData from '../data/categories';
import coursesData from '../data/courses';

function buildInitialCategories() {
  return categoriesData.map((cat) => ({
    ...cat,
    courseCount: coursesData.filter((c) => c.category === cat.slug).length,
  }));
}

const PRESET_COLORS = [
  '#0056D2', '#7C3AED', '#DB2777', '#00822B',
  '#EA580C', '#0891B2', '#65A30D', '#DC2626',
  '#9333EA', '#0D9488', '#B45309', '#1D4ED8',
];

function CategoryModal({ isOpen, onClose, onSubmit }) {
  const fileRef = useRef(null);
  const [form, setForm] = useState({
    name: '', iconMode: 'url', iconUrl: '', iconFile: null, iconPreview: '', color: '#0056D2',
  });

  useEffect(() => {
    if (isOpen) {
      setForm({ name: '', iconMode: 'url', iconUrl: '', iconFile: null, iconPreview: '', color: '#0056D2' });
    }
  }, [isOpen]);

  function handleIconFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setForm((f) => ({ ...f, iconFile: file, iconPreview: preview, iconUrl: '' }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    const iconSrc = form.iconMode === 'upload' ? form.iconPreview : form.iconUrl;
    onSubmit({ name: form.name.trim(), iconUrl: iconSrc, color: form.color });
    onClose();
  }

  const urlBtn = form.iconMode === 'url'
    ? 'flex items-center gap-1.5 px-3 py-1.5 rounded-btn text-xs font-medium border bg-primary text-white border-primary'
    : 'flex items-center gap-1.5 px-3 py-1.5 rounded-btn text-xs font-medium border bg-white text-[#1F1F1F] border-border hover:border-primary transition-colors';
  const uploadBtn = form.iconMode === 'upload'
    ? 'flex items-center gap-1.5 px-3 py-1.5 rounded-btn text-xs font-medium border bg-primary text-white border-primary'
    : 'flex items-center gap-1.5 px-3 py-1.5 rounded-btn text-xs font-medium border bg-white text-[#1F1F1F] border-border hover:border-primary transition-colors';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Category" size="md">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-[#1F1F1F] mb-1.5">
            Category Name <span className="text-red-500">*</span>
          </label>
          <input
            id="cat-name"
            type="text"
            required
            placeholder="e.g. Data Science"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full border border-border rounded-btn px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#1F1F1F] mb-1.5">Icon</label>
          <div className="flex flex-wrap gap-2 mb-3">
            <button type="button" id="icon-mode-url" onClick={() => setForm((f) => ({ ...f, iconMode: 'url' }))} className={urlBtn}>
              <Link2 size={13} /> URL
            </button>
            <button type="button" id="icon-mode-upload" onClick={() => setForm((f) => ({ ...f, iconMode: 'upload' }))} className={uploadBtn}>
              <Upload size={13} /> Upload PNG/SVG
            </button>
          </div>
          {form.iconMode === 'url' ? (
            <input
              id="cat-icon-url"
              type="url"
              placeholder="https://example.com/icon.svg"
              value={form.iconUrl}
              onChange={(e) => setForm((f) => ({ ...f, iconUrl: e.target.value, iconPreview: '' }))}
              className="w-full border border-border rounded-btn px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
            />
          ) : (
            <div
              id="cat-icon-upload-zone"
              onClick={() => fileRef.current && fileRef.current.click()}
              className="border-2 border-dashed border-border rounded-btn p-4 sm:p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors group"
            >
              {form.iconPreview ? (
                <img src={form.iconPreview} alt="preview" className="w-12 h-12 object-contain mb-2" />
              ) : (
                <Upload size={28} className="text-muted mb-2 group-hover:text-primary transition-colors" />
              )}
              <span className="text-xs text-muted group-hover:text-primary transition-colors text-center px-2">
                {form.iconPreview ? 'Click to change' : 'Click to upload PNG or SVG'}
              </span>
              <input ref={fileRef} type="file" accept="image/png,image/svg+xml" className="hidden" onChange={handleIconFile} />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#1F1F1F] mb-2">Brand Color</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {PRESET_COLORS.map((c) => (
              <button
                key={c} type="button" title={c}
                onClick={() => setForm((f) => ({ ...f, color: c }))}
                className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 flex-shrink-0"
                style={{
                  backgroundColor: c,
                  borderColor: form.color === c ? '#1F1F1F' : 'transparent',
                  boxShadow: form.color === c ? '0 0 0 2px #fff, 0 0 0 4px #1F1F1F' : 'none',
                }}
              />
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <input id="cat-color-picker" type="color" value={form.color}
              onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
              className="w-10 h-10 rounded-lg cursor-pointer border border-border p-0.5 flex-shrink-0" />
            <span className="text-sm font-mono text-muted">{form.color.toUpperCase()}</span>
            <span className="text-xs text-muted">or pick custom</span>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2 border-t border-border">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-btn text-sm font-medium border border-border hover:bg-surface transition-colors">Cancel</button>
          <button type="submit" id="cat-modal-submit" className="btn-primary text-sm">Add Category</button>
        </div>
      </form>
    </Modal>
  );
}

function CategoryRow({ cat, onDelete }) {
  return (
    <div className="flex items-center gap-3 sm:gap-4 bg-white border border-border rounded-card px-3 sm:px-5 py-3 sm:py-4 shadow-sm hover:shadow-md transition-shadow group animate-fadeIn">
      <div className="w-1 h-10 sm:h-12 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
      <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: cat.color + '1A' }}>
        {cat.iconUrl ? (
          <img src={cat.iconUrl} alt={cat.name} className="w-5 h-5 sm:w-6 sm:h-6 object-contain" />
        ) : (
          <Tag size={18} className="sm:hidden" style={{ color: cat.color }} />
        )}
        {!cat.iconUrl && <Tag size={20} className="hidden sm:block" style={{ color: cat.color }} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[#1F1F1F] text-sm truncate">{cat.name}</p>
        <p className="text-xs text-muted mt-0.5 flex items-center gap-1">
          <BookOpen size={11} />
          {cat.courseCount} {cat.courseCount === 1 ? 'course' : 'courses'}
        </p>
      </div>
      <div className="hidden sm:flex items-center gap-1.5">
        <span className="inline-block w-4 h-4 rounded-full border border-white shadow-sm" style={{ backgroundColor: cat.color }} />
        <span className="text-xs font-mono text-muted">{cat.color.toUpperCase()}</span>
      </div>
      <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        <button onClick={() => onDelete(cat.id)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

export default function AdminCategories() {
  const [categories, setCategories] = useState(buildInitialCategories);
  const [modalOpen, setModalOpen] = useState(false);

  function handleAddCategory({ name, iconUrl, color }) {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setCategories((prev) => [
      { id: Date.now(), slug, name, iconUrl: iconUrl || '', color, courseCount: 0 },
      ...prev,
    ]);
  }

  function handleDelete(id) {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className="min-h-screen bg-surface flex">
      <Helmet><title>Categories | LearnGrow Admin</title></Helmet>
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto min-w-0">
        <div className="bg-white border-b border-border min-h-16 flex flex-wrap items-center gap-3 pl-16 pr-4 py-3 sm:pr-8 lg:px-8 shadow-sm">
          <h1 className="text-lg sm:text-xl font-bold text-[#1F1F1F] flex-1">Categories</h1>
          <button id="add-category-btn" onClick={() => setModalOpen(true)} className="btn-primary flex items-center gap-2 text-sm whitespace-nowrap">
            <Plus size={16} /> <span className="hidden xs:inline">Add Category</span><span className="xs:hidden">Add</span>
          </button>
        </div>
        <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-2 text-sm text-muted flex-wrap">
            <Tag size={15} />
            <span>
              <strong className="text-[#1F1F1F]">{categories.length}</strong>{' '}
              {categories.length === 1 ? 'category' : 'categories'}{' '}
              <strong className="text-[#1F1F1F]">{categories.reduce((sum, c) => sum + c.courseCount, 0)}</strong>{' '}
              total courses
            </span>
          </div>
          {categories.length === 0 ? (
            <div className="bg-white border border-dashed border-border rounded-card p-8 sm:p-14 flex flex-col items-center justify-center text-center">
              <Tag size={40} className="text-muted mb-4" />
              <p className="text-[#1F1F1F] font-semibold mb-1">No categories yet</p>
              <p className="text-muted text-sm mb-5">Click Add Category to get started.</p>
              <button onClick={() => setModalOpen(true)} className="btn-primary flex items-center gap-2 text-sm"><Plus size={15} /> Add Category</button>
            </div>
          ) : (
            <div className="space-y-3">
              {categories.map((cat) => (
                <CategoryRow key={cat.id} cat={cat} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      </main>
      <CategoryModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleAddCategory} />
    </div>
  );
}