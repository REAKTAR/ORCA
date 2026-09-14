import { Check, Globe2 } from "lucide-react";
import { useState } from "react";

const languages = [
  ["EN", "English", "English"],
  ["हि", "हिंदी", "Hindi"],
  ["বাংলা", "বাংলা", "Bengali"],
  ["தமிழ்", "தமிழ்", "Tamil"],
  ["తెలుగు", "తెలుగు", "Telugu"],
  ["ଓ", "ଓଡ଼ିଆ", "Odia"],
];

export default function Language({ onNext }) {
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const selectedLabel = languages.find(([,, value]) => value === selectedLanguage)?.[1] || selectedLanguage;
  return (
    <div className="setup-screen setup-page-enter">
      <div className="setup-content">
        <div className="setup-brand">
          <img className="setup-brand-logo" src="/orca-logo-transparent.png" alt="ORCA" />
          <span>ORCA</span>
        </div>
        <div className="setup-icon">
          <Globe2 size={25} />
        </div>
        <span className="eyebrow-label">STEP 2 OF 3</span>
        <h1>Choose your language</h1>
        <p className="setup-description">
          ORCA will respond in the language you understand best.
        </p>
        <div className="language-grid">
          {languages.map(([symbol, nativeName, value]) => (
            <button
              key={value}
              className={`language-option ${selectedLanguage === value ? "selected" : ""}`}
              onClick={() => setSelectedLanguage(value)}
            >
              <span className="language-symbol">{symbol}</span>
              <span>
                <strong>{nativeName}</strong>
                <small>{value}</small>
              </span>
              {selectedLanguage === value && <Check size={17} />}
            </button>
          ))}
        </div>
        <button
          className="primary-btn setup-continue"
          onClick={() => onNext(selectedLanguage)}
        >
          Continue with {selectedLabel}
        </button>
      </div>
    </div>
  );
}
