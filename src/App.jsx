import { useEffect, useState } from "react";
import Questionnaire from "./Questionnaire.jsx";
import Report from "./Report.jsx";
import { MapPinMarker, MapPinGrey } from "./MapPins.jsx";
import { BrandLogoLink } from "./BrandLogo.jsx";
import { getImmoPriceContext, saveQuestionnaire, saveReport } from "./lib/supabaseApi";
import AuthModal from "./AuthModal.jsx";
import { getCurrentSession, onAuthChange, signOutAuth } from "./lib/supabaseAuth";
import { LanguageToggle, useTranslation } from "./lib/i18n.jsx";

const HISTORY_STORAGE_KEY = "bloomspot-search-history-v1";
const SETTINGS_STORAGE_KEY = "bloomspot-account-settings-v1";

const DEFAULT_SETTINGS = {
  defaultCity: "",
  defaultClientele: "familles",
  emailAlerts: true,
  weeklyDigest: false,
};

function readHistoryStorage() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((entry) => entry && entry.id && entry.reportData);
  } catch (error) {
    console.warn("Unable to read search history.", error);
    return [];
  }
}

function writeHistoryStorage(history) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.warn("Unable to save search history.", error);
  }
}

function readSettingsStorage() {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SETTINGS,
      ...(parsed && typeof parsed === "object" ? parsed : {}),
    };
  } catch (error) {
    console.warn("Unable to read account settings.", error);
    return DEFAULT_SETTINGS;
  }
}

function writeSettingsStorage(settings) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.warn("Unable to save account settings.", error);
  }
}

function exportSearchHistory(history) {
  if (typeof window === "undefined") return;
  const payload = {
    exportedAt: new Date().toISOString(),
    total: history.length,
    searches: history,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `bloomspot-recherches-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function formatHistoryDate(isoString, locale, fallback) {
  if (!isoString) return fallback;
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return fallback;
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function buildSearchSummary(payload) {
  return {
    ville: payload.ville || "",
    conceptKey: payload.concept || "",
    clienteleKey: payload.clientele || "",
    surface: payload.surface || "",
    loyer: payload.loyer || "",
  };
}

function AccountMenu({ session, searchHistory, onAuthOpen, onLogout, onOpenSearch, onClearHistory, onExportHistory }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("searches");
  const [settings, setSettings] = useState(() => readSettingsStorage());
  const [settingsNotice, setSettingsNotice] = useState("");

  useEffect(() => {
    if (!isOpen) setActiveTab("searches");
  }, [isOpen]);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSettingsNotice("");
  };

  const saveSettings = () => {
    writeSettingsStorage(settings);
    setSettingsNotice(t.account.prefsSaved);
  };

  const accountLabel = session?.user?.email || t.account.guest;

  return (
    <div className="account-menu">
      <button type="button" className="btn btn--dark btn--sm" onClick={() => setIsOpen((prev) => !prev)}>
        {t.account.title}
      </button>
      {isOpen ? (
        <div className="account-panel" role="dialog" aria-label={t.account.title}>
          <div className="account-panel__head">
            <p className="account-panel__title">{t.account.title}</p>
            <button type="button" className="account-panel__close" onClick={() => setIsOpen(false)} aria-label={t.account.close}>
              ×
            </button>
          </div>
          <div className="account-panel__tabs" role="tablist">
            <button
              type="button"
              role="tab"
              className={`account-panel__tab ${activeTab === "searches" ? "account-panel__tab--active" : ""}`}
              onClick={() => setActiveTab("searches")}
              aria-selected={activeTab === "searches"}
            >
              {t.account.tabSearches}
            </button>
            <button
              type="button"
              role="tab"
              className={`account-panel__tab ${activeTab === "settings" ? "account-panel__tab--active" : ""}`}
              onClick={() => setActiveTab("settings")}
              aria-selected={activeTab === "settings"}
            >
              {t.account.tabSettings}
            </button>
          </div>

          {activeTab === "searches" ? (
            <div className="account-panel__body">
              {searchHistory.length === 0 ? (
                <p className="account-panel__empty">{t.account.empty}</p>
              ) : (
                <ul className="search-history">
                  {searchHistory.map((entry) => {
                    const summary = entry.summary || {};
                    const villeLabel = summary.ville || t.summaryFallbacks.area;
                    const conceptLabel = summary.conceptKey
                      ? t.concepts[summary.conceptKey] || t.summaryFallbacks.concept
                      : t.summaryFallbacks.concept;
                    const clienteleLabel = summary.clienteleKey
                      ? t.clienteles[summary.clienteleKey] || t.summaryFallbacks.clientele
                      : t.summaryFallbacks.clientele;
                    const surfaceLabel = summary.surface || t.summaryFallbacks.surface;
                    const loyerLabel = summary.loyer || t.summaryFallbacks.budget;
                    return (
                      <li key={entry.id} className="search-history__item">
                        <div className="search-history__meta">
                          <p className="search-history__title">{villeLabel}</p>
                          <p className="search-history__line">
                            {conceptLabel} · {clienteleLabel}
                          </p>
                          <p className="search-history__line">
                            {surfaceLabel} · {loyerLabel}
                          </p>
                          <p className="search-history__date">
                            {formatHistoryDate(entry.createdAt, t.dateLocale, t.summaryFallbacks.unknownDate)}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="search-history__open"
                          onClick={() => {
                            onOpenSearch(entry);
                            setIsOpen(false);
                          }}
                        >
                          {t.account.reopen}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ) : (
            <div className="account-panel__body">
              <div className="settings-section">
                <p className="account-panel__setting-label">{t.account.session}</p>
                <p className="account-panel__setting-value">{accountLabel}</p>
              </div>

              <div className="settings-section">
                <p className="account-panel__setting-label">{t.account.preferences}</p>
                <label className="settings-field">
                  <span>{t.account.defaultCity}</span>
                  <input
                    type="text"
                    value={settings.defaultCity}
                    onChange={(event) => updateSetting("defaultCity", event.target.value)}
                    placeholder={t.account.defaultCityPlaceholder}
                  />
                </label>
                <label className="settings-field">
                  <span>{t.account.priorityClientele}</span>
                  <select
                    value={settings.defaultClientele}
                    onChange={(event) => updateSetting("defaultClientele", event.target.value)}
                  >
                    {Object.entries(t.clienteles).map(([id, label]) => (
                      <option key={id} value={id}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="settings-toggle">
                  <input
                    type="checkbox"
                    checked={settings.emailAlerts}
                    onChange={(event) => updateSetting("emailAlerts", event.target.checked)}
                  />
                  <span>{t.account.emailAlerts}</span>
                </label>
                <label className="settings-toggle">
                  <input
                    type="checkbox"
                    checked={settings.weeklyDigest}
                    onChange={(event) => updateSetting("weeklyDigest", event.target.checked)}
                  />
                  <span>{t.account.weeklyDigest}</span>
                </label>
                <button type="button" className="btn btn--dark account-panel__setting-btn" onClick={saveSettings}>
                  {t.account.savePrefs}
                </button>
                {settingsNotice ? <p className="settings-notice">{settingsNotice}</p> : null}
              </div>

              <div className="settings-section">
                <p className="account-panel__setting-label">{t.account.data}</p>
                <div className="settings-actions">
                  <button type="button" className="settings-btn settings-btn--ghost" onClick={onExportHistory}>
                    {t.account.exportJson}
                  </button>
                  <button type="button" className="settings-btn settings-btn--danger" onClick={onClearHistory}>
                    {t.account.clearHistory(searchHistory.length)}
                  </button>
                </div>
              </div>

              {session?.user ? (
                <button type="button" className="btn btn--dark account-panel__setting-btn" onClick={onLogout}>
                  {t.nav.logout}
                </button>
              ) : (
                <button type="button" className="btn btn--dark account-panel__setting-btn" onClick={onAuthOpen}>
                  {t.nav.login}
                </button>
              )}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

function HeroMapCard() {
  const { t } = useTranslation();
  return (
    <div className="report-card">
      <div className="report-card__eyebrow">
        <span className="report-card__dot" aria-hidden />
        {t.hero.eyebrow}
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
        <div className="mini-map__parc">{t.miniMap.park}</div>

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
          <span className="mini-map__tooltip-label">{t.miniMap.tooltipLabel}</span>
          <span className="mini-map__tooltip-num">3</span>
          <span className="mini-map__tooltip-sub">{t.miniMap.tooltipSub}</span>
        </div>
      </div>

      <div className="report-card__loc">
        <div>
          <p className="report-card__loc-label">
            {t.miniMap.recommended} <span className="report-card__loc-sep">•</span> Paris 9e
          </p>
          <p className="report-card__addr">{t.miniMap.address}</p>
        </div>
        <div className="score-pill">
          <span className="score-pill__line">
            <span className="score-pill__num">92</span>
            <span className="score-pill__sep"> / </span>
            <span className="score-pill__max">100</span>
          </span>
          <span className="score-pill__lbl">{t.miniMap.score}</span>
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
              <p className="stat-tile__lbl">{t.miniMap.residents}</p>
            </div>
          </div>
          <div className="stat-tile">
            <span className="stat-tile__icon-wrap">
              <IconChart />
            </span>
            <div>
              <p className="stat-tile__val">+18 %</p>
              <p className="stat-tile__lbl">{t.miniMap.weekendFlux}</p>
            </div>
          </div>
          <div className="stat-tile">
            <span className="stat-tile__icon-wrap">
              <IconHouse />
            </span>
            <div>
              <p className="stat-tile__val">3</p>
              <p className="stat-tile__lbl">{t.miniMap.bakeries}</p>
            </div>
          </div>
          <div className="stat-tile">
            <span className="stat-tile__icon-wrap">
              <IconEuro />
            </span>
            <div>
              <p className="stat-tile__val">320 €/m²</p>
              <p className="stat-tile__lbl">{t.miniMap.estimatedRent}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="report-card__footer">
        <div className="report-card__legend">
          <span className="report-card__legend-item">
            <span className="report-card__legend-dot report-card__legend-dot--red" aria-hidden />
            {t.miniMap.legendStudied}
          </span>
          <span className="report-card__legend-item">
            <span className="report-card__legend-dot report-card__legend-dot--green" aria-hidden />
            {t.miniMap.legendCompetitors}
          </span>
        </div>
        <a href="#pistes" className="report-card__more">
          {t.miniMap.moreLeads}
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
  const { t } = useTranslation();
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
        <div className="feature-map__parc">{t.miniMap.park}</div>
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
  const { t } = useTranslation();
  const [flow, setFlow] = useState("landing");
  const [reportData, setReportData] = useState(null);
  const [session, setSession] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [searchHistory, setSearchHistory] = useState(() => readHistoryStorage());

  useEffect(() => {
    writeHistoryStorage(searchHistory);
  }, [searchHistory]);

  useEffect(() => {
    let mounted = true;
    getCurrentSession()
      .then((nextSession) => {
        if (mounted) setSession(nextSession);
      })
      .catch((error) => console.warn("Unable to read current session.", error));

    const { data } = onAuthChange((nextSession) => setSession(nextSession));
    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOutAuth();
    } catch (error) {
      console.warn("Logout failed.", error);
    }
  };

  const openSavedSearch = (entry) => {
    if (!entry?.reportData) return;
    setReportData(entry.reportData);
    setFlow("report");
  };

  const accountMenu = (
    <AccountMenu
      session={session}
      searchHistory={searchHistory}
      onAuthOpen={() => setShowAuthModal(true)}
      onLogout={handleLogout}
      onOpenSearch={openSavedSearch}
      onClearHistory={() => setSearchHistory([])}
      onExportHistory={() => exportSearchHistory(searchHistory)}
    />
  );

  if (flow === "report" && reportData) {
    return (
      <Report
        data={reportData}
        session={session}
        accountMenu={accountMenu}
        onHome={() => {
          setReportData(null);
          setFlow("landing");
        }}
        onAuthOpen={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        onAffiner={() => {
          setReportData(null);
          setFlow("questionnaire");
        }}
      />
    );
  }

  if (flow === "questionnaire") {
    return (
      <Questionnaire
        session={session}
        accountMenu={accountMenu}
        onCancel={() => setFlow("landing")}
        onAuthOpen={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        onComplete={async (payload) => {
          const conceptLabel = t.concepts[payload.concept] || t.concepts.auteur;
          const reportTitle = `${payload.ville || "Paris"} — ${conceptLabel}`;
          const nextReportData = { ...payload, reportTitle };

          try {
            const immoPriceContext = await getImmoPriceContext(payload.ville);
            if (immoPriceContext) {
              nextReportData.marketPrice = immoPriceContext;
            }
          } catch (error) {
            console.warn("Unable to load immobilier price context.", error);
          }

          try {
            const questionnaire = await saveQuestionnaire(payload);
            const report = await saveReport({
              questionnaireId: questionnaire.id,
              title: reportTitle,
              payload: nextReportData,
            });

            nextReportData.db = {
              questionnaireId: questionnaire.id,
              reportId: report.id,
            };
          } catch (error) {
            console.warn("Supabase persistence failed.", error);
          }

          setReportData(nextReportData);
          setFlow("report");
          setSearchHistory((prev) => {
            const nextEntry = {
              id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
              createdAt: new Date().toISOString(),
              summary: buildSearchSummary(payload),
              reportData: nextReportData,
            };
            return [nextEntry, ...prev].slice(0, 20);
          });
        }}
      />
    );
  }

  return (
    <div className="page">
      <header className="hero">
        <div className="hero__bg" role="presentation" />
        <div className="hero__overlay" role="presentation" />

        <nav className="nav">
          <BrandLogoLink />
          <div className="nav__pill">
            <a href="#methode">{t.nav.method}</a>
            <a href="#carte">{t.nav.map}</a>
            <a href="#tarifs">{t.nav.pricing}</a>
          </div>
          <div className="nav__actions">
            <LanguageToggle />
            {session?.user ? (
              <button type="button" className="nav__link nav__link-btn" onClick={handleLogout}>
                {t.nav.logout}
              </button>
            ) : (
              <button type="button" className="nav__link nav__link-btn" onClick={() => setShowAuthModal(true)}>
                {t.nav.login}
              </button>
            )}
            {accountMenu}
          </div>
        </nav>

        <div className="hero__layout">
          <div className="hero__copy">
            <h1 className="hero__title">
              {t.hero.titleLine1}
              <span className="hero__title-accent">{t.hero.titleLine2}</span>
            </h1>
            <p className="hero__lead">{t.hero.lead}</p>
            <button type="button" className="btn btn--hero" onClick={() => setFlow("questionnaire")}>
              {t.hero.cta}
            </button>
          </div>
          <div className="hero__aside">
            <HeroMapCard />
          </div>
        </div>
      </header>

      <section className="method" id="methode">
        <p className="eyebrow eyebrow--bronze">{t.method.eyebrow}</p>
        <h2 className="section-title">{t.method.title}</h2>

        <div className="method__grid">
          <article className="step-card">
            <span className="step-card__num">01</span>
            <h3 className="step-card__title">{t.method.step1Title}</h3>
            <p className="step-card__text">{t.method.step1Text}</p>
          </article>
          <article className="step-card">
            <span className="step-card__num">02</span>
            <h3 className="step-card__title">{t.method.step2Title}</h3>
            <p className="step-card__text">{t.method.step2Text}</p>
          </article>
          <article className="step-card">
            <span className="step-card__num">03</span>
            <h3 className="step-card__title">{t.method.step3Title}</h3>
            <p className="step-card__text">{t.method.step3Text}</p>
          </article>
        </div>

        <div className="feature" id="carte">
          <SectionMapIllustration />
          <div className="feature__copy">
            <p className="eyebrow eyebrow--bronze">{t.method.featureEyebrow}</p>
            <h2 className="section-title">{t.method.featureTitle}</h2>
            <p className="feature__text">{t.method.featureText}</p>
          </div>
        </div>
      </section>
      {showAuthModal ? <AuthModal onClose={() => setShowAuthModal(false)} /> : null}
    </div>
  );
}
