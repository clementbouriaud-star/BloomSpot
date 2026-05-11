import { useState } from "react";
import { BrandLogoButton } from "./BrandLogo.jsx";
import { LanguageToggle, useTranslation } from "./lib/i18n.jsx";

const TOTAL = 5;

const SUGGESTIONS = ["Paris 11e", "Lyon Croix-Rousse", "Bordeaux Chartrons", "Nantes Centre", "Lille Vieux-Lille"];

const STYLE_KEYS = ["tradition", "auteur", "bio", "snacking"];
const CLIENTELE_KEYS = ["familles", "bureaux", "etudiants", "touristes", "seniors", "csp"];
const ATOUT_KEYS = ["flux", "concurrence", "transports", "stationnement", "terrasse", "mutation"];
const PHASE_KEYS = ["ville", "local", "concept", "clientele", "atouts"];

function InputPinIcon() {
  return (
    <svg className="quiz-input__pin" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.2" fill="currentColor" />
    </svg>
  );
}

function RadioDecor({ checked = false }) {
  return (
    <span className={`quiz-radio ${checked ? "quiz-radio--on" : ""}`} aria-hidden>
      <span className="quiz-radio__dot" />
    </span>
  );
}

export default function Questionnaire({ onCancel, onComplete, session, onAuthOpen, onLogout, accountMenu }) {
  const { t } = useTranslation();
  const surfaces = t.quiz.surfaces;
  const loyers = t.quiz.loyers;

  const [step, setStep] = useState(0);
  const [ville, setVille] = useState("");
  const [surface, setSurface] = useState(null);
  const [loyer, setLoyer] = useState(loyers[1]);
  const [concept, setConcept] = useState(null);
  const [clientele, setClientele] = useState(null);
  const [atouts, setAtouts] = useState(() => new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const phaseKey = PHASE_KEYS[step];
  const phase = t.quiz.phases[phaseKey];
  const progress = ((step + 1) / TOTAL) * 100;

  const canContinue = () => {
    if (step === 0) return ville.trim().length > 0;
    if (step === 1) return surface != null && loyer != null;
    if (step === 2) return concept != null;
    if (step === 3) return clientele != null;
    if (step === 4) return atouts.size > 0;
    return true;
  };

  const goNext = async () => {
    if (step < TOTAL - 1) {
      setStep((s) => s + 1);
      return;
    }

    if (!onComplete) return;

    setSubmitError("");
    setIsSubmitting(true);
    try {
      await onComplete({ ville, surface, loyer, concept, clientele, atouts: [...atouts] });
    } catch (error) {
      console.error(error);
      setSubmitError(t.quiz.submitError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    if (step > 0) setStep((s) => s - 1);
    else onCancel();
  };

  const toggleAtout = (id) => {
    setAtouts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="quiz">
      <nav className="nav quiz__nav">
        <BrandLogoButton onClick={onCancel} />
        <div className="nav__pill">
          <button type="button" className="nav__pill-btn" onClick={onCancel}>
            {t.nav.method}
          </button>
          <button type="button" className="nav__pill-btn" onClick={onCancel}>
            {t.nav.map}
          </button>
          <button type="button" className="nav__pill-btn" onClick={onCancel}>
            {t.nav.pricing}
          </button>
        </div>
        <div className="nav__actions">
          <LanguageToggle />
          {session?.user ? (
            <button type="button" className="nav__link nav__link-btn quiz__muted-link" onClick={onLogout}>
              {t.nav.logout}
            </button>
          ) : (
            <button type="button" className="nav__link nav__link-btn quiz__muted-link" onClick={onAuthOpen}>
              {t.nav.login}
            </button>
          )}
          {accountMenu}
        </div>
      </nav>

      <div className="quiz__progress-wrap">
        <div className="quiz__progress-labels">
          <span>{t.quiz.stepLabel(step + 1, TOTAL)}</span>
          <span>{phase.toUpperCase()}</span>
        </div>
        <div className="quiz__progress-bar" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={TOTAL}>
          <span className="quiz__progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <main className="quiz__main">
        <div className="quiz-card">
          {step === 0 && (
            <>
              <h1 className="quiz-card__title">{t.quiz.step0Title}</h1>
              <label className="quiz-label" htmlFor="quiz-ville">
                {t.quiz.cityLabel}
              </label>
              <div className="quiz-input-wrap">
                <InputPinIcon />
                <input
                  id="quiz-ville"
                  className="quiz-input"
                  type="text"
                  placeholder={t.quiz.cityPlaceholder}
                  value={ville}
                  onChange={(e) => setVille(e.target.value)}
                  autoComplete="address-level2"
                />
              </div>
              <p className="quiz-suggest-label">{t.quiz.suggestionsLabel}</p>
              <div className="quiz-chips">
                {SUGGESTIONS.map((s) => (
                  <button key={s} type="button" className="quiz-chip" onClick={() => setVille(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h1 className="quiz-card__title">{t.quiz.step1Title}</h1>
              <p className="quiz-section-label">{t.quiz.surfaceLabel}</p>
              <div className="quiz-grid2">
                {surfaces.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`quiz-option ${surface === s ? "quiz-option--active" : ""}`}
                    onClick={() => setSurface(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <p className="quiz-section-label">{t.quiz.budgetLabel}</p>
              <div className="quiz-grid2">
                {loyers.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`quiz-option ${loyer === s ? "quiz-option--active" : ""}`}
                    onClick={() => setLoyer(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="quiz-card__title quiz-card__title--center">{t.quiz.step2Title}</h1>
              <div className="quiz-grid2 quiz-grid2--gap">
                {STYLE_KEYS.map((key) => {
                  const c = t.quiz.styles[key];
                  const on = concept === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      className={`quiz-choice ${on ? "quiz-choice--active" : ""}`}
                      onClick={() => setConcept(key)}
                    >
                      <RadioDecor checked={on} />
                      <span className="quiz-choice__title">{c.title}</span>
                      <span className="quiz-choice__desc">{c.desc}</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h1 className="quiz-card__title">{t.quiz.step3Title}</h1>
              <div className="quiz-grid2 quiz-grid2--clients">
                {CLIENTELE_KEYS.map((key) => {
                  const c = t.quiz.clientelesDesc[key];
                  const on = clientele === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      className={`quiz-choice ${on ? "quiz-choice--active" : ""}`}
                      onClick={() => setClientele(key)}
                    >
                      <RadioDecor checked={on} />
                      <span className="quiz-choice__title">{c.title}</span>
                      <span className="quiz-choice__desc">{c.desc}</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <h1 className="quiz-card__title">{t.quiz.step4Title}</h1>
              <div className="quiz-grid2 quiz-grid2--clients">
                {ATOUT_KEYS.map((key) => {
                  const c = t.quiz.atouts[key];
                  const on = atouts.has(key);
                  return (
                    <button
                      key={key}
                      type="button"
                      className={`quiz-choice ${on ? "quiz-choice--active" : ""}`}
                      onClick={() => toggleAtout(key)}
                    >
                      <RadioDecor checked={on} />
                      <span className="quiz-choice__title">{c.title}</span>
                      <span className="quiz-choice__desc">{c.desc}</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          <footer className="quiz-card__footer">
            <button type="button" className="quiz-link" onClick={goBack}>
              {t.quiz.back}
            </button>
            <div className="quiz-card__footer-right">
              {submitError ? <span className="quiz-error">{submitError}</span> : null}
              <button type="button" className="quiz-link" onClick={onCancel}>
                {t.quiz.cancel}
              </button>
              {step < TOTAL - 1 ? (
                <button type="button" className="btn btn--quiz" onClick={goNext} disabled={!canContinue() || isSubmitting}>
                  {t.quiz.next}
                  <span className="btn__arrow" aria-hidden>
                    →
                  </span>
                </button>
              ) : (
                <button type="button" className="btn btn--quiz" onClick={goNext} disabled={!canContinue() || isSubmitting}>
                  {isSubmitting ? t.quiz.submitting : t.quiz.submit}
                  <span className="btn__arrow" aria-hidden>
                    →
                  </span>
                </button>
              )}
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
