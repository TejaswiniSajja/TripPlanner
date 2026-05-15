const express = require("express");
const auth = require("../middleware/auth");
const Trip = require("../models/Trip");
const { generateItinerary } = require("../services/aiService");

const router = express.Router();

// POST /api/trip  – create a new trip
router.post("/trip", auth, async (req, res) => {
  try {
    const { destination, days, budget, travelStyle } = req.body;

    if (!destination || !days || !budget || !travelStyle) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (days < 1 || days > 30) {
      return res.status(400).json({ message: "Days must be between 1 and 30" });
    }

    // Generate AI itinerary
    const aiResult = await generateItinerary({
      destination,
      days,
      budget,
      travelStyle,
    });

    const trip = await Trip.create({
      user: req.user._id,
      destination,
      days,
      budget,
      travelStyle,
      itinerary: aiResult.itinerary,
      totalEstimatedCost: aiResult.totalEstimatedCost,
      bestTimeToVisit: aiResult.bestTimeToVisit,
      generalTips: aiResult.generalTips,
      hotelSuggestions: aiResult.hotelSuggestions,
      weatherInfo: aiResult.weatherInfo,
    });

    res.status(201).json(trip);
  } catch (error) {
    console.error("Create trip error:", error);
    res.status(500).json({ message: "Failed to generate trip itinerary" });
  }
});

// GET /api/trips  – list user's trips
router.get("/trips", auth, async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select("-itinerary"); // light list without full itinerary
    res.json(trips);
  } catch (error) {
    console.error("Get trips error:", error);
    res.status(500).json({ message: "Failed to fetch trips" });
  }
});

// GET /api/trip/:id  – single trip with full itinerary
router.get("/trip/:id", auth, async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    res.json(trip);
  } catch (error) {
    console.error("Get trip error:", error);
    res.status(500).json({ message: "Failed to fetch trip" });
  }
});

// PUT /api/trip/:id  – update trip metadata (destination, days, etc.)
router.put("/trip/:id", auth, async (req, res) => {
  try {
    const { destination, days, budget, travelStyle } = req.body;
    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    // Regenerate itinerary with new params
    const params = {
      destination: destination || trip.destination,
      days: days || trip.days,
      budget: budget || trip.budget,
      travelStyle: travelStyle || trip.travelStyle,
    };

    const aiResult = await generateItinerary(params);

    Object.assign(trip, {
      ...params,
      itinerary: aiResult.itinerary,
      totalEstimatedCost: aiResult.totalEstimatedCost,
      bestTimeToVisit: aiResult.bestTimeToVisit,
      generalTips: aiResult.generalTips,
      hotelSuggestions: aiResult.hotelSuggestions,
      weatherInfo: aiResult.weatherInfo,
    });

    await trip.save();
    res.json(trip);
  } catch (error) {
    console.error("Update trip error:", error);
    res.status(500).json({ message: "Failed to update trip" });
  }
});

// DELETE /api/trip/:id
router.delete("/trip/:id", auth, async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    res.json({ message: "Trip deleted successfully" });
  } catch (error) {
    console.error("Delete trip error:", error);
    res.status(500).json({ message: "Failed to delete trip" });
  }
});

module.exports = router;
