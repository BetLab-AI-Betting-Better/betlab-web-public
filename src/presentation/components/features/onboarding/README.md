# Onboarding Flow - BetLab

Flow d'onboarding complet en 4 étapes pour les nouveaux utilisateurs de BetLab.

## Architecture

### 1. Store Zustand (`lib/stores/onboarding-store.ts`)

State machine centralisé pour gérer tout le flow d'onboarding :

- **State Steps** : 4 étapes (0-3)
  - Step 0 : Profile (prénom, nom, avatar)
  - Step 1 : Leagues (sélection ligues favorites)
  - Step 2 : Preferences (types prédictions + profil risque)
  - Step 3 : Success (confirmation avec confetti)

- **Persistance** : localStorage via Zustand persist middleware
- **Validation** : Validation temps réel à chaque step
- **Sauvegarde** : Supabase profiles table au completion

### 2. Composants

#### ProgressBar (`progress-bar.tsx`)
- Affiche 4 dots numérotés
- Ligne de progression animée entre les dots
- Sticky top pour rester visible
- Dark mode support

#### ProfileStep (`profile-step.tsx`)
- Avatar placeholder avec upload (optionnel)
- Input prénom (min 2 chars)
- Input nom (min 2 chars)
- Validation temps réel avec messages d'erreur

#### LeaguesStep (`leagues-step.tsx`)
- Grille 2 colonnes responsive
- 9 ligues disponibles (football + basketball)
- Sélection multiple avec checkmarks
- Counter de ligues sélectionnées
- Min 1 ligue requise

#### PreferencesStep (`preferences-step.tsx`)
- Section 1 : Multi-select chips pour types prédictions (8 types)
- Section 2 : Radio buttons pour profil risque (3 options)
- Icons colorés pour chaque profil
- Validation min 1 type + 1 profil

#### SuccessStep (`success-step.tsx`)
- Animation checkmark avec pulse
- Confetti effect (5 secondes)
- Résumé des données saisies
- CTA "Découvrir l'app"
- Auto-save + redirect

### 3. Page principale (`app/onboarding/page.tsx`)

State machine avec :
- Swipe gestures (react-swipeable)
- Animations transitions (framer-motion)
- Navigation prev/next avec validation
- Protection redirect si non authentifié
- Auto-redirect si déjà complété

## Utilisation

### Redirect vers onboarding

```typescript
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/presentation/hooks/stores/auth-store';

const router = useRouter();
const { user } = useAuthStore();

// Redirect après signup
if (user && !user.onboardingCompleted) {
  router.push('/onboarding');
}
```

### Utiliser le hook personnalisé

```typescript
import { useOnboarding } from '@/presentation/hooks/use-onboarding';

function MyComponent() {
  const {
    currentStep,
    firstName,
    setFirstName,
    canGoToNextStep,
    nextStep,
    complete,
  } = useOnboarding();

  return (
    <div>
      <p>Step {currentStep + 1}/4</p>
      <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      <button onClick={nextStep} disabled={!canGoToNextStep()}>
        Next
      </button>
    </div>
  );
}
```

### Accéder directement au store

```typescript
import { useOnboardingStore } from '@/presentation/hooks/stores/onboarding-store';

const { currentStep, complete, reset } = useOnboardingStore();
```

## State Machine

```
┌─────────────┐
│   Step 0    │  Profile (firstName, lastName, avatarUrl)
│   PROFILE   │  Validation: min 2 chars
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   Step 1    │  Leagues (selectedLeagues[])
│   LEAGUES   │  Validation: min 1 league
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   Step 2    │  Preferences (selectedPredictionTypes[], riskProfile)
│ PREFERENCES │  Validation: min 1 type + 1 profile
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   Step 3    │  Success (confetti, summary, CTA)
│   SUCCESS   │  Action: complete() → save to Supabase → redirect /
└─────────────┘
```

## Validation Rules

### Step 0 - Profile
- `firstName`: min 2 caractères, trim()
- `lastName`: min 2 caractères, trim()
- `avatarUrl`: optionnel

### Step 1 - Leagues
- `selectedLeagues`: minimum 1 ligue sélectionnée

### Step 2 - Preferences
- `selectedPredictionTypes`: minimum 1 type
- `riskProfile`: requis (conservative | balanced | aggressive)

## Supabase Schema

Table `profiles` doit avoir les colonnes suivantes :

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  avatar_url TEXT,
  favorite_leagues JSONB DEFAULT '[]'::jsonb,
  prediction_types JSONB DEFAULT '[]'::jsonb,
  risk_profile TEXT,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Animations

### Swipe Gestures
- Swipe left : Next step (si validation OK)
- Swipe right : Previous step (si step > 0 et step < 3)
- Delta : 50px minimum pour trigger

### Transitions
- Slide animation : spring stiffness 300, damping 30
- Opacity fade : 0.2s duration
- Confetti : 5 secondes auto-hide

## Mobile-First

- Container : max-w-2xl mx-auto
- Touch targets : min 44px (h-12 pour buttons)
- Inputs : h-12 (48px), text-base (16px pour éviter iOS zoom)
- Safe area : pb-[env(safe-area-inset-bottom)]
- Swipe gestures : trackTouch true, trackMouse false
- Active states : active:scale-95 pour feedback tactile

## Dark Mode

Tous les composants supportent le dark mode via Tailwind CSS :
- Variables CSS adaptatives
- bg-card, text-foreground, border-border
- Lime et Navy conservent leurs couleurs

## Dépendances

```json
{
  "react-confetti": "^6.4.0",
  "react-use": "^17.6.0",
  "framer-motion": "^12.23.24",
  "react-swipeable": "^7.0.2",
  "zustand": "^5.0.8"
}
```

## Tests manuels

1. **Navigation** : Vérifier prev/next/swipe
2. **Validation** : Tenter de passer sans données
3. **Persistance** : Rafraîchir page, vérifier localStorage
4. **Swipe** : Tester swipe left/right sur mobile
5. **Confetti** : Vérifier animation success step
6. **Save** : Vérifier données dans Supabase
7. **Redirect** : Vérifier redirect après completion
8. **Dark mode** : Tester en mode sombre

## Roadmap / Améliorations futures

- [ ] Upload avatar vers Supabase Storage
- [ ] Prévisualisation avatar avant upload
- [ ] Animation de transition entre steps plus fluide
- [ ] Progress bar circulaire alternative
- [ ] Skip onboarding (avec warning)
- [ ] Modifier profil après onboarding
- [ ] Analytics tracking de chaque step
- [ ] A/B testing différents flows
