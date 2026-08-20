import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Search, Eye, Edit2, Check, X } from 'lucide-react';
import AdminSidebar from '../components/admin/AdminSidebar';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { NavLink, useNavigate } from 'react-router-dom';

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
  },
  {
    id: 2,
    initials: 'N/A',
    name: 'N/A',
    email: 'instructor@learngrow.com',
    phone: 'Priya Verma',
    verification: 'na',
    courses: 1,
    joined: '1 month ago',
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
  },
];

export default function AdminInstructors() {
  const [instructors, setInstructors] = useState(INITIAL_INSTRUCTORS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  const verificationBadge = (status) => {
    if (status === 'verified') return <Badge label="Verified" className="bg-success/10 text-success" />;
    if (status === 'na') return <Badge label="N/A" className="bg-amber/10 text-amber" />;
    return <Badge label="Pending" className="bg-yellow-100 text-yellow-700" />;
  };

  const handleApprove = (id) => {
    setInstructors((prev) =>
      prev.map((i) => (i.id === id ? { ...i, verification: 'verified' } : i))
    );
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}"?`)) {
      setInstructors((prev) => prev.filter((i) => i.id !== id));
    }
  };

  const filtered = instructors.filter((i) => {
    const term = searchTerm.trim().toLowerCase();
    const matchesTerm =
      !term ||
      i.name.toLowerCase().includes(term) ||
      i.email.toLowerCase().includes(term);
    const matchesStatus = statusFilter === 'all' || i.verification === statusFilter;
    return matchesTerm && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-surface flex">
      <Helmet>
        <title>Manage Instructors | Admin</title>
      </Helmet>

      <AdminSidebar />

      <main className="flex-1 overflow-y-auto min-w-0">
        <div className="bg-white border-b border-border min-h-16 flex flex-wrap items-center justify-between gap-3 pl-16 pr-4 py-3 sm:pr-8 lg:px-8 shadow-sm">
          <h1 className="text-lg sm:text-xl font-bold text-[#1F1F1F]">Instructors</h1>
          
        </div>

        <div className="p-4 sm:p-8 max-w-7xl mx-auto">

          <div className="bg-white rounded-card shadow-sm border border-border p-4 mb-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search instructor/name/email"
                className="w-full bg-white border border-border rounded-btn py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-primary"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={14} />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-border rounded-btn py-2 px-3 text-sm focus:outline-none focus:border-primary sm:w-48"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="na">N/A</option>
            </select>
          </div>

          <div className="bg-white rounded-card shadow-sm border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-[#1F1F1F] min-w-[820px]">
                <thead className="bg-surface text-muted uppercase font-semibold text-xs border-b border-border">
                  <tr>
                    <th className="px-6 py-4">Instructor</th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4">Verification</th>
                    <th className="px-6 py-4">Courses</th>
                    <th className="px-6 py-4">Joined</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.length === 0 ? (
                    <tr><td colSpan="6" className="p-8 text-center text-muted">No instructors found.</td></tr>
                  ) : filtered.map((ins) => (
                    <tr key={ins.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-semibold text-xs flex items-center justify-center flex-shrink-0">
                            {ins.initials}
                          </div>
                          <p className="font-semibold text-[#1F1F1F] ">{ins.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p>{ins.phone}</p>
                        <p className="text-xs text-muted">{ins.email}</p>
                      </td>
                      <td className="px-6 py-4">{verificationBadge(ins.verification)}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-primary text-white text-xs font-semibold">
                          {ins.courses}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-muted whitespace-nowrap">{ins.joined}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button aria-label="view instructor"
                          onClick={() => navigate(`/admin/instructors/${ins.id}`)}
                          className="p-1.5 text-primary border border-primary/30 hover:bg-primary/10 transition-colors rounded" title="View">
                            <Eye size={16} />
                          </button>
                          <button aria-label="edit instructor" className="p-1.5 text-muted hover:text-primary transition-colors bg-surface rounded" title="Edit">
                            <Edit2 size={16} />
                          </button>
                          {ins.verification === 'na' && (
                            <button
                              aria-label="approve instructor"
                              onClick={() => handleApprove(ins.id)}
                              className="p-1.5 text-white bg-success hover:opacity-90 transition-colors rounded"
                              title="Approve"
                            >
                              <Check size={16} />
                            </button>
                          )}
                          <button
                            aria-label="remove instructor"
                            onClick={() => handleDelete(ins.id, ins.name)}
                            className="p-1.5 text-white bg-red-600 hover:opacity-90 transition-colors rounded"
                            title="Remove"
                          >
                            <X size={16} />
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
    </div>
  );
}