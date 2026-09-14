import { useState } from "react";
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import OTP from "./pages/OTP";
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
  const [setupStep, setSetupStep] = useState("splash");
  const [phone, setPhone] = useState("");
  const [persona, setPersona] = useState(
    () => localStorage.getItem("orca-persona") || "Fisherman",
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

  const replaySetup = () => {
    localStorage.removeItem("orca-setup-complete");
    localStorage.removeItem("orca-user-name");
    localStorage.removeItem("orca-persona");
    setSetupStep("splash");
  };

  if (setupStep === "splash") {
    return (
      <div className="app">
        <Splash onNext={() => setSetupStep("login")} />
      </div>
    );
  }

  if (setupStep === "login") {
    return (
      <div className="app">
        <Login
          onNext={(mobileNumber) => {
            setPhone(mobileNumber);
            setSetupStep("otp");
          }}
        />
      </div>
    );
  }

  if (setupStep === "otp") {
    return (
      <div className="app">
        <OTP
          phone={phone}
          onBack={() => setSetupStep("login")}
          onNext={() => setSetupStep("persona")}
        />
      </div>
    );
  }

  if (setupStep === "language") {
    return (
      <div className="app">
        <Language
          onNext={(selectedLanguage) => {
            setLanguage(selectedLanguage);
            setSetupStep("location");
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
          onNext={({ name, persona: selectedPersona }) => {
            setUserName(name);
            setPersona(selectedPersona);
            localStorage.setItem("orca-user-name", name);
            localStorage.setItem("orca-persona", selectedPersona);
            setSetupStep("language");
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
    home: <Home onNavigate={navigate} userName={userName} persona={persona} />,
    chat: <Chat onNavigate={navigate} />,
    map: <MapPage onNavigate={navigate} />,
    pfz: <PFZ onNavigate={navigate} />,
    safety: <Safety onNavigate={navigate} />,
    why: <Why onNavigate={navigate} />,
    alerts: <Alerts onNavigate={navigate} />,
    profile: <Profile onNavigate={navigate} onReplaySetup={replaySetup} />,
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
