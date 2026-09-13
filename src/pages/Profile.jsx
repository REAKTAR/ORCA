import {
  Bell,
  ChevronRight,
  Globe2,
  MapPin,
  Mic2,
  Settings2,
  UserRound,
  Waves,
} from "lucide-react";

const preferences = [
  { icon: Globe2, label: "Language", value: "Hindi · हिन्दी" },
  { icon: MapPin, label: "Home zone", value: "Digha Coast" },
  { icon: Mic2, label: "Voice responses", value: "Enabled" },
  { icon: Bell, label: "Safety alerts", value: "Enabled" },
];

export default function Profile({ onNavigate }) {
  return (
    <div className="screen profile-page">
      <div className="page-header">
        <button
          className="back-btn"
          onClick={() => onNavigate("home")}
          aria-label="Back to overview"
        >
          <ChevronRight size={19} style={{ transform: "rotate(180deg)" }} />
        </button>
        <div>
          <span className="eyebrow-label">YOUR ORCA</span>
          <h1>Profile & settings</h1>
        </div>
      </div>
      <section className="profile-hero">
        <div className="profile-avatar">
          <UserRound size={31} />
        </div>
        <div>
          <span className="eyebrow-label">ACTIVE PERSONA</span>
          <h2>Fisherman</h2>
          <p>Field intelligence mode</p>
        </div>
        <button className="icon-btn" aria-label="Edit profile">
          <Settings2 size={17} />
        </button>
      </section>
      <section className="mode-switch-card">
        <div className="mode-switch-icon">
          <Waves size={19} />
        </div>
        <div>
          <span className="eyebrow-label">EXPERIENCE MODE</span>
          <h3>Fisherman view</h3>
          <p>Simple, voice-first guidance for the field</p>
        </div>
        <button className="mode-toggle" aria-label="Toggle experience mode">
          <span />
        </button>
      </section>
      <div className="section-title">
        <div>
          <span className="eyebrow-label">PREFERENCES</span>
          <h3>Personalise your experience</h3>
        </div>
      </div>
      <div className="preferences-list">
        {preferences.map(({ icon: Icon, label, value }) => (
          <button className="preference-row" key={label}>
            <span className="preference-icon">
              <Icon size={17} />
            </span>
            <span className="preference-copy">
              <strong>{label}</strong>
              <small>{value}</small>
            </span>
            <ChevronRight size={16} />
          </button>
        ))}
      </div>
      <p className="profile-footer">
        ORCA v1.0 · Marine intelligence for safer decisions
      </p>
    </div>
  );
}
