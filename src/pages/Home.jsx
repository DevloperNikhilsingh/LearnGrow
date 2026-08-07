/**
 * pages/Home.jsx
 */
import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CategoryTabs from '../components/course/CategoryTabs';
import CourseCard from '../components/course/CourseCard';
import WhyChooseUs from '../components/WhyChooseUs';
import Button from '../components/ui/Button';
import { getCourses, getDynamicCategories } from '../services/courseService';
import { ArrowRight, Star, Shield, PlayCircle, BookOpen, HelpCircle, Headset, Cross, Send, CircleX, X, Check, Activity, Code, Palette, TrendingUp, Megaphone, PenTool } from 'lucide-react';
import CountUp from '../components/CountUp';
import Faq from '../components/Faq';
import ParticleNetwork from '../components/animation_style/ParticleNetwork';
import TypewriterHeading from '../components/animation_style/TypeWriter';
import {testimonial} from '../data/testimonial';


const skillBadgesData = [
  {
    id: 'ux',
    name: 'UX Design',
    shortName: 'UX',
    bgClass: 'bg-primary text-white border-primary/20',
    positionClass: 'top-[8%] left-[10%] lg:top-[12%] lg:left-[12%]',
    animateClass: 'animate-float-slow',
  },
  {
    id: 'js',
    name: 'JavaScript',
    shortName: 'JS',
    bgClass: 'bg-amber text-navy border-amber/20 font-bold',
    positionClass: 'top-[16%] right-[8%] lg:top-[20%] lg:right-[10%]',
    animateClass: 'animate-float-medium',
  },
  {
    id: 'html',
    name: 'HTML/CSS',
    shortName: 'HTML',
    bgClass: 'bg-orange-600 text-white border-orange-500/20',
    positionClass: 'bottom-[12%] right-[8%] lg:bottom-[15%] lg:right-[10%]',
    animateClass: 'animate-float-fast',
  },
  {
    id: 'python',
    name: 'Python',
    shortName: 'Py',
    bgClass: 'bg-sky-500 text-white border-sky-400/20',
    positionClass: 'bottom-[8%] left-[10%] lg:bottom-[10%] lg:left-[12%]',
    animateClass: 'animate-float-slow',
  },
  {
    id: 'figma',
    name: 'Figma',
    shortName: 'Fi',
    bgClass: 'bg-pink-600 text-white border-pink-500/20',
    positionClass: 'top-[46%] right-[-6%] lg:top-[48%] lg:right-[-8%]',
    animateClass: 'animate-float-fast',
  }
];

const trustCheckmarks = [
  { id: 'access', text: 'Lifetime access' },
  { id: 'pricing', text: 'Honest pricing' }
];

const heroStats = [
  { label: 'Success Stories', value: '50+' },
  { label: 'Trendy Subjects', value: '110+' },
  { label: 'Active Students', value: '1000+' }
];

const skillCards = [
  {
    to: '/courses?search=video-editing',
    video: '/Video_editing_2.mp4',
    title: 'Video Editing',
  },
  {
    to: '/courses?search=seo',
    video: '/SEO_2.mp4',
    title: 'SEO',
  },
  {
    to: '/courses?category=web-development',
    img: 'web-developer1.gif',
    title: 'Web Development',
  },
  {
    to: '/courses?category=video-editing',
    video: '/Video_editing_2.mp4',
    title: 'Video Editing',
  },
];





export default function Home() {

  console.log("hey this is testimonial data",testimonial)

  const [courses, setCourses] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [activeVideo, setActiveVideo] = useState(null);
  const [playingIndex, setPlayingIndex] = useState(null);
  const testimonialVideoRefs = useRef([]);



  // Toggle testimonial video playback when a card is clicked.
  // Clicking the already-playing card pauses it back to the image;
  // clicking a different card switches playback to that one.
  const handleCardClick = (index) => {
    const videos = testimonialVideoRefs.current;

    if (playingIndex === index) {
      videos[index]?.pause();
      setPlayingIndex(null);
      return;
    }

    if (playingIndex !== null && videos[playingIndex]) {
      videos[playingIndex].pause();
    }

    const video = videos[index];
    if (video) {
      video.currentTime = 0;
      video.muted = false;
      video.play()
        .then(() => setPlayingIndex(index))
        .catch((err) => {
          console.log('Play blocked:', err);
          setPlayingIndex(null);
        });
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Featured courses pagination — 8 per page on tablet/laptop (4x2 grid), 4 per page on mobile (2x2 grid)
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage, setCoursesPerPage] = useState(8);


  useEffect(() => {
    const updateCoursesPerPage = () => {
      setCoursesPerPage(window.innerWidth < 768 ? 4 : 8);
    };
    updateCoursesPerPage();
    window.addEventListener('resize', updateCoursesPerPage);
    return () => window.removeEventListener('resize', updateCoursesPerPage);
  }, []);

  // Reset to page 1 whenever the category filter or page size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, coursesPerPage]);

  const [skillStartIndex, setSkillStartIndex] = useState(0);
  const [cardWidthPercent, setCardWidthPercent] = useState(32); // desktop default
  const [skillVisibleCount, setSkillVisibleCount] = useState(3);

  const categories = getDynamicCategories();

  // Categories carousel — native scroll track, swipeable on touch, arrows on desktop
  const categoryTrackRef = useRef(null);

  const scrollCategories = (direction) => {
    const track = categoryTrackRef.current;
    if (!track) return;
    const card = track.querySelector('[data-category-card]');
    const cardWidth = card ? card.offsetWidth + 24 : 240; // card width + gap
    track.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
  };

  // Responsive card width -> controls how many cards + peek show on each device
  useEffect(() => {
    const updateCardWidth = () => {
      if (window.innerWidth < 640) {
        setCardWidthPercent(82); // mobile: 1 card + small peek of next
        setSkillVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setCardWidthPercent(46); // tablet: 2 cards + small peek
        setSkillVisibleCount(2);
      } else {
        setCardWidthPercent(32); // desktop: 3 cards, no peek
        setSkillVisibleCount(3);
      }
    };
    updateCardWidth();
    window.addEventListener('resize', updateCardWidth);
    return () => window.removeEventListener('resize', updateCardWidth);
  }, []);

  // maxIndex is capped so the slider never scrolls past the last real card
  const skillMaxIndex = Math.max(0, skillCards.length - skillVisibleCount);

  // Clamp current index whenever visible count changes (e.g. resize desktop -> mobile)
  useEffect(() => {
    setSkillStartIndex((prev) => Math.min(prev, skillMaxIndex));
  }, [skillMaxIndex]);

  const handleSkillNext = () => {
    setSkillStartIndex((prev) => Math.min(prev + 1, skillMaxIndex));
  };

  const handleSkillPrev = () => {
    setSkillStartIndex((prev) => Math.max(prev - 1, 0));
  };

  // Testimonials carousel
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [testimonialWidthPercent, setTestimonialWidthPercent] = useState(23);
  const [testimonialVisibleCount, setTestimonialVisibleCount] = useState(4);

  useEffect(() => {
    const updateTestimonialWidth = () => {
      if (window.innerWidth < 640) {
        setTestimonialWidthPercent(84); // mobile: 1 card + peek
        setTestimonialVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setTestimonialWidthPercent(46); // tablet: 2 cards + peek
        setTestimonialVisibleCount(2);
      } else {
        setTestimonialWidthPercent(23); // desktop: 4 cards
        setTestimonialVisibleCount(4);
      }
    };
    updateTestimonialWidth();
    window.addEventListener('resize', updateTestimonialWidth);
    return () => window.removeEventListener('resize', updateTestimonialWidth);
  }, []);

  // maxIndex is capped so the slider never scrolls past the last real card
  const testimonialMaxIndex = Math.max(0, testimonial.length - testimonialVisibleCount);

  // Clamp current index whenever visible count changes (e.g. resize desktop -> mobile)
  useEffect(() => {
    setTestimonialIndex((prev) => Math.min(prev, testimonialMaxIndex));
  }, [testimonialMaxIndex]);

  const handleTestimonialNext = () => {
    setTestimonialIndex((prev) => Math.min(prev + 1, testimonialMaxIndex));
  };

  const handleTestimonialPrev = () => {
    setTestimonialIndex((prev) => Math.max(prev - 1, 0));
  };

  useEffect(() => {
    getCourses().then((data) => {
      setCourses(data);
      setLoading(false);
    });
  }, []);

  const categoryCourses = activeCategory
    ? courses.filter(c => c.category === activeCategory)
    : courses;

  const totalCoursePages = Math.max(1, Math.ceil(categoryCourses.length / coursesPerPage));
  const paginatedCourses = categoryCourses.slice(
    (currentPage - 1) * coursesPerPage,
    currentPage * coursesPerPage
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Helmet>
        <title>LearnGrow | Master In-Demand Skills</title>
        <meta name="description" content="Learn from industry experts. High-quality courses in marketing, coding, design, and health." />
      </Helmet>

      <Navbar />

      <main className="flex-1">

        {/* Hero Section — Responsive */}
        <section className="relative overflow-hidden py-10 sm:py-14 lg:py-20 lg:pt-36" style={{ background: 'linear-gradient(135deg, #f0faf4 0%, #e8f5fb 40%, #f5f0fb 100%)' }}>

          {/* Subtle dot grid background */}
          <div className="absolute inset-0 pointer-events-none opacity-30"
            style={{ backgroundImage: 'radial-gradient(circle, #b2d8c8 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

          {/* Particle network animation */}
          <ParticleNetwork count={26} />

          {/* Decorative blobs */}
          <div className="absolute top-0 left-0 w-80 h-80 bg-green-200/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-100/40 rounded-full blur-3xl pointer-events-none" />

          {/* Decorative floating shapes — only on desktop (xl and above now) */}
          <div className="hidden xl:block absolute top-8 left-[8%] w-10 h-10 border-2 border-orange-300/40 rounded-lg rotate-12 animate-float-slow pointer-events-none" />
          <div className="hidden xl:block absolute bottom-12 left-[5%] w-14 h-14 border-2 border-green-300/40 rounded-full animate-float-medium pointer-events-none" />
          <div className="hidden xl:block absolute top-1/3 left-[18%] text-gray-300/50 text-3xl animate-float-fast select-none pointer-events-none">📐</div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Desktop (xl+): 2-column grid | Mobile/Tablet (below xl): single column stacked */}
            <div className="grid xl:grid-cols-2 gap-8 lg:gap-10 items-center">

              {/* ── LEFT CONTENT ── */}
              <div className="space-y-5 lg:space-y-6 fade-in text-center xl:text-left">

                {/* Heading */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-[#1a1a2e]">
                  Unlock Your{' '}
                  Potential with
                  <br />
                  <span style={{ color: 'blue' }}>Expert-Led Courses.</span>
                </h1>

                {/* Sub-description */}
                <p className="text-[#444] capitalize text-sm sm:text-base lg:text-lg leading-relaxed max-w-lg mx-auto xl:mx-0">
                  Build in-demand skills in tech, design, marketing, and healthcare. Learn from top professionals and advance your career today
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap items-center justify-center xl:justify-start gap-3 sm:gap-4 pt-1">

                  <Link
                    to="/courses"
                    className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-primary px-5 sm:px py-2.5 sm:py-3 text-[14px] sm:text-[15px] font-semibold text-white transition-all duration-500 active:scale-95"
                  >
                    {/* Hover Background */}
                    <span
                      className="absolute inset-0 -translate-x-full bg-black transition-transform duration-500 group-hover:translate-x-0"
                    />

                    {/* Content */}
                    <span className="relative flex items-center gap-2">
                      Explore Courses
                    </span>
                  </Link>

                  {/* Play + Join for Free */}
                  <Link
                    to="/signup"
                    className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full font-semibold text-[#1a1a2e] text-[14px] sm:text-[15px] bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white flex-shrink-0" style={{ background: '#f97316' }}>
                      <PlayCircle size={15} />
                    </span>
                    Join for Free
                  </Link>
                </div>

                {/* Mobile/Tablet (below xl) — Student image shown between CTAs and stats */}
                <div className="flex xl:hidden justify-center py-2">
                  <div className="relative inline-block">
                    {/* Soft glow behind image */}
                    <div className="absolute inset-0 rounded-full bg-green-300/20 blur-2xl scale-110 pointer-events-none" />
                    <img
                      src="/Student-1-real (4).png"
                      alt="Hero_img"
                      className="relative z-10 h-52 sm:h-72 w-auto object-contain object-bottom drop-shadow-xl select-none"
                      draggable={false}
                    />
                    {/* Mini floating badges on mobile/tablet */}
                    <div className="absolute top-2 -left-3 z-20 animate-float-slow">
                      <div className="w-9 h-9 rounded-xl shadow-lg flex items-center justify-center text-white font-bold text-sm"
                        style={{ background: 'linear-gradient(135deg, #001e36, #31a8ff)' }}>
                        <PenTool size={20} />
                      </div>
                    </div>
                    <div className="absolute top-2 -right-3 z-20 animate-float-medium">
                      <div className="w-9 h-9 rounded-xl shadow-lg bg-yellow-400 flex items-center justify-center">
                        <Code size={20} />
                      </div>
                    </div>
                    <div className="absolute bottom-4 -right-4 z-20 animate-float-fast">
                      <div className="w-9 h-9 rounded-xl shadow-lg flex items-center justify-center text-white font-bold text-xs"
                        style={{ background: 'linear-gradient(135deg, #300000, #ff9a00)' }}>
                        <Activity size={20} />
                      </div>
                    </div>
                    <div className="absolute bottom-4 -left-4 z-20 animate-float-medium" style={{ animationDelay: '0.5s' }}>
                      <div className="w-9 h-9 rounded-xl shadow-lg flex items-center justify-center text-white"
                        style={{ background: 'linear-gradient(135deg, #4f46e5, #818cf8)' }}>
                        <Megaphone size={16} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="flex items-center justify-center xl:justify-start gap-5 sm:gap-8 pt-2">
                  <div>
                    <div className="text-xl sm:text-2xl font-extrabold text-[#1a1a2e]">
                      <CountUp end={1500} duration={10500} suffix="+" />
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 mt-0.5">Success Stories</div>
                  </div>
                  <div className="w-px h-8 sm:h-10 bg-gray-300" />
                  <div>
                    <div className="text-xl sm:text-2xl font-extrabold text-[#1a1a2e]">
                      <CountUp end={110} duration={10500} suffix="+" />
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 mt-0.5">Trendy Subjects</div>
                  </div>
                  <div className="w-px h-8 sm:h-10 bg-gray-300" />
                  <div>
                    <div className="text-xl sm:text-2xl font-extrabold text-[#1a1a2e]">
                      <CountUp end={25000} duration={10500} suffix="+" />
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 mt-0.5">Active Students</div>
                  </div>
                </div>

                {/* Review Badge */}
                <div className="inline-flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-md border border-gray-100 mt-2 mx-auto xl:mx-0">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#fef3c7' }}>
                    <Star size={18} className="text-amber-500 fill-amber-400" />
                  </div>
                  <p className="text-sm text-[#333] font-medium text-left">
                    Over one million students have<br />
                    <span className="font-bold">given a 5 star review to their tutor</span>
                  </p>
                </div>
              </div>

              {/* ── RIGHT — Person Image + Floating Icons (xl and above only) ── */}
              <div className="hidden xl:flex relative justify-center items-end self-end xl:-mb-20 fade-in" style={{ animationDelay: '0.25s', minHeight: '480px' }}>

                {/* Person image — user apni image /hero-person.png pe rakh sakta hai */}
                <img
                  src="/Student-1-real (4).png"
                  alt="Student"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80'; }}
                  className="relative z-10 h-[460px] w-auto object-contain object-bottom drop-shadow-2xl select-none"
                  draggable={false}
                />

                {/* Floating tech icons — same positions as reference image */}

                {/* Top-left: Photoshop-style icon */}
                <div className="absolute top-6 left-4 z-20 animate-float-slow">
                  <div className="w-12 h-12 rounded-xl shadow-lg flex items-center justify-center text-white font-bold text-lg"
                    style={{ background: 'linear-gradient(135deg, #001e36, #31a8ff)' }}>
                    <PenTool size={20} />
                  </div>
                </div>

                {/* Top-right: Google Drive */}
                <div className="absolute top-4 right-6 z-20 animate-float-medium">
                  <div className="w-12 h-12 rounded-xl shadow-lg bg-yellow-400 flex items-center justify-center">
                    <Code size={20} />
                  </div>
                </div>

                {/* Bottom-right: Adobe Illustrator */}
                <div className="absolute bottom-16 right-8 z-20 animate-float-slow" style={{ animationDelay: '1s' }}>
                  <div className="w-12 h-12 rounded-xl shadow-lg flex items-center justify-center text-white font-bold text-sm"
                    style={{ background: 'linear-gradient(135deg, #300000, #ff9a00)' }}>
                    <Activity size={20} />
                  </div>
                </div>

                {/* Bottom-left: YouTube */}
                <div className="absolute bottom-20 left-2 z-20 animate-float-medium" style={{ animationDelay: '0.5s' }}>
                  <div className="w-12 h-12 rounded-xl shadow-lg  flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #0f766e, #2dd4bf)' }}
                  >
                    <BookOpen size={20} className='text-white' />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Trusted By Companies Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="w-8 h-[2px] bg-indigo-600"></span>
              <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">
                Our Learners Work At
              </p>
              <span className="w-8 h-[2px] bg-indigo-600"></span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-12">
              Trusted by Growing Brands and Businesses
            </h2>

            {/* All Brand's logo */}

            {/* Line 1 - Right to Left */}
            <div className="overflow-hidden w-full p-2">
              <div id='logo-track' className="flex flex-nowrap items-center gap-x-8 w-max animate-marquee-left">
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-2.png" alt="Company 1" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-5.png" alt="Company 2" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-6.png" alt="Company 3" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-7.png" alt="Company 4" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-8.png" alt="Company 5" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-9.png" alt="Company 6" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-1.jpg" alt="Company 7" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-4.png" alt="Company 9" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-13.png" alt="Company 11" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-14.png" alt="Company 12" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-15.png" alt="Company 13" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-16.png" alt="Company 14" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-17.jpeg" alt="Company 15" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-18.jpeg" alt="Company 17" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-19.jpeg" alt="Company 18" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-20.png" alt="Company 19" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>

                {/* Duplicate - seamless loop ke liye, mat hatana */}
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-2.png" alt="Company 1" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-5.png" alt="Company 2" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-6.png" alt="Company 3" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-7.png" alt="Company 4" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-8.png" alt="Company 5" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-9.png" alt="Company 6" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-1.jpg" alt="Company 7" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-4.png" alt="Company 9" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-10.jpeg" alt="Company 10" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-13.png" alt="Company 11" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-14.png" alt="Company 12" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-15.png" alt="Company 13" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-16.png" alt="Company 14" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-17.jpeg" alt="Company 15" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-18.jpeg" alt="Company 17" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-19.jpeg" alt="Company 18" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-20.png" alt="Company 19" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
              </div>
            </div>

            {/* Line 2 - Left to Right (reverse) */}
            <div className="overflow-hidden w-full mt-8 p-2">
              <div id='logo-track-reverse' className="flex flex-nowrap items-center gap-x-8 w-max animate-marquee-right">
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-2.png" alt="Company 1" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-5.png" alt="Company 2" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-6.png" alt="Company 3" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-7.png" alt="Company 4" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-8.png" alt="Company 5" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-9.png" alt="Company 6" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-1.jpg" alt="Company 7" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-4.png" alt="Company 9" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-10.jpeg" alt="Company 10" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-13.png" alt="Company 11" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-14.png" alt="Company 12" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-15.png" alt="Company 13" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-16.png" alt="Company 14" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-17.jpeg" alt="Company 16" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-18.jpeg" alt="Company 17" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-19.jpeg" alt="Company 18" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-20.png" alt="Company 19" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>

                {/* Duplicate */}
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-2.png" alt="Company 1" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-5.png" alt="Company 2" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-6.png" alt="Company 3" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-7.png" alt="Company 4" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-8.png" alt="Company 5" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-9.png" alt="Company 6" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-1.jpg" alt="Company 7" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-4.png" alt="Company 9" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-10.jpeg" alt="Company 10" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-13.png" alt="Company 11" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-14.png" alt="Company 12" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-15.png" alt="Company 13" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-16.png" alt="Company 14" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-17.jpeg" alt="Company 15" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-18.jpeg" alt="Company 17" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-19.jpeg" alt="Company 18" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
                <div className="flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100 w-44 h-24 shrink-0 p-4">
                  <img src="/Brand-20.png" alt="Company 19" className="max-h-16 max-w-full w-auto h-auto object-contain" />
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Categories Section — now a swipeable carousel so it stays compact as categories are added */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-[#1F1F1F] mb-3">Top Categories</h2>
              <p className="text-muted text-[15px] leading-relaxed">Explore our most popular learning paths designed for career growth.</p>
            </div>

            <div className="relative">
              <button
                onClick={() => scrollCategories(-1)}
                aria-label="Scroll categories left"
                className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-9 h-9 items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-navy hover:border-navy hover:text-white text-[#1F1F1F] transition-colors"
              >
                <ArrowRight size={16} className="rotate-180" />
              </button>
              <button
                onClick={() => scrollCategories(1)}
                aria-label="Scroll categories right"
                className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-9 h-9 items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-navy hover:border-navy hover:text-white text-[#1F1F1F] transition-colors"
              >
                <ArrowRight size={16} />
              </button>

              <div
                ref={categoryTrackRef}
                className="flex justify-start gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth border-border pb-2 -mx-4 px-4 sm:mx-0 sm:px-6 lg:px-8 scroll-px-4 sm:scroll-px-6 lg:scroll-px-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              >
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/courses?category=${cat.slug}`}
                    data-category-card
                    className="snap-start shrink-0 w-[220px] sm:w-[240px] bg-white p-6 rounded-card shadow-[0_0_15px_rgba(0,0,0,0.08)] transition-[border-color] duration-200 ease-in-out group text-center border-t-4 border-t-transparent hover:border-t-[color:var(--cat-color)]"
                    style={{ '--cat-color': cat.color }}
                  >
                    <div className="h-20 w-20 sm:h-32 sm:w-32 mx-auto flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-[1.08] group-hover:rotate-[-2deg]">
                      <img
                        src={cat.icon}
                        alt={cat.name}
                        className="w-full h-full object-contain"
                        draggable={false}
                      />
                    </div>
                    <h3 className="font-semibold text-lg text-[#1F1F1F] mb-2">{cat.name}</h3>
                    <p className="text-sm text-muted line-clamp-2 mb-3">{cat.description}</p>
                    <div className="text-xs text-muted font-medium">
                      {cat.students}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Learn Essential Skills */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-center">

              {/* Left Text */}
              <div className="lg:col-span-1">
                <h2 className="text-3xl font-bold text-[#1F1F1F] mb-4 leading-snug">
                  Learn <em className="italic">In-Demand</em><br />
                  Skills and get ahead in your Career
                </h2>
                <p className="text-muted text-[15px] leading-relaxed">
                  LearnGrow helps you build in-demand skills fast and advance your career in a changing job market.
                </p>
              </div>

              {/* Right Cards - Peek Carousel */}
              <div className="lg:col-span-3 overflow-hidden min-w-0">
                <div
                  className="flex gap-4 sm:gap-5 lg:gap-6 transition-transform duration-500 ease-out"
                  style={{
                    transform: `translateX(calc(-${skillStartIndex} * (${cardWidthPercent}% + 1.25rem)))`,
                  }}
                >
                  {skillCards.map((card, index) => (
                    <Link
                      key={index}
                      to={card.to}
                      className="relative rounded-2xl overflow-hidden aspect-[4/5] group shadow-[0_1px_8px_rgba(0,0,0,0.10)] flex-shrink-0"
                      style={{ width: `${cardWidthPercent}%` }}
                    >
                      {card.video ? (
                        <video
                          src={card.video}
                          autoPlay
                          loop
                          muted
                          playsInline
                          disablePictureInPicture
                          disableRemotePlayback
                          controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <img
                          src={card.img}
                          alt={card.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                      <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 bg-white rounded-xl p-3 sm:p-4 flex items-center justify-between shadow-[0_2px_12px_rgba(0,0,0,0.12)]">
                        <span className="font-semibold text-[#1F1F1F] text-sm sm:text-base leading-snug">
                          {card.title}
                        </span>
                        <span className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full border border-gray-300 group-hover:bg-navy group-hover:border-navy transition-colors flex-shrink-0 ml-2">
                          <ArrowRight size={16} className="text-[#1F1F1F] group-hover:text-white transition-colors" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center justify-center gap-4 mt-8">
                  <button
                    onClick={handleSkillPrev}
                    disabled={skillStartIndex === 0}
                    className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ArrowRight size={16} className="rotate-180 text-[#1F1F1F]" />
                  </button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: skillMaxIndex + 1 }).map((_, i) => (
                      <span
                        key={i}
                        className={`h-2 rounded-full transition-all ${i === skillStartIndex ? 'w-6 bg-navy' : 'w-2 bg-gray-300'
                          }`}
                      ></span>
                    ))}
                  </div>

                  <button
                    onClick={handleSkillNext}
                    disabled={skillStartIndex === skillMaxIndex}
                    className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ArrowRight size={16} className="text-[#1F1F1F]" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

        

        {/* Featured Courses */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-[#1F1F1F] mb-1.5">Featured Courses</h2>
                <p className="text-muted text-[15px]">Learn from the best. Hand-picked courses for you.</p>
              </div>
              <Link to="/courses" className="text-primary font-semibold flex items-center gap-1 hover:underline">
                View all courses <ArrowRight size={16} />
              </Link>
            </div>

            <div className="mb-8">
              <CategoryTabs
                categories={categories}
                activeSlug={activeCategory}
                onSelect={setActiveCategory}
              />
            </div>

            {loading ? (
              <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <div key={i} className="animate-pulse bg-gray-200 rounded-card aspect-[3/4]" />
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 fade-in">
                  {paginatedCourses.length > 0 ? (
                    paginatedCourses.map((course) => (
                      <CourseCard key={course.id} course={course} />
                    ))
                  ) : (
                    <p className="col-span-full text-center text-muted py-12">No courses found for this category.</p>
                  )}
                </div>

                {totalCoursePages > 1 && (
                  <div className="flex items-center justify-center flex-wrap gap-1.5 sm:gap-2 mt-10">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      aria-label="Previous page"
                      className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full border border-gray-300 hover:bg-navy hover:border-navy hover:text-white text-[#1F1F1F] disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-[#1F1F1F] disabled:cursor-not-allowed transition-colors"
                    >
                      <ArrowRight size={16} className="rotate-180" />
                    </button>

                    {Array.from({ length: totalCoursePages }).map((_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          aria-label={`Page ${page}`}
                          aria-current={currentPage === page ? 'page' : undefined}
                          className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full text-sm font-semibold border transition-colors ${currentPage === page
                            ? 'bg-navy border-navy text-white'
                            : 'border-gray-300 text-[#1F1F1F] hover:bg-navy hover:border-navy hover:text-white'
                            }`}
                        >
                          {page}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalCoursePages, p + 1))}
                      disabled={currentPage === totalCoursePages}
                      aria-label="Next page"
                      className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full border border-gray-300 hover:bg-navy hover:border-navy hover:text-white text-[#1F1F1F] disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-[#1F1F1F] disabled:cursor-not-allowed transition-colors"
                    >
                      <ArrowRight size={16} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-[#F7F5F0] overflow-hidden">
          <div className="max-w-7xl mx-auto mb-10">
            <span className="inline-block text-xs px-1 font-bold tracking-[0.15em] text-amber uppercase mb-3">
              Our Learners Work At
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F1F1F] leading-tight max-w-xl">
              Trusted by growing professionals
            </h2>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="flex gap-6 animate-marquee w-max">
              {[...testimonial, ...testimonial].map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleCardClick(index)}
                  className="relative bg-[#0B1D45] rounded-xl overflow-hidden flex-shrink-0 shadow-lg cursor-pointer"
                  style={{ width: '300px', height: '420px' }}
                >
                  <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full border border-white/10 pointer-events-none"></div>
                  <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full border border-white/10 pointer-events-none"></div>

                  {/* Image and video crossfade in the same spot, same card, no overflow */}
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-500 ease-in-out ${playingIndex === index ? 'opacity-0' : 'opacity-100'
                      }`}
                  />
                  <video
                    ref={(el) => (testimonialVideoRefs.current[index] = el)}
                    src={item.video}
                    loop
                    disablePictureInPicture
                    disableRemotePlayback
                    playsInline
                    className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-500 ease-in-out ${playingIndex === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
                      }`}
                  />
                  <div className="absolute bottom-3 left-3 right-3 bg-white rounded-xl p-3 border-l-4 border-amber pointer-events-none">
                    <p className="font-bold text-[#1F1F1F] text-[15px] leading-tight">{item.name}</p>
                    <p className="text-indigo-600 text-[11px] leading-tight mb-1">{item.course}</p>
                    <div className="border-t border-gray-100 my-1.5"></div>
                    <p className="text-black text-[10px] leading-tight mb-1">"{item.quote}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <WhyChooseUs />

        <section id='FAQ'>
          <Faq />
        </section>
        {/* CTA Section */}
        <section className="relative py-20 bg-navy overflow-hidden">

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>

          <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
            {/* Eyebrow tag */}
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-amber rounded-full animate-ping"></span>
              <span className="text-white/70 text-sm-caption">Join 50,000+ learners today</span>
            </div>

            <h2 className="text-h1 text-white mb-4 tracking-tight">
              Your future starts
              <br />
              <span className="text-amber">
                with one click.
              </span>
            </h2>

            <p className="text-white/60 mb-8 text-base max-w-md mx-auto">
              No credit card. No commitment. Just growth — at your own pace.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/signup"
                className="group relative inline-flex items-center gap-2 bg-amber hover:opacity-90 text-navy font-semibold px-8 py-3.5 rounded-btn text-base transition-all duration-300 hover:shadow-[0_0_40px_rgba(249,171,0,0.5)] hover:-translate-y-0.5"
              >
                Create a Free Account
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>

              <Link
                to="/courses"
                className="inline-flex items-center gap-2 text-white/70 hover:text-white px-8 py-3.5 rounded-btn text-base transition group"
              >
                Explore courses
                <span className="text-white/40 group-hover:text-amber transition">↗</span>
              </Link>
            </div>

            {/* Trust strip */}
            <div className="mt-12 pt-6 border-t border-white/10 flex flex-wrap justify-center gap-x-8 gap-y-2 text-white/40 text-sm-caption">
              <span>✓ Free forever plan</span>
              <span>✓ Cancel anytime</span>
              <span>✓ 4.9/5 rating</span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}