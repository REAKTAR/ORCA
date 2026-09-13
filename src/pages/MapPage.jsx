import { useLanguage } from "../i18n/LanguageContext";
import { useState } from "react";
import { ArrowLeft, Layers3, MapPin, Navigation, Waves } from "lucide-react";
import { Circle, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

const zones = [
  {
    id: "zone-a",
    name: "Digha Shelf · Zone A",
    position: [21.627, 87.51],
    score: 86,
    status: "Favourable",
    detail: "High chlorophyll · stable conditions",
    color: "#159a63",
  },
  {
    id: "zone-b",
    name: "Subarnarekha Edge · Zone B",
    position: [21.58, 87.72],
    score: 72,
    status: "Watch",
    detail: "Moderate waves · monitor wind",
    color: "#d88b14",
  },
  {
    id: "zone-c",
    name: "Chandipur Shelf · Zone C",
    position: [21.44, 87.2],
    score: 48,
    status: "Caution",
    detail: "Higher wave activity reported",
    color: "#d94747",
  },
];

export default function MapPage({ onNavigate }) {
  const { t } = useLanguage();
  const [selectedZone, setSelectedZone] = useState(zones[0]);
  const [showPFZ, setShowPFZ] = useState(true);
  const [showHazard, setShowHazard] = useState(true);

  const center = [21.58, 87.5];

  return (
    <div className="map-explorer">
      <header className="map-explorer-header">
        <button
          className="back-btn"
          onClick={() => onNavigate("home")}
          aria-label="Back to overview"
        >
          <ArrowLeft size={19} />
        </button>
        <div>
          <span className="eyebrow-label">{t("spatialIntelligence")}</span>
          <h1>{t("marineExplorer")}</h1>
          <p>{t("exploreMarineConditions")}</p>
        </div>
        <button className="icon-btn" aria-label="Map layers">
          <Layers3 size={18} />
        </button>
      </header>

      <main className="map-explorer-content">
        <section className="map-toolbar">
          <div className="map-toolbar-title">
            <Navigation size={16} />
            <span>{t("dighaRegion")}</span>
          </div>
          <div className="map-layer-toggles">
            <label>
              <input
                type="checkbox"
                checked={showPFZ}
                onChange={() => setShowPFZ((value) => !value)}
              />
              {t("pfzZones")}
            </label>
            <label>
              <input
                type="checkbox"
                checked={showHazard}
                onChange={() => setShowHazard((value) => !value)}
              />
              {t("hazards")}
            </label>
          </div>
        </section>

        <section className="map-explorer-layout">
          <div className="map-visual-card">
            <MapContainer
              center={center}
              zoom={10}
              scrollWheelZoom
              className="explorer-leaflet-map"
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={center}>
                <Popup>
                  <strong>{t("selectedCoast")}</strong>
                  <br />
                  Digha Coast
                </Popup>
              </Marker>
              {showPFZ &&
                zones.map((zone) => (
                  <Circle
                    key={zone.id}
                    center={zone.position}
                    radius={1900}
                    pathOptions={{
                      color: zone.color,
                      fillColor: zone.color,
                      fillOpacity: selectedZone.id === zone.id ? 0.32 : 0.15,
                      weight: selectedZone.id === zone.id ? 3 : 1,
                    }}
                    eventHandlers={{ click: () => setSelectedZone(zone) }}
                  >
                    <Popup>
                      <strong>{zone.name}</strong>
                      <br />
                      {zone.status} · {zone.score}% match
                    </Popup>
                  </Circle>
                ))}
              {showHazard && (
                <Circle
                  center={[21.5, 87.83]}
                  radius={3200}
                  pathOptions={{
                    color: "#d94747",
                    fillColor: "#d94747",
                    fillOpacity: 0.12,
                    dashArray: "7 7",
                  }}
                >
                  <Popup>{t("highWaveWatchArea")}</Popup>
                </Circle>
              )}
            </MapContainer>
            <div className="map-overlay-badge">
              <span className="live-dot" /> {t("liveMapLayers")}
            </div>
            <div className="map-legend">
              <strong>Legend</strong>
              <span><i style={{ backgroundColor: "#159a63" }} /> Favourable</span>
              <span><i style={{ backgroundColor: "#d88b14" }} /> Watch</span>
              <span><i style={{ backgroundColor: "#d94747" }} /> Caution</span>
            </div>
          </div>

          <aside className="map-zone-panel">
            <div className="map-panel-heading">
              <div>
                <span className="eyebrow-label">{t("zoneIntelligence")}</span>
                <h2>{t("nearbyZones")}</h2>
              </div>
              <span className="map-zone-count">{t("threeFound")}</span>
            </div>
            <div className="zone-list">
              {zones.map((zone) => (
                <button
                  key={zone.id}
                  className={`zone-list-item ${selectedZone.id === zone.id ? "selected" : ""}`}
                  onClick={() => setSelectedZone(zone)}
                >
                  <span
                    className="zone-status-dot"
                    style={{ backgroundColor: zone.color }}
                  />
                  <span className="zone-list-copy">
                    <strong>{zone.name}</strong>
                    <small>{zone.detail}</small>
                  </span>
                  <b>{zone.score}%</b>
                </button>
              ))}
            </div>
            <div className="selected-zone-card">
              <div className="selected-zone-heading">
                <div>
                  <span className="eyebrow-label">{t("selectedZone")}</span>
                  <h3>{selectedZone.name}</h3>
                </div>
                <Waves size={21} />
              </div>
              <p>
                {selectedZone.detail}. ORCA recommends reviewing the current
                advisory before departure.
              </p>
              <div className="selected-zone-stats">
                <span>
                  <small>match</small>
                  <strong>{selectedZone.score}%</strong>
                </span>
                <span>
                  <small>sst</small>
                  <strong>28.6°C</strong>
                </span>
                <span>
                  <small>Waves</small>
                  <strong>1.8 m</strong>
                </span>
              </div>
              <div className="selected-zone-source">
                Sources: INCOIS · MOSDAC · ORCA trend agent
              </div>
              <button className="primary-btn" onClick={() => onNavigate("pfz")}>
                {t("viewZoneReport")}
              </button>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
