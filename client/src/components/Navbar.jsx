// client/src/components/Navbar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-red-600 shadow-[0_6px_0_#991b1b] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Navigation Links */}
          <div className="flex justify-around items-center flex-1">
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

          {/* User Info & Logout */}
          <div className="flex items-center space-x-3 ml-4">
            <span className="text-white/90 text-sm font-medium hidden sm:block">
              {user?.username}
            </span>
            <button
              onClick={handleLogout}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;