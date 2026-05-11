import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const LANGUAGE_STORAGE_KEY = "bloomspot-lang-v1";
const SUPPORTED_LANGS = ["fr", "en"];
const DEFAULT_LANG = "fr";

const TRANSLATIONS = {
  fr: {
    nav: {
      method: "La méthode",
      map: "La carte",
      pricing: "Tarifs",
      login: "Connexion",
      logout: "Déconnexion",
      account: "Mon compte",
      langSwitchAria: "Choisir la langue",
      french: "Français",
      english: "Anglais",
    },
    concepts: {
      tradition: "Boulangerie de tradition",
      auteur: "Boulangerie artisan",
      bio: "Boulangerie engagée",
      snacking: "Snacking & coffee",
    },
    clienteles: {
      familles: "Familles",
      bureaux: "Actifs en bureau",
      etudiants: "Étudiants",
      touristes: "Touristes & passage",
      seniors: "Seniors",
      csp: "CSP+ exigeants",
    },
    summaryFallbacks: {
      area: "Secteur non précisé",
      concept: "Concept non précisé",
      clientele: "Clientèle non précisée",
      surface: "Surface non précisée",
      budget: "Budget non précisé",
      unknownDate: "Date inconnue",
    },
    account: {
      title: "Mon compte",
      close: "Fermer",
      tabSearches: "Mes recherches",
      tabSettings: "Paramètres",
      empty: "Aucune recherche enregistrée pour le moment.",
      reopen: "Revenir à cette recherche",
      session: "Session",
      guest: "Compte invité",
      preferences: "Préférences de recherche",
      defaultCity: "Ville par défaut",
      defaultCityPlaceholder: "Ex: Paris 11e",
      priorityClientele: "Clientèle prioritaire",
      emailAlerts: "Alertes email quand de nouveaux locaux correspondent",
      weeklyDigest: "Recevoir un digest hebdomadaire du marché",
      savePrefs: "Enregistrer les préférences",
      prefsSaved: "Préférences enregistrées.",
      data: "Données",
      exportJson: "Exporter mes recherches (JSON)",
      clearHistory: (n) => `Vider l'historique (${n})`,
    },
    hero: {
      eyebrow: "Rapport d'implantation",
      titleLine1: "Trouvez l'endroit.",
      titleLine2: "Trouvez le secteur.",
      lead:
        "BloomSpot aide à choisir où ouvrir votre boulangerie : concurrence, flux piétons, typologie du quartier et locaux disponibles — synthétisés dans un rapport clair.",
      cta: "Lancer une recherche",
    },
    miniMap: {
      tooltipLabel: "Concurrence directe",
      tooltipSub: "à 500 m",
      park: "Parc",
      recommended: "Local recommandé",
      address: "28 rue des Martyrs",
      score: "Score BloomSpot",
      residents: "Habitants 5 min",
      weekendFlux: "Flux week-end",
      bakeries: "Boulangeries 500m",
      estimatedRent: "Loyer estimé",
      legendStudied: "Local étudié",
      legendCompetitors: "Concurrents",
      moreLeads: "+8 autres pistes",
    },
    method: {
      eyebrow: "Comment ça marche",
      title: "De l'intuition à la décision, en trois étapes.",
      step1Title: "Décrivez votre projet",
      step1Text:
        "Surface souhaitée, type de clientèle, style de boulangerie, budget loyer. Un onboarding court de 4 minutes.",
      step2Title: "On scanne le terrain",
      step2Text:
        "Concurrence existante, flux piétons, mix démographique, dynamiques commerciales du quartier. Données croisées en temps réel.",
      step3Title: "Choisissez en confiance",
      step3Text:
        "Une carte des locaux disponibles classés par compatibilité, avec les forces et faiblesses de chaque rue.",
      featureEyebrow: "La carte au cœur",
      featureTitle: "Voyez chaque rue comme un boulanger.",
      featureText:
        "Notre carte interactive croise plus de quarante indicateurs : densité résidentielle, âge médian, présence de bureaux, écoles, transports, concurrence directe et indirecte, saisonnalité touristique. Chaque local est positionné dans son contexte réel — pas seulement sur un plan, mais dans la vie du quartier.",
    },
    quiz: {
      phases: {
        ville: "Ville",
        local: "Local",
        concept: "Concept",
        clientele: "Clientèle",
        atouts: "Atouts",
      },
      stepLabel: (current, total) => `Étape ${current} / ${total}`,
      step0Title: "Où cherchez-vous ?",
      cityLabel: "Ville ou quartier",
      cityPlaceholder: "ex. Paris 11e arrondissement",
      suggestionsLabel: "Suggestions populaires",
      step1Title: "Surface & budget",
      surfaceLabel: "Surface souhaitée",
      budgetLabel: "Budget loyer mensuel",
      step2Title: "Quel style de boulangerie ?",
      step3Title: "À qui vous adressez-vous ?",
      step4Title: "Que recherchez-vous dans le quartier ?",
      back: "← Retour",
      cancel: "Annuler",
      next: "Continuer",
      submit: "Lancer la recherche",
      submitting: "Enregistrement...",
      submitError: "Impossible d'enregistrer pour l'instant. Réessayez.",
      surfaces: ["< 50 m²", "50-80 m²", "80-120 m²", "> 120 m²"],
      loyers: ["< 2 500 €/mois", "2 500-4 000 €", "4 000-6 000 €", "> 6 000 €"],
      styles: {
        tradition: { title: "Tradition", desc: "Pain quotidien, viennoiseries classiques, prix accessibles" },
        auteur: { title: "Artisan d'auteur", desc: "Levain, farines anciennes, sélection pointue" },
        bio: { title: "Bio & engagée", desc: "Filières courtes, vrac, démarche écologique" },
        snacking: { title: "Snacking & coffee", desc: "Sandwichs, cafés de spécialité, formules midi" },
      },
      clientelesDesc: {
        familles: { title: "Familles", desc: "Habitat résidentiel, écoles à proximité" },
        bureaux: { title: "Actifs en bureau", desc: "Déjeuner rapide, click & collect" },
        etudiants: { title: "Étudiants", desc: "Prix accessibles, formules snacking" },
        touristes: { title: "Touristes & passage", desc: "Centre-ville, gares, monuments" },
        seniors: { title: "Seniors", desc: "Habitués, fidélité forte, classiques" },
        csp: { title: "CSP+ exigeants", desc: "Bio, levain, produits d'exception" },
      },
      atouts: {
        flux: { title: "Fort flux piéton", desc: "Rue passante, axe commerçant" },
        concurrence: { title: "Peu de concurrence", desc: "Pas de boulangerie à moins de 300m" },
        transports: { title: "Proche transports", desc: "Métro, RER, gare à 5 min" },
        stationnement: { title: "Stationnement aisé", desc: "Place pour la livraison & clients" },
        terrasse: { title: "Possibilité terrasse", desc: "Trottoir large, exposition" },
        mutation: { title: "Quartier en mutation", desc: "Nouveaux logements, dynamique" },
      },
    },
    report: {
      eyebrow: "Rapport d'implantation",
      sub: "3 locaux compatibles · Mise à jour il y a 2 minutes",
      marketLabel: "Prix immobiliers département",
      marketUnavailable: "Non disponible",
      unknownDept: "Département inconnu",
      noMarketData: "Aucune donnée trouvée pour cette ville dans la table Supabase.",
      sourcePrefix: " · source ",
      exportPdf: "Exporter PDF",
      refine: "Affiner",
      listTitle: "Locaux classés par compatibilité",
      surface: "Surface",
      rent: "Loyer",
      competition: "Concur.",
      pedestrianFlux: "Flux piéton",
      competitors500: "Concurrents 500m",
      localTag: (id) => `Local ${id}`,
      strengths: "Atouts du quartier",
      attention: "Points d'attention",
      typoTitle: "Typologie du secteur",
      typoSub: (zone) => `Analyse croisée INSEE + relevés terrain · ${zone}`,
      requestVisit: "Demander une visite",
      saveLocal: "Sauvegarder ce local",
      typoLabels: {
        families: "Familles avec enfants",
        spending: "Pouvoir d'achat (vs moy.)",
        saturation: "Saturation boulangerie",
        offices: "Actifs en bureau",
        tourists: "Touristes & passage",
        commerce: "Dynamique commerce",
      },
      flux: {
        veryStrong: "Très fort",
        strong: "Fort",
        moderate: "Modéré",
      },
      neighborhoods: {
        sopi: "Paris 9e — SoPi",
        pigalle: "Paris 9e — Pigalle",
        bastille: "Paris 12e — Bastille",
      },
      addresses: {
        martyrs: "23 rue des Martyrs",
        loretteEs: "17 rue Notre-Dame de Lorette",
        faubourg: "44 rue du Faubourg Saint-Antoine",
      },
      atoutsA: [
        "Rue piétonne très commerçante, flux soutenu de 8h à 20h",
        "Mix résidentiel CSP+ et touristes de proximité",
        "1 seule boulangerie concurrente à 280m, gamme classique",
        "Forte présence de cafés et épiceries fines complémentaires",
      ],
      pointsA: ["Loyer dans la fourchette haute du quartier", "Stationnement livraison limité"],
      atoutsB: [
        "Axe piéton dense en semaine, bonne visibilité vitrine",
        "Clientèle de quartier et bureaux à proximité",
        "Concurrence modérée sur la gamme snacking",
      ],
      pointsB: ["Surface plus compacte pour labo + vente", "Livraisons en matinée à anticiper"],
      atoutsC: [
        "Quartier mixte commerce / résidentiel",
        "Bonnes dessertes transports et axes secondaires",
      ],
      pointsC: ["Plus de concurrents sur 500m", "Rénovation façade à prévoir"],
    },
    auth: {
      titleSignin: "Connexion",
      titleSignup: "Créer un compte",
      submitSignin: "Se connecter",
      submitSignup: "Créer un compte",
      email: "Email",
      password: "Mot de passe",
      loading: "Chargement...",
      switchToSignup: "Pas encore de compte ? Créer un compte",
      switchToSignin: "Déjà un compte ? Se connecter",
      signupSuccess: "Compte créé. Vérifiez vos emails pour confirmer votre adresse.",
      genericError: "Erreur de connexion.",
      close: "Fermer",
    },
    dateLocale: "fr-FR",
  },
  en: {
    nav: {
      method: "Method",
      map: "Map",
      pricing: "Pricing",
      login: "Sign in",
      logout: "Sign out",
      account: "My account",
      langSwitchAria: "Choose language",
      french: "French",
      english: "English",
    },
    concepts: {
      tradition: "Traditional bakery",
      auteur: "Artisan bakery",
      bio: "Sustainable bakery",
      snacking: "Snacking & coffee",
    },
    clienteles: {
      familles: "Families",
      bureaux: "Office workers",
      etudiants: "Students",
      touristes: "Tourists & footfall",
      seniors: "Seniors",
      csp: "Discerning professionals",
    },
    summaryFallbacks: {
      area: "Unspecified area",
      concept: "Unspecified concept",
      clientele: "Unspecified clientele",
      surface: "Unspecified surface",
      budget: "Unspecified budget",
      unknownDate: "Unknown date",
    },
    account: {
      title: "My account",
      close: "Close",
      tabSearches: "My searches",
      tabSettings: "Settings",
      empty: "No saved searches yet.",
      reopen: "Reopen this search",
      session: "Session",
      guest: "Guest account",
      preferences: "Search preferences",
      defaultCity: "Default city",
      defaultCityPlaceholder: "e.g. Paris 11th",
      priorityClientele: "Priority clientele",
      emailAlerts: "Email alerts when new spaces match",
      weeklyDigest: "Receive a weekly market digest",
      savePrefs: "Save preferences",
      prefsSaved: "Preferences saved.",
      data: "Data",
      exportJson: "Export my searches (JSON)",
      clearHistory: (n) => `Clear history (${n})`,
    },
    hero: {
      eyebrow: "Location report",
      titleLine1: "Find the spot.",
      titleLine2: "Find the area.",
      lead:
        "BloomSpot helps you choose where to open your bakery: competition, foot traffic, neighborhood profile and available spaces — synthesized into a clear report.",
      cta: "Start a search",
    },
    miniMap: {
      tooltipLabel: "Direct competition",
      tooltipSub: "within 500 m",
      park: "Park",
      recommended: "Recommended space",
      address: "28 rue des Martyrs",
      score: "BloomSpot score",
      residents: "Residents 5 min",
      weekendFlux: "Weekend traffic",
      bakeries: "Bakeries 500m",
      estimatedRent: "Estimated rent",
      legendStudied: "Studied space",
      legendCompetitors: "Competitors",
      moreLeads: "+8 more leads",
    },
    method: {
      eyebrow: "How it works",
      title: "From hunch to decision, in three steps.",
      step1Title: "Describe your project",
      step1Text:
        "Desired surface, type of clientele, bakery style, rent budget. A short 4-minute onboarding.",
      step2Title: "We scan the ground",
      step2Text:
        "Existing competition, foot traffic, demographic mix, neighborhood retail dynamics. Real-time cross-referenced data.",
      step3Title: "Choose with confidence",
      step3Text:
        "A map of available spaces ranked by compatibility, with the strengths and weaknesses of each street.",
      featureEyebrow: "The map at the core",
      featureTitle: "See every street like a baker.",
      featureText:
        "Our interactive map cross-references over forty indicators: residential density, median age, office presence, schools, transit, direct and indirect competition, tourism seasonality. Each space is placed in its real context — not just on a plan, but in the life of the neighborhood.",
    },
    quiz: {
      phases: {
        ville: "City",
        local: "Space",
        concept: "Concept",
        clientele: "Clientele",
        atouts: "Strengths",
      },
      stepLabel: (current, total) => `Step ${current} / ${total}`,
      step0Title: "Where are you looking?",
      cityLabel: "City or neighborhood",
      cityPlaceholder: "e.g. Paris 11th arrondissement",
      suggestionsLabel: "Popular suggestions",
      step1Title: "Surface & budget",
      surfaceLabel: "Desired surface",
      budgetLabel: "Monthly rent budget",
      step2Title: "What style of bakery?",
      step3Title: "Who is your audience?",
      step4Title: "What do you want from the neighborhood?",
      back: "← Back",
      cancel: "Cancel",
      next: "Continue",
      submit: "Start the search",
      submitting: "Saving...",
      submitError: "Unable to save right now. Please try again.",
      surfaces: ["< 50 m²", "50-80 m²", "80-120 m²", "> 120 m²"],
      loyers: ["< €2,500/mo", "€2,500-4,000", "€4,000-6,000", "> €6,000"],
      styles: {
        tradition: { title: "Traditional", desc: "Daily bread, classic pastries, accessible prices" },
        auteur: { title: "Signature artisan", desc: "Sourdough, heritage flours, curated selection" },
        bio: { title: "Organic & sustainable", desc: "Short supply chains, bulk, eco-friendly approach" },
        snacking: { title: "Snacking & coffee", desc: "Sandwiches, specialty coffee, lunch combos" },
      },
      clientelesDesc: {
        familles: { title: "Families", desc: "Residential housing, schools nearby" },
        bureaux: { title: "Office workers", desc: "Quick lunch, click & collect" },
        etudiants: { title: "Students", desc: "Affordable prices, snacking combos" },
        touristes: { title: "Tourists & footfall", desc: "City center, stations, landmarks" },
        seniors: { title: "Seniors", desc: "Regulars, strong loyalty, classics" },
        csp: { title: "Discerning professionals", desc: "Organic, sourdough, premium products" },
      },
      atouts: {
        flux: { title: "High pedestrian traffic", desc: "Busy street, retail axis" },
        concurrence: { title: "Low competition", desc: "No bakery within 300m" },
        transports: { title: "Near transit", desc: "Metro, train, station within 5 min" },
        stationnement: { title: "Easy parking", desc: "Space for deliveries & customers" },
        terrasse: { title: "Terrace possible", desc: "Wide sidewalk, sun exposure" },
        mutation: { title: "Changing neighborhood", desc: "New housing, dynamic area" },
      },
    },
    report: {
      eyebrow: "Location report",
      sub: "3 compatible spaces · Updated 2 minutes ago",
      marketLabel: "Department property prices",
      marketUnavailable: "Not available",
      unknownDept: "Unknown department",
      noMarketData: "No data found for this city in the Supabase table.",
      sourcePrefix: " · source ",
      exportPdf: "Export PDF",
      refine: "Refine",
      listTitle: "Spaces ranked by compatibility",
      surface: "Surface",
      rent: "Rent",
      competition: "Compet.",
      pedestrianFlux: "Foot traffic",
      competitors500: "Competitors 500m",
      localTag: (id) => `Space ${id}`,
      strengths: "Neighborhood strengths",
      attention: "Watch outs",
      typoTitle: "Sector profile",
      typoSub: (zone) => `INSEE cross-analysis + field surveys · ${zone}`,
      requestVisit: "Request a visit",
      saveLocal: "Save this space",
      typoLabels: {
        families: "Families with children",
        spending: "Purchasing power (vs avg.)",
        saturation: "Bakery saturation",
        offices: "Office workers",
        tourists: "Tourists & footfall",
        commerce: "Retail dynamism",
      },
      flux: {
        veryStrong: "Very high",
        strong: "High",
        moderate: "Moderate",
      },
      neighborhoods: {
        sopi: "Paris 9th — SoPi",
        pigalle: "Paris 9th — Pigalle",
        bastille: "Paris 12th — Bastille",
      },
      addresses: {
        martyrs: "23 rue des Martyrs",
        loretteEs: "17 rue Notre-Dame de Lorette",
        faubourg: "44 rue du Faubourg Saint-Antoine",
      },
      atoutsA: [
        "Very lively pedestrian street, sustained traffic from 8am to 8pm",
        "Mix of upscale residents and local tourists",
        "Only 1 competing bakery 280m away, classic range",
        "Strong presence of complementary cafés and fine grocers",
      ],
      pointsA: ["Rent at the higher end of the neighborhood", "Limited delivery parking"],
      atoutsB: [
        "Dense pedestrian axis on weekdays, great storefront visibility",
        "Local and office clientele nearby",
        "Moderate competition on snacking range",
      ],
      pointsB: ["More compact surface for kitchen + retail", "Morning deliveries to plan ahead"],
      atoutsC: [
        "Mixed retail / residential neighborhood",
        "Good transit access and secondary axes",
      ],
      pointsC: ["More competitors within 500m", "Façade renovation needed"],
    },
    auth: {
      titleSignin: "Sign in",
      titleSignup: "Create an account",
      submitSignin: "Sign in",
      submitSignup: "Create account",
      email: "Email",
      password: "Password",
      loading: "Loading...",
      switchToSignup: "No account yet? Create one",
      switchToSignin: "Already have an account? Sign in",
      signupSuccess: "Account created. Check your emails to confirm your address.",
      genericError: "Sign-in error.",
      close: "Close",
    },
    dateLocale: "en-US",
  },
};

function readStoredLang() {
  if (typeof window === "undefined") return DEFAULT_LANG;
  try {
    const raw = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (raw && SUPPORTED_LANGS.includes(raw)) return raw;
  } catch (error) {
    console.warn("Unable to read stored language.", error);
  }
  return DEFAULT_LANG;
}

const LanguageContext = createContext({
  lang: DEFAULT_LANG,
  setLang: () => {},
  t: TRANSLATIONS[DEFAULT_LANG],
});

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => readStoredLang());

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("lang", lang);
    }
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch (error) {
      console.warn("Unable to persist language.", error);
    }
  }, [lang]);

  const setLang = useCallback((next) => {
    if (SUPPORTED_LANGS.includes(next)) setLangState(next);
  }, []);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t: TRANSLATIONS[lang] || TRANSLATIONS[DEFAULT_LANG],
    }),
    [lang, setLang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useTranslation() {
  return useContext(LanguageContext);
}

export function LanguageToggle({ className = "" }) {
  const { lang, setLang, t } = useTranslation();
  return (
    <div
      className={`lang-toggle ${className}`.trim()}
      role="group"
      aria-label={t.nav.langSwitchAria}
    >
      <button
        type="button"
        className={`lang-toggle__btn ${lang === "fr" ? "lang-toggle__btn--active" : ""}`}
        onClick={() => setLang("fr")}
        aria-pressed={lang === "fr"}
        aria-label={t.nav.french}
      >
        FR
      </button>
      <button
        type="button"
        className={`lang-toggle__btn ${lang === "en" ? "lang-toggle__btn--active" : ""}`}
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        aria-label={t.nav.english}
      >
        EN
      </button>
    </div>
  );
}
