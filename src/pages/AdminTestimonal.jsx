import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import AdminSidebar from '../components/admin/AdminSidebar'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Search, X, CheckCircle2 } from 'lucide-react'
import Button from '../components/ui/Button'
import { Upload } from 'lucide-react'

const initialTestimonialsData = [
    {
        id: 1,
        name: 'Mohit Sharma',
        course: 'Full Stack Web Development',
        quote: '"LearnGrow Platform was truly a game-changer for me as I brought my design & Creativity skills to a professional level."',
        avatar: '/testimonal.png',
        video: '',
        status: 'PUBLISHED',
    },
    {
        id: 2,
        name: 'Rashneet Singh',
        course: 'Digital Marketing',
        quote: '"Learning Platform gives you the ability to be persistent. I learned exactly what I needed to get a new role."',
        avatar: '/testimonal_3.png',
        video: '',
        status: 'PUBLISHED',
    },
    {
        id: 3,
        name: 'Riya Shah',
        course: 'UI/UX Design',
        quote: '"I loved the web development course. Within weeks, I had the skills to build real projects for my team."',
        avatar: '/testimonal.png',
        video: '',
        status: 'DRAFT',
    },
]

const emptyForm = {
    name: '',
    course: '',
    quote: '',
    avatar: '',
    video: '',
    status: 'DRAFT',
}

const StatusBadge = ({ status }) => {
    const isPublished = status === 'PUBLISHED'
    return (
        <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${isPublished
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600'
                }`}
        >
            {status}
        </span>
    )
}

const AdminTestimonal = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [testimonials, setTestimonials] = useState(initialTestimonialsData)
    const [formData, setFormData] = useState(emptyForm)
    const [showSuccess, setShowSuccess] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    const handleOpenModal = () => {
        setFormData(emptyForm)
        setIsOpen(true)
    }

    const handleCloseModal = () => {
        setIsOpen(false)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    // avatar image file select hone par uska naam/preview formData me store karta hai
    const handleAvatarChange = (e) => {
        const file = e.target.files[0]
        setFormData((prev) => ({ ...prev, avatar: file ? file.name : '' }))
    }

    // video file select hone par uska naam formData me store karta hai (pehle ye connect hi nahi tha)
    const handleVideoChange = (e) => {
        const file = e.target.files[0]
        setFormData((prev) => ({ ...prev, video: file ? file.name : '' }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        // NOTE: Right now this just updates local state (frontend-only).
        // Once the backend is ready, replace this block with an API POST call,
        // then refetch / update state from the server response. Home page will
        // then also fetch testimonials dynamically instead of using a hardcoded array.
        const newTestimonial = {
            id: Date.now(),
            name: formData.name,
            course: formData.course,
            quote: formData.quote,
            avatar: formData.avatar || '/testimonal.png',
            video: formData.video,
            status: formData.status,
        }

        setTestimonials((prev) => [newTestimonial, ...prev])
        setIsOpen(false)
        setFormData(emptyForm)

        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
    }

    const handleDelete = (id) => {
        // NOTE: Right now this just updates local state (frontend-only).
        // Once the backend is ready, replace this with an API DELETE call,
        // then refetch / update state from the server response.
        if (window.confirm('Are you sure you want to delete this testimonial?')) {
            setTestimonials((prev) => prev.filter((item) => item.id !== id))
        }
    }

    // Filter logic — live search
    const filteredtestimonal = testimonials.filter((testimonal) => {
        const term = searchTerm.trim().toLowerCase()
        if (!term) return true
        return (
            testimonal.name?.toLowerCase().includes(term) ||
            testimonal.course?.toLowerCase().includes(term)
        )
    })
    return (
        <div className="min-h-screen bg-surface flex">
            <Helmet>
                <title>Manage Testimonials | Admin</title>
            </Helmet>

            <AdminSidebar />

            <main className="flex-1 overflow-y-auto min-w-0">
                {/* Header */}
                <div className="bg-white border-b border-border min-h-16 flex flex-wrap items-center justify-between gap-3 pl-16 pr-4 py-3 sm:pr-8 lg:px-8 shadow-sm">
                    <h1 className="text-[16px] sm:text-xl font-bold text-[#1F1F1F]">Manage Testimonials</h1>
                    <Button variant="primary" size='[44px]' className="gap-1 h-10 w-auto px-3 sm:w-[177px] whitespace-nowrap" onClick={handleOpenModal}>
                        <Plus size={16} /> <span className="hidden xs:inline">Add Testimonial</span><span className="xs:hidden">Add</span>
                    </Button>
                </div>

                <div className="p-4 sm:p-6 lg:p-8">
                    {/* Search Bar */}
                    <div className="bg-white rounded-xl border border-border p-4 mb-6 shadow-sm">
                        {/* Search Bar */}
                        <div className="relative max-w-md">
                            <Search
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}   // live search - har type par filter
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault()
                                        setSearchTerm(e.target.value)   // enter dabane par bhi confirm
                                    }
                                }}
                                placeholder="Search testimonials..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-[#1F1F1F] min-w-[560px]">
                            <thead className='bg-surface text-muted font-semibold uppercase border-border border-b'>
                                <tr className="bg-gray-50 border-b border-border">
                                    <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-6 py-4">
                                        Person
                                    </th>
                                    <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-6 py-4">
                                        Course
                                    </th>
                                    <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-6 py-4">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredtestimonal.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="border-b border-border last:border-0 hover:bg-gray-50/60 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={item.avatar}
                                                    alt={item.name}
                                                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                                                />
                                                <div>
                                                    <p className="font-semibold text-[#1F1F1F] text-sm">
                                                        {item.name}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-[#1F1F1F]">
                                            {item.course}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-red-100 hover:text-red-600 text-gray-600 transition-colors"
                                                    aria-label="Delete"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Add Testimonial Modal */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
                    onClick={handleCloseModal}
                >
                    <div
                        className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border sticky top-0 bg-white rounded-t-2xl">
                            <h2 className="text-lg font-bold text-[#1F1F1F]">Add Testimonial</h2>
                            <button
                                onClick={handleCloseModal}
                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                                aria-label="Close"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-5 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-[#1F1F1F] mb-1.5">
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. Priya Sharma"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-[#1F1F1F] mb-1.5">
                                    Course <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="course"
                                    value={formData.course}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. Digital Marketing"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-[#1F1F1F] mb-1.5">
                                    Testimonial Quote <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="quote"
                                    value={formData.quote}
                                    onChange={handleChange}
                                    required
                                    rows={3}
                                    placeholder='e.g. "LearnGrow Platform was truly a game-changer for me..."'
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-[#1F1F1F] mb-1.5">
                                    Avatar Image Path
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    name="avatar"
                                    onChange={handleAvatarChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                                />
                            </div>

                            <div>
                                <label className='block text-sm font-semibold text-[1F1F1F] mb-1.5'>
                                    Upload Video
                                </label>
                                <label
                                    htmlFor="videoUpload"
                                    className="flex items-center justify-center gap-1.5 border-2 border-dashed border-border rounded px-2 py-1.5 text-xs text-muted hover:border-primary hover:bg-primary/5 cursor-pointer transition-colors w-full"
                                >
                                    <Upload size={13} />
                                    {formData.video || 'Upload video'}
                                </label>

                                <input
                                    id="videoUpload"
                                    type="file"
                                    name="video"
                                    accept="video/*"
                                    onChange={handleVideoChange}
                                    className="hidden"
                                />
                            </div>

                            {/* Modal Footer */}
                            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="w-full sm:w-auto px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <Button type="submit" variant="primary" size="sm" className="w-full sm:w-auto">
                                    Submit
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Success Alert Toast */}
            {showSuccess && (
                <div className="fixed top-4 right-4 left-4 sm:left-auto sm:top-6 sm:right-6 z-[60] flex items-center gap-3 bg-white border border-green-200 shadow-lg rounded-xl px-4 sm:px-5 py-3 sm:py-4 animate-fade-in">
                    <CheckCircle2 size={22} className="text-green-600 flex-shrink-0" />
                    <p className="text-sm font-semibold text-[#1F1F1F]">
                        Testimonial added successfully!
                    </p>
                </div>
            )}
        </div>
    )
}

export default AdminTestimonal