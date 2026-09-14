import { Anchor, Fish, FlaskConical, ShieldAlert } from "lucide-react";
import { useState } from "react";

const personas = [
  ["Fisherman", "Field guidance and safer decisions", Fish],
  ["Researcher", "Trends, layers and evidence", FlaskConical],
  ["Disaster Manager", "Alerts and coastal risk", ShieldAlert],
  ["Maritime Operator", "Route and ocean awareness", Anchor],
];

export default function Persona({ onNext }) {
  const [selected, setSelected] = useState("Fisherman");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  return (
    <div className="setup-screen setup-page-enter">
      <div className="setup-content persona-setup">
        <div className="setup-brand">
          <img className="setup-brand-logo" src="/orca-logo-transparent.png" alt="ORCA" />
          <span>ORCA</span>
        </div>
        <span className="eyebrow-label">STEP 1 OF 3</span>
        <h1>How will you use ORCA?</h1>
        <p className="setup-description">
          Choose the workspace that fits your mission. You can change this later.
        </p>
        <label className="setup-name-field">
          <span>Your name</span>
          <input
            value={name}
            onChange={(event) => { setName(event.target.value); setError(""); }}
            placeholder="Enter your name"
            maxLength={40}
          />
        </label>
        {error && <p className="auth-error">{error}</p>}
        <div className="persona-grid">
          {personas.map(([name, description, Icon]) => (
            <button
              key={name}
              className={`persona-card ${selected === name ? "selected" : ""}`}
              onClick={() => setSelected(name)}
            >
              <div className="persona-icon">
                <Icon size={23} />
              </div>
              <span>
                <strong>{name}</strong>
                <small>{description}</small>
              </span>
              {selected === name && <span className="persona-check">✓</span>}
            </button>
          ))}
        </div>
        <button
          className="primary-btn setup-continue"
          onClick={() => {
            if (!name.trim()) {
              setError("Please enter your name to continue.");
              return;
            }
            if (!selected) {
              setError("Please select how you will use ORCA.");
              return;
            }
            onNext({ persona: selected, name: name.trim() });
          }}
        >
          Continue as {selected}
        </button>
      </div>
    </div>
  );
}
