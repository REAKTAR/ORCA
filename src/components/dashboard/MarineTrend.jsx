export default function MarineTrend({ points }) {
  const max = Math.max(...points.map((point) => point.value));
  const min = Math.min(...points.map((point) => point.value));
  const range = max - min || 1;
  const path = points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * 100;
      const y = 82 - ((point.value - min) / range) * 58;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <article className="trend-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow-label">SEVEN-DAY SIGNAL</span>
          <h3>SST movement</h3>
        </div>
        <span className="trend-badge">↗ Rising</span>
      </div>
      <div className="trend-chart">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          role="img"
          aria-label="Seven day sea surface temperature trend"
        >
          <defs>
            <linearGradient id="trendFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#18a999" stopOpacity=".22" />
              <stop offset="100%" stopColor="#18a999" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points={`0,100 ${path} 100,100`} fill="url(#trendFill)" />
          <polyline
            points={path}
            fill="none"
            stroke="#18a999"
            strokeWidth="2.2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
      <div className="trend-labels">
        {points.map((point) => (
          <span key={point.day}>{point.day}</span>
        ))}
      </div>
      <p className="trend-note">
        The temperature has moved up for four consecutive readings. ORCA will
        factor this into the recommendation.
      </p>
    </article>
  );
}
