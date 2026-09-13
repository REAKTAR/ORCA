import { ShieldAlert } from "lucide-react";

export default function RiskCard({ onDetails }) {
  return (
    <div className="risk-card risk-moderate">
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <ShieldAlert size={22} />

        <strong>Marine Safety</strong>
      </div>

      <div className="risk-title">
        🟡 Moderate Risk
      </div>

      <p style={{ fontSize: "13px" }}>
        Wind and wave conditions require caution.
      </p>

      <button
        className="secondary-btn"
        style={{ marginTop: "14px" }}
        onClick={onDetails}
      >
        View Details
      </button>
    </div>
  );
}