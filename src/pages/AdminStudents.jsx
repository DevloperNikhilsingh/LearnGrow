/**
 * pages/AdminStudents.jsx
 */
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, Mail } from 'lucide-react';
import AdminSidebar from '../components/admin/AdminSidebar';
import { getStudents } from '../api/adminService';

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudents().then(data => {
      setStudents(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-surface flex">
      <Helmet><title>Manage Students | Admin</title></Helmet>
      <AdminSidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="bg-white border-b border-border h-16 flex items-center pl-16 pr-8 lg:px-8 shadow-sm">
          <h1 className="text-xl font-bold text-[#1F1F1F]">Manage Students</h1>
        </div>

        <div className="p-8 max-w-7xl mx-auto">
          <div className="bg-white rounded-card shadow-sm border border-border overflow-hidden">
            <div className="p-4 border-b border-border bg-gray-50/50">
              <div className="relative w-72">
                <input
                  type="text"
                  placeholder="Search students..."
                  className="w-full bg-white border border-border rounded-btn py-1.5 pl-9 pr-4 text-sm focus:outline-none focus:border-primary"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={14} />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-[#1F1F1F]">
                <thead className="bg-surface text-muted uppercase font-semibold text-xs border-b border-border">
                  <tr>
                    <th className="px-6 py-4">Student Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4 text-center">Enrolled Courses</th>
                    <th className="px-6 py-4">Joined Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? (
                    <tr><td colSpan="5" className="p-8 text-center text-muted">Loading...</td></tr>
                  ) : students.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-semibold">{student.name}</td>
                      <td className="px-6 py-4 text-muted">{student.email}</td>
                      <td className="px-6 py-4 text-center font-bold">{student.enrolledCourses}</td>
                      <td className="px-6 py-4 text-muted">{new Date(student.joinedAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-primary hover:underline flex items-center gap-1 justify-end w-full">
                          <Mail size={14}/> Email
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
