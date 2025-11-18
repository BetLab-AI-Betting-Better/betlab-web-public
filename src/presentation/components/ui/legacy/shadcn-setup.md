# shadcn/ui Setup - BetLab

## Configuration

**Style:** New York (moderne et élégant)
**Base Color:** Slate
**CSS Variables:** Activées
**TypeScript:** Configuré
**Tailwind CSS:** v4

## Structure

```
lib/
├── components/
│   └── ui/           # Composants shadcn/ui
├── utils.ts          # Fonction utilitaire cn() pour Tailwind
└── hooks/            # Hooks personnalisés (future)
```

## Composants de Base Installés

### 1. Button (`lib/components/ui/button.tsx`)
**Variants BetLab personnalisés:**
- `primary`: Navy (#003366) - Boutons d'action principaux
- `lime`: Lime (#C8DC3F) - Call-to-action impactants
- `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`: Variants shadcn standards

**Tailles:**
- `default`: h-11 (44px) - Mobile-friendly
- `sm`: h-9 (36px)
- `lg`: h-12 (48px)
- `icon`: size-11 (44px)

**Usage:**
```tsx
import { Button } from "@/presentation/components/ui/button"

<Button variant="primary">Placer un Pari</Button>
<Button variant="lime">S'inscrire Maintenant</Button>
<Button variant="outline" size="sm">Annuler</Button>
```

### 2. Badge (`lib/components/ui/badge.tsx`)
**Variants BetLab personnalisés:**
- `success`: Vert (#10B981) - Paris gagnés
- `warning`: Orange (#F59E0B) - Paris en attente
- `error`: Rouge (#EF4444) - Paris perdus
- `live`: Rouge vif (#DC2626) avec animation pulse - Matchs en direct
- `default`, `secondary`, `destructive`, `outline`: Variants shadcn standards

**Caractéristiques:**
- min-height: 28px (facilite le tap mobile)
- Animation pulse pour le variant "live"

**Usage:**
```tsx
import { Badge } from "@/presentation/components/ui/badge"

<Badge variant="success">Gagné</Badge>
<Badge variant="warning">En attente</Badge>
<Badge variant="error">Perdu</Badge>
<Badge variant="live">LIVE</Badge>
```

### 3. Card (`lib/components/ui/card.tsx`)
Composant de conteneur pour afficher des informations structurées.

**Sous-composants:**
- `Card`: Conteneur principal
- `CardHeader`: En-tête avec titre et description
- `CardTitle`: Titre de la carte
- `CardDescription`: Description/sous-titre
- `CardAction`: Actions dans l'en-tête
- `CardContent`: Contenu principal
- `CardFooter`: Pied de page avec actions

**Usage:**
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/presentation/components/ui/card"
import { Button } from "@/presentation/components/ui/button"

<Card>
  <CardHeader>
    <CardTitle>PSG vs OM</CardTitle>
    <CardDescription>Ligue 1 - En direct</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Cotes en temps réel...</p>
  </CardContent>
  <CardFooter>
    <Button variant="primary">Parier Maintenant</Button>
  </CardFooter>
</Card>
```

### 4. Avatar (`lib/components/ui/avatar.tsx`)
Affiche les images de profil utilisateur avec fallback texte.

**Sous-composants:**
- `Avatar`: Conteneur
- `AvatarImage`: Image utilisateur
- `AvatarFallback`: Texte de fallback (initiales)

**Usage:**
```tsx
import { Avatar, AvatarImage, AvatarFallback } from "@/presentation/components/ui/avatar"

<Avatar>
  <AvatarImage src="/user-avatar.jpg" alt="John Doe" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

### 5. Separator (`lib/components/ui/separator.tsx`)
Séparateur visuel horizontal ou vertical.

**Usage:**
```tsx
import { Separator } from "@/presentation/components/ui/separator"

<Separator />
<Separator orientation="vertical" />
```

### 6. Progress (`lib/components/ui/progress.tsx`)
Barre de progression pour indiquer l'avancement.

**Usage:**
```tsx
import { Progress } from "@/presentation/components/ui/progress"

<Progress value={65} />
<Progress value={betStatus.percentage} className="h-3" />
```

## Autres Composants Disponibles

Des composants supplémentaires ont été installés lors de la configuration :

- **Forms:** `form`, `input`, `label`, `textarea`, `checkbox`, `radio-group`, `select`, `switch`, `password-input`
- **Feedback:** `alert`, `alert-dialog`, `sonner` (toast), `spinner`
- **Layout:** `dialog`, `sheet`, `bottom-sheet`, `popover`, `dropdown-menu`, `tabs`, `command`
- **Loading:** `skeleton`, `skeleton-card`, `skeleton-list`, `loading-state`
- **States:** `empty-state`, `error-state`, `success-animation`

## Personnalisation BetLab

### Couleurs CSS Variables

Les couleurs BetLab sont intégrées dans `app/globals.css` :

```css
:root {
  /* BetLab Colors - Primaires */
  --navy: #003366;
  --navy-light: #0A4A7A;
  --navy-ultra-light: #E6EFF7;
  --lime: #C8DC3F;
  --lime-light: #E5F077;
  --lime-ultra-light: #F7FCE0;

  /* Sémantiques */
  --error: #EF4444;
  --success: #10B981;
  --warning: #F59E0B;
  --info: #3B82F6;
  --live: #DC2626;
}
```

### Mobile-First Design

Tous les composants personnalisés respectent les standards d'accessibilité mobile :

- **Touch Targets:** Minimum 44px x 44px (recommandation Apple & Google)
- **Button default height:** 44px (h-11)
- **Badge min-height:** 28px
- **Icon buttons:** 44px (size-11)

### Utilisation des Couleurs BetLab

Pour utiliser les couleurs BetLab dans vos composants :

```tsx
// Via Tailwind (depuis globals.css @theme)
<div className="bg-navy text-lime">

// Via CSS variables
<div style={{ backgroundColor: 'var(--navy)', color: 'var(--lime)' }}>

// Dans les composants stylés
<Button className="bg-[var(--navy)] hover:bg-[var(--navy-light)]">
```

## Fonction Utilitaire `cn()`

Le fichier `lib/utils.ts` contient la fonction `cn()` qui combine `clsx` et `tailwind-merge` :

```typescript
import { cn } from "@/shared/utils"

<Button className={cn("base-class", condition && "conditional-class")} />
```

## Prochaines Étapes

1. Créer des composants métier BetLab (BetCard, OddsDisplay, LiveIndicator, etc.)
2. Implémenter les hooks personnalisés dans `lib/hooks/`
3. Ajouter des composants de formulaire complexes (BetSlip, Registration, etc.)
4. Créer un Storybook pour documenter tous les composants

## Ressources

- [Documentation shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/) (primitives utilisés par shadcn)

---

**Date de configuration:** 2025-11-06
**Configuré par:** Agent 1 - BATCH 1
**Projet:** BetLab Web Application
