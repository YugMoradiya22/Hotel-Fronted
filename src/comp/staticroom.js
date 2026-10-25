import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const FEATURED_SUITES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop",
    title: "Royal Presidential Penthouse",
    category: "Presidential",
    size: "1,850 sq ft",
    view: "360° Ocean & Skyline",
    description: "Our crowning jewel. Private rooftop infinity plunge pool, personal sommelier bar, 24/7 dedicated butler, and bespoke Italian marble bath.",
    price: "$499",
    rawPrice: 499,
    rating: 5.0,
    amenities: ["Private Pool", "Butler Service", "Oceanfront", "Free Wi-Fi"]
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1200&auto=format&fit=crop",
    title: "Deluxe Oceanfront Haven",
    category: "Oceanfront",
    size: "1,150 sq ft",
    view: "Unobstructed Sunset Waves",
    description: "Wake to the serene rhythm of waves on your oversized private sundeck. Features a plush king bed and custom espresso bar.",
    price: "$299",
    rawPrice: 299,
    rating: 4.9,
    amenities: ["Ocean Balcony", "King Plush", "Espresso Bar", "Rain Shower"]
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1200&auto=format&fit=crop",
    title: "Grand Garden Pavilion Villa",
    category: "Villa",
    size: "1,450 sq ft",
    view: "Tropical Flora & Pool",
    description: "Immersed in exotic private gardens with direct lagoon pool access. Spacious living lounge, outdoor rainfall pavilion, and dining patio.",
    price: "$360",
    rawPrice: 360,
    rating: 4.9,
    amenities: ["Private Garden", "Lagoon Access", "2 Bathrooms", "Living Lounge"]
  }
];

function SuiteCard({ suite, availableStock, roleWarning, onAttemptRestrictedBooking }) {
  const navigate = useNavigate();
  const available = availableStock !== undefined ? availableStock : 3;
  const isSoldOut = available <= 0;

  const handleBookNow = () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user && (user.role === "admin" || user.role === "staff")) {
      onAttemptRestrictedBooking(user.role);
      return;
    }

    if (isSoldOut) {
      alert("This suite is completely booked for the selected dates. Please select another luxury accommodation.");
      return;
    }

    navigate("/BookingFrompage", {
      state: {
        room: {
          title: suite.title,
          pricePerNight: suite.rawPrice,
          images: [suite.image],
          capacity: 4,
          roomType: suite.category,
          description: suite.description
        }
      }
    });
  };

  return (
    <article className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col group transform hover:-translate-y-1.5">
      
      {/* Image Container with Visual Badges */}
      <div className="relative h-72 overflow-hidden">
        <img
          src={suite.image}
          alt={suite.title}
          className="w-full h-full object-cover transform group-hover:scale-108 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>

        {/* Floating Category Tag */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-400 text-[10px] uppercase tracking-widest font-bold border border-amber-400/30">
            {suite.category}
          </span>
        </div>

        {/* Live Availability Badge */}
        <div className="absolute top-4 right-4">
          {isSoldOut ? (
            <span className="bg-red-600/90 text-white backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
              Sold Out
            </span>
          ) : (
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md backdrop-blur-md ${
              available <= 2 
                ? "bg-amber-500 text-slate-950 animate-pulse font-extrabold"
                : "bg-white/95 text-slate-900"
            }`}>
              {available <= 2 ? `🔥 Only ${available} Left!` : `${available} Available`}
            </span>
          )}
        </div>

        {/* Specs on Image */}
        <div className="absolute bottom-4 left-4 right-4 text-white flex justify-between items-end">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-amber-300 font-bold">{suite.view}</p>
            <p className="text-xs text-slate-200">{suite.size}</p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-7 flex flex-col flex-grow justify-between space-y-4">
        <div>
          <h3 className="text-2xl font-serif font-bold text-slate-900 group-hover:text-amber-600 transition-colors mb-2">
            {suite.title}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
            {suite.description}
          </p>
        </div>

        {/* Amenities Icons */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
          {suite.amenities.map((item, idx) => (
            <span key={idx} className="bg-slate-50 border border-slate-200/60 text-slate-600 text-[11px] font-semibold px-2.5 py-1 rounded-lg">
              {item}
            </span>
          ))}
        </div>

        {/* Price & Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Starting from</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-serif font-bold text-slate-900">{suite.price}</span>
              <span className="text-xs text-slate-400">/ night</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleBookNow}
              disabled={isSoldOut}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md transition-all duration-300 ${
                isSoldOut
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-slate-950 hover:bg-amber-600 text-white cursor-pointer hover:shadow-lg"
              }`}
            >
              {isSoldOut ? "Sold Out" : "Book Suite"}
            </button>
          </div>
        </div>

      </div>
    </article>
  );
}

export default function RoomListing() {
  const [activeTab, setActiveTab] = useState("All");
  const [stockMap, setStockMap] = useState({});
  const [restrictedRole, setRestrictedRole] = useState(null);

  const fetchStock = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const res = await fetch(`${API_URL}/api/bookings/stock`).catch(() => null);
      if (res && res.ok) {
        const data = await res.json();
        if (data.stockMap) {
          setStockMap(data.stockMap);
          return;
        }
      }
    } catch {
      // ignore
    }

    // Fallback: Calculate from localStorage bookings
    try {
      const local = JSON.parse(localStorage.getItem("user_bookings") || "[]");
      const counts = {};
      local.forEach(b => {
        if (b.status !== "Cancelled" && b.roomTitle) {
          counts[b.roomTitle] = (counts[b.roomTitle] || 0) + 1;
        }
      });
      const fallbackMap = {};
      FEATURED_SUITES.forEach(s => {
        const booked = counts[s.title] || 0;
        fallbackMap[s.title] = { available: Math.max(0, 3 - booked) };
      });
      setStockMap(fallbackMap);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchStock();
    window.addEventListener("bookingCreated", fetchStock);
    window.addEventListener("storage", fetchStock);
    return () => {
      window.removeEventListener("bookingCreated", fetchStock);
      window.removeEventListener("storage", fetchStock);
    };
  }, []);

  const filtered = activeTab === "All"
    ? FEATURED_SUITES
    : FEATURED_SUITES.filter(s => s.category.toLowerCase().includes(activeTab.toLowerCase()));

  return (
    <section className="py-24 bg-slate-50 relative">
      {/* Restricted Role Modal */}
      {restrictedRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center border border-amber-200">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4 text-3xl">
              👑
            </div>
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-amber-600 block mb-1">
              Role Access Policy
            </span>
            <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">
              {restrictedRole === "admin" ? "Administrator" : "Staff"} Account
            </h3>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              Personal room reservations are reserved strictly for Customer accounts. You manage inventory and hotel operations.
            </p>
            <div className="space-y-2">
              <Link
                to={restrictedRole === "admin" ? "/admin" : "/staff"}
                className="block w-full py-3 rounded-xl bg-slate-900 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Go to {restrictedRole === "admin" ? "Admin Panel" : "Staff Portal"}
              </Link>
              <button
                onClick={() => setRestrictedRole(null)}
                className="w-full py-2.5 rounded-xl text-xs text-slate-500 hover:text-slate-800 font-semibold"
              >
                Dismiss Notice
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-amber-600 font-bold block mb-2 font-sans">
            Curated Accommodations
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-slate-900 tracking-tight leading-tight">
            Signature Suites & <span className="text-amber-600 italic font-serif">Private Pavilions</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-4 leading-relaxed">
            Every suite is an architectural masterpiece designed with floor-to-ceiling vistas, handcrafted furnishings, and personalized concierge attention.
          </p>

          {/* Filter Pills */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {["All", "Presidential", "Oceanfront", "Villa"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  activeTab === tab
                    ? "bg-amber-500 text-slate-950 shadow-md scale-105"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {tab === "All" ? "All Suites" : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Suites Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((suite) => (
            <SuiteCard
              key={suite.id}
              suite={suite}
              availableStock={stockMap[suite.title]?.available}
              onAttemptRestrictedBooking={(role) => setRestrictedRole(role)}
            />
          ))}
        </div>

        {/* View All CTA */}
        <div className="mt-14 text-center">
          <Link
            to="/rooms"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-slate-900 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-widest shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <span>Explore All 150+ Available Rooms</span>
            <ArrowRight size={15} />
          </Link>
        </div>

      </div>
    </section>
  );
}
