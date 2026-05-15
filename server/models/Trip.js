const mongoose = require("mongoose");

const dayPlanSchema = new mongoose.Schema(
  {
    day: { type: Number, required: true },
    title: { type: String, required: true },
    activities: [
      {
        time: String,
        activity: String,
        location: String,
        estimatedCost: String,
        description: String,
      },
    ],
    meals: {
      breakfast: String,
      lunch: String,
      dinner: String,
    },
    tips: [String],
  },
  { _id: false }
);

const tripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    destination: {
      type: String,
      required: [true, "Destination is required"],
      trim: true,
    },
    days: {
      type: Number,
      required: [true, "Number of days is required"],
      min: 1,
      max: 30,
    },
    budget: {
      type: String,
      required: true,
      enum: ["low", "medium", "high"],
    },
    travelStyle: {
      type: String,
      required: true,
      enum: ["solo", "couple", "family", "friends"],
    },
    itinerary: [dayPlanSchema],
    totalEstimatedCost: String,
    bestTimeToVisit: String,
    generalTips: [String],
    hotelSuggestions: [
      {
        name: String,
        priceRange: String,
        rating: String,
        location: String,
      },
    ],
    weatherInfo: String,
  },
  { timestamps: true }
);

// Index for efficient querying
tripSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Trip", tripSchema);
