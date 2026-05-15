import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTrips, deleteTrip } from "../services/api";
import { FiPlus, FiMapPin, FiCalendar, FiTrash2, FiDollarSign, FiUsers } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const budgetBadge = {
  low: "bg-green-500/10 text-green-400",
  medium: "bg-yellow-500/10 text-yellow-400",
  high: "bg-red-500/10 text-red-400",
};

const styleBadge = {
  solo: "bg-cyan-500/10 text-cyan-400",
  couple: "bg-pink-500/10 text-pink-400",
  family: "bg-purple-500/10 text-purple-400",
  friends: "bg-orange-500/10 text-orange-400",
};

export default function Dashboard() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTrips()
      .then((res) => setTrips(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this trip?")) return;
    try {
      await deleteTrip(id);
      setTrips((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      alert("Failed to delete trip");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-glow-cyan border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white">My Trips</h1>
            <p className="text-dark-400 text-sm mt-1">
              {trips.length} trip{trips.length !== 1 ? "s" : ""} planned
            </p>
          </div>
          <Link
            to="/create"
            className="flex items-center gap-2 bg-accent-600 hover:bg-accent-500 text-white font-medium px-5 py-2.5 rounded-xl transition"
          >
            <FiPlus className="w-4 h-4" /> New Trip
          </Link>
        </div>

        {/* Empty state */}
        {trips.length === 0 && (
          <div className="glass rounded-2xl p-16 text-center">
            <FiMapPin className="w-12 h-12 text-dark-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              No trips yet
            </h2>
            <p className="text-dark-400 mb-6">
              Create your first AI-powered trip itinerary
            </p>
            <Link
              to="/create"
              className="inline-flex items-center gap-2 bg-accent-600 hover:bg-accent-500 text-white font-medium px-6 py-3 rounded-xl transition"
            >
              <FiPlus className="w-4 h-4" /> Plan a Trip
            </Link>
          </div>
        )}

        {/* Trip cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {trips.map((trip, i) => (
              <motion.div
                key={trip._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/trip/${trip._id}`}
                  className="block glass rounded-2xl p-6 hover:border-white/10 transition group relative"
                >
                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete(trip._id);
                    }}
                    className="absolute top-4 right-4 p-2 text-dark-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition opacity-0 group-hover:opacity-100"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>

                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <FiMapPin className="w-4 h-4 text-glow-cyan shrink-0" />
                    {trip.destination}
                  </h3>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-white/5 text-dark-300">
                      <FiCalendar className="w-3 h-3" />
                      {trip.days} days
                    </span>
                    <span className={`text-xs px-2.5 py-1 rounded-full capitalize ${budgetBadge[trip.budget]}`}>
                      <FiDollarSign className="w-3 h-3 inline" /> {trip.budget}
                    </span>
                    <span className={`text-xs px-2.5 py-1 rounded-full capitalize ${styleBadge[trip.travelStyle]}`}>
                      <FiUsers className="w-3 h-3 inline" /> {trip.travelStyle}
                    </span>
                  </div>

                  {trip.totalEstimatedCost && (
                    <p className="text-sm text-dark-400">
                      Est. cost: <span className="text-dark-200">{trip.totalEstimatedCost}</span>
                    </p>
                  )}

                  <p className="text-xs text-dark-600 mt-3">
                    {new Date(trip.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
