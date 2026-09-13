import { useLanguage } from "../i18n/LanguageContext";
import {
  ArrowLeft,
  CheckCircle2,
  Compass,
  Map,
  Navigation,
  Waves,
} from "lucide-react";
import { marineData } from "../data/mockData";

export default function PFZ({ onNavigate }) {
  const { t } = useLanguage();
  const { pfz } = marineData;
  const metrics = [
    ["Distance", `${pfz.distance} km`, Navigation],
    ["Direction", pfz.direction, Compass],
    ["Sea temperature", `${pfz.temperature}°C`, Waves],
    ["Chlorophyll", pfz.chlorophyll, CheckCircle2],
  ];

  return (
    <div className="screen pfz-page">
      <div className="page-header">
        <button
          className="back-btn"
          onClick={() => onNavigate("home")}
          aria-label="Back to overview"
        >
          <ArrowLeft size={19} />
        </button>
        <div>
          <span className="eyebrow-label">{t("decisionSupport")}</span>
          <h1>{t("fishingZones")}</h1>
        </div>
      </div>
      <section className="pfz-hero">
        <div className="pfz-hero-top">
          <div>
            <span className="eyebrow-label">{t("topMatch")}</span>
            <h2>{t("potentialFishingZone")}</h2>
            <p>{t("detectedZone")}</p>
          </div>
          <div className="pfz-score">
            <strong>86</strong>
            <small>match</small>
          </div>
        </div>
        <div className="pfz-signal">
          <CheckCircle2 size={17} />
          <strong>{t("favourableConditions")}</strong>
          <span>{t("stableMarineSignals")}</span>
        </div>
      </section>
      <div className="pfz-metric-grid">
        {metrics.map(([label, value, Icon]) => (
          <article className="pfz-metric" key={label}>
            <div>
              <Icon size={17} />
            </div>
            <small>{label}</small>
            <strong>{value}</strong>
          </article>
        ))}
      </div>
      <section className="pfz-advice">
        <span className="eyebrow-label">{t("orcasGuidance")}</span>
        <h3>{t("zoneWorthConsidering")}</h3>
        <p>
          Conditions are favourable based on available SST, chlorophyll and wave
          data. Continue to monitor official advisories before departure.
        </p>
        <div className="pfz-disclosure">
          Data freshness: 2 hours · Confidence: High
        </div>
      </section>
      <div className="pfz-actions">
        <button className="primary-btn" onClick={() => onNavigate("map")}>
          <Map size={17} /> {t("viewOnMap")}
        </button>
        <button className="secondary-btn" onClick={() => onNavigate("chat")}>
          {t("askAboutZone")}
        </button>
      </div>
    </div>
  );
}
