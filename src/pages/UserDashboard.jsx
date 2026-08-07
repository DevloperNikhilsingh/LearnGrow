/**
 * pages/UserDashboard.jsx
 * Fully functional with dummy data — no backend needed
 */
import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen, PlayCircle, Award, Calendar, Video, Settings as SettingsIcon, User,
  LayoutDashboard, LogOut, Menu, X, ChevronRight, Target,
  HelpCircle,
  MessageCircle,
  Phone,
  ImagePlus,
  TimerIcon,
  AlertCircle
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { getCurrentUser, logout } from '../services/authService';
import Setting from '../components/UserDashboard/Setting';
import LiveClasses from '../components/UserDashboard/LiveClasses';
import MyCourses from '../components/UserDashboard/MyCourses';
import Overview from '../components/UserDashboard/Overview';
import Certificates from '../components/UserDashboard/Certificate';
import Referal from '../components/UserDashboard/Referal';
import HelpDesk from '../components/UserDashboard/HelpDesk';

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
  { id: 'settings', name: 'Settings', icon: SettingsIcon },
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
  const [notifications, setNotifications] = useState({
    email: true,
    liveClasses: true,
    newCourses: true,
  });
  const [referal, setReferal] = useState();
  const [helpDesk, setHelpDesk] = useState();
  const [screenshot, setScreenshot] = useState(null);
  const fileInputRef = useRef(null);
  const [ticketForm, setTicketForm] = useState({ name: '', email: '', phone: '', issuecategory: 'Paymentissue', message: '' });
  const [ticketErrors, setTicketErrors] = useState({});
  const [toast, setToast] = useState(null);

  // Setting me (notifications, liveclasses, newCourses) ye sab notification on of karne ka logic hai
  const toggleNotif = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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
    if (file) setScreenshot(file);
  };

  const handleDrag = (e) => {
    const file = e.dataTransfer.files[0];
    if (file) setScreenshot(file);
  };

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    const errors = validateTicketForm();
    setTicketErrors(errors);

    if (Object.keys(errors).length > 0) {
      showToast('error', 'Please fix the errors in the form');
      return;
    }

    // Dummy submit — no backend
    showToast('success', 'Ticket submitted successfully! We\'ll get back to you soon.');
    setTicketForm({ name: '', email: '', phone: '', issuecategory: 'Paymentissue', message: '' });
    setTicketErrors({});
    setScreenshot(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

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

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-4 z-[100] fade-in">
          <div className={`flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg border max-w-sm ${toast.type === 'success'
            ? 'bg-white border-green-200 text-green-700'
            : 'bg-white border-red-200 text-red-700'
            }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${toast.type === 'success' ? 'bg-green-100' : 'bg-red-100'
              }`}>
              {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            </div>
            <p className="text-sm font-medium">{toast.text}</p>
          </div>
        </div>
      )}

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
            {activeTab === 'overview' && <Overview user={user} courses={courses} progressData={progressData} liveClasses={liveClasses} totalProgress={totalProgress} activeLiveClass={activeLiveClass} setActiveTab={setActiveTab} certificatesCount={DUMMY_CERTIFICATES.length}
              activity={DUMMY_ACTIVITY} />}
            {activeTab === 'courses' && <MyCourses courses={courses} progressData={progressData} />}
            {activeTab === 'live' && <LiveClasses liveClasses={liveClasses} />}
            {activeTab === 'certificates' && <Certificates certificates={DUMMY_CERTIFICATES} setActiveTab={setActiveTab} completedCourses={completedCourses} />}
            {activeTab === 'referal' && <Referal user={user} />}
            {activeTab === 'helpDesk' && <HelpDesk />}
            {activeTab === 'settings' &&  <Setting user={user} userName={userName} setUserName={setUserName} notifications={notifications} toggleNotif={toggleNotif} settingsSaved={settingsSaved} handleSaveSettings={handleSaveSettings} handleLogout={handleLogout}/>}
          </div>
        </main>
      </div>
    </div>
  );
}