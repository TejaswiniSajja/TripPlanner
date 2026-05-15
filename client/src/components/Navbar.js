import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiMap, FiLogOut, FiUser, FiPlus } from "react-icons/fi";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <FiMap className="w-6 h-6 text-glow-cyan group-hover:text-glow-purple transition-colors" />
            <span className="text-xl font-bold gradient-text">TripAI</span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-sm text-dark-300 hover:text-white transition px-3 py-2"
                >
                  My Trips
                </Link>
                <Link
                  to="/create"
                  className="flex items-center gap-1.5 text-sm bg-accent-600 hover:bg-accent-500 text-white px-4 py-2 rounded-lg transition"
                >
                  <FiPlus className="w-4 h-4" /> New Trip
                </Link>
                <div className="flex items-center gap-2 ml-2 pl-4 border-l border-white/10">
                  <FiUser className="w-4 h-4 text-dark-400" />
                  <span className="text-sm text-dark-300 hidden sm:inline">
                    {user.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-dark-400 hover:text-glow-pink transition p-1"
                    title="Logout"
                  >
                    <FiLogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm text-dark-300 hover:text-white transition px-3 py-2"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-sm bg-accent-600 hover:bg-accent-500 text-white px-4 py-2 rounded-lg transition"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
