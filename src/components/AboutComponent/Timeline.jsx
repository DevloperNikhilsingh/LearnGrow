import React, { useEffect, useRef } from 'react';
import { Rocket, Users, GraduationCap, Briefcase, Trophy, Target } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);



const MILESTONES = [
  {
    year: '1999',
    title: 'Our journey started',
    text: 'We started with a simple mission — make quality, career-focused education accessible to everyone. A small team with a big vision, beginning with foundational computer courses.',
    icon: Rocket,
    accent: '#F5A623', // brand yellow
  },
  {
    year: '2008',
    title: 'Digital shift began',
    text: 'As the internet reshaped careers, we introduced Digital Marketing and Web Development tracks to meet growing industry demand.',
    icon: Users,
    accent: '#2563EB', // brand blue
  },
  {
    year: '2015',
    title: 'Expert mentors joined',
    text: '110+ industry experts came on board to teach practical, real-world, in-demand tech and design skills.',
    icon: GraduationCap,
    accent: '#22C55E', // green
  },
  {
    year: '2021',
    title: 'Placement-driven learning',
    text: 'We introduced dedicated career support and UI/UX, Physiotherapy tracks to help learners turn courses into real job offers.',
    icon: Briefcase,
    accent: '#A855F7', // purple
  },
  {
    year: '2026',
    title: '25,000+ active students',
    text: 'LearnGrow became a trusted name for learners across tech, design, marketing, and healthcare — still growing strong.',
    icon: Trophy,
    accent: '#F5A623',
  },
];

export default function OurJourney() {
  const timelineRef = useRef(null);
  const lineFillRef = useRef(null);
  const lineFillMobileRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // GSAP: center line grows top-to-bottom, tied to scroll progress (scrub)
      [lineFillRef.current, lineFillMobileRef.current].forEach((line) => {
        if (!line) return;
        gsap.fromTo(
          line,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            transformOrigin: 'top center',
            scrollTrigger: {
              trigger: timelineRef.current,
              start: 'top 70%',
              end: 'bottom 60%',
              scrub: 0.6,
            },
          }
        );
      });

      // GSAP: each milestone card slides in from alternating sides, node pops
      const items = gsap.utils.toArray('[data-milestone]', timelineRef.current);
      items.forEach((item, i) => {
        const isLeft = i % 2 === 0;
        const card = item.querySelector('[data-milestone-card]');
        const node = item.querySelector('[data-milestone-node]');

        gsap.fromTo(
          card,
          { opacity: 0, x: isLeft ? -60 : 60 },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
          }
        );

        if (node) {
          gsap.fromTo(
            node,
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.5,
              ease: 'back.out(2)',
              scrollTrigger: {
                trigger: item,
                start: 'top 82%',
                toggleActions: 'play none none none',
              },
            }
          );
        }
      });
    }, timelineRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="our-journey"
      className="relative overflow-hidden py-24"
      style={{ backgroundColor: '#0A1128' }}
    >
      {/* ambient corner glows */}
      <div
        className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: '#F5A623' }}
      />
      <div
        className="pointer-events-none absolute -bottom-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: '#2563EB' }}
      />

      <div className="relative max-w-5xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-20">
          <span
            className="inline-block text-xs font-semibold tracking-widest uppercase rounded-full border px-4 py-1.5"
            style={{ color: '#F5A623', borderColor: 'rgba(245,166,35,0.4)' }}
          >
            Our Journey
          </span>
          <h2 className="mt-5 text-3xl md:text-5xl font-bold text-white">
            Our Journey <span style={{ color: '#F5A623' }}>So Far</span>
          </h2>
          <p className="mt-4 text-sm md:text-base text-slate-400 max-w-xl mx-auto">
            From a small idea to a platform that's transforming careers —
            here's how we've grown over the years.
          </p>
        </div>

        {/* Timeline */}
        <div ref={timelineRef} className="relative">
          {/* center line track (faint base) — desktop only */}
          <div
            className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[3px] -translate-x-1/2 rounded-full"
            style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
          />
          {/* center line fill — animates in on scroll */}
          <div
            ref={lineFillRef}
            className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[3px] -translate-x-1/2 rounded-full"
            style={{
              background: 'linear-gradient(180deg, #F5A623 0%, #2563EB 50%, #22C55E 100%)',
              boxShadow: '0 0 20px rgba(245,166,35,0.35)',
            }}
          />

          {/* mobile line track (faint base) */}
          <div
            className="md:hidden absolute left-[27px] top-0 bottom-0 w-[2px]"
            style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
          />
          {/* mobile line fill — animates in on scroll */}
          <div
            ref={lineFillMobileRef}
            className="md:hidden absolute left-[27px] top-0 bottom-0 w-[2px]"
            style={{ background: 'linear-gradient(180deg, #F5A623 0%, #2563EB 50%, #22C55E 100%)' }}
          />

          <ol className="relative flex flex-col gap-10 md:gap-16">
            {MILESTONES.map((m, i) => {
              const isLeft = i % 2 === 0;
              const Icon = m.icon;
              return (
                <li key={m.year} data-milestone className="relative md:flex md:items-center">
                  {/* center node — desktop only */}
                  <div
                    data-milestone-node
                    className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center w-6 h-6 rounded-full border-4"
                    style={{
                      backgroundColor: m.accent,
                      borderColor: '#0A1128',
                      boxShadow: `0 0 16px ${m.accent}`,
                    }}
                  />

                  <div
                    data-milestone-card
                    className={`w-full md:w-[calc(50%-40px)] pl-16 md:pl-0 ${
                      isLeft ? 'md:mr-auto md:pr-0' : 'md:ml-auto'
                    }`}
                  >
                    <div
                      className="relative rounded-2xl border p-6 backdrop-blur-sm"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.03)',
                        borderColor: 'rgba(255,255,255,0.08)',
                      }}
                    >
                      {/* ghost number */}
                      <span
                        className="absolute top-4 right-5 text-4xl font-extrabold select-none"
                        style={{ color: 'rgba(255,255,255,0.06)' }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>

                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="flex items-center justify-center w-11 h-11 rounded-xl shrink-0"
                          style={{ backgroundColor: m.accent }}
                        >
                          <Icon size={20} color="#0A1128" strokeWidth={2.25} />
                        </div>
                        <div>
                          <div
                            className="text-sm font-bold"
                            style={{ color: m.accent }}
                          >
                            {m.year}
                          </div>
                          <h3 className="text-lg font-semibold text-white leading-tight">
                            {m.title}
                          </h3>
                        </div>
                      </div>

                      <p className="text-sm text-slate-400 leading-relaxed">
                        {m.text}
                      </p>
                    </div>
                  </div>

                  {/* mobile node */}
                  <span
                    data-milestone-node
                    className="md:hidden absolute left-[20px] top-6 w-3.5 h-3.5 rounded-full border-2"
                    style={{ backgroundColor: m.accent, borderColor: '#0A1128', boxShadow: `0 0 10px ${m.accent}` }}
                  />
                </li>
              );
            })}
          </ol>
        </div>

        {/* Mission strip */}
        <div
          className="mt-20 flex flex-col sm:flex-row items-center gap-5 rounded-2xl border p-6 sm:p-8"
          style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}
        >
          <div
            className="flex items-center justify-center w-14 h-14 rounded-full shrink-0"
            style={{ backgroundColor: 'rgba(245,166,35,0.15)' }}
          >
            <Target size={26} color="#F5A623" strokeWidth={2} />
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-bold text-white">
              Our mission <span style={{ color: '#F5A623' }}>continues</span>
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              We're constantly evolving to bring the best learning experience
              and career opportunities to students across the globe.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}