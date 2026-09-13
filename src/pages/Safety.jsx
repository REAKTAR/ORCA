import { useLanguage } from "../i18n/LanguageContext";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  CloudRain,
  Droplets,
  Thermometer,
  Waves,
  Wind,
} from "lucide-react";
import { marineData } from "../data/mockData";

export default function Safety({ onNavigate }) {
  const { t } = useLanguage();
  const { weather, ocean, safety } = marineData;
  const metrics = [
    {
      icon: Waves,
      label: "Wave height",
      value: `${ocean.waveHeight} m`,
      detail: "Moderate swell",
      tone: "amber",
    },
    {
      icon: Wind,
      label: "Wind speed",
      value: `${weather.wind} km/h`,
      detail: "NE direction",
      tone: "blue",
    },
    {
      icon: CloudRain,
      label: "Rain probability",
      value: `${weather.rain}%`,
      detail: "Partly cloudy",
      tone: "blue",
    },
    {
      icon: Thermometer,
      label: "Sea temperature",
      value: `${ocean.seaTemperature}°C`,
      detail: "Normal for zone",
      tone: "teal",
    },
  ];

  return (
    <div className="screen safety-page">
      <div className="page-header">
        <button
          className="back-btn"
          onClick={() => onNavigate("home")}
          aria-label="Back to overview"
        >
          <ArrowLeft size={19} />
        </button>
        <div>
          <span className="eyebrow-label">{t("departureCheck")}</span>
          <h1>{t("marineSafety")}</h1>
        </div>
      </div>
      <section className="safety-assessment">
        <div className="safety-assessment-top">
          <div>
            <span className="eyebrow-label">{t("orcaAssessment")}</span>
            <h2>
              <span className="safety-signal" />
              {safety.level} risk
            </h2>
          </div>
          <div className="safety-score">
            <strong>{safety.score}</strong>
            <span>/100</span>
          </div>
        </div>
        <div className="safety-meter">
          <span style={{ width: `${safety.score}%` }} />
        </div>
        <p>{safety.recommendation}</p>
        <div className="safety-disclosure">
          <CheckCircle2 size={15} /> Assessment based on current marine signals
          · 2h old
        </div>
      </section>
      <div className="section-title">
        <div>
          <span className="eyebrow-label">{t("currentConditionsTitle")}</span>
          <h3>{t("whatSeaDoing")}</h3>
        </div>
      </div>
      <div className="safety-metrics-grid">
        {metrics.map(({ icon: Icon, label, value, detail, tone }) => (
          <article
            className={`safety-metric safety-metric-${tone}`}
            key={label}
          >
            <div className="safety-metric-icon">
              <Icon size={18} />
            </div>
            <span>{label}</span>
            <strong>{value}</strong>
            <small>{detail}</small>
          </article>
        ))}
      </div>
      <button className="why-button" onClick={() => onNavigate("why")}>
        {t("whyRecommendation")} <ChevronRight size={17} />
      </button>
      <div className="offline-notice">
        <Droplets size={17} />
        <span>
          <strong>{t("dataStatusLive")}</strong>
          <small>Next scheduled update in approximately 4 hours.</small>
        </span>
      </div>
    </div>
  );
}
