import { Activity, Bell, CircleUserRound, Home, Map, MessageCircle, Radio, ShieldCheck } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

const navItems = [
  ["home", "overview", Home],
  ["chat", "askOrca", MessageCircle],
  ["map", "marineMap", Map],
  ["pfz", "fishingZones", Radio],
  ["alerts", "alerts", Bell],
  ["profile", "profile", CircleUserRound],
];

export default function CommandCenterLayout({ currentPage, onNavigate, children }) {
  const { language, t } = useLanguage();

  return (
    <div className="command-center-shell">
      <aside className="command-sidebar" aria-label="ORCA navigation">
        <div className="command-brand">
          <span className="command-brand-mark">◒</span>
          <span>
            <strong>ORCA</strong>
            <small>Marine intelligence</small>
          </span>
        </div>

        <div className="sidebar-section-label">{t("workspace")}</div>
        <nav className="command-nav">
          {navItems.map(([id, label, Icon]) => (
            <button
              key={id}
              className={`command-nav-item ${currentPage === id ? "active" : ""}`}
              onClick={() => onNavigate(id)}
              aria-current={currentPage === id ? "page" : undefined}
            >
              <Icon size={18} strokeWidth={currentPage === id ? 2.5 : 2} />
              <span>{t(label)}</span>
              {id === "alerts" && <i className="sidebar-alert-dot" />}
            </button>
          ))}
        </nav>

        <div className="sidebar-spacer" />
        <div className="sidebar-status-card">
          <span className="status-pulse" />
          <div>
            <strong>Systems online</strong>
            <small>Live data · {language.toUpperCase()}</small>
          </div>
        </div>
        <div className="sidebar-footer">
          <ShieldCheck size={15} /> <span>Demo environment</span>
        </div>
      </aside>

      <section className="command-main-area">{children}</section>

      <aside className="intelligence-panel" aria-label="Marine intelligence summary">
        <div className="intelligence-panel-header">
          <div>
            <span className="eyebrow-label">LIVE CONTEXT</span>
            <h2>Mission brief</h2>
          </div>
          <span className="live-pill"><i /> Live</span>
        </div>

        <div className="brief-location">
          <span className="brief-location-icon"><Map size={17} /></span>
          <div>
            <strong>Digha Coast</strong>
            <small>West Bengal · 21.63°N, 87.51°E</small>
          </div>
        </div>

        <div className="brief-alert-card">
          <div className="brief-alert-top"><Bell size={15} /><span>Active advisory</span></div>
          <strong>High wave watch</strong>
          <p>Moderate-to-high waves expected tomorrow morning. Review before departure.</p>
          <button onClick={() => onNavigate("alerts")}>Open alerts <span>→</span></button>
        </div>

        <div className="panel-section-heading">
          <span className="eyebrow-label">AGENT ACTIVITY</span>
          <Activity size={16} />
        </div>
        <div className="agent-list">
          <div className="agent-row"><span className="agent-dot done" /><span><strong>Retrieval Agent</strong><small>Marine data synced 2m ago</small></span><b>Ready</b></div>
          <div className="agent-row"><span className="agent-dot done" /><span><strong>Trend Agent</strong><small>7-day SST trend calculated</small></span><b>Ready</b></div>
          <div className="agent-row"><span className="agent-dot watching" /><span><strong>Alert Agent</strong><small>Monitoring official bulletins</small></span><b>Watching</b></div>
        </div>

        <div className="offline-preview">
          <div><strong>Offline cache</strong><span className="cache-ready">Ready</span></div>
          <p>3 zones cached for your next trip.</p>
          <div className="cache-bar"><span /></div>
        </div>
      </aside>
    </div>
  );
}
