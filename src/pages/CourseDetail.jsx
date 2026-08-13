/**
 * pages/CourseDetail.jsx
 */
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Star, Users, Clock, Globe, CheckCircle2, Shield, Smartphone, Award, PlayCircle, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import VideoPlayer from '../components/course/VideoPlayer';
import CurriculumAccordion from '../components/course/CurriculumAccordion';
import ReviewCard from '../components/course/ReviewCard';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { getCourseBySlug } from '../services/courseService';
import { isAuthenticated, getCurrentUser } from '../services/authService';
import { enrollCourse } from '../services/userService';
import { updateCourseReviews } from '../services/adminService';
import { useCart } from '../context/CartContext';
import AuthPromptModal from '../components/course/AuthPromptModal'

// Framer variants for the meta row (badge, rating, students, etc.)
const metaContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.25 },
  },
};

const metaItemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
};

export default function CourseDetail() {
  const { addToCart } = useCart();
  const { slug } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  // Review form state
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const titleRef = useRef(null);

  useEffect(() => {
    getCourseBySlug(slug).then((data) => {
      setCourse(data);
      setLoading(false);
      window.scrollTo(0, 0);
    });
  }, [slug]);

  // GSAP: letter-by-letter reveal for the course title once it's loaded
  useEffect(() => {
    if (!course || !titleRef.current) return;
    const letters = titleRef.current.querySelectorAll('[data-letter]');
    gsap.fromTo(
      letters,
      { opacity: 0, y: 18 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power3.out',
        stagger: 0.02,
      }
    );
  }, [course]);

  const requireAuth = (action) => {
    if (!isAuthenticated()) {
      setShowAuthPrompt(true);
      return;
    }
    action();
  };

  const handleEnroll = async () => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { returnTo: `/course/${slug}` } });
      return;
    }

    try {
      setEnrolling(true);
      await enrollCourse(course.id);
      setTimeout(() => {
        navigate(`/dashboard/course/${slug}`);
      }, 800);
    } catch (err) {
      alert("Error enrolling. Please try again.");
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-surface">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col bg-surface">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <h1 className="text-2xl font-bold mb-2">Course not found</h1>
          <Link to="/courses" className="text-primary hover:underline">Return to courses</Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'curriculum', label: 'Curriculum' },
    { id: 'reviews', label: `Reviews${course.reviewCount ? ` (${course.reviewCount.toLocaleString()})` : ''}` },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-surface ">
      <Helmet>
        <title>{course.title} | LearnGrow</title>
        <meta name="description" content={course.shortDescription} />
      </Helmet>

      <Navbar />

      {/* Dark Header / Hero Strip */}
      <div className="bg-navy text-white pt-8 sm:pt-10 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-white/60 mb-4 sm:mb-5 flex-wrap">
            <Link to="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link to="/courses" className="hover:text-white">Courses</Link>
            <span>/</span>
            <Link to={`/courses?category=${course.category}`} className="hover:text-white">{course.categoryName}</Link>
          </nav>

          <div className="max-w-3xl space-y-2.5 sm:space-y-3">
            {/* GSAP: letters animate in one by one */}
            <h1
              ref={titleRef}
              className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight"
              aria-label={course.title}
            >
              {course.title.split('').map((char, i) => (
                <span key={i} data-letter className="inline-block" style={{ opacity: 0 }}>
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </h1>

            <p className="text-base sm:text-lg text-white/80">{course.shortDescription}</p>

            {/* Framer: meta row staggers in after the title finishes */}
            <motion.div
              className="flex items-center gap-x-3 gap-y-1.5 sm:gap-x-4 text-xs sm:text-sm font-medium flex-wrap pt-1"
              variants={metaContainerVariants}
              initial="hidden"
              animate="visible"
            >
              {course.badge && (
                <motion.div variants={metaItemVariants}><Badge label={course.badge} /></motion.div>
              )}
              <motion.div variants={metaItemVariants} className="flex items-center gap-1 text-amber">
                <Star size={15} className="fill-amber" />
                <span>{course.rating.toFixed(1)}</span>
              </motion.div>
              <motion.span variants={metaItemVariants} className="text-white/60">({course.reviewCount.toLocaleString()} ratings)</motion.span>
              <motion.span variants={metaItemVariants} className="text-white/60 flex items-center gap-1"><Users size={15} /> {course.studentsEnrolled.toLocaleString()} students</motion.span>
              <motion.span variants={metaItemVariants}>Created by <Link to={`/instructor/${course.instructorId}`} className="text-primary hover:underline">{course.instructor}</Link></motion.span>
              <motion.span variants={metaItemVariants} className="text-white/60 flex items-center gap-1"><Clock size={15} /> Last updated {new Date(course.lastUpdated).toLocaleDateString()}</motion.span>
              <motion.span variants={metaItemVariants} className="text-white/60 flex items-center gap-1"><Globe size={15} /> {course.language}</motion.span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Body: middle sticky (instructor + tabs) | right sticky (buy card) */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full -mt-6 pb-28 lg:pb-16 relative">
        <div className="grid lg:grid-cols-[1fr_320px] gap-5 sm:gap-6 items-start">

          {/* MIDDLE COLUMN: instructor mini card + tabs card, sticky as one unit */}
          <div className="lg:sticky lg:top-5 flex flex-col lg:max-h-[calc(100vh-2.5rem)]">

            {/* Instructor mini strip */}
            <div className="bg-white rounded-card shadow-sm border border-border p-4 sm:p-5 mb-3 sm:mb-3.5 flex flex-wrap items-center gap-3 sm:gap-4 flex-shrink-0">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-primary text-white flex items-center justify-center text-base sm:text-lg font-bold flex-shrink-0">
                {(course.instructor || 'IN').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-[#1F1F1F] leading-tight text-sm sm:text-base">{course.instructor}</h3>
                <p className="text-xs text-muted">{course.instructorTitle || 'Expert Instructor'}</p>
              </div>
              <div className="flex gap-3 sm:gap-4 text-xs text-muted sm:ml-auto flex-wrap">
                {course.rating > 0 && (
                  <span className="flex items-center gap-1"><Star size={14} className="text-amber fill-amber" /> {course.rating.toFixed(1)} Rating</span>
                )}
                <span className="flex items-center gap-1"><Users size={14} /> {(course.studentsEnrolled || 0).toLocaleString()} Students</span>
              </div>
            </div>

            {/* Tabs card */}
            <div className="bg-white rounded-card shadow-card border border-border overflow-y-auto lg:flex-1">
              <div className="flex border-b border-border px-4 sm:px-7 sticky top-0 bg-white z-10 overflow-x-auto whitespace-nowrap">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-1 mr-4 sm:mr-7 py-3.5 sm:py-4 font-semibold text-xs sm:text-sm transition-colors border-b-[3px] ${activeTab === tab.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted hover:text-[#1F1F1F]'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Framer: smooth crossfade between tab panels */}
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="p-4 sm:p-7 space-y-6 sm:space-y-8"
                  >
                    <section>
                      <h2 className="text-lg sm:text-xl font-bold text-[#1F1F1F] mb-4 sm:mb-5">What you'll learn</h2>
                      <ul className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                        {course.whatYouLearn.map((item, i) => (
                          <li key={i} className="flex items-start gap-2.5 sm:gap-3">
                            <CheckCircle2 size={19} className="text-success flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-[#1F1F1F] leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </section>

                    <section>
                      <h2 className="text-lg sm:text-xl font-bold text-[#1F1F1F] mb-3">Course Content</h2>
                      <p className="text-[#1F1F1F] whitespace-pre-line leading-relaxed text-sm">
                        {course.description}
                      </p>
                    </section>

                    <section>
                      <h2 className="text-lg sm:text-xl font-bold text-[#1F1F1F] mb-4">Instructor</h2>
                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-start">
                        <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-primary text-white flex items-center justify-center text-xl sm:text-2xl font-bold flex-shrink-0">
                          {(course.instructor || 'IN').slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-base sm:text-lg font-bold text-[#1F1F1F] hover:text-primary cursor-pointer mb-1">{course.instructor}</h3>
                          <p className="text-muted text-sm mb-3">
                            {course.instructorTitle || 'Expert Instructor'}
                          </p>
                          <div className="flex gap-3 sm:gap-4 text-sm text-muted mb-3 flex-wrap">
                            {course.rating > 0 && (
                              <span className="flex items-center gap-1"><Star size={16} className="text-amber fill-amber" /> {course.rating.toFixed(1)} Rating</span>
                            )}
                            <span className="flex items-center gap-1"><Users size={16} /> {(course.studentsEnrolled || 0).toLocaleString()} Students</span>
                          </div>
                          <p className="text-sm text-[#1F1F1F] leading-relaxed">
                            {course.instructorBio || 'Passionate about teaching and helping students achieve their career goals. Dedicated to providing high-quality, practical content that you can apply immediately.'}
                          </p>
                        </div>
                      </div>
                    </section>
                  </motion.div>
                )}

                {activeTab === 'curriculum' && (
                  <motion.div
                    key="curriculum"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="p-4 sm:p-7"
                  >
                    <h2 className="text-lg sm:text-xl font-bold text-[#1F1F1F] mb-4">Curriculum</h2>
                    <CurriculumAccordion curriculum={course.curriculum} />
                  </motion.div>
                )}

                {activeTab === 'reviews' && (
                  <motion.div
                    key="reviews"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="p-4 sm:p-7 space-y-5 sm:space-y-6"
                  >
                    <h2 className="text-base sm:text-lg font-bold text-[#1F1F1F] flex items-center gap-2 flex-wrap">
                      <Star className="text-amber fill-amber" size={20} />
                      {course.rating > 0
                        ? <>{course.rating.toFixed(1)} course rating • {course.reviewCount.toLocaleString()} reviews</>
                        : <>No reviews yet</>}
                    </h2>

                    {course.reviews && course.reviews.length > 0 && (
                      <div className="space-y-4">
                        {course.reviews.map((review, i) => (
                          <ReviewCard key={i} review={review} />
                        ))}
                      </div>
                    )}

                    <div className="border-t border-border pt-5 sm:pt-6">
                      <h3 className="text-sm sm:text-base font-bold text-[#1F1F1F] mb-4">Leave a Review</h3>

                      {!isAuthenticated() ? (
                        <p className="text-sm text-muted">
                          <Link to="/login" className="text-primary font-semibold hover:underline">Log in</Link> to leave a review.
                        </p>
                      ) : reviewSuccess ? (
                        <div className="flex items-center gap-2 text-success font-medium text-sm">
                          <CheckCircle2 size={18} /> Thank you! Your review has been submitted.
                        </div>
                      ) : (
                        <form
                          onSubmit={async (e) => {
                            e.preventDefault();
                            if (reviewRating === 0) { alert('Please select a star rating.'); return; }
                            setReviewSubmitting(true);

                            const user = getCurrentUser();
                            const initials = (user?.name || 'User')
                              .split(' ')
                              .map(w => w[0])
                              .join('')
                              .toUpperCase()
                              .slice(0, 2);

                            const review = {
                              user: user?.name || 'Anonymous',
                              avatar: initials,
                              rating: reviewRating,
                              comment: reviewComment.trim(),
                              date: new Date().toISOString().split('T')[0],
                            };

                            updateCourseReviews(course.id, review);
                            const updated = await getCourseBySlug(slug);
                            setCourse(updated);

                            setReviewComment('');
                            setReviewRating(0);
                            setReviewSubmitting(false);
                            setReviewSuccess(true);
                          }}
                          className="space-y-4"
                        >
                          <div>
                            <label className="block text-sm font-medium text-[#1F1F1F] mb-2">Your Rating *</label>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setReviewRating(star)}
                                  onMouseEnter={() => setReviewHover(star)}
                                  onMouseLeave={() => setReviewHover(0)}
                                  className="p-0.5 transition-transform hover:scale-110"
                                >
                                  <Star
                                    size={26}
                                    className={
                                      star <= (reviewHover || reviewRating)
                                        ? 'text-amber fill-amber'
                                        : 'text-gray-300 fill-gray-300'
                                    }
                                  />
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-[#1F1F1F] mb-1">Your Review</label>
                            <textarea
                              value={reviewComment}
                              onChange={(e) => setReviewComment(e.target.value)}
                              rows={3}
                              placeholder="Share your experience with this course..."
                              className="w-full border border-border rounded-btn px-3 py-2 text-sm focus:border-primary focus:outline-none"
                            />
                          </div>

                          <Button type="submit" variant="primary" size="sm" loading={reviewSubmitting}>
                            <Send size={15} /> Submit Review
                          </Button>
                        </form>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT COLUMN: Sticky Buy Card - Framer entrance */}
          <motion.div
            className="hidden lg:block lg:sticky lg:top-5"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.15 }}
          >
            <div className="bg-white rounded-card shadow-2xl border border-border overflow-hidden">
              <div className="relative cursor-pointer group" onClick={() => setIsDemoModalOpen(true)}>
                <img src={course.thumbnail} alt={course.title} className="w-full aspect-video object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                  <PlayCircle size={64} className="text-white opacity-90 group-hover:scale-110 transition-transform" />
                </div>
                <div className="absolute bottom-4 inset-x-0 text-center font-semibold text-white">Preview this course</div>
              </div>

              <div className="p-6">
                <div className="flex items-end gap-3 mb-6">
                  {course.isFree ? (
                    <span className="text-3xl font-bold text-[#1F1F1F]">Free</span>
                  ) : (
                    <>
                      <span className="text-3xl font-bold text-[#1F1F1F]">₹{course.price.toLocaleString()}</span>
                      <span className="text-muted line-through text-lg mb-1">₹{course.originalPrice.toLocaleString()}</span>
                    </>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  {course.isFree ? (
                    <Button variant="primary" className="w-full py-4 text-lg" onClick={handleEnroll} loading={enrolling}>
                      Enroll Now for Free
                    </Button>
                  ) : (
                    <>
                      <Button variant="primary" className="w-full py-4 text-lg" onClick={() => requireAuth(() => addToCart(course))}>
                        Add to Cart
                      </Button>
                      <Button variant="outline" onClick={() => requireAuth(() => navigate(`/checkout/${course.id}`, { state: { course } }))} className="w-full py-3">
                        Buy Now
                      </Button>
                    </>
                  )}
                  <p className="text-center text-xs text-muted">30-Day Money-Back Guarantee</p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-sm text-[#1F1F1F] uppercase tracking-wide">This course includes:</h4>
                  <ul className="space-y-3 text-sm text-[#1F1F1F]">
                    <li className="flex items-center gap-3"><VideoPlayerIcon /> {course.duration} on-demand video</li>
                    <li className="flex items-center gap-3"><Shield size={18} className="text-muted" /> Lifetime access</li>
                    <li className="flex items-center gap-3"><Smartphone size={18} className="text-muted" /> Access on mobile and TV</li>
                    {course.certificate && (
                      <li className="flex items-center gap-3"><Award size={18} className="text-muted" /> Certificate of completion</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </main>

      {/* Mobile / Tablet sticky buy bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-3 sm:px-4 py-2.5 sm:py-3">
        <div className="flex items-center gap-2 sm:gap-3 max-w-lg mx-auto">
          <div className="flex-shrink-0">
            {course.isFree ? (
              <span className="text-lg sm:text-xl font-bold text-[#1F1F1F]">Free</span>
            ) : (
              <div className="flex flex-col leading-tight sm:flex-row sm:items-baseline sm:gap-1.5">
                <span className="text-base sm:text-xl font-bold text-[#1F1F1F]">₹{course.price.toLocaleString()}</span>
                <span className="text-[10px] sm:text-sm text-muted line-through">₹{course.originalPrice.toLocaleString()}</span>
              </div>
            )}
          </div>

          <div className="flex flex-1 gap-2 justify-end min-w-0">
            {course.isFree ? (
              <Button variant="primary" className="flex-1 py-2.5 sm:py-3 text-xs sm:text-base px-2 sm:px-4" onClick={handleEnroll} loading={enrolling}>
                Enroll for Free
              </Button>
            ) : (
              <>
                <Button variant="outline" className="flex-1 py-2.5 sm:py-3 text-xs sm:text-base px-2 sm:px-4" onClick={() => requireAuth(() => addToCart(course))}>
                  Add to Cart
                </Button>
                <Button variant="primary" className="flex-1 py-2.5 sm:py-3 text-xs sm:text-base px-2 sm:px-4" onClick={() => requireAuth(() => navigate(`/checkout/${course.id}`, { state: { course } }))}>
                  Buy Now
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />

      <Modal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} title="Course Preview" size="lg">
        <div className="p-1">
          <VideoPlayer src={course.demoVideo} poster={course.thumbnail} title={course.title} />
        </div>
      </Modal>

      <AuthPromptModal 
      isOpen={showAuthPrompt}
      onClose={() => setShowAuthPrompt(false)}
      returnTo={`/course/${slug}`}
      message="You need an account to purchase this course. It only takes a minute."
      />
    </div>
  );
}

const VideoPlayerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>;