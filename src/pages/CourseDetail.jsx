/**
 * pages/CourseDetail.jsx
 */
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Star, Users, Clock, Globe, CheckCircle2, Shield, Smartphone, Award, PlayCircle, Send } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import VideoPlayer from '../components/course/VideoPlayer';
import CurriculumAccordion from '../components/course/CurriculumAccordion';
import ReviewCard from '../components/course/ReviewCard';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { getCourseBySlug } from '../api/courseService';
import { isAuthenticated, getCurrentUser } from '../api/authService';
import { enrollCourse } from '../api/userService';
import { updateCourseReviews } from '../api/adminService';
import { useCart } from '../context/CartContext';



export default function CourseDetail() {

  const {addToCart} = useCart();
  const { slug } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  // Review form state
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    getCourseBySlug(slug).then((data) => {
      setCourse(data);
      setLoading(false);
      // scroll to top on load
      window.scrollTo(0, 0);
    });
  }, [slug]);

  const handleEnroll = async () => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { returnTo: `/course/${slug}` } });
      return;
    }
    
    try {
      setEnrolling(true);
      await enrollCourse(course.id);
      // Simulate slight delay for UX
      setTimeout(() => {
        navigate(`/dashboard/course/${slug}`);
      }, 800);
    } catch (err) {
      alert("Error enrolling. Please try again.");
      setEnrolling(false);
    }
  };

  const handleAddToCart = () => {
    // Mock cart functionality
    alert("Added to cart! (Mock)");
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

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Helmet>
        <title>{course.title} | LearnGrow</title>
        <meta name="description" content={course.shortDescription} />
      </Helmet>

      <Navbar />

      {/* Dark Header Section */}
      <div className="bg-navy text-white pt-12 pb-24 lg:pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
            <Link to="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link to="/courses" className="hover:text-white">Courses</Link>
            <span>/</span>
            <Link to={`/courses?category=${course.category}`} className="hover:text-white">{course.categoryName}</Link>
          </nav>

          <div className="grid lg:grid-cols-[2fr_1fr] gap-12">
            <div className="space-y-6 max-w-3xl">
              <h1 className="text-3xl lg:text-4xl font-bold leading-tight">{course.title}</h1>
              <p className="text-lg text-white/80">{course.shortDescription}</p>
              
              <div className="flex items-center gap-4 text-sm font-medium flex-wrap">
                {course.badge && <Badge label={course.badge} />}
                <div className="flex items-center gap-1 text-amber">
                  <Star size={16} className="fill-amber" />
                  <span>{course.rating.toFixed(1)}</span>
                </div>
                <span className="text-white/60">({course.reviewCount.toLocaleString()} ratings)</span>
                <span className="text-white/60 flex items-center gap-1"><Users size={16}/> {course.studentsEnrolled.toLocaleString()} students</span>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-white/80">
                <span>Created by <Link to={`/instructor/${course.instructorId}`} className="text-primary hover:underline">{course.instructor}</Link></span>
                <span className="flex items-center gap-1"><Clock size={16}/> Last updated {new Date(course.lastUpdated).toLocaleDateString()}</span>
                <span className="flex items-center gap-1"><Globe size={16}/> {course.language}</span>
              </div>
            </div>
            
            {/* Empty div for layout on lg screens (Sticky card goes here visually, but is absolutely positioned below) */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full -mt-16 lg:-mt-24 pb-28 lg:pb-20 relative">
        <div className="grid lg:grid-cols-[2fr_1fr] gap-12 items-start">
          
          {/* Left Content */}
          <div className="space-y-10">
            
            {/* Demo Video (Mobile only - Desktop has it in sticky card) */}
            <div className="lg:hidden bg-white rounded-card shadow-card p-1">
              <div className="relative cursor-pointer group rounded-lg overflow-hidden" onClick={() => setIsDemoModalOpen(true)}>
                <img src={course.thumbnail} alt={course.title} className="w-full aspect-video object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                  <PlayCircle size={64} className="text-white opacity-90 group-hover:scale-110 transition-transform" />
                </div>
                <div className="absolute bottom-4 inset-x-0 text-center font-semibold text-white">Preview this course</div>
              </div>
            </div>

            {/* What you'll learn */}
            <section className="bg-white p-6 md:p-8 rounded-card shadow-sm border border-border">
              <h2 className="text-2xl font-bold text-[#1F1F1F] mb-6">What you'll learn</h2>
              <ul className="grid sm:grid-cols-2 gap-4">
                {course.whatYouLearn.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="text-success flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[#1F1F1F] leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Description */}
            <section>
              <h2 className="text-2xl font-bold text-[#1F1F1F] mb-4">Course Content</h2>
              <p className="text-[#1F1F1F] whitespace-pre-line leading-relaxed">
                {course.description}
              </p>
            </section>

            {/* Curriculum */}
            <section>
              <h2 className="text-2xl font-bold text-[#1F1F1F] mb-4">Curriculum</h2>
              <CurriculumAccordion curriculum={course.curriculum} />
            </section>

            {/* Instructor */}
            <section>
              <h2 className="text-2xl font-bold text-[#1F1F1F] mb-4">Instructor</h2>
              <div className="bg-white p-6 rounded-card shadow-sm border border-border flex flex-col sm:flex-row gap-6 items-start">
                <div className="h-24 w-24 rounded-full bg-primary text-white flex items-center justify-center text-3xl font-bold flex-shrink-0">
                  {(course.instructor || 'IN').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1F1F1F] hover:text-primary cursor-pointer mb-1">{course.instructor}</h3>
                  <p className="text-muted text-sm mb-4">
                    {course.instructorTitle || 'Expert Instructor'}
                  </p>
                  <div className="flex gap-4 text-sm text-muted mb-4">
                    {course.rating > 0 && (
                      <span className="flex items-center gap-1"><Star size={16} className="text-amber fill-amber"/> {course.rating.toFixed(1)} Rating</span>
                    )}
                    <span className="flex items-center gap-1"><Users size={16}/> {(course.studentsEnrolled || 0).toLocaleString()} Students</span>
                  </div>
                  <p className="text-sm text-[#1F1F1F] leading-relaxed">
                    {course.instructorBio || 'Passionate about teaching and helping students achieve their career goals. Dedicated to providing high-quality, practical content that you can apply immediately.'}
                  </p>
                </div>
              </div>
            </section>

            {/* Reviews */}
            <section>
              <h2 className="text-2xl font-bold text-[#1F1F1F] mb-4 flex items-center gap-2">
                <Star className="text-amber fill-amber" size={24} />
                {course.rating > 0
                  ? <>{course.rating.toFixed(1)} course rating • {course.reviewCount.toLocaleString()} reviews</>
                  : <>No reviews yet</>}
              </h2>

              {/* Existing reviews list */}
              {course.reviews && course.reviews.length > 0 && (
                <div className="bg-white p-6 rounded-card shadow-sm border border-border mb-6">
                  {course.reviews.map((review, i) => (
                    <ReviewCard key={i} review={review} />
                  ))}
                </div>
              )}

              {/* Student Review Submit Form */}
              <div className="bg-white p-6 rounded-card shadow-sm border border-border">
                <h3 className="text-lg font-bold text-[#1F1F1F] mb-4">Leave a Review</h3>

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

                      // Mutate mockCourses in-place and re-read updated course
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
                    {/* Star picker */}
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
                              size={28}
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

                    {/* Comment */}
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

                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      loading={reviewSubmitting}
                    >
                      <Send size={15} /> Submit Review
                    </Button>
                  </form>
                )}
              </div>
            </section>

          </div>

          {/* Right Sidebar (Sticky Enroll Card) */}
          <div className="hidden lg:block lg:sticky lg:top-24 z-10">
            <div className="bg-white rounded-card shadow-2xl border border-border overflow-hidden">
              
              {/* Video Preview Trigger */}
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
                      <Button variant="primary" className="w-full py-4 text-lg" onClick={() => addToCart(course)}>
                        Add to Cart
                      </Button>
                      <Button variant="outline" onClick={() => navigate(`/checkout/${course.id}`, {state:{course}})} className="w-full py-3"  >
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
          </div>

        </div>
      </main>

      {/* ── Mobile / Tablet sticky buy bar (hidden on lg+) ── */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-4 py-3">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          {/* Price */}
          <div className="flex-shrink-0">
            {course.isFree ? (
              <span className="text-xl font-bold text-[#1F1F1F]">Free</span>
            ) : (
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-[#1F1F1F]">₹{course.price.toLocaleString()}</span>
                <span className="text-sm text-muted line-through">₹{course.originalPrice.toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-1 gap-2 justify-end">
            {course.isFree ? (
              <Button variant="primary" className="flex-1 py-3 text-base" onClick={handleEnroll} loading={enrolling}>
                Enroll for Free
              </Button>
            ) : (
              <>
                <Button variant="outline" className="flex-1 py-3 text-base" onClick={() => addToCart(course)}>
                  Add to Cart
                </Button>
                <Button variant="primary" className="flex-1 py-3 text-base" onClick={() => navigate(`/checkout/${course.id}`, { state: { course } })}>
                  Buy Now
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />

      {/* Demo Video Modal */}
      <Modal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} title="Course Preview" size="lg">
        <div className="p-1">
          <VideoPlayer src={course.demoVideo} poster={course.thumbnail} title={course.title} />
        </div>
      </Modal>
    </div>
  );
}

// Quick inline icon component to avoid huge lucide import list above
const VideoPlayerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>;
