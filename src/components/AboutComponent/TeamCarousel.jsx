import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Users, Rocket, GraduationCap, Globe2, Linkedin, Twitter, Mail } from 'lucide-react';

const CARD_STYLES = [
  { ring: 'bg-violet-200', badgeIcon: '✏️' },
  { ring: 'bg-emerald-100', badgeIcon: '💻' },
  { ring: 'bg-amber-300', badgeIcon: '👑' },
  { ring: 'bg-rose-200', badgeIcon: '📣' },
  { ring: 'bg-sky-200', badgeIcon: '🎧' },
];

const STATS = [
  { icon: Users, value: '10+', label: 'Team Members' },
  { icon: Rocket, value: '10+', label: 'Years Together' },
  { icon: GraduationCap, value: '25K+', label: 'Learners Impacted' },
  { icon: Globe2, value: '20+', label: 'Countries Reached' },
];

export default function TeamCarousel({ team }) {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(Math.floor((team?.length ?? 1) / 2));
  const total = team.length;

  const goTo = (idx) => setActiveIndex(((idx % total) + total) % total);
  const prev = () => goTo(activeIndex - 1);
  const next = () => goTo(activeIndex + 1);

  return (
    <section className="relative w-full select-none overflow-hidden bg-surface py-16 sm:py-24 px-4">
      <div className="absolute top-10 right-10 grid grid-cols-6 gap-2 opacity-30 pointer-events-none">
        {Array.from({ length: 24 }).map((_, i) => (
          <span key={i} className="w-1 h-1 rounded-full bg-indigo-400" />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-5">
            <Users size={16} /> OUR TEAM
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-navy leading-tight">
            Meet the People Behind
            <br />
            Our <span className="text-primary">Success</span>
          </h2>
          <div className="mt-4 h-1 w-24 rounded-full bg-primary" />
          <p className="mt-5 max-w-xl text-slate-500 text-base sm:text-lg">
            A passionate team of learners, builders, and innovators working together to empower your growth.
          </p>
        </div>

        <div className="relative h-[480px] flex items-center justify-center overflow-hidden">
          {team.map((member, idx) => {
            let offset = idx - activeIndex;
            if (offset > total / 2) offset -= total;
            if (offset < -total / 2) offset += total;

            const isActive = offset === 0;
            const abs = Math.abs(offset);
            if (abs > 2) return null;

            const translateX = offset * 250;
            const scale = isActive ? 1 : abs === 1 ? 0.8 : 0.62;
            const zIndex = 10 - abs;
            const overlayOpacity = isActive ? 0 : abs === 1 ? 0.35 : 0.6;
            const style = CARD_STYLES[idx % CARD_STYLES.length];

            return (
              <div
                key={idx}
                onClick={() => goTo(idx)}
                className="absolute transition-all duration-500 ease-out cursor-pointer"
                style={{ transform: `translateX(${translateX}px) scale(${scale})`, zIndex }}
              >
                <div
                  className={`relative w-[240px] rounded-2xl shadow-xl border overflow-hidden ${
                    isActive
                      ? 'bg-navy border-navy'
                      : 'bg-white border-border'
                  }`}
                >
                  <div className="flex flex-col items-center pt-8 pb-6 px-5">
                    <div className={`relative w-24 h-24 rounded-full ${style.ring} p-1.5`}>
                      <img
                        src={member.img}
                        alt={member.name}
                        className="w-full h-full object-cover object-top rounded-full"
                        draggable={false}
                      />
                      <span className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-sm">
                        {style.badgeIcon}
                      </span>
                    </div>

                    <h3 className={`mt-4 text-base font-bold text-center ${isActive ? 'text-white' : 'text-navy'}`}>
                      {member.name}
                    </h3>
                    <p className={`text-sm font-semibold mt-1 ${isActive ? 'text-primary' : 'text-primary'}`}>
                      {member.role}
                    </p>

                    {isActive && (
                      <>
                        <div className="mt-3 h-px w-16 bg-white/30" />
                        <p className="mt-3 text-center text-sm leading-relaxed text-white/80">
                          {member.bio}
                        </p>
                        <div className="flex gap-2 mt-5">
                          {(member.links ?? ['linkedin', 'mail']).map((type) => {
                            const Icon = type === 'linkedin' ? Linkedin : type === 'twitter' ? Twitter : Mail;
                            return (
                              <a
                                key={type}
                                href={member.social?.[type] ?? '#'}
                                aria-label={type}
                                className="w-8 h-8 rounded-full flex items-center justify-center bg-white text-primary hover:bg-primary hover:text-white transition-colors"
                              >
                                <Icon size={14} />
                              </a>
                            );
                          })}
                        </div>

                        <button
                        aria-label='View Profile'
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/instructor/${member.slug}`);
                          }}
                          className="mt-4 px-5 py-2 rounded-full bg-white text-navy text-sm font-semibold hover:bg-primary hover:text-white transition-colors"
                        >
                          View Profile
                        </button>
                      </>
                    )}
                  </div>

                  <div
                    className="absolute inset-0 rounded-2xl transition-all duration-500 pointer-events-none"
                    style={{ background: `rgba(0,0,0,${overlayOpacity})` }}
                  />
                </div>
              </div>
            );
          })}

          <button
          aria-label="previous"
            onClick={prev}
            aria-label="Previous"
            className="absolute left-0 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-white shadow-lg rounded-full p-3 hover:bg-primary hover:text-white transition-colors border border-border"
          >
            <ChevronLeft size={20} />
          </button>
          <button
          aria-label="next"
            onClick={next}
            aria-label="Next"
            className="absolute right-0 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-white shadow-lg rounded-full p-3 hover:bg-primary hover:text-white transition-colors border border-border"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-4">
          {team.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all ${
                idx === activeIndex ? 'w-6 bg-primary' : 'w-2.5 bg-border'
              }`}
            />
          ))}
        </div>

        <div className="mt-14 bg-white rounded-2xl shadow-lg border border-border py-6 px-6 sm:px-10 flex flex-wrap justify-around gap-6">
          {STATS.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="flex items-center gap-3">
                <span className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Icon size={20} />
                </span>
                <div>
                  <p className="text-xl font-extrabold text-navy leading-none">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Usage — make sure each team member includes a `slug` matching your instructors data:
// <TeamCarousel team={[
//   { name: 'Priya Sharma', role: 'Head of Learning', slug: 'priya-sharma', bio: '...', img: '...' },
//   { name: 'Rahul Mehta', role: 'Lead Developer', slug: 'rahul-mehta', bio: '...', img: '...' },
//   { name: 'Aman Verma', role: 'Founder & CEO', slug: 'aman-verma', bio: '...', img: '...', links: ['linkedin','twitter','mail'] },
//   { name: 'Neha Kapoor', role: 'Marketing Lead', slug: 'neha-kapoor', bio: '...', img: '...' },
//   { name: 'Arjun Nair', role: 'Support Manager', slug: 'arjun-nair', bio: '...', img: '...' },
// ]} />