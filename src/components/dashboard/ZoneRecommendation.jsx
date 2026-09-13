import { ArrowUpRight, MapPin } from "lucide-react";

export default function ZoneRecommendation({ zone, onOpen }) {
  return (
    <article className="zone-recommendation">
      <div className="zone-recommendation-heading">
        <div>
          <span className="eyebrow-label">TOP RECOMMENDATION</span>
          <h3>{zone.name}</h3>
          <p>
            <MapPin size={13} /> {zone.distance} km · {zone.direction}
          </p>
        </div>
        <span className="zone-score">
          {zone.score}%<small>match</small>
        </span>
      </div>
      <div className="zone-metrics">
        <span>
          <small>SST</small>
          <strong>{zone.sst}°C</strong>
        </span>
        <span>
          <small>Chlorophyll</small>
          <strong>{zone.chlorophyll}</strong>
        </span>
        <span>
          <small>Trend</small>
          <strong>{zone.trend}</strong>
        </span>
      </div>
      <button className="zone-open-button" onClick={onOpen}>
        Open zone details <ArrowUpRight size={16} />
      </button>
    </article>
  );
}
