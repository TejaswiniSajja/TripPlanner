const OpenAI = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Generate a trip itinerary using OpenAI.
 * Falls back to a template-based itinerary if the API key is missing or the call fails.
 */
async function generateItinerary({ destination, days, budget, travelStyle }) {
  const prompt = `You are a world-class travel planner. Create a detailed ${days}-day travel itinerary for ${destination}.

Budget level: ${budget}
Travel style: ${travelStyle}

Return ONLY valid JSON (no markdown fences) with this exact structure:
{
  "itinerary": [
    {
      "day": 1,
      "title": "Day 1 - Arrival & Exploration",
      "activities": [
        {
          "time": "09:00 AM",
          "activity": "Activity name",
          "location": "Specific place",
          "estimatedCost": "$XX",
          "description": "Brief description"
        }
      ],
      "meals": {
        "breakfast": "Restaurant/place suggestion",
        "lunch": "Restaurant/place suggestion",
        "dinner": "Restaurant/place suggestion"
      },
      "tips": ["Useful tip for the day"]
    }
  ],
  "totalEstimatedCost": "$XXX - $XXX",
  "bestTimeToVisit": "Month range",
  "generalTips": ["General travel tip"],
  "hotelSuggestions": [
    {
      "name": "Hotel name",
      "priceRange": "$XX - $XX per night",
      "rating": "4.5/5",
      "location": "Area in city"
    }
  ],
  "weatherInfo": "Brief weather summary for the destination"
}

Include 4-6 activities per day. Adjust cost estimates based on the ${budget} budget level. Make it realistic and practical.`;

  // If no API key, generate a fallback itinerary
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "sk-your-openai-api-key-here") {
    return generateFallbackItinerary({ destination, days, budget, travelStyle });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      max_tokens: 4000,
    });

    const content = response.choices[0].message.content.trim();
    // Strip markdown fences if present
    const jsonStr = content.replace(/^```json?\n?/, "").replace(/\n?```$/, "");
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("OpenAI API error, using fallback:", error.message);
    return generateFallbackItinerary({ destination, days, budget, travelStyle });
  }
}

/**
 * Template-based fallback when OpenAI is unavailable.
 */
function generateFallbackItinerary({ destination, days, budget, travelStyle }) {
  const costMap = { low: ["$10", "$30", "$50-$150"], medium: ["$25", "$70", "$150-$400"], high: ["$50", "$150", "$400-$1000"] };
  const costs = costMap[budget] || costMap.medium;

  const hotelMap = {
    low:   [{ name: `${destination} Backpackers Hostel`, priceRange: "$15 - $40/night", rating: "4.0/5", location: "City Center" }],
    medium:[{ name: `${destination} Comfort Inn`, priceRange: "$60 - $120/night", rating: "4.3/5", location: "Downtown" }],
    high:  [{ name: `${destination} Grand Resort & Spa`, priceRange: "$200 - $500/night", rating: "4.8/5", location: "Premium District" }],
  };

  const styleActivities = {
    solo:   ["Visit local museum", "Walking food tour", "Explore hidden alleys", "Café hopping", "Sunset viewpoint"],
    couple: ["Romantic dinner cruise", "Spa day", "Wine tasting tour", "Couples cooking class", "Scenic walk"],
    family: ["Theme park visit", "Zoo & aquarium", "Family cooking class", "Boat ride", "Interactive museum"],
    friends:["Pub crawl", "Adventure sports", "Group hiking", "Beach party", "Night market tour"],
  };

  const activities = styleActivities[travelStyle] || styleActivities.solo;

  const itinerary = [];
  for (let d = 1; d <= days; d++) {
    const dayActivities = [];
    const times = ["09:00 AM", "11:00 AM", "01:00 PM", "03:30 PM", "06:00 PM"];
    for (let a = 0; a < 5; a++) {
      dayActivities.push({
        time: times[a],
        activity: activities[(d + a) % activities.length],
        location: `${destination} Area ${a + 1}`,
        estimatedCost: costs[0],
        description: `Enjoy ${activities[(d + a) % activities.length].toLowerCase()} in a scenic part of ${destination}.`,
      });
    }
    itinerary.push({
      day: d,
      title: d === 1 ? `Day ${d} - Arrival & First Impressions` : d === days ? `Day ${d} - Final Day & Departure` : `Day ${d} - Exploring ${destination}`,
      activities: dayActivities,
      meals: { breakfast: "Local café near hotel", lunch: `Popular ${destination} eatery`, dinner: `Authentic ${destination} restaurant` },
      tips: [`Carry water and sunscreen`, `Use public transport to save money`, `Try the local street food`],
    });
  }

  return {
    itinerary,
    totalEstimatedCost: costs[2],
    bestTimeToVisit: "October - March",
    generalTips: [
      `Learn a few local phrases before visiting ${destination}`,
      "Book accommodations in advance for better rates",
      "Always carry a copy of your travel documents",
      "Try local cuisine at small family-owned restaurants",
    ],
    hotelSuggestions: hotelMap[budget] || hotelMap.medium,
    weatherInfo: `${destination} generally has pleasant weather. Check forecasts close to your travel dates for accurate info.`,
  };
}

module.exports = { generateItinerary };
