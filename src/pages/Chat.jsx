import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Mic,
  Send,
  Sparkles,
  Volume2,
} from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";
import useOnlineStatus from "../hooks/useOnlineStatus";

const suggestions = [
  "Where should I fish today?",
  "Is the sea safe this morning?",
  "Show me active alerts",
];

export default function Chat({ onNavigate }) {
  const { t } = useLanguage();
  const isOnline = useOnlineStatus();
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState([
    { type: "bot", text: `${t("assistant")} · ${t("currentConditions")}` },
  ]);

  const sendMessage = (value = input) => {
    if (!value.trim() || isThinking) return;
    setMessages((previous) => [
      ...previous,
      { type: "user", text: value.trim() },
    ]);
    setInput("");
    setIsThinking(true);
    window.setTimeout(() => {
      setMessages((previous) => [
        ...previous,
        {
          type: "bot",
          text: `${t("currentConditions")} Zone A near Digha Shelf looks favourable. Please check the latest advisory before departure.`,
        },
      ]);
      setIsThinking(false);
    }, 650);
  };

  return (
    <div className="chat-workspace">
      <header className="chat-topbar">
        <button
          className="back-btn"
          onClick={() => onNavigate("home")}
          aria-label="Back"
        >
          <ArrowLeft size={19} />
        </button>
        <div className="chat-agent-avatar">
          <Sparkles size={17} />
        </div>
        <div className="chat-agent-title">
          <strong>{t("assistant")}</strong>
            <span>
            <i /> Marine reasoning agent ·{" "}
            {isOnline ? "Online" : "Offline cache"} ·{" "}
            {isThinking ? t("thinking") : t("ready")}
          </span>
        </div>
        <button className="icon-btn" aria-label="Language">
          EN
        </button>
      </header>
      <main className="chat-content">
        <div className="chat-intro">
          <span className="eyebrow-label">EVIDENCE-BASED MARINE GUIDANCE</span>
          <h1>{t("whatNeed")}</h1>
          <p>{t("voiceText")}</p>
        </div>
        <div className="chat-suggestions">
          {suggestions.map((suggestion) => (
            <button key={suggestion} onClick={() => sendMessage(suggestion)}>
              {suggestion}
            </button>
          ))}
        </div>
        <div className="chat-area premium-chat-area">
          {messages.map((message, index) => (
            <div
              key={`${message.type}-${index}`}
              className={`chat-message ${message.type === "user" ? "user-message" : "bot-message"}`}
            >
              <span>{message.text}</span>
              {message.type === "bot" && (
                <button className="audio-button" aria-label="Play answer">
                  <Volume2 size={15} />
                </button>
              )}
            </div>
          ))}
          {isThinking && (
            <div className="thinking-indicator">
              <Sparkles size={15} /> {t("thinking")}
              <span>•••</span>
            </div>
          )}
        </div>
        {!isOnline && (
          <div className="offline-chat-note">
            Offline mode: showing cached marine guidance. New AI reasoning is unavailable.
          </div>
        )}
        <section className="evidence-card">
          <div className="evidence-heading">
            <span>
              <CheckCircle2 size={16} /> Grounded response
            </span>
            <strong>82% confidence</strong>
          </div>
          <p>Based on SST, wave height, chlorophyll and official advisories.</p>
          <div className="evidence-tags">
            <span>Live marine data</span>
            <span>7-day trend</span>
            <span>INCOIS advisory</span>
          </div>
        </section>
      </main>
      <div className="chat-composer">
        <button
          className={`composer-mic ${isListening ? "listening" : ""}`}
          onClick={() => setIsListening((value) => !value)}
          aria-label={isListening ? "Stop voice input" : "Voice input"}
        >
          <Mic size={20} />
        </button>
        {isListening && <span className="listening-label">Listening…</span>}
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") sendMessage();
          }}
          placeholder={t("askPlaceholder")}
        />
        <button
          className="send-btn"
          onClick={() => sendMessage()}
          aria-label="Send"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
