import React, { useState } from 'react';
import '../Componentcss/OffersHero.css';
import { Link } from 'react-router-dom';

function OffersHero() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <section className="offers-hero-section">
      {/* 1. The Background Image Container */}
      <div className="hero-image-container">
        <img 
          src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
          alt="Luxury hotel pool at sunset" 
          className="hero-bg-img"
        />
        <div className="hero-overlay"></div>
      </div>

      {/* 2. The Floating Content Card */}
      <div className="hero-content-wrapper">
        <div className="hero-text-card">
          <span className="offer-tag">✨ Seasonal Privileges</span>
          
          <h2 className="hero-headline font-serif">
            Unlock Your Next <span className="highlight-text italic">Dream Stay</span> for Less.
          </h2>
          
          <p className="hero-subtext">
            Experience world-class luxury without compromise. Save up to 30% on signature suites and enjoy complimentary gourmet breakfast and airport chauffeur on select stays.
          </p>
          
          {subscribed ? (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold mb-4 border border-emerald-200">
              ✓ Thank you! You will now receive private VIP member discounts.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2 mb-4">
              <input
                type="email"
                placeholder="Enter email for VIP offers"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-xs p-2.5 rounded-lg border border-slate-300 flex-1 outline-none text-slate-800"
              />
              <button type="submit" className="text-xs font-bold uppercase tracking-wider bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 rounded-lg transition-colors">
                Claim
              </button>
            </form>
          )}

          <div className="hero-actions">
            <Link to="/rooms" className="btn-hero-primary no-underline text-center">
              View All Offers & Suites
            </Link>
            <Link to="/contact" className="btn-hero-secondary no-underline text-center">
              Contact Concierge
            </Link>
          </div>

          <p className="offer-disclaimer">Seasonal offers apply to direct reservations. T&Cs apply.</p>
        </div>
      </div>
    </section>
  );
}

export default OffersHero;