/**
 * components/course/CurriculumAccordion.jsx
 * Expandable course curriculum with sections and lessons
 */
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Video, Radio, CheckCircle2 } from 'lucide-react';
import Badge from '../ui/Badge';

export default function CurriculumAccordion({ curriculum = [], completedLessons = [] }) {
  const [openSections, setOpenSections] = useState([0]);

  const toggleSection = (idx) => {
    setOpenSections((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const totalLessons = curriculum.reduce((acc, s) => acc + s.lessons.length, 0);

  return (
    <div>
      <p className="text-caption text-muted mb-3">{curriculum.length} sections • {totalLessons} lessons</p>
      <div className="border border-border rounded-card overflow-hidden divide-y divide-border">
        {curriculum.map((section, idx) => {
          const isOpen = openSections.includes(idx);
          return (
            <div key={idx}>
              {/* Section header */}
              <button
                onClick={() => toggleSection(idx)}
                className="w-full flex items-center justify-between px-4 py-3 bg-surface hover:bg-gray-100 transition-colors text-left"
                aria-expanded={isOpen}
              >
                <span className="font-semibold text-sm text-[#1F1F1F]">{section.section}</span>
                <div className="flex items-center gap-3">
                  <span className="text-caption text-muted">{section.lessons.length} lessons</span>
                  {isOpen ? <ChevronUp size={16} className="text-muted" /> : <ChevronDown size={16} className="text-muted" />}
                </div>
              </button>

              {/* Lessons */}
              {isOpen && (
                <ul className="divide-y divide-border">
                  {section.lessons.map((lesson) => {
                    const isDone = completedLessons.includes(lesson.id);
                    return (
                      <li key={lesson.id} className="flex items-center gap-3 px-5 py-3">
                        {isDone
                          ? <CheckCircle2 size={16} className="text-success flex-shrink-0" />
                          : lesson.isLive
                            ? <Radio size={16} className="text-red-500 flex-shrink-0" />
                            : <Video size={16} className="text-muted flex-shrink-0" />
                        }
                        <span className={`flex-1 text-sm ${isDone ? 'text-muted line-through' : 'text-[#1F1F1F]'}`}>
                          {lesson.title}
                        </span>
                        {lesson.isLive && (
                          <Badge label="Live" className="ml-auto" />
                        )}
                        <span className="text-caption text-muted ml-2">{lesson.duration}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
