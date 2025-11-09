# BetLab API - Tests des Endpoints de Probabilités

**Date**: 2025-11-09
**API URL**: https://fastapi-production-2b94.up.railway.app
**Version API**: 2.0.0

## Résumé

L'API BetLab expose 4 endpoints principaux pour les probabilités de matchs. Tous les endpoints testés fonctionnent correctement avec une gestion appropriée des erreurs.

## Endpoints Testés

### 1. GET `/v1/matches/{match_id}/probabilities/internal`

**Description**: Retourne les probabilités internes complètes avec diagnostics du modèle ensemble.

#### Tests Réussis ✅

| Test | Match ID | Résultat | HTTP Code |
|------|----------|----------|-----------|
| Match valide (Brentford vs West Ham) | 1035137 | Succès avec données complètes | 200 |
| Avec query params (ignorés) | 1035137?cache=false | Succès, params ignorés | 200 |
| Avec header Accept HTML | 1035137 | Retourne JSON quand même | 200 |
| Avec Authorization header | 1035137 | Succès (pas d'auth requise) | 200 |

**Réponse type**:
```json
{
  "model_version": "ensemble-1.0.0",
  "match_id": "1035137",
  "generated_at": 1762656721,
  "inputs": {
    "mu_home": 1.292,
    "mu_away": 0.746,
    "form_index_home": 0.0,
    "injury_factor_home": 0.7,
    "rating_home": 1517.82,
    "rating_away": 1407.95,
    ...
  },
  "markets": {
    "1x2": {"home": 0.4977, "draw": 0.2877, "away": 0.2146},
    "btts": {"yes": 0.3758, "no": 0.6242},
    "over_under": {...},
    "correct_score_top": [...]
  },
  "implied_odds": {...},
  "diagnostics": {...}
}
```

#### Tests d'Erreur ❌

| Test | Match ID | Message d'erreur | HTTP Code |
|------|----------|------------------|-----------|
| ID inexistant | 999999999 | "Fixture not found" | 404 |
| ID négatif | -1 | "Fixture not found" | 404 |
| ID zéro | 0 | "Fixture not found" | 404 |
| ID non-numérique | "invalid_id" | "Fixture not found" | 404 |
| ID non-numérique (lettres) | "abc" | "Fixture not found" | 404 |
| Ligue non supportée | 1234567 | "League not supported by BetLab backend (restricted to top European competitions)." | 400 |
| Méthode PUT | 1035137 | "Method Not Allowed" | 405 |
| Méthode DELETE | 1035137 | "Method Not Allowed" | 405 |
| Méthode HEAD | 1035137 | "Method Not Allowed" | 405 |
| Méthode OPTIONS | 1035137 | "Method Not Allowed" | 405 |

---

### 2. GET `/v1/matches/{match_id}/probabilities/1x2`

**Description**: Retourne uniquement les probabilités 1X2 et les cotes implicites.

#### Tests Réussis ✅

| Test | Match ID | Résultat | HTTP Code |
|------|----------|----------|-----------|
| Match valide | 1035137 | Succès avec probas 1X2 | 200 |
| Avec query param | 1035137?format=json | Succès, param ignoré | 200 |

**Réponse type**:
```json
{
  "generated_at": "2025-11-09T02:52:01Z",
  "model_version": "ensemble-1.0.0",
  "inputs": {
    "match_id": "1035137",
    "home_team": "Brentford",
    "away_team": "West Ham",
    "kickoff_utc": "2023-11-04T15:00:00+00:00Z",
    ...
  },
  "markets": {
    "home": 0.4977,
    "draw": 0.2877,
    "away": 0.2146
  },
  "implied_odds": {
    "home": 2.01,
    "draw": 3.48,
    "away": 4.66
  }
}
```

#### Tests d'Erreur ❌

| Test | Match ID | Message d'erreur | HTTP Code |
|------|----------|------------------|-----------|
| ID inexistant | 0 | "Fixture not found" | 404 |
| Ligue non supportée | 1234567 | "League not supported..." | 400 |
| Méthode DELETE | 1035137 | "Method Not Allowed" | 405 |

---

### 3. POST `/v1/matches/{match_id}/probabilities/markets`

**Description**: Retourne les probabilités pour différents marchés avec fair odds, seuils ROI et recommandations. Accepte des paramètres optionnels pour personnaliser le profil de risque.

#### Tests Réussis ✅

| Test | Body | Résultat | HTTP Code |
|------|------|----------|-----------|
| Body vide | `{}` | Succès avec valeurs par défaut | 200 |
| Profil conservative | `{"risk_profile":"conservative"}` | stake_cap=0.02, min_edge=0.05 | 200 |
| Profil balanced (défaut) | `{"risk_profile":"balanced"}` | stake_cap=0.04, min_edge=0.05 | 200 |
| Profil aggressive | `{"risk_profile":"aggressive"}` | stake_cap=0.06, min_edge=0.04 | 200 |
| Min edge custom | `{"min_edge":0.08}` | Appliqué dans meta | 200 |
| Min edge custom | `{"min_edge":0.1}` | Appliqué dans meta | 200 |
| Stake cap custom | `{"stake_cap":0.1}` | Ignoré (reste à 0.04) | 200 |
| Combinaison | `{"risk_profile":"balanced","min_edge":0.08}` | Les deux appliqués | 200 |
| Profil invalide | `{"risk_profile":"invalid"}` | Accepté tel quel | 200 |
| Param invalide | `{"invalid_param":"value"}` | Ignoré | 200 |
| Liste de marchés | `{"markets":["btts","over_under"]}` | Retourne tous les marchés | 200 |

**Réponse type**:
```json
{
  "inputs": {
    "mu_home": 1.292,
    "mu_away": 0.746,
    "cap": 12
  },
  "oneXtwo": {
    "home": 0.495007,
    "draw": 0.289558,
    "away": 0.215435
  },
  "markets": {
    "dnb_home": {
      "prob_win": 0.495007,
      "prob_draw": 0.289558,
      "prob_loss": 0.215435,
      "fair_odds": 1.435,
      "thresholds": {"roi_3": 1.478, "roi_5": 1.507, "roi_8": 1.55}
    },
    "ah_home_m025": {...},
    "over_2_5": {...},
    "under_2_5": {...},
    "btts_yes": {...},
    "clean_sheet": {
      "home": {"prob": 0.474144, "fair_odds": 2.109},
      "away": {"prob": 0.274714, "fair_odds": 3.64}
    },
    "top_scores": [...]
  },
  "recommendations": [],
  "meta": {
    "risk_profile": "balanced",
    "min_edge": 0.05,
    "hi_var_threshold": 1.0,
    "stake_cap": 0.04
  }
}
```

**Marchés disponibles**:
- `dnb_home` - Draw No Bet domicile
- `ah_home_m025` - Handicap Asiatique -0.25 domicile
- `over_2_5` / `under_2_5` - Plus/Moins 2.5 buts
- `btts_yes` - Both Teams To Score
- `clean_sheet` - Domicile et extérieur
- `top_scores` - Top 10 des scores exacts probables

**Seuils ROI disponibles**: roi_3, roi_5, roi_8 (représentant 3%, 5%, 8% de ROI cible)

#### Tests d'Erreur ❌

| Test | Input | Message d'erreur | HTTP Code |
|------|-------|------------------|-----------|
| ID inexistant | match_id=999999 | "League not supported..." | 400 |
| Min edge négatif | `{"min_edge":-0.5}` | "Input should be >= 0" | 422 |
| Min edge trop élevé | `{"min_edge":1.0}` | "Input should be <= 0.2" | 422 |
| Min edge string | `{"min_edge":"invalid"}` | "Input should be a valid number" | 422 |
| Body array au lieu d'objet | `[{"test":"array"}]` | "Input should be a valid dictionary" | 422 |
| Content-Type incorrect | Content-Type: text/plain | "Input should be a valid dictionary" | 422 |
| Pas de Content-Type | (aucun) | "Field required" | 422 |
| Pas de body | (vide) | "Field required" | 422 |

**Validation des paramètres**:
- `min_edge`: float, 0 ≤ x ≤ 0.2
- `risk_profile`: string, aucune validation (accepte toute valeur)
- `stake_cap`: accepté mais semble ignoré dans la réponse

---

### 4. GET `/v1/matches/{match_id}/odds`

**Description**: Retourne les cotes du marché pour un match. Disponible uniquement 1-14 jours avant le coup d'envoi.

#### Tests d'Erreur ❌

| Test | Match ID | Message d'erreur | HTTP Code |
|------|----------|------------------|-----------|
| Match trop ancien | 1035137 | "Odds not available for match 1035137. Odds are typically available 1-14 days before kickoff." | 404 |
| Match inexistant | 1234000 | "Odds not available for match 1234000..." | 404 |
| Match inexistant | 1200000 | "Odds not available for match 1200000..." | 404 |

**Note**: Aucun test réussi car tous les matchs testés étaient soit trop anciens, soit inexistants. Ce endpoint nécessite un match à venir (1-14 jours avant).

---

### 5. GET `/v1/matches/{match_id}/probabilities`

**Description**: Endpoint de base sans sous-chemin.

#### Tests d'Erreur ❌

| Test | Résultat | HTTP Code |
|------|----------|-----------|
| GET sans sous-chemin | "Not Found" | 404 |

**Note**: Cet endpoint n'existe pas. Il faut toujours spécifier un sous-chemin (`/internal`, `/1x2`, ou `/markets`).

---

## Récapitulatif des Comportements

### Gestion des Erreurs

1. **Match non trouvé**: Retourne 404 avec message "Fixture not found"
2. **Ligue non supportée**: Retourne 400 avec message explicite
3. **Méthodes HTTP non supportées**: Retourne 405 "Method Not Allowed"
4. **Validation du body**: Retourne 422 avec détails Pydantic
5. **Odds indisponibles**: Retourne 404 avec explication temporelle

### Comportements Notables

1. **Pas d'authentification requise**: Tous les endpoints sont publics
2. **Query params ignorés**: Les endpoints GET n'utilisent pas les query params
3. **Accept header ignoré**: Retourne toujours du JSON
4. **Paramètres invalides acceptés**: POST /markets accepte des valeurs non-standard
5. **Validation stricte sur min_edge**: Doit être entre 0 et 0.2
6. **Content-Type requis pour POST**: Doit être application/json
7. **CORS**: Pas de support OPTIONS (405)

### Restrictions

1. **Ligues supportées**: Uniquement les compétitions européennes majeures
2. **Odds temporels**: Disponibles 1-14 jours avant le match
3. **Méthodes HTTP**: Uniquement GET et POST selon l'endpoint

---

## Recommandations pour l'Intégration

### 1. Gestion des Erreurs Côté Client

```typescript
// Exemple de gestion d'erreur
try {
  const response = await fetch(`/v1/matches/${matchId}/probabilities/internal`);

  if (response.status === 404) {
    // Match non trouvé ou inexistant
  } else if (response.status === 400) {
    // Ligue non supportée
  } else if (response.status === 422) {
    // Validation échouée (POST /markets)
  }
} catch (error) {
  // Erreur réseau
}
```

### 2. Utilisation de `/markets` avec Profils de Risque

```typescript
// Conservative (paris sûrs)
const conservativeMarkets = await fetch('/v1/matches/{id}/probabilities/markets', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ risk_profile: 'conservative' })
});

// Aggressive (paris à haut risque/rendement)
const aggressiveMarkets = await fetch('/v1/matches/{id}/probabilities/markets', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ risk_profile: 'aggressive', min_edge: 0.08 })
});
```

### 3. Choix de l'Endpoint Selon le Besoin

- **UI Simple 1X2**: Utiliser `/probabilities/1x2` (plus léger)
- **Analyse détaillée**: Utiliser `/probabilities/internal` (diagnostics complets)
- **Recommandations de paris**: Utiliser POST `/probabilities/markets` (avec risk_profile)
- **Cotes du marché**: Utiliser `/odds` (vérifier disponibilité temporelle)

### 4. Caching Recommandé

```typescript
// Les probabilités ne changent pas fréquemment pour un match donné
// Cache suggéré: 5-15 minutes selon l'endpoint
const cacheConfig = {
  '/probabilities/internal': '15m',  // Données diagnostiques stables
  '/probabilities/1x2': '10m',       // Probas de base
  '/probabilities/markets': '10m',   // Marchés calculés
  '/odds': '5m'                      // Cotes du marché (plus volatiles)
};
```

---

## Tests Non Couverts

### Limitations des Tests

1. **Endpoint /odds**: Aucun match avec odds disponibles trouvé
2. **Recommendations**: Toutes les réponses ont un tableau vide `recommendations: []`
3. **Performances**: Pas de tests de charge ou de latence
4. **Différents sports**: Tests uniquement sur football
5. **Matchs en direct**: Pas de tests sur matchs en cours

### Tests Futurs Suggérés

1. Tester `/odds` avec un match à venir (1-14 jours)
2. Vérifier si `recommendations` se remplit avec des cotes réelles
3. Tests de performance (latence, throughput)
4. Tests avec différentes ligues supportées
5. Tests pendant un match en direct (si supporté)

---

## Conclusion

L'API BetLab pour les probabilités est bien conçue et robuste:

✅ **Points forts**:
- Gestion d'erreurs claire et cohérente
- Validation stricte des inputs
- Réponses structurées et complètes
- Flexibilité via profils de risque
- Pas d'authentification nécessaire (accès public)

⚠️ **Points d'attention**:
- Endpoint `/odds` limité temporellement
- Restriction aux ligues européennes majeures
- Certains paramètres POST semblent ignorés (stake_cap)
- Pas de documentation OpenAPI accessible

🔧 **Améliorations suggérées**:
- Documenter les profils de risque valides
- Clarifier quels paramètres sont acceptés vs appliqués
- Ajouter un endpoint de découverte des ligues supportées
- Fournir l'OpenAPI spec fonctionnel
