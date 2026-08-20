/**
 * pages/CoursePlayer.jsx
 */
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronLeft, CheckCircle2, Circle, Video, Radio, Menu, X, Check, Lock, FileCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import VideoPlayer from '../components/course/VideoPlayer';
import ProgressBar from '../components/ui/ProgressBar';
import { getCourseBySlug } from '../services/courseService';
import { getCurrentUser } from '../services/authService';
import { getCourseProgress, updateProgress } from '../services/userService';
import liveClassesData from '../data/liveClasses';

export default function CoursePlayer() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const [maxTimeReached, setMaxTimeReached] = useState(0);
  const [canMarkComplete, setCanMarkComplete] = useState(false);

  const lessonTitleRef = useRef(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }

    getCourseBySlug(slug).then(async (data) => {
      if (!data) {
        navigate('/dashboard');
        return;
      }
      setCourse(data);

      if (data.curriculum.length > 0 && data.curriculum[0].lessons.length > 0) {
        setActiveLesson(data.curriculum[0].lessons[0]);
      }

      const currentProgress = await getCourseProgress(data.id);
      setProgress(currentProgress);

      const allLessonIds = data.curriculum.flatMap(s => s.lessons.map(l => l.id));
      const numCompleted = Math.floor((currentProgress / 100) * allLessonIds.length);
      setCompletedLessons(allLessonIds.slice(0, numCompleted));

      setLoading(false);
    });
  }, [slug, navigate]);

  useEffect(() => {
    if (!activeLesson || !lessonTitleRef.current) return;
    const letters = lessonTitleRef.current.querySelectorAll('[data-letter]');
    gsap.fromTo(
      letters,
      { opacity: 0, rotateX: -90, y: 12, transformOrigin: '50% 100%' },
      {
        opacity: 1,
        rotateX: 0,
        y: 0,
        duration: 0.6,
        ease: 'back.out(1.7)',
        stagger: 0.025,
      }
    );
  }, [activeLesson]);

  useEffect(() => {
    setMaxTimeReached(0);
    setCanMarkComplete(false);
  }, [activeLesson?.id]);

  useEffect(() => {
    if (activeLesson && completedLessons.includes(activeLesson.id)) {
      setCanMarkComplete(true);
    }
  }, [activeLesson, completedLessons]);

  const handleLessonSelect = (lesson) => {
    setActiveLesson(lesson);
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const handleToggleComplete = async (lessonId) => {
    if (!completedLessons.includes(lessonId) && !canMarkComplete) return;

    let newCompleted;
    if (completedLessons.includes(lessonId)) {
      newCompleted = completedLessons.filter(id => id !== lessonId);
    } else {
      newCompleted = [...completedLessons, lessonId];
    }
    setCompletedLessons(newCompleted);

    const totalLessons = course.curriculum.reduce((acc, s) => acc + s.lessons.length, 0);
    const newProgress = Math.round((newCompleted.length / totalLessons) * 100);
    setProgress(newProgress);
    await updateProgress(course.id, newProgress);
  };

  const handleTimeUpdate = (e) => {
    const video = e.target;
    if (!video || !video.duration) return;
    const current = video.currentTime;

    if (current > maxTimeReached + 1) {
      video.currentTime = maxTimeReached;
      return;
    }

    if (current > maxTimeReached) {
      setMaxTimeReached(current);
    }

    const percent = (current / video.duration) * 100;
    if (percent >= 90 && !canMarkComplete) {
      setCanMarkComplete(true);
    }
  };

  const handleSeeking = (e) => {
    const video = e.target;
    if (!video) return;
    if (video.currentTime > maxTimeReached + 1) {
      video.currentTime = maxTimeReached;
    }
  };

  if (loading || !course) {
    return (
      <div className="min-h-screen bg-[#1F1F1F] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isLessonLiveNow = activeLesson?.isLive &&
    liveClassesData.some(lc => lc.courseId === course.id && lc.isActive);

  const isActiveDone = completedLessons.includes(activeLesson?.id);
  const isCourseComplete = progress >= 100;
  const isMarkButtonDisabled = !isActiveDone && !canMarkComplete;

  return (
    <div className="min-h-screen flex flex-col bg-surface overflow-hidden h-screen">
      <Helmet>
        <title>{activeLesson?.title || course.title} | Player</title>
      </Helmet>

      <header className="bg-navy text-white h-16 flex items-center justify-between px-4 sm:px-6 flex-shrink-0 z-20 shadow-md">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-white/70 hover:text-white transition-colors flex items-center gap-1">
            <ChevronLeft size={20} /> <span className="hidden sm:inline font-medium">Dashboard</span>
          </Link>
          <div className="h-6 w-px bg-white/20 mx-2 hidden sm:block"></div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-3 w-48">
            <ProgressBar value={progress} className="w-full" showLabel={false} />
            <span className="text-sm font-semibold">{progress}%</span>
          </div>
          <button
            className="lg:hidden text-white"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        <main className={`flex-1 flex flex-col overflow-y-auto bg-white transition-all duration-300 ${isSidebarOpen ? 'lg:mr-80' : ''}`}>

          <div className="bg-black w-full aspect-video flex-shrink-0">
            {activeLesson?.isLive ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-[#1F1F1F] text-white p-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')] opacity-10" />
                <Radio size={48} className={isLessonLiveNow ? "text-red-500 animate-pulse mb-4" : "text-muted mb-4"} />
                <h2 className="text-2xl font-bold mb-2">{activeLesson.title}</h2>
                <p className="text-white/60 mb-6">This is a live session via Zoom.</p>
                {isLessonLiveNow ? (
                  <a href={activeLesson.zoomLink} target="_blank" rel="noreferrer" className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-btn transition-colors relative z-10 shadow-lg shadow-red-500/30">
                    Join Zoom Session Now
                  </a>
                ) : (
                  <div className="bg-white/10 px-6 py-3 rounded-btn border border-white/20 text-white/80 relative z-10">
                    This session is not currently active.
                  </div>
                )}
              </div>
            ) : (
              <VideoPlayer
                src={activeLesson?.videoUrl}
                poster={course.thumbnail}
                title={activeLesson?.title}
                className="w-full h-full rounded-none"
                onTimeUpdate={handleTimeUpdate}
                onSeeking={handleSeeking}
              />
            )}
          </div>

          <div className="p-4 sm:p-8 max-w-4xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2
                ref={lessonTitleRef}
                className="text-2xl font-bold text-[#1F1F1F]"
                style={{ perspective: 400 }}
                aria-label={activeLesson?.title}
              >
                {activeLesson?.title?.split('').map((char, i) => (
                  <span key={i} data-letter className="inline-block" style={{ opacity: 0 }}>
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
              </h2>

              <motion.button
                onClick={() => handleToggleComplete(activeLesson.id)}
                disabled={isMarkButtonDisabled}
                whileTap={{ scale: isMarkButtonDisabled ? 1 : 0.94 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-btn font-semibold text-sm transition-colors border ${
                  isActiveDone
                  ? 'bg-success/10 text-success border-success/30'
                  : isMarkButtonDisabled
                    ? 'bg-white border-border text-muted cursor-not-allowed opacity-60'
                    : 'bg-white border-border text-[#1F1F1F] hover:bg-surface'
                }`}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isActiveDone ? (
                    <motion.span
                      key="done"
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.6, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-2"
                    >
                      <Check size={18} /> Completed
                    </motion.span>
                  ) : isMarkButtonDisabled ? (
                    <motion.span
                      key="locked"
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.6, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-2"
                    >
                      <Lock size={16} /> Watch video to unlock
                    </motion.span>
                  ) : (
                    <motion.span
                      key="pending"
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.6, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-2"
                    >
                      <Circle size={18} /> Mark as complete
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>

            <div className="flex border-b border-border mb-6">
              {['overview', 'resources'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 font-semibold text-sm capitalize transition-colors ${
                    activeTab === tab
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted hover:text-[#1F1F1F]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="text-[#1F1F1F] leading-relaxed">
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="space-y-4"
                  >
                    <h3 className="font-bold text-lg">About this lesson</h3>
                    <p>This lesson covers the essential concepts related to {activeLesson?.title}. Make sure to take notes and follow along with any provided exercises.</p>
                    <p className="text-muted text-sm mt-8 border-t border-border pt-4">Instructor: {course.instructor}</p>
                  </motion.div>
                )}
                {activeTab === 'resources' && (
                  <motion.div
                    key="resources"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="space-y-4"
                  >
                    <h3 className="font-bold text-lg">Downloadable Resources</h3>
                    <div className="border border-border rounded-lg p-4 flex items-center justify-between bg-surface">
                      <span className="font-medium">presentation_slides.pdf</span>
                      <button className="text-primary font-semibold text-sm hover:underline">Download</button>
                    </div>
                  </motion.div>
                )}
                {activeTab === 'test' && isCourseComplete && (
                  <motion.div
                    key="test"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="text-center py-8 sm:py-10 px-4 border border-border rounded-lg bg-surface"
                  >
                    <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 bg-primary/10">
                      <FileCheck size={26} className="text-primary" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Final Assessment</h3>
                    <p className="text-muted max-w-sm mx-auto mb-6">
                      You've completed the course. Take the test to earn your certificate.
                    </p>
                    <button
                      onClick={() => navigate(`/course/${slug}/test`)}
                      className="btn-primary px-6 py-2.5 rounded-btn font-semibold text-sm"
                    >
                      Start Test
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>

        <aside
          className={`absolute lg:fixed right-0 top-16 bottom-0 w-80 bg-white border-l border-border flex flex-col transition-transform duration-300 z-10 ${
            isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-4 border-b border-border bg-surface font-bold text-[#1F1F1F]">
            Course Content
          </div>
          <div className="flex-1 overflow-y-auto">
            {course.curriculum.map((section, sIdx) => (
              <div key={sIdx} className="border-b border-border">
                <div className="px-4 py-3 bg-surface/50 font-semibold text-sm text-[#1F1F1F]">
                  Section {sIdx + 1}: {section.section}
                </div>
                <ul className="divide-y divide-border">
                  {section.lessons.map((lesson) => {
                    const isDone = completedLessons.includes(lesson.id);
                    const isActive = activeLesson?.id === lesson.id;
                    return (
                      <li key={lesson.id}>
                        <button
                          onClick={() => handleLessonSelect(lesson)}
                          className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${
                            isActive ? 'bg-blue-50/50' : 'hover:bg-surface'
                          }`}
                        >
                          <div className="mt-0.5">
                            {isDone
                              ? <CheckCircle2 size={16} className="text-success" />
                              : lesson.isLive
                                ? <Radio size={16} className={isActive ? "text-primary" : "text-muted"} />
                                : <Video size={16} className={isActive ? "text-primary" : "text-muted"} />
                            }
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm ${isActive ? 'font-bold text-[#1F1F1F]' : 'font-medium text-[#1F1F1F]'}`}>
                              {lesson.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-muted">{lesson.duration}</span>
                              {lesson.isLive && (
                                <span className="text-[10px] font-bold uppercase tracking-wider text-red-500 bg-red-50 px-1.5 py-0.5 rounded">Live</span>
                              )}
                            </div>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}

            {/* Final Test - always last, locked until course is 100% complete */}
            <div className="border-b border-border">
              <div className="px-4 py-3 bg-surface/50 font-semibold text-sm text-[#1F1F1F]">
                Final Assessment
              </div>
              <button
                disabled={!isCourseComplete}
                onClick={() => isCourseComplete && navigate(`/course/${slug}/test`)}
                className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${
                  isCourseComplete ? 'hover:bg-surface cursor-pointer' : 'cursor-not-allowed'
                }`}
              >
                <div className="mt-0.5">
                  {isCourseComplete
                    ? <FileCheck size={16} className="text-primary" />
                    : <Lock size={16} className="text-muted" />
                  }
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${isCourseComplete ? 'text-[#1F1F1F]' : 'text-muted'}`}>
                    Course Test
                  </p>
                  <p className="text-xs text-muted mt-1">
                    {isCourseComplete
                      ? 'Available now'
                      : 'Unlocks after completing all lessons'}
                  </p>
                </div>
              </button>
            </div>
          </div>
        </aside>

        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden absolute inset-0 bg-black/50 z-0"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}