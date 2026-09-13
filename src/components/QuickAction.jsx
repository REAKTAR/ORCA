export default function QuickAction({
  icon,
  title,
  description,
  onClick,
}) {
  return (
    <button className="quick-card" onClick={onClick}>
      <div className="quick-icon">{icon}</div>

      <h3>{title}</h3>

      <p>{description}</p>
    </button>
  );
}