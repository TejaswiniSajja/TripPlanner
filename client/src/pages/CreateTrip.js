import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTrip } from "../services/api";
import Loader from "../components/Loader";
import { FiMapPin, FiCalendar, FiDollarSign, FiUsers } from "react-icons/fi";

const budgets = [
  { value: "low", label: "Budget", desc: "Hostels, street food, public transport", emoji: "🎒" },
  { value: "medium", label: "Moderate", desc: "Mid-range hotels, restaurants, taxis", emoji: "🏨" },
  { value: "high", label: "Luxury", desc: "5-star hotels, fine dining, private transfers", emoji: "✨" },
];

const styles = [
  { value: "solo", label: "Solo", emoji: "🧳" },
  { value: "couple", label: "Couple", emoji: "💕" },
  { value: "family", label: "Family", emoji: "👨‍👩‍👧‍👦" },
  { value: "friends", label: "Friends", emoji: "🎉" },
];

export default function CreateTrip() {
  const [form, setForm] = useState({
    destination: "",
    days: 3,
    budget: "medium",
    travelStyle: "solo",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.destination.trim()) return setError("Please enter a destination");
    setLoading(true);
    try {
      const { data } = await createTrip(form);
      navigate(`/trip/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create trip");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <Loader text={`Creating your ${form.days}-day itinerary for ${form.destination}...`} />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Plan a New Trip</h1>
        <p className="text-dark-400 mb-10">
          Fill in the details and our AI will generate a complete itinerary for you.
        </p>

        {error && (
          <div className="text-red-400 bg-red-400/10 text-sm rounded-lg p-3 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Destination */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-dark-200 mb-2">
              <FiMapPin className="w-4 h-4 text-glow-cyan" /> Destination
            </label>
            <input
              type="text"
              required
              value={form.destination}
              onChange={(e) => setForm({ ...form, destination: e.target.value })}
              className="w-full bg-dark-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-accent-500/50 transition"
              placeholder="e.g. Tokyo, Japan"
            />
          </div>

          {/* Days */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-dark-200 mb-2">
              <FiCalendar className="w-4 h-4 text-glow-purple" /> Number of Days
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="30"
                value={form.days}
                onChange={(e) => setForm({ ...form, days: parseInt(e.target.value) })}
                className="flex-1 accent-accent-500"
              />
              <span className="text-2xl font-bold text-white w-12 text-center">
                {form.days}
              </span>
            </div>
            <p className="text-xs text-dark-500 mt-1">1 – 30 days</p>
          </div>

          {/* Budget */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-dark-200 mb-3">
              <FiDollarSign className="w-4 h-4 text-glow-pink" /> Budget
            </label>
            <div className="grid grid-cols-3 gap-3">
              {budgets.map((b) => (
                <button
                  key={b.value}
                  type="button"
                  onClick={() => setForm({ ...form, budget: b.value })}
                  className={`glass rounded-xl p-4 text-left transition border ${
                    form.budget === b.value
                      ? "border-accent-500 bg-accent-500/10"
                      : "border-transparent hover:border-white/10"
                  }`}
                >
                  <span className="text-xl">{b.emoji}</span>
                  <p className="text-sm font-medium text-white mt-2">{b.label}</p>
                  <p className="text-xs text-dark-500 mt-1">{b.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Travel style */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-dark-200 mb-3">
              <FiUsers className="w-4 h-4 text-yellow-400" /> Travel Style
            </label>
            <div className="grid grid-cols-4 gap-3">
              {styles.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setForm({ ...form, travelStyle: s.value })}
                  className={`glass rounded-xl p-4 text-center transition border ${
                    form.travelStyle === s.value
                      ? "border-accent-500 bg-accent-500/10"
                      : "border-transparent hover:border-white/10"
                  }`}
                >
                  <span className="text-2xl">{s.emoji}</span>
                  <p className="text-xs font-medium text-white mt-2">{s.label}</p>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-glow-cyan via-accent-500 to-glow-purple text-white font-semibold py-3.5 rounded-xl text-lg hover:opacity-90 transition shadow-lg shadow-accent-500/25"
          >
            Generate Itinerary with AI
          </button>
        </form>
      </div>
    </div>
  );
}
