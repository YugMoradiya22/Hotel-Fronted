import { Link } from "react-router-dom";
import "../Componentcss/footer.css";
import { FaFacebookF, FaInstagram, FaYoutube, FaTwitter, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-amber-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* COLUMN 1: BRAND */}
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <span className="text-3xl filter drop-shadow">👑</span>
              <div>
                <span className="text-2xl font-serif font-extrabold text-white tracking-tight">RoyalPark</span>
                <span className="block text-[9px] tracking-[0.25em] uppercase text-amber-500 font-bold font-sans">
                  Luxury Hotel & Resort
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed">
              Where luxury meets timeless serenity. Immerse yourself in unmatched hospitality, world-class dining, and tailored experiences crafted for the discerning traveler.
            </p>

            <div className="pt-2">
              <Link 
                to="/rooms" 
                className="inline-block px-5 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Book Your Stay
              </Link>
            </div>
          </div>

          {/* COLUMN 2: QUICK LINKS */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-amber-400 mb-4 font-sans">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/rooms" className="text-slate-400 hover:text-white transition-colors">
                  Rooms & Suites
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-slate-400 hover:text-white transition-colors">
                  Services & Amenities
                </Link>
              </li>
              <li>
                <Link to="/aboutpage" className="text-slate-400 hover:text-white transition-colors">
                  About Our Heritage
                </Link>
              </li>
              <li>
                <Link to="/explore" className="text-slate-400 hover:text-white transition-colors">
                  Explore Story
                </Link>
              </li>
              <li>
                <Link to="/mybookings" className="text-slate-400 hover:text-white transition-colors">
                  Manage Bookings
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: HOTEL AMENITIES */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-amber-400 mb-4 font-sans">
              Experiences
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="hover:text-white transition-colors cursor-pointer">Michelin-Inspired Fine Dining</li>
              <li className="hover:text-white transition-colors cursor-pointer">Royal Serenity Wellness Spa</li>
              <li className="hover:text-white transition-colors cursor-pointer">Panoramic Infinity Pool</li>
              <li className="hover:text-white transition-colors cursor-pointer">Executive Concierge & Chauffeur</li>
              <li className="hover:text-white transition-colors cursor-pointer">Grand Ballrooms & Private Events</li>
            </ul>
          </div>

          {/* COLUMN 4: CONTACT & SOCIAL */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-amber-400 mb-4 font-sans">
              Concierge Desk
            </h3>
            <div className="space-y-3 text-sm text-slate-400 mb-6">
              <p className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-amber-500 flex-shrink-0" />
                <span>100 Royal Avenue, Marine Bay, Mumbai, 400001</span>
              </p>
              <p className="flex items-center gap-3">
                <FaPhoneAlt className="text-amber-500 flex-shrink-0" />
                <span>+91 (022) 555-ROYAL</span>
              </p>
              <p className="flex items-center gap-3">
                <FaEnvelope className="text-amber-500 flex-shrink-0" />
                <span>concierge@royalpark.com</span>
              </p>
            </div>

            <div className="flex gap-3">
              <a href="#facebook" className="w-9 h-9 rounded-full bg-slate-800 hover:bg-amber-600 text-slate-300 hover:text-white flex items-center justify-center transition-all">
                <FaFacebookF size={14} />
              </a>
              <a href="#instagram" className="w-9 h-9 rounded-full bg-slate-800 hover:bg-amber-600 text-slate-300 hover:text-white flex items-center justify-center transition-all">
                <FaInstagram size={15} />
              </a>
              <a href="#twitter" className="w-9 h-9 rounded-full bg-slate-800 hover:bg-amber-600 text-slate-300 hover:text-white flex items-center justify-center transition-all">
                <FaTwitter size={14} />
              </a>
              <a href="#youtube" className="w-9 h-9 rounded-full bg-slate-800 hover:bg-amber-600 text-slate-300 hover:text-white flex items-center justify-center transition-all">
                <FaYoutube size={15} />
              </a>
            </div>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 RoyalPark Luxury Hotels & Resorts. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/contact" className="hover:text-amber-400 transition-colors">Privacy Policy</Link>
            <Link to="/contact" className="hover:text-amber-400 transition-colors">Terms of Service</Link>
            <Link to="/contact" className="hover:text-amber-400 transition-colors">Guest Safety</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
