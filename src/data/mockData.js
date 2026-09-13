export const marineData = {
  location: "Digha Coast",
  coordinates: [21.627, 87.51],

  weather: {
    temperature: 28.4,
    wind: 24,
    rain: 40,
    condition: "Partly Cloudy",
  },

  ocean: {
    waveHeight: 1.8,
    waveDirection: "NE",
    seaTemperature: 28.6,
    chlorophyll: "High",
  },

  safety: {
    level: "Moderate",
    score: 62,
    recommendation:
      "Conditions are moderate. Stronger winds and moderate waves are expected. Check the latest official marine advisory before departure.",
  },

  pfz: {
    distance: 12.4,
    direction: "North-East",
    temperature: 28.6,
    chlorophyll: "High",
    condition: "Favourable",
  },

  trends: {
    sst: [
      { day: "6 Sep", value: 27.2 },
      { day: "7 Sep", value: 27.5 },
      { day: "8 Sep", value: 27.7 },
      { day: "9 Sep", value: 28.0 },
      { day: "10 Sep", value: 28.1 },
      { day: "11 Sep", value: 28.4 },
      { day: "Today", value: 28.6 },
    ],
    chlorophyll: [0.42, 0.46, 0.51, 0.55, 0.58, 0.61, 0.64],
    summary: "SST has risen gradually over the last 7 days.",
  },

  zones: [
    {
      id: "zone-a",
      name: "Digha Shelf · Zone A",
      position: [21.627, 87.51],
      score: 86,
      status: "Favourable",
      detail: "High chlorophyll · stable conditions",
      color: "#159a63",
      distance: "12.4 km",
      sst: "28.6°C",
      waves: "1.8 m",
    },
    {
      id: "zone-b",
      name: "Subarnarekha Edge · Zone B",
      position: [21.58, 87.72],
      score: 72,
      status: "Watch",
      detail: "Moderate waves · monitor wind",
      color: "#d88b14",
      distance: "18.2 km",
      sst: "28.1°C",
      waves: "2.2 m",
    },
    {
      id: "zone-c",
      name: "Chandipur Shelf · Zone C",
      position: [21.44, 87.2],
      score: 48,
      status: "Caution",
      detail: "Higher wave activity reported",
      color: "#d94747",
      distance: "26.7 km",
      sst: "29.0°C",
      waves: "3.1 m",
    },
  ],

  agents: [
    { name: "Intent Agent", status: "Ready", detail: "Language and intent detected" },
    { name: "Retrieval Agent", status: "Ready", detail: "Marine data synced 2m ago" },
    { name: "Trend Agent", status: "Ready", detail: "7-day SST trend calculated" },
    { name: "Reasoning Agent", status: "Ready", detail: "Evidence-based recommendation prepared" },
    { name: "Alert Agent", status: "Watching", detail: "Monitoring official bulletins" },
  ],

  alerts: [
    {
      level: "HIGH",
      title: "Cyclone Warning",
      description: "A marine weather warning is active in the coastal region.",
      time: "Updated recently",
    },
    {
      level: "MODERATE",
      title: "High Wave Conditions",
      description: "Moderately high waves may occur tomorrow morning.",
      time: "Tomorrow morning",
    },
    {
      level: "LOW",
      title: "Lightning Activity",
      description: "No major lightning activity currently indicated.",
      time: "Current",
    },
  ],

  offlineCache: {
    status: "Ready",
    zonesCached: 3,
    lastSynced: "2 hours ago",
  },
};

export default marineData;
