import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-primary shadow-lg sticky top-0">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around items-center h-16 relative">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center px-6 rounded-lg transition-all ${
                isActive
                  ? "bg-white/30 text-white scale-110"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`
            }
          >
            <span className="text-2xl mb-1">🏠</span>
            <span className="text-xs font-medium">Home</span>
          </NavLink>

          <NavLink
            to="/calendar"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center px-6 rounded-lg transition-all ${
                isActive
                  ? "bg-white/30 text-white scale-110"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`
            }
          >
            <span className="text-2xl mb-1">📅</span>
            <span className="text-xs font-medium">Calendar</span>
          </NavLink>

          <NavLink
            to="/shop"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center px-6 rounded-lg transition-all ${
                isActive
                  ? "bg-white/30 text-white scale-110"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`
            }
          >
            <span className="text-2xl mb-1">🛍️</span>
            <span className="text-xs font-medium">Shop</span>
          </NavLink>

          <NavLink
            to="/pet"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center px-6 rounded-lg transition-all ${
                isActive
                  ? "bg-white/30 text-white scale-110"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`
            }
          >
            <span className="text-2xl mb-1">🐾</span>
            <span className="text-xs font-medium">Pet</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;