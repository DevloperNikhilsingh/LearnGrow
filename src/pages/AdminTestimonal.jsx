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
        role: 'Software Engineer',
        company: 'TCS',
        course: 'Full Stack Web Development',
        avatar: '/testimonal.png',
        status: 'PUBLISHED',
    },
    {
        id: 2,
        name: 'Rashneet Singh',
        role: 'Marketing Executive',
        company: 'Aashirvaad, B Natural',
        course: 'Digital Marketing',
        avatar: '/testimonal_3.png',
        status: 'PUBLISHED',
    },
    {
        id: 3,
        name: 'Riya Shah',
        role: 'UI/UX Designer',
        company: 'Hyatt Centric',
        course: 'UI/UX Design',
        avatar: '/testimonal.png',
        status: 'DRAFT',
    },
]

const emptyForm = {
    name: '',
    role: '',
    company: '',
    course: '',
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

    const handleSubmit = (e) => {
        e.preventDefault()

        // NOTE: Right now this just updates local state (frontend-only).
        // Once the backend is ready, replace this block with an API POST call,
        // then refetch / update state from the server response. Home page will
        // then also fetch testimonials dynamically instead of using a hardcoded array.
        const newTestimonial = {
            id: Date.now(),
            name: formData.name,
            role: formData.role,
            company: formData.company,
            course: formData.course,
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

    return (
        <div className="min-h-screen bg-surface flex">
            <Helmet>
                <title>Manage Testimonials | Admin</title>
            </Helmet>

            <AdminSidebar />

            <main className="flex-1 overflow-y-auto">
                {/* Header */}
                <div className="bg-white border-b border-border h-16 flex items-center justify-between pl-16 pr-2 lg:px-8 shadow-sm">
                    <h1 className="text-[18px] sm:text-xl font-bold text-[#1F1F1F]">Manage Testimonials</h1>
                    <Button  variant="primary" size='[44px]'  className="gap-1 h-10 w-[177px]" onClick={handleOpenModal}>
                        <Plus size={16} /> Add Testimonial
                    </Button>
                </div>

                <div className="p-6 lg:p-8">
                    {/* Search Bar */}
                    <div className="bg-white rounded-xl border border-border p-4 mb-6 shadow-sm">
                        <div className="relative max-w-md">
                            <Search
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                                type="text"
                                placeholder="Search testimonials..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-[#1F1F1F]">
                            <thead className='bg-surface text-muted font-semibold uppercase border-border border-b'>
                                <tr className="bg-gray-50 border-b border-border">
                                    <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-6 py-4">
                                        Person
                                    </th>
                                    <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-6 py-4">
                                        Company
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
                                {testimonials.map((item) => (
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
                                                    <p className="text-xs text-gray-500">{item.role}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-[#1F1F1F]">
                                            {item.company}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-[#1F1F1F]">
                                            {item.course}
                                        </td>
                                        
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                
                                                <button
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
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-white rounded-t-2xl">
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
                        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
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
                                    Role <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. Digital Marketing Executive"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-[#1F1F1F] mb-1.5">
                                    Company <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. Nykaa"
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
                                {/* <label>
                                    Upload Image
                                </label> */}
                                <label className="block text-sm font-semibold text-[#1F1F1F] mb-1.5">
                                    Avatar Image Path
                                </label>
                                <input
                                    type="file"
                                    accept='image*/'
                                    name="avatar"
                                    value={formData.avatar}
                                    onChange={handleChange}
                                    placeholder="e.g. /testimonal.png"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                                />
                            </div>

                            <div>
                                <label className='block text-sm font-semibold text-[1F1F1F] mb-1.5'>
                                    Upload Video
                                </label>
                                <label

                                    className="flex items-center justify-center gap-1.5 border-2 border-dashed border-border rounded px-2 py-1.5 text-xs text-muted hover:border-primary hover:bg-primary/5 cursor-pointer transition-colors w-full"
                                >
                                    <Upload size={13} />
                                    Upload video
                                </label>

                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={handleChange}
                                    className="hidden"
                                />
                            </div>

                            

                            {/* Modal Footer */}
                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <Button type="submit" variant="primary" size="sm">
                                    Submit
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Success Alert Toast */}
            {showSuccess && (
                <div className="fixed top-6 right-6 z-[60] flex items-center gap-3 bg-white border border-green-200 shadow-lg rounded-xl px-5 py-4 animate-fade-in">
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