/**
 * components/home/WhyChooseUs.jsx
 * "We turn 'I want to learn X' into 'I got hired doing X.'" — zigzag staggered feature cards
 */
import React from 'react';
import { Infinity, Award, Lightbulb, Briefcase, IndianRupee } from 'lucide-react';

const REASONS = [
  { icon: Infinity, title: 'Lifetime access' },
  { icon: Award, title: '500+ courses' },
  { icon: Lightbulb, title: 'Learn from experts' },
  { icon: Briefcase, title: 'Career support' },
  { icon: IndianRupee, title: 'Honest pricing' },
];

const OFFSETS = ['lg:translate-y-5', 'lg:-translate-y-5', 'lg:translate-y-8', 'lg:-translate-y-4', 'lg:translate-y-5'];

export default function WhyChooseUs() {
  return (
    <section className="relative bg-white py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-4 mb-5">
          <span className="h-px w-10 sm:w-16 bg-border" />
          <span className="text-primary font-bold text-xs sm:text-sm tracking-wide whitespace-nowrap">
            Built by learners, for learners
          </span>
          <span className="h-px w-10 sm:w-16 bg-border" />
        </div>

        {/* Headline */}
        <h2 className="text-2xl sm:text-4xl font-bold text-navy text-center max-w-2xl mx-auto leading-snug mb-20 sm:mb-28">
          We turn &ldquo;I want to learn X&rdquo; into{' '}
          <span className="text-primary">&ldquo;I got hired doing X.&rdquo;</span>
        </h2>

        {/* Connecting dashed path — desktop only */}
        <svg
          className="hidden lg:block absolute left-0 right-0 pointer-events-none"
          style={{ top: '250px' }}
          width="100%"
          height="140"
          viewBox="0 0 1000 140"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M 80 110 C 180 40, 240 40, 290 80 S 400 130, 460 80 S 580 15, 650 55 S 780 120, 850 65 S 920 25, 940 20"
            stroke="#E2E8F0"
            strokeWidth="2"
            strokeDasharray="6 6"
            strokeLinecap="round"
          />
        </svg>

        {/* Cards */}
        <div className="relative grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-8">
          {REASONS.map(({ icon: Icon, title }, i) => (
            <div
              key={title}
              className={`group ${OFFSETS[i]} ${i === 4 ? 'col-span-2 sm:col-span-1' : ''}`}
            >
              <div className="bg-surface border border-border rounded-2xl px-4 py-6 text-center transition-all duration-300 ease-out group-hover:-translate-y-2 group-hover:shadow-card-hover group-hover:border-primary/40">
                <div className="h-14 w-14 rounded-xl bg-white shadow-sm border border-border flex items-center justify-center mx-auto mb-3 transition-all duration-300 ease-out group-hover:scale-110 group-hover:-rotate-6 group-hover:bg-primary/10">
                  <Icon size={24} className="text-primary" strokeWidth={2} />
                </div>
                <p className="font-bold text-navy text-[13px] sm:text-sm leading-snug">
                  {title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}