# Bloomspot — Journal de progression

Ce fichier est mis à jour à chaque session. Il sert à la fois de référence personnelle et de contexte pour l'agent Claude.

---

## Stack technique actuelle

| Couche | Technologie |
|---|---|
| Framework UI | React 18.3 + Vite 5 (JSX — pas de TypeScript) |
| Backend / Auth | Supabase (`@supabase/supabase-js` v2) |
| Cartographie | react-leaflet v4 + leaflet |
| Déploiement | Vercel (déploiement auto sur `git push`) |
| i18n | Système custom React Context, FR / EN |
| State | React hooks natifs (pas de Redux / Zustand) |

### Variables d'environnement

- En local : `.env.local` à la racine
- En prod : Vercel → Settings → Environment Variables
- Noms : `VITE_SUPABASE_URL` et `VITE_SUPABASE_PUBLISHABLE_KEY`

---

## Tables Supabase existantes

| Table | Colonnes clés | Notes |
|---|---|---|
| `questionnaires` | ville, surface, loyer, concept, clientele, atouts[], user_id | Sauvegarde les formulaires soumis |
| `reports` | questionnaire_id, title, payload (JSONB), user_id | Rapports générés |
| `prix_immobiliers` | code_departement, prix_m2, departement | Table de référence immobilier |
| `carreaux_score` | id, score_final, score_revenu, score_population, score_concurrence, nb_boulangeries, revenu_moyen, population, taux_pietonne, geometry (JSONB Polygon WGS84) | 120 lignes — grille d'analyse du 11e |
| `boulangeries` | siret, nom, adresse, latitude, longitude | 193 boulangeries individuelles |
| `zones_accessibilite` | id, nom, type_zone, geometry (JSONB Polygon WGS84) | aire_pietonne / zone_rencontre / aire_mixte |

---

## Structure des fichiers clés

```
src/
├── lib/
│   ├── supabaseClient.js     # Initialisation client Supabase (peut être null si env vars absentes)
│   ├── supabaseApi.js        # Toutes les fonctions DB : saveQuestionnaire, saveReport,
│   │                         #   getCarreaux, getBoulangeries, getZonesAccessibilite,
│   │                         #   getImmoPriceContext
│   ├── supabaseAuth.js       # Auth : signIn, signUp, signOut, getCurrentSession, onAuthChange
│   └── i18n.jsx              # Traductions FR/EN via React Context
├── App.jsx                   # Point d'entrée — gère le flow landing → questionnaire → report
├── MapScore.jsx              # Carte interactive (carreaux + boulangeries + zones accessibilité)
├── Questionnaire.jsx         # Formulaire de recherche (ville, surface, loyer, concept, clientèle)
├── Report.jsx                # Rapport généré après le questionnaire
├── AuthModal.jsx             # Modal connexion / inscription via Supabase Auth
├── MapPins.jsx               # Composants SVG pins de carte (déco hero)
└── BrandLogo.jsx             # Logo Bloomspot
```

---

## Ce qui a été fait (par session)

### Session 1 — Mise en place Supabase + carte

- [x] Identification de la stack complète (React/Vite/JSX, Supabase, pas de TypeScript)
- [x] Création de `WORKFLOW_SUPABASE.md` — workflow obligatoire SQL → service → composant → checklist
- [x] Correction de la connexion Supabase sur Vercel : ajout des variables `VITE_` dans Vercel → Environment Variables (les variables sans préfixe `VITE_` ne sont pas exposées par Vite au navigateur)
- [x] Installation de `react-leaflet@4` + `leaflet` (v4 car le projet est sur React 18, la v5 nécessite React 19)
- [x] Création de `src/MapScore.jsx` avec :
  - Carreaux colorés par `score_final` (vert ≥ 66 / orange ≥ 33 / rouge < 33, opacité 0.55)
  - 193 points bleus boulangeries individuels (positions réelles lat/lng de la table `boulangeries`)
  - Couche zones d'accessibilité (aire piétonne / zone de rencontre / aire mixte) avec tooltip au survol
  - Légende sous la carte pour les types de zones
  - Fond de carte OpenStreetMap, centré sur le 11e (lat: 48.857, lng: 2.379, zoom: 14)
- [x] Ajout dans `supabaseApi.js` : `getCarreaux()`, `getBoulangeries()`, `getZonesAccessibilite()`
- [x] Intégration de `MapScore` dans `App.jsx` (remplace l'ancienne illustration CSS `SectionMapIllustration`)
- [x] Suppression du lien "Tarifs" dans la navigation

---

## Workflow de développement

```
1. Coder en local → npm run dev
2. Tester dans le navigateur (localhost:5173)
3. git add <fichiers> && git commit -m "message"
4. git push → Vercel redéploie automatiquement
```

Pour arrêter le serveur local : **Ctrl + C** dans le terminal.

---

## Règles à respecter (rappel agent)

- Les appels Supabase se font **uniquement** dans `src/lib/supabaseApi.js` ou `src/lib/supabaseAuth.js`
- Toujours tester le cas `!supabase` (client null si env vars manquantes)
- Tout changement DB → donner le SQL + mettre à jour le service + mettre à jour le composant
- Voir `WORKFLOW_SUPABASE.md` pour le détail complet
