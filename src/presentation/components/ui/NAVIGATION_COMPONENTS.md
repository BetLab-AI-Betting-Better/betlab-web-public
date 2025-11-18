# Navigation & Overlay Components - BetLab Web

## Agent 3 - BATCH 1

Ce document liste tous les composants de navigation et overlay installés et créés pour le projet BetLab Web.

---

## Composants shadcn/ui installés

### 1. Dialog (`dialog.tsx`)
- Composant de dialogue modal de base
- Centré avec overlay
- Animations fade-in/zoom
- Support dark mode

**Chemin:** `C:\Users\bloraydev\Documents\GitHub Projets\betlab-web\lib\components\ui\dialog.tsx`

### 2. Sheet (`sheet.tsx`)
- Panneau latéral/drawer
- 4 directions: top, right, bottom, left
- Slide animations
- Backdrop blur

**Chemin:** `C:\Users\bloraydev\Documents\GitHub Projets\betlab-web\lib\components\ui\sheet.tsx`

### 3. Tabs (`tabs.tsx`)
- Onglets avec contenu switchable
- Style shadcn/ui
- Animations de transition

**Chemin:** `C:\Users\bloraydev\Documents\GitHub Projets\betlab-web\lib\components\ui\tabs.tsx`

### 4. Dropdown Menu (`dropdown-menu.tsx`)
- Menu déroulant avec items cliquables
- **AMELIORE POUR MOBILE:**
  - Touch targets 44px minimum
  - Active:scale feedback
  - Transitions smooth
  - Padding optimisé mobile/desktop

**Chemin:** `C:\Users\bloraydev\Documents\GitHub Projets\betlab-web\lib\components\ui\dropdown-menu.tsx`

### 5. Popover (`popover.tsx`)
- Popup de contenu contextuel
- Positionnement automatique
- Arrow pointer

**Chemin:** `C:\Users\bloraydev\Documents\GitHub Projets\betlab-web\lib\components\ui\popover.tsx`

### 6. Command (`command.tsx`)
- Command palette / Search
- Filtrage rapide
- Keyboard navigation

**Chemin:** `C:\Users\bloraydev\Documents\GitHub Projets\betlab-web\lib\components\ui\command.tsx`

---

## Variants Mobile Custom

### 1. Bottom Sheet (`bottom-sheet.tsx`)

**Caractéristiques:**
- Slide from bottom (mobile-first)
- **Swipe down to dismiss** (react-swipeable)
- Drag handle indicator
- Backdrop blur
- Safe area insets iOS (`env(safe-area-inset-bottom)`)
- Max height: 90vh (configurable)
- Rounded top corners (2xl)
- Scrollable content area
- Smooth animations (300ms)

**Props:**
- `showHandle` - Afficher la poignée (défaut: true)
- `swipeable` - Activer swipe to dismiss (défaut: true)
- `maxHeight` - Hauteur max (défaut: "90vh")

**Chemin:** `C:\Users\bloraydev\Documents\GitHub Projets\betlab-web\lib\components\ui\bottom-sheet.tsx`

**Usage:**
```tsx
import {
  BottomSheet,
  BottomSheetTrigger,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetFooter,
  BottomSheetTitle,
  BottomSheetDescription,
} from "@/presentation/components/ui/bottom-sheet"

<BottomSheet>
  <BottomSheetTrigger>Open</BottomSheetTrigger>
  <BottomSheetContent>
    <BottomSheetHeader>
      <BottomSheetTitle>Title</BottomSheetTitle>
    </BottomSheetHeader>
    {/* Content */}
  </BottomSheetContent>
</BottomSheet>
```

---

### 2. Modal (`modal.tsx`)

**Caractéristiques:**
- **Full screen sur mobile** (<768px) avec variant `mobile-fullscreen`
- **Normal centered sur desktop**
- Animation slide-up mobile
- Close button top-right accessible
- Scrollable content
- Responsive header/footer
- Dark mode support

**Variants:**
- `default` - Centré sur tous les écrans (max-w-lg)
- `mobile-fullscreen` - Full screen mobile, normal desktop

**Chemin:** `C:\Users\bloraydev\Documents\GitHub Projets\betlab-web\lib\components\ui\modal.tsx`

**Usage:**
```tsx
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from "@/presentation/components/ui/modal"

<Modal>
  <ModalTrigger>Open Modal</ModalTrigger>
  <ModalContent variant="mobile-fullscreen">
    <ModalHeader>
      <ModalTitle>Title</ModalTitle>
    </ModalHeader>
    <ModalBody>Content</ModalBody>
    <ModalFooter>Actions</ModalFooter>
  </ModalContent>
</Modal>
```

---

### 3. Swipeable Tabs (`swipeable-tabs.tsx`)

**Caractéristiques:**
- **Touch gestures** (swipe left/right pour naviguer)
- Snap scroll horizontal
- Animated indicator
- Overflow-x-scroll avec scrollbar caché
- Touch-friendly triggers (min 44px)
- Active scale feedback
- Smooth transitions
- Context API pour state management

**Props:**
- `scrollable` - Active scroll horizontal (défaut: true)
- `swipeable` - Active swipe gestures (défaut: true)

**Chemin:** `C:\Users\bloraydev\Documents\GitHub Projets\betlab-web\lib\components\ui\swipeable-tabs.tsx`

**Usage:**
```tsx
import {
  SwipeableTabs,
  SwipeableTabsList,
  SwipeableTabsTrigger,
  SwipeableTabsContent,
} from "@/presentation/components/ui/swipeable-tabs"

<SwipeableTabs defaultValue="tab1">
  <SwipeableTabsList scrollable>
    <SwipeableTabsTrigger value="tab1">Tab 1</SwipeableTabsTrigger>
    <SwipeableTabsTrigger value="tab2">Tab 2</SwipeableTabsTrigger>
  </SwipeableTabsList>
  <SwipeableTabsContent value="tab1" swipeable>
    Content 1
  </SwipeableTabsContent>
  <SwipeableTabsContent value="tab2" swipeable>
    Content 2
  </SwipeableTabsContent>
</SwipeableTabs>
```

---

## Exemples d'utilisation

### 1. Bottom Sheet Example (`bottom-sheet-example.tsx`)

Démontre:
- Basic usage
- Scrollable content
- Sans drag handle
- Non-swipeable (important actions)
- Form dans bottom sheet

**Chemin:** `C:\Users\bloraydev\Documents\GitHub Projets\betlab-web\lib\components\examples\bottom-sheet-example.tsx`

---

### 2. Swipeable Tabs Example (`swipeable-tabs-example.tsx`)

Démontre:
- Basic usage
- BetLab dashboard style
- Scrollable tabs (many tabs)
- Non-swipeable tabs

**Chemin:** `C:\Users\bloraydev\Documents\GitHub Projets\betlab-web\lib\components\examples\swipeable-tabs-example.tsx`

---

### 3. Modal Example (`modal-example.tsx`)

Démontre:
- Basic modal
- Mobile fullscreen variant
- Scrollable content
- Form dans modal
- Confirmation dialog
- Success message

**Chemin:** `C:\Users\bloraydev\Documents\GitHub Projets\betlab-web\lib\components\examples\modal-example.tsx`

---

## Dépendances installées

### react-swipeable (v7.0.2)
- Gère les gestures tactiles
- Utilisé dans `bottom-sheet` et `swipeable-tabs`
- Installation: `pnpm add react-swipeable`

---

## Design Principles

### Mobile-First
Tous les composants sont conçus mobile-first avec:
- Touch targets minimum 44px (iOS/Android guidelines)
- Safe area insets pour notch/home indicator
- Swipe gestures naturels
- Animations optimisées (GPU-accelerated)

### Accessible
- ARIA labels
- Keyboard navigation
- Focus management
- Screen reader support

### Dark Mode
- Support complet du dark mode
- Variables CSS personnalisées BetLab
- Transitions smooth

### Performance
- Animations hardware-accelerated
- Lazy loading
- Optimized re-renders

---

## Couleurs BetLab utilisées

Les composants utilisent les variables CSS définies dans `globals.css`:

**Primaires:**
- `--navy` (#003366)
- `--lime` (#C8DC3F)

**Neutres:**
- `--background`, `--foreground`
- `--gray`, `--gray-light`, `--gray-ultra-light`

**Sémantiques:**
- `--error`, `--success`, `--warning`, `--info`, `--live`

---

## Tests recommandés

### Mobile
- [ ] Test sur iPhone (safe areas)
- [ ] Test sur Android
- [ ] Test swipe gestures
- [ ] Test landscape/portrait
- [ ] Test avec keyboard virtuel

### Desktop
- [ ] Test responsive breakpoints
- [ ] Test keyboard navigation
- [ ] Test accessibility

### Dark Mode
- [ ] Test toutes les variantes
- [ ] Test transitions theme

---

## Notes importantes

1. **Ref Forwarding**: Le `bottom-sheet.tsx` a été corrigé pour gérer les refs correctement (voir system-reminder).

2. **Touch Targets**: Tous les items interactifs font minimum 44px de hauteur sur mobile (WCAG AAA).

3. **Safe Areas**: Les composants mobile utilisent `env(safe-area-inset-*)` pour éviter le notch/home indicator.

4. **Animations**: Durée standard 300ms pour cohérence UX.

---

## Prochaines étapes recommandées

1. Intégrer les composants dans les pages existantes
2. Tester sur vrais devices
3. Créer des variants pour cas spécifiques BetLab
4. Ajouter analytics sur les interactions
5. Optimiser les animations si nécessaire

---

**Agent 3 - BATCH 1 - Mission accomplie** ✓
