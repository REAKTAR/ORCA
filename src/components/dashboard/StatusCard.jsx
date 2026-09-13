export default function StatusCard({
  icon,
  label,
  value,
  detail,
  tone = "default",
}) {
  return (
    <article className={`dashboard-status-card status-${tone}`}>
      <div className="dashboard-status-icon">{icon}</div>
      <div>
        <span className="dashboard-status-label">{label}</span>
        <strong className="dashboard-status-value">{value}</strong>
        <small className="dashboard-status-detail">{detail}</small>
      </div>
    </article>
  );
}
