import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Radio, Video, Edit2, Trash2, CalendarClock, Link, User, BookOpen, Clock, Calendar } from 'lucide-react';
import AdminSidebar from '../components/admin/AdminSidebar';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { getAdminLiveClasses } from '../services/adminService';
import { useNavigate } from 'react-router-dom';

const EMPTY_FORM = {
  title: '',
  category: '',
  instructor: '',
  date: '',
  time: '',
  zoomLink: '',
};

export default function AdminLiveClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getAdminLiveClasses().then(data => {
      const saved = localStorage.getItem('liveClasses');
      const finalData = saved ? JSON.parse(saved) : data;
      setClasses(finalData);
      if (!saved) localStorage.setItem('liveClasses', JSON.stringify(data));
      setLoading(false);
    });
  }, []);

  const openModal = () => {
    setForm(EMPTY_FORM);
    setFormError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormError('');
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { title, category, instructor, date, time } = form;
    if (!title.trim() || !category.trim() || !instructor.trim() || !date || !time.trim()) {
      setFormError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);

    // Format time for display e.g. "7:30 PM IST"
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayHour = h % 12 === 0 ? 12 : h % 12;
    const displayTime = `${displayHour}:${minutes} ${ampm} IST`;

    const newSession = {
      id: Date.now(),
      title: title.trim(),
      category: category.trim(),
      instructor: instructor.trim(),
      date,
      time: displayTime,
      zoomLink: form.zoomLink.trim() || '#',
      status: 'upcoming',
      isActive: false,
    };

    setTimeout(() => {
      setClasses(prev => {
        const updated = [newSession, ...prev];
        localStorage.setItem('liveClasses', JSON.stringify(updated));
        return updated;
      });
      setSubmitting(false);
      closeModal();
    }, 500);
  };

  const handleEdit = (id) => {
      navigate(`/admin/live-classes/edit/${id}`);
  }

  return (
    <div className="min-h-screen bg-surface flex">
      <Helmet><title>Live Classes | Admin</title></Helmet>
      <AdminSidebar />

      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="bg-white border-b border-border h-16 flex items-center justify-between pl-16 pr-8 lg:px-8 shadow-sm">
          <h1 className="text-xl font-bold text-[#1F1F1F]">Schedule Live Classes</h1>
          <Button
            id="schedule-session-btn"
            variant="primary"
            size="sm"
            className="gap-1"
            onClick={openModal}
          >
            <Plus size={16} /> Schedule Session
          </Button>
        </div>

        {/* Table */}
        <div className="p-8 max-w-7xl mx-auto">
          <div className="bg-white rounded-card shadow-sm border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-[#1F1F1F]">
                <thead className="bg-surface text-muted uppercase font-semibold text-xs border-b border-border">
                  <tr>
                    <th className="px-6 py-4">Session Title</th>
                    <th className="px-6 py-4">Course / Category</th>
                    <th className="px-6 py-4">Date &amp; Time</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? (
                    <tr><td colSpan="5" className="p-8 text-center text-muted">Loading...</td></tr>
                  ) : classes.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-12 text-center text-muted">
                        <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'8px'}}>
                          <span style={{fontSize:'2.5rem'}}>??</span>
                          <p className="font-medium">No sessions scheduled yet.</p>
                          <p className="text-xs mt-1">Click "Schedule Session" to add one.</p>
                        </div>
                      </td>
                    </tr>
                  ) : classes.map((lc) => (
                    <tr key={lc.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold">{lc.title}</div>
                        <div className="text-xs text-muted mt-1 flex items-center gap-1">
                          {lc.isActive ? <Radio size={12} className="text-red-500"/> : <Video size={12}/>}
                          {lc.zoomLink && lc.zoomLink !== '#'
                            ? <a href={lc.zoomLink}  rel="noopener noreferrer" className="hover:text-primary underline">Zoom Link</a>
                            : <span>Zoom Link</span>
                          }
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-sm">{lc.category}</div>
                        <div className="text-xs text-muted">Inst: {lc.instructor}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{lc.date}</div>
                        <div className="text-xs text-muted">{lc.time}</div>
                      </td>
                      <td className="px-6 py-4">
                        {lc.isActive
                          ? <Badge label="Live Now" className="bg-red-100 text-red-700" />
                          : <Badge label="Scheduled" className="bg-blue-100 text-primary" />
                        }
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {!lc.isActive && (
                            <button onClick={() => handleEdit(lc.id)} className="p-1.5 text-muted hover:text-primary transition-colors bg-surface rounded" title="Edit"><Edit2 size={16} /></button>
                          )}
                          <button
                            className="p-1.5 text-muted hover:text-red-600 transition-colors bg-surface rounded"
                            title="Delete"
                            onClick={() => setClasses(prev => {
                              const updated = prev.filter(c => c.id !== lc.id);
                              localStorage.setItem('liveClasses', JSON.stringify(updated));
                              return updated;
                            })}
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

      {/* -- Schedule Session Modal -- */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title="Schedule New Session"
        size="md"
      >
        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'18px'}}>

          {/* Session Title */}
          <div>
            <label htmlFor="session-title" style={{display:'block',fontSize:'0.8rem',fontWeight:600,marginBottom:'6px',color:'#1F1F1F'}}>
              Session Title <span style={{color:'#ef4444'}}>*</span>
            </label>
            <input
              id="session-title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Digital Marketing - Q&A Live"
              style={{width:'100%',padding:'10px 14px',border:'1px solid #e2e8f0',borderRadius:'8px',fontSize:'0.875rem',outline:'none',boxSizing:'border-box'}}
              onFocus={e => e.target.style.borderColor='#5c6bc0'}
              onBlur={e => e.target.style.borderColor='#e2e8f0'}
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="session-category" style={{display:'block',fontSize:'0.8rem',fontWeight:600,marginBottom:'6px',color:'#1F1F1F'}}>
              Category / Course <span style={{color:'#ef4444'}}>*</span>
            </label>
            <input
              id="session-category"
              name="category"
              type="text"
              value={form.category}
              onChange={handleChange}
              placeholder="e.g. Digital Marketing"
              style={{width:'100%',padding:'10px 14px',border:'1px solid #e2e8f0',borderRadius:'8px',fontSize:'0.875rem',outline:'none',boxSizing:'border-box'}}
              onFocus={e => e.target.style.borderColor='#5c6bc0'}
              onBlur={e => e.target.style.borderColor='#e2e8f0'}
            />
          </div>

          {/* Instructor */}
          <div>
            <label htmlFor="session-instructor" style={{display:'block',fontSize:'0.8rem',fontWeight:600,marginBottom:'6px',color:'#1F1F1F'}}>
              Instructor Name <span style={{color:'#ef4444'}}>*</span>
            </label>
            <input
              id="session-instructor"
              name="instructor"
              type="text"
              value={form.instructor}
              onChange={handleChange}
              placeholder="e.g. Priya Sharma"
              style={{width:'100%',padding:'10px 14px',border:'1px solid #e2e8f0',borderRadius:'8px',fontSize:'0.875rem',outline:'none',boxSizing:'border-box'}}
              onFocus={e => e.target.style.borderColor='#5c6bc0'}
              onBlur={e => e.target.style.borderColor='#e2e8f0'}
            />
          </div>

          {/* Date & Time */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>
            <div>
              <label htmlFor="session-date" style={{display:'block',fontSize:'0.8rem',fontWeight:600,marginBottom:'6px',color:'#1F1F1F'}}>
                Date <span style={{color:'#ef4444'}}>*</span>
              </label>
              <input
                id="session-date"
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                style={{width:'100%',padding:'10px 14px',border:'1px solid #e2e8f0',borderRadius:'8px',fontSize:'0.875rem',outline:'none',boxSizing:'border-box'}}
                onFocus={e => e.target.style.borderColor='#5c6bc0'}
                onBlur={e => e.target.style.borderColor='#e2e8f0'}
              />
            </div>
            <div>
              <label htmlFor="session-time" style={{display:'block',fontSize:'0.8rem',fontWeight:600,marginBottom:'6px',color:'#1F1F1F'}}>
                Time <span style={{color:'#ef4444'}}>*</span>
              </label>
              <input
                id="session-time"
                name="time"
                type="time"
                value={form.time}
                onChange={handleChange}
                style={{width:'100%',padding:'10px 14px',border:'1px solid #e2e8f0',borderRadius:'8px',fontSize:'0.875rem',outline:'none',boxSizing:'border-box'}}
                onFocus={e => e.target.style.borderColor='#5c6bc0'}
                onBlur={e => e.target.style.borderColor='#e2e8f0'}
              />
            </div>
          </div>

          {/* Zoom Link */}
          <div>
            <label htmlFor="session-zoom" style={{display:'block',fontSize:'0.8rem',fontWeight:600,marginBottom:'6px',color:'#1F1F1F'}}>
              Zoom / Meet Link <span style={{fontSize:'0.75rem',fontWeight:400,color:'#888'}}>(optional)</span>
            </label>
            <input
              id="session-zoom"
              name="zoomLink"
              type="url"
              value={form.zoomLink}
              onChange={handleChange}
              placeholder="https://zoom.us/j/..."
              style={{width:'100%',padding:'10px 14px',border:'1px solid #e2e8f0',borderRadius:'8px',fontSize:'0.875rem',outline:'none',boxSizing:'border-box'}}
              onFocus={e => e.target.style.borderColor='#5c6bc0'}
              onBlur={e => e.target.style.borderColor='#e2e8f0'}
            />
          </div>

          {/* Error */}
          {formError && (
            <p style={{color:'#dc2626',fontSize:'0.8rem',background:'#fef2f2',border:'1px solid #fecaca',borderRadius:'6px',padding:'8px 12px',margin:0}}>
              {formError}
            </p>
          )}

          {/* Action Buttons */}
          <div style={{display:'flex',justifyContent:'flex-end',gap:'10px',paddingTop:'8px',borderTop:'1px solid #e2e8f0'}}>
            <button
            aria-label='cancel'
              type="button"
              onClick={closeModal}
              style={{padding:'8px 18px',fontSize:'0.875rem',fontWeight:500,color:'#666',background:'#f1f5f9',border:'none',borderRadius:'8px',cursor:'pointer'}}
            >
              Cancel
            </button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={submitting}
            >
              {submitting ? 'Scheduling?' : 'Schedule Session'}
            </Button>
          </div>

        </form>
      </Modal>
    </div>
  );
}