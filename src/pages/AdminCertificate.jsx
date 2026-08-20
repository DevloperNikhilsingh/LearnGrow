import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, Check, X, Eye } from 'lucide-react';
import AdminSidebar from '../components/admin/AdminSidebar';
import Badge from '../components/ui/Badge';

const STORAGE_KEY = 'lg_certificate_requests';

export default function AdminCertificate() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    setLoading(true);
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      setRequests(Array.isArray(data) ? data : []);
    } catch {
      setRequests([]);
    }
    setLoading(false);
  };

  const saveRequests = (updated) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setRequests(updated);
  };

  const handleApprove = (id) => {
    const updated = requests.map((r) =>
      r.id === id
        ? { ...r, status: 'approved', reviewedAt: new Date().toISOString(), rejectReason: null }
        : r
    );
    saveRequests(updated);
    setSelected(null);
  };

  const handleReject = (id) => {
    if (!rejectReason.trim()) return;
    const updated = requests.map((r) =>
      r.id === id
        ? { ...r, status: 'rejected', reviewedAt: new Date().toISOString(), rejectReason: rejectReason.trim() }
        : r
    );
    saveRequests(updated);
    setRejectingId(null);
    setRejectReason('');
    setSelected(null);
  };

  const filteredRequests = requests
    .filter((r) => {
      if (statusFilter === 'all') return true;
      return r.status === statusFilter;
    })
    .filter((r) => {
      const term = searchTerm.trim().toLowerCase();
      if (!term) return true;
      return (
        r.studentName?.toLowerCase().includes(term) ||
        r.studentEmail?.toLowerCase().includes(term) ||
        r.courseName?.toLowerCase().includes(term)
      );
    })
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

  const statusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge label="Approved" className="bg-success/10 text-success" />;
      case 'rejected':
        return <Badge label="Rejected" className="bg-red-100 text-red-600" />;
      default:
        return <Badge label="Pending" className="bg-yellow-100 text-yellow-700" />;
    }
  };

  const formatDate = (iso) => {
    if (!iso) return '-';
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) +
      ' ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  const counts = {
    all: requests.length,
    pending: requests.filter((r) => r.status === 'pending').length,
    approved: requests.filter((r) => r.status === 'approved').length,
    rejected: requests.filter((r) => r.status === 'rejected').length,
  };

  return (
    <div className="min-h-screen bg-surface flex">
      <Helmet>
        <title>Certificate Requests | Admin</title>
      </Helmet>

      <AdminSidebar />

      <main className="flex-1 overflow-y-auto min-w-0">
        <div className="bg-white border-b border-border min-h-16 flex flex-wrap items-center justify-between gap-3 pl-16 pr-4 py-3 sm:pr-8 lg:px-8 shadow-sm">
          <h1 className="text-lg sm:text-xl font-bold text-[#1F1F1F]">Certificate Requests</h1>
        </div>

        <div className="p-4 sm:p-8 max-w-7xl mx-auto">

          <div className="flex flex-wrap gap-2 mb-4">
            {[
              { key: 'all', label: 'All' },
              { key: 'pending', label: 'Pending' },
              { key: 'approved', label: 'Approved' },
              { key: 'rejected', label: 'Rejected' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`px-4 py-1.5 rounded-btn text-sm font-medium border transition-colors ${
                  statusFilter === tab.key
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-muted border-border hover:bg-gray-50'
                }`}
              >
                {tab.label} <span className="ml-1 opacity-70">({counts[tab.key]})</span>
              </button>
            ))}
          </div>

          <div className="bg-white rounded-card shadow-sm border border-border overflow-hidden">
            <div className="p-4 border-b border-border flex justify-between items-center bg-gray-50/50">
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, email, course..."
                  className="w-full bg-white border border-border rounded-btn py-1.5 pl-9 pr-4 text-sm focus:outline-none focus:border-primary"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={14} />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-[#1F1F1F] min-w-[820px]">
                <thead className="bg-surface text-muted uppercase font-semibold text-xs border-b border-border">
                  <tr>
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Course</th>
                    <th className="px-6 py-4">Score</th>
                    <th className="px-6 py-4">Submitted</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? (
                    <tr><td colSpan="6" className="p-8 text-center text-muted">Loading...</td></tr>
                  ) : filteredRequests.length === 0 ? (
                    <tr><td colSpan="6" className="p-8 text-center text-muted">No certificate requests found.</td></tr>
                  ) : filteredRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-gray-50/50 transition-colors align-top">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-[#1F1F1F] line-clamp-1">{req.studentName}</p>
                        <p className="text-xs text-muted">{req.studentEmail}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="line-clamp-1">{req.courseName}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium">{req.scorePercent}%</p>
                        <p className="text-xs text-muted">{req.correctCount}/{req.totalQuestions} correct</p>
                        <p className={`text-xs font-medium ${req.passed ? 'text-success' : 'text-red-500'}`}>
                          {req.passed ? 'Passed' : 'Not passed'}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-xs text-muted whitespace-nowrap">
                        {formatDate(req.submittedAt)}
                      </td>
                      <td className="px-6 py-4">
                        {statusBadge(req.status)}
                        {req.status === 'rejected' && req.rejectReason && (
                          <p className="text-xs text-muted mt-1 max-w-[160px] line-clamp-2">Reason: {req.rejectReason}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            aria-label="view request details"
                            onClick={() => setSelected(req)}
                            className="p-1.5 text-muted hover:text-primary transition-colors bg-surface rounded"
                            title="View details"
                          >
                            <Eye size={16} />
                          </button>
                          {req.status === 'pending' && (
                            <>
                              <button
                                aria-label="approve request"
                                onClick={() => handleApprove(req.id)}
                                className="p-1.5 text-muted hover:text-success transition-colors bg-surface rounded"
                                title="Approve"
                              >
                                <Check size={16} />
                              </button>
                              <button
                                aria-label="reject request"
                                onClick={() => { setRejectingId(req.id); setRejectReason(''); }}
                                className="p-1.5 text-muted hover:text-red-600 transition-colors bg-surface rounded"
                                title="Reject"
                              >
                                <X size={16} />
                              </button>
                            </>
                          )}
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

      {/* Reject reason modal */}
      {rejectingId !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-card shadow-lg w-full max-w-sm p-6">
            <h3 className="text-base font-bold text-[#1F1F1F] mb-3">Reject Request</h3>
            <p className="text-sm text-muted mb-2">Please provide a reason for rejection:</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              className="w-full border border-border rounded-btn p-2 text-sm focus:outline-none focus:border-primary resize-none"
              placeholder="e.g. Score too low, suspected cheating..."
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => { setRejectingId(null); setRejectReason(''); }}
                className="px-4 py-1.5 text-sm rounded-btn border border-border text-muted hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(rejectingId)}
                disabled={!rejectReason.trim()}
                className="px-4 py-1.5 text-sm rounded-btn bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-card shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-base font-bold text-[#1F1F1F]">Request Details</h3>
              <button onClick={() => setSelected(null)} className="text-muted hover:text-[#1F1F1F]">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted">Student</span><span className="font-medium">{selected.studentName}</span></div>
              <div className="flex justify-between"><span className="text-muted">Email</span><span className="font-medium">{selected.studentEmail}</span></div>
              <div className="flex justify-between"><span className="text-muted">Course</span><span className="font-medium text-right">{selected.courseName}</span></div>
              <div className="flex justify-between"><span className="text-muted">Score</span><span className="font-medium">{selected.scorePercent}% ({selected.correctCount}/{selected.totalQuestions})</span></div>
              <div className="flex justify-between"><span className="text-muted">Result</span><span className={`font-medium ${selected.passed ? 'text-success' : 'text-red-500'}`}>{selected.passed ? 'Passed' : 'Not passed'}</span></div>
              <div className="flex justify-between"><span className="text-muted">Submitted</span><span className="font-medium">{formatDate(selected.submittedAt)}</span></div>
              <div className="flex justify-between"><span className="text-muted">Status</span>{statusBadge(selected.status)}</div>
              {selected.reviewedAt && (
                <div className="flex justify-between"><span className="text-muted">Reviewed</span><span className="font-medium">{formatDate(selected.reviewedAt)}</span></div>
              )}
              {selected.rejectReason && (
                <div className="pt-2 border-t border-border">
                  <span className="text-muted block mb-1">Reject reason</span>
                  <p className="text-[#1F1F1F]">{selected.rejectReason}</p>
                </div>
              )}
            </div>

            {selected.status === 'pending' && (
              <div className="flex justify-end gap-2 mt-5">
                <button
                  onClick={() => { setRejectingId(selected.id); setRejectReason(''); }}
                  className="px-4 py-1.5 text-sm rounded-btn border border-border text-red-600 hover:bg-red-50"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleApprove(selected.id)}
                  className="px-4 py-1.5 text-sm rounded-btn bg-primary text-white hover:opacity-90"
                >
                  Approve
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}