import { useLanguage } from "../i18n/LanguageContext";
import {
  AlertTriangle,
  ArrowLeft,
  Bell,
  CheckCircle2,
  ChevronRight,
  Clock3,
} from "lucide-react";
import { marineData } from "../data/mockData";

const alertMeta = {
  HIGH: { className: "alert-critical", label: "Critical", icon: AlertTriangle },
  MODERATE: { className: "alert-watch", label: "Watch", icon: Bell },
  LOW: { className: "alert-info", label: "Information", icon: CheckCircle2 },
};

export default function Alerts({ onNavigate }) {
  const { t } = useLanguage();
  return (
    <div className="screen alerts-page">
      <div className="page-header">
        <button
          className="back-btn"
          onClick={() => onNavigate("home")}
          aria-label="Back to overview"
        >
          <ArrowLeft size={19} />
        </button>
        <div>
          <span className="eyebrow-label">{t("safetyNetwork")}</span>
          <h1>{t("marineAlerts")}</h1>
        </div>
      </div>
      <section className="alerts-summary">
        <div className="alerts-summary-icon">
          <Bell size={20} />
        </div>
        <div>
          <strong>{marineData.alerts.length} {t("activeAdvisories")}</strong>
          <p>{t("nearbyZonesForAlerts")}</p>
        </div>
        <span className="alerts-updated">
          <Clock3 size={13} /> Updated 12 min ago
        </span>
      </section>
      <section className="alerts-severity-overview">
        <div><strong>1</strong><span>Critical</span></div>
        <div><strong>1</strong><span>Watch</span></div>
        <div><strong>1</strong><span>Information</span></div>
      </section>
      <div className="alerts-filter-row">
        <span>{t("allAlerts")}</span>
        <button>
          {t("latestFirst")} <ChevronRight size={14} />
        </button>
      </div>
      <div className="alerts-list">
        {marineData.alerts.map((alert) => {
          const meta = alertMeta[alert.level] || alertMeta.LOW;
          const Icon = meta.icon;
          return (
            <article
              className={`alert-card ${meta.className}`}
              key={alert.title}
            >
              <div className="alert-card-icon">
                <Icon size={19} />
              </div>
              <div className="alert-card-content">
                <div className="alert-card-top">
                  <span>{meta.label}</span>
                  <small>{alert.time}</small>
                </div>
                <h2>{alert.title}</h2>
                <p>{alert.description}</p>
                <button className="alert-details">
                  {t("viewAdvisoryDetails")} <ChevronRight size={14} />
                </button>
              </div>
            </article>
          );
        })}
      </div>
      <p className="source-note">
        Alert data is consolidated from official marine and weather sources.
        Always follow the latest local authority instruction.
      </p>
    </div>
  );
}
