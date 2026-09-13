import { Check, ChevronDown, Globe2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { supportedLanguages } from "../i18n/translations";
import { useLanguage } from "../i18n/LanguageContext";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const active = supportedLanguages.find((item) => item.code === language);

  useEffect(() => {
    const closeMenu = (event) => {
      if (!menuRef.current?.contains(event.target)) setOpen(false);
    };

    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, []);

  return (
    <div className="language-switcher" ref={menuRef}>
      <button
        className="language-trigger"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <Globe2 size={16} />
        <span>{active?.native || language}</span>
        <ChevronDown size={14} className={open ? "rotate-180" : ""} />
      </button>

      {open && (
        <div className="language-menu" role="listbox">
          <small>Choose language</small>
          {supportedLanguages.map((item) => (
            <button
              key={item.code}
              className={`language-menu-item ${language === item.code ? "active" : ""}`}
              onClick={() => {
                setLanguage(item.code);
                setOpen(false);
              }}
              role="option"
              aria-selected={language === item.code}
            >
              <span className="language-menu-symbol">{item.native.slice(0, 2)}</span>
              <span><strong>{item.native}</strong><small>{item.code}</small></span>
              {language === item.code && <Check size={15} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
