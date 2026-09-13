import { useEffect, useState } from "react";
import { Bell, ChevronRight, MapPin, Mic, Wifi } from "lucide-react";
import Header from "../components/Header";
import { useLanguage } from "../i18n/LanguageContext";

const metricKeys = [
  ["seaSafety", "Moderate", "safetyScore", "amber"],
  ["waveHeight", "1.8 m", "neDirection", "blue"],
  ["seaTemperature", "28.6°C", "sstTrend", "teal"],
  ["windSpeed", "24 km/h", "currentReading", "green"],
];

export default function Home({ onNavigate, userName = "Kartikey" }) {
  const { t } = useLanguage();
  const [apiData, setApiData] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/marine-data")
      .then((response) => response.json())
      .then((result) => setApiData(result.data || result))
      .catch(() => setApiData(null));
  }, []);

  const liveRisk = apiData?.risk_level || "Moderate";
  const liveWave = apiData?.wave_height || "1.8";
  const liveWind = apiData?.wind_speed || "24";
  const liveTemp = apiData?.temperature || "28.6";

  return (
    <>
      <Header onNavigate={onNavigate} />
      <main className="screen dashboard-home clean-dashboard">
        <section className="clean-dashboard-heading">
          <div>
            <span className="eyebrow-label">{t("marineIntelligence")}</span>
            <h1>{t("namaste")} {userName}</h1>
            <p><MapPin size={14} /> {t("locationUpdated")}</p>
          </div>
          <span className="dashboard-live-status"><Wifi size={14} /> {t("online")}</span>
        </section>

        <button className="clean-alert-banner" onClick={() => onNavigate("alerts")}>
          <span className="clean-alert-icon"><Bell size={17} /></span>
          <span><strong>{t("activeAdvisory")}</strong><small>{t("highWave")}</small></span>
          <ChevronRight size={18} />
        </button>

        <section className="clean-overview-grid">
          <article className="recommendation-panel">
            <div className="panel-kicker">{t("orcasRecommends")}</div>
            <div className="recommendation-title-row">
              <h2>{t("zoneLooksFavourable")}</h2>
              <strong>86%</strong>
            </div>
            <p>{t("zoneRecommendationText")}</p>
            <div className="recommendation-footer">
              <span>{t("zoneDistance")}</span>
              <button onClick={() => onNavigate("pfz")}>{t("openZoneReport")} <ChevronRight size={15} /></button>
            </div>
          </article>

          <article className="voice-panel" onClick={() => onNavigate("chat")}>
            <div className="voice-panel-icon"><Mic size={22} /></div>
            <div><span className="panel-kicker">{t("voiceAssistant")}</span><h3>{t("askAnything")}</h3><p>{t("voiceDashboardText")}</p></div>
            <ChevronRight size={18} />
          </article>
        </section>

        <section className="clean-metrics-grid">
          {metricKeys.map(([labelKey, fallback, detailKey, tone]) => {
            const displayValue = labelKey === "seaSafety" ? liveRisk : labelKey === "waveHeight" ? `${liveWave} m` : labelKey === "windSpeed" ? `${liveWind} km/h` : `${liveTemp}°C`;
            return <article className={`clean-metric-card ${tone}`} key={labelKey}><small>{t(labelKey)}</small><strong>{displayValue || fallback}</strong><span>{t(detailKey)}</span></article>;
          })}
        </section>

        <section className="clean-shortcuts">
          <div className="clean-section-heading"><div><span className="eyebrow-label">{t("shortcuts")}</span><h3>{t("whatNeed")}</h3></div></div>
          <div className="clean-shortcut-grid">
            <button onClick={() => onNavigate("map")}><span>◉</span><b>{t("exploreMarineMap")}</b><small>{t("zonesAndHazards")}</small></button>
            <button onClick={() => onNavigate("pfz")}><span>◒</span><b>{t("fishingZones")}</b><small>{t("pfzRecommendations")}</small></button>
            <button onClick={() => onNavigate("safety")}><span>≋</span><b>{t("seaSafety")}</b><small>{t("wavesAndWind")}</small></button>
            <button onClick={() => onNavigate("alerts")}><span>!</span><b>{t("alerts")}</b><small>{t("officialAdvisories")}</small></button>
          </div>
        </section>
      </main>
    </>
  );
}
