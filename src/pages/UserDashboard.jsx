/**
 * pages/UserDashboard.jsx
 * Fully functional with dummy data — no backend needed
 */
import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen, PlayCircle, Award, Calendar, Video, Settings, User,
  LayoutDashboard, LogOut, Menu, X,
  Download, CheckCircle, ChevronRight, Star, Clock, Target, Gift,
  Copy,
  HelpCircle,
  Headset,
  MessageCircle,
  Phone,
  ImagePlus,
  TimerIcon
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import ProgressBar from '../components/ui/ProgressBar';
import { getCurrentUser, logout } from '../api/authService';
import { BsWhatsapp } from 'react-icons/bs';
import { MdEmail, MdOtherHouses } from 'react-icons/md';
import { SiRapid } from 'react-icons/si';

// ─── Dummy Data ──────────────────────────────────────────────────────────────
const DUMMY_COURSES = [
  {
    id: 1,
    slug: 'digital-marketing-mastery',
    title: 'Digital Marketing Mastery',
    instructor: 'Priya Sharma',
    thumbnail: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=600&q=80',
    duration: '42 hours',
    totalLessons: 68,
    completedLessons: 41,
    category: 'Digital Marketing',
    rating: 4.7,
  },
  {
    id: 3,
    slug: 'physiotherapy-foundations',
    title: 'Physiotherapy Foundations',
    instructor: 'Dr. Arvind Patel',
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
    duration: '28 hours',
    totalLessons: 42,
    completedLessons: 13,
    category: 'Physiotherapy',
    rating: 4.5,
  },
  {
    id: 4,
    slug: 'figma-ui-ux-bootcamp',
    title: 'Figma UI/UX Bootcamp',
    instructor: 'Neha Kapoor',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80',
    duration: '18 hours',
    totalLessons: 30,
    completedLessons: 3,
    category: 'UI/UX Design',
    rating: 4.8,
  },
];

const DUMMY_PROGRESS = { 1: 50, 3: 30, 4: 10 };

const DUMMY_LIVE_CLASSES = [
  {
    id: 1,
    courseId: 1,
    title: 'Digital Marketing Mastery — Live Q&A',
    instructor: 'Priya Sharma',
    date: '2026-07-25',
    time: '6:00 PM IST',
    zoomLink: 'https://zoom.us/j/dummy-dm-123',
    isActive: true,
    category: 'Digital Marketing',
  },
  {
    id: 2,
    courseId: 3,
    title: 'Physiotherapy Foundations — Clinical Demo',
    instructor: 'Dr. Arvind Patel',
    date: '2026-07-26',
    time: '5:00 PM IST',
    zoomLink: 'https://zoom.us/j/dummy-pt-456',
    isActive: false,
    category: 'Physiotherapy',
  },
  {
    id: 3,
    courseId: 4,
    title: 'UI/UX Bootcamp — Live Design Review',
    instructor: 'Neha Kapoor',
    date: '2026-07-28',
    time: '7:00 PM IST',
    zoomLink: 'https://zoom.us/j/dummy-ux-789',
    isActive: false,
    category: 'UI/UX Design',
  },
];

const DUMMY_CERTIFICATES = [
  {
    id: 1,
    courseTitle: 'Introduction to Web Development',
    completedDate: '2026-03-15',
    instructor: 'Rajesh Kumar',
    credentialId: 'LG-2026-WD-001',
  },
];

const DUMMY_ACTIVITY = [
  { id: 1, text: 'Completed lesson "SEO Fundamentals"', time: '2 hours ago', icon: CheckCircle, color: 'text-green-500 bg-green-50' },
  { id: 2, text: 'Joined live class "Digital Marketing Q&A"', time: '1 day ago', icon: Video, color: 'text-red-500 bg-red-50' },
  { id: 3, text: 'Started "Figma UI/UX Bootcamp"', time: '3 days ago', icon: BookOpen, color: 'text-primary bg-blue-50' },
  { id: 4, text: 'Earned certificate in Web Development', time: '1 week ago', icon: Award, color: 'text-amber bg-amber/10' },
];

const NAV_ITEMS = [
  { id: 'overview', name: 'Overview', icon: LayoutDashboard },
  { id: 'courses', name: 'My Courses', icon: BookOpen },
  { id: 'live', name: 'Live Classes', icon: Video },
  { id: 'certificates', name: 'Certificates', icon: Award },
  { id: 'settings', name: 'Settings', icon: Settings },
  { id: 'referal', name: 'Referal', icon: Gift },
  { id: 'helpDesk', name: 'HelpDesk', icon: HelpCircle },
];

// ─── Component ───────────────────────────────────────────────────────────────
export default function UserDashboard() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [activeTab, setActiveTab] = useState('overview');
  const [courses, setCourses] = useState([]);
  const [liveClasses, setLiveClasses] = useState([]);
  const [progressData, setProgressData] = useState({});
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [userName, setUserName] = useState(user?.name || '');
  const [notifications, setNotifications] = useState(true);
  const [referal, setReferal] = useState();
  const [helpDesk, setHelpDesk] = useState();
  const [screenshot, setScreenshot] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Use dummy data — no backend needed
    const enrolled = DUMMY_COURSES.filter(c => (user.enrolledCourses || [1, 3, 4]).includes(c.id));
    const live = DUMMY_LIVE_CLASSES.filter(lc => (user.enrolledCourses || [1, 3, 4]).includes(lc.courseId));
    setCourses(enrolled);
    setLiveClasses(live);

    const prog = {};
    enrolled.forEach(c => {
      prog[c.id] = user.progress?.[c.id] ?? DUMMY_PROGRESS[c.id] ?? 0;
    });
    setProgressData(prog);
    setLoading(false);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSaveSettings = () => {
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-surface">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const activeLiveClass = liveClasses.find(lc => lc.isActive);
  const completedCourses = courses.filter(c => (progressData[c.id] || 0) >= 90);
  const totalProgress = courses.length > 0
    ? Math.round(courses.reduce((sum, c) => sum + (progressData[c.id] || 0), 0) / courses.length)
    : 0;


    // File handle karne ke liye aur fir jaise image upload karne ke liye 
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if(file) setScreenshot(file);
    };

    const handleDrag = (e) => {
      const file = e.dataTransfer.files[0];
      if(file) setScreenshot(file);
    };



  // ── Tab: Overview ─────────────────────────────────────────────────────────
  const renderOverview = () => (
    <div className="space-y-6 fade-in">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-navy to-[#1a3a6b] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10">
          <BookOpen size={160} />
        </div>
        <div className="relative z-10">
          <p className="text-white/60 text-sm font-medium">Welcome back,</p>
          <h2 className="text-2xl font-bold mt-0.5">{user?.name || 'Learner'} 👋</h2>
          <p className="text-white/70 text-sm mt-2">
            You've completed <span className="text-amber font-bold">{totalProgress}%</span> of your enrolled courses. Keep going!
          </p>
          <button
            onClick={() => setActiveTab('courses')}
            className="mt-4 bg-amber text-navy text-sm font-semibold px-5 py-2 rounded-lg hover:brightness-110 transition-all flex items-center gap-2"
          >
            Continue Learning <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Active Live Class Banner */}
      {activeLiveClass && (
        <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full shrink-0">
              <Video size={22} className="animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-red-100">🔴 Live Now</p>
              <h3 className="font-bold text-lg leading-tight">{activeLiveClass.title}</h3>
              <p className="text-red-100 text-sm">{activeLiveClass.instructor}</p>
            </div>
          </div>
          <a
            href={activeLiveClass.zoomLink}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 bg-white text-red-600 font-bold px-6 py-2.5 rounded-xl hover:bg-red-50 transition-colors shadow-md text-sm"
          >
            Join on Zoom →
          </a>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Enrolled', value: courses.length, icon: BookOpen, color: 'bg-blue-50 text-primary', border: 'border-blue-100' },
          { label: 'Certificates', value: DUMMY_CERTIFICATES.length, icon: Award, color: 'bg-amber/10 text-amber', border: 'border-amber/20' },
          { label: 'Live Classes', value: liveClasses.length, icon: Video, color: 'bg-red-50 text-red-500', border: 'border-red-100' },
          { label: 'Avg Progress', value: `${totalProgress}%`, icon: Target, color: 'bg-green-50 text-green-600', border: 'border-green-100' },
        ].map((stat) => (
          <div key={stat.label} className={`bg-white rounded-xl p-4 border ${stat.border} shadow-sm flex flex-col gap-2`}>
            <div className={`w-9 h-9 rounded-lg ${stat.color} flex items-center justify-center`}>
              <stat.icon size={18} />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1F1F1F]">{stat.value}</p>
              <p className="text-xs text-muted">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Continue Learning */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[#1F1F1F]">Continue Learning</h3>
          <button onClick={() => setActiveTab('courses')} className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
            View all <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.slice(0, 2).map((course) => (
            <div key={course.id} className="bg-white border border-border rounded-xl p-4 flex gap-4 items-center shadow-sm hover:shadow-md transition-shadow group">
              <img src={course.thumbnail} alt={course.title} className="w-20 h-14 object-cover rounded-lg shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-[#1F1F1F] text-sm line-clamp-1">{course.title}</h4>
                <p className="text-xs text-muted mb-2">{course.instructor}</p>
                <ProgressBar value={progressData[course.id] || 0} />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted">{progressData[course.id] || 0}% done</span>
                  <Link to={`/dashboard/course/${course.slug}`} className="text-xs text-primary font-semibold hover:underline">
                    Resume →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-lg font-bold text-[#1F1F1F] mb-4">Recent Activity</h3>
        <div className="bg-white border border-border rounded-xl divide-y divide-gray-50 shadow-sm">
          {DUMMY_ACTIVITY.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4 hover:bg-surface transition-colors">
              <div className={`w-9 h-9 rounded-full ${item.color} flex items-center justify-center shrink-0`}>
                <item.icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#1F1F1F] font-medium">{item.text}</p>
                <p className="text-xs text-muted">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── Tab: My Courses ───────────────────────────────────────────────────────
  const renderCourses = () => (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#1F1F1F]">My Courses</h2>
        <span className="text-sm text-muted bg-white border border-border rounded-full px-3 py-1">{courses.length} enrolled</span>
      </div>
      {courses.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-border p-12 text-center">
          <BookOpen size={56} className="text-gray-200 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-[#1F1F1F]">No courses yet</h3>
          <p className="text-muted mb-6">Explore our catalog and start learning today.</p>
          <Link to="/courses" className="btn-primary inline-block">Browse Courses</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {courses.map((course) => {
            const prog = progressData[course.id] || 0;
            const completed = course.completedLessons || Math.round((prog / 100) * (course.totalLessons || 10));
            return (
              <div key={course.id} className="max-h-96 bg-white border border-border rounded-2xl overflow-hidden flex flex-col group shadow-sm hover:shadow-md transition-all">
                <div className="relative ">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-40 object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <PlayCircle size={48} className="text-white drop-shadow-lg" />
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="bg-navy/80 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
                      {course.category}
                    </span>
                  </div>
                  {prog >= 90 && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle size={12} /> Done
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4  flex flex-col">
                  <h3 className="font-bold text-[#1F1F1F] mb-2 line-clamp-2 text-base">{course.title}</h3>
                  <p className="text-sm text-muted mb-1">{course.instructor}</p>
                  <div className="flex items-center gap-1 mb-4">
                    <Star size={13} className="text-amber fill-amber" />
                    <span className="text-xs font-semibold text-[#1F1F1F]">{course.rating}</span>
                    <span className="text-xs text-muted ml-2 flex items-center gap-1">
                      <Clock size={12} /> {course.duration}
                    </span>
                  </div>
                  <div className="mt-auto">
                    <div className="flex items-center justify-between text-xs text-muted mb-1.5">
                      <span>{completed}/{course.totalLessons || 10} lessons</span>
                      <span className="font-semibold text-primary">{prog}%</span>
                    </div>
                    <ProgressBar value={prog} />
                    <Link
                      to={`/dashboard/course/${course.slug}`}
                      className="mt-4 block text-center bg-primary hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
                    >
                      {prog > 0 ? 'Continue Learning' : 'Start Course'}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  // ── Tab: Live Classes ─────────────────────────────────────────────────────
  const renderLiveClasses = () => (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#1F1F1F]">Live Classes</h2>
        <span className="text-sm text-muted bg-white border border-border rounded-full px-3 py-1">{liveClasses.length} sessions</span>
      </div>
      {liveClasses.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-border p-12 text-center">
          <Video size={56} className="text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#1F1F1F]">No live classes scheduled</h3>
          <p className="text-muted mt-2">Your enrolled courses don't have upcoming live sessions.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {liveClasses.map((lc) => {
            const dateObj = new Date(lc.date);
            const month = dateObj.toLocaleString('default', { month: 'short' });
            const day = dateObj.getDate();
            return (
              <div
                key={lc.id}
                className={`bg-white border rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm transition-all ${lc.isActive ? 'border-red-200 bg-red-50/30' : 'border-border hover:shadow-md'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`rounded-xl flex flex-col items-center justify-center min-w-[4.5rem] h-16 shrink-0 ${lc.isActive ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-primary'}`}>
                    <span className="text-xs font-bold uppercase">{month}</span>
                    <span className="text-2xl font-bold leading-none mt-0.5">{day}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-[#1F1F1F]">{lc.title}</h4>
                      {lc.isActive && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded-full animate-pulse">🔴 LIVE</span>
                      )}
                    </div>
                    <p className="text-sm text-muted mt-0.5">{lc.instructor}</p>
                    <p className="text-sm text-muted flex items-center gap-1.5 mt-1">
                      <Calendar size={13} /> {lc.time}
                    </p>
                  </div>
                </div>
                {lc.isActive ? (
                  <a
                    href={lc.zoomLink}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 w-full sm:w-auto text-center bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-colors text-sm"
                  >
                    Join Now →
                  </a>
                ) : (
                  <div className="shrink-0 w-full sm:w-auto text-center bg-surface border border-border text-muted font-medium py-2.5 px-6 rounded-xl text-sm">
                    Upcoming
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  // ── Tab: Certificates ─────────────────────────────────────────────────────
  const renderCertificates = () => {
    const allCertificates = [
      ...DUMMY_CERTIFICATES,
      ...completedCourses.map(c => ({
        id: `completed-${c.id}`,
        courseTitle: c.title,
        completedDate: new Date().toISOString().split('T')[0],
        instructor: c.instructor,
        credentialId: `LG-2026-${c.id.toString().padStart(3, '0')}`,
      }))
    ];

    return (
      <div className="fade-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#1F1F1F]">My Certificates</h2>
          <span className="text-sm text-muted bg-white border border-border rounded-full px-3 py-1">{allCertificates.length} earned</span>
        </div>
        {allCertificates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {allCertificates.map((cert) => (
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
                  <p className="text-sm text-muted mb-3">Instructor: {cert.instructor}</p>
                  <div className="flex items-center justify-between text-xs text-muted border-t border-border pt-3">
                    <div>
                      <p className="font-medium text-[#1F1F1F]">{new Date(cert.completedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      <p>ID: {cert.credentialId}</p>
                    </div>
                    <button className="flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-colors">
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
            <p className="text-muted max-w-sm mx-auto">Complete a course to earn your certificate and showcase your skills.</p>
            <button onClick={() => setActiveTab('courses')} className="mt-6 btn-primary inline-block">
              Go to My Courses
            </button>
          </div>
        )}
      </div>
    );
  };

   // ── Tab: Settings ─────────────────────────────────────────────────────
  const renderSettings = () => (
    <div className="fade-in max-w-2xl">
      <h2 className="text-2xl font-bold text-[#1F1F1F] mb-6">Account Settings</h2>

      {settingsSaved && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm p-3 rounded-xl mb-6 fade-in">
          <CheckCircle size={16} /> Settings saved successfully!
        </div>
      )}

      <div className="space-y-6">
        {/* Profile Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
          <h3 className="text-base font-bold text-[#1F1F1F] border-b border-border pb-3 mb-5">Profile Information</h3>
          <div className="flex items-center gap-5 mb-6">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center text-white text-2xl font-bold shadow-md shrink-0">
              {user?.avatar || 'U'}
            </div>
            <div>
              <p className="font-semibold text-[#1F1F1F]">{user?.name}</p>
              <p className="text-sm text-muted">{user?.email}</p>
              <button className="mt-2 text-xs text-primary font-semibold border border-primary/30 rounded-lg px-3 py-1 hover:bg-primary hover:text-white transition-colors">
                Change Photo
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1F1F1F] mb-1.5">Full Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full border border-border rounded-xl px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 bg-surface text-sm transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1F1F1F] mb-1.5">Email Address</label>
              <input
                type="email"
                defaultValue={user?.email}
                disabled
                className="w-full border border-border rounded-xl px-4 py-2.5 text-muted bg-gray-50 cursor-not-allowed text-sm"
              />
            </div>
          </div>
        </div>

        {/* Password */}
        <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
          <h3 className="text-base font-bold text-[#1F1F1F] border-b border-border pb-3 mb-5">Change Password</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1F1F1F] mb-1.5">New Password</label>
              <input type="password" placeholder="••••••••" className="w-full border border-border rounded-xl px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 bg-surface text-sm transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1F1F1F] mb-1.5">Confirm Password</label>
              <input type="password" placeholder="••••••••" className="w-full border border-border rounded-xl px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 bg-surface text-sm transition-all" />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
          <h3 className="text-base font-bold text-[#1F1F1F] border-b border-border pb-3 mb-5">Notifications</h3>
          <div className="space-y-4">
            {[
              { label: 'Email notifications', desc: 'Receive updates about your courses via email' },
              { label: 'Live class reminders', desc: 'Get notified 30 minutes before a live session' },
              { label: 'New course announcements', desc: 'Be the first to know about new courses' },
            ].map((notif, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-[#1F1F1F]">{notif.label}</p>
                  <p className="text-xs text-muted mt-0.5">{notif.desc}</p>
                </div>
                <button
                  onClick={() => setNotifications(n => !n)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${i === 0 ? (notifications ? 'bg-primary' : 'bg-gray-200') : 'bg-primary'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${i === 0 ? (notifications ? 'left-6' : 'left-1') : 'left-6'} shadow-sm`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-3">
          <button onClick={handleSaveSettings} className="btn-primary px-8">
            Save Changes
          </button>
          <button onClick={handleLogout} className="flex items-center gap-2 border border-red-200 text-red-500 font-semibold text-sm px-5 py-2.5 rounded-btn hover:bg-red-50 transition-colors">
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );

  // ── Tab: Referal ─────────────────────────────────────────────────────
  const renderReferal = () => (
    <div className='fade-in max-w-3xl lg:max-w-7xl'>

      {/* Header Banner */}
      <div className='w-full rounded-2xl p-6 mb-8 text-white relative overflow-hidden' style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)' }}>
        <div className='absolute top-0 right-0 w-56 h-56 rounded-full opacity-10' style={{ background: 'radial-gradient(circle, #f97316, transparent)', transform: 'translate(30%, -30%)' }} />
        <div className='absolute bottom-0 left-0 w-40 h-40 rounded-full opacity-10' style={{ background: 'radial-gradient(circle, #22c55e, transparent)', transform: 'translate(-30%, 30%)' }} />
        <div className='relative z-10 flex justify-between items-center'>
          <div>
            <div className='flex items-center gap-2 mb-2'>
              <Gift size={20} className='text-orange-400' />
              <span className='text-orange-400 text-sm font-semibold uppercase tracking-wider'>Referral Program</span>
            </div>
            <h1 className='text-2xl font-black text-white mb-1'>Refer & Earn Rewards</h1>
            <p className='text-white/60 text-sm'>Invite your friends and earn 200 Point for every successful referral</p>
          </div>
          <div className='hidden sm:flex flex-col items-center bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-sm'>
            <span className='text-3xl font-black text-orange-400'>2,200 Point</span>
            <span className='text-white/60 text-xs mt-1'>Total Earned</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='w-full grid grid-cols-2 md:grid-cols-3 gap-4 mb-8'>
        <div className='rounded-2xl p-5 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow'>
          <div className='w-10 h-10 rounded-xl flex items-center justify-center mb-3' style={{ background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)' }}>
            <Gift size={18} className='text-blue-600' />
          </div>
          <p className='text-3xl font-black text-[#1a1a2e]'>18</p>
          <p className='text-sm text-gray-500 mt-0.5'>Total Invites</p>
        </div>
        <div className='rounded-2xl p-5 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow'>
          <div className='w-10 h-10 rounded-xl flex items-center justify-center mb-3' style={{ background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)' }}>
            <CheckCircle size={18} className='text-green-600' />
          </div>
          <p className='text-3xl font-black text-[#1a1a2e]'>11</p>
          <p className='text-sm text-gray-500 mt-0.5'>Successful</p>
        </div>
        <div className='col-span-2 md:col-span-1 rounded-2xl p-5 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow'>
          <div className='w-10 h-10 rounded-xl flex items-center justify-center mb-3' style={{ background: 'linear-gradient(135deg, #fef3c7, #fde68a)' }}>
            <Star size={18} className='text-amber-500' />
          </div>
          <p className='text-3xl font-black text-[#1a1a2e]'>1,200</p>
          <p className='text-sm text-gray-500 mt-0.5'>Total Points</p>
        </div>
      </div>

      {/* Referral Link Card */}
      <div className='p-6 bg-white border border-gray-100 shadow-sm rounded-2xl mb-8'>
        <h3 className='text-base font-bold text-[#1a1a2e] mb-1'>Your Referral Link</h3>
        <p className='text-xs text-gray-400 mb-4'>Share this link with your friends to start earning</p>

        <div className='flex gap-2'>
          <div className='flex-1 flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3'>
            <span className='w-2 h-2 rounded-full bg-green-500 flex-shrink-0' />
            <span className='text-sm text-gray-600 font-mono truncate'>myapp.com/ref/rahul90</span>
          </div>
          <button className='flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:brightness-90 active:scale-95 flex-shrink-0' style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
            <Copy size={15} />
            Copy
          </button>
        </div>

        <div className='w-full mt-4 grid grid-cols-3 gap-3'>
          <button className='flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-sm font-semibold text-[#1a1a2e]'>
            <BsWhatsapp size={16} className='text-green-500' />
            WhatsApp
          </button>
          <button className='flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-sm font-semibold text-[#1a1a2e]'>
            <MdEmail size={16} className='text-red-500' />
            Email
          </button>
          <button className='flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-sm font-semibold text-[#1a1a2e]'>
            <MdOtherHouses size={16} className='text-purple-500' />
            More
          </button>
        </div>
      </div>

      {/* Recent Referrals */}
      <div className='bg-white border border-gray-100 shadow-sm rounded-2xl p-6'>
        <div className='flex items-center justify-between mb-5'>
          <div>
            <h3 className='text-base font-bold text-[#1a1a2e]'>Recent Referrals</h3>
            <p className='text-xs text-gray-400 mt-0.5'>Track who joined using your link</p>
          </div>
          <span className='text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full'>5 Referrals</span>
        </div>

        <div className='space-y-3'>

  <div className='flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all'>
    <div className='flex items-center gap-3'>
      <div className='w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0'
        style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
        PS
      </div>
      <div>
        <p className='text-sm font-semibold text-[#1a1a2e]'>Priya Sharma</p>
        <p className='text-xs text-gray-400'>Joined on 25 Jul 2026</p>
      </div>
    </div>
    <span className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-green-700 bg-green-100'>
      <CheckCircle size={12} />200 point Earned
    </span>
  </div>

  <div className='flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all'>
    <div className='flex items-center gap-3'>
      <div className='w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0'
        style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
        RY
      </div>
      <div>
        <p className='text-sm font-semibold text-[#1a1a2e]'>Rohan Yadav</p>
        <p className='text-xs text-gray-400'>Joined on 23 Jul 2026</p>
      </div>
    </div>
    <span className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-green-700 bg-green-100'>
      <CheckCircle size={12} />200 point Earned
    </span>
  </div>

  <div className='flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all'>
    <div className='flex items-center gap-3'>
      <div className='w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0'
        style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
        AB
      </div>
      <div>
        <p className='text-sm font-semibold text-[#1a1a2e]'>Akhilesh Bhardwaj</p>
        <p className='text-xs text-gray-400'>Joined on 20 Jul 2026</p>
      </div>
    </div>
    <span className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-amber-700 bg-amber-100'>
      <Clock size={12} />Pending
    </span>
  </div>

  <div className='flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all'>
    <div className='flex items-center gap-3'>
      <div className='w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0'
        style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
        AK
      </div>
      <div>
        <p className='text-sm font-semibold text-[#1a1a2e]'>Amit Kumar</p>
        <p className='text-xs text-gray-400'>Joined on 18 Jul 2026</p>
      </div>
    </div>
    <span className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-green-700 bg-green-100'>
      <CheckCircle size={12} />200 Point Earned
    </span>
  </div>

  <div className='flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all'>
    <div className='flex items-center gap-3'>
      <div className='w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0'
        style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
        SV
      </div>
      <div>
        <p className='text-sm font-semibold text-[#1a1a2e]'>Sneha Verma</p>
        <p className='text-xs text-gray-400'>Joined on 16 Jul 2026</p>
      </div>
    </div>
    <span className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-amber-700 bg-amber-100'>
      <Clock size={12} />Pending
    </span>
  </div>

</div>
      </div>
    </div>
  );

  // ── Tab: HelpDesk ─────────────────────────────────────────────────────
  const renderhelpDesk = () => (
    <div className='fade-in max-w-3xl lg:max-w-7xl'>

      {/* Header Banner */}
      <div className='w-full rounded-2xl p-6 mb-8 text-white relative overflow-hidden' style={{ background: 'linear-gradient(135deg, #0f3460 0%, #16213e 60%, #1a1a2e 100%)' }}>
        <div className='absolute top-0 right-0 w-56 h-56 rounded-full opacity-10' style={{ background: 'radial-gradient(circle, #60a5fa, transparent)', transform: 'translate(30%, -30%)' }} />
        <div className='absolute bottom-0 left-0 w-40 h-40 rounded-full opacity-10' style={{ background: 'radial-gradient(circle, #818cf8, transparent)', transform: 'translate(-30%, 30%)' }} />
        <div className='relative z-10 flex justify-between items-center'>
          <div>
            <div className='flex items-center gap-2 mb-2'>
              <Headset size={20} className='text-blue-400' />
              <span className='text-blue-400 text-sm font-semibold uppercase tracking-wider'>Support Center</span>
            </div>
            <h1 className='text-2xl font-black text-white mb-1'>Help Desk</h1>
            <p className='text-white/60 text-sm'>We're here to help — raise a ticket or browse FAQs</p>
          </div>
          <div className='hidden sm:flex flex-col items-center bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-sm'>
            <span className='text-2xl font-black text-blue-300'>2h</span>
            <span className='text-white/60 text-xs mt-1'>Avg Response</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='w-full grid grid-cols-2 md:grid-cols-3 gap-4 mb-8'>
        <div className='rounded-2xl p-5 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow'>
          <div className='w-10 h-10 rounded-xl flex items-center justify-center mb-3' style={{ background: 'linear-gradient(135deg, #fef3c7, #fde68a)' }}>
            <TimerIcon size={18} className='text-amber-600' />
          </div>
          <p className='text-3xl font-black text-[#1a1a2e]'>3</p>
          <p className='text-sm text-gray-500 mt-0.5'>Open Tickets</p>
        </div>
        <div className='rounded-2xl p-5 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow'>
          <div className='w-10 h-10 rounded-xl flex items-center justify-center mb-3' style={{ background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)' }}>
            <CheckCircle size={18} className='text-green-600' />
          </div>
          <p className='text-3xl font-black text-[#1a1a2e]'>27</p>
          <p className='text-sm text-gray-500 mt-0.5'>Resolved</p>
        </div>
        <div className='col-span-2 md:col-span-1 rounded-2xl p-5 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow'>
          <div className='w-10 h-10 rounded-xl flex items-center justify-center mb-3' style={{ background: 'linear-gradient(135deg, #ede9fe, #ddd6fe)' }}>
            <SiRapid size={18} className='text-purple-600' />
          </div>
          <p className='text-3xl font-black text-[#1a1a2e]'>2h</p>
          <p className='text-sm text-gray-500 mt-0.5'>Avg Response</p>
        </div>
      </div>

      {/* Two-column layout: Form + Recent Tickets */}
      <div className='w-full flex flex-col xl:flex-row gap-6'>

        {/* Raise a Ticket Form */}
        <div className='flex-1 bg-white border border-gray-100 shadow-sm rounded-2xl p-6'>
          <h3 className='text-base font-bold text-[#1a1a2e] mb-1'>Raise a New Ticket</h3>
          <p className='text-xs text-gray-400 mb-5'>Fill in your details and our team will get back to you.</p>

          <form action='' className='space-y-4'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div className='flex flex-col gap-1.5'>
                <label htmlFor='name' className='text-xs font-semibold text-gray-600 uppercase tracking-wide'>Full Name</label>
                <input type='text' name='name' placeholder='Rahul Sharma'
                  className='w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all' />
              </div>
              <div className='flex flex-col gap-1.5'>
                <label htmlFor='email' className='text-xs font-semibold text-gray-600 uppercase tracking-wide'>Email</label>
                <input type='email' name='email' placeholder='rahul@email.com'
                  className='w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all' />
              </div>
              <div className='flex flex-col gap-1.5'>
                <label htmlFor='PhoneNumber' className='text-xs font-semibold text-gray-600 uppercase tracking-wide'>Phone Number</label>
                <input type='tel' name='phone' placeholder='+91 9876543210'
                  className='w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all' />
              </div>
              <div className='flex flex-col gap-1.5'>
                <label htmlFor='issuecategory' className='text-xs font-semibold text-gray-600 uppercase tracking-wide'>Issue Category</label>
                <select name='issuecategory' id='issuecategory'
                  className='w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all'>
                  <option value='Paymentissue'>Payment Issue</option>
                  <option value='accountissue'>Account Issue</option>
                  <option value='classissue'>Classes Issue</option>
                  <option value='other'>Other</option>
                </select>
              </div>
            </div>

            <div className='flex flex-col gap-1.5'>
              <label htmlFor='describeyourissue' className='text-xs font-semibold text-gray-600 uppercase tracking-wide'>Describe Your Issue</label>
              <textarea name='message' id='message' rows={4} placeholder='Tell us what happened…'
                className='w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all resize-none' />
            </div>

            <div className='flex flex-col gap-1.5'>
              <label className='text-xs font-semibold text-gray-600 uppercase tracking-wide'>Attach Screenshot</label>
              <div
                onClick={() => fileInputRef.current.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrag}
                className='w-full border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-all'
              >
                <div className='w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center'>
                  <ImagePlus size={20} className='text-gray-400' />
                </div>
                <p className='text-sm font-medium text-gray-600'>
                  {screenshot ? screenshot.name : 'Click to upload or drag & drop'}
                </p>
                <p className='text-xs text-gray-400'>PNG, JPG up to 5MB</p>
                <input ref={fileInputRef} type='file' accept='image/png, image/jpeg' onChange={handleFileChange} className='hidden' />
              </div>
            </div>

            <button type='submit' className='w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:brightness-90 active:scale-95'
              style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
              Submit Ticket
            </button>
          </form>
        </div>

        {/* Recent Tickets */}
        <div className='xl:w-[380px] bg-white border border-gray-100 shadow-sm rounded-2xl p-6 flex flex-col'>
          <div className='flex items-center justify-between mb-5'>
            <div>
              <h3 className='text-base font-bold text-[#1a1a2e]'>Recent Tickets</h3>
              <p className='text-xs text-gray-400 mt-0.5'>Your submitted support requests</p>
            </div>
            <span className='text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full'>3 Tickets</span>
          </div>

          <div className='space-y-3 flex-1'>
            {[
              { title: 'Payment Failed during checkout', id: '#1042', time: 'Today',      status: 'progress' },
              { title: 'Website keeps crashing',         id: '#1039', time: '2 days ago', status: 'resolved' },
              { title: 'Unable to log in',               id: '#1035', time: '4 days ago', status: 'pending'  },
            ].map((ticket, i) => (
              <div key={i} className='p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all'>
                <div className='flex items-start justify-between gap-3'>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-semibold text-[#1a1a2e] leading-snug truncate'>{ticket.title}</p>
                    <p className='text-xs text-gray-400 mt-1'>Ticket {ticket.id} · {ticket.time}</p>
                  </div>
                  {ticket.status === 'resolved' &&
                    <span className='shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold text-green-700 bg-green-100'>
                      <CheckCircle size={11} />Resolved
                    </span>}
                  {ticket.status === 'progress' &&
                    <span className='shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold text-amber-700 bg-amber-100'>
                      <Clock size={11} />In Progress
                    </span>}
                  {ticket.status === 'pending' &&
                    <span className='shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold text-red-700 bg-red-100'>
                      <TimerIcon size={11} />Pending
                    </span>}
                </div>
              </div>
            ))}
          </div>

          {/* Quick contact links */}
          <div className='mt-6 pt-5 border-t border-gray-100'>
            <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3'>Need immediate help?</p>
            <div className='space-y-2'>
              <a href='https://wa.me/' target='_blank' rel='noreferrer'
                className='flex items-center gap-3 px-4 py-2.5 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50 transition-all'>
                <div className='w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0'>
                  <BsWhatsapp size={14} className='text-green-600' />
                </div>
                <span className='text-sm font-medium text-gray-700'>WhatsApp Support</span>
              </a>
              <a href='mailto:support@learngrow.com'
                className='flex items-center gap-3 px-4 py-2.5 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all'>
                <div className='w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0'>
                  <MdEmail size={14} className='text-blue-600' />
                </div>
                <span className='text-sm font-medium text-gray-700'>Email Support</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  )

 


  // ── Sidebar ───────────────────────────────────────────────────────────────
  const Sidebar = ({ mobile = false }) => (
    <aside className={mobile
      ? 'fixed inset-0 z-50 flex'
      : 'w-64 bg-navy text-white h-full hidden lg:flex flex-col border-r border-white/10 shrink-0 overflow-y-auto border-t-2 border-navy'
    }>
      {mobile && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}
      <div className={`${mobile ? 'relative z-10 w-72 max-w-[85vw] bg-navy flex flex-col h-full overflow-y-auto' : 'flex flex-col flex-1'}`}>
        {/* User Profile */}
        <div className="p-6 border-b border-white/10">
          {mobile && (
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 text-white/60 hover:text-white">
              <X size={20} />
            </button>
          )}
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center text-white font-bold text-lg shrink-0">
              {user?.avatar || 'U'}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-white text-sm truncate">{user?.name || 'Learner'}</p>
              <p className="text-white/50 text-xs truncate">{user?.email}</p>
            </div>
          </div>
          {/* Mini Stats */}
          <div className="flex gap-3 mt-4">
            <div className="flex-1 bg-white/10 rounded-lg p-2 text-center">
              <p className="text-lg font-bold text-white">{courses.length}</p>
              <p className="text-white/50 text-xs">Courses</p>
            </div>
            <div className="flex-1 bg-white/10 rounded-lg p-2 text-center">
              <p className="text-lg font-bold text-amber">{totalProgress}%</p>
              <p className="text-white/50 text-xs">Progress</p>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="p-4 flex-1 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); if (mobile) setSidebarOpen(false); }}
              className={`flex items-center gap-3 w-full px-4 py-3 text-left rounded-xl transition-all duration-200 text-sm font-medium ${activeTab === item.id
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}
            >
              <item.icon size={18} />
              {item.name}
              {activeTab === item.id && <ChevronRight size={14} className="ml-auto" />}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-white/5 rounded-xl transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="h-screen flex flex-col bg-surface font-sans overflow-hidden">
      <Helmet>
        <title>Dashboard | LearnGrow</title>
      </Helmet>

      <Navbar />

      <div className="flex flex-1 overflow-hidden w-full">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Mobile Sidebar */}
        {sidebarOpen && <Sidebar mobile />}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto min-w-0">
          {/* Mobile Top Bar */}
          <div className="lg:hidden bg-navy text-white px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-2 text-white/80 hover:text-white"
            >
              <Menu size={22} />
              <span className="text-sm font-medium capitalize">{activeTab}</span>
            </button>
            {/* Mobile tab pills */}
            <div className="flex overflow-x-auto gap-1.5 no-scrollbar ml-4">
              {NAV_ITEMS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${activeTab === tab.id ? 'bg-primary text-white' : 'bg-white/10 text-white/70'
                    }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 sm:p-6 lg:p-8 pb-20">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'courses' && renderCourses()}
            {activeTab === 'live' && renderLiveClasses()}
            {activeTab === 'certificates' && renderCertificates()}
            {activeTab === 'referal' &&
              renderReferal()}
            {activeTab === 'helpDesk' &&
              renderhelpDesk()}
              {activeTab === 'settings' && renderSettings()}
          </div>
        </main>
      </div>
    </div>
  );
}