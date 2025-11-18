# Quick Start - BetLab Layouts

Guide rapide pour utiliser les composants de layout.

## Installation

Aucune installation supplémentaire requise ! Tous les packages sont déjà installés.

## Usage Simple

### 1. Layout Complet (Exemple tout-en-un)

```tsx
import { LayoutsExample } from '@/presentation/components/ui/legacy/examples'

export default function Page() {
  return <LayoutsExample />
}
```

Cet exemple montre tous les composants intégrés ensemble.

---

### 2. Usage Custom avec Hook

```tsx
'use client'

import { MobileBottomNav, MobileHeader, DesktopSidebar } from '@/presentation/components/layouts'
import { useNavigation } from '@/presentation/hooks'

export default function Layout({ children }) {
  const {
    activeTab,
    setActiveTab,
    sidebarCollapsed,
    toggleSidebar,
    activeSport,
    setActiveSport,
  } = useNavigation()

  return (
    <div className="min-h-screen">
      {/* Desktop Sidebar (≥ lg) */}
      <DesktopSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        collapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
        user={{
          name: 'John Doe',
          email: 'john@betlab.com',
          avatar: 'https://github.com/shadcn.png',
        }}
        onLogout={() => console.log('Logout')}
      />

      {/* Mobile Header (< lg) */}
      <MobileHeader
        showSportSelector
        activeSport={activeSport}
        onSportChange={setActiveSport}
        showAvatar
        avatarSrc="https://github.com/shadcn.png"
        avatarFallback="JD"
        showThemeToggle
      />

      {/* Main Content */}
      <main className="lg:ml-72 pb-20 lg:pb-8 px-4 pt-4">
        {children}
      </main>

      {/* Mobile Bottom Nav (< lg) */}
      <MobileBottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        notifications={{
          matches: 3,
          favorites: 1,
        }}
      />
    </div>
  )
}
```

---

### 3. Usage Individuel

#### Mobile Bottom Nav Seul

```tsx
'use client'

import { MobileBottomNav } from '@/presentation/components/layouts'
import { useState } from 'react'

export default function MyNav() {
  const [tab, setTab] = useState('home')

  return (
    <MobileBottomNav
      activeTab={tab}
      onTabChange={setTab}
      notifications={{ matches: 5 }}
    />
  )
}
```

#### Mobile Header Seul

```tsx
'use client'

import { MobileHeader } from '@/presentation/components/layouts'
import { useState } from 'react'

export default function MyHeader() {
  const [sport, setSport] = useState('football')

  return (
    <MobileHeader
      title="BetLab"
      showSportSelector
      activeSport={sport}
      onSportChange={setSport}
      showThemeToggle
    />
  )
}
```

#### Desktop Sidebar Seul

```tsx
'use client'

import { DesktopSidebar } from '@/presentation/components/layouts'
import { useState } from 'react'

export default function MySidebar() {
  const [tab, setTab] = useState('home')
  const [collapsed, setCollapsed] = useState(false)

  return (
    <DesktopSidebar
      activeTab={tab}
      onTabChange={setTab}
      collapsed={collapsed}
      onToggleCollapse={() => setCollapsed(!collapsed)}
    />
  )
}
```

---

## Configuration Requise

### Viewport Meta Tag

**IMPORTANT:** Pour activer les safe areas iOS, ajouter dans `app/layout.tsx`:

```tsx
export const metadata = {
  viewport: {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover', // ← Essentiel pour safe areas !
  },
}
```

Ou dans `pages/_app.tsx` (Pages Router):

```html
<Head>
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
</Head>
```

### Theme Provider

Le projet utilise déjà `next-themes`. Vérifier que c'est configuré dans le root layout:

```tsx
import { ThemeProvider } from 'next-themes'

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

---

## Responsive Behavior

Les composants s'adaptent automatiquement:

| Screen Size | MobileHeader | MobileBottomNav | DesktopSidebar |
|-------------|--------------|-----------------|----------------|
| < 1024px (mobile) | ✅ Visible | ✅ Visible | ❌ Hidden |
| ≥ 1024px (desktop) | ❌ Hidden | ❌ Hidden | ✅ Visible |

Breakpoint: `lg:` = 1024px (Tailwind CSS)

---

## Layout Spacing

Pour éviter que le contenu soit caché sous la navigation:

```tsx
<main className={cn(
  'lg:ml-72',        // Offset sidebar desktop (280px)
  'pb-20 lg:pb-8',   // Offset bottom nav mobile (80px)
  'pt-4 px-4',       // Padding général
)}>
  {children}
</main>
```

Ajuster si sidebar collapsed:

```tsx
<main className={cn(
  sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72',
  'pb-20 lg:pb-8',
)}>
```

---

## Notifications

Afficher des badges sur les nav items:

```tsx
<MobileBottomNav
  activeTab="home"
  onTabChange={setTab}
  notifications={{
    matches: 3,      // Badge "3" sur Matches
    favorites: 1,    // Badge "1" sur Favorites
  }}
/>
```

Si le nombre > 99, affiche "99+".

---

## Collapsible Sidebar

Le sidebar desktop peut se réduire de 280px à 80px:

```tsx
const [collapsed, setCollapsed] = useState(false)

<DesktopSidebar
  collapsed={collapsed}
  onToggleCollapse={() => setCollapsed(!collapsed)}
/>
```

État persiste automatiquement dans localStorage (`sidebar-collapsed`).

---

## Sport Selector

Switcher entre Football et Basketball:

```tsx
<MobileHeader
  showSportSelector
  activeSport={sport}
  onSportChange={(newSport) => setSport(newSport)}
/>
```

État persiste automatiquement dans localStorage (`active-sport`).

---

## Back Button

Pour pages secondaires:

```tsx
<MobileHeader
  showBack
  onBackClick={() => router.back()}
  title="Match Details"
/>
```

Le logo BetLab est remplacé par un bouton ← (ArrowLeft).

---

## Testing

### Browser DevTools

1. Toggle device toolbar (Ctrl+Shift+M / Cmd+Shift+M)
2. Sélectionner "iPhone 14 Pro" (390x844)
3. Vérifier bottom nav + header
4. Resize à desktop (> 1024px)
5. Vérifier sidebar apparaît

### Safe Areas Testing

Dans Console DevTools:

```js
// Simuler iPhone notch
document.documentElement.style.setProperty('--safe-area-inset-top', '47px')
document.documentElement.style.setProperty('--safe-area-inset-bottom', '34px')
```

Le header et bottom nav devraient s'ajuster.

---

## Troubleshooting

### Bottom nav cache le contenu

Ajouter padding-bottom:

```tsx
<main className="pb-20 lg:pb-8">
  {children}
</main>
```

### Sidebar cache le contenu

Ajouter margin-left:

```tsx
<main className="lg:ml-72">
  {children}
</main>
```

### Theme toggle ne fonctionne pas

Vérifier `ThemeProvider` dans root layout.

### Safe areas ne fonctionnent pas

Vérifier meta viewport avec `viewport-fit=cover`.

---

## Documentation Complète

Voir `lib/components/layouts/README.md` pour:
- Props TypeScript détaillées
- Safe area handling complet
- Accessibility (WCAG 2.1)
- Animations
- Browser support
- Et plus...

---

## Support

Questions ou bugs : Contacter l'équipe BetLab.
