function Logo() {
  return (
    <a href="#" className="brand" aria-label="Mie. accueil">
      <span className="brand__mark" aria-hidden>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="11" fill="currentColor" />
          <path
            d="M12 7a3 3 0 0 0-3 3c0 2.5 3 6 3 6s3-3.5 3-6a3 3 0 0 0-3-3Zm0 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"
            fill="#fff"
          />
        </svg>
      </span>
      <span className="brand__name">Mie.</span>
    </a>
  );
}

function MapPinMarker({ variant, letter, className }) {
  const fill = variant === "subject" ? "#c53636" : "#2f5d45";
  return (
    <span className={`map-pin map-pin--${variant} ${className ?? ""}`}>
      <span className="map-pin__letter">{letter}</span>
      <svg className="map-pin__shape" viewBox="0 0 36 44" width="36" height="44" aria-hidden>
        <path
          d="M18 2C11.4 2 6 7.1 6 13.4c0 4.5 2.8 9.6 6.5 14.1 2.8 3.4 5.5 5.8 5.5 5.8s2.7-2.4 5.5-5.8c3.7-4.5 6.5-9.6 6.5-14.1C30 7.1 24.6 2 18 2Z"
          fill={fill}
        />
        <circle cx="18" cy="14" r="5" fill="#fff" />
      </svg>
    </span>
  );
}

function MapPinGrey({ className }) {
  return (
    <span className={`map-pin map-pin--grey ${className ?? ""}`} aria-hidden>
      <svg className="map-pin__shape map-pin__shape--sm" viewBox="0 0 36 44" width="22" height="28">
        <path
          d="M18 4c-5.5 0-10 4.3-10 9.6 0 3.8 2.3 8 5.4 11.7 2.2 2.7 4.6 4.7 4.6 4.7s2.4-2 4.6-4.7c3.1-3.7 5.4-7.9 5.4-11.7C28 8.3 23.5 4 18 4Z"
          fill="#9a9a9a"
        />
        <circle cx="18" cy="13.5" r="3.2" fill="#fff" />
      </svg>
    </span>
  );
}

function HeroMapCard() {
  return (
    <div className="report-card">
      <div className="report-card__eyebrow">
        <span className="report-card__dot" aria-hidden />
        Rapport d&apos;implantation
      </div>

      <div className="mini-map" aria-hidden>
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

        <div className="mini-map__subject-wrap">
          <span className="mini-map__pulse" />
          <MapPinMarker variant="subject" letter="A" />
        </div>

        <MapPinMarker variant="competitor" letter="B" className="mini-map__pin-b" />
        <MapPinMarker variant="competitor" letter="C" className="mini-map__pin-c" />

        <MapPinGrey className="mini-map__grey mini-map__grey--1" />
        <MapPinGrey className="mini-map__grey mini-map__grey--2" />
        <MapPinGrey className="mini-map__grey mini-map__grey--3" />
        <MapPinGrey className="mini-map__grey mini-map__grey--4" />

        <div className="mini-map__tooltip">
          <span className="mini-map__tooltip-label">Concurrence directe</span>
          <span className="mini-map__tooltip-num">3</span>
          <span className="mini-map__tooltip-sub">à 500 m</span>
        </div>
      </div>

      <div className="report-card__loc">
        <div>
          <p className="report-card__loc-label">
            Local recommandé <span className="report-card__loc-sep">•</span> Paris 9e
          </p>
          <p className="report-card__addr">28 rue des Martyrs</p>
        </div>
        <div className="score-pill">
          <span className="score-pill__line">
            <span className="score-pill__num">92</span>
            <span className="score-pill__sep"> / </span>
            <span className="score-pill__max">100</span>
          </span>
          <span className="score-pill__lbl">Score Mie</span>
        </div>
      </div>

      <div className="report-card__stats">
        <div className="stat-grid">
          <div className="stat-tile">
            <span className="stat-tile__icon-wrap">
              <IconUsers />
            </span>
            <div>
              <p className="stat-tile__val">4 200</p>
              <p className="stat-tile__lbl">Habitants 5 min</p>
            </div>
          </div>
          <div className="stat-tile">
            <span className="stat-tile__icon-wrap">
              <IconChart />
            </span>
            <div>
              <p className="stat-tile__val">+18 %</p>
              <p className="stat-tile__lbl">Flux week-end</p>
            </div>
          </div>
          <div className="stat-tile">
            <span className="stat-tile__icon-wrap">
              <IconHouse />
            </span>
            <div>
              <p className="stat-tile__val">3</p>
              <p className="stat-tile__lbl">Boulangeries 500m</p>
            </div>
          </div>
          <div className="stat-tile">
            <span className="stat-tile__icon-wrap">
              <IconEuro />
            </span>
            <div>
              <p className="stat-tile__val">320 €/m²</p>
              <p className="stat-tile__lbl">Loyer estimé</p>
            </div>
          </div>
        </div>
      </div>

      <div className="report-card__footer">
        <div className="report-card__legend">
          <span className="report-card__legend-item">
            <span className="report-card__legend-dot report-card__legend-dot--red" aria-hidden />
            Local étudié
          </span>
          <span className="report-card__legend-item">
            <span className="report-card__legend-dot report-card__legend-dot--green" aria-hidden />
            Concurrents
          </span>
        </div>
        <a href="#pistes" className="report-card__more">
          +8 autres pistes
        </a>
      </div>
    </div>
  );
}

function IconUsers() {
  return (
    <svg className="stat-tile__ico" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconChart() {
  return (
    <svg className="stat-tile__ico" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3 3v18h18M7 16l4-4 4 4 6-6" />
    </svg>
  );
}

function IconHouse() {
  return (
    <svg className="stat-tile__ico" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5Z" />
    </svg>
  );
}

function IconEuro() {
  return (
    <svg
      className="stat-tile__ico"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    >
      <path d="M17 8.5A6.5 6.5 0 0 0 7 8.5M7 15.5a6.5 6.5 0 0 0 10 0" />
      <path d="M5 10.5h7M5 13.5h7" />
    </svg>
  );
}

function SectionMapIllustration() {
  return (
    <div className="feature-map" aria-hidden>
      <div className="feature-map__inner">
        <div className="feature-map__base" />
        <div className="feature-map__grid" />
        <div className="feature-map__footprints">
          <span className="feature-map__fp feature-map__fp--1" />
          <span className="feature-map__fp feature-map__fp--2" />
          <span className="feature-map__fp feature-map__fp--3" />
        </div>
        <div className="feature-map__road feature-map__road--h" />
        <div className="feature-map__road feature-map__road--v" />
        <div className="feature-map__parc">Parc</div>
        <div className="feature-map__subject-wrap">
          <span className="feature-map__pulse" />
          <MapPinMarker variant="subject" letter="A" />
        </div>
        <MapPinMarker variant="competitor" letter="B" className="feature-map__pin-b" />
        <MapPinMarker variant="competitor" letter="C" className="feature-map__pin-c" />
        <MapPinGrey className="feature-map__grey feature-map__grey--1" />
        <MapPinGrey className="feature-map__grey feature-map__grey--2" />
        <MapPinGrey className="feature-map__grey feature-map__grey--3" />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="page">
      <header className="hero">
        <div className="hero__bg" role="presentation" />
        <div className="hero__overlay" role="presentation" />

        <nav className="nav">
          <Logo />
          <div className="nav__pill">
            <a href="#methode">La méthode</a>
            <a href="#carte">La carte</a>
            <a href="#tarifs">Tarifs</a>
          </div>
          <div className="nav__actions">
            <a href="#connexion" className="nav__link">
              Connexion
            </a>
            <a href="#demarrer" className="btn btn--dark btn--sm">
              Démarrer
              <span className="btn__arrow" aria-hidden>
                →
              </span>
            </a>
          </div>
        </nav>

        <div className="hero__layout">
          <div className="hero__copy">
            <h1 className="hero__title">
              Trouvez l&apos;endroit.
              <span className="hero__title-accent">Trouvez le secteur.</span>
            </h1>
            <p className="hero__lead">
              Mie aide à choisir où ouvrir votre boulangerie : concurrence, flux piétons, typologie du
              quartier et locaux disponibles — synthétisés dans un rapport clair.
            </p>
            <a href="#recherche" className="btn btn--hero">
              Lancer une recherche
            </a>
          </div>
          <div className="hero__aside">
            <HeroMapCard />
          </div>
        </div>
      </header>

      <section className="method" id="methode">
        <p className="eyebrow eyebrow--bronze">Comment ça marche</p>
        <h2 className="section-title">De l&apos;intuition à la décision, en trois étapes.</h2>

        <div className="method__grid">
          <article className="step-card">
            <span className="step-card__num">01</span>
            <h3 className="step-card__title">Décrivez votre projet</h3>
            <p className="step-card__text">
              Surface souhaitée, type de clientèle, style de boulangerie, budget loyer. Un onboarding court
              de 4 minutes.
            </p>
          </article>
          <article className="step-card">
            <span className="step-card__num">02</span>
            <h3 className="step-card__title">On scanne le terrain</h3>
            <p className="step-card__text">
              Concurrence existante, flux piétons, mix démographique, dynamiques commerciales du quartier.
              Données croisées en temps réel.
            </p>
          </article>
          <article className="step-card">
            <span className="step-card__num">03</span>
            <h3 className="step-card__title">Choisissez en confiance</h3>
            <p className="step-card__text">
              Une carte des locaux disponibles classés par compatibilité, avec les forces et faiblesses de
              chaque rue.
            </p>
          </article>
        </div>

        <div className="feature" id="carte">
          <SectionMapIllustration />
          <div className="feature__copy">
            <p className="eyebrow eyebrow--bronze">La carte au cœur</p>
            <h2 className="section-title">Voyez chaque rue comme un boulanger.</h2>
            <p className="feature__text">
              Notre carte interactive croise plus de quarante indicateurs : densité résidentielle, âge médian,
              présence de bureaux, écoles, transports, concurrence directe et indirecte, saisonnalité
              touristique. Chaque local est positionné dans son contexte réel — pas seulement sur un plan,
              mais dans la vie du quartier.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
