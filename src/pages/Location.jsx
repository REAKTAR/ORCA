import { CheckCircle2, MapPin, Navigation } from "lucide-react";

export default function Location({ onNext }) {
  return (
    <div className="setup-screen setup-page-enter">
      <div className="setup-content location-setup">
        <div className="setup-brand">
          <img className="setup-brand-logo" src="/orca-logo-transparent.png" alt="ORCA" />
          <span>ORCA</span>
        </div>
        <div className="location-illustration">
          <MapPin size={38} />
        </div>
        <span className="eyebrow-label">STEP 3 OF 3</span>
        <h1>Know your surroundings</h1>
        <p className="setup-description">
          ORCA uses your approximate location to show nearby fishing zones,
          alerts and marine conditions.
        </p>
        <div className="location-benefits">
          <div>
            <CheckCircle2 size={16} />
            <span>Find relevant PFZ zones nearby</span>
          </div>
          <div>
            <CheckCircle2 size={16} />
            <span>Receive location-specific safety alerts</span>
          </div>
          <div>
            <CheckCircle2 size={16} />
            <span>Your location stays on your device</span>
          </div>
        </div>
        <button className="primary-btn setup-continue" onClick={onNext}>
          <Navigation size={17} /> Use my current location
        </button>
        <button className="secondary-btn setup-skip" onClick={onNext}>
          Continue without location
        </button>
      </div>
    </div>
  );
}
