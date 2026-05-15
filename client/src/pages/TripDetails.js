import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTrip, deleteTrip } from "../services/api";
import { motion } from "framer-motion";
import {
  FiMapPin, FiCalendar, FiDollarSign, FiSun, FiInfo,
  FiClock, FiTrash2, FiArrowLeft, FiStar, FiCloudRain,
} from "react-icons/fi";

export default function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(0);

  useEffect(() => {
    getTrip(id)
      .then((res) => setTrip(res.data))
      .catch(() => navigate("/dashboard"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this trip permanently?")) return;
    await deleteTrip(id);
    navigate("/dashboard");
  };

  if (loading || !trip) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-glow-cyan border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const currentDay = trip.itinerary?.[activeDay];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-sm text-dark-400 hover:text-white transition"
          >
            <FiArrowLeft className="w-4 h-4" /> Back to trips
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 text-sm text-dark-500 hover:text-red-400 transition"
          >
            <FiTrash2 className="w-4 h-4" /> Delete
          </button>
        </div>

        {/* Trip header */}
        <div className="glass rounded-2xl p-8 mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-white flex items-center gap-3">
            <FiMapPin className="w-7 h-7 text-glow-cyan shrink-0" />
            {trip.destination}
          </h1>
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-dark-300">
            <span className="flex items-center gap-1.5">
              <FiCalendar className="w-4 h-4" /> {trip.days} days
            </span>
            <span className="flex items-center gap-1.5 capitalize">
              <FiDollarSign className="w-4 h-4" /> {trip.budget} budget
            </span>
            <span className="flex items-center gap-1.5 capitalize">
              <FiSun className="w-4 h-4" /> {trip.travelStyle} trip
            </span>
            {trip.totalEstimatedCost && (
              <span className="flex items-center gap-1.5">
                <FiDollarSign className="w-4 h-4 text-glow-pink" />
                Total: {trip.totalEstimatedCost}
              </span>
            )}
          </div>
        </div>

        {/* Info cards row */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {/* Weather */}
          {trip.weatherInfo && (
            <div className="glass rounded-xl p-5">
              <h3 className="text-sm font-medium text-dark-300 flex items-center gap-2 mb-2">
                <FiCloudRain className="w-4 h-4 text-glow-cyan" /> Weather
              </h3>
              <p className="text-sm text-dark-200">{trip.weatherInfo}</p>
            </div>
          )}
          {/* Best time */}
          {trip.bestTimeToVisit && (
            <div className="glass rounded-xl p-5">
              <h3 className="text-sm font-medium text-dark-300 flex items-center gap-2 mb-2">
                <FiCalendar className="w-4 h-4 text-glow-purple" /> Best Time
              </h3>
              <p className="text-sm text-dark-200">{trip.bestTimeToVisit}</p>
            </div>
          )}
          {/* Hotels */}
          {trip.hotelSuggestions?.length > 0 && (
            <div className="glass rounded-xl p-5">
              <h3 className="text-sm font-medium text-dark-300 flex items-center gap-2 mb-2">
                <FiStar className="w-4 h-4 text-yellow-400" /> Top Hotel
              </h3>
              <p className="text-sm text-white font-medium">{trip.hotelSuggestions[0].name}</p>
              <p className="text-xs text-dark-400">
                {trip.hotelSuggestions[0].priceRange} &middot; {trip.hotelSuggestions[0].rating}
              </p>
            </div>
          )}
        </div>

        {/* Day tabs */}
        {trip.itinerary?.length > 0 && (
          <>
            <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-thin">
              {trip.itinerary.map((day, i) => (
                <button
                  key={i}
                  onClick={() => setActiveDay(i)}
                  className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition ${
                    activeDay === i
                      ? "bg-accent-600 text-white"
                      : "glass text-dark-400 hover:text-white"
                  }`}
                >
                  Day {day.day}
                </button>
              ))}
            </div>

            {/* Active day content */}
            {currentDay && (
              <motion.div
                key={activeDay}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-bold text-white mb-6">
                  {currentDay.title}
                </h2>

                {/* Activities timeline */}
                <div className="space-y-4 mb-8">
                  {currentDay.activities?.map((act, i) => (
                    <div key={i} className="glass rounded-xl p-5 flex gap-4">
                      <div className="shrink-0 w-20 text-center">
                        <FiClock className="w-4 h-4 text-glow-cyan mx-auto mb-1" />
                        <span className="text-xs font-medium text-dark-300">
                          {act.time}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-white">
                          {act.activity}
                        </h4>
                        {act.location && (
                          <p className="text-xs text-dark-400 flex items-center gap-1 mt-1">
                            <FiMapPin className="w-3 h-3" /> {act.location}
                          </p>
                        )}
                        {act.description && (
                          <p className="text-xs text-dark-400 mt-1.5">{act.description}</p>
                        )}
                      </div>
                      {act.estimatedCost && (
                        <span className="shrink-0 text-xs font-medium text-glow-pink bg-glow-pink/10 px-2.5 py-1 rounded-full self-start">
                          {act.estimatedCost}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Meals */}
                {currentDay.meals && (
                  <div className="glass rounded-xl p-5 mb-6">
                    <h3 className="text-sm font-medium text-dark-200 mb-3">Meal Suggestions</h3>
                    <div className="grid sm:grid-cols-3 gap-3 text-sm">
                      {["breakfast", "lunch", "dinner"].map((meal) =>
                        currentDay.meals[meal] ? (
                          <div key={meal} className="bg-dark-950/50 rounded-lg p-3">
                            <span className="text-xs uppercase text-dark-500 tracking-wide">{meal}</span>
                            <p className="text-dark-200 mt-1">{currentDay.meals[meal]}</p>
                          </div>
                        ) : null
                      )}
                    </div>
                  </div>
                )}

                {/* Day tips */}
                {currentDay.tips?.length > 0 && (
                  <div className="glass rounded-xl p-5">
                    <h3 className="text-sm font-medium text-dark-200 mb-3 flex items-center gap-2">
                      <FiInfo className="w-4 h-4 text-yellow-400" /> Tips for the day
                    </h3>
                    <ul className="space-y-1.5">
                      {currentDay.tips.map((tip, i) => (
                        <li key={i} className="text-sm text-dark-400 flex gap-2">
                          <span className="text-yellow-400 shrink-0">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}
          </>
        )}

        {/* General tips */}
        {trip.generalTips?.length > 0 && (
          <div className="glass rounded-2xl p-6 mt-8">
            <h3 className="text-lg font-semibold text-white mb-4">General Travel Tips</h3>
            <ul className="space-y-2">
              {trip.generalTips.map((tip, i) => (
                <li key={i} className="text-sm text-dark-300 flex gap-2">
                  <span className="text-glow-cyan shrink-0">✓</span> {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* All hotel suggestions */}
        {trip.hotelSuggestions?.length > 1 && (
          <div className="glass rounded-2xl p-6 mt-6">
            <h3 className="text-lg font-semibold text-white mb-4">Hotel Suggestions</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {trip.hotelSuggestions.map((h, i) => (
                <div key={i} className="bg-dark-950/50 rounded-xl p-4">
                  <h4 className="text-sm font-medium text-white">{h.name}</h4>
                  <p className="text-xs text-dark-400 mt-1">{h.location}</p>
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <span className="text-glow-pink">{h.priceRange}</span>
                    <span className="text-yellow-400">{h.rating}</span>
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
