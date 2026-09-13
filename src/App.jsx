import { useState } from "react";
import Splash from "./pages/Splash";
import Language from "./pages/Language";
import Persona from "./pages/Persona";
import Location from "./pages/Location";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import MapPage from "./pages/MapPage";
import PFZ from "./pages/PFZ";
import Safety from "./pages/Safety";
import Why from "./pages/Why";
import Alerts from "./pages/Alerts";
import Profile from "./pages/Profile";
import CommandCenterLayout from "./layouts/CommandCenterLayout";
import { LanguageProvider, useLanguage } from "./i18n/LanguageContext";

function AppContent() {
  const [setupStep, setSetupStep] = useState(() =>
    localStorage.getItem("orca-setup-complete") === "true"
      ? "complete"
      : "splash",
  );
  const [currentPage, setCurrentPage] = useState("home");
  const [userName, setUserName] = useState(
    () => localStorage.getItem("orca-user-name") || "Kartikey",
  );
  const { language, setLanguage } = useLanguage();

  const finishSetup = () => {
    localStorage.setItem("orca-setup-complete", "true");
    setSetupStep("complete");
  };

  if (setupStep === "splash") {
    return (
      <div className="app">
        <Splash onNext={() => setSetupStep("language")} />
      </div>
    );
  }

  if (setupStep === "language") {
    return (
      <div className="app">
        <Language
          onNext={(selectedLanguage) => {
            setLanguage(selectedLanguage);
            setSetupStep("persona");
          }}
        />
      </div>
    );
  }

  if (setupStep === "persona") {
    return (
      <div className="app">
        <Persona
          language={language}
          onNext={({ name }) => {
            setUserName(name);
            localStorage.setItem("orca-user-name", name);
            setSetupStep("location");
          }}
        />
      </div>
    );
  }

  if (setupStep === "location") {
    return (
      <div className="app">
        <Location language={language} onNext={finishSetup} />
      </div>
    );
  }

  const navigate = (page) => setCurrentPage(page);

  const pages = {
    home: <Home onNavigate={navigate} userName={userName} />,
    chat: <Chat onNavigate={navigate} />,
    map: <MapPage onNavigate={navigate} />,
    pfz: <PFZ onNavigate={navigate} />,
    safety: <Safety onNavigate={navigate} />,
    why: <Why onNavigate={navigate} />,
    alerts: <Alerts onNavigate={navigate} />,
    profile: <Profile onNavigate={navigate} />,
  };

  return (
    <div className="app">
      <CommandCenterLayout
        currentPage={currentPage}
        onNavigate={navigate}
      >
        <div className="mobile-container">
          {pages[currentPage] || pages.home}
        </div>
      </CommandCenterLayout>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
