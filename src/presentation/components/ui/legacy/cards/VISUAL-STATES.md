# BetLab Cards - États Visuels

Documentation des différents états et apparences des composants Cards.

## MatchCard

### État 1: Match Scheduled (À venir)
```
┌─────────────────────────────────────────────────┐
│ [Logo] Ligue 1          19:45    [Star]        │
│                                                 │
│    [PSG]         VS         [OM]               │
│     48px                    48px               │
│   PSG                        OM                │
│                                                 │
│ ┌─────────────────────────────────────────────┐ │
│ │ Over/Under 1.5    [+12.5% edge] [Haute]   │ │
│ │ Over 1.5                                    │ │
│ └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
Height: 140px | Rounded: xl | Shadow: card
```

### État 2: Match Live (En cours)
```
┌─────────────────────────────────────────────────┐
│ [Logo] Premier League [LIVE] 19:45  [Star]    │
│                                                 │
│  [MUN]          2-1         [LIV]              │
│   48px         SCORE        48px               │
│ Man United                Liverpool            │
│                                                 │
│ ┌─────────────────────────────────────────────┐ │
│ │ BTTS                [+8.5% edge] [Moyenne] │ │
│ │ BTTS Oui                                    │ │
│ └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
LiveBadge: Rouge pulsant | Score en gros
```

### État 3: Match Finished (Terminé)
```
┌─────────────────────────────────────────────────┐
│ [Logo] La Liga             FT      [Star]      │
│                                                 │
│  [RMA]         0-2         [BAR]               │
│   48px        Terminé       48px               │
│ Real Madrid              Barcelona             │
│                                                 │
│ ┌─────────────────────────────────────────────┐ │
│ │ Score Exact          [+10.2% edge] [Haute] │ │
│ │ 2-1                                         │ │
│ └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
Score final affiché | FT (Full Time)
```

### État 4: Match Compact (Version réduite)
```
┌─────────────────────────────────────────────────┐
│ [L] Ligue 1          19:45    [Star]          │
│  [PSG]   VS   [OM]                            │
│   32px        32px                             │
│ ┌───────────────────────────────────────────┐  │
│ │ Over 1.5    [+12.5%] [Haute]             │  │
│ └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
Height: 100px | Logos 32px | Texte réduit
```

### État 5: Match Sans Prédiction
```
┌─────────────────────────────────────────────────┐
│ [Logo] Ligue 1          19:45    [Star]        │
│                                                 │
│    [PSG]         VS         [OM]               │
│     48px                    48px               │
│   PSG                        OM                │
│                                                 │
└─────────────────────────────────────────────────┘
Pas de footer de prédiction | Plus compact
```

### État 6: Skeleton Loading
```
┌─────────────────────────────────────────────────┐
│ [▓] ▓▓▓▓▓▓          ▓▓▓▓    [▓]              │
│                                                 │
│    [▓▓]        ▓▓        [▓▓]                 │
│    ▓▓▓▓                   ▓▓▓▓                │
│                                                 │
│ ┌─────────────────────────────────────────────┐ │
│ │ ▓▓▓▓▓          ▓▓▓▓▓▓▓▓    ▓▓▓▓▓▓        │ │
│ └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
Animations de pulsation | Gris neutre
```

---

## PredictionCard

### Over15Card
```
┌─────────────────────────────────────────────────┐
│ [Icon] Over/Under 1.5 Buts        [Haute]      │
│        Type: over15                             │
│                                                 │
│ ┌──────────────────┐ ┌──────────────────┐     │
│ │   Over 1.5       │ │   Under 1.5      │     │
│ │     68%          │ │      32%         │     │
│ │   (Vert)         │ │    (Rouge)       │     │
│ └──────────────────┘ └──────────────────┘     │
│                                                 │
│ [Progress Bar: 68%] ━━━━━━━━━▒▒▒▒▒            │
│                                                 │
│ ┌──────────────┐ ┌──────────────┐             │
│ │ Moy. buts    │ │ Derniers     │             │
│ │    2.8       │ │   7/10       │             │
│ └──────────────┘ └──────────────┘             │
│                                                 │
│ [+15.2% edge]  Il y a 5 min  [Voir détails]   │
└─────────────────────────────────────────────────┘
Gradient optionnel | Icon TrendingUp
```

### BTTSCard
```
┌─────────────────────────────────────────────────┐
│ [Icon] Les Deux Équipes Marquent   [Moyenne]   │
│        Type: btts                               │
│                                                 │
│ ┌──────────────────┐ ┌──────────────────┐     │
│ │   BTTS Oui       │ │   BTTS Non       │     │
│ │     62%          │ │      38%         │     │
│ │   (Bleu)         │ │    (Gris)        │     │
│ └──────────────────┘ └──────────────────┘     │
│                                                 │
│ [Progress Bar: 62%] ━━━━━━━━━━▒▒▒▒            │
│                                                 │
│ ┌──────────────┐ ┌──────────────┐             │
│ │ Buts moy. D  │ │ Buts moy. E  │             │
│ │    1.8       │ │    1.5       │             │
│ └──────────────┘ └──────────────┘             │
│                                                 │
│ [+8.5% edge]  Il y a 10 min                    │
└─────────────────────────────────────────────────┘
Icon Target | Bleu pour BTTS
```

### ExactScoreCard
```
┌─────────────────────────────────────────────────┐
│ [Icon] Score Exact              [Moyenne]       │
│        Type: exactScore                         │
│                                                 │
│ Scores les plus probables                      │
│                                                 │
│ ┌─────────────────────────────────────────────┐ │
│ │ [1] 2-1                            18%      │ │
│ │     (Primary border, fond primary/10)       │ │
│ └─────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────┐ │
│ │ [2] 1-1                            15%      │ │
│ └─────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────┐ │
│ │ [3] 2-0                            12%      │ │
│ └─────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────┐ │
│ │ [4] 1-0                            10%      │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ [+10.2% edge]  Il y a 3 min                    │
└─────────────────────────────────────────────────┘
Icon Trophy | Top score mis en avant
```

### HTFTCard
```
┌─────────────────────────────────────────────────┐
│ [Icon] Mi-Temps / Temps Plein     [Haute]      │
│        Type: htft                               │
│                                                 │
│ Domicile / Domicile                            │
│ [Progress: 45%] ━━━━━━━━━━━━▒▒▒▒▒▒▒▒          │
│                                        45%      │
│                                                 │
│ Nul / Domicile                                 │
│ [Progress: 22%] ━━━━━▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒         │
│                                        22%      │
│                                                 │
│ Domicile / Nul                                 │
│ [Progress: 18%] ━━━━▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒         │
│                                        18%      │
│                                                 │
│ Nul / Nul                                      │
│ [Progress: 15%] ━━━▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒         │
│                                        15%      │
│                                                 │
│ [+12.8% edge]  Il y a 7 min  [Voir détails]   │
└─────────────────────────────────────────────────┘
Icon Clock | Multiples progress bars
```

### HalfCompareCard
```
┌─────────────────────────────────────────────────┐
│ [Icon] Comparaison Mi-Temps        [Moyenne]   │
│        Type: halfCompare                        │
│                                                 │
│ ┌──────────────────┐ ┌──────────────────┐     │
│ │ 1ère Mi-Temps    │ │ 2ème Mi-Temps    │     │
│ │                  │ │                  │     │
│ │      1.2         │ │      1.8         │     │
│ │                  │ │  (Primary)       │     │
│ │   buts moy.      │ │   buts moy.      │     │
│ └──────────────────┘ └──────────────────┘     │
│                                                 │
│ ┌─────────────────────────────────────────────┐ │
│ │ Plus de buts attendus en 2ème mi-temps     │ │
│ │ Probabilité: 65%                            │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ [+7.5% edge]  Il y a 15 min                    │
└─────────────────────────────────────────────────┘
Icon BarChart3 | Comparaison visuelle
```

### CleanSheetCard
```
┌─────────────────────────────────────────────────┐
│ [Icon] Clean Sheet                  [Faible]   │
│        Type: cleanSheet                         │
│                                                 │
│ ┌──────────────────┐ ┌──────────────────┐     │
│ │   Domicile       │ │   Extérieur      │     │
│ │                  │ │                  │     │
│ │      35%         │ │      28%         │     │
│ │   (Bleu)         │ │   (Violet)       │     │
│ │  Clean Sheet     │ │  Clean Sheet     │     │
│ └──────────────────┘ └──────────────────┘     │
│                                                 │
│ ┌──────────────┐ ┌──────────────┐             │
│ │ Déf. domicile│ │ Déf. extérieur│            │
│ │   7.5/10     │ │   6.8/10     │             │
│ └──────────────┘ └──────────────┘             │
│                                                 │
│ [+5.2% edge]  Il y a 20 min                    │
└─────────────────────────────────────────────────┘
Icon Shield | Rating de défense
```

### CornersCard
```
┌─────────────────────────────────────────────────┐
│ [Icon] Corners                      [Haute]     │
│        Type: corners                            │
│                                                 │
│ ┌─────────────────────────────────────────────┐ │
│ │  Total corners attendus                     │ │
│ │                                             │ │
│ │         10.5                                │ │
│ │  (Jaune/Orange gradient, très gros)        │ │
│ │                                             │ │
│ │  Over 8.5: 72%                             │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ ┌──────────────┐ ┌──────────────┐             │
│ │ Domicile moy.│ │ Extérieur moy│             │
│ │    5.8       │ │    4.7       │             │
│ └──────────────┘ └──────────────┘             │
│                                                 │
│ [+14.2% edge]  Il y a 4 min  [Voir détails]   │
└─────────────────────────────────────────────────┘
Icon Flag | Gradient jaune-orange
```

### InternalProbabilitiesCard (avec gradient)
```
┌─────────────────────────────────────────────────┐
│ [Gradient Navy background]                      │
│ [Icon] Probabilités Internes      [Haute]      │
│        Type: internal                           │
│                                                 │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│ │Victoire │ │  Match  │ │Victoire │           │
│ │   D.    │ │   Nul   │ │   E.    │           │
│ │   55%   │ │   25%   │ │   20%   │           │
│ │ (Vert)  │ │ (Jaune) │ │ (Bleu)  │           │
│ └─────────┘ └─────────┘ └─────────┘           │
│                                                 │
│ Victoire Domicile                              │
│ [━━━━━━━━━━━━▒▒▒▒▒▒▒▒] 55%                    │
│                                                 │
│ Match Nul                                      │
│ [━━━━━▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒] 25%                    │
│                                                 │
│ Victoire Extérieur                             │
│ [━━━━▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒] 20%                    │
│                                                 │
│ [+11.5% edge]  Il y a 6 min  [Voir détails]   │
└─────────────────────────────────────────────────┘
Icon Percent | Gradient Navy | Barres colorées
```

---

## Composants Communs

### ConfidenceBadge
```
Haute:    [Haute]    Vert clair/Vert foncé
Moyenne:  [Moyenne]  Jaune clair/Jaune foncé
Faible:   [Faible]   Rouge clair/Rouge foncé

Taille: text-xs | Padding: px-2 py-0.5 | Border outline
```

### EdgeChip
```
Positif:  [TrendingUp] +12.5% edge   Emerald
Négatif:  -5.2% edge                 Gris

Taille: text-xs | Icon: h-3 w-3 | Compact: sans "edge"
```

### LiveBadge
```
[● LIVE]   Rouge | Pulsation blanche | text-[10px]

Pulse: Animation ping sur le cercle
Sans pulse: Cercle statique
```

---

## Interactions

### Touch States
- **Hover** (desktop): Shadow augmentée, légère élévation
- **Active** (mobile): Scale 0.98, transition smooth
- **Focus**: Ring primary pour accessibilité

### Animations
- **Card entry**: Fade in + slide up
- **Swipe**: Translation X avec resistance
- **Loading**: Pulse sur skeleton

### Responsive
- **Mobile** (< 640px): Full width - 32px padding
- **Tablet** (640-1024px): 2 colonnes pour predictions
- **Desktop** (> 1024px): 3 colonnes pour predictions

---

## Dark Mode

Tous les composants supportent automatiquement le dark mode:
- Backgrounds: bg-card (adaptatif)
- Text: text-foreground / text-muted-foreground
- Borders: border adaptatif
- Accents: Couleurs primary/secondary
- Gradients: Opacités ajustées

---

## Accessibilité

- ARIA labels sur boutons favoris
- Focus visible (ring)
- Contraste WCAG AA minimum
- Touch targets 44x44px minimum
- Screen reader friendly
- Keyboard navigation
