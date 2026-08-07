import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function TeamCarousel({ team }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = team.length;

  const goTo = (idx) => {
    setActiveIndex(((idx % total) + total) % total);
  };

  const prev = () => goTo(activeIndex - 1);
  const next = () => goTo(activeIndex + 1);

  return (
    <div className="relative w-full select-none">
      {/* Carousel Stage */}
      <div className="relative h-[500px] flex items-center justify-center overflow-hidden">
        {team.map((member, idx) => {
          let offset = idx - activeIndex;
          if (offset > total / 2) offset -= total;
          if (offset < -total / 2) offset += total;

          const isActive = offset === 0;
          const abs = Math.abs(offset);

          if (abs > 2) return null;

          // Position spread: active = 0, ±1 = ±260px, ±2 = ±470px
          const translateX = offset * 260;
          const scale = isActive ? 1 : abs === 1 ? 0.78 : 0.60;
          const zIndex = 10 - abs;
          // Darker overlay on side cards (like image)
          const overlayOpacity = isActive ? 0 : abs === 1 ? 0.45 : 0.70;

          return (
            <div
              key={idx}
              onClick={() => goTo(idx)}
              className="absolute transition-all duration-500 ease-out cursor-pointer"
              style={{
                transform: `translateX(${translateX}px) scale(${scale})`,
                zIndex,
                transformOrigin: 'center center',
              }}
            >
              {/* Card */}
              <div
                className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
                style={{ width: '240px' }}
              >
                {/* Top image area */}
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover object-top"
                    draggable={false}
                  />
                </div>

                {/* Info area */}
                <div className="p-5 text-left">
                  <h3 className="text-base font-bold text-navy leading-tight">{member.name}</h3>
                  <p className="text-primary text-sm font-medium mt-1">{member.role}</p>
                  <button
                    tabIndex={isActive ? 0 : -1}
                    className="mt-4 w-full py-2 rounded-full border-2 border-gray-800 text-gray-800 text-sm font-semibold hover:bg-gray-800 hover:text-white transition-colors"
                    style={{ pointerEvents: isActive ? 'auto' : 'none' }}
                  >
                    View Profile
                  </button>
                </div>

                {/* Dark overlay for non-active cards */}
                <div
                  className="absolute inset-0 rounded-2xl transition-all duration-500 pointer-events-none"
                  style={{
                    background: `rgba(0,0,0,${overlayOpacity})`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Prev / Next arrows */}
      <button
        onClick={prev}
        aria-label="Previous"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white shadow-lg rounded-full p-3 hover:bg-primary hover:text-white transition-colors border border-border"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={next}
        aria-label="Next"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white shadow-lg rounded-full p-3 hover:bg-primary hover:text-white transition-colors border border-border"
      >
        <ChevronRight size={22} />
      </button>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-8">
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
    </div>
  );
}
