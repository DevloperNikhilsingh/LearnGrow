/**
 * components/Home/Hero.jsx
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, PlayCircle, BookOpen, Code, Activity, Megaphone, PenTool } from 'lucide-react';
import CountUp from '../CountUp';
import ParticleNetwork from '../animation_style/ParticleNetwork';

export default function HeroSection() {
  return (
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

            {/* Person image */}
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
  );
}