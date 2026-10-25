import React, { useState, useMemo, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

const FloatingInput = ({ id, label, value, isFocused, required = false, type = "text", ...props }) => {
  const isActive = value || isFocused;

  return (
    <div className="relative">
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        className={`peer w-full border rounded-lg px-4 py-3 bg-white text-slate-800 outline-none transition-all duration-200 text-sm
          ${isActive ? "border-amber-600 ring-1 ring-amber-600" : "border-slate-300 hover:border-slate-400"}
        `}
        {...props}
      />
      <label
        htmlFor={id}
        className={`absolute left-3 transition-all duration-200 pointer-events-none px-1 bg-white
          ${isActive 
            ? "-top-2.5 text-xs text-amber-600 font-bold" 
            : "top-3 text-slate-500 text-sm"}
        `}
      >
        {label} {required && "*"}
      </label>
    </div>
  );
};

export default function BookingForm() {
  const location = useLocation();
  const passedData = location.state || {};

  // Selected Room Details
  const selectedRoom = passedData.room || {
    title: "Deluxe Ocean View Suite",
    pricePerNight: 299,
    roomType: "Deluxe",
    capacity: 2,
    images: ["https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=600&q=80"]
  };

  const checkIn = passedData.checkIn || new Date().toISOString().split("T")[0];
  const checkOut = passedData.checkOut || new Date(Date.now() + 86400000).toISOString().split("T")[0];
  const guests = passedData.guests || 2;
  const nights = passedData.nights || 1;

  const [form, setForm] = useState({
    title: "Mr",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gst: "",
    requests: "",
    agree: true,
  });

  const [focus, setFocus] = useState({
    title: false,
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
    gst: false,
    requests: false,
  });

  const [error, setError] = useState("");
  const [showDetails, setShowDetails] = useState(true);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const [currentUser, setCurrentUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Auto pre-fill if logged in and check role
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const u = JSON.parse(stored);
        setCurrentUser(u);
        if (u.name) {
          const parts = u.name.trim().split(" ");
          setForm(prev => ({
            ...prev,
            firstName: parts[0] || "",
            lastName: parts.slice(1).join(" ") || "",
            email: u.email || prev.email,
            phone: u.phone || prev.phone
          }));
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const basePrice = (selectedRoom.pricePerNight || 299) * nights;
  const taxRate = 0.12; // 12% luxury hotel tax
  const taxes = useMemo(() => Math.round(basePrice * taxRate), [basePrice]);
  const total = useMemo(() => basePrice + taxes, [basePrice, taxes]);

  const requiredValid =
    form.title &&
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.email.trim() &&
    form.phone.trim() &&
    form.agree;

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
    if (error) setError("");
  }

  function handlePhoneChange(e) {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    setForm((s) => ({ ...s, phone: digits }));
    if (error) setError("");
  }

  function handleFocus(name) {
    setFocus((f) => ({ ...f, [name]: true }));
  }
  function handleBlur(name) {
    setFocus((f) => ({ ...f, [name]: false }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!requiredValid) {
      setError("Please complete all required fields and accept the reservation terms.");
      return;
    }

    // Role check: Admin and Staff cannot book!
    if (currentUser && (currentUser.role === "admin" || currentUser.role === "staff")) {
      setError("Booking Denied: Administrator and Staff accounts cannot book rooms. Please sign in as a Customer.");
      return;
    }

    setSubmitting(true);
    const bookingRef = `RP-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking = {
      id: `RP-${Date.now()}`,
      bookingId: bookingRef,
      hotelName: "RoyalPark Hotel & Resort",
      roomTitle: selectedRoom.title,
      roomType: selectedRoom.roomType || "Deluxe",
      image: selectedRoom.images && selectedRoom.images.length > 0 
        ? selectedRoom.images[0] 
        : "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=600&q=80",
      location: "Marine Bay, Mumbai",
      checkIn,
      checkOut,
      guests: `${guests} Guests, 1 Room`,
      price: `$${total.toLocaleString()}`,
      totalAmount: total,
      nights,
      guestName: `${form.title} ${form.firstName} ${form.lastName}`,
      guestEmail: form.email,
      guestPhone: form.phone,
      specialRequests: form.requests || "",
      status: "Confirmed",
      type: "upcoming",
      bookingDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    };

    try {
      // 1. Submit to Backend API to decrement real-time stock
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const res = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomTitle: selectedRoom.title,
          roomType: selectedRoom.roomType,
          checkIn,
          checkOut,
          guests: `${guests} Guests`,
          totalAmount: total,
          guestName: `${form.title} ${form.firstName} ${form.lastName}`,
          guestEmail: form.email,
          guestPhone: form.phone,
          specialRequests: form.requests,
          userRole: currentUser?.role || "customer"
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to confirm reservation");
      }

      // 2. Save to local storage for instant access in My Bookings
      const existing = JSON.parse(localStorage.getItem("user_bookings") || "[]");
      existing.unshift({
        ...newBooking,
        _id: data.booking?._id || newBooking.id,
        bookingId: data.booking?.bookingId || bookingRef
      });
      localStorage.setItem("user_bookings", JSON.stringify(existing));

      // Trigger custom storage event for live stock updates across components
      window.dispatchEvent(new Event("bookingCreated"));

      setConfirmedBooking(newBooking);
    } catch (err) {
      setError(err.message || "An unexpected error occurred during reservation.");
    } finally {
      setSubmitting(false);
    }
  }

  // --- RESTRICTION VIEW FOR ADMIN & STAFF ---
  if (currentUser && (currentUser.role === "admin" || currentUser.role === "staff")) {
    const isAdm = currentUser.role === "admin";
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white font-sans">
        <div className="max-w-md w-full bg-slate-950 border border-amber-500/30 rounded-3xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-4 border border-amber-500/30 text-3xl">
            {isAdm ? "👑" : "🛠️"}
          </div>
          <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-amber-400 block mb-1">
            Access Policy Notice
          </span>
          <h2 className="text-2xl font-serif font-bold text-white mb-3">
            {isAdm ? "Administrator Account" : "Staff Account"} Detected
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            Administrator and Staff accounts are configured exclusively for hotel management, operations, and inventory control.
            <br /><br />
            <strong className="text-amber-400">Personal room bookings are restricted to customer accounts.</strong>
          </p>
          <div className="space-y-3">
            {isAdm ? (
              <Link
                to="/admin"
                className="block w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold uppercase tracking-wider text-xs shadow-lg transition-all"
              >
                Go to Admin Console
              </Link>
            ) : (
              <Link
                to="/staff"
                className="block w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold uppercase tracking-wider text-xs shadow-lg transition-all"
              >
                Go to Staff Portal
              </Link>
            )}
            <Link
              to="/login"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
              }}
              className="block w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition-colors"
            >
              Sign In with Customer Account
            </Link>
            <Link
              to="/"
              className="block text-xs text-slate-500 hover:text-slate-300 transition-colors pt-2"
            >
              ← Return to Public Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- CONFIRMATION SCREEN ---
  if (confirmedBooking) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4 flex items-center justify-center">
        <div className="max-w-xl w-full bg-white rounded-3xl shadow-2xl p-8 border border-amber-100 text-center animate-fadeIn">
          <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-inner">
            ✓
          </div>
          <span className="text-xs uppercase tracking-[0.25em] text-amber-600 font-bold font-sans">
            Reservation Confirmed
          </span>
          <h1 className="text-3xl font-serif font-bold text-slate-900 mt-2 mb-2">
            We Look Forward to Welcoming You!
          </h1>
          <p className="text-slate-500 text-sm mb-6">
            A confirmation receipt has been sent to <span className="font-semibold text-slate-800">{confirmedBooking.guestEmail}</span>.
          </p>

          <div className="bg-slate-50 rounded-2xl p-6 text-left mb-8 border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase">Booking Reference</span>
              <span className="text-sm font-mono font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded">
                {confirmedBooking.bookingId}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Suite</span>
                <span className="font-semibold text-slate-800">{confirmedBooking.roomTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Guest Name</span>
                <span className="font-semibold text-slate-800">{confirmedBooking.guestName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Check-in / Check-out</span>
                <span className="font-semibold text-slate-800">{confirmedBooking.checkIn} to {confirmedBooking.checkOut}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Duration</span>
                <span className="font-semibold text-slate-800">{confirmedBooking.nights} Night(s) · {confirmedBooking.guests}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-slate-200">
                <span className="font-bold text-slate-800">Total Paid / Due</span>
                <span className="font-serif font-bold text-lg text-slate-900">{confirmedBooking.price}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/mybookings"
              className="flex-1 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all"
            >
              View in My Bookings
            </Link>
            <Link
              to="/"
              className="flex-1 py-3.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider transition-all"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- CHECKOUT FORM SCREEN ---
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Title */}
        <div className="mb-10 text-center">
          <span className="text-xs uppercase tracking-[0.25em] text-amber-600 font-bold font-sans">
            Step 2 of 2
          </span>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mt-1">Guest Details & Secure Checkout</h1>
          <p className="text-slate-500 text-sm mt-2">Finish your booking to secure your luxury stay at RoyalPark.</p>
        </div>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* LEFT COLUMN: Form */}
          <section className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border-t-4 border-amber-600">
              <header className="mb-8 border-b border-slate-100 pb-4">
                <h2 className="text-2xl font-serif font-bold text-slate-800 flex items-center gap-2">
                  <span className="bg-slate-900 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-sans font-bold">1</span>
                  Guest Information
                </h2>
                <p className="text-slate-500 text-sm mt-1 ml-10">Please enter the details of the primary guest.</p>
              </header>

              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                
                {/* Name Row */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-2 relative">
                    <select
                      id="title"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      onFocus={() => handleFocus("title")}
                      onBlur={() => handleBlur("title")}
                      className={`w-full border rounded-lg px-3 py-3 bg-white text-slate-800 outline-none transition-all text-sm
                        ${(form.title || focus.title) ? "border-amber-600 ring-1 ring-amber-600" : "border-slate-300"}
                      `}
                    >
                      <option value="Mr">Mr</option>
                      <option value="Mrs">Mrs</option>
                      <option value="Ms">Ms</option>
                      <option value="Dr">Dr</option>
                    </select>
                    <label className={`absolute left-3 px-1 bg-white transition-all duration-200 pointer-events-none -top-2.5 text-xs text-amber-600 font-bold`}>
                      Title *
                    </label>
                  </div>
                  
                  <div className="md:col-span-5">
                    <FloatingInput 
                      id="firstName" 
                      label="First Name" 
                      value={form.firstName} 
                      isFocused={focus.firstName}
                      required 
                      onChange={handleChange} 
                      onFocus={() => handleFocus("firstName")} 
                      onBlur={() => handleBlur("firstName")}
                    />
                  </div>
                  
                  <div className="md:col-span-5">
                    <FloatingInput 
                      id="lastName" 
                      label="Last Name" 
                      value={form.lastName} 
                      isFocused={focus.lastName}
                      required 
                      onChange={handleChange} 
                      onFocus={() => handleFocus("lastName")} 
                      onBlur={() => handleBlur("lastName")}
                    />
                  </div>
                </div>

                {/* Contact Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FloatingInput 
                    id="email" 
                    label="Email Address" 
                    type="email" 
                    value={form.email} 
                    isFocused={focus.email}
                    required 
                    onChange={handleChange} 
                    onFocus={() => handleFocus("email")} 
                    onBlur={() => handleBlur("email")}
                  />

                  <div className="relative flex">
                    <div className="flex items-center justify-center bg-slate-100 border border-r-0 border-slate-300 rounded-l-lg px-3 text-slate-600 font-medium text-xs">
                      📱 Contact
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      inputMode="numeric"
                      placeholder="10-digit phone"
                      maxLength={10}
                      value={form.phone}
                      onChange={handlePhoneChange}
                      onFocus={() => handleFocus("phone")}
                      onBlur={() => handleBlur("phone")}
                      className={`w-full border rounded-r-lg px-4 py-3 bg-white text-slate-800 outline-none transition-all duration-200 text-sm
                        ${(form.phone || focus.phone) ? "border-amber-600 ring-1 ring-amber-600 z-10" : "border-slate-300"}
                      `}
                    />
                  </div>
                </div>

                {/* GST */}
                <FloatingInput 
                  id="gst" 
                  label="Tax / GST Number (Optional)" 
                  value={form.gst} 
                  isFocused={focus.gst}
                  onChange={handleChange} 
                  onFocus={() => handleFocus("gst")} 
                  onBlur={() => handleBlur("gst")}
                />

                {/* Special Requests */}
                <div className="relative">
                  <textarea
                    id="requests"
                    name="requests"
                    rows="3"
                    maxLength={400}
                    value={form.requests}
                    onChange={(e) => setForm((s) => ({ ...s, requests: e.target.value.slice(0, 400) }))}
                    onFocus={() => handleFocus("requests")}
                    onBlur={() => handleBlur("requests")}
                    placeholder="E.g., High floor, late check-in, dietary preferences"
                    className={`w-full border rounded-lg px-4 py-3 bg-white text-slate-800 outline-none transition-all duration-200 resize-none text-sm
                      ${(form.requests || focus.requests) ? "border-amber-600 ring-1 ring-amber-600" : "border-slate-300"}
                    `}
                  />
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                    Special Requests (Optional)
                  </label>
                  <div className="text-right text-[11px] text-slate-400 mt-1">{form.requests.length} / 400</div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm border border-red-200 flex items-center gap-2">
                    <span>⚠️</span>
                    <span>{error}</span>
                  </div>
                )}

                {/* Agreement */}
                <div className="flex items-start gap-3 pt-2">
                  <input
                    id="agree"
                    name="agree"
                    type="checkbox"
                    checked={form.agree}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 cursor-pointer accent-amber-600"
                  />
                  <label htmlFor="agree" className="text-xs text-slate-600 cursor-pointer select-none leading-relaxed">
                    I confirm that the details entered above are accurate and I agree to RoyalPark's Booking Terms, Cancellation Policy, and Guest Rules.
                  </label>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={!requiredValid || submitting}
                    className={`w-full py-4 rounded-xl font-bold uppercase text-xs tracking-wider transition-all shadow-lg
                      ${requiredValid && !submitting
                        ? "bg-slate-900 hover:bg-amber-600 text-white hover:text-slate-950 hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer" 
                        : "bg-slate-300 text-slate-500 cursor-not-allowed"}
                    `}
                  >
                    {submitting ? "Confirming Reservation..." : `Confirm Booking • $${total.toLocaleString()}`}
                  </button>
                </div>
              </form>
            </div>
          </section>

          {/* RIGHT COLUMN: Summary */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-28 border border-slate-100">
              
              <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                <h3 className="text-xl font-serif font-bold text-slate-900">Your Reservation</h3>
                <button 
                  type="button" 
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-amber-600 text-xs font-bold hover:text-amber-700 uppercase tracking-wider"
                >
                  {showDetails ? "Hide" : "Show"}
                </button>
              </div>

              {/* Room Card in Summary */}
              <div className="mb-6">
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                    <img 
                      src={selectedRoom.images && selectedRoom.images.length > 0 ? selectedRoom.images[0] : "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=150&q=80"} 
                      alt={selectedRoom.title} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-amber-600">
                      {selectedRoom.roomType || "Luxury Suite"}
                    </span>
                    <h4 className="font-serif font-bold text-slate-900 text-base leading-snug mt-0.5">
                      {selectedRoom.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      {guests} Guests · {nights} Night(s)
                    </p>
                    <p className="text-xs text-emerald-600 font-semibold mt-0.5">
                      ✓ Complimentary Breakfast
                    </p>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 mb-6 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span className="font-medium">Check-In:</span>
                  <span className="font-bold text-slate-800">{checkIn}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="font-medium">Check-Out:</span>
                  <span className="font-bold text-slate-800">{checkOut}</span>
                </div>
              </div>

              {/* Price Breakdown */}
              {showDetails && (
                <div className="space-y-3 text-xs text-slate-600 border-t border-slate-100 pt-4 mb-4">
                  <div className="flex justify-between">
                    <span>${selectedRoom.pricePerNight || 299} × {nights} night(s)</span>
                    <span>${basePrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes & Luxury Surcharge (12%)</span>
                    <span>${taxes.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {/* Total */}
              <div className="flex justify-between items-end border-t border-slate-200 pt-4">
                <div>
                  <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Total Amount</div>
                  <div className="text-[11px] text-emerald-600 font-semibold">Includes all taxes</div>
                </div>
                <div className="text-2xl font-serif font-bold text-slate-900">
                  ${total.toLocaleString()}
                </div>
              </div>

              {/* Cancellation Policy */}
              <div className="mt-6 bg-amber-50/60 p-3.5 rounded-xl border border-amber-100/60 text-[11px] text-amber-900 leading-relaxed">
                <p className="font-bold mb-0.5">Free Cancellation</p>
                Cancel up to 24 hours prior to check-in with full refund.
              </div>

            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}