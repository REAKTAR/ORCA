import {
  ArrowLeft,
  CheckCircle2,
  Database,
  GitBranch,
  Satellite,
  ShieldCheck,
  Waves,
  Wind,
} from "lucide-react";

const agents = [
  [
    "Intent Agent",
    "Understood your request as a fishing-zone recommendation.",
    GitBranch,
  ],
  [
    "Retrieval Agent",
    "Fetched current SST, chlorophyll and PFZ observations.",
    Database,
  ],
  [
    "Trend Agent",
    "Compared the last seven days of sea-surface temperature.",
    Waves,
  ],
  [
    "Reasoning Agent",
    "Combined marine signals and flagged uncertainty.",
    ShieldCheck,
  ],
];

export default function Why({ onNavigate }) {
  return (
    <div className="screen why-page">
      <div className="page-header">
        <button
          className="back-btn"
          onClick={() => onNavigate("safety")}
          aria-label="Back to safety"
        >
          <ArrowLeft size={19} />
        </button>
        <div>
          <span className="eyebrow-label">EXPLAINABILITY</span>
          <h1>Why this answer?</h1>
        </div>
      </div>
      <section className="why-summary">
        <div className="why-summary-icon">
          <ShieldCheck size={21} />
        </div>
        <div>
          <strong>Transparent recommendation</strong>
          <p>ORCA shows the signals behind every safety decision.</p>
        </div>
        <span>82% confidence</span>
      </section>
      <div className="section-title">
        <div>
          <span className="eyebrow-label">REASONING TRACE</span>
          <h3>How ORCA reached this</h3>
        </div>
      </div>
      <div className="agent-trace">
        {agents.map(([title, description, Icon], index) => (
          <div className="agent-trace-item" key={title}>
            <div className="agent-trace-icon">
              <Icon size={17} />
            </div>
            <div>
              <strong>
                {index + 1}. {title}
              </strong>
              <p>{description}</p>
            </div>
            {index < agents.length - 1 && <span className="agent-trace-line" />}
          </div>
        ))}
      </div>
      <div className="section-title">
        <div>
          <span className="eyebrow-label">PRIMARY SIGNALS</span>
          <h3>Evidence used</h3>
        </div>
      </div>
      <div className="evidence-source-grid">
        <div>
          <Satellite size={17} />
          <span>Satellite observations</span>
          <small>Updated 2h ago</small>
        </div>
        <div>
          <Wind size={17} />
          <span>Weather information</span>
          <small>Updated 2h ago</small>
        </div>
        <div>
          <Waves size={17} />
          <span>Ocean conditions</span>
          <small>Updated 2h ago</small>
        </div>
      </div>
      <p className="why-disclaimer">
        <CheckCircle2 size={14} /> Every recommendation is explainable. ORCA never treats missing, stale or
        conflicting data as certain.
      </p>
    </div>
  );
}
