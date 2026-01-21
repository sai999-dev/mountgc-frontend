import React, { useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronRight,
  Globe,
  Star,
  School,
  GraduationCap,
  Menu,
  X,
  Download,
} from "lucide-react";

const SubNavbar = () => {
  const [isUniOpen, setIsUniOpen] = useState(false);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [uniMobileOpen, setUniMobileOpen] = useState(false);
  const [countryMobileOpen, setCountryMobileOpen] = useState(false);
  const hoverTimeout = useRef(null);
  const location = useLocation();

  // Hover logic
  const handleMouseEnterUni = () => {
    clearTimeout(hoverTimeout.current);
    setIsUniOpen(true);
  };
  const handleMouseLeaveUni = () => {
    hoverTimeout.current = setTimeout(() => {
      setIsUniOpen(false);
      setIsCountryOpen(false);
    }, 150);
  };
  const handleMouseEnterCountry = () => {
    clearTimeout(hoverTimeout.current);
    setIsCountryOpen(true);
  };
  const handleMouseLeaveCountry = () => {
    hoverTimeout.current = setTimeout(() => setIsCountryOpen(false), 150);
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-2 border-t border-gray-800 relative">
      {/* ---------------------- DESKTOP NAVBAR ---------------------- */}
      <div className="hidden md:flex items-center justify-between">
        {/* LEFT MENU */}
        <ul className="flex items-center space-x-6 text-sm font-medium">
          {/* Universities Dropdown */}
          <li
            className="relative hover:text-yellow-400 cursor-pointer flex items-center"
            onMouseEnter={handleMouseEnterUni}
            onMouseLeave={handleMouseLeaveUni}
          >
            Universities <span className="text-xs ml-1">▼</span>

            {isUniOpen && (
              <div
                className="absolute top-7 left-0 w-80 bg-gray-800 text-white shadow-lg rounded-md py-2 z-50 animate-fadeIn"
                onMouseEnter={handleMouseEnterUni}
                onMouseLeave={handleMouseLeaveUni}
              >
                {/* Top Universities by Country */}
                <div
                  className="flex items-start px-4 py-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700 relative"
                  onMouseEnter={handleMouseEnterCountry}
                  onMouseLeave={handleMouseLeaveCountry}
                >
                  <div className="mr-3 mt-1">
                    <Globe className="text-green-400" size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm flex items-center">
                      Top Universities By Country
                    </p>
                    <p className="text-xs text-gray-400">
                      Find statistics like acceptance rates, expenses, deadlines,
                      and test scores.
                    </p>
                  </div>
                  <ChevronRight className="ml-auto text-gray-400" size={14} />

                  {/* LEVEL 2 SUBMENU */}
                  {isCountryOpen && (
                    <div
                      className="absolute top-0 left-full w-60 bg-gray-800 text-white shadow-lg rounded-md py-2 z-50 ml-1 animate-slideRight"
                      onMouseEnter={handleMouseEnterCountry}
                      onMouseLeave={handleMouseLeaveCountry}
                    >
                      <p className="font-semibold text-sm px-4 pb-2 border-b border-gray-700">
                        Countries
                      </p>
                      {[
                        "USA",
                        "Canada",
                        "United Kingdom",
                        "Germany",
                        "Australia",
                        "Singapore",
                        "Ireland",
                        "Netherlands",
                        "France",
                        "Switzerland",
                        "New Zealand",
                      ].map((country) => (
                        <p
                          key={country}
                          className="px-4 py-2 text-sm hover:bg-gray-700 cursor-pointer"
                        >
                          {country}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                {/* Remaining Menu Items */}
                <DropdownItem
                  icon={<GraduationCap className="text-green-400" size={18} />}
                  title="UniPredict"
                  desc="Predicts where you can get admits."
                />
                <DropdownItem
                  icon={<Star className="text-green-400" size={18} />}
                  title="RateMyChances"
                  desc="Estimates your admit chances with profile advice."
                  badge="New"
                />
                <DropdownItem
                  icon={<School className="text-green-400" size={18} />}
                  title="Popular Programs"
                  desc="Search universities offering programs of your choice."
                  hasArrow
                />
                <DropdownItem
                  icon={<Globe className="text-green-400" size={18} />}
                  title="High Ranked Cheap Universities"
                  desc="Find universities with low tuition and the best rankings."
                />
              </div>
            )}
          </li>

          {/* ✅ Home Link */}
          <li
            className={`cursor-pointer ${
              location.pathname === "/"
                ? "text-green-400 font-semibold"
                : "hover:text-yellow-400"
            }`}
          >
            <Link to="/">Home</Link>
          </li>

          {/* ✅ Services Link */}
          <li
            className={`cursor-pointer ${
              location.pathname === "/services"
                ? "text-green-400 font-semibold"
                : "hover:text-yellow-400"
            }`}
          >
            <Link to="/services">Services</Link>
          </li>

          {/* <li className="hover:text-yellow-400 cursor-pointer">Decisions</li>
          <li className="hover:text-yellow-400 cursor-pointer">Discussions</li>
          <li className="hover:text-yellow-400 cursor-pointer">Articles</li> */}

          {/* <li className="hover:text-yellow-400 cursor-pointer flex items-center">
            Resources{" "}
            <span className="ml-2 bg-red-600 text-[10px] font-bold px-1.5 rounded">
              New
            </span>
          </li>

          <li className="hover:text-yellow-400 cursor-pointer flex items-center">
            AI Services{" "}
            <span className="ml-2 bg-red-600 text-[10px] font-bold px-1.5 rounded">
              New
            </span>
          </li>

          <li className="hover:text-yellow-400 cursor-pointer flex items-center">
            Material{" "}
            <span className="ml-2 bg-green-500 text-[10px] font-bold px-1.5 rounded">
              New
            </span>
          </li> */}

          {/* ✅ FIXED — Book Counseling now navigates correctly */}
          <Link to="/book-counseling">
            <button className="bg-green-500 text-black font-semibold px-4 py-1 rounded hover:bg-green-600 ml-4 transition">
              Book Counseling Session
            </button>
          </Link>
        </ul>

     
      </div>

      {/* ---------------------- MOBILE NAVBAR ---------------------- */}
      {/* (Unchanged – already working) */}
      <div className="md:hidden flex items-center justify-between">
        <span className="text-green-500 font-semibold text-sm">MountGC Menu</span>
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="flex flex-col bg-gray-800 mt-2 rounded-md p-3 space-y-2 md:hidden">
          <div
            className="flex justify-between items-center cursor-pointer hover:text-green-600"
            onClick={() => setUniMobileOpen(!uniMobileOpen)}
          >
            <span>Universities</span>
            <span>{uniMobileOpen ? "▲" : "▼"}</span>
          </div>

          {uniMobileOpen && (
            <div className="bg-gray-700 rounded-md mt-2">
              <div
                className="flex justify-between items-center px-4 py-2 border-b border-gray-600 hover:bg-gray-600 cursor-pointer"
                onClick={() => setCountryMobileOpen(!countryMobileOpen)}
              >
                <span>Top Universities By Country</span>
                <span>{countryMobileOpen ? "▲" : "▼"}</span>
              </div>

              {countryMobileOpen && (
                <div className="bg-gray-600 animate-fadeIn">
                  {[
                    "USA",
                    "Canada",
                    "United Kingdom",
                    "Germany",
                    "Australia",
                    "Singapore",
                    "Ireland",
                    "Netherlands",
                    "France",
                    "Switzerland",
                    "New Zealand",
                  ].map((country) => (
                    <p
                      key={country}
                      className="px-6 py-2 text-sm border-b border-gray-500 hover:bg-gray-500 cursor-pointer"
                    >
                      {country}
                    </p>
                  ))}
                </div>
              )}

              <MobileDropdownItem title="UniPredict" />
              <MobileDropdownItem title="RateMyChances" badge="New" />
              <MobileDropdownItem title="Popular Programs" />
              <MobileDropdownItem title="High Ranked Cheap Universities" />
            </div>
          )}

          <li
            className={`cursor-pointer ${
              location.pathname === "/"
                ? "text-green-400 font-semibold"
                : "hover:text-yellow-400"
            }`}
          >
            <Link to="/" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
          </li>

          <li
            className={`cursor-pointer ${
              location.pathname === "/services"
                ? "text-green-400 font-semibold"
                : "hover:text-yellow-400"
            }`}
          >
            <Link to="/services" onClick={() => setMenuOpen(false)}>
              Services
            </Link>
          </li>

          {/* <p className="hover:text-yellow-400">Decisions</p>
          <p className="hover:text-yellow-400">Discussions</p>
          <p className="hover:text-yellow-400">Articles</p>
          <p className="hover:text-yellow-400">Resources</p>
          <p className="hover:text-yellow-400">AI Services</p>
          <p className="hover:text-yellow-400">Material</p> */}

          <Link to="/book-counseling">
            <button className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded hover:bg-yellow-300 transition">
              Book Counseling Session
            </button>
          </Link>

        
        </div>
      )}
    </nav>
  );
};

/* ---------------------- COMPONENTS ---------------------- */
const DropdownItem = ({ icon, title, desc, badge, hasArrow }) => (
  <div className="flex items-start px-4 py-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700">
    <div className="mr-3 mt-1">{icon}</div>
    <div className="flex-1">
      <p className="font-semibold text-sm flex items-center">
        {title}
        {badge && (
          <span className="bg-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded ml-2">
            {badge}
          </span>
        )}
      </p>
      <p className="text-xs text-gray-400">{desc}</p>
    </div>
    {hasArrow && <ChevronRight className="ml-auto text-gray-400" size={14} />}
  </div>
);

const MobileDropdownItem = ({ title, badge }) => (
  <div className="flex items-center justify-between px-4 py-2 border-b border-gray-600 hover:bg-gray-600 cursor-pointer">
    <span className="text-sm">{title}</span>
    {badge && (
      <span className="bg-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded">
        {badge}
      </span>
    )}
  </div>
);

/* ---------------------- ANIMATIONS ---------------------- */
const style = document.createElement("style");
style.innerHTML = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes slideRight {
  from { opacity: 0; transform: translateX(-10px); }
  to { opacity: 1; transform: translateX(0); }
}
.animate-fadeIn { animation: fadeIn 0.2s ease-out; }
.animate-slideRight { animation: slideRight 0.25s ease-out; }
`;
document.head.appendChild(style);

export default SubNavbar;
