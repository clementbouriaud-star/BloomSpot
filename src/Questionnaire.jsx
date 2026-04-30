import { useState } from "react";
import { BrandLogoButton } from "./BrandLogo.jsx";

const TOTAL = 5;

const STEPS = [
  { phase: "Ville" },
  { phase: "Local" },
  { phase: "Concept" },
  { phase: "Clientèle" },
  { phase: "Atouts" },
];

const SUGGESTIONS = ["Paris 11e", "Lyon Croix-Rousse", "Bordeaux Chartrons", "Nantes Centre", "Lille Vieux-Lille"];

const SURFACES = ["< 50 m²", "50-80 m²", "80-120 m²", "> 120 m²"];

const LOYERS = ["< 2 500 €/mois", "2 500-4 000 €", "4 000-6 000 €", "> 6 000 €"];

const STYLES_BOULANGERIE = [
  {
    id: "tradition",
    title: "Tradition",
    desc: "Pain quotidien, viennoiseries classiques, prix accessibles",
  },
  {
    id: "auteur",
    title: "Artisan d'auteur",
    desc: "Levain, farines anciennes, sélection pointue",
  },
  {
    id: "bio",
    title: "Bio & engagée",
    desc: "Filières courtes, vrac, démarche écologique",
  },
  {
    id: "snacking",
    title: "Snacking & coffee",
    desc: "Sandwichs, cafés de spécialité, formules midi",
  },
];

const CLIENTELES = [
  { id: "familles", title: "Familles", desc: "Habitat résidentiel, écoles à proximité" },
  { id: "bureaux", title: "Actifs en bureau", desc: "Déjeuner rapide, click & collect" },
  { id: "etudiants", title: "Étudiants", desc: "Prix accessibles, formules snacking" },
  { id: "touristes", title: "Touristes & passage", desc: "Centre-ville, gares, monuments" },
  { id: "seniors", title: "Seniors", desc: "Habitués, fidélité forte, classiques" },
  { id: "csp", title: "CSP+ exigeants", desc: "Bio, levain, produits d'exception" },
];

const ATOUTS = [
  { id: "flux", title: "Fort flux piéton", desc: "Rue passante, axe commerçant" },
  { id: "concurrence", title: "Peu de concurrence", desc: "Pas de boulangerie à moins de 300m" },
  { id: "transports", title: "Proche transports", desc: "Métro, RER, gare à 5 min" },
  { id: "stationnement", title: "Stationnement aisé", desc: "Place pour la livraison & clients" },
  { id: "terrasse", title: "Possibilité terrasse", desc: "Trottoir large, exposition" },
  { id: "mutation", title: "Quartier en mutation", desc: "Nouveaux logements, dynamique" },
];

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

export default function Questionnaire({ onCancel, onComplete, session, onAuthOpen, onLogout }) {
  const [step, setStep] = useState(0);
  const [ville, setVille] = useState("");
  const [surface, setSurface] = useState(null);
  const [loyer, setLoyer] = useState("2 500-4 000 €");
  const [concept, setConcept] = useState(null);
  const [clientele, setClientele] = useState(null);
  const [atouts, setAtouts] = useState(() => new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const phase = STEPS[step].phase;
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
      setSubmitError("Impossible d'enregistrer pour l'instant. Réessayez.");
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
            La méthode
          </button>
          <button type="button" className="nav__pill-btn" onClick={onCancel}>
            La carte
          </button>
          <button type="button" className="nav__pill-btn" onClick={onCancel}>
            Tarifs
          </button>
        </div>
        <div className="nav__actions">
          {session?.user ? (
            <button type="button" className="nav__link nav__link-btn quiz__muted-link" onClick={onLogout}>
              Déconnexion
            </button>
          ) : (
            <button type="button" className="nav__link nav__link-btn quiz__muted-link" onClick={onAuthOpen}>
              Connexion
            </button>
          )}
          <button type="button" className="btn btn--dark btn--sm">
            Démarrer
            <span className="btn__arrow" aria-hidden>
              →
            </span>
          </button>
        </div>
      </nav>

      <div className="quiz__progress-wrap">
        <div className="quiz__progress-labels">
          <span>
            Étape {step + 1} / {TOTAL}
          </span>
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
              <h1 className="quiz-card__title">Où cherchez-vous ?</h1>
              <label className="quiz-label" htmlFor="quiz-ville">
                Ville ou quartier
              </label>
              <div className="quiz-input-wrap">
                <InputPinIcon />
                <input
                  id="quiz-ville"
                  className="quiz-input"
                  type="text"
                  placeholder="ex. Paris 11e arrondissement"
                  value={ville}
                  onChange={(e) => setVille(e.target.value)}
                  autoComplete="address-level2"
                />
              </div>
              <p className="quiz-suggest-label">Suggestions populaires</p>
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
              <h1 className="quiz-card__title">Surface & budget</h1>
              <p className="quiz-section-label">Surface souhaitée</p>
              <div className="quiz-grid2">
                {SURFACES.map((s) => (
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
              <p className="quiz-section-label">Budget loyer mensuel</p>
              <div className="quiz-grid2">
                {LOYERS.map((s) => (
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
              <h1 className="quiz-card__title quiz-card__title--center">Quel style de boulangerie ?</h1>
              <div className="quiz-grid2 quiz-grid2--gap">
                {STYLES_BOULANGERIE.map((c) => {
                  const on = concept === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      className={`quiz-choice ${on ? "quiz-choice--active" : ""}`}
                      onClick={() => setConcept(c.id)}
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
              <h1 className="quiz-card__title">À qui vous adressez-vous ?</h1>
              <div className="quiz-grid2 quiz-grid2--clients">
                {CLIENTELES.map((c) => {
                  const on = clientele === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      className={`quiz-choice ${on ? "quiz-choice--active" : ""}`}
                      onClick={() => setClientele(c.id)}
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
              <h1 className="quiz-card__title">Que recherchez-vous dans le quartier ?</h1>
              <div className="quiz-grid2 quiz-grid2--clients">
                {ATOUTS.map((c) => {
                  const on = atouts.has(c.id);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      className={`quiz-choice ${on ? "quiz-choice--active" : ""}`}
                      onClick={() => toggleAtout(c.id)}
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
              ← Retour
            </button>
            <div className="quiz-card__footer-right">
              {submitError ? <span className="quiz-error">{submitError}</span> : null}
              <button type="button" className="quiz-link" onClick={onCancel}>
                Annuler
              </button>
              {step < TOTAL - 1 ? (
                <button type="button" className="btn btn--quiz" onClick={goNext} disabled={!canContinue() || isSubmitting}>
                  Continuer
                  <span className="btn__arrow" aria-hidden>
                    →
                  </span>
                </button>
              ) : (
                <button type="button" className="btn btn--quiz" onClick={goNext} disabled={!canContinue() || isSubmitting}>
                  {isSubmitting ? "Enregistrement..." : "Lancer la recherche"}
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
