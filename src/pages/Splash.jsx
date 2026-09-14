import { useEffect } from "react";

export default function Splash({ onNext }) {
  useEffect(() => {
    const timer = setTimeout(onNext, 1400);

    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <div className="center-screen setup-page-enter">
      <img className="splash-logo-image" src="/orca-logo-transparent.png" alt="ORCA marine intelligence logo" />

      <h1>ORCA</h1>

      <p className="muted" style={{ marginTop: "8px" }}>
        Marine Intelligence
        <br />
        for Everyone
      </p>

      <div style={{ marginTop: "35px" }}>
        <small className="muted">Preparing your marine workspace...</small>
      </div>
    </div>
  );
}
