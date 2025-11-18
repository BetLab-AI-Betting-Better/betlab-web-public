# Composants Feedback - BetLab

Documentation des composants de feedback utilisateur pour l'application BetLab.

## Table des matières

1. [Composants shadcn/ui installés](#composants-shadcnui-installés)
2. [Composants d'états personnalisés](#composants-détats-personnalisés)
3. [Skeleton Loaders spécialisés](#skeleton-loaders-spécialisés)
4. [Toast (Sonner)](#toast-sonner)
5. [Exemples d'utilisation](#exemples-dutilisation)

---

## Composants shadcn/ui installés

### Skeleton
Composant de base pour les états de chargement.
```tsx
import { Skeleton } from "@/presentation/components/ui/skeleton"

<Skeleton className="h-12 w-12 rounded-full" />
```

### Alert
Affichage de messages d'information ou d'erreur.
```tsx
import { Alert, AlertTitle, AlertDescription } from "@/presentation/components/ui/alert"

<Alert variant="destructive">
  <AlertTitle>Erreur</AlertTitle>
  <AlertDescription>Message d'erreur</AlertDescription>
</Alert>
```

### Alert Dialog
Dialogue de confirmation.
```tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/presentation/components/ui/alert-dialog"
```

---

## Composants d'états personnalisés

### Spinner

Indicateur de chargement rotatif avec les couleurs BetLab.

**Tailles:** `sm` (16px), `md` (24px), `lg` (32px)
**Variantes:** `primary` (Navy), `accent` (Lime), `white`, `muted`

```tsx
import { Spinner } from "@/presentation/components/ui/spinner"

// Utilisation basique
<Spinner size="md" variant="primary" />

// Avec label personnalisé
<Spinner size="lg" variant="accent" label="Chargement des matchs..." />
```

### Loading State

État de chargement complet avec spinner centré et message optionnel.

**Modes:** `inline`, `fullscreen`

```tsx
import { LoadingState } from "@/presentation/components/ui/loading-state"

// Inline
<LoadingState
  mode="inline"
  message="Chargement des données..."
  spinnerSize="lg"
/>

// Fullscreen avec overlay
<LoadingState
  mode="fullscreen"
  showOverlay
  message="Chargement..."
  spinnerSize="lg"
/>
```

### Error State

Affichage d'erreur avec icône, message et bouton de retry.

```tsx
import { ErrorState } from "@/presentation/components/ui/error-state"

<ErrorState
  title="Impossible de charger les données"
  message="Une erreur s'est produite. Veuillez réessayer."
  onRetry={() => refetch()}
  retryLabel="Réessayer"
  showIcon={true}
/>
```

### Empty State

Affichage pour états vides avec icône et action optionnelle.

```tsx
import { EmptyState } from "@/presentation/components/ui/empty-state"
import { Inbox } from "lucide-react"

<EmptyState
  icon={<Inbox className="h-12 w-12" />}
  title="Aucun match"
  message="Il n'y a aucun match prévu pour le moment."
  action={{
    label: "Actualiser",
    onClick: () => refetch()
  }}
/>
```

### Success Animation

Animation de succès avec checkmark animé.

**Tailles:** `sm`, `md`, `lg`

```tsx
import { SuccessAnimation } from "@/presentation/components/ui/success-animation"

<SuccessAnimation
  size="lg"
  duration={2000}
  show={showSuccess}
  onAnimationComplete={() => setShowSuccess(false)}
/>
```

---

## Skeleton Loaders spécialisés

### Skeleton Card

Skeleton pour différents types de cards.

**Variantes:** `match`, `stat`, `team`, `default`

```tsx
import { SkeletonCard } from "@/presentation/components/ui/skeleton-card"

// Match Card
<SkeletonCard variant="match" showActions />

// Stat Card
<SkeletonCard variant="stat" />

// Team Card
<SkeletonCard variant="team" />

// Default Card
<SkeletonCard variant="default" showImage showActions />
```

### Skeleton List

Skeleton pour listes.

**Variantes:** `default`, `with-avatar`, `with-icon`, `detailed`

```tsx
import { SkeletonList } from "@/presentation/components/ui/skeleton-list"

// Liste avec avatar
<SkeletonList variant="with-avatar" count={5} showDivider />

// Liste détaillée
<SkeletonList variant="detailed" count={3} />

// Liste simple
<SkeletonList variant="default" count={4} />
```

---

## Toast (Sonner)

Notifications toast configurées dans le layout.

### Installation

Le Toaster est déjà configuré dans `app/layout.tsx`. Utilisez simplement la fonction `toast` :

```tsx
import { toast } from "sonner"

// Success
toast.success("Prédiction enregistrée avec succès !")

// Error
toast.error("Impossible d'enregistrer la prédiction")

// Warning
toast.warning("Le match commence dans 5 minutes")

// Info
toast.info("Nouvelle mise à jour disponible")

// Avec description
toast("Match en cours", {
  description: "Liverpool vs Manchester City"
})

// Avec action
toast("Match terminé", {
  description: "Consultez les résultats",
  action: {
    label: "Voir",
    onClick: () => navigate("/match/123")
  }
})

// Promise toast
toast.promise(
  fetchData(),
  {
    loading: "Chargement...",
    success: "Données chargées !",
    error: "Erreur de chargement"
  }
)
```

### Configuration

Position sur mobile : `bottom-center`
Position sur desktop : `bottom-right`

Couleurs personnalisées :
- Success: `#10B981`
- Error: `#EF4444`
- Warning: `#F59E0B`
- Info: `#3B82F6`

---

## Exemples d'utilisation

### Chargement de données avec React Query

```tsx
import { useQuery } from "@tanstack/react-query"
import { LoadingState, ErrorState, EmptyState } from "@/presentation/components/ui"

function MatchList() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['matches'],
    queryFn: fetchMatches
  })

  if (isLoading) {
    return <LoadingState message="Chargement des matchs..." />
  }

  if (error) {
    return (
      <ErrorState
        title="Erreur de chargement"
        message={error.message}
        onRetry={refetch}
      />
    )
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        title="Aucun match"
        message="Aucun match n'est prévu pour le moment."
      />
    )
  }

  return <div>{/* Render matches */}</div>
}
```

### Chargement avec Skeleton

```tsx
import { SkeletonCard } from "@/presentation/components/ui"

function MatchGrid() {
  const { data, isLoading } = useQuery({
    queryKey: ['matches'],
    queryFn: fetchMatches
  })

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        <SkeletonCard variant="match" showActions />
        <SkeletonCard variant="match" showActions />
        <SkeletonCard variant="match" showActions />
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {data?.map(match => <MatchCard key={match.id} match={match} />)}
    </div>
  )
}
```

### Succès avec animation

```tsx
import { useState } from "react"
import { toast } from "sonner"
import { SuccessAnimation } from "@/presentation/components/ui"

function PredictionForm() {
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async () => {
    try {
      await savePrediction()
      setShowSuccess(true)
      toast.success("Prédiction enregistrée !")
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement")
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
      </form>

      {showSuccess && (
        <SuccessAnimation
          size="lg"
          duration={3000}
          onAnimationComplete={() => setShowSuccess(false)}
        />
      )}
    </>
  )
}
```

---

## Exemple complet

Pour voir tous les composants en action, consultez :

**Chemin:** `C:\Users\bloraydev\Documents\GitHub Projets\betlab-web\lib\components\examples\feedback-states-example.tsx`

Ce composant démontre tous les états de feedback avec des exemples interactifs.

---

## Couleurs BetLab

- **Primary (Navy):** `#1E3A8A`
- **Accent (Lime):** `#84CC16`
- **Success:** `#10B981`
- **Error:** `#EF4444`
- **Warning:** `#F59E0B`
- **Info:** `#3B82F6`

---

## Accessibilité

Tous les composants incluent :
- Attributs ARIA appropriés
- Labels pour les lecteurs d'écran
- Support du mode sombre
- Animations respectueuses du `prefers-reduced-motion`
- Focus management

---

## Dépendances installées

- `sonner` - Toast notifications
- `@radix-ui/react-alert-dialog` - Alert dialogs
- `class-variance-authority` - Variantes de composants
- `lucide-react` - Icons
