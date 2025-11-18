# BetLab Layout Components

Composants de layout responsive pour l'application BetLab, optimisés pour mobile et desktop.

## Composants

### 1. MobileBottomNav

Navigation bottom bar mobile (iOS/Android style).

**Features:**
- 4 items de navigation (Home, Matches, Favorites, Settings)
- Badges de notification (dots rouges)
- Active state avec animation scale
- Support du safe area (iOS notch)
- Haptic feedback (si supporté)
- Touch targets optimisés (64px)

**Usage:**
```tsx
import { MobileBottomNav } from '@/presentation/components/layouts'

function App() {
  const [activeTab, setActiveTab] = useState('home')

  return (
    <MobileBottomNav
      activeTab={activeTab}
      onTabChange={setActiveTab}
      notifications={{
        matches: 3,
        favorites: 1,
      }}
    />
  )
}
```

**Props:**
```typescript
interface MobileBottomNavProps {
  activeTab: 'home' | 'matches' | 'favorites' | 'settings'
  onTabChange: (tab: string) => void
  notifications?: {
    matches?: number
    favorites?: number
  }
  className?: string
}
```

---

### 2. MobileHeader

Header mobile sticky avec interactions.

**Features:**
- Sticky top avec backdrop blur
- Logo BetLab ou bouton back
- Sport selector (⚽/🏀) avec pills toggle
- User avatar cliquable
- Theme toggle (sun/moon)
- Collapsible sur scroll
- Support du safe area (iOS notch)

**Usage:**
```tsx
import { MobileHeader } from '@/presentation/components/layouts'

function App() {
  const [sport, setSport] = useState('football')
  const [collapsed, setCollapsed] = useState(false)

  return (
    <MobileHeader
      showSportSelector
      activeSport={sport}
      onSportChange={setSport}
      showAvatar
      avatarSrc="/avatar.jpg"
      avatarFallback="JD"
      showThemeToggle
      collapsible
      collapsed={collapsed}
    />
  )
}
```

**Props:**
```typescript
interface MobileHeaderProps {
  title?: string
  showBack?: boolean
  onBackClick?: () => void
  showSportSelector?: boolean
  activeSport?: 'football' | 'basketball'
  onSportChange?: (sport: string) => void
  showAvatar?: boolean
  avatarSrc?: string
  avatarFallback?: string
  onAvatarClick?: () => void
  showThemeToggle?: boolean
  showMenu?: boolean
  onMenuClick?: () => void
  collapsible?: boolean
  collapsed?: boolean
  className?: string
}
```

---

### 3. DesktopSidebar

Sidebar gauche pour desktop (lg:).

**Features:**
- Width: 280px (collapsible à 80px)
- Logo + nom BetLab
- Navigation verticale (4 items)
- User profile card
- Theme toggle
- Logout button
- Tooltips quand collapsed
- Animations smooth
- Hidden < lg breakpoint

**Usage:**
```tsx
import { DesktopSidebar } from '@/presentation/components/layouts'

function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [collapsed, setCollapsed] = useState(false)

  return (
    <DesktopSidebar
      activeTab={activeTab}
      onTabChange={setActiveTab}
      collapsed={collapsed}
      onToggleCollapse={() => setCollapsed(!collapsed)}
      user={{
        name: 'John Doe',
        email: 'john@example.com',
        avatar: '/avatar.jpg',
      }}
      onLogout={() => console.log('Logout')}
    />
  )
}
```

**Props:**
```typescript
interface DesktopSidebarProps {
  activeTab: 'home' | 'matches' | 'favorites' | 'settings'
  onTabChange: (tab: string) => void
  collapsed?: boolean
  onToggleCollapse?: () => void
  user?: {
    name: string
    email: string
    avatar?: string
  }
  onLogout?: () => void
  className?: string
}
```

---

## Hook useNavigation

Hook custom pour gérer l'état de navigation.

**Features:**
- Active tab management
- Sidebar collapse state
- Active sport selection
- Header visibility (scroll)
- localStorage persistence
- Scroll handling

**Usage:**
```tsx
import { useNavigation } from '@/presentation/hooks'

function App() {
  const {
    activeTab,
    setActiveTab,
    sidebarCollapsed,
    toggleSidebar,
    activeSport,
    setActiveSport,
    headerVisible,
    handleScroll,
  } = useNavigation('home', 'football')

  // Use in components...
}
```

**API:**
```typescript
export function useNavigation(
  initialTab: NavigationTab = 'home',
  initialSport: Sport = 'football'
): UseNavigationReturn

interface UseNavigationReturn {
  activeTab: NavigationTab
  setActiveTab: (tab: NavigationTab) => void
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  activeSport: Sport
  setActiveSport: (sport: Sport) => void
  headerVisible: boolean
  handleScroll: () => void
}
```

---

## Safe Area Handling

Les composants MobileBottomNav et MobileHeader utilisent les **CSS environment variables** pour gérer les safe areas (notch iOS, barre de navigation Android).

### Pourquoi c'est important ?

Sur les appareils modernes (iPhone X+, appareils Android sans bouton), l'écran s'étend jusqu'aux bords, incluant les zones "dangereuses" :
- **Top:** Le notch/caméra avant (Dynamic Island sur iPhone)
- **Bottom:** L'indicateur de geste système
- **Left/Right:** Les bords arrondis

Sans safe area handling, votre contenu peut être masqué ou inaccessible.

### Comment ça marche ?

CSS fournit des variables d'environnement :
```css
env(safe-area-inset-top)      /* Distance depuis le haut sécurisé */
env(safe-area-inset-bottom)   /* Distance depuis le bas sécurisé */
env(safe-area-inset-left)     /* Distance depuis la gauche sécurisée */
env(safe-area-inset-right)    /* Distance depuis la droite sécurisée */
```

### Implémentation dans BetLab

#### MobileBottomNav
```tsx
<nav className="pb-[env(safe-area-inset-bottom,0px)]">
  {/* Navigation items */}
</nav>
```
- `env(safe-area-inset-bottom, 0px)` : Utilise la safe area bottom
- `0px` : Fallback si non supporté (navigateurs desktop)

**Résultat :**
- iPhone 14 Pro : +34px de padding bottom
- iPhone 8 : 0px (pas de notch)
- Desktop : 0px (pas de safe area)

#### MobileHeader
```tsx
<header className="pt-[env(safe-area-inset-top,0px)]">
  {/* Header content */}
</header>
```
- Ajoute du padding top pour éviter le notch

**Résultat :**
- iPhone 14 Pro : +47px de padding top
- iPhone 8 : 0px
- Android : Variable selon appareil

### Configuration requise

Dans votre HTML `<head>` :
```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```

**Important :** `viewport-fit=cover` est essentiel pour activer les safe areas.

### Tailwind Configuration

Les classes Tailwind utilisent les valeurs arbitraires :
```tsx
// OK ✅
className="pb-[env(safe-area-inset-bottom,0px)]"

// Aussi valide ✅
className="pt-[env(safe-area-inset-top)]"
```

### Testing

**Sur navigateur desktop :**
```css
/* Dans DevTools, ajouter temporairement : */
html {
  --safe-area-inset-top: 47px;
  --safe-area-inset-bottom: 34px;
}
```

**Sur appareil réel :**
1. Déployer sur Vercel/Netlify
2. Ouvrir sur iPhone/Android
3. Vérifier les espacements

**Simulateur iOS :**
1. Xcode > Open Developer Tool > Simulator
2. Choisir iPhone 14 Pro ou +
3. Ouvrir Safari > votre URL

### Combinaison avec h-16

```tsx
// MobileBottomNav
<nav className="h-16 pb-[env(safe-area-inset-bottom,0px)]">
  <div className="h-16"> {/* Contenu fixe 64px */}
    {/* Items */}
  </div>
</nav>
```

**Hauteur totale :**
- Desktop : 64px (h-16 uniquement)
- iPhone 14 Pro : 64px + 34px = 98px
- Parfait pour éviter le conflit avec l'indicateur système

### Browser Support

| Browser | Support |
|---------|---------|
| Safari iOS 11+ | ✅ Full |
| Chrome Android | ✅ Full |
| Safari macOS | ⚠️ Fallback (0px) |
| Chrome Desktop | ⚠️ Fallback (0px) |
| Firefox | ⚠️ Fallback (0px) |

Le fallback `0px` assure que ça fonctionne partout sans casser.

---

## Responsive Behavior

Les composants s'adaptent automatiquement selon la taille d'écran :

### Mobile (< 1024px)
- `MobileHeader` : visible
- `MobileBottomNav` : visible
- `DesktopSidebar` : hidden (`lg:hidden`)

### Desktop (≥ 1024px)
- `MobileHeader` : hidden (`lg:hidden`)
- `MobileBottomNav` : hidden (`lg:hidden`)
- `DesktopSidebar` : visible (`hidden lg:flex`)

### Layout complet

```tsx
<div className="min-h-screen">
  {/* Desktop Sidebar */}
  <DesktopSidebar {...props} />

  {/* Mobile Header */}
  <MobileHeader {...props} />

  {/* Main Content */}
  <main className={cn(
    'lg:ml-72', // Offset pour sidebar desktop
    'pb-20 lg:pb-8', // Padding bottom pour mobile nav
  )}>
    {children}
  </main>

  {/* Mobile Bottom Nav */}
  <MobileBottomNav {...props} />
</div>
```

---

## Animations

Toutes les animations utilisent des CSS transitions pour performance :

### MobileBottomNav
- Active state : `scale-110` (200ms)
- Notification badge : `animate-in zoom-in-50`
- Active indicator : Rounded bar bottom

### MobileHeader
- Collapse : `height 300ms`
- Sport pills : `scale-110` + `shadow`
- Backdrop blur : Toujours actif

### DesktopSidebar
- Collapse : `width 300ms`
- Labels : `opacity 200ms` (fade out/in)
- Active item : `background` transition

---

## Accessibility

Tous les composants respectent WCAG 2.1 :

### Keyboard Navigation
- Tab : Navigate entre items
- Enter/Space : Activer item
- Escape : Fermer modals/menus

### ARIA Labels
```tsx
<button
  aria-label="Navigate to home"
  aria-current={isActive ? 'page' : undefined}
>
  Home
</button>
```

### Focus Visible
```tsx
className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
```

### Screen Readers
- Navigation landmarks : `<nav role="navigation">`
- Current page : `aria-current="page"`
- Notifications : `aria-label="3 notifications"`

---

## Example Complet

Voir `lib/components/examples/layouts-example.tsx` pour un exemple complet incluant :
- Intégration de tous les layouts
- Gestion du scroll
- Collapsible header/sidebar
- Sport selector
- Notifications
- Theme toggle
- Responsive design
- Safe area handling

---

## Customization

Tous les composants acceptent `className` pour override :

```tsx
<MobileBottomNav
  className="bg-blue-500 border-blue-600"
  // ...
/>
```

Utilisez `cn()` utility pour merge classes :
```tsx
import { cn } from '@/shared/utils'

className={cn(
  'default-classes',
  condition && 'conditional-class',
  props.className
)}
```

---

## Support

Pour questions ou bugs, contacter l'équipe BetLab.
