import React from "react";

export default function Loader({ text = "Generating your itinerary..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="flex gap-2 mb-6">
        <div className="w-4 h-4 rounded-full bg-glow-cyan loader-dot" />
        <div className="w-4 h-4 rounded-full bg-glow-purple loader-dot" />
        <div className="w-4 h-4 rounded-full bg-glow-pink loader-dot" />
      </div>
      <p className="text-dark-300 text-sm animate-pulse">{text}</p>
    </div>
  );
}
