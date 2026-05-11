import { useState } from "react";
import { signInWithPassword, signUpWithPassword } from "./lib/supabaseAuth";
import { useTranslation } from "./lib/i18n.jsx";

export default function AuthModal({ onClose }) {
  const { t } = useTranslation();
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const submitLabel = mode === "signin" ? t.auth.submitSignin : t.auth.submitSignup;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setIsLoading(true);

    try {
      const action = mode === "signin" ? signInWithPassword : signUpWithPassword;
      const { data, error } = await action({ email, password });
      if (error) throw error;

      if (mode === "signup" && !data.session) {
        setSuccessMsg(t.auth.signupSuccess);
      } else {
        onClose?.();
      }
    } catch (error) {
      setErrorMsg(error.message || t.auth.genericError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-modal__backdrop" role="dialog" aria-modal="true" aria-label={t.auth.titleSignin}>
      <div className="auth-modal">
        <button type="button" className="auth-modal__close" onClick={onClose} aria-label={t.auth.close}>
          ×
        </button>
        <h2 className="auth-modal__title">{mode === "signin" ? t.auth.titleSignin : t.auth.titleSignup}</h2>

        <form onSubmit={handleSubmit} className="auth-modal__form">
          <label className="auth-modal__label">
            {t.auth.email}
            <input
              className="auth-modal__input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </label>
          <label className="auth-modal__label">
            {t.auth.password}
            <input
              className="auth-modal__input"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
            />
          </label>

          {errorMsg ? <p className="auth-modal__error">{errorMsg}</p> : null}
          {successMsg ? <p className="auth-modal__success">{successMsg}</p> : null}

          <button type="submit" className="btn btn--dark auth-modal__submit" disabled={isLoading}>
            {isLoading ? t.auth.loading : submitLabel}
          </button>
        </form>

        <button
          type="button"
          className="auth-modal__switch"
          onClick={() => {
            setMode((m) => (m === "signin" ? "signup" : "signin"));
            setErrorMsg("");
            setSuccessMsg("");
          }}
        >
          {mode === "signin" ? t.auth.switchToSignup : t.auth.switchToSignin}
        </button>
      </div>
    </div>
  );
}
