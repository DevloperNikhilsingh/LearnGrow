/**
 * components/course/CourseCard.jsx
 */
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Users, Clock, BarChart3, CheckCircle2, Heart, ShoppingCart } from 'lucide-react';
import Badge from '../ui/Badge';
import { useCart } from '../../context/CartContext';

function StarRating({ rating }) {
  return (
    <span className="flex items-center gap-1">
      <Star size={13} className="text-amber fill-amber" />
      <span className="font-semibold text-[#1F1F1F] text-sm">{rating.toFixed(1)}</span>
    </span>
  );
}

export default function CourseCard({ course }) {

  const {addToCart} = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [flyoutStyle, setFlyoutStyle] = useState({ top: 0, left: 0, side: 'right' });
  const timeoutRef = useRef(null);
  const cardRef = useRef(null);

  const {
    slug, title, thumbnail, badge, instructor, rating, reviewCount,
    price, originalPrice, isFree, duration, level, studentsEnrolled,
    description, highlights, lastUpdated,
  } = course;

  const FLYOUT_WIDTH = 300;
  const FLYOUT_HEIGHT_ESTIMATE = 480;
  const GAP = 12;
  const EDGE_PADDING = 12;

  const computeFlyoutPosition = () => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const navEl = document.querySelector('header, nav');
    const navbarHeight = navEl ? navEl.getBoundingClientRect().height : 0;

    let side = 'right';
    let left = rect.right + GAP;
    if (left + FLYOUT_WIDTH > viewportWidth - EDGE_PADDING) {
      side = 'left';
      left = rect.left - FLYOUT_WIDTH - GAP;
    }
    left = Math.max(EDGE_PADDING, Math.min(left, viewportWidth - FLYOUT_WIDTH - EDGE_PADDING));

    let top = rect.top;
    const minTop = navbarHeight + EDGE_PADDING;
    const maxTop = viewportHeight - FLYOUT_HEIGHT_ESTIMATE - EDGE_PADDING;
    top = Math.max(minTop, Math.min(top, Math.max(minTop, maxTop)));

    setFlyoutStyle({ top, left, side });
  };

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    computeFlyoutPosition();
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 150);
  };

  // Scroll hote hi flyout turant band kar do — mouse move na hone par bhi
  useEffect(() => {
    if (!isHovered) return;

    const handleScroll = () => {
      clearTimeout(timeoutRef.current);
      setIsHovered(false);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHovered]);

  return (
    <div
      ref={cardRef}
      className="relative h-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Normal Card */}
      <Link
        to={`/course/${slug}`}
        className="card h-full flex flex-col overflow-hidden group transition-shadow duration-200 hover:shadow-card-hover"
        aria-label={`View course: ${title}`}
      >
        <div className="relative overflow-hidden aspect-video bg-gray-100 shrink-0">
          <img
            src={thumbnail}
            alt={`${title} course thumbnail`}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {badge && (
            <div className="absolute top-2 left-2">
              <Badge label={badge} />
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1 p-4 gap-2">
          <h3 className="text-base font-semibold text-[#1F1F1F] line-clamp-2 leading-snug min-h-[2.75rem] group-hover:text-primary transition-colors">
            {title}
          </h3>

          <p className="text-caption text-muted">{instructor}</p>

          <div className="flex items-center gap-3 text-caption text-muted">
            <StarRating rating={rating} />
            <span className="text-muted">({reviewCount.toLocaleString()})</span>
            <span className="flex items-center gap-1">
              <Clock size={11} /> {duration}
            </span>
          </div>

          <p className="text-caption text-muted capitalize">{level}</p>

          <div className="flex-1" />

          <div className="flex items-center gap-3 pt-2 border-t border-border">
            {isFree ? (
              <span className="text-success font-bold text-base">Free</span>
            ) : (
              <>
                <span className="text-[#1F1F1F] font-bold text-base">₹{price.toLocaleString()}</span>
                <span className="text-muted line-through text-sm">₹{originalPrice.toLocaleString()}</span>
                <span className="ml-auto text-success text-xs font-semibold">
                  {Math.round(((originalPrice - price) / originalPrice) * 100)}% off
                </span>
              </>
            )}
          </div>
        </div>
      </Link>

      {/* Right-Side Hover Flyout (Udemy style) — flips to the left near the viewport edge, clears the fixed navbar */}
      {isHovered && (
        <div
          className="hidden lg:block fixed w-[300px] bg-white rounded-lg shadow-2xl border border-border z-[60] animate-fadeInRight"
          style={{ top: `${flyoutStyle.top}px`, left: `${flyoutStyle.left}px` }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {flyoutStyle.side === 'right' ? (
            <div className="absolute top-6 -left-2 w-4 h-4 bg-white border-l border-b border-border rotate-45"></div>
          ) : (
            <div className="absolute top-6 -right-2 w-4 h-4 bg-white border-r border-t border-border rotate-45"></div>
          )}

          <div className="p-5 relative">
            <h3 className="font-bold text-[#1F1F1F] text-base mb-1.5 leading-snug">
              {title}
            </h3>

            <div className="flex items-center gap-2 mb-2">
              {badge && (
                <span className="text-[10px] font-bold uppercase tracking-wide bg-amber/10 text-amber px-2 py-0.5 rounded">
                  {badge}
                </span>
              )}
              {lastUpdated && (
                <span className="text-[11px] text-muted">Updated {lastUpdated}</span>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs mb-3">
              <span className="flex items-center gap-1 text-amber font-semibold">
                <Star size={13} className="fill-amber text-amber" />
                {rating.toFixed(1)}
              </span>
              <span className="text-muted">({reviewCount.toLocaleString()} ratings)</span>
              {studentsEnrolled && (
                <span className="flex items-center gap-1 text-muted">
                  <Users size={12} /> {studentsEnrolled.toLocaleString()}
                </span>
              )}
            </div>

            <p className="text-sm text-[#1F1F1F]/80 mb-3 line-clamp-3 leading-relaxed">
              {description || `Master ${title} with practical, hands-on lessons designed to take you from beginner to job-ready.`}
            </p>

            <div className="flex items-center gap-4 text-xs text-muted mb-4">
              <span className="flex items-center gap-1">
                <Clock size={13} /> {duration}
              </span>
              <span className="flex items-center gap-1">
                <BarChart3 size={13} /> {level}
              </span>
            </div>

            <div className="mb-4">
              <p className="text-xs font-bold text-[#1F1F1F] mb-2 uppercase tracking-wide">
                What you'll learn
              </p>
              <ul className="space-y-1.5">
                {(highlights && highlights.length > 0
                  ? highlights.slice(0, 4)
                  : [
                      'Core concepts explained step-by-step',
                      'Real-world projects & practical exercises',
                      'Lifetime access on any device',
                      'Certificate of completion',
                    ]
                ).map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[#1F1F1F]/90">
                    <CheckCircle2 size={14} className="text-success shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-xs text-muted mb-4">
              By <span className="font-medium text-[#1F1F1F]">{instructor}</span>
            </p>

            <div className="flex items-center gap-2 mb-3">
              {isFree ? (
                <span className="text-success font-bold text-lg">Free</span>
              ) : (
                <>
                  <span className="text-[#1F1F1F] font-bold text-lg">₹{price.toLocaleString()}</span>
                  <span className="text-muted line-through text-sm">₹{originalPrice.toLocaleString()}</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button aria-label='add to cart' onClick={() => addToCart(course)} className="flex-1 flex items-center justify-center gap-2 bg-navy text-white font-semibold py-2.5 rounded-lg hover:bg-[#1d3557] transition-colors text-sm">
                <ShoppingCart size={15} />
                Add to cart
              </button>
              <button
                aria-label="Add to wishlist"
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-border hover:bg-gray-50 transition-colors"
              >
                <Heart size={16} className="text-[#1F1F1F]" />
              </button>
            </div>

            <Link
              to={`/course/${slug}`}
              className="block text-center text-primary text-xs font-semibold mt-3 hover:underline"
            >
              View full course details →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}