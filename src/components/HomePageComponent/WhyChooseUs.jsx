import React, { useEffect, useRef, useState } from 'react';
import { Infinity, Lightbulb, Briefcase, IndianRupee, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FEATURES = [
  {
    id: 1,
    tag: '01',
    label: 'Lifetime access',
    to:'/courses',
    title: 'Learn once, own it forever',
    desc: 'Buy once, learn forever. Every future update to your course comes at zero extra cost.',
    stats: [
      { label: 'Courses', value: 110, suffix: '+' },
      { label: 'Categories', value: 10, suffix: '+' },
    ],
    icon: Infinity,
    bg: 'bg-navy',
  },
  {
    id: 2,
    tag: '02',
    label: 'Real experts',
    to:'/about#ourteam',
    title: 'Real experts, real skills',
    desc: 'Every instructor is a working practitioner — not a narrator reading slides.',
    stats: [
      { label: 'Avg rating', value: 4.7, suffix: '★', decimal: true },
      { label: 'Students', value: 25, suffix: 'k+' },
    ],
    icon: Lightbulb,
    bg: 'bg-primary',
  },
  {
    id: 3,
    tag: '03',
    label: 'Career support',
    to:'/courses',
    title: 'Career support that shows up',
    desc: 'Resume reviews, mock interviews, and referrals — built into every course track.',
    stats: [
      { label: 'Success stories', value: 1.5, suffix: 'k+', decimal: true },
      { label: 'Hiring partners', value: 110, suffix: '+' },
    ],
    icon: Briefcase,
    bg: 'bg-success',
  },
  {
    id: 4,
    tag: '04',
    label: 'Honest pricing',
    to:'/courses',
    title: 'Honest pricing, no surprises',
    desc: 'No hidden fees, no surprise renewals. What you see at checkout is what you pay.',
    stats: [
      { label: 'Hidden fees', value: 0, suffix: '' },
      { label: 'Refund window', value: 7, suffix: 'd' },
    ],
    icon: IndianRupee,
    bg: 'bg-amber',
    dark: true,
  },
];

const AUTOPLAY_MS = 5000;

function AnimatedNumber({ value, decimal, suffix }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let raf;
    const start = performance.now();
    const duration = 2000;
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return (
    <span>
      {decimal ? display.toFixed(1) : Math.round(display)}
      {suffix}
    </span>
  );
}

export default function WhyChooseUs() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    if (paused) {
      cancelAnimationFrame(rafRef.current);
      return;
    }
    startRef.current = performance.now() - progress * AUTOPLAY_MS;
    const tick = (now) => {
      const elapsed = now - startRef.current;
      const pct = Math.min(elapsed / AUTOPLAY_MS, 1);
      setProgress(pct);
      if (pct >= 1) {
        setActive((a) => (a + 1) % FEATURES.length);
        setProgress(0);
        startRef.current = performance.now();
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, active]);

  const handleSelect = (i) => {
    setActive(i);
    setProgress(0);
  };

  const current = FEATURES[active];
  const Icon = current.icon;
  const isDark = !!current.dark;

  const navigate=useNavigate()

  return (
    <section
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20"
      
    >
      <div className="mb-8 sm:mb-10 lg:mb-12 max-w-2xl mx-auto text-center">
        <span className="inline-block text-xs font-semibold uppercase tracking-wider text-primary mb-3">
          Why learners choose us
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-navy leading-tight">
          Built for people who actually <span className="text-amber">finish</span>
          <br className="hidden sm:block" /> what they start
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr] gap-0 rounded-2xl overflow-hidden border border-black/5">
        {/* Left: story-style tab list */}
        <div className="bg-gray-100 p-2 sm:p-3 flex flex-row md:flex-col gap-2 md:gap-1 overflow-x-auto md:overflow-visible no-scrollbar md:border-r border-black/5">
          {FEATURES.map((f, i) => {
            const FIcon = f.icon;
            const isActive = i === active;
            return (
              <button
                key={f.id}
                onClick={() => handleSelect(i)}
                className={`relative shrink-0 md:w-full text-left rounded-xl px-3 py-2 md:px-4 md:py-3 transition-all duration-200 flex items-center gap-2 md:gap-3 ${isActive ? 'bg-white shadow-sm' : 'hover:bg-white/60'
                  }`}
              >
                <span
                  className={`flex items-center justify-center w-7 h-7 md:w-9 md:h-9 rounded-lg shrink-0 transition-colors duration-300 ${isActive ? f.bg : 'bg-gray-100'
                    }`}
                >
                  <FIcon
                    size={14}
                    className={isActive ? 'text-white' : 'text-gray-400'}
                    strokeWidth={1.75}
                  />
                </span>
                <span className="min-w-0">
                  <span
                  
                    className={`block text-[12px] md:text-sm font-medium whitespace-nowrap md:truncate ${isActive ? 'text-navy' : 'text-gray-500'
                      }`}
                  >
                    {f.label}
                  </span>
                  <span className="hidden md:block text-xs text-gray-400">{f.tag}</span>
                </span>

                {/* autoplay progress track */}
                <span className="absolute left-2 right-2 bottom-1 md:left-4 md:right-4 md:bottom-1.5 h-[2px] bg-gray-200 rounded-full overflow-hidden">
                  <span
                    className="block h-full bg-amber rounded-full"
                    style={{
                      width: isActive ? `${progress * 100}%` : i < active ? '100%' : '0%',
                      transition: isActive ? 'none' : 'width 0.3s ease',
                    }}
                  />
                </span>
              </button>
            );
          })}
        </div>

        {/* Right: interactive content panel */}
        <div
          className={`relative p-6 sm:p-8 md:p-10 lg:p-12 flex items-center transition-colors duration-500 ${current.bg}`}
        >
          {isDark && <span className="absolute inset-0 bg-white/10 pointer-events-none" />}
          <div className="w-full relative">
            <div
              key={current.id}
              className="animate-[fadeSlide_0.4s_ease]"
            >
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <span
                  className={`w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0 ${isDark ? 'bg-navy/10' : 'bg-white/15'
                    }`}
                >
                  <Icon
                    size={20}
                    className={isDark ? 'text-navy sm:w-[22px] sm:h-[22px]' : 'text-white sm:w-[22px] sm:h-[22px]'}
                    strokeWidth={1.5}
                  />
                </span>
                <span
                  className={`text-[11px] sm:text-xs uppercase tracking-wider font-medium ${isDark ? 'text-navy/70' : 'text-white/70'
                    }`}
                >
                  Step {current.tag}
                </span>
              </div>

              <h3
                className={`text-xl sm:text-2xl md:text-3xl font-bold mb-2.5 sm:mb-3 leading-tight ${isDark ? 'text-navy' : 'text-white'
                  }`}
              >
                {current.title}
              </h3>
              <p
                className={`text-sm md:text-base max-w-md mb-6 sm:mb-8 leading-relaxed ${isDark ? 'text-navy/70' : 'text-white/75'
                  }`}
              >
                {current.desc}
              </p>

              <div className="flex flex-wrap gap-6 sm:gap-8 mb-6 sm:mb-8">
                {current.stats.map((s) => (
                  <div key={s.label}>
                    <p
                      className={`text-xl sm:text-2xl md:text-3xl font-bold tabular-nums ${isDark ? 'text-navy' : 'text-white'
                        }`}
                    >
                      <AnimatedNumber value={s.value} decimal={s.decimal} suffix={s.suffix} />
                    </p>
                    <p className={`text-xs mt-1 ${isDark ? 'text-navy/60' : 'text-white/60'}`}>
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>

              <button
              onClick={() => navigate(current.to)}
                className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium transition-colors rounded-full px-3.5 sm:px-4 py-1.5 sm:py-2 ${isDark
                    ? 'text-navy bg-navy/10 hover:bg-navy/20'
                    : 'text-white bg-white/10 hover:bg-white/20'
                  }`}
              >
                Explore {current.label.toLowerCase()}
                <ArrowUpRight size={14} />
              </button>
            </div>
          </div>

          {/* decorative index watermark */}
          <span
            className={`absolute right-3 bottom-0 sm:right-4 md:right-6 sm:bottom-1 md:bottom-2 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold pointer-events-none select-none ${isDark ? 'text-navy/10' : 'text-white/10'
              }`}
          >
            {current.tag}
          </span>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}