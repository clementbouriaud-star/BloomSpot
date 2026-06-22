# Workflow Supabase — Bloomspot (V2-Commercants)

## Rôle

À chaque demande qui touche à la fois le frontend et la base de données, suivre **obligatoirement** le workflow complet ci-dessous, dans l'ordre, sans en sauter une étape.

---

## Stack réelle du projet

- **Frontend** : React 18 + Vite (JSX — pas de TypeScript)
- **Base de données** : Supabase (PostgreSQL)
- **Auth** : Supabase Auth
- **Client JS** : `@supabase/supabase-js` v2
- **Variables d'environnement** : `VITE_SUPABASE_URL` et `VITE_SUPABASE_PUBLISHABLE_KEY` (dans `.env.local`)

---

## Structure de fichiers du projet

```
src/
├── lib/
│   ├── supabaseClient.js   # Initialisation du client Supabase
│   ├── supabaseApi.js      # Toutes les fonctions d'appel à la DB
│   ├── supabaseAuth.js     # Fonctions d'authentification
│   └── i18n.jsx            # Traductions FR/EN
├── App.jsx                 # Point d'entrée, gestion du flow
├── Questionnaire.jsx       # Formulaire de recherche
├── Report.jsx              # Rapport généré
├── AuthModal.jsx           # Modal de connexion/inscription
└── main.jsx
```

---

## Workflow obligatoire à chaque changement

### Quand une demande touche la DB et le frontend, faire TOUJOURS dans cet ordre :

---

### ÉTAPE 1 — Migration SQL (à exécuter dans Supabase)

Donner la requête SQL exacte à exécuter dans **Supabase → SQL Editor** :

```sql
-- Exemple : ajout d'un champ secteur dans la table questionnaires
ALTER TABLE questionnaires ADD COLUMN secteur text;
```

Règles :
- Préciser toujours la table concernée (`questionnaires`, `reports`, `profiles`, etc.)
- Préciser le type SQL exact (`text`, `integer`, `boolean`, `timestamptz`, `uuid`, etc.)
- Si le champ est obligatoire, ajouter `NOT NULL DEFAULT ''`
- Si c'est une relation, ajouter la foreign key explicitement

---

### ÉTAPE 2 — Mise à jour du service d'appel Supabase

Donner le code exact de la fonction à créer ou modifier dans `src/lib/supabaseApi.js` :

```js
// src/lib/supabaseApi.js
export async function saveQuestionnaire(payload) {
  const questionnaireRow = {
    ville: payload.ville,
    secteur: payload.secteur, // ← nouveau champ
    // ...
  };

  const { data, error } = await supabase
    .from("questionnaires")
    .insert(questionnaireRow)
    .select("id")
    .single();

  if (error) throw error;
  return data;
}
```

Règles :
- Les appels Supabase se font **uniquement** dans `src/lib/supabaseApi.js` ou `src/lib/supabaseAuth.js`
- Toujours gérer les erreurs avec `if (error) throw error`
- Ne jamais appeler `supabase` directement depuis un composant UI

---

### ÉTAPE 3 — Mise à jour du composant frontend

Donner le composant React exact avec :
- Le nouvel état (`useState`) si nécessaire
- Le nouveau champ dans le JSX
- L'appel au service de l'étape 2 au submit

```jsx
// Dans Questionnaire.jsx
const [secteur, setSecteur] = useState("");

// Dans le JSX :
<input
  placeholder="Secteur"
  value={secteur}
  onChange={(e) => setSecteur(e.target.value)}
/>

// Au submit :
await saveQuestionnaire({ ...payload, secteur });
```

---

### ÉTAPE 4 — Checklist de vérification

À la fin de chaque réponse, donner cette checklist complétée :

```
✅ Colonne ajoutée en base : [nom_colonne] ([type]) dans [table]
✅ Service mis à jour : src/lib/[fichier].js
✅ Composant mis à jour : src/[fichier].jsx
⚠️  Points d'attention : [si applicable]
```

---

## Conventions de code

- Les appels Supabase se font **uniquement** dans `src/lib/` (jamais dans les composants)
- Variables d'env Vite : `VITE_SUPABASE_URL` et `VITE_SUPABASE_PUBLISHABLE_KEY`
- Pour l'auth : `supabase.auth.signUp()`, `signInWithPassword()`, `signOut()`
- Pas de `console.log` en prod — utiliser `console.warn` pour les erreurs non bloquantes
- Toujours tester le cas `!supabase` (client non initialisé si les env vars manquent)

---

## Tables existantes dans Supabase

| Table | Description |
|---|---|
| `questionnaires` | Formulaires soumis (ville, surface, loyer, concept, clientele, atouts) |
| `reports` | Rapports générés (questionnaire_id, title, payload JSON) |
| `prix_immobiliers` | Prix immobiliers par département (table de référence) |

---

## Ce qu'on ne fait JAMAIS

- ❌ Modifier le frontend sans donner le SQL correspondant
- ❌ Appeler `supabase` directement dans un composant React
- ❌ Oublier la checklist finale
- ❌ Créer un nouveau fichier dans `src/lib/` sans raison — préférer étendre `supabaseApi.js`
