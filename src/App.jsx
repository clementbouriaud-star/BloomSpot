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

function HeroMapCard() {
  return (
    <div className="report-card">
      <div className="report-card__eyebrow">
        <span className="report-card__dot" aria-hidden />
        Rapport d&apos;implantation
      </div>

      <div className="mini-map" aria-hidden>
        <div className="mini-map__blocks">
          {Array.from({ length: 18 }).map((_, i) => (
            <span key={i} className="mini-map__blk" />
          ))}
        </div>
        <div className="mini-map__street mini-map__street--h" />
        <div className="mini-map__street mini-map__street--v" />
        <div className="mini-map__parc">Parc</div>
        <span className="mini-map__pin mini-map__pin--a">A</span>
        <span className="mini-map__pin mini-map__pin--c">C</span>
        <span className="mini-map__dot mini-map__dot--1" />
        <span className="mini-map__dot mini-map__dot--2" />
        <span className="mini-map__dot mini-map__dot--3" />
        <div className="mini-map__tooltip">
          <span className="mini-map__tooltip-label">Concurrence directe</span>
          <span className="mini-map__tooltip-num">3</span>
          <span className="mini-map__tooltip-sub">à 500 m</span>
        </div>
      </div>

      <div className="report-card__loc">
        <div>
          <p className="report-card__loc-label">Local recommandé — Paris 9e</p>
          <p className="report-card__addr">28 rue des Martyrs</p>
        </div>
        <div className="score-pill">
          <span className="score-pill__num">92</span>
          <span className="score-pill__sep">/</span>
          <span className="score-pill__max">100</span>
          <span className="score-pill__lbl">Score Mie</span>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-tile">
          <IconUsers />
          <div>
            <p className="stat-tile__val">4 200</p>
            <p className="stat-tile__lbl">Habitants 5 min</p>
          </div>
        </div>
        <div className="stat-tile">
          <IconChart />
          <div>
            <p className="stat-tile__val">+18 %</p>
            <p className="stat-tile__lbl">Flux week-end</p>
          </div>
        </div>
        <div className="stat-tile">
          <IconStore />
          <div>
            <p className="stat-tile__val">3</p>
            <p className="stat-tile__lbl">Boulangeries 500m</p>
          </div>
        </div>
        <div className="stat-tile">
          <IconEqual />
          <div>
            <p className="stat-tile__val">320 €/m²</p>
            <p className="stat-tile__lbl">Loyer estimé</p>
          </div>
        </div>
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

function IconStore() {
  return (
    <svg className="stat-tile__ico" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
      <path d="M3 9 5 3h14l2 6M9 13h6" />
    </svg>
  );
}

function IconEqual() {
  return (
    <svg className="stat-tile__ico" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M5 9h14M5 15h14" />
    </svg>
  );
}

function SectionMapIllustration() {
  return (
    <div className="feature-map" aria-hidden>
      <div className="feature-map__inner">
        <div className="feature-map__blocks">
          {Array.from({ length: 24 }).map((_, i) => (
            <span key={i} className="feature-map__blk" />
          ))}
        </div>
        <div className="feature-map__blob" />
        <div className="feature-map__zone" />
        <span className="feature-map__pin">B</span>
        <span className="feature-map__dot feature-map__dot--1" />
        <span className="feature-map__dot feature-map__dot--2" />
        <span className="feature-map__dot feature-map__dot--3" />
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
