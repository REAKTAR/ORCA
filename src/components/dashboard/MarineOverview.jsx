import StatusCard from "./StatusCard";
import ZoneRecommendation from "./ZoneRecommendation";
import MarineTrend from "./MarineTrend";

const zone = {
  name: "Digha Shelf · Zone A",
  distance: "12.4",
  direction: "North-East",
  score: 86,
  sst: "28.6",
  chlorophyll: "High",
  trend: "Favourable",
};
const trend = [
  { day: "6 Sep", value: 27.2 },
  { day: "7", value: 27.5 },
  { day: "8", value: 27.7 },
  { day: "9", value: 28.0 },
  { day: "10", value: 28.1 },
  { day: "11", value: 28.4 },
  { day: "Today", value: 28.6 },
];

export default function MarineOverview({ onNavigate }) {
  return (
    <>
      <div className="dashboard-status-grid">
        <StatusCard
          icon="◉"
          label="Sea safety"
          value="Moderate"
          detail="62 / 100 · Monitor conditions"
          tone="amber"
        />
        <StatusCard
          icon="≋"
          label="Wave height"
          value="1.8 m"
          detail="NE direction · 24 km/h wind"
          tone="blue"
        />
        <StatusCard
          icon="◌"
          label="Sea temperature"
          value="28.6°C"
          detail="+0.4°C across 4 readings"
          tone="teal"
        />
        <StatusCard
          icon="◒"
          label="Data freshness"
          value="2h ago"
          detail="All primary sources online"
          tone="green"
        />
      </div>
      <div className="dashboard-content-grid">
        <ZoneRecommendation zone={zone} onOpen={() => onNavigate("pfz")} />
        <MarineTrend points={trend} />
      </div>
    </>
  );
}
