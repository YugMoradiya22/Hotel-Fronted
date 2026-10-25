import React, { useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    quote: "RoyalPark is an immaculate masterpiece. From our private butler waiting at the jetty to the twilight champagne bath, not a single detail was left to chance. The finest sanctuary in South Asia.",
    author: "Lady Eleanor Vance",
    location: "London, United Kingdom",
    suite: "Stayed in Royal Presidential Penthouse",
    rating: 5,
    tag: "Forbes Verified Traveler"
  },
  {
    id: 2,
    quote: "The culinary experience at The Sovereign Room rivals three-star restaurants in Paris. Waking up to the unobstructed ocean view from the Deluxe Oceanfront Haven was pure bliss.",
    author: "Marc & Sophia Dubois",
    location: "Geneva, Switzerland",
    suite: "Stayed in Deluxe Oceanfront Haven",
    rating: 5,
    tag: "Michelin Guide Reviewer"
  },
  {
    id: 3,
    quote: "Our annual board summit was hosted in the Grand Ballroom. Flawless technology, discreet and intuitive service, and an unforgettable private beach gala. Simply peerless.",
    author: "Rajesh Singhania",
    location: "Singapore",
    suite: "Corporate Executive Retreat",
    rating: 5,
    tag: "CEO & Member"
  }
];

export default function GuestReviews() {
  const [currentIdx, setCurrentIdx] = useState(0);

  const prevReview = () => {
    setCurrentIdx((prev) => (prev === 0 ? REVIEWS.length - 1 : prev - 1));
  };

  const nextReview = () => {
    setCurrentIdx((prev) => (prev === REVIEWS.length - 1 ? 0 : prev + 1));
  };

  const review = REVIEWS[currentIdx];

  return (
    <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Decorative Golden Ambient Backdrops */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-amber-400 font-bold block mb-2 font-sans">
            Press & Guest Recognition
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-white tracking-tight">
            Voices of <span className="text-amber-400 italic font-serif">Distinction</span>
          </h2>
          <p className="text-slate-400 text-sm mt-3">
            Acclaimed by international hospitality critics and treasured by world travelers.
          </p>
        </div>

        {/* Featured Testimonial Card */}
        <div className="bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-14 shadow-2xl relative max-w-4xl mx-auto">
          
          <Quote className="text-amber-500/20 w-20 h-20 absolute top-6 right-8 pointer-events-none" />

          {/* Stars */}
          <div className="flex items-center gap-1 mb-6">
            {[...Array(review.rating)].map((_, i) => (
              <Star key={i} size={18} fill="currentColor" className="text-amber-400" />
            ))}
            <span className="text-xs text-amber-400 font-bold ml-2 uppercase tracking-widest">{review.tag}</span>
          </div>

          {/* Quote Text */}
          <blockquote className="text-lg sm:text-2xl font-serif italic text-slate-100 leading-relaxed mb-8">
            “{review.quote}”
          </blockquote>

          {/* Author Details & Navigation Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-6 border-t border-white/10">
            <div>
              <p className="font-serif font-bold text-lg text-white">{review.author}</p>
              <p className="text-xs text-amber-400 font-medium">{review.location}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{review.suite}</p>
            </div>

            {/* Slider Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={prevReview}
                aria-label="Previous Review"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-amber-500 hover:text-slate-950 text-slate-300 flex items-center justify-center transition-all border border-white/10"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-xs font-mono text-slate-400">
                0{currentIdx + 1} / 0{REVIEWS.length}
              </span>
              <button
                onClick={nextReview}
                aria-label="Next Review"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-amber-500 hover:text-slate-950 text-slate-300 flex items-center justify-center transition-all border border-white/10"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

        </div>

        {/* Press Mentions Bar */}
        <div className="mt-16 pt-10 border-t border-white/5 flex flex-wrap items-center justify-around gap-8 text-slate-500 text-xs uppercase tracking-[0.25em] font-serif">
          <span className="hover:text-slate-300 transition-colors">Condé Nast Traveler Gold List</span>
          <span className="text-amber-400">✦</span>
          <span className="hover:text-slate-300 transition-colors">Travel + Leisure World’s Best</span>
          <span className="text-amber-400">✦</span>
          <span className="hover:text-slate-300 transition-colors">Michelin Key Hotels 2026</span>
          <span className="text-amber-400">✦</span>
          <span className="hover:text-slate-300 transition-colors">Robb Report Best of the Best</span>
        </div>

      </div>
    </section>
  );
}
