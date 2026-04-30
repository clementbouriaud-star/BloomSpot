import { useState } from "react";
import { signInWithPassword, signUpWithPassword } from "./lib/supabaseAuth";

export default function AuthModal({ onClose }) {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const submitLabel = mode === "signin" ? "Se connecter" : "Créer un compte";

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
        setSuccessMsg("Compte créé. Vérifiez vos emails pour confirmer votre adresse.");
      } else {
        onClose?.();
      }
    } catch (error) {
      setErrorMsg(error.message || "Erreur de connexion.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-modal__backdrop" role="dialog" aria-modal="true" aria-label="Connexion">
      <div className="auth-modal">
        <button type="button" className="auth-modal__close" onClick={onClose} aria-label="Fermer">
          ×
        </button>
        <h2 className="auth-modal__title">{mode === "signin" ? "Connexion" : "Créer un compte"}</h2>

        <form onSubmit={handleSubmit} className="auth-modal__form">
          <label className="auth-modal__label">
            Email
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
            Mot de passe
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
            {isLoading ? "Chargement..." : submitLabel}
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
          {mode === "signin" ? "Pas encore de compte ? Créer un compte" : "Déjà un compte ? Se connecter"}
        </button>
      </div>
    </div>
  );
}
