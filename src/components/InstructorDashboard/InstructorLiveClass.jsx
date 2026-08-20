import React, { useMemo, useState } from "react";
import { Radio, Video, Pencil, Trash2, Check, Plus, X } from "lucide-react";
import instructorCourses from "../../data/InstructorCourses";



const STATUS_STYLES = {
  live: "bg-red-50 text-red-600 border border-red-100",
  scheduled: "bg-blue-50 text-blue-600 border border-blue-100",
  ended: "bg-gray-100 text-gray-500 border border-gray-200",
};

const StatusBadge = ({ status }) => {
  const label =
    status === "live" ? "LIVE NOW" : status === "ended" ? "ENDED" : "SCHEDULED";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide ${STATUS_STYLES[status]}`}
    >
      {label}
    </span>
  );
};

const getLiveSessions = () => {
  const sessions = [];
  instructorCourses.forEach((course) => {
    (course.curriculum || []).forEach((section) => {
      (section.lessons || []).forEach((lesson) => {
        if (lesson.isLive) {
          sessions.push({
            id: lesson.id,
            title: lesson.title,
            section: section.section,
            courseId: course.id,
            courseTitle: course.title,
            categoryName: course.categoryName,
            instructor: course.instructor,
            zoomLink: lesson.zoomLink,
            duration: lesson.duration,
            scheduledAt: lesson.scheduledAt || null, 
            status: lesson.status || "scheduled", 
          });
        }
      });
    });
  });
  return sessions;
};

const deriveStatus = (scheduledAt) => {
  if (!scheduledAt) return "scheduled";
  const now = new Date();
  const start = new Date(scheduledAt);
  const diffMins = (start - now) / 60000;
  if (diffMins <= 0 && diffMins > -90) return "live"; 
  if (diffMins <= -90) return "ended";
  return "scheduled";
};

const emptyForm = {
  title: "",
  courseId: "",
  scheduledDate: "",
  scheduledTime: "",
  zoomLink: "",
};

const ScheduleModal = ({ initialData, onClose, onSave }) => {
  const [form, setForm] = useState(initialData || emptyForm);
  const [error, setError] = useState("");

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.courseId || !form.scheduledDate || !form.scheduledTime) {
      setError("Please fill in the session title, course, date and time.");
      return;
    }
    const course = instructorCourses.find((c) => String(c.id) === String(form.courseId));
    const scheduledAt = new Date(`${form.scheduledDate}T${form.scheduledTime}`).toISOString();

    onSave({
      id: initialData?.id || `custom-${Date.now()}`,
      title: form.title.trim(),
      courseId: course.id,
      courseTitle: course.title,
      categoryName: course.categoryName,
      instructor: course.instructor,
      zoomLink: form.zoomLink.trim(),
      scheduledAt,
      status: deriveStatus(scheduledAt),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md rounded-2xl shadow-xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">
            {initialData ? "Edit Live Class" : "Schedule Live Class"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Session Title
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="e.g. Live Q&A — Module 3"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Course
            </label>
            <select
              value={form.courseId}
              onChange={(e) => update("courseId", e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 bg-white"
            >
              <option value="">Select a course</option>
              {instructorCourses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Date
              </label>
              <input
                type="date"
                value={form.scheduledDate}
                onChange={(e) => update("scheduledDate", e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Time
              </label>
              <input
                type="time"
                value={form.scheduledTime}
                onChange={(e) => update("scheduledTime", e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Zoom Link
            </label>
            <input
              type="url"
              value={form.zoomLink}
              onChange={(e) => update("zoomLink", e.target.value)}
              placeholder="https://zoom.us/j/..."
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              {initialData ? "Save Changes" : "Schedule Class"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const formatDateTime = (iso) => {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  const date = d.toLocaleDateString("en-CA"); // YYYY-MM-DD
  const time = d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return { date, time };
};

const CopiedTick = () => (
  <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-medium">
    <Check size={12} /> Copied
  </span>
);

const InstructorLiveClass = () => {
  const [sessions, setSessions] = useState(getLiveSessions());
  const [copiedId, setCopiedId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);

  const stats = useMemo(() => {
    const liveNow = sessions.filter((s) => s.status === "live").length;
    const scheduled = sessions.filter((s) => s.status === "scheduled").length;
    return { total: sessions.length, liveNow, scheduled };
  }, [sessions]);

  const handleDelete = (id) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  const handleCopy = (link, id) => {
    if (!link) return;
    navigator.clipboard?.writeText(link).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const openCreateModal = () => {
    setEditingSession(null);
    setModalOpen(true);
  };

  const openEditModal = (session) => {
    const dt = session.scheduledAt ? new Date(session.scheduledAt) : null;
    setEditingSession({
      id: session.id,
      title: session.title,
      courseId: session.courseId,
      scheduledDate: dt ? dt.toISOString().slice(0, 10) : "",
      scheduledTime: dt ? dt.toTimeString().slice(0, 5) : "",
      zoomLink: session.zoomLink || "",
    });
    setModalOpen(true);
  };

  const handleSave = (sessionData) => {
    setSessions((prev) => {
      const exists = prev.some((s) => s.id === sessionData.id);
      if (exists) {
        return prev.map((s) => (s.id === sessionData.id ? sessionData : s));
      }
      return [sessionData, ...prev];
    });
    setModalOpen(false);
    setEditingSession(null);
  };

  return (
    <>
     <div className="mb-6 hidden lg:flex items-center bg-[#0b1030] px-6 py-5">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white">Live Classes</h1>
        </div>
      </div>
    <div className="px-4 sm:px-6 lg:px-8 pt-20 lg:pt-6 pb-6 w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
            Live Classes
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            {stats.total} session{stats.total !== 1 ? "s" : ""} ·{" "}
            {stats.liveNow} live now · {stats.scheduled} scheduled
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm w-full sm:w-auto shrink-0"
        >
          <Plus size={16} />
          Schedule Live Class
        </button>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {sessions.length === 0 ? (
          <div className="py-16 flex flex-col items-center text-center gap-3">
            <p className="text-sm text-gray-400">
              No live classes yet. Schedule your first session for students.
            </p>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
            >
              <Plus size={15} />
              Schedule Live Class
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[720px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-3 text-[11px] font-bold tracking-wider text-gray-500 uppercase">
                    Session Title
                  </th>
                  <th className="px-6 py-3 text-[11px] font-bold tracking-wider text-gray-500 uppercase">
                    Course / Category
                  </th>
                  <th className="px-6 py-3 text-[11px] font-bold tracking-wider text-gray-500 uppercase">
                    Date &amp; Time
                  </th>
                  <th className="px-6 py-3 text-[11px] font-bold tracking-wider text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-[11px] font-bold tracking-wider text-gray-500 uppercase text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => {
                  const dt = formatDateTime(s.scheduledAt);
                  return (
                    <tr
                      key={s.id}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors"
                    >
                      <td className="px-6 py-4 align-top">
                        <p className="font-semibold text-gray-900 text-sm">
                          {s.title}
                        </p>
                        <div className="mt-1 flex items-center gap-1.5">
                          {s.status === "live" ? (
                            <Radio size={13} className="text-red-500" />
                          ) : (
                            <Video size={13} className="text-gray-400" />
                          )}
                          {s.zoomLink ? (
                            <button
                              onClick={() => handleCopy(s.zoomLink, s.id)}
                              className="text-xs text-blue-600 underline underline-offset-2 hover:text-blue-700"
                            >
                              Zoom Link
                            </button>
                          ) : (
                            <span className="text-xs text-gray-400">
                              No link yet
                            </span>
                          )}
                          {copiedId === s.id && <CopiedTick />}
                        </div>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <p className="text-sm font-medium text-gray-800">
                          {s.categoryName}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Inst: {s.instructor}
                        </p>
                      </td>
                      <td className="px-6 py-4 align-top">
                        {dt ? (
                          <>
                            <p className="text-sm text-gray-800">{dt.date}</p>
                            <p className="text-xs text-gray-500">{dt.time}</p>
                          </>
                        ) : (
                          <p className="text-sm text-gray-400 italic">
                            Not scheduled yet
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 align-top">
                        <StatusBadge status={s.status} />
                      </td>
                      <td className="px-6 py-4 align-top">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(s)}
                            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                            title="Edit session"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(s.id)}
                            className="p-2 rounded-lg bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 transition-colors"
                            title="Delete session"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <ScheduleModal
          initialData={editingSession}
          onClose={() => {
            setModalOpen(false);
            setEditingSession(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
    </>
  );
};

export default InstructorLiveClass;