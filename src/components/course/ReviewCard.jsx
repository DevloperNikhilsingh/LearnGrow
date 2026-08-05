/**
 * components/course/ReviewCard.jsx
 */
import React from 'react';
import { Star } from 'lucide-react';

export default function ReviewCard({ review }) {
  const { user, avatar, rating, comment, date } = review;
  return (
    <article className="flex gap-4 py-4 border-b border-border last:border-0">
      {/* Avatar */}
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-sm">
        {avatar}
      </div>
      {/* Content */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-sm text-[#1F1F1F]">{user}</span>
          <span className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={12} className={i < rating ? 'text-amber fill-amber' : 'text-gray-300 fill-gray-300'} />
            ))}
          </span>
          <span className="text-caption text-muted ml-auto">{date}</span>
        </div>
        <p className="text-sm text-[#1F1F1F]">{comment}</p>
      </div>
    </article>
  );
}
