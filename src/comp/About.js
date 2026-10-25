import React from 'react';
import Hero from '../images/traveling.jpg';
import SecondaryImg from '../images/traveling2.jpg';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Compass, ArrowRight } from 'lucide-react';
// hi ii
function AboutUs() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column: Editorial Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs uppercase tracking-[0.25em] font-bold">
              <Sparkles size={12} className="text-amber-600" />
              <span>The Royal Heritage</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              A Vision of Uncompromising <br />
              <span className="text-amber-600 italic font-serif">Elegance & Hospitality.</span>
            </h2>

            <p className="text-slate-600 text-base leading-relaxed">
              Founded over two decades ago along the scenic coastline, RoyalPark was born from a singular pursuit: to create a sanctuary where palatial grandeur and the intimacy of a private estate seamlessly coalesce.
            </p>

            <p className="text-slate-600 text-sm leading-relaxed">
              Every detail—from hand-carved teak woodwork and Italian marble baths to private garden pavilions—has been thoughtfully composed to offer discerning travelers a haven of profound calm and timeless luxury.
            </p>

            {/* Three Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
              <div className="space-y-1">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2 shadow-sm">
                  <Compass size={20} />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Prime Seclusion</h4>
                <p className="text-xs text-slate-500">Unspoiled waterfront with private cabana access.</p>
              </div>

              <div className="space-y-1">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2 shadow-sm">
                  <Sparkles size={20} />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Personal Butler</h4>
                <p className="text-xs text-slate-500">24/7 dedicated attention tailored to your rhythm.</p>
              </div>

              <div className="space-y-1">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2 shadow-sm">
                  <Shield size={20} />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Eco-Conscious</h4>
                <p className="text-xs text-slate-500">Committed to sustainable luxury & local heritage.</p>
              </div>
            </div>

            {/* Signature Quote & CTA */}
            <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <Link
                to="/explore"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-950 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-widest shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span>Read Our Full Story</span>
                <ArrowRight size={14} />
              </Link>
              <div className="text-xs text-slate-400 italic">
                “True luxury does not shout; it breathes in detail.”
              </div>
            </div>
          </div>

          {/* Right Column: Overlapping Architectural Visuals */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">

              {/* Primary Image */}
              <div className="w-4/5 h-80 sm:h-96 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src={Hero}
                  alt="RoyalPark Luxury Resort Waterfront"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Secondary Overlapping Image */}
              <div className="absolute -bottom-10 right-0 w-3/5 h-64 sm:h-72 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src={SecondaryImg}
                  alt="RoyalPark Bespoke Interior"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Floating Award Badge */}
              <div className="absolute top-6 right-8 bg-slate-950/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-xl border border-amber-500/30 flex items-center gap-3 animate-float">
                <span className="text-3xl">👑</span>
                <div>
                  <p className="text-xl font-serif font-bold text-amber-400 leading-tight">25+ Years</p>
                  <p className="text-[10px] uppercase tracking-wider text-slate-300">Of Palatial Splendor</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default AboutUs;