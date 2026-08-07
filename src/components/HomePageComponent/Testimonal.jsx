import React, { useState, useEffect, useRef } from 'react';
import { testimonial } from '../../data/testimonial';

const Testimonal = () => {

  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [testimonialWidthPercent, setTestimonialWidthPercent] = useState(23);
  const [testimonialVisibleCount, setTestimonialVisibleCount] = useState(4);
  const [playingIndex, setPlayingIndex] = useState(null);
  const testimonialVideoRefs = useRef([]);

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

  return (
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
  );
};

export default Testimonal;