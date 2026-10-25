import React, { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import placeholderImg from "../images/room1.jpg"; 

const API_URL = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api/rooms` : "http://localhost:5000/api/rooms"; 

// Default Luxury Rooms if database has not yet been seeded
const FALLBACK_ROOMS = [
  {
    _id: "room_fallback_1",
    title: "Royal Presidential Suite",
    roomType: "Suite",
    pricePerNight: 499,
    capacity: 4,
    description: "Panoramic penthouse views of the ocean, private plunge pool, 24/7 personal butler service, and marble master bath.",
    amenities: ["Ocean View", "Private Pool", "Butler Service", "Free Wi-Fi", "Champagne Bar"],
    images: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop"]
  },
  {
    _id: "room_fallback_2",
    title: "Deluxe Oceanfront Haven",
    roomType: "Deluxe",
    pricePerNight: 299,
    capacity: 2,
    description: "Wake up to gentle ocean waves. Features a furnished private terrace, king plush mattress, and sunset views.",
    amenities: ["Oceanfront", "Terrace", "Espresso Bar", "King Bed", "Smart TV"],
    images: ["https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1200&auto=format&fit=crop"]
  },
  {
    _id: "room_fallback_3",
    title: "Executive Business Suite",
    roomType: "Double",
    pricePerNight: 220,
    capacity: 2,
    description: "Tailored for discerning professionals. Ergonomic workspace, ultra-high-speed fiber Wi-Fi, and lounge club access.",
    amenities: ["Work Desk", "Lounge Access", "High-speed Wi-Fi", "Breakfast Included"],
    images: ["https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1200&auto=format&fit=crop"]
  },
  {
    _id: "room_fallback_4",
    title: "Grand Family Garden Villa",
    roomType: "Suite",
    pricePerNight: 360,
    capacity: 5,
    description: "A private retreat nestled in lush tropical flora with two interconnected master suites and private patio dining.",
    amenities: ["Private Garden", "2 Bedrooms", "Kitchenette", "Child Friendly", "Pool Access"],
    images: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200&auto=format&fit=crop"]
  },
  {
    _id: "room_fallback_5",
    title: "Signature Penthouse Sanctuary",
    roomType: "Suite",
    pricePerNight: 550,
    capacity: 4,
    description: "Top-floor luxury with 360-degree skylines, whirlpool Jacuzzi, dedicated sommelier cellar, and private terrace.",
    amenities: ["Jacuzzi", "Skyline View", "Private Bar", "Balcony", "Spa Bath"],
    images: ["https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1200&auto=format&fit=crop"]
  },
  {
    _id: "room_fallback_6",
    title: "Classic Elegance King",
    roomType: "Single",
    pricePerNight: 160,
    capacity: 2,
    description: "Impeccably designed single king room offering serene ambiance, luxury Egyptian cotton linens, and rain shower.",
    amenities: ["King Bed", "Rain Shower", "Free Wi-Fi", "Coffee Station"],
    images: ["https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=1200&auto=format&fit=crop"]
  }
];

const IconStar = () => (
  <svg className="w-4 h-4 text-amber-500 fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
);

const IconUsers = () => (
  <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);

const formatCurrency = (v) => `$${Number(v).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

function RoomCard({ room, initialSearch, availableStock, onAttemptRestrictedBooking }) {
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState(initialSearch?.checkIn || "");
  const [checkOut, setCheckOut] = useState(initialSearch?.checkOut || "");
  const [guests, setGuests] = useState(initialSearch?.guests || 2);

  const imageSrc = (room.images && room.images.length > 0) ? room.images[0] : placeholderImg;
  const title = room.title;
  const category = room.roomType || "Deluxe";
  const price = room.pricePerNight;
  const rating = 4.9;
  const amenitiesList = room.amenities || [];
  const available = availableStock !== undefined ? availableStock : 4;
  const isSoldOut = available <= 0;

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 1;
    const diff = (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);
    return Math.max(1, Math.floor(diff));
  }, [checkIn, checkOut]);

  const subtotal = nights * price;
  const maxCapacity = room.capacity || 4;

  const handleBookingSubmit = (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user && (user.role === "admin" || user.role === "staff")) {
      onAttemptRestrictedBooking(user.role);
      return;
    }

    if (isSoldOut) {
      alert("This room is completely booked for the selected dates. Please choose another accommodation.");
      return;
    }

    navigate("/BookingFrompage", {
      state: {
        room: {
          title,
          pricePerNight: price,
          images: [imageSrc],
          roomType: category,
          capacity: maxCapacity
        },
        checkIn: checkIn || new Date().toISOString().split("T")[0],
        checkOut: checkOut || new Date(Date.now() + 86400000).toISOString().split("T")[0],
        guests,
        nights,
        subtotal
      }
    });
  };

  return (
    <article className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-100 flex flex-col h-full group transform hover:-translate-y-1">
      {/* Image Section */}
      <div className="relative h-60 overflow-hidden">
        <img 
          src={imageSrc} 
          alt={title} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
          onError={(e) => {e.target.src = placeholderImg}} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-90"></div>
        
        {/* Rating Badge */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
          <IconStar />
          <span className="text-xs font-bold text-slate-900">{rating}</span>
        </div>
        
        {/* Room Type Badge */}
        <div className="absolute bottom-4 left-4 text-white">
          <span className="inline-block bg-amber-500/90 text-slate-950 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md shadow-sm">
            {category}
          </span>
          <p className="text-xs text-slate-200 mt-1 font-medium">Up to {maxCapacity} Guests</p>
        </div>
      </div>

      {/* Details Section */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-serif font-bold text-slate-900 mb-2 leading-tight group-hover:text-amber-600 transition-colors">
          {title}
        </h3>
        
        <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">
          {room.description}
        </p>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {amenitiesList.slice(0, 3).map((item, idx) => (
            <span key={idx} className="bg-slate-100 text-slate-700 text-[11px] font-medium px-2.5 py-1 rounded-md">
              {item}
            </span>
          ))}
          {amenitiesList.length > 3 && (
            <span className="text-[11px] text-slate-400 self-center">
              +{amenitiesList.length - 3} more
            </span>
          )}
        </div>

        {/* Price & Stock Display */}
        <div className="mt-auto flex items-end justify-between border-t border-slate-100 pt-4 mb-4">
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Price per night</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-serif font-bold text-slate-900">{formatCurrency(price)}</span>
              <span className="text-xs text-slate-400 font-normal">/ night</span>
            </div>
          </div>
          <div className="text-right">
            {isSoldOut ? (
              <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                Sold Out
              </span>
            ) : available <= 2 ? (
              <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded animate-pulse">
                🔥 Only {available} left!
              </span>
            ) : (
              <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded">
                {available} Available
              </span>
            )}
          </div>
        </div>

        {/* Booking Form Widget */}
        <form onSubmit={handleBookingSubmit} className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Check-in</label>
              <input 
                type="date" 
                className="w-full text-xs p-1.5 border border-slate-300 rounded-md bg-white text-slate-800"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>
            <div>
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Check-out</label>
              <input 
                type="date" 
                className="w-full text-xs p-1.5 border border-slate-300 rounded-md bg-white text-slate-800"
                value={checkOut}
                min={checkIn}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>
          </div>

          <div className="relative">
            <IconUsers />
            <select 
              className="w-full text-xs pl-8 pr-3 py-2 border border-slate-300 rounded-md bg-white text-slate-800"
              value={guests} 
              onChange={(e) => setGuests(Number(e.target.value))}
            >
              {[...Array(maxCapacity).keys()].map(n => (
                <option key={n + 1} value={n + 1}>{n + 1} Guests</option>
              ))}
            </select>
          </div>

          <button 
            type="submit" 
            disabled={isSoldOut}
            className={`w-full py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all shadow-md ${
              isSoldOut
                ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                : "text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 hover:shadow-lg cursor-pointer"
            }`}
          >
            {isSoldOut ? "Sold Out" : `Reserve Room • ${formatCurrency(subtotal)}`}
          </button>
        </form>
      </div>
    </article>
  );
}

export default function RoomListing() {
  const location = useLocation();
  const searchState = location.state || {};
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [stockMap, setStockMap] = useState({});
  const [restrictedRole, setRestrictedRole] = useState(null);

  const fetchRoomsAndStock = async () => {
    try {
      setLoading(true);
      // Fetch Rooms
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        setRooms(Array.isArray(data) && data.length > 0 ? data : FALLBACK_ROOMS);
      } else {
        setRooms(FALLBACK_ROOMS);
      }

      // Fetch Stock
      const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const stockRes = await fetch(`${API_BASE}/api/bookings/stock`).catch(() => null);
      if (stockRes && stockRes.ok) {
        const stockData = await stockRes.json();
        if (stockData.stockMap) setStockMap(stockData.stockMap);
      } else {
        // Local calculation fallback
        const local = JSON.parse(localStorage.getItem("user_bookings") || "[]");
        const counts = {};
        local.forEach(b => {
          if (b.status !== "Cancelled" && b.roomTitle) {
            counts[b.roomTitle] = (counts[b.roomTitle] || 0) + 1;
          }
        });
        const fallbackMap = {};
        FALLBACK_ROOMS.forEach(r => {
          const booked = counts[r.title] || 0;
          fallbackMap[r.title] = { available: Math.max(0, 4 - booked) };
        });
        setStockMap(fallbackMap);
      }
    } catch (err) {
      console.warn("Using fallback rooms due to backend fetch issue:", err);
      setRooms(FALLBACK_ROOMS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomsAndStock();
    window.addEventListener("bookingCreated", fetchRoomsAndStock);
    window.addEventListener("storage", fetchRoomsAndStock);
    return () => {
      window.removeEventListener("bookingCreated", fetchRoomsAndStock);
      window.removeEventListener("storage", fetchRoomsAndStock);
    };
  }, []);

  const filteredRooms = useMemo(() => {
    if (activeFilter === "All") return rooms;
    return rooms.filter(r => r.roomType?.toLowerCase() === activeFilter.toLowerCase());
  }, [rooms, activeFilter]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">
      
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
              {restrictedRole === "admin" ? "Administrator" : "Staff"} Notice
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

      {/* Page Header */}
      <div className="relative py-16 bg-slate-900 text-white overflow-hidden text-center">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#c59b27_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative max-w-4xl mx-auto px-4">
          <span className="text-xs uppercase tracking-[0.3em] text-amber-400 font-bold font-sans">
            Curated Sanctuary
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mt-2 mb-4 tracking-tight">
            Find Your Next <span className="text-amber-400 italic font-serif">Stay</span>
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-base">
            Every suite at RoyalPark is an architectural sanctuary designed with exquisite materials, bespoke amenities, and personalized hospitality.
          </p>

          {/* Filter Tabs */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {["All", "Suite", "Deluxe", "Double", "Single"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeFilter === cat 
                    ? "bg-amber-500 text-slate-950 shadow-md font-bold" 
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {cat === "All" ? "All Accommodations" : `${cat}s`}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Loading Spinner */}
        {loading && (
          <div className="flex flex-col justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-amber-500 mb-4"></div>
            <p className="text-slate-500 text-sm font-medium">Curating luxury properties...</p>
          </div>
        )}

        {/* Room Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRooms.map((room) => (
              <RoomCard 
                key={room._id} 
                room={room} 
                initialSearch={searchState} 
                availableStock={stockMap[room.title]?.available}
                onAttemptRestrictedBooking={(role) => setRestrictedRole(role)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}