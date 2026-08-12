/**
 * components/Home/EssentialSkills.jsx
 */
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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

export default function EssentialSkills() {
  const [skillStartIndex, setSkillStartIndex] = useState(0);
  const [cardWidthPercent, setCardWidthPercent] = useState(32); // desktop default
  const [skillVisibleCount, setSkillVisibleCount] = useState(3);

  const sectionRef = useRef(null);
  const cardsTrackRef = useRef(null);

  // Responsive card width -> controls how many cards + peek show on each device
  useEffect(() => {
    const updateCardWidth = () => {
      if (window.innerWidth < 640) {
        setCardWidthPercent(82); // mobile: 1 card + small peek of next
        setSkillVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setCardWidthPercent(34); // tablet: 2 cards + small peek
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

  // GSAP: staggered entrance for skill cards on scroll into view
  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('[data-skill-card]', cardsTrackRef.current);

      gsap.fromTo(
        cards,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-center">

          {/* Left Text - Framer Motion scroll reveal */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <h2 className="text-3xl font-bold text-[#1F1F1F] mb-4 leading-snug">
              Learn <em className="italic">In-Demand</em><br />
              Skills and get ahead in your Career
            </h2>
            <p className="text-muted text-[15px] leading-relaxed">
              LearnGrow helps you build in-demand skills fast and advance your career in a changing job market.
            </p>
          </motion.div>

          {/* Right Cards - Peek Carousel */}
          <div className="lg:col-span-3 overflow-hidden min-w-0">
            <div
              ref={cardsTrackRef}
              className="flex gap-4 sm:gap-5 lg:gap-6 transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(calc(-${skillStartIndex} * (${cardWidthPercent}% + 1.25rem)))`,
              }}
            >
              {skillCards.map((card, index) => (
                <Link
                  key={index}
                  to={card.to}
                  data-skill-card
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

            {/* Pagination Controls - simple, no animation library */}
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
  );
}