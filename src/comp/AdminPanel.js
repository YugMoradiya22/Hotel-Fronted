import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  BedDouble,
  CalendarCheck,
  DollarSign,
  Mail,
  ShieldCheck,
  LogOut,
  ExternalLink,
  Plus,
  Trash2,
  CheckCircle,
  RefreshCw,
  Search,
  Check,
  UserX,
  UserCheck,
  Cloud,
  UploadCloud
} from "lucide-react";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function AdminPanel() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("overview"); // overview, bookings, rooms, users, messages
  
  // Data States
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRooms: 0,
    totalBookings: 0,
    totalMessages: 0,
    totalRevenue: 0
  });
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [messages, setMessages] = useState([]);
  
  // UI & Loading States
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Cloudinary Cloud Storage State
  const [cloudinaryStatus, setCloudinaryStatus] = useState({ configured: false, cloudName: null });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUploadMode, setImageUploadMode] = useState("cloud"); // 'cloud' | 'url'

  // Add Room Modal Form State
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [newRoom, setNewRoom] = useState({
    title: "",
    roomType: "Suite",
    pricePerNight: "",
    capacity: 2,
    description: "",
    imageUrl: "",
    amenities: "Ocean View, King Bed, Free Wi-Fi, Butler Service"
  });

  // Verify Admin Authentication on Mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setCurrentUser(parsed);
      } catch (e) {
        console.error("Auth error", e);
      }
    }
    fetchAllData();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Overview Stats
      const resStats = await fetch(`${API}/api/admin/overview`).catch(() => null);
      if (resStats && resStats.ok) {
        const data = await resStats.json();
        if (data.stats) setStats(data.stats);
      }

      // 2. Fetch Users
      const resUsers = await fetch(`${API}/api/admin/users`).catch(() => null);
      if (resUsers && resUsers.ok) {
        const data = await resUsers.json();
        if (data.users) setUsers(data.users);
      }

      // 3. Fetch Bookings from API & combine with local bookings
      const resBookings = await fetch(`${API}/api/admin/bookings`).catch(() => null);
      let dbBookings = [];
      if (resBookings && resBookings.ok) {
        const data = await resBookings.json();
        dbBookings = data.bookings || [];
      }

      // Merge with localStorage user_bookings for demonstration
      const localBookings = JSON.parse(localStorage.getItem("user_bookings") || "[]");
      const combinedBookings = [
        ...localBookings.map((b, idx) => ({
          _id: b.id || `local-${idx}`,
          firstName: b.guestName?.split(" ")[0] || "Guest",
          lastName: b.guestName?.split(" ")[1] || "",
          roomTitle: b.roomTitle || "Imperial Royal Suite",
          totalAmount: b.totalPrice || 1200,
          checkIn: b.checkIn,
          checkOut: b.checkOut,
          bookingStatus: b.status || "Confirmed",
          paymentStatus: "Paid",
          createdAt: b.bookedAt || new Date().toISOString(),
          isLocal: true
        })),
        ...dbBookings
      ];
      setBookings(combinedBookings);

      // 4. Fetch Rooms
      const resRooms = await fetch(`${API}/api/admin/rooms`).catch(() => null);
      if (resRooms && resRooms.ok) {
        const data = await resRooms.json();
        setRooms(data.rooms || []);
      }

      // 5. Fetch Messages
      const resMessages = await fetch(`${API}/api/admin/messages`).catch(() => null);
      if (resMessages && resMessages.ok) {
        const data = await resMessages.json();
        setMessages(data.messages || []);
      }

      // 6. Fetch Cloudinary Status
      const resCloud = await fetch(`${API}/api/upload/status`).catch(() => null);
      if (resCloud && resCloud.ok) {
        const cloudData = await resCloud.json();
        setCloudinaryStatus(cloudData);
      }
    } catch (err) {
      console.error("Failed to load admin data", err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle User Active / Block Status
  const handleToggleUser = async (userId) => {
    setActionLoading(true);
    try {
      const res = await fetch(`${API}/api/admin/users/${userId}/toggle-status`, {
        method: "PUT"
      });
      const data = await res.json();
      if (data.success) {
        setUsers(prev => prev.map(u => u._id === userId ? { ...u, isActive: data.isActive } : u));
        showToast(data.message);
      }
    } catch (e) {
      showToast("Error toggling user status");
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle User Role (Admin / User)
  const handleToggleRole = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    setActionLoading(true);
    try {
      const res = await fetch(`${API}/api/admin/users/${userId}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole })
      });
      const data = await res.json();
      if (data.success) {
        setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
        showToast(`User role updated to ${newRole}`);
      }
    } catch (e) {
      showToast("Error updating user role");
    } finally {
      setActionLoading(false);
    }
  };

  // Update Booking Status
  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    // If local
    if (bookingId.toString().startsWith("local-") || bookingId.toString().startsWith("BK-")) {
      const local = JSON.parse(localStorage.getItem("user_bookings") || "[]");
      const updated = local.map(b => (b.id === bookingId ? { ...b, status: newStatus } : b));
      localStorage.setItem("user_bookings", JSON.stringify(updated));
      setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, bookingStatus: newStatus } : b));
      showToast(`Booking marked as ${newStatus}`);
      return;
    }

    try {
      const res = await fetch(`${API}/api/admin/bookings/${bookingId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingStatus: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, bookingStatus: newStatus } : b));
        showToast(`Booking marked as ${newStatus}`);
      }
    } catch (e) {
      showToast("Error updating booking status");
    }
  };

  // Upload Suite Image to Cloudinary Cloud
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please choose an image file (JPG, PNG, WEBP, GIF)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast("Image size must be less than 10MB");
      return;
    }

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("folder", "royalpark_hotel/suites");

      const res = await fetch(`${API}/api/upload`, {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      if (data.success && data.url) {
        setNewRoom((prev) => ({ ...prev, imageUrl: data.url }));
        if (data.provider === "cloudinary") {
          showToast("☁️ Suite image stored on Cloudinary cloud!");
        } else {
          showToast("Image loaded (local preview active)");
        }
      } else {
        showToast(data.message || "Cloud upload failed");
      }
    } catch (err) {
      console.error("Cloud upload error:", err);
      showToast("Failed to upload image to cloud");
    } finally {
      setUploadingImage(false);
    }
  };

  // Add Room Handler
  const handleAddRoom = async (e) => {
    e.preventDefault();
    if (!newRoom.title || !newRoom.pricePerNight) {
      showToast("Please fill in room title and price");
      return;
    }

    setActionLoading(true);
    try {
      const payload = {
        title: newRoom.title,
        roomType: newRoom.roomType,
        pricePerNight: Number(newRoom.pricePerNight),
        capacity: Number(newRoom.capacity),
        description: newRoom.description || "Luxurious royal suite with premium amenities.",
        images: [
          newRoom.imageUrl ||
          "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
        ],
        amenities: newRoom.amenities.split(",").map(a => a.trim()),
        status: "Available"
      };

      const res = await fetch(`${API}/api/admin/rooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setRooms(prev => [data.room, ...prev]);
        setIsAddRoomOpen(false);
        setNewRoom({
          title: "",
          roomType: "Suite",
          pricePerNight: "",
          capacity: 2,
          description: "",
          imageUrl: "",
          amenities: "Ocean View, King Bed, Free Wi-Fi, Butler Service"
        });
        showToast("New luxury suite added to inventory!");
      }
    } catch (e) {
      showToast("Failed to add room");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Room
  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm("Are you sure you want to remove this room from inventory?")) return;
    try {
      const res = await fetch(`${API}/api/admin/rooms/${roomId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setRooms(prev => prev.filter(r => r._id !== roomId));
        showToast("Room removed from inventory");
      }
    } catch (e) {
      showToast("Error deleting room");
    }
  };

  // Delete Message
  const handleDeleteMessage = async (msgId) => {
    try {
      const res = await fetch(`${API}/api/admin/messages/${msgId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => prev.filter(m => m._id !== msgId));
        showToast("Inquiry message cleared");
      }
    } catch (e) {
      showToast("Error deleting message");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Access Control: Allow viewing if user role is admin
  const isAdmin = currentUser && currentUser.role === "admin";

  if (!isAdmin && !loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white">
        <div className="max-w-md w-full bg-slate-900 border border-amber-500/30 rounded-2xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center mx-auto mb-4 border border-amber-500/40">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-white mb-2">Restricted Access</h1>
          <p className="text-sm text-slate-400 mb-6">
            The RoyalPark Administrative Command Console requires verified administrator privileges.
          </p>
          <div className="space-y-3">
            <Link
              to="/login"
              className="block w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold uppercase tracking-wider text-xs shadow-lg transition-all"
            >
              Sign In as Administrator
            </Link>
            <Link
              to="/"
              className="block w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
            >
              Return to Public Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-amber-500 text-slate-950 px-5 py-3 rounded-xl shadow-2xl font-bold text-sm flex items-center gap-2 border border-amber-400 animate-slideIn">
          <CheckCircle className="w-5 h-5 text-slate-950" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP NAVIGATION / ADMIN HEADER */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-amber-500/20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3 group">
              <span className="text-2xl filter drop-shadow">👑</span>
              <div className="flex flex-col">
                <span className="text-xl font-serif font-extrabold text-white tracking-tight flex items-center gap-2">
                  RoyalPark
                  <span className="text-[10px] uppercase font-sans font-extrabold bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 px-2 py-0.5 rounded shadow-sm">
                    Admin Console
                  </span>
                </span>
                <span className="text-[9px] tracking-[0.25em] uppercase font-bold text-amber-400/80">
                  Management & Dispatch Portal
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/staff"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-400 hover:text-blue-300 hover:bg-slate-800 border border-blue-500/30 transition-colors"
            >
              <span>🛠️</span>
              <span>Staff Portal</span>
            </Link>

            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-amber-400 hover:bg-slate-800 border border-slate-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Website</span>
            </Link>

            <button
              onClick={fetchAllData}
              disabled={loading}
              className="p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>

            <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-extrabold flex items-center justify-center text-xs shadow-md">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "A"}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-white leading-tight">
                  {currentUser?.name || "Administrator"}
                </span>
                <span className="text-[10px] text-amber-400/80 font-mono">
                  {currentUser?.email || "admin"}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors ml-1"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* TAB NAVIGATION STRIP */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-slate-800/80 scrollbar-none">
          {[
            { id: "overview", label: "Dashboard Overview", icon: DollarSign },
            { id: "bookings", label: `Reservations (${bookings.length})`, icon: CalendarCheck },
            { id: "rooms", label: `Rooms & Suites (${rooms.length})`, icon: BedDouble },
            { id: "users", label: `User Accounts (${users.length})`, icon: Users },
            { id: "messages", label: `Guest Inquiries (${messages.length})`, icon: Mail }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20 font-extrabold"
                    : "text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW METRICS & QUICK ACTIONS                                  */}
        {/* ========================================================================= */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              <div className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 p-6 rounded-2xl shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Total Revenue</span>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-serif font-extrabold text-white mb-1">
                  ${Number(stats.totalRevenue).toLocaleString()}
                </div>
                <p className="text-xs text-emerald-400 flex items-center gap-1">
                  <span>↑ +18.4%</span>
                  <span className="text-slate-500 font-sans">from reservations</span>
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 p-6 rounded-2xl shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Total Bookings</span>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <CalendarCheck className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-serif font-extrabold text-white mb-1">
                  {bookings.length}
                </div>
                <p className="text-xs text-slate-400">Active & completed stays</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 p-6 rounded-2xl shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Suite Inventory</span>
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                    <BedDouble className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-serif font-extrabold text-white mb-1">
                  {rooms.length}
                </div>
                <p className="text-xs text-emerald-400">Ready for booking</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 p-6 rounded-2xl shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Registered Guests</span>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-serif font-extrabold text-white mb-1">
                  {users.length}
                </div>
                <p className="text-xs text-slate-400">Across web database</p>
              </div>

            </div>

            {/* Quick Action Banner */}
            <div className="bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <span className="text-xs uppercase tracking-widest font-extrabold text-amber-400 mb-1 block">
                  Quick Administration Actions
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mb-2">
                  Inventory & Reservation Management
                </h2>
                <p className="text-sm text-slate-300 max-w-xl">
                  Add custom suites to your live room catalog, view all customer bookings, review inquiries, or manage guest access privileges.
                </p>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  onClick={() => { setActiveTab("rooms"); setIsAddRoomOpen(true); }}
                  className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Suite</span>
                </button>
                <button
                  onClick={() => setActiveTab("bookings")}
                  className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs uppercase tracking-wider border border-slate-700 transition-colors"
                >
                  <span>View Bookings</span>
                </button>
              </div>
            </div>

            {/* Recent Reservations Table Preview */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-serif font-bold text-white">Recent Guest Reservations</h3>
                  <p className="text-xs text-slate-400">Latest reservation logs from online bookings</p>
                </div>
                <button
                  onClick={() => setActiveTab("bookings")}
                  className="text-xs text-amber-400 hover:text-amber-300 font-bold uppercase tracking-wider"
                >
                  View All ({bookings.length}) →
                </button>
              </div>

              {bookings.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm">
                  No reservations recorded yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Guest</th>
                        <th className="py-3 px-4">Suite / Room</th>
                        <th className="py-3 px-4">Check-in / Out</th>
                        <th className="py-3 px-4">Total</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {bookings.slice(0, 5).map((b) => (
                        <tr key={b._id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-white">
                            {b.firstName} {b.lastName}
                          </td>
                          <td className="py-3.5 px-4 text-slate-300">
                            {b.roomTitle || "Imperial Suite"}
                          </td>
                          <td className="py-3.5 px-4 text-xs font-mono text-slate-400">
                            {b.checkIn ? new Date(b.checkIn).toLocaleDateString() : "Flexible"} →{" "}
                            {b.checkOut ? new Date(b.checkOut).toLocaleDateString() : "Flexible"}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-amber-400">
                            ${b.totalAmount || 1200}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                              b.bookingStatus === "Confirmed" || b.bookingStatus === "Checked-in"
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : b.bookingStatus === "Cancelled"
                                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            }`}>
                              {b.bookingStatus || "Confirmed"}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => handleUpdateBookingStatus(b._id, b.bookingStatus === "Checked-in" ? "Confirmed" : "Checked-in")}
                              className="text-xs text-amber-400 hover:text-amber-300 font-bold"
                            >
                              {b.bookingStatus === "Checked-in" ? "Mark Confirmed" : "Check In"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: BOOKINGS MANAGEMENT                                                */}
        {/* ========================================================================= */}
        {activeTab === "bookings" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-serif font-bold text-white">Guest Reservations</h2>
                <p className="text-xs text-slate-400">Manage, confirm, and update guest stays</p>
              </div>

              {/* Status Filters */}
              <div className="flex items-center gap-2">
                {["all", "Confirmed", "Checked-in", "Pending", "Cancelled"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                      statusFilter === st
                        ? "bg-amber-500 text-slate-950"
                        : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-950/60 border-b border-slate-800">
                    <tr>
                      <th className="py-4 px-6">Reservation ID</th>
                      <th className="py-4 px-6">Guest</th>
                      <th className="py-4 px-6">Suite</th>
                      <th className="py-4 px-6">Dates</th>
                      <th className="py-4 px-6">Total Amount</th>
                      <th className="py-4 px-6">Payment</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {bookings
                      .filter(b => statusFilter === "all" || b.bookingStatus === statusFilter)
                      .map((b) => (
                        <tr key={b._id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-4 px-6 font-mono text-xs text-amber-400/90 font-bold">
                            {b._id?.toString().substring(0, 8)}...
                          </td>
                          <td className="py-4 px-6 font-semibold text-white">
                            {b.firstName} {b.lastName}
                          </td>
                          <td className="py-4 px-6">
                            {b.roomTitle || "Imperial Suite"}
                          </td>
                          <td className="py-4 px-6 text-xs font-mono text-slate-400">
                            {b.checkIn ? new Date(b.checkIn).toLocaleDateString() : "Flexible"} -{" "}
                            {b.checkOut ? new Date(b.checkOut).toLocaleDateString() : "Flexible"}
                          </td>
                          <td className="py-4 px-6 font-bold text-amber-400">
                            ${b.totalAmount || 1200}
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-xs text-emerald-400 font-semibold">
                              {b.paymentStatus || "Paid"}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                              b.bookingStatus === "Confirmed" || b.bookingStatus === "Checked-in"
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : b.bookingStatus === "Cancelled"
                                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            }`}>
                              {b.bookingStatus || "Confirmed"}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right space-x-2">
                            {b.bookingStatus !== "Checked-in" && (
                              <button
                                onClick={() => handleUpdateBookingStatus(b._id, "Checked-in")}
                                className="px-2.5 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-bold"
                              >
                                Check In
                              </button>
                            )}
                            {b.bookingStatus !== "Cancelled" && (
                              <button
                                onClick={() => handleUpdateBookingStatus(b._id, "Cancelled")}
                                className="px-2.5 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-bold"
                              >
                                Cancel
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: ROOMS & SUITES MANAGEMENT                                          */}
        {/* ========================================================================= */}
        {activeTab === "rooms" && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Cloudinary Cloud Storage Status Banner */}
            <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
              cloudinaryStatus.configured
                ? "bg-slate-900/90 border-sky-500/30 text-sky-200"
                : "bg-slate-900/90 border-amber-500/30 text-slate-300"
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                  cloudinaryStatus.configured ? "bg-sky-500/20 text-sky-400 border border-sky-500/30" : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                }`}>
                  <Cloud className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-white">Cloud Image Storage (Cloudinary)</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      cloudinaryStatus.configured
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    }`}>
                      {cloudinaryStatus.configured ? `Active Cloud: ${cloudinaryStatus.cloudName}` : "Cloud Storage Ready"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {cloudinaryStatus.configured
                      ? "High-performance CDN enabled. Suite and room photos are streamed and securely stored in Cloudinary cloud."
                      : "Cloudinary upload pipeline ready. Add your CLOUDINARY_API_KEY in backend/.env for production cloud CDN delivery."}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-slate-400">Endpoint:</span>
                <code className="text-[11px] bg-slate-950 px-2.5 py-1 rounded border border-slate-800 text-amber-400 font-mono">
                  /api/upload
                </code>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-serif font-bold text-white">Suite & Room Inventory</h2>
                <p className="text-xs text-slate-400">Manage catalog, room pricing, and availability</p>
              </div>
              <button
                onClick={() => setIsAddRoomOpen(!isAddRoomOpen)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>{isAddRoomOpen ? "Close Form" : "Add New Suite"}</span>
              </button>
            </div>

            {/* Add Room Form Card */}
            {isAddRoomOpen && (
              <form onSubmit={handleAddRoom} className="bg-slate-900 border border-amber-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
                <h3 className="text-lg font-serif font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                  <span>✨</span> Add New Luxury Suite to Inventory
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-1">
                      Suite Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Royal Oceanfront Penthouse"
                      value={newRoom.title}
                      onChange={(e) => setNewRoom({ ...newRoom, title: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:border-amber-500 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-1">
                      Room Type
                    </label>
                    <select
                      value={newRoom.roomType}
                      onChange={(e) => setNewRoom({ ...newRoom, roomType: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:border-amber-500 outline-none"
                    >
                      <option value="Suite">Presidential Suite</option>
                      <option value="Deluxe">Deluxe Oceanfront</option>
                      <option value="Double">Royal Villa</option>
                      <option value="Single">Executive Suite</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-1">
                      Price Per Night ($)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 550"
                      value={newRoom.pricePerNight}
                      onChange={(e) => setNewRoom({ ...newRoom, pricePerNight: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:border-amber-500 outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Cloud Image Upload Component */}
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs uppercase tracking-wider font-bold text-slate-300 flex items-center gap-2">
                      <Cloud className="w-4 h-4 text-sky-400" />
                      <span>Suite Image Cloud Storage</span>
                    </label>
                    <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setImageUploadMode("cloud")}
                        className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                          imageUploadMode === "cloud" ? "bg-amber-500 text-slate-950 font-bold shadow" : "text-slate-400 hover:text-white"
                        }`}
                      >
                        Upload to Cloud
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageUploadMode("url")}
                        className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                          imageUploadMode === "url" ? "bg-amber-500 text-slate-950 font-bold shadow" : "text-slate-400 hover:text-white"
                        }`}
                      >
                        Direct URL
                      </button>
                    </div>
                  </div>

                  {imageUploadMode === "cloud" ? (
                    <div>
                      {newRoom.imageUrl ? (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-slate-900/90 border border-emerald-500/30 p-3 rounded-xl">
                          <img
                            src={newRoom.imageUrl}
                            alt="Uploaded Suite Preview"
                            className="w-28 h-20 object-cover rounded-lg border border-slate-700"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" /> Image Ready for Suite
                              </span>
                              {newRoom.imageUrl.includes("cloudinary") && (
                                <span className="text-[10px] bg-sky-500/20 text-sky-400 px-2 py-0.5 rounded font-mono border border-sky-500/30">
                                  Cloudinary CDN
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 truncate mt-1 font-mono">
                              {newRoom.imageUrl}
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                              <label className="text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer underline flex items-center gap-1">
                                <UploadCloud className="w-3 h-3" />
                                <span>Change Image</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageUpload}
                                  className="hidden"
                                />
                              </label>
                              <button
                                type="button"
                                onClick={() => setNewRoom({ ...newRoom, imageUrl: "" })}
                                className="text-xs text-red-400 hover:text-red-300 font-semibold"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <label className={`cursor-pointer border-2 border-dashed ${
                          uploadingImage ? "border-amber-500/80 bg-amber-500/5" : "border-slate-700 hover:border-amber-500 bg-slate-900/40"
                        } rounded-xl p-6 flex flex-col items-center justify-center transition-all group`}>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploadingImage}
                            className="hidden"
                          />
                          {uploadingImage ? (
                            <div className="flex flex-col items-center gap-2 py-2">
                              <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
                              <span className="text-sm font-semibold text-white">Uploading image to cloud storage...</span>
                              <span className="text-xs text-slate-400">Optimizing resolution & streaming to Cloudinary</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2 text-center">
                              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                                <UploadCloud className="w-6 h-6" />
                              </div>
                              <span className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                                Click or Drag to Upload Suite Image
                              </span>
                              <span className="text-xs text-slate-400">
                                Supports high-res JPG, PNG, WEBP (Max 10MB) &bull; Automatically hosted on Cloud
                              </span>
                            </div>
                          )}
                        </label>
                      )}
                    </div>
                  ) : (
                    <div>
                      <input
                        type="text"
                        placeholder="Paste cloud or image URL (e.g. https://res.cloudinary.com/... or Unsplash)"
                        value={newRoom.imageUrl}
                        onChange={(e) => setNewRoom({ ...newRoom, imageUrl: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:border-amber-500 outline-none"
                      />
                      {newRoom.imageUrl && (
                        <div className="mt-2 flex items-center gap-2">
                          <img
                            src={newRoom.imageUrl}
                            alt="Preview"
                            className="w-12 h-10 object-cover rounded border border-slate-700"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                          <span className="text-xs text-slate-400">Image preview active</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="pt-1">
                    <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-1">
                      Guest Capacity
                    </label>
                    <input
                      type="number"
                      value={newRoom.capacity}
                      onChange={(e) => setNewRoom({ ...newRoom, capacity: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:border-amber-500 outline-none"
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-1">
                    Suite Description
                  </label>
                  <textarea
                    rows="2"
                    placeholder="Describe architectural features, marble bath, views, private balcony..."
                    value={newRoom.description}
                    onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:border-amber-500 outline-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddRoomOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg"
                  >
                    {actionLoading ? "Publishing..." : "Publish Suite to Catalog"}
                  </button>
                </div>
              </form>
            )}

            {/* Room Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => {
                const img = room.images?.[0] || "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                return (
                  <div key={room._id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col group">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={img}
                        alt={room.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {img.includes("cloudinary") && (
                        <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-semibold text-sky-400 border border-sky-500/30 flex items-center gap-1 shadow-lg">
                          <Cloud className="w-3 h-3" />
                          <span>Cloud Stored</span>
                        </div>
                      )}
                      <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-amber-400 border border-amber-500/30">
                        ${room.pricePerNight || room.rates?.standard || 450} / night
                      </div>
                      <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-0.5 rounded text-[10px] uppercase font-bold text-slate-200">
                        {room.roomType || "Suite"}
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-serif font-bold text-lg text-white mb-1.5">{room.title}</h4>
                        <p className="text-xs text-slate-400 line-clamp-2 mb-4">{room.description}</p>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                        <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Status: {room.status || "Available"}</span>
                        </span>
                        <button
                          onClick={() => handleDeleteRoom(room._id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                          title="Remove Room"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: USER ACCOUNTS & PRIVILEGE MANAGEMENT                               */}
        {/* ========================================================================= */}
        {activeTab === "users" && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-serif font-bold text-white">Registered Guest & Staff Accounts</h2>
                <p className="text-xs text-slate-400">View registered users, toggle active status, and grant administrator roles</p>
              </div>

              {/* Search User Input */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 outline-none"
                />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-950/60 border-b border-slate-800">
                    <tr>
                      <th className="py-4 px-6">User</th>
                      <th className="py-4 px-6">Contact Email</th>
                      <th className="py-4 px-6">Mobile Phone</th>
                      <th className="py-4 px-6">Role</th>
                      <th className="py-4 px-6">Account Status</th>
                      <th className="py-4 px-6">Joined Date</th>
                      <th className="py-4 px-6 text-right">Administrative Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {users
                      .filter(u =>
                        !searchQuery ||
                        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        u.email?.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((u) => {
                        const isUserAdmin = u.role === "admin";
                        const isBlocked = u.isActive === false;
                        return (
                          <tr key={u._id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-800 text-amber-400 font-bold flex items-center justify-center text-xs border border-slate-700">
                                  {u.name ? u.name.charAt(0).toUpperCase() : "U"}
                                </div>
                                <span className="font-semibold text-white">{u.name}</span>
                              </div>
                            </td>
                            <td className="py-4 px-6 font-mono text-xs text-slate-300">
                              {u.email}
                            </td>
                            <td className="py-4 px-6 text-xs text-slate-400 font-mono">
                              {u.phone || "Google Auth"}
                            </td>
                            <td className="py-4 px-6">
                              <button
                                onClick={() => handleToggleRole(u._id, u.role)}
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider cursor-pointer transition-colors ${
                                  isUserAdmin
                                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30"
                                    : "bg-slate-800 text-slate-400 border border-slate-700 hover:text-white"
                                }`}
                                title="Click to toggle Admin / User role"
                              >
                                {isUserAdmin && <ShieldCheck className="w-3 h-3 text-amber-400" />}
                                <span>{u.role || "user"}</span>
                              </button>
                            </td>
                            <td className="py-4 px-6">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                                isBlocked
                                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                  : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              }`}>
                                {isBlocked ? "Blocked" : "Active"}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-xs text-slate-400">
                              {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "2026"}
                            </td>
                            <td className="py-4 px-6 text-right">
                              <button
                                onClick={() => handleToggleUser(u._id)}
                                disabled={actionLoading}
                                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                  isBlocked
                                    ? "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30"
                                    : "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30"
                                }`}
                              >
                                {isBlocked ? (
                                  <>
                                    <UserCheck className="w-3.5 h-3.5" />
                                    <span>Unblock Account</span>
                                  </>
                                ) : (
                                  <>
                                    <UserX className="w-3.5 h-3.5" />
                                    <span>Block User</span>
                                  </>
                                )}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: GUEST CONTACT INQUIRIES                                            */}
        {/* ========================================================================= */}
        {activeTab === "messages" && (
          <div className="space-y-6 animate-fadeIn">
            
            <div>
              <h2 className="text-xl font-serif font-bold text-white">Concierge & Contact Inquiries</h2>
              <p className="text-xs text-slate-400">Messages sent by guests via the Contact & Concierge page</p>
            </div>

            {messages.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-sm">
                No new guest inquiries. All caught up!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {messages.map((msg) => (
                  <div key={msg._id} className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-amber-400 font-mono">
                          {msg.email}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : "Recent"}
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-base mb-1">
                        {msg.subject || "VIP Reservation Inquiry"}
                      </h4>
                      <p className="text-xs text-slate-400 mb-2 font-semibold">
                        From: {msg.name}
                      </p>
                      <p className="text-sm text-slate-300 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 leading-relaxed">
                        "{msg.message}"
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800">
                      <a
                        href={`mailto:${msg.email}?subject=RoyalPark Response: ${encodeURIComponent(msg.subject || "Your Inquiry")}`}
                        className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-bold"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Reply by Email</span>
                      </a>
                      <button
                        onClick={() => handleDeleteMessage(msg._id)}
                        className="text-xs text-slate-500 hover:text-red-400 transition-colors"
                        title="Delete inquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
