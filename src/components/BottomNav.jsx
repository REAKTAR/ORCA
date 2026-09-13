import { Bell, Home, Map, MessageCircle, UserRound } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

export default function BottomNav({ currentPage, onNavigate }) {
  const { t } = useLanguage();
  const items = [
    ["home", t("overview"), Home],
    ["chat", t("askOrca"), MessageCircle],
    ["map", t("explore"), Map],
    ["alerts", t("alerts"), Bell],
    ["profile", t("profile"), UserRound],
  ];

  return (
    <nav className="bottom-nav" aria-label="Primary navigation">
      {items.map(([id, label, Icon]) => (
        <button
          key={id}
          className={`nav-item ${currentPage === id ? "active" : ""}`}
          onClick={() => onNavigate(id)}
          aria-current={currentPage === id ? "page" : undefined}
        >
          <Icon size={18} strokeWidth={currentPage === id ? 2.5 : 2} />
          <span>{label}</span>
          {id === "alerts" && <i className="nav-alert-dot" />}
        </button>
      ))}
    </nav>
  );
}
