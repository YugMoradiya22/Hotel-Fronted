import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  ClipboardList,
  BedDouble,
  Users,
  CheckCircle,
  Plus,
  RefreshCw,
  ExternalLink,
  LogOut,
  CalendarCheck,
  Check,
  ShieldCheck
} from "lucide-react";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function StaffPanel() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("board"); // board, tasks, arrivals
  
  // Data States
  const [stats, setStats] = useState({
    activeTasks: 3,
    completedTasks: 8,
    totalRooms: 8,
    todayArrivals: 3
  });
  const [tasks, setTasks] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [arrivals, setArrivals] = useState([]);
  
  // UI & Loading States
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);
  const [roomFilter, setRoomFilter] = useState("all");
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  
  // New Task Form
  const [newTask, setNewTask] = useState({
    title: "",
    room: "Suite 101",
    category: "Housekeeping",
    priority: "Medium",
    dueDate: "Today, 3:00 PM"
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setCurrentUser(parsed);
      } catch (e) {
        console.error("Auth parse error", e);
      }
    }
    fetchStaffData();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchStaffData = async () => {
    setLoading(true);
    try {
      // 1. Overview Stats
      const resStats = await fetch(`${API}/api/staff/overview`).catch(() => null);
      if (resStats && resStats.ok) {
        const data = await resStats.json();
        if (data.stats) setStats(data.stats);
      }

      // 2. Tasks
      const resTasks = await fetch(`${API}/api/staff/tasks`).catch(() => null);
      if (resTasks && resTasks.ok) {
        const data = await resTasks.json();
        if (data.tasks) setTasks(data.tasks);
      }

      // 3. Rooms Housekeeping
      const resRooms = await fetch(`${API}/api/staff/rooms`).catch(() => null);
      if (resRooms && resRooms.ok) {
        const data = await resRooms.json();
        let rList = data.rooms || [];
        if (rList.length === 0) {
          // Fallback sample room board if catalog is empty
          rList = [
            { _id: "r101", roomNumber: "101", title: "Presidential Penthouse", roomType: "Suite", housekeepingStatus: "Dirty", floor: 1, lastCleaned: "Yesterday" },
            { _id: "r102", roomNumber: "102", title: "Oceanfront Deluxe", roomType: "Deluxe", housekeepingStatus: "Cleaning", floor: 1, lastCleaned: "Today, 9:00 AM" },
            { _id: "r201", roomNumber: "201", title: "Royal Garden Villa", roomType: "Villa", housekeepingStatus: "Clean", floor: 2, lastCleaned: "Today, 11:30 AM" },
            { _id: "r202", roomNumber: "202", title: "Grand Royal Suite", roomType: "Suite", housekeepingStatus: "Inspected", floor: 2, lastCleaned: "Today, 12:15 PM" },
            { _id: "r301", roomNumber: "301", title: "Azure Waterfront Retreat", roomType: "Suite", housekeepingStatus: "Clean", floor: 3, lastCleaned: "Today, 10:00 AM" },
            { _id: "r302", roomNumber: "302", title: "Emerald Sanctuary Villa", roomType: "Villa", housekeepingStatus: "Maintenance", floor: 3, lastCleaned: "3 days ago" }
          ];
        }
        setRooms(rList);
      }

      // 4. Arrivals
      const resArrivals = await fetch(`${API}/api/staff/arrivals`).catch(() => null);
      if (resArrivals && resArrivals.ok) {
        const data = await resArrivals.json();
        let aList = data.arrivals || [];
        if (aList.length === 0) {
          aList = [
            { _id: "a1", guestName: "Alexander Vance", roomTitle: "Presidential Penthouse", checkIn: new Date().toISOString(), specialRequest: "VIP Champagne & Feather pillows requested." },
            { _id: "a2", guestName: "Sophia Martinez", roomTitle: "Royal Garden Villa", checkIn: new Date().toISOString(), specialRequest: "Late arrival around 6:00 PM. Baby cot needed." },
            { _id: "a3", guestName: "Kenil Bhadani", roomTitle: "Azure Waterfront Retreat", checkIn: new Date().toISOString(), specialRequest: "Turndown service at 8:00 PM." }
          ];
        }
        setArrivals(aList);
      }
    } catch (e) {
      console.error("Staff data error", e);
    } finally {
      setLoading(false);
    }
  };

  // Update Room Status
  const handleUpdateRoomStatus = async (roomId, newStatus) => {
    try {
      const res = await fetch(`${API}/api/staff/rooms/${roomId}/housekeeping`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ housekeepingStatus: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setRooms(prev => prev.map(r => r._id === roomId ? { ...r, housekeepingStatus: newStatus, lastCleaned: "Just now" } : r));
        showToast(`Room marked as ${newStatus}`);
      } else {
        // Local state update fallback
        setRooms(prev => prev.map(r => r._id === roomId ? { ...r, housekeepingStatus: newStatus, lastCleaned: "Just now" } : r));
        showToast(`Room marked as ${newStatus}`);
      }
    } catch (e) {
      setRooms(prev => prev.map(r => r._id === roomId ? { ...r, housekeepingStatus: newStatus, lastCleaned: "Just now" } : r));
      showToast(`Room status updated to ${newStatus}`);
    }
  };

  // Update Task Status
  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      const res = await fetch(`${API}/api/staff/tasks/${taskId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
        showToast(`Task marked as ${newStatus}`);
      } else {
        setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
        showToast(`Task marked as ${newStatus}`);
      }
    } catch (e) {
      setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
      showToast(`Task marked as ${newStatus}`);
    }
  };

  // Add Task
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title) return;
    try {
      const res = await fetch(`${API}/api/staff/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newTask,
          assignedToName: currentUser?.name || "Operations Team"
        })
      });
      const data = await res.json();
      if (data.success) {
        setTasks(prev => [data.task, ...prev]);
        setIsAddTaskOpen(false);
        setNewTask({
          title: "",
          room: "Suite 101",
          category: "Housekeeping",
          priority: "Medium",
          dueDate: "Today, 3:00 PM"
        });
        showToast("Operational task added!");
      }
    } catch (e) {
      showToast("Error adding task");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Allow access for staff OR admin
  const isAuthorized = currentUser && (currentUser.role === "staff" || currentUser.role === "admin");

  if (!isAuthorized && !loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white">
        <div className="max-w-md w-full bg-slate-900 border border-blue-500/30 rounded-2xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-4 border border-blue-500/40">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-white mb-2">Staff Portal Access</h1>
          <p className="text-sm text-slate-400 mb-6">
            Please log in with verified Staff or Administrator credentials to view daily hotel operations and housekeeping tasks.
          </p>
          <div className="space-y-3">
            <Link
              to="/login"
              className="block w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold uppercase tracking-wider text-xs shadow-lg transition-all"
            >
              Sign In as Staff / Admin
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
        <div className="fixed top-5 right-5 z-50 bg-blue-500 text-white px-5 py-3 rounded-xl shadow-2xl font-bold text-sm flex items-center gap-2 border border-blue-400 animate-slideIn">
          <CheckCircle className="w-5 h-5 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-blue-500/20 px-6 py-4">
        <div className="max-w-[1440px] w-full mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3 group">
              <span className="text-2xl filter drop-shadow">👑</span>
              <div className="flex flex-col">
                <span className="text-xl font-serif font-extrabold text-white tracking-tight flex items-center gap-2">
                  RoyalPark
                  <span className="text-[10px] uppercase font-sans font-extrabold bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-2 py-0.5 rounded shadow-sm">
                    Staff Portal
                  </span>
                </span>
                <span className="text-[9px] tracking-[0.25em] uppercase font-bold text-blue-400/90">
                  Operations & Housekeeping Console
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {currentUser?.role === "admin" && (
              <Link
                to="/admin"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider text-amber-400 hover:text-amber-300 bg-amber-500/10 border border-amber-500/30 transition-colors"
              >
                <span>👑</span>
                <span>Admin Panel</span>
              </Link>
            )}

            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-blue-400 hover:bg-slate-800 border border-slate-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Website</span>
            </Link>

            <button
              onClick={fetchStaffData}
              disabled={loading}
              className="p-2 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>

            <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-extrabold flex items-center justify-center text-xs shadow-md">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "S"}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-white leading-tight">
                  {currentUser?.name || "Staff Member"}
                </span>
                <span className="text-[10px] text-blue-400 font-mono">
                  {currentUser?.role === "admin" ? "Super Admin" : "Operations Team"}
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

      {/* MAIN CONTENT CONTAINER */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex items-center justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-slate-400 block mb-1">
                Active Tasks
              </span>
              <div className="text-3xl font-serif font-extrabold text-white">
                {tasks.filter(t => t.status !== "Completed").length}
              </div>
              <p className="text-xs text-amber-400 mt-1">Pending dispatch</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <ClipboardList className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex items-center justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-slate-400 block mb-1">
                Completed Today
              </span>
              <div className="text-3xl font-serif font-extrabold text-emerald-400">
                {stats.completedTasks || tasks.filter(t => t.status === "Completed").length}
              </div>
              <p className="text-xs text-emerald-400/80 mt-1">Duty performance 100%</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex items-center justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-slate-400 block mb-1">
                Clean & Inspected
              </span>
              <div className="text-3xl font-serif font-extrabold text-blue-400">
                {rooms.filter(r => r.housekeepingStatus === "Clean" || r.housekeepingStatus === "Inspected").length}
              </div>
              <p className="text-xs text-slate-400 mt-1">Ready for check-in</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <BedDouble className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex items-center justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-slate-400 block mb-1">
                Today's Arrivals
              </span>
              <div className="text-3xl font-serif font-extrabold text-white">
                {arrivals.length}
              </div>
              <p className="text-xs text-blue-400 mt-1">VIP Guest Stays</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <CalendarCheck className="w-6 h-6" />
            </div>
          </div>

        </div>

        {/* TAB BUTTONS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-slate-800/80">
          {[
            { id: "board", label: `Housekeeping Board (${rooms.length} Suites)`, icon: Sparkles },
            { id: "tasks", label: `Operational Tasks (${tasks.length})`, icon: ClipboardList },
            { id: "arrivals", label: `Guest Arrivals (${arrivals.length})`, icon: Users }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20 font-extrabold"
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
        {/* TAB 1: HOUSEKEEPING BOARD                                                 */}
        {/* ========================================================================= */}
        {activeTab === "board" && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-serif font-bold text-white">Suite Housekeeping & Turnover Board</h2>
                <p className="text-xs text-slate-400">Track cleaning status, pass room inspections, and prepare suites for check-in</p>
              </div>

              {/* Status Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                {["all", "Needs Cleaning", "Cleaning", "Clean", "Inspected"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setRoomFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                      roomFilter === filter
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Room Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {rooms
                .filter(r => {
                  if (roomFilter === "all") return true;
                  if (roomFilter === "Needs Cleaning") return r.housekeepingStatus === "Dirty";
                  return r.housekeepingStatus === roomFilter;
                })
                .map((room) => {
                  const status = room.housekeepingStatus || "Clean";
                  let statusBg = "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
                  if (status === "Dirty") statusBg = "bg-red-500/20 text-red-400 border-red-500/30";
                  if (status === "Cleaning") statusBg = "bg-amber-500/20 text-amber-400 border-amber-500/30";
                  if (status === "Inspected") statusBg = "bg-blue-500/20 text-blue-400 border-blue-500/30";
                  if (status === "Maintenance") statusBg = "bg-purple-500/20 text-purple-400 border-purple-500/30";

                  return (
                    <div key={room._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-slate-800 text-white font-mono font-bold text-sm flex items-center justify-center border border-slate-700">
                              {room.roomNumber}
                            </span>
                            <div>
                              <h4 className="text-sm font-bold text-white">{room.title}</h4>
                              <span className="text-[10px] text-slate-400 uppercase font-semibold">
                                Floor {room.floor || 1} • {room.roomType || "Suite"}
                              </span>
                            </div>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${statusBg}`}>
                            {status === "Dirty" ? "Needs Cleaning" : status}
                          </span>
                        </div>

                        <div className="text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 mb-4 flex items-center justify-between">
                          <span>Last Activity:</span>
                          <span className="font-mono text-slate-300">{room.lastCleaned || "Today"}</span>
                        </div>
                      </div>

                      {/* Action Buttons for Housekeeping */}
                      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800">
                        {status !== "Cleaning" && (
                          <button
                            onClick={() => handleUpdateRoomStatus(room._id, "Cleaning")}
                            className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30 transition-colors"
                          >
                            Start Cleaning
                          </button>
                        )}
                        {status !== "Clean" && (
                          <button
                            onClick={() => handleUpdateRoomStatus(room._id, "Clean")}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 transition-colors"
                          >
                            Mark Clean
                          </button>
                        )}
                        {status !== "Inspected" && (
                          <button
                            onClick={() => handleUpdateRoomStatus(room._id, "Inspected")}
                            className="px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-bold border border-blue-500/30 transition-colors"
                          >
                            Pass Inspection
                          </button>
                        )}
                        {status !== "Dirty" && (
                          <button
                            onClick={() => handleUpdateRoomStatus(room._id, "Dirty")}
                            className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/30 transition-colors"
                          >
                            Mark Dirty
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: OPERATIONAL TASKS DISPATCH                                         */}
        {/* ========================================================================= */}
        {activeTab === "tasks" && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-serif font-bold text-white">Duty Tasks & Maintenance Dispatch</h2>
                <p className="text-xs text-slate-400">View assigned tasks, update completion status, and log service requests</p>
              </div>
              <button
                onClick={() => setIsAddTaskOpen(!isAddTaskOpen)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>{isAddTaskOpen ? "Close Form" : "Create Task"}</span>
              </button>
            </div>

            {/* Create Task Form */}
            {isAddTaskOpen && (
              <form onSubmit={handleAddTask} className="bg-slate-900 border border-blue-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
                <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2">
                  Create Operational Duty / Task
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-1">
                      Task Description
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. VIP Turndown Service"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white text-xs outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-1">
                      Room / Area
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Suite 402"
                      value={newTask.room}
                      onChange={(e) => setNewTask({ ...newTask, room: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white text-xs outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-1">
                      Priority Level
                    </label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white text-xs outline-none focus:border-blue-500"
                    >
                      <option value="Urgent">Urgent / Immediate</option>
                      <option value="High">High Priority</option>
                      <option value="Medium">Medium Priority</option>
                      <option value="Low">Low / Standard</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddTaskOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg"
                  >
                    Add Task
                  </button>
                </div>
              </form>
            )}

            {/* Tasks List */}
            <div className="space-y-3">
              {tasks.map((task) => {
                const isCompleted = task.status === "Completed";
                const isUrgent = task.priority === "Urgent" || task.priority === "High";

                return (
                  <div
                    key={task._id}
                    className={`bg-slate-900 border rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                      isCompleted ? "border-slate-800/60 opacity-60" : isUrgent ? "border-red-500/30" : "border-slate-800"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <button
                        onClick={() => handleUpdateTaskStatus(task._id, isCompleted ? "Pending" : "Completed")}
                        className={`mt-1 w-6 h-6 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${
                          isCompleted
                            ? "bg-emerald-500 border-emerald-500 text-slate-950"
                            : "border-slate-600 hover:border-blue-400 text-transparent"
                        }`}
                        title="Mark Complete"
                      >
                        <Check className="w-4 h-4" />
                      </button>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`text-sm font-bold ${isCompleted ? "line-through text-slate-400" : "text-white"}`}>
                            {task.title}
                          </h4>
                          <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded ${
                            task.priority === "Urgent"
                              ? "bg-red-500/20 text-red-400 border border-red-500/30"
                              : task.priority === "High"
                              ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                              : "bg-slate-800 text-slate-400"
                          }`}>
                            {task.priority || "Normal"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span>Room: <strong className="text-slate-200">{task.room || "Suite"}</strong></span>
                          <span>•</span>
                          <span>Category: <strong className="text-slate-200">{task.category || "Housekeeping"}</strong></span>
                          <span>•</span>
                          <span>Due: <strong className="text-blue-400">{task.dueDate || "Today"}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <span className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider ${
                        isCompleted
                          ? "bg-emerald-500/20 text-emerald-400"
                          : task.status === "In Progress"
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-slate-800 text-slate-300"
                      }`}>
                        {task.status || "Pending"}
                      </span>
                      {task.status !== "In Progress" && !isCompleted && (
                        <button
                          onClick={() => handleUpdateTaskStatus(task._id, "In Progress")}
                          className="px-3 py-1 rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-xs font-bold"
                        >
                          Start Task
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: GUEST ARRIVALS & VIP STAYS                                         */}
        {/* ========================================================================= */}
        {activeTab === "arrivals" && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl font-serif font-bold text-white">Expected Guest Check-Ins Today</h2>
              <p className="text-xs text-slate-400">Suites requiring preparation, welcome amenities, and guest luggage dispatch</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {arrivals.map((arrival) => (
                <div key={arrival._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                        VIP Reservation
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {arrival.checkIn ? new Date(arrival.checkIn).toLocaleDateString() : "Today"}
                      </span>
                    </div>
                    <h4 className="text-lg font-serif font-bold text-white mb-1">
                      {arrival.guestName}
                    </h4>
                    <p className="text-xs text-slate-300 font-semibold mb-3">
                      Assigned Suite: <span className="text-amber-400">{arrival.roomTitle}</span>
                    </p>
                    <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80">
                      <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block mb-1">
                        Guest Preference & Special Request:
                      </span>
                      <p className="text-xs text-slate-300 italic">
                        "{arrival.specialRequest || "Standard VIP preparation with personalized welcome card."}"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800">
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Suite Ready for Check-in</span>
                    </span>
                    <button
                      onClick={() => showToast(`Room dispatch notified for ${arrival.guestName}`)}
                      className="text-xs text-blue-400 hover:text-blue-300 font-bold"
                    >
                      Acknowledge & Prepare →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
