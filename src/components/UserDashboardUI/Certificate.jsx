import React, { useState, useEffect } from 'react';
import { Award, Download } from 'lucide-react';

export default function Certificates({ setActiveTab }) {
  const [approvedCertificates, setApprovedCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('lg_user'));
      const allRequests = JSON.parse(localStorage.getItem('lg_certificate_requests') || '[]');

      const myApproved = allRequests
        .filter((r) => r.userId === currentUser?.id && r.status === 'approved')
        .map((r) => ({
          id: r.id,
          courseTitle: r.courseName,
          scorePercent: r.scorePercent,
          completedDate: r.reviewedAt || r.submittedAt,
          credentialId: `LG-2026-${r.courseId.toString().padStart(3, '0')}-${r.id.toString().slice(-4)}`,
        }));

      setApprovedCertificates(myApproved);
    } catch {
      setApprovedCertificates([]);
    }
    setLoading(false);
  };

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#1F1F1F]">My Certificates</h2>
        <span className="text-sm text-muted bg-white border border-border rounded-full px-3 py-1">{approvedCertificates.length} earned</span>
      </div>

      {loading ? (
        <div className="bg-white border border-border rounded-2xl p-12 text-center shadow-sm">
          <p className="text-muted">Loading...</p>
        </div>
      ) : approvedCertificates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {approvedCertificates.map((cert) => (
            <div key={cert.id} className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
              {/* Certificate Header */}
              <div className="bg-gradient-to-br from-navy to-[#1a3a6b] p-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                  <div className="grid grid-cols-8 gap-2 h-full">
                    {Array.from({ length: 40 }).map((_, i) => (
                      <div key={i} className="border border-white rounded" />
                    ))}
                  </div>
                </div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-amber/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <Award size={32} className="text-amber" />
                  </div>
                  <p className="text-white/60 text-xs font-semibold uppercase tracking-widest">Certificate of Completion</p>
                  <p className="text-xs text-white/40 mt-1">LearnGrow Academy</p>
                </div>
              </div>
              {/* Certificate Body */}
              <div className="p-5">
                <h4 className="font-bold text-[#1F1F1F] text-base mb-1 line-clamp-2">{cert.courseTitle}</h4>
                <p className="text-sm text-muted mb-3">Test Score: {cert.scorePercent}%</p>
                <div className="flex items-center justify-between text-xs text-muted border-t border-border pt-3">
                  <div>
                    <p className="font-medium text-[#1F1F1F]">{new Date(cert.completedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <p>ID: {cert.credentialId}</p>
                  </div>
                  <button aria-label='download' className="flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-colors">
                    <Download size={13} /> Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-border rounded-2xl p-12 text-center shadow-sm">
          <Award size={64} className="text-gray-200 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-[#1F1F1F] mb-2">No certificates yet</h3>
          <p className="text-muted max-w-sm mx-auto">Complete a course, pass the test, and once admin approves it your certificate will appear here.</p>
          <button aria-label='go to my courses' onClick={() => setActiveTab('courses')} className="mt-6 btn-primary inline-block">
            Go to My Courses
          </button>
        </div>
      )}
    </div>
  );
}