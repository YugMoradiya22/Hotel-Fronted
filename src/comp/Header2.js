import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Header2() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      } else if (localStorage.getItem("token")) {
        setCurrentUser({ name: "Guest User" });
      } else {
        setCurrentUser(null);
      }
    } catch {
      setCurrentUser(null);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
    navigate("/");
  };

  const navLinks = [
    { name: "Suites", path: "/rooms" },
    { name: "Dining", path: "/services" },
    { name: "About", path: "/aboutpage" },
    { name: "Offers", path: "/offers" },
    { name: "Contact", path: "/contact" }
  ];

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/95 border-b border-amber-100/80 shadow-sm transition-all duration-300">
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* --- BRAND / LOGO --- */}
          <Link to="/" className="flex items-center gap-3 group shrink-0 mr-4 xl:mr-8">
            <span className="text-3xl filter drop-shadow group-hover:scale-110 transition-transform duration-300">👑</span>
            <div className="flex flex-col">
              <span className="text-2xl font-serif font-extrabold text-slate-900 tracking-tight leading-none group-hover:text-amber-600 transition-colors">
                RoyalPark
              </span>
              <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-amber-600 font-sans mt-0.5">
                Luxury Hotel & Resort
              </span>
            </div>
          </Link>

          {/* --- DESKTOP NAVIGATION LINKS --- */}
          <ul className="hidden lg:flex items-center gap-5 xl:gap-8">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className={`relative text-xs uppercase tracking-wider font-semibold py-2 transition-colors duration-200 shrink-0 whitespace-nowrap ${
                    isActive(link.path)
                      ? "text-amber-600"
                      : "text-slate-600 hover:text-amber-600"
                  }`}
                >
                  {link.name}
                  {isActive(link.path) && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full animate-fadeIn" />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* --- DESKTOP ACTION BUTTONS --- */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0 ml-auto">
            {currentUser ? (
              <div className="flex items-center gap-2 xl:gap-3">
                {currentUser.role === "admin" && (
                  <Link
                    to="/admin"
                    className="px-3 py-1.5 text-xs uppercase tracking-wider font-extrabold rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm hover:shadow transition-all flex items-center gap-1 shrink-0"
                  >
                    <span>👑</span>
                    <span>Admin</span>
                  </Link>
                )}
                {currentUser.role === "staff" && (
                  <Link
                    to="/staff"
                    className="px-3 py-1.5 text-xs uppercase tracking-wider font-extrabold rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm hover:shadow transition-all flex items-center gap-1 shrink-0"
                  >
                    <span>🛠️</span>
                    <span>Staff Portal</span>
                  </Link>
                )}
                <Link
                  to="/mybookings"
                  className="px-3.5 py-1.5 text-xs uppercase tracking-wider font-bold rounded-lg border border-slate-300 text-slate-700 hover:border-amber-500 hover:text-amber-600 transition-all shrink-0 whitespace-nowrap"
                >
                  My Bookings
                </Link>
                <div className="flex items-center gap-2 pl-2.5 border-l border-slate-200 shrink-0">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-white font-bold flex items-center justify-center text-xs shadow-sm shrink-0">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="text-xs font-semibold text-slate-800 max-w-[90px] truncate">
                    {currentUser.name ? currentUser.name.split(" ")[0] : "User"}
                  </span>
                  {currentUser.role === "admin" && (
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded border border-amber-300 shadow-xs">
                      Admin
                    </span>
                  )}
                  {currentUser.role === "staff" && (
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded border border-blue-300 shadow-xs">
                      Staff
                    </span>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-xs text-slate-400 hover:text-red-600 font-medium ml-1 transition-colors p-1"
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
                  className="px-4 py-2 text-xs uppercase tracking-wider font-bold text-slate-700 hover:text-amber-600 transition-colors shrink-0"
                >
                  Sign In
                </Link>
                <Link
                  to="/rooms"
                  className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs uppercase tracking-wider font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 shrink-0"
                >
                  Book A Room
                </Link>
              </div>
            )}
          </div>

          {/* --- MOBILE HAMBURGER BUTTON --- */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Menu"
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

      {/* --- MOBILE MENU DRAWER --- */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-4 pb-6 space-y-3 shadow-xl">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive(link.path)
                  ? "bg-amber-50 text-amber-700 font-bold"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          <div className="pt-4 border-t border-slate-200">
            {currentUser ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-3">
                  <div className="w-8 h-8 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-xs">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{currentUser.name}</p>
                    <p className="text-xs text-slate-500">{currentUser.email || "RoyalPark Member"}</p>
                  </div>
                </div>
                <Link
                  to="/mybookings"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-center w-full py-2.5 rounded-lg border border-slate-300 text-slate-800 font-bold text-sm"
                >
                  My Bookings
                </Link>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="block w-full py-2.5 text-center text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-lg border border-slate-300 text-slate-800 font-bold text-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/rooms"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-lg bg-amber-600 text-white font-bold text-sm shadow"
                >
                  Book A Room
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Header2;