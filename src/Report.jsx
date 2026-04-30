import { useMemo, useState } from "react";
import { MapPinMarker, MapPinGrey } from "./MapPins.jsx";
import { BrandLogoButton } from "./BrandLogo.jsx";

const CONCEPT_TITLES = {
  tradition: "Boulangerie de tradition",
  auteur: "Boulangerie artisan",
  bio: "Boulangerie engagée",
  snacking: "Snacking & coffee",
};

const LOCAUX = [
  {
    id: "A",
    address: "23 rue des Martyrs",
    quartier: "Paris 9e — SoPi",
    score: 92,
    surface: "82 m²",
    loyer: "4 200 €",
    loyerDetail: "4 200 €/mois",
    concur: 1,
    flux: "Très fort",
    atouts: [
      "Rue piétonne très commerçante, flux soutenu de 8h à 20h",
      "Mix résidentiel CSP+ et touristes de proximité",
      "1 seule boulangerie concurrente à 280m, gamme classique",
      "Forte présence de cafés et épiceries fines complémentaires",
    ],
    points: ["Loyer dans la fourchette haute du quartier", "Stationnement livraison limité"],
    typoZone: "Paris 9e — SoPi",
    typo: [
      { label: "Familles avec enfants", value: 68, tone: "neutral" },
      { label: "Pouvoir d'achat (vs moy.)", value: 82, tone: "positive" },
      { label: "Saturation boulangerie", value: 22, tone: "caution" },
      { label: "Actifs en bureau", value: 54, tone: "neutral" },
      { label: "Touristes & passage", value: 41, tone: "neutral" },
      { label: "Dynamique commerce", value: 75, tone: "positive" },
    ],
  },
  {
    id: "B",
    address: "17 rue Notre-Dame de Lorette",
    quartier: "Paris 9e — Pigalle",
    score: 84,
    surface: "65 m²",
    loyer: "3 600 €",
    loyerDetail: "3 600 €/mois",
    concur: 2,
    flux: "Fort",
    atouts: [
      "Axe piéton dense en semaine, bonne visibilité vitrine",
      "Clientèle de quartier et bureaux à proximité",
      "Concurrence modérée sur la gamme snacking",
    ],
    points: ["Surface plus compacte pour labo + vente", "Livraisons en matinée à anticiper"],
    typoZone: "Paris 9e — Pigalle",
    typo: [
      { label: "Familles avec enfants", value: 52, tone: "neutral" },
      { label: "Pouvoir d'achat (vs moy.)", value: 76, tone: "positive" },
      { label: "Saturation boulangerie", value: 38, tone: "caution" },
      { label: "Actifs en bureau", value: 61, tone: "neutral" },
      { label: "Touristes & passage", value: 48, tone: "neutral" },
      { label: "Dynamique commerce", value: 69, tone: "positive" },
    ],
  },
  {
    id: "C",
    address: "44 rue du Faubourg Saint-Antoine",
    quartier: "Paris 12e — Bastille",
    score: 76,
    surface: "68 m²",
    loyer: "2 900 €",
    loyerDetail: "2 900 €/mois",
    concur: 3,
    flux: "Modéré",
    atouts: [
      "Quartier mixte commerce / résidentiel",
      "Bonnes dessertes transports et axes secondaires",
    ],
    points: ["Plus de concurrents sur 500m", "Rénovation façade à prévoir"],
    typoZone: "Paris 12e — Bastille",
    typo: [
      { label: "Familles avec enfants", value: 58, tone: "neutral" },
      { label: "Pouvoir d'achat (vs moy.)", value: 64, tone: "positive" },
      { label: "Saturation boulangerie", value: 44, tone: "caution" },
      { label: "Actifs en bureau", value: 49, tone: "neutral" },
      { label: "Touristes & passage", value: 55, tone: "neutral" },
      { label: "Dynamique commerce", value: 71, tone: "positive" },
    ],
  },
];

function IconPdf() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M12 11V17M9 14h6M14 2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8l-6-6Z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}

function ReportMap({ focusId }) {
  return (
    <div className="report-map mini-map" aria-hidden>
      <div className="mini-map__base" />
      <div className="mini-map__grid" />
      <div className="mini-map__footprints">
        <span className="mini-map__fp mini-map__fp--1" />
        <span className="mini-map__fp mini-map__fp--2" />
        <span className="mini-map__fp mini-map__fp--3" />
        <span className="mini-map__fp mini-map__fp--4" />
      </div>
      <div className="mini-map__road mini-map__road--main-h" />
      <div className="mini-map__road mini-map__road--main-v" />
      <div className="mini-map__road mini-map__road--lane1" />
      <div className="mini-map__road mini-map__road--lane2" />
      <div className="mini-map__parc">Parc</div>

      {["A", "B", "C"].map((id) => {
        const pos = `report-map__pos-${id.toLowerCase()}`;
        if (id === focusId) {
          return (
            <div key={id} className={`mini-map__subject-wrap ${pos}`}>
              <span className="mini-map__pulse" />
              <MapPinMarker variant="subject" letter={id} />
            </div>
          );
        }
        return <MapPinMarker key={id} variant="competitor" letter={id} className={pos} />;
      })}

      <MapPinGrey className="mini-map__grey mini-map__grey--1" />
      <MapPinGrey className="mini-map__grey mini-map__grey--2" />
      <MapPinGrey className="mini-map__grey mini-map__grey--3" />
    </div>
  );
}

function TypoBar({ label, value, tone }) {
  return (
    <div className="report-typo-row">
      <div className="report-typo-head">
        <span>{label}</span>
        <span className="report-typo-val">{value}%</span>
      </div>
      <div className="report-typo-track">
        <span className={`report-typo-fill report-typo-fill--${tone}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function Report({ data, onHome, onAffiner, session, onAuthOpen, onLogout }) {
  const [selectedId, setSelectedId] = useState("A");

  const headline = useMemo(() => {
    if (data?.reportTitle) return data.reportTitle;
    const ville = (data?.ville || "Paris").trim() || "Paris";
    const concept = CONCEPT_TITLES[data?.concept] || "Boulangerie artisan";
    return `${ville} — ${concept}`;
  }, [data]);

  const active = LOCAUX.find((l) => l.id === selectedId) || LOCAUX[0];

  return (
    <div className="report-page">
      <nav className="nav report-page__nav">
        <BrandLogoButton onClick={onHome} />
        <div className="nav__pill">
          <button type="button" className="nav__pill-btn" onClick={onHome}>
            La méthode
          </button>
          <button type="button" className="nav__pill-btn" onClick={onHome}>
            La carte
          </button>
          <button type="button" className="nav__pill-btn" onClick={onHome}>
            Tarifs
          </button>
        </div>
        <div className="nav__actions">
          {session?.user ? (
            <button type="button" className="nav__link nav__link-btn report-page__muted" onClick={onLogout}>
              Déconnexion
            </button>
          ) : (
            <button type="button" className="nav__link nav__link-btn report-page__muted" onClick={onAuthOpen}>
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

      <header className="report-hero">
        <div className="report-hero__text">
          <p className="report-hero__eyebrow">Rapport d&apos;implantation</p>
          <h1 className="report-hero__title">{headline}</h1>
          <p className="report-hero__sub">3 locaux compatibles · Mise à jour il y a 2 minutes</p>
        </div>
        <div className="report-hero__actions">
          <button type="button" className="btn btn--outline-report">
            <IconPdf />
            Exporter PDF
          </button>
          <button type="button" className="btn btn--dark btn--sm" onClick={onAffiner}>
            Affiner
          </button>
        </div>
      </header>

      <div className="report-grid">
        <aside className="report-grid__list">
          <h2 className="report-list-title">Locaux classés par compatibilité</h2>
          <ul className="report-loc-list">
            {LOCAUX.map((loc) => {
              const on = loc.id === selectedId;
              return (
                <li key={loc.id}>
                  <button
                    type="button"
                    className={`report-loc-card ${on ? "report-loc-card--active" : ""}`}
                    onClick={() => setSelectedId(loc.id)}
                  >
                    <div className="report-loc-card__head">
                      <span className={`report-loc-card__badge ${on ? "" : "report-loc-card__badge--muted"}`}>{loc.id}</span>
                      <div className="report-loc-card__meta">
                        <p className="report-loc-card__addr">{loc.address}</p>
                        <p className="report-loc-card__area">{loc.quartier}</p>
                      </div>
                      <span className="report-loc-card__score">
                        {loc.score}
                        <span className="report-loc-card__score-max">/100</span>
                      </span>
                    </div>
                    <div className="report-loc-card__stats">
                      <div>
                        <span className="report-loc-card__lbl">Surface</span>
                        <span className="report-loc-card__val">{loc.surface}</span>
                      </div>
                      <div>
                        <span className="report-loc-card__lbl">Loyer</span>
                        <span className="report-loc-card__val">{loc.loyer}</span>
                      </div>
                      <div>
                        <span className="report-loc-card__lbl">Concur.</span>
                        <span className="report-loc-card__val">{loc.concur}</span>
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        <div className="report-grid__main">
          <div className="report-map-slot">
            <ReportMap focusId={selectedId} />
          </div>

          <article className="report-detail">
            <header className="report-detail__head">
              <div>
                <p className="report-detail__tag">Local {active.id}</p>
                <h2 className="report-detail__title">{active.address}</h2>
                <p className="report-detail__sub">{active.quartier}</p>
              </div>
              <div className="report-detail__score">
                <span className="report-detail__score-num">{active.score}</span>
                <span className="report-detail__score-sep">/</span>
                <span className="report-detail__score-max">100</span>
              </div>
            </header>

            <div className="report-detail__metrics">
              <div className="report-metric">
                <span className="report-metric__lbl">Surface</span>
                <span className="report-metric__val">{active.surface}</span>
              </div>
              <div className="report-metric">
                <span className="report-metric__lbl">Loyer</span>
                <span className="report-metric__val">{active.loyerDetail}</span>
              </div>
              <div className="report-metric">
                <span className="report-metric__lbl">Flux piéton</span>
                <span className="report-metric__val">{active.flux}</span>
              </div>
              <div className="report-metric">
                <span className="report-metric__lbl">Concurrents 500m</span>
                <span className="report-metric__val">{active.concur}</span>
              </div>
            </div>

            <div className="report-detail__cols">
              <section className="report-block report-block--pro">
                <h3 className="report-block__title">
                  <span className="report-block__ico report-block__ico--ok" aria-hidden>
                    ✓
                  </span>
                  Atouts du quartier
                </h3>
                <ul className="report-block__list">
                  {active.atouts.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </section>
              <section className="report-block report-block--warn">
                <h3 className="report-block__title">
                  <span className="report-block__ico report-block__ico--alert" aria-hidden>
                    !
                  </span>
                  Points d&apos;attention
                </h3>
                <ul className="report-block__list">
                  {active.points.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </section>
            </div>

            <hr className="report-detail__rule" />

            <section className="report-typo">
              <h3 className="report-typo__title">Typologie du secteur</h3>
              <p className="report-typo__sub">
                Analyse croisée INSEE + relevés terrain · {active.typoZone}
              </p>
              <div className="report-typo__grid">
                <div>
                  {active.typo.slice(0, 3).map((row) => (
                    <TypoBar key={row.label} {...row} />
                  ))}
                </div>
                <div>
                  {active.typo.slice(3).map((row) => (
                    <TypoBar key={row.label} {...row} />
                  ))}
                </div>
              </div>
            </section>

            <footer className="report-detail__foot">
              <button type="button" className="btn btn--report-primary">
                Demander une visite
              </button>
              <button type="button" className="btn btn--report-secondary">
                Sauvegarder ce local
              </button>
            </footer>
          </article>
        </div>
      </div>
    </div>
  );
}
