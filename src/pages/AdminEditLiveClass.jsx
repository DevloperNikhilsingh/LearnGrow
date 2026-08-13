import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import AdminSidebar from '../components/admin/AdminSidebar'
import Button from '../components/ui/Button'

const AdminEditLiveClass = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const [form, setForm] = useState({
    title: '',
    courses: '',
    instructor: '',
    date: '',
    time: '',
  })

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // localStorage se existing live class ka data fetch karke form fill karta hai.
  // Backend ready hone par isko API call se replace kar dena.
  useEffect(() => {
    const saved = localStorage.getItem('liveClasses')
    if (saved) {
      const list = JSON.parse(saved)
      const found = list.find((c) => String(c.id) === String(id))
      if (found) {
        setForm({
          title: found.title || '',
          courses: found.category || '',
          instructor: found.instructor || '',
          date: found.date || '',
          time: found.time || '',
        })
      }
    }
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.title || !form.courses || !form.instructor || !form.date || !form.time) {
      setError('Please fill all required fields.')
      return
    }

    setSaving(true)
    try {
      // localStorage me updated data save karta hai.
      // Backend ready hone par yaha API PUT/PATCH call karo: await updateLiveClass(id, form)
      const saved = localStorage.getItem('liveClasses')
      const list = saved ? JSON.parse(saved) : []
      const updatedList = list.map((c) =>
        String(c.id) === String(id)
          ? {
              ...c,
              title: form.title,
              category: form.courses,
              instructor: form.instructor,
              date: form.date,
              time: form.time,
            }
          : c
      )
      localStorage.setItem('liveClasses', JSON.stringify(updatedList))

      await new Promise((resolve) => setTimeout(resolve, 500)) // temporary fake delay

      navigate('/admin/live-classes')
    } catch (err) {
      setError('Something went wrong while saving. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex">
      <Helmet>
        <title>Edit Live Classes | Admin</title>
      </Helmet>

      <AdminSidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="bg-white border-b border-border h-16 flex items-center justify-between pl-16 pr-4 sm:pr-6 lg:px-8 shadow-sm">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
            aria-label='back'
              onClick={() => navigate('/admin/live-classes')}
              className="p-2 rounded hover:bg-surface text-muted hover:text-primary transition-colors shrink-0"
              title="Back"
            >
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-lg sm:text-xl font-bold text-[#1F1F1F] truncate">Edit Live Classes</h1>
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

        <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-50 text-red-600 text-sm border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-card shadow-sm border border-border p-4 sm:p-6 space-y-5">

            <div>
              <label className="block mb-2 text-sm font-semibold text-[#1F1F1F]">Session Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="e.g. Intro to React Hooks"
                className="w-full p-2 border border-border rounded-md shadow-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block mb-2 text-sm font-semibold text-[#1F1F1F]">Category/Courses</label>
                <input
                  type="text"
                  name="courses"
                  value={form.courses}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Full Stack Web Development"
                  className="w-full p-2 border border-border rounded-md shadow-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-[#1F1F1F]">Instructor Name</label>
                <input
                  type="text"
                  name="instructor"
                  value={form.instructor}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Rahul Verma"
                  className="w-full p-2 border border-border rounded-md shadow-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block mb-2 text-sm font-semibold text-[#1F1F1F]">Date</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-border rounded-md shadow-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-[#1F1F1F]">Time</label>
                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-border rounded-md shadow-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="w-full sm:w-auto"
                onClick={() => navigate('/admin/live-classes')}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" className="gap-1 w-full sm:w-auto" disabled={saving}>
                <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>

          </form>
        </div>
      </main>
    </div>
  )
}

export default AdminEditLiveClass