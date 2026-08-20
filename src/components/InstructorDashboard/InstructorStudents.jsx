/**
 * pages/InstructorStudents.jsx
 * Fully responsive: small mobile -> large mobile -> tablet -> laptop -> large desktop
 */
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search } from 'lucide-react';

const DUMMY_STUDENTS = [
  { id: 1, name: 'Aman Sharma', email: 'aman.sharma@example.com', enrolledCourses: 2, joinedAt: '2025-11-12' },
  { id: 2, name: 'Priya Verma', email: 'priya.verma@example.com', enrolledCourses: 1, joinedAt: '2025-12-01' },
  { id: 3, name: 'Rohit Singh', email: 'rohit.singh@example.com', enrolledCourses: 3, joinedAt: '2026-01-08' },
  { id: 4, name: 'Neha Gupta', email: 'neha.gupta@example.com', enrolledCourses: 1, joinedAt: '2026-02-15' },
  { id: 5, name: 'Karan Mehta', email: 'karan.mehta@example.com', enrolledCourses: 2, joinedAt: '2026-03-20' },
];

export default function InstructorStudents() {
  const [students] = useState(DUMMY_STUDENTS);
  const [loading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filterData = students.filter((stu) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    return stu.name?.toLowerCase().includes(term);
  });

  return (
    <div className="min-h-screen bg-surface ">
      <div className="mb-6 hidden lg:flex items-center bg-[#0b1030] px-6 py-5">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white">Students</h1>
        </div>
      </div>
      <Helmet><title>Manage Students | Instructor</title></Helmet>
      <main className="flex-1 overflow-y-auto w-full">
  <div className="px-3 sm:px-5 md:px-6 lg:px-8 xl:px-10 pt-20 pb-4 sm:pt-24 sm:pb-6 lg:pt-8 lg:pb-8 max-w-7xl mx-auto">
          <div className="bg-white rounded-card shadow-sm border border-border overflow-hidden">
            {/* Search bar — full width on mobile, fixed width from sm, wider on xl */}
            <div className="p-3 sm:p-4 border-b border-border bg-gray-50/50">
              <div className="relative w-full sm:w-64 md:w-72 xl:w-80">
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  type="text"
                  placeholder="Search students..."
                  className="w-full bg-white border border-border rounded-btn py-2 sm:py-1.5 pl-9 pr-4 text-sm focus:outline-none focus:border-primary"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={14} />
              </div>
            </div>

            {loading ? (
              <div className="p-8 text-center text-muted text-sm">Loading...</div>
            ) : filterData.length === 0 ? (
              <div className="p-8 text-center text-muted text-sm">No students found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm lg:text-[15px] text-[#1F1F1F]">
                  <thead className="bg-surface text-muted uppercase font-semibold text-xs border-b border-border">
                    <tr>
                      <th className="px-4 lg:px-6 xl:px-8 py-3 lg:py-4 whitespace-nowrap">Student Name</th>
                      <th className="px-4 lg:px-6 xl:px-8 py-3 lg:py-4 whitespace-nowrap">Email</th>
                      <th className="px-4 lg:px-6 xl:px-8 py-3 lg:py-4 text-center whitespace-nowrap">Enrolled Courses</th>
                      <th className="px-4 lg:px-6 xl:px-8 py-3 lg:py-4 whitespace-nowrap">Joined Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filterData.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 lg:px-6 xl:px-8 py-3 lg:py-4 font-semibold whitespace-nowrap">{student.name}</td>
                        <td className="px-4 lg:px-6 xl:px-8 py-3 lg:py-4 text-muted whitespace-nowrap">{student.email}</td>
                        <td className="px-4 lg:px-6 xl:px-8 py-3 lg:py-4 text-center font-bold whitespace-nowrap">{student.enrolledCourses}</td>
                        <td className="px-4 lg:px-6 xl:px-8 py-3 lg:py-4 text-muted whitespace-nowrap">
                          {new Date(student.joinedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}