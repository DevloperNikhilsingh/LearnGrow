import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, XCircle, Ban } from 'lucide-react';
import AdminSidebar from '../components/admin/AdminSidebar';
import Badge from '../components/ui/Badge';

const INITIAL_INSTRUCTORS = [
    {
        id: 1,
        initials: 'RS',
        name: 'Rahul Sharma',
        email: 'rahul.sharma@learngrow.com',
        phone: '9876543210',
        verification: 'verified',
        courses: 3,
        joined: '4 weeks ago',
        expertise: 'N/A',
        experience: 'N/A',
        city: 'N/A',
        website: 'N/A',
        coursesList: [
            { id: 1, title: 'Figma & UI/UX Design Bootcamp', status: 'Published', students: 42 },
            { id: 2, title: 'Advanced React Patterns', status: 'Published', students: 18 },
            { id: 3, title: 'Intro to Product Design', status: 'Draft', students: 0 },
        ],
    },
    {
        id: 2,
        initials: 'PV',
        name: 'Priya Verma',
        email: 'instructor@learngrow.com',
        phone: '6359865485',
        verification: 'na',
        courses: 1,
        joined: '1 month ago',
        expertise: 'Script Writting',
        experience: '5+ Year',
        city: 'Varanasi',
        website: 'N/A',
        coursesList: [
            { id: 4, title: 'Content Writing Basics', status: 'Published', students: 5 },
        ],
    },
    {
        id: 3,
        initials: 'AK',
        name: 'Ankit Kumar',
        email: 'ankit@learngrow.com',
        phone: '9123456780',
        verification: 'verified',
        courses: 2,
        joined: '1 month ago',
        expertise: 'N/A',
        experience: 'N/A',
        city: 'N/A',
        website: 'N/A',
        coursesList: [
            { id: 5, title: 'Python for Beginners', status: 'Published', students: 30 },
            { id: 6, title: 'Data Structures Deep Dive', status: 'Published', students: 12 },
        ],
    },
    {
        id: 4,
        initials: 'SM',
        name: 'Sahil Mehta',
        email: 'sahil@learngrow.com',
        phone: '9988776655',
        verification: 'verified',
        courses: 4,
        joined: '2 months ago',
        expertise: 'N/A',
        experience: 'N/A',
        city: 'N/A',
        website: 'N/A',
        coursesList: [
            { id: 7, title: 'Digital Marketing 101', status: 'Published', students: 60 },
            { id: 8, title: 'SEO Fundamentals', status: 'Published', students: 25 },
            { id: 9, title: 'Social Media Strategy', status: 'Published', students: 15 },
            { id: 10, title: 'Email Marketing Mastery', status: 'Draft', students: 0 },
        ],
    },
];

export default function AdminInstructorDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const instructor = INITIAL_INSTRUCTORS.find((i) => i.id === Number(id));

    if (!instructor) {
        return (
            <div className="min-h-screen bg-surface flex">
                <AdminSidebar />
                <main className="flex-1 p-8">
                    <p className="text-muted">Instructor not found.</p>
                    <button onClick={() => navigate('/admin/instructors')} className="text-primary mt-2 inline-block">
                        Back to Instructors
                    </button>
                </main>
            </div>
        );
    }

    const verificationBadge = (status) => {
        if (status === 'verified') return <Badge label="Verified" className="bg-success/10 text-success" />;
        if (status === 'na') return <Badge label="N/A" className="bg-amber/10 text-amber" />;
        return <Badge label="Pending" className="bg-yellow-100 text-yellow-700" />;
    };

    return (
        <div className="min-h-screen bg-surface flex">
            <Helmet>
                <title>{instructor.name} | Admin</title>
            </Helmet>

            <AdminSidebar />

            <main className="flex-1 overflow-y-auto min-w-0">
                <div className="p-4 sm:p-8 max-w-7xl mx-auto">

                    <div className="flex justify-between items-center mb-6 pl-12 sm:pl-0">
                        <h1 className="text-xl sm:text-2xl font-bold text-[#1F1F1F] truncate">{instructor.name}</h1>
                        <button
                            onClick={() => navigate('/admin')}
                            className="flex items-center gap-2 border border-primary text-primary px-4 py-2 rounded-btn text-sm font-medium hover:bg-primary/5 transition-colors flex-shrink-0"
                        >
                            <ArrowLeft size={16} /> Back
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left column */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-card shadow-sm border border-border p-6">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 rounded-full bg-primary/10 text-primary font-bold text-lg flex items-center justify-center flex-shrink-0">
                                        {instructor.initials}
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-[#1F1F1F]">{instructor.name}</h2>
                                        <p className="text-sm text-muted">{instructor.phone} · {instructor.email}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    <div>
                                        <p className="text-xs text-muted mb-1">Expertise</p>
                                        <p className="font-bold text-[#1F1F1F]">{instructor.expertise}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted mb-1">Experience</p>
                                        <p className="font-bold text-[#1F1F1F]">{instructor.experience}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted mb-1">Verification</p>
                                        {verificationBadge(instructor.verification)}
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted mb-1">City</p>
                                        <p className="font-bold text-[#1F1F1F]">{instructor.city}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted mb-1">Website</p>
                                        <p className="font-bold text-[#1F1F1F]">{instructor.website}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted mb-1">Joined</p>
                                        <p className="font-bold text-[#1F1F1F]">{instructor.joined}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-card shadow-sm border border-border p-6">
                                <h3 className="font-bold text-[#1F1F1F] mb-4">
                                    Courses ({instructor.coursesList.length} total, {instructor.coursesList.filter(c => c.status === 'Published').length} published)
                                </h3>
                                {instructor.coursesList.length === 0 ? (
                                    <p className="text-muted text-sm">No courses added yet.</p>
                                ) : (
                                    <div className="divide-y divide-border">
                                        {instructor.coursesList.map((course) => (
                                            <div key={course.id} className="flex justify-between items-center py-3">
                                                <div>
                                                    <p className="font-medium text-[#1F1F1F] text-sm">{course.title}</p>
                                                    <p className="text-xs text-muted">{course.students} students enrolled</p>
                                                </div>
                                                <Badge
                                                    label={course.status}
                                                    className={course.status === 'Published' ? 'bg-success/10 text-success' : 'bg-gray-100 text-muted'}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right column - Actions */}
                        <div className="bg-white rounded-card shadow-sm border border-border p-6 h-fit">
                            <h3 className="font-bold text-[#1F1F1F] mb-4">Actions</h3>
                            <div className="space-y-3">
                                <button className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-2.5 rounded-btn text-sm font-medium hover:bg-red-700 transition-colors">
                                    <XCircle size={16} /> Reject Verification
                                </button>
                                <button className="w-full flex items-center justify-center gap-2 bg-amber text-white py-2.5 rounded-btn text-sm font-medium hover:opacity-90 transition-colors">
                                    <Ban size={16} /> Suspend Instructor
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}