import React from "react";
import { Link } from "react-router-dom";
import { Utensils, Wine, Sparkles, ArrowRight } from "lucide-react";

function Middle() {
  return (
    <section className="py-24 bg-slate-950 text-white relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-amber-400 font-bold block mb-2 font-sans">
            Culinary Artistry
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-white tracking-tight">
            Michelin-Inspired <span className="text-amber-400 italic font-serif">Gastronomy</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-4 leading-relaxed">
            Embark on an epicurean journey where indigenous coastal spices meet classical culinary techniques, curated by international master chefs.
          </p>
        </div>

        {/* Featured Dining Spread */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Main Visual */}
          <div className="lg:col-span-7 relative">
            <div className="h-80 sm:h-[480px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=85"
                alt="The Sovereign Room - Fine Dining"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>

              {/* Floating Award */}
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">Signature Venue</span>
                  <h3 className="text-2xl font-serif font-bold">The Sovereign Room</h3>
                  <p className="text-xs text-slate-300">Modern French-Asian Fusion & Sommelier Cellar</p>
                </div>
                <div className="hidden sm:block text-right">
                  <span className="text-xs font-bold text-amber-400 bg-amber-400/10 border border-amber-400/30 px-3 py-1.5 rounded-full">
                    Table d'Hôte Menu
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Dining Highlights List */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-slate-900/80 p-6 rounded-2xl border border-white/5 hover:border-amber-500/40 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center flex-shrink-0">
                  <Wine size={22} />
                </div>
                <div>
                  <h4 className="text-lg font-serif font-bold text-white mb-1">Grand Cru Sommelier Cellar</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Over 800 curated international vintages, rare reserves, and bespoke champagne pairings guided by our Master Sommelier.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/80 p-6 rounded-2xl border border-white/5 hover:border-amber-500/40 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center flex-shrink-0">
                  <Utensils size={22} />
                </div>
                <div>
                  <h4 className="text-lg font-serif font-bold text-white mb-1">Private Chef’s Table</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    An intimate 8-course gastronomic theater right before the live open hearth, paired with seasonal seafood and aged wagyu.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/80 p-6 rounded-2xl border border-white/5 hover:border-amber-500/40 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center flex-shrink-0">
                  <Sparkles size={22} />
                </div>
                <div>
                  <h4 className="text-lg font-serif font-bold text-white mb-1">The Horizon Sunset Bar</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Rooftop mixology overlooking the ocean waves with acoustic jazz, hand-rolled cigars, and small-batch tapas.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/services"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                <span>Explore Dining & Menus</span>
                <ArrowRight size={14} />
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Middle;