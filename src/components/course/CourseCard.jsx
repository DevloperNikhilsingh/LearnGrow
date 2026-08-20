/**
 * components/course/CourseCard.jsx
 */
import React, { useState } from 'react';
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

  const { addToCart } = useCart();
  const [isFlipped, setIsFlipped] = useState(false);

  const {
    slug, title, thumbnail, badge, instructor, rating, reviewCount,
    price, originalPrice, isFree, duration, level, studentsEnrolled,
    description, highlights, lastUpdated,
  } = course;

  return (
    <div
      className="relative h-full [perspective:1200px]"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div
        className="relative h-full min-h-[380px] transition-transform duration-500 [transform-style:preserve-3d]"
        style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        {/* FRONT FACE — same as your normal card */}
        <div className="absolute inset-0 [backface-visibility:hidden]">
          <Link
            to={`/course/${slug}`}
            className="card h-full flex flex-col overflow-hidden group"
            aria-label={`View course: ${title}`}
          >
            <div className="relative overflow-hidden aspect-video bg-gray-100 shrink-0">
              <img
                src={thumbnail}
                alt={`${title} course thumbnail`}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              {badge && (
                <div className="absolute top-2 left-2">
                  <Badge label={badge} />
                </div>
              )}
            </div>

            <div className="flex flex-col flex-1 p-4 gap-2">
              <h3 className="text-base font-semibold text-[#1F1F1F] line-clamp-2 leading-snug min-h-[2.75rem]">
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
        </div>

        {/* BACK FACE — same content that used to be in the right-side flyout */}
        <div
          className="absolute inset-0 [backface-visibility:hidden] bg-white rounded-lg shadow-2xl border border-border overflow-y-auto"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <div className="p-5">
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
              <button
                aria-label="add to cart"
                onClick={(e) => {
                  e.preventDefault();
                  addToCart(course);
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-navy text-white font-semibold py-2.5 rounded-lg hover:bg-[#1d3557] transition-colors text-sm"
              >
                <ShoppingCart size={15} />
                Add to cart
              </button>
              <button
                aria-label="Add to wishlist"
                onClick={(e) => e.preventDefault()}
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
      </div>
    </div>
  );
}