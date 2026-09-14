import { ArrowLeft, ArrowRight, LockKeyhole } from "lucide-react";
import { useState } from "react";

export default function OTP({ phone, onNext, onBack }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const digits = otp.replace(/\D/g, "").slice(0, 4);

  return (
    <div className="setup-screen auth-screen setup-page-enter">
      <div className="setup-content auth-content">
        <div className="setup-brand">
          <img className="setup-brand-logo" src="/orca-logo-transparent.png" alt="ORCA" />
          <span>ORCA</span>
        </div>
        <button className="auth-back-button" onClick={onBack} aria-label="Change mobile number">
          <ArrowLeft size={18} /> Change number
        </button>
        <div className="auth-icon"><LockKeyhole size={24} /></div>
        <span className="eyebrow-label">SECURE ACCESS</span>
        <h1>Verify your number</h1>
        <p className="setup-description">
          Enter the 4-digit code sent to <strong>{phone}</strong>.
        </p>
        <label className="auth-field">
          <span>Verification code</span>
          <input
            className="otp-input"
            value={digits}
            onChange={(event) => { setOtp(event.target.value); setError(""); }}
            inputMode="numeric"
            placeholder="0000"
            maxLength={4}
            aria-label="Verification code"
          />
        </label>
        {error && <p className="auth-error">{error}</p>}
        <button
          className="primary-btn setup-continue auth-submit"
          onClick={() => {
            if (digits.length !== 4) {
              setError("Please enter the 4-digit OTP to continue.");
              return;
            }
            onNext();
          }}
        >
          Verify and continue <ArrowRight size={17} />
        </button>
        <button className="auth-resend-button" onClick={() => setOtp("")}>Resend code</button>
        <small className="auth-demo-note">Demo mode: enter any 4-digit code.</small>
      </div>
    </div>
  );
}
