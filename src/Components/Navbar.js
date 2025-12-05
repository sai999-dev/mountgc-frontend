import React, { useState, useEffect, useRef } from "react";
import { Search, Menu, X, User, ChevronDown, LogOut, LayoutDashboard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import toast from "react-hot-toast";

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Check authentication status on component mount and listen for changes
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      if (authenticated) {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
      } else {
        setUser(null);
      }
    };

    // Check auth on mount
    checkAuth();

    // Listen for custom login/logout events
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('authChange', handleAuthChange);
    window.addEventListener('storage', checkAuth); // Also listen for storage changes

    return () => {
      window.removeEventListener('authChange', handleAuthChange);
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
      setUser(null);
      setProfileDropdownOpen(false);
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if there's an error, clear local state
      setIsAuthenticated(false);
      setUser(null);
      setProfileDropdownOpen(false);
      toast.success("Logged out successfully!");
      navigate("/");
    }
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between relative">
      {/* ✅ Logo (links to homepage) */}
      <Link
        to="/"
        className="flex items-center space-x-2 hover:opacity-90 transition"
      >
        <div className="bg-green-500 w-10 h-10 flex items-center justify-center rounded">
          <span className="text-gray-900 font-extrabold text-lg">M</span>
        </div>
        <span className="text-green-500 font-bold text-xl">MountGC</span>
      </Link>

      {/* ✅ Desktop Search Bar */}
      <div className="hidden md:block relative w-1/3">
        <Search className="absolute top-2 left-3 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search users on MountGC"
          className="w-full bg-white text-gray-800 placeholder-gray-400 rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none"
        />
      </div>

      {/* ✅ Desktop Buttons / Profile Dropdown */}
      <div className="hidden md:flex space-x-5 items-center">
        {isAuthenticated ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition"
            >
              <div className="bg-green-500 w-8 h-8 flex items-center justify-center rounded-full">
                <User size={18} className="text-gray-900" />
              </div>
              <span className="text-sm font-medium">{user?.username || "User"}</span>
              <ChevronDown size={16} className={`transition-transform ${profileDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-2 z-50 border border-gray-700">
                <Link
                  to="/dashboard"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-700 transition"
                >
                  <LayoutDashboard size={18} />
                  <span className="text-sm">Dashboard</span>
                </Link>
                <hr className="border-gray-700 my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-700 transition text-red-400"
                >
                  <LogOut size={18} />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link
              to="/signin"
              className="hover:underline text-sm font-medium transition"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="hover:underline text-sm font-medium transition"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>

      {/* ✅ Mobile Menu Toggle */}
      <button
        className="md:hidden focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* ✅ Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-14 left-0 w-full bg-gray-800 flex flex-col items-center space-y-3 py-3 md:hidden animate-fadeIn z-50">
          <div className="relative w-11/12">
            <Search className="absolute top-2 left-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search users on MountGC"
              className="w-full bg-white text-gray-800 placeholder-gray-400 rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none"
            />
          </div>

          {isAuthenticated ? (
            <>
              {/* User Info */}
              <div className="flex items-center space-x-2 py-2">
                <div className="bg-green-500 w-8 h-8 flex items-center justify-center rounded-full">
                  <User size={18} className="text-gray-900" />
                </div>
                <span className="text-sm font-medium">{user?.username || "User"}</span>
              </div>

              {/* Dashboard Link */}
              <Link
                to="/dashboard"
                className="flex items-center space-x-2 hover:underline text-sm font-medium"
                onClick={() => setMenuOpen(false)}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>

              {/* Logout Button */}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center space-x-2 text-red-400 hover:underline text-sm font-medium"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className="hover:underline text-sm font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="hover:underline text-sm font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

/* ✅ Smooth fade-in animation for mobile menu */
const style = document.createElement("style");
style.innerHTML = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn { animation: fadeIn 0.25s ease-out; }
`;
document.head.appendChild(style);

export default Navbar;
