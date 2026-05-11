import { useMemo, useState } from "react";
import { MapPinMarker, MapPinGrey } from "./MapPins.jsx";
import { BrandLogoButton } from "./BrandLogo.jsx";
import { LanguageToggle, useTranslation } from "./lib/i18n.jsx";

function buildLocaux(t) {
  return [
    {
      id: "A",
      address: t.report.addresses.martyrs,
      quartier: t.report.neighborhoods.sopi,
      score: 92,
      surface: "82 m²",
      loyer: "4 200 €",
      loyerDetail: "4 200 €/mois",
      concur: 1,
      flux: t.report.flux.veryStrong,
      atouts: t.report.atoutsA,
      points: t.report.pointsA,
      typoZone: t.report.neighborhoods.sopi,
      typo: [
        { label: t.report.typoLabels.families, value: 68, tone: "neutral" },
        { label: t.report.typoLabels.spending, value: 82, tone: "positive" },
        { label: t.report.typoLabels.saturation, value: 22, tone: "caution" },
        { label: t.report.typoLabels.offices, value: 54, tone: "neutral" },
        { label: t.report.typoLabels.tourists, value: 41, tone: "neutral" },
        { label: t.report.typoLabels.commerce, value: 75, tone: "positive" },
      ],
    },
    {
      id: "B",
      address: t.report.addresses.loretteEs,
      quartier: t.report.neighborhoods.pigalle,
      score: 84,
      surface: "65 m²",
      loyer: "3 600 €",
      loyerDetail: "3 600 €/mois",
      concur: 2,
      flux: t.report.flux.strong,
      atouts: t.report.atoutsB,
      points: t.report.pointsB,
      typoZone: t.report.neighborhoods.pigalle,
      typo: [
        { label: t.report.typoLabels.families, value: 52, tone: "neutral" },
        { label: t.report.typoLabels.spending, value: 76, tone: "positive" },
        { label: t.report.typoLabels.saturation, value: 38, tone: "caution" },
        { label: t.report.typoLabels.offices, value: 61, tone: "neutral" },
        { label: t.report.typoLabels.tourists, value: 48, tone: "neutral" },
        { label: t.report.typoLabels.commerce, value: 69, tone: "positive" },
      ],
    },
    {
      id: "C",
      address: t.report.addresses.faubourg,
      quartier: t.report.neighborhoods.bastille,
      score: 76,
      surface: "68 m²",
      loyer: "2 900 €",
      loyerDetail: "2 900 €/mois",
      concur: 3,
      flux: t.report.flux.moderate,
      atouts: t.report.atoutsC,
      points: t.report.pointsC,
      typoZone: t.report.neighborhoods.bastille,
      typo: [
        { label: t.report.typoLabels.families, value: 58, tone: "neutral" },
        { label: t.report.typoLabels.spending, value: 64, tone: "positive" },
        { label: t.report.typoLabels.saturation, value: 44, tone: "caution" },
        { label: t.report.typoLabels.offices, value: 49, tone: "neutral" },
        { label: t.report.typoLabels.tourists, value: 55, tone: "neutral" },
        { label: t.report.typoLabels.commerce, value: 71, tone: "positive" },
      ],
    },
  ];
}

function IconPdf() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M12 11V17M9 14h6M14 2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8l-6-6Z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}

function ReportMap({ focusId }) {
  const { t } = useTranslation();
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
      <div className="mini-map__parc">{t.miniMap.park}</div>

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

export default function Report({ data, onHome, onAffiner, session, onAuthOpen, onLogout, accountMenu }) {
  const { t } = useTranslation();
  const [selectedId, setSelectedId] = useState("A");

  const locaux = useMemo(() => buildLocaux(t), [t]);

  const headline = useMemo(() => {
    const ville = (data?.ville || "Paris").trim() || "Paris";
    const concept = t.concepts[data?.concept] || t.concepts.auteur;
    return `${ville} — ${concept}`;
  }, [data, t]);

  const active = locaux.find((l) => l.id === selectedId) || locaux[0];
  const marketPriceValue = data?.marketPrice?.averagePrice;
  const hasMarketPrice = typeof marketPriceValue === "number" && Number.isFinite(marketPriceValue);
  const marketPriceText = hasMarketPrice
    ? `${Math.round(marketPriceValue).toLocaleString(t.dateLocale)} €/m²`
    : t.report.marketUnavailable;

  return (
    <div className="report-page">
      <nav className="nav report-page__nav">
        <BrandLogoButton onClick={onHome} />
        <div className="nav__pill">
          <button type="button" className="nav__pill-btn" onClick={onHome}>
            {t.nav.method}
          </button>
          <button type="button" className="nav__pill-btn" onClick={onHome}>
            {t.nav.map}
          </button>
          <button type="button" className="nav__pill-btn" onClick={onHome}>
            {t.nav.pricing}
          </button>
        </div>
        <div className="nav__actions">
          <LanguageToggle />
          {session?.user ? (
            <button type="button" className="nav__link nav__link-btn report-page__muted" onClick={onLogout}>
              {t.nav.logout}
            </button>
          ) : (
            <button type="button" className="nav__link nav__link-btn report-page__muted" onClick={onAuthOpen}>
              {t.nav.login}
            </button>
          )}
          {accountMenu}
        </div>
      </nav>

      <header className="report-hero">
        <div className="report-hero__text">
          <p className="report-hero__eyebrow">{t.report.eyebrow}</p>
          <h1 className="report-hero__title">{headline}</h1>
          <p className="report-hero__sub">{t.report.sub}</p>
          <div className="market-context">
            <p className="market-context__label">{t.report.marketLabel}</p>
            <p className="market-context__value">{marketPriceText}</p>
            {data?.marketPrice ? (
              <p className="market-context__meta">
                {data.marketPrice.departmentName || t.report.unknownDept}
                {data.marketPrice.departmentCode ? ` (${data.marketPrice.departmentCode})` : ""}
                {t.report.sourcePrefix}
                {data.marketPrice.sourceTable}
              </p>
            ) : (
              <p className="market-context__meta">{t.report.noMarketData}</p>
            )}
          </div>
        </div>
        <div className="report-hero__actions">
          <button type="button" className="btn btn--outline-report">
            <IconPdf />
            {t.report.exportPdf}
          </button>
          <button type="button" className="btn btn--dark btn--sm" onClick={onAffiner}>
            {t.report.refine}
          </button>
        </div>
      </header>

      <div className="report-grid">
        <aside className="report-grid__list">
          <h2 className="report-list-title">{t.report.listTitle}</h2>
          <ul className="report-loc-list">
            {locaux.map((loc) => {
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
                        <span className="report-loc-card__lbl">{t.report.surface}</span>
                        <span className="report-loc-card__val">{loc.surface}</span>
                      </div>
                      <div>
                        <span className="report-loc-card__lbl">{t.report.rent}</span>
                        <span className="report-loc-card__val">{loc.loyer}</span>
                      </div>
                      <div>
                        <span className="report-loc-card__lbl">{t.report.competition}</span>
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
                <p className="report-detail__tag">{t.report.localTag(active.id)}</p>
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
                <span className="report-metric__lbl">{t.report.surface}</span>
                <span className="report-metric__val">{active.surface}</span>
              </div>
              <div className="report-metric">
                <span className="report-metric__lbl">{t.report.rent}</span>
                <span className="report-metric__val">{active.loyerDetail}</span>
              </div>
              <div className="report-metric">
                <span className="report-metric__lbl">{t.report.pedestrianFlux}</span>
                <span className="report-metric__val">{active.flux}</span>
              </div>
              <div className="report-metric">
                <span className="report-metric__lbl">{t.report.competitors500}</span>
                <span className="report-metric__val">{active.concur}</span>
              </div>
            </div>

            <div className="report-detail__cols">
              <section className="report-block report-block--pro">
                <h3 className="report-block__title">
                  <span className="report-block__ico report-block__ico--ok" aria-hidden>
                    ✓
                  </span>
                  {t.report.strengths}
                </h3>
                <ul className="report-block__list">
                  {active.atouts.map((tx) => (
                    <li key={tx}>{tx}</li>
                  ))}
                </ul>
              </section>
              <section className="report-block report-block--warn">
                <h3 className="report-block__title">
                  <span className="report-block__ico report-block__ico--alert" aria-hidden>
                    !
                  </span>
                  {t.report.attention}
                </h3>
                <ul className="report-block__list">
                  {active.points.map((tx) => (
                    <li key={tx}>{tx}</li>
                  ))}
                </ul>
              </section>
            </div>

            <hr className="report-detail__rule" />

            <section className="report-typo">
              <h3 className="report-typo__title">{t.report.typoTitle}</h3>
              <p className="report-typo__sub">{t.report.typoSub(active.typoZone)}</p>
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
                {t.report.requestVisit}
              </button>
              <button type="button" className="btn btn--report-secondary">
                {t.report.saveLocal}
              </button>
            </footer>
          </article>
        </div>
      </div>
    </div>
  );
}
