import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Users, BedDouble, ArrowRight, ShieldCheck, Sparkles, Award } from 'lucide-react';

function Herosection() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Today and tomorrow dates as defaults
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const [bookingData, setBookingData] = useState({
    checkIn: today,
    checkOut: tomorrow,
    roomType: 'Deluxe',
    guests: 2
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      } else if (localStorage.getItem("token")) {
        setCurrentUser({ name: "Guest" });
      }
    } catch {
      setCurrentUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate("/rooms", { state: bookingData });
  };

  return (
    <div className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden">
      
      {/* Background Image with Dark Vignette & Gold Tint */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=85"
          alt="RoyalPark Grand Palace & Resort"
          className="w-full h-full object-cover object-center scale-105 animate-pulse-slow"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/50 to-slate-950/90"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-slate-950/40 to-slate-950/80"></div>
      </div>

      {/* Top Navigation Bar */}
      <header className="relative z-30 w-full border-b border-white/10 backdrop-blur-md bg-slate-950/40 transition-all">
        <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-3 group no-underline shrink-0 mr-4 xl:mr-8">
              <span className="text-3xl filter drop-shadow group-hover:scale-110 transition-transform duration-300">👑</span>
              <div className="flex flex-col">
                <span className="text-2xl font-serif font-extrabold text-white tracking-tight leading-none group-hover:text-amber-400 transition-colors">
                  RoyalPark
                </span>
                <span className="text-[9px] tracking-[0.3em] uppercase font-bold text-amber-400 font-sans mt-0.5">
                  Hotel & Resort
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-5 xl:gap-8">
              {[
                { name: "Suites", path: "/rooms" },
                { name: "Dining", path: "/services" },
                { name: "About", path: "/aboutpage" },
                { name: "Offers", path: "/offers" },
                { name: "Concierge", path: "/contact" }
              ].map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-xs uppercase tracking-widest font-semibold text-slate-200 hover:text-amber-400 transition-colors py-1 shrink-0 whitespace-nowrap"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* User Account / Action */}
            <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0 ml-auto">
              {currentUser ? (
                <div className="flex items-center gap-2 xl:gap-3">
                  {currentUser.role === "admin" && (
                    <Link
                      to="/admin"
                      className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs uppercase tracking-wider font-extrabold shadow-md transition-all flex items-center gap-1.5 shrink-0"
                    >
                      <span>👑</span>
                      <span>Admin</span>
                    </Link>
                  )}
                  {currentUser.role === "staff" && (
                    <Link
                      to="/staff"
                      className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-xs uppercase tracking-wider font-extrabold shadow-md transition-all flex items-center gap-1.5 shrink-0"
                    >
                      <span>🛠️</span>
                      <span>Staff Portal</span>
                    </Link>
                  )}
                  <Link
                    to="/mybookings"
                    className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs uppercase tracking-wider font-bold backdrop-blur-sm transition-all shrink-0 whitespace-nowrap"
                  >
                    My Bookings
                  </Link>
                  <div className="flex items-center gap-2 pl-2.5 border-l border-white/20 shrink-0">
                    <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs shadow-md shrink-0">
                      {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <span className="text-xs font-semibold text-white max-w-[90px] truncate">
                      {currentUser.name ? currentUser.name.split(" ")[0] : "User"}
                    </span>
                    {currentUser.role === "admin" && (
                      <span className="text-[9px] font-extrabold uppercase tracking-wider bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded shadow-sm">
                        Admin
                      </span>
                    )}
                    {currentUser.role === "staff" && (
                      <span className="text-[9px] font-extrabold uppercase tracking-wider bg-blue-400 text-slate-950 px-1.5 py-0.5 rounded shadow-sm">
                        Staff
                      </span>
                    )}
                    <button
                      onClick={handleLogout}
                      className="text-xs text-slate-400 hover:text-red-400 bg-transparent border-0 cursor-pointer ml-1 p-1 transition-colors"
                      title="Sign Out"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 shrink-0">
                  <Link
                    to="/login"
                    className="text-xs uppercase tracking-wider font-bold text-white hover:text-amber-400 transition-colors px-3 py-2 shrink-0"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/rooms"
                    className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs uppercase tracking-wider font-extrabold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 shrink-0"
                  >
                    Book A Stay
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-white hover:text-amber-400"
                aria-label="Toggle Navigation Menu"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-slate-950/95 border-b border-white/10 px-6 py-6 space-y-3 backdrop-blur-xl">
            {[
              { name: "Accommodations", path: "/rooms" },
              { name: "Services", path: "/services" },
              { name: "About Heritage", path: "/aboutpage" },
              { name: "Our Story", path: "/explore" },
              { name: "Concierge", path: "/contact" },
              { name: "My Bookings", path: "/mybookings" }
            ].map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-slate-200 hover:text-amber-400 text-sm font-semibold py-1.5 uppercase tracking-wider"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-white/10">
              {currentUser ? (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-amber-400 font-bold">{currentUser.name}</span>
                  <button onClick={handleLogout} className="text-xs text-red-400 bg-transparent border-0 font-bold">
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-center w-full py-2.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero Center Editorial Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 text-center pt-12 pb-10">
        
        {/* Luxury Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-400 text-xs uppercase tracking-[0.25em] font-bold mb-6 animate-fadeIn">
          <Sparkles size={13} className="text-amber-400" />
          <span>A Sanctuary of Timeless Hospitality</span>
        </div>

        {/* Regal Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-extrabold text-white tracking-tight leading-[1.1] mb-6 drop-shadow-lg">
          Where Splendor Meets <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 italic font-serif">
            Peaceful Tranquility.
          </span>
        </h1>

        {/* Narrative Subtitle */}
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-light leading-relaxed mb-8 drop-shadow">
          Surround yourself with breathtaking waterfront vistas, bespoke butler attention, Michelin-inspired cuisine, and private sanctuary villas designed for the discerning traveler.
        </p>

        {/* Quick Action CTAs */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/rooms"
            className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-bold uppercase tracking-widest shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            <span>Explore All Suites</span>
            <ArrowRight size={15} />
          </Link>
          <Link
            to="/explore"
            className="px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white text-xs font-bold uppercase tracking-widest backdrop-blur-md transition-all hover:border-white"
          >
            Watch Video Story
          </Link>
        </div>
      </div>

      {/* Floating Availability Console */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 w-full -mb-8">
        <div className="bg-white/95 backdrop-blur-xl p-5 sm:p-7 rounded-3xl shadow-2xl border border-white/80 ring-1 ring-black/5">
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            
            {/* Check-In */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar size={13} className="text-amber-600" />
                <span>Check-In</span>
              </label>
              <input
                type="date"
                name="checkIn"
                min={today}
                value={bookingData.checkIn}
                onChange={handleInputChange}
                required
                className="w-full text-sm font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
              />
            </div>

            {/* Check-Out */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar size={13} className="text-amber-600" />
                <span>Check-Out</span>
              </label>
              <input
                type="date"
                name="checkOut"
                min={bookingData.checkIn || today}
                value={bookingData.checkOut}
                onChange={handleInputChange}
                required
                className="w-full text-sm font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
              />
            </div>

            {/* Room / Suite Type */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <BedDouble size={13} className="text-amber-600" />
                <span>Suite Category</span>
              </label>
              <select
                name="roomType"
                value={bookingData.roomType}
                onChange={handleInputChange}
                className="w-full text-sm font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 cursor-pointer"
              >
                <option value="Deluxe">Deluxe Oceanfront</option>
                <option value="Suite">Presidential Suite</option>
                <option value="Double">Executive Double</option>
                <option value="Single">Single Sanctuary</option>
              </select>
            </div>

            {/* Guests */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Users size={13} className="text-amber-600" />
                <span>Guests</span>
              </label>
              <select
                name="guests"
                value={bookingData.guests}
                onChange={handleInputChange}
                className="w-full text-sm font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? "Guest" : "Guests"}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Submit */}
            <div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-slate-950 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-widest shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Check Availability
              </button>
            </div>

          </form>
        </div>
      </div>

      {/* Trust Badges Bar */}
      <div className="relative z-10 w-full pt-16 pb-4 bg-slate-950 text-slate-400 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-around gap-6 text-xs uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <Award size={15} className="text-amber-400" />
            <span className="font-semibold text-slate-300">Forbes 5-Star Rated 2026</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={15} className="text-amber-400" />
            <span className="font-semibold text-slate-300">Best Direct Booking Guarantee</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles size={15} className="text-amber-400" />
            <span className="font-semibold text-slate-300">24/7 Dedicated Butler Service</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-amber-400">🥂</span>
            <span className="font-semibold text-slate-300">Complimentary Welcome Champagne</span>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Herosection;