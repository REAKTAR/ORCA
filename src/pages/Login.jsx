import { ArrowRight, LockKeyhole, Phone } from "lucide-react";
import { useState } from "react";

export default function Login({ onNext }) {
  const [mode, setMode] = useState("signin");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const digits = phone.replace(/\D/g, "").slice(0, 10);

  const submit = () => {
    if (digits.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setError("");
    onNext(`+91 ${digits}`);
  };

  return (
    <div className="setup-screen auth-screen setup-page-enter">
      <div className="setup-content auth-content">
        <div className="setup-brand">
          <img className="setup-brand-logo" src="/orca-logo-transparent.png" alt="ORCA" />
          <span>ORCA</span>
        </div>
        <div className="auth-icon"><Phone size={24} /></div>
        <span className="eyebrow-label">WELCOME ABOARD</span>
        <h1>{mode === "signin" ? "Welcome back" : "Create your ORCA account"}</h1>
        <p className="setup-description">
          {mode === "signin"
            ? "Sign in to continue to your marine workspace."
            : "Create an account to save your preferences and fishing updates."}
        </p>

        <div className="auth-mode-switch" role="tablist">
          <button className={mode === "signin" ? "active" : ""} onClick={() => { setMode("signin"); setError(""); }}>
            Sign in
          </button>
          <button className={mode === "create" ? "active" : ""} onClick={() => { setMode("create"); setError(""); }}>
            Create account
          </button>
        </div>

        <label className="auth-field">
          <span>Mobile number</span>
          <div className={`phone-input-wrap ${error ? "has-error" : ""}`}>
            <strong>+91</strong>
            <input
              value={digits}
              onChange={(event) => { setPhone(event.target.value); setError(""); }}
              onKeyDown={(event) => event.key === "Enter" && submit()}
              inputMode="numeric"
              placeholder="Enter 10-digit number"
              aria-label="Mobile number"
            />
          </div>
        </label>
        {error && <p className="auth-error">{error}</p>}
        <button className="primary-btn setup-continue auth-submit" onClick={submit}>
          {mode === "signin" ? "Send sign-in OTP" : "Create account with OTP"}
          <ArrowRight size={17} />
        </button>
        <div className="auth-trust-note">
          <LockKeyhole size={14} /> Your number is used only for secure account access.
        </div>
      </div>
    </div>
  );
}
