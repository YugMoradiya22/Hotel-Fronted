import React, { useState, useEffect } from 'react';
import Header2 from './Header2';
import Footer from './footer';
import { Link } from 'react-router-dom';
import { MapPin, Users } from 'lucide-react';

const DEFAULT_SAMPLE_BOOKINGS = [
  {
    id: "sample_1",
    bookingId: "RP-2026-8812",
    hotelName: "RoyalPark Hotel & Resort",
    roomTitle: "Royal Presidential Suite",
    location: "Marine Bay, Mumbai",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=600&auto=format&fit=crop",
    checkIn: "2026-11-15",
    checkOut: "2026-11-18",
    guests: "2 Adults, 1 Room",
    price: "$1,497",
    nights: 3,
    status: "Confirmed",
    type: "upcoming",
    guestName: "Valued RoyalPark Guest"
  },
  {
    id: "sample_2",
    bookingId: "RP-2026-4421",
    hotelName: "RoyalPark Hotel & Resort",
    roomTitle: "Deluxe Oceanfront Haven",
    location: "Marine Bay, Mumbai",
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=600&auto=format&fit=crop",
    checkIn: "2026-08-10",
    checkOut: "2026-08-12",
    guests: "2 Adults, 1 Room",
    price: "$598",
    nights: 2,
    status: "Completed",
    type: "history",
    guestName: "Valued RoyalPark Guest"
  }
];

export default function Mybooking() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user_bookings");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBookings([...parsed, ...DEFAULT_SAMPLE_BOOKINGS]);
          return;
        }
      }
      setBookings(DEFAULT_SAMPLE_BOOKINGS);
    } catch {
      setBookings(DEFAULT_SAMPLE_BOOKINGS);
    }
  }, []);

  const getCancellationStatus = (booking) => {
    if (booking.status === "Cancelled") {
      return { allowed: false, message: "Cancelled", color: "red" };
    }
    if (booking.status === "Completed") {
      return { allowed: false, message: "Completed Stay", color: "slate" };
    }
    if (!booking.checkIn) {
      return { allowed: true, message: "Free Cancellation Eligible", color: "green", hoursRemaining: 99 };
    }

    const checkInDate = new Date(booking.checkIn);
    if (typeof booking.checkIn === "string" && !booking.checkIn.includes("T")) {
      checkInDate.setHours(14, 0, 0, 0); // Standard 2:00 PM check-in
    }

    const now = new Date();
    const diffHours = (checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (diffHours < 24) {
      return {
        allowed: false,
        message: diffHours <= 0 ? "Past Check-in Date" : "Non-cancellable (< 24h to check-in)",
        hoursRemaining: Math.max(0, Math.round(diffHours)),
        color: "slate"
      };
    }

    const days = Math.floor(diffHours / 24);
    const hrs = Math.round(diffHours % 24);
    const timeRemainingStr = days > 0 ? `${days}d ${hrs}h` : `${hrs}h`;

    return {
      allowed: true,
      message: `Free Cancellation (${timeRemainingStr} left)`,
      hoursRemaining: diffHours,
      color: "green"
    };
  };

  const handleCancelBooking = async (booking) => {
    const cancelStatus = getCancellationStatus(booking);
    if (!cancelStatus.allowed) {
      alert("Cancellation Denied: Under RoyalPark's 24-Hour Policy, reservations cannot be cancelled within 24 hours of scheduled check-in.");
      return;
    }

    if (window.confirm(`Are you sure you wish to cancel reservation #${booking.bookingId}? Free cancellation policy applies and room will be returned to inventory.`)) {
      try {
        const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
        await fetch(`${API_URL}/api/bookings/${booking.bookingId}/cancel`, { method: "PUT" }).catch(() => null);
      } catch {
        // ignore
      }

      const updated = bookings.map(b => b.bookingId === booking.bookingId ? { ...b, status: "Cancelled", type: "cancelled" } : b);
      setBookings(updated);

      try {
        const stored = JSON.parse(localStorage.getItem("user_bookings") || "[]");
        const updatedStored = stored.map(b => b.bookingId === booking.bookingId ? { ...b, status: "Cancelled", type: "cancelled" } : b);
        localStorage.setItem("user_bookings", JSON.stringify(updatedStored));
      } catch {
        // ignore
      }

      // Notify other components to refresh inventory stock immediately!
      window.dispatchEvent(new Event("bookingCreated"));
      window.dispatchEvent(new Event("storage"));
      alert("Reservation cancelled successfully. The suite has been restored to available inventory.");
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'all') return true;
    if (activeTab === 'upcoming') return b.type === 'upcoming' && b.status !== 'Cancelled';
    if (activeTab === 'history') return b.type === 'history' || b.status === 'Completed';
    if (activeTab === 'cancelled') return b.status === 'Cancelled';
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header2 />

      {/* Header Banner */}
      <div className="bg-slate-900 text-white py-14 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#c59b27_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative max-w-4xl mx-auto">
          <span className="text-xs uppercase tracking-[0.3em] text-amber-400 font-bold">
            Guest Portal
          </span>
          <h1 className="text-3xl md:text-5xl font-serif font-bold mt-2 mb-3">
            My <span className="text-amber-400 italic">Reservations</span>
          </h1>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Manage your past and upcoming luxury stays, view check-in details, and access customized concierge requests.
          </p>

          {/* Filter Tabs */}
          <div className="mt-8 flex justify-center gap-2">
            {[
              { id: 'upcoming', label: 'Upcoming Stays' },
              { id: 'history', label: 'Past Stays' },
              { id: 'cancelled', label: 'Cancelled' },
              { id: 'all', label: 'All Bookings' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                  activeTab === tab.id
                    ? "bg-amber-500 text-slate-950 shadow-md"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 flex-grow w-full">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              🏨
            </div>
            <h2 className="text-xl font-serif font-bold text-slate-800 mb-2">No Reservations Found</h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
              You do not have any {activeTab} reservations at the moment. Plan your next unforgettable escape with us.
            </p>
            <Link
              to="/rooms"
              className="inline-block px-6 py-3 rounded-xl bg-slate-900 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md"
            >
              Browse Rooms & Suites
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div 
                key={booking.id || booking.bookingId} 
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-6 p-6 items-center"
              >
                {/* Image */}
                <div className="md:col-span-4 h-48 md:h-full min-h-[160px] rounded-xl overflow-hidden relative shadow-sm">
                  <img 
                    src={booking.image} 
                    alt={booking.roomTitle} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-sm text-white px-2.5 py-1 rounded text-[10px] font-mono font-bold">
                    {booking.bookingId}
                  </div>
                </div>

                {/* Details */}
                <div className="md:col-span-5 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                      {booking.hotelName}
                    </span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      booking.status === 'Confirmed' 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : booking.status === 'Cancelled'
                        ? 'bg-red-50 text-red-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {booking.status}
                    </span>
                  </div>

                  <h3 className="text-xl font-serif font-bold text-slate-900">
                    {booking.roomTitle}
                  </h3>

                  <p className="flex items-center gap-2 text-xs text-slate-500">
                    <MapPin size={14} className="text-amber-500" />
                    <span>{booking.location}</span>
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Check-In</span>
                      <span className="font-semibold text-slate-800">{booking.checkIn}</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Check-Out</span>
                      <span className="font-semibold text-slate-800">{booking.checkOut}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 flex items-center gap-2 pt-1">
                    <Users size={13} className="text-slate-400" />
                    <span>{booking.guests}</span>
                  </p>
                </div>

                {/* Actions & Price */}
                <div className="md:col-span-3 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 flex flex-col justify-between h-full space-y-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Total Amount</span>
                    <span className="text-2xl font-serif font-bold text-slate-900">{booking.price}</span>
                    <span className="text-[11px] text-slate-400 block">Taxes included</span>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => alert(`Showing digital pass for Booking #${booking.bookingId}.\nGuest: ${booking.guestName || "Registered Member"}\nStatus: ${booking.status}`)}
                      className="w-full py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow transition-all"
                    >
                      Digital Pass
                    </button>
                    {booking.status === 'Confirmed' && (() => {
                      const cancelInfo = getCancellationStatus(booking);
                      return cancelInfo.allowed ? (
                        <div className="space-y-1 pt-1">
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold block text-center">
                            {cancelInfo.message}
                          </span>
                          <button
                            onClick={() => handleCancelBooking(booking)}
                            className="w-full py-1.5 text-xs text-red-600 hover:text-red-700 font-semibold transition-colors cursor-pointer"
                          >
                            Cancel Stay
                          </button>
                        </div>
                      ) : (
                        <div className="pt-1">
                          <span 
                            className="text-[10px] text-slate-500 bg-slate-100 border border-slate-200 px-2 py-1 rounded block text-center font-medium"
                            title="Under RoyalPark cancellation policy, rooms cannot be cancelled within 24 hours of check-in."
                          >
                            🔒 {cancelInfo.message}
                          </span>
                        </div>
                      );
                    })()}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}