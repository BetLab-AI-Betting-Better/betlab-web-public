# Architecture ? Betlab Web

## Objectif
- MV (ViewModel) partout pour isoler la logique m?tier/formatage hors des composants UI.
- D?coupage clair : core (domain), application (use-cases + VM), presentation (UI), infrastructure (APIs), shared (utils).

## Arborescence (racine)

```
.
?? public/
?? src/
?  ?? app/                 # Next.js routes
?  ?? application/         # Use-cases + ViewModels + validation
?  ?  ?? predictions/
?  ?  ?? view-models/
?  ?     ?? fixtures/
?  ?     ?? match-detail/
?  ?? core/                # Entities + interfaces + domain rules
?  ?? infrastructure/      # Repos/API clients
?  ?? presentation/        # UI components + pages
?  ?? shared/              # utils, types, constants
?  ?? tests/
?? docs/
```

## Convention MV

- Tout formatage (labels, xG, pourcentages, logique d?affichage) doit ?tre fait dans un ViewModel.
- Les composants re?oivent **uniquement** des donn?es pr?tes ? afficher.
- Validation/settlement (ex: best market) est dans `application/predictions`.

## MV d?j? appliqu?
- Match Detail (tabs + header)
- Match Cards / Lists (fixtures)

## Prochaines migrations
- Pages d?accueil (stats et filtres avanc?s)
- Composants ?PredictionDisplay? et variantes
