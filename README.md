# LocalIQ — Plateforme d'aide à l'implantation commerciale

> Projet Hackathon — stack 100% gratuite, zéro coût API

---

## 🎯 Le projet en une phrase

LocalIQ aide les commerçants à choisir le meilleur emplacement pour leur commerce en analysant la concurrence, les flux piétons et la clientèle d'un secteur — via une interface simple en 3 étapes : landing → onboarding → carte + recommandations.

---

## 💸 Budget API : 0 €

Voici la vérité sur les coûts :

| Service | Gratuit ? | Notes |
|---|---|---|
| **React / Vite** | ✅ Gratuit | Frontend |
| **Google Maps JS API** | ✅ 200$/mois offerts | Largement suffisant pour un hackathon |
| **Google Places API** | ✅ Inclus dans les 200$ | Pour trouver les concurrents |
| **Claude / Anthropic API** | ❌ Payant | **À NE PAS UTILISER** — remplacé par des données mockées |
| **OpenStreetMap + Nominatim** | ✅ Totalement gratuit | Alternative à Google Maps si besoin |
| **Vercel / Netlify** | ✅ Gratuit | Pour déployer |

> **Décision pour le hackathon** : on n'utilise pas l'API Anthropic. L'analyse IA est remplacée par des textes pré-générés (mock data) selon le type de commerce + le quartier. Ça suffit largement pour une démo.

---

## 🏗️ Stack technique

```
localiq/
├── Frontend    → React + Vite
├── Styles      → Tailwind CSS (CDN, pas d'install)
├── Carte       → Google Maps JavaScript API (gratuit)
├── Données     → 100% mock (JSON statique)
├── Deploy      → Vercel (gratuit, 1 commande)
└── Backend     → AUCUN (tout en front, pas besoin)
```

**Pourquoi pas de backend ?**
Pour un hackathon, un backend complexifie tout. Toutes les données sont mockées en JSON côté client. La clé Google Maps est mise directement dans le `.env` (acceptable pour une démo).

---

## 📁 Structure du projet

```
localiq/
├── public/
│   └── favicon.ico
├── src/
│   ├── main.jsx                  # Point d'entrée React
│   ├── App.jsx                   # Router entre les 3 écrans
│   ├── screens/
│   │   ├── Landing.jsx           # Écran 1 : page d'accueil
│   │   ├── Onboarding.jsx        # Écran 2 : formulaire multi-étapes
│   │   └── Results.jsx           # Écran 3 : carte + liste + analyse
│   ├── components/
│   │   ├── MapView.jsx           # Composant Google Maps
│   │   ├── LocalCard.jsx         # Carte d'un local disponible
│   │   └── AnalysisPanel.jsx     # Panneau analyse + pro/cons
│   ├── data/
│   │   ├── mockLocaux.js         # Faux locaux disponibles
│   │   ├── mockConcurrents.js    # Faux concurrents sur la carte
│   │   └── mockAnalyses.js       # Textes d'analyse par secteur
│   └── hooks/
│       └── useGoogleMaps.js      # Chargement de l'API Maps
├── .env.local                    # Clé Google Maps (ne pas commiter)
├── .gitignore
├── index.html
├── vite.config.js
└── package.json
```

---

## 🚀 Étapes de fabrication — dans l'ordre

### Étape 1 — Setup du projet (10 min)

```bash
npm create vite@latest localiq -- --template react
cd localiq
npm install
npm run dev
```

Ensuite installe Tailwind via CDN (le plus rapide pour un hackathon) :
Dans `index.html`, ajoute dans le `<head>` :
```html
<script src="https://cdn.tailwindcss.com"></script>
```

### Étape 2 — Obtenir la clé Google Maps (15 min)

1. Va sur [console.cloud.google.com](https://console.cloud.google.com)
2. Crée un projet (ex. : "localiq-hackathon")
3. Active ces 3 APIs :
   - **Maps JavaScript API**
   - **Places API**
   - **Geocoding API**
4. Crée une clé API dans "Identifiants"
5. Crée un fichier `.env.local` à la racine :

```env
VITE_GOOGLE_MAPS_KEY=ta_clé_ici
```

> ⚠️ Ajoute `.env.local` dans `.gitignore` pour ne pas la commiter.

### Étape 3 — Créer les données mockées (20 min)

Crée `src/data/mockLocaux.js` :

```js
export const mockLocaux = [
  {
    id: 1,
    nom: "12 rue de la Roquette",
    adresse: "Paris 11e",
    surface: 45,
    loyer: 1800,
    score: 94,
    lat: 48.8534,
    lng: 2.3708,
    tags: ["Flux piéton +++", "0 boulangerie 300m", "Métro 2min"],
    pros: [
      "Aucune boulangerie directement concurrente dans un rayon de 300m",
      "Fort passage le matin (école à 80m, bureaux à 150m)",
      "Métro Voltaire à 2 min à pied"
    ],
    cons: [
      "Loyer légèrement au-dessus du budget cible",
      "Rue à sens unique — visibilité réduite côté voiture"
    ],
    metrics: {
      passants: "1 200/h",
      concurrents: 0,
      familles: "68%",
      note: "4.2"
    },
    analyse: "Ce local présente le meilleur potentiel pour une boulangerie artisanale dans le 11e. Le secteur est en pleine densification résidentielle avec une population jeune et familiale. L'absence totale de boulangerie dans un rayon de 300m est une opportunité rare pour cet arrondissement."
  },
  {
    id: 2,
    nom: "8 avenue Ledru-Rollin",
    adresse: "Paris 11e",
    surface: 38,
    loyer: 2100,
    score: 88,
    lat: 48.8519,
    lng: 2.3694,
    tags: ["Marché le weekend", "1 concurrent 400m", "Terrasse possible"],
    pros: [
      "Marché du weekend attire une clientèle CSP+ sensible à l'artisanal",
      "Option terrasse — atout fort en été",
      "Bonne visibilité depuis la rue principale"
    ],
    cons: [
      "Un concurrent direct à 400m",
      "Loyer dans le haut de la fourchette budget"
    ],
    metrics: {
      passants: "950/h",
      concurrents: 1,
      familles: "55%",
      note: "4.0"
    },
    analyse: "L'avenue Ledru-Rollin offre une visibilité maximale grâce au marché du weekend qui attire une clientèle CSP+ sensible aux produits artisanaux. La présence d'un concurrent à 400m reste gérable si le positionnement est clairement différencié."
  },
  {
    id: 3,
    nom: "24 rue Oberkampf",
    adresse: "Paris 11e",
    surface: 55,
    loyer: 2400,
    score: 74,
    lat: 48.8651,
    lng: 2.3755,
    tags: ["Clientèle branchée", "2 concurrents 200m", "Nuit animée"],
    pros: [
      "Surface généreuse de 55m² pour diversifier l'offre",
      "Clientèle jeune avec fort pouvoir d'achat",
      "Rue emblématique, fort trafic"
    ],
    cons: [
      "2 boulangeries déjà présentes à 200m",
      "Ambiance nocturne peut nuire à l'image artisanale",
      "Loyer élevé pour la surface"
    ],
    metrics: {
      passants: "1 500/h",
      concurrents: 2,
      familles: "35%",
      note: "3.8"
    },
    analyse: "Oberkampf est très fréquentée mais la concurrence directe est forte. Une différenciation claire (bio, sans gluten, produits originaux) est indispensable. La clientèle jeune et branchée est favorable si l'identité visuelle est forte."
  }
]

export const mockConcurrents = [
  { id: "c1", nom: "Boulangerie Martin", lat: 48.8545, lng: 2.3720, type: "concurrent" },
  { id: "c2", nom: "Paul", lat: 48.8558, lng: 2.3680, type: "chaine" },
  { id: "c3", nom: "Boulangerie du Marché", lat: 48.8610, lng: 2.3760, type: "concurrent" },
]
```

### Étape 4 — Page Landing (30 min)

`src/screens/Landing.jsx` — la page d'accueil avec :
- Logo + baseline "Trouvez le secteur idéal pour votre commerce"
- Bouton "Lancer l'analyse" qui redirige vers Onboarding
- 4 stats (12 000 commerces analysés, 87% satisfaction, etc.)

Point clé : garde-la simple et efficace. C'est la vitrine du produit.

### Étape 5 — Onboarding multi-étapes (45 min)

`src/screens/Onboarding.jsx` — 4 étapes avec un state React :

```js
const [form, setForm] = useState({
  typeCommerce: "Boulangerie / Pâtisserie",
  ville: "",
  quartier: "Centre-ville animé",
  surface: "30 – 60 m²",
  clientele: "Familles",
  budget: "1 000 – 2 500 €",
  criteres: ["Peu de concurrence directe", "Fort flux piéton"],
  eviter: "",
  infos: ""
})
```

Étapes :
1. **Type de commerce** — chips cliquables (Boulangerie, Restaurant, etc.)
2. **Zone** — input ville + chips type quartier + select surface
3. **Clientèle & budget** — chips profil + chips budget + critères multi-select
4. **Détails** — textarea "éviter" + textarea "infos complémentaires"

Au submit de l'étape 4 : afficher un écran de loading de 3 secondes, puis naviguer vers Results.

### Étape 6 — Carte Google Maps (45 min)

`src/components/MapView.jsx` — charge l'API Google Maps et affiche :

```jsx
import { useEffect, useRef } from 'react'

export default function MapView({ locaux, concurrents, selectedId, onSelect }) {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)

  useEffect(() => {
    // Charger Google Maps dynamiquement
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}&libraries=places`
    script.onload = initMap
    document.head.appendChild(script)
  }, [])

  const initMap = () => {
    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      center: { lat: 48.855, lng: 2.372 },
      zoom: 15,
      styles: [ /* Ajouter un style carte sobre */ ]
    })

    // Markers locaux recommandés (bleus)
    locaux.forEach((local, i) => {
      const marker = new window.google.maps.Marker({
        position: { lat: local.lat, lng: local.lng },
        map: mapInstance.current,
        label: { text: String(i + 1), color: '#fff' },
        icon: { /* icône bleue custom */ }
      })
      marker.addListener('click', () => onSelect(local.id))
    })

    // Markers concurrents (rouges)
    concurrents.forEach(c => {
      new window.google.maps.Marker({
        position: { lat: c.lat, lng: c.lng },
        map: mapInstance.current,
        icon: { /* icône rouge */ }
      })
    })
  }

  return <div ref={mapRef} style={{ width: '100%', height: '460px' }} />
}
```

> **Astuce hackathon** : si Google Maps pose problème, utilise [Leaflet.js](https://leafletjs.com/) avec OpenStreetMap — 100% gratuit, pas de clé API, intégration en 10 minutes.

### Étape 7 — Écran Résultats (45 min)

`src/screens/Results.jsx` — layout en 2 colonnes :
- Gauche : liste des `LocalCard` (filtrés depuis mockLocaux)
- Droite : `MapView`
- Bas : `AnalysisPanel` avec métriques, pro/cons, texte d'analyse

Le clic sur un `LocalCard` met à jour `selectedId` et affiche le bon panneau.

### Étape 8 — Navigation entre écrans (15 min)

Gestion simple avec un state dans `App.jsx` :

```jsx
const [screen, setScreen] = useState('landing') // 'landing' | 'onboarding' | 'loading' | 'results'
const [formData, setFormData] = useState({})

// Pas besoin de React Router pour un hackathon — un state suffit
```

### Étape 9 — Deploy sur Vercel (5 min)

```bash
npm install -g vercel
vercel
# Suivre les instructions, choisir Vite comme framework
# Ajouter la variable d'env VITE_GOOGLE_MAPS_KEY dans le dashboard Vercel
```

---

## 🎨 Design system rapide

Couleurs à utiliser dans Tailwind :
- **Primaire (violet/indigo)** : `bg-indigo-600`, `text-indigo-600`
- **Succès (vert)** : `bg-green-100 text-green-800` pour les scores hauts
- **Warning (jaune)** : `bg-yellow-100 text-yellow-800` pour les scores moyens
- **Neutre** : `text-gray-500`, `border-gray-200`, `bg-gray-50`

Composants clés :
- `.chip` — pill cliquable avec état `selected` (border + bg indigo)
- `.local-card` — carte avec hover state + border active
- `.score-badge` — badge coloré selon le score (>80 = vert, 60-80 = jaune)

---

## ⏱️ Planning hackathon (8h)

| Durée | Tâche |
|---|---|
| 30 min | Setup projet + clé Google Maps |
| 30 min | Mock data complète |
| 1h | Landing + Onboarding (UI uniquement) |
| 1h30 | Écran Résultats + MapView |
| 1h | Raffinement UI + animations loading |
| 30 min | Tests sur mobile |
| 30 min | Deploy Vercel |
| **5h30 total** | Avec 2h30 de marge |

---

## 🔧 Variables d'environnement

Fichier `.env.local` (ne jamais commiter) :
```env
VITE_GOOGLE_MAPS_KEY=AIzaSy...
```

---

## 📱 Points de vigilance

- **Mobile first** : l'écran résultats doit stack verticalement sur mobile (carte en haut, liste en bas)
- **Loading state** : ajouter un spinner pendant le chargement de Google Maps
- **Pas de backend** : toutes les données viennent de `src/data/` — pas d'appels API externes sauf Google Maps
- **Clé Maps** : restreindre la clé aux domaines autorisés dans la console Google pour éviter tout abus

---

## 🔮 Extensions possibles si vous avez du temps

Ces features nécessitent du backend — à faire seulement si tout le reste est fini :

- **Vraies données Places API** : remplacer les concurrents mockés par un appel `nearbySearch` Google Places
- **Geocoding** : transformer l'adresse saisie en coordonnées GPS
- **Export PDF** : générer un rapport d'analyse à télécharger

---

## 📦 Dépendances finales

```json
{
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x"
  },
  "devDependencies": {
    "vite": "^5.x",
    "@vitejs/plugin-react": "^4.x"
  }
}
```

> Tailwind via CDN dans `index.html` — pas besoin de l'installer en dépendance.

---

*Bon hackathon 🚀*
