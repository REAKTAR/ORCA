import { Bell, UserRound, Wifi } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header({ onNavigate }) {
  const { t } = useLanguage();

  return (
    <header className="header premium-header">
      <div className="header-logo">
        <div className="header-logo-icon">◒</div>
        <div>
          <strong>ORCA</strong>
          <div className="location-row">
            <span>◉</span>
            <span>{t("locationUpdated")}</span>
          </div>
        </div>
      </div>
      <div className="header-context">
        <span className="header-online">
          <Wifi size={14} /> {t("online")}
        </span>
        <LanguageSwitcher />
        <button
          className="icon-btn header-action"
          onClick={() => onNavigate("alerts")}
          aria-label={t("alerts")}
        >
          <Bell size={18} />
          <i />
        </button>
        <button
          className="icon-btn header-action"
          onClick={() => onNavigate("profile")}
          aria-label={t("profile")}
        >
          <UserRound size={18} />
        </button>
      </div>
    </header>
  );
}
