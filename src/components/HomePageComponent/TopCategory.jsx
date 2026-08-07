import React from 'react'
import { ArrowRight } from 'lucide-react'
import { useRef } from 'react';
import { getDynamicCategories } from '../../services/courseService';
import { Link } from 'react-router-dom';


const TopCategory = () => {

    const categoryTrackRef = useRef(null);
    const categories = getDynamicCategories();

    const scrollCategories = (direction) => {
        const track = categoryTrackRef.current;
        if (!track) return;
        const card = track.querySelector('[data-category-card]');
        const cardWidth = card ? card.offsetWidth + 24 : 240; // card width + gap
        track.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
    };


    return (
        <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-3xl font-bold text-[#1F1F1F] mb-3">Top Categories</h2>
                    <p className="text-muted text-[15px] leading-relaxed">Explore our most popular learning paths designed for career growth.</p>
                </div>

                <div className="relative">
                    <button
                        onClick={() => scrollCategories(-1)}
                        aria-label="Scroll categories left"
                        className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-9 h-9 items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-navy hover:border-navy hover:text-white text-[#1F1F1F] transition-colors"
                    >
                        <ArrowRight size={16} className="rotate-180" />
                    </button>
                    <button
                        onClick={() => scrollCategories(1)}
                        aria-label="Scroll categories right"
                        className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-9 h-9 items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-navy hover:border-navy hover:text-white text-[#1F1F1F] transition-colors"
                    >
                        <ArrowRight size={16} />
                    </button>

                    <div
                        ref={categoryTrackRef}
                        className="flex justify-start gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth border-border pb-2 -mx-4 px-4 sm:mx-0 sm:px-6 lg:px-8 scroll-px-4 sm:scroll-px-6 lg:scroll-px-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    >
                        {categories.map((cat) => (
                            <Link
                                key={cat.id}
                                to={`/courses?category=${cat.slug}`}
                                data-category-card
                                className="snap-start shrink-0 w-[220px] sm:w-[240px] bg-white p-6 rounded-card shadow-[0_0_15px_rgba(0,0,0,0.08)] transition-[border-color] duration-200 ease-in-out group text-center border-t-4 border-t-transparent hover:border-t-[color:var(--cat-color)]"
                                style={{ '--cat-color': cat.color }}
                            >
                                <div className="h-20 w-20 sm:h-32 sm:w-32 mx-auto flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-[1.08] group-hover:rotate-[-2deg]">
                                    <img
                                        src={cat.icon}
                                        alt={cat.name}
                                        className="w-full h-full object-contain"
                                        draggable={false}
                                    />
                                </div>
                                <h3 className="font-semibold text-lg text-[#1F1F1F] mb-2">{cat.name}</h3>
                                <p className="text-sm text-muted line-clamp-2 mb-3">{cat.description}</p>
                                <div className="text-xs text-muted font-medium">
                                    {cat.students}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default TopCategory
