Les bonnes pratiques **Next.js 16.0.1** (proxy.ts, Cache Components, PPR unifiée) et l’architecture **feature-first modulaire** « modules/core/infra/shared ».

# CLAUDE.md — Architecture BetLab Web & Next.js 16

> ✅ **État** : conforme Next.js 16.0.1 (Proxy, Cache Components, PPR), architecture modulaire stable, prête à scaler.

## Sommaire

1. Architecture cible
2. Principes Next.js 16 (proxy, cache, PPR, build)
3. Structure des dossiers (canon)
4. Data fetching & cache (patterns)
5. Auth & sécurité (proxy, guards)
6. State management (échelle de priorités)
7. Workflow dev (ajouter une feature)
8. Build & perf (React Compiler, Turbopack FS cache)
9. Migration legacy (facultatif)
10. Références

---

## 1) Architecture cible

### Vision

* **Feature-first** : chaque domaine vit dans `src/modules/<feature>` (domain/server/ui/cache/tests).
* **Couches** :

  * `app/` : pages/layouts/route handlers **minces** (I/O, orchestration).
  * `modules/` : logique métier colocalisée (domain/server/ui).
  * `core/` : **ports**, policies, config, cache profiles, validation, observabilité.
  * `infra/` : **adaptateurs concrets** (Supabase, BetLab FastAPI…).
  * `shared/` : design system, hooks/utilitaires purs, i18n.

### Règles de dépendances

* `app` → consomme **façades** `modules/*` + `core/*` + `shared/*`.
* `modules/*` → peut importer `core/*`, `infra/*`, `shared/*` (pas d’import transversal entre modules).
* `core/*` → ne dépend **jamais** de `modules/*`.
* `infra/*` → implémente des **ports** de `core/*` (pas de dépendance UI).
* `shared/*` → sans dépendance montante.

Des règles ESLint “boundaries” (et un graphe `depcruise`) doivent l’assurer.

---

## 2) Principes Next.js 16

### 2.1 Proxy unifié (remplace middleware)

* Fichier **`src/proxy.ts`** (ou racine) : exécute du code **avant** la résolution de la requête ; permet rewrite/redirect/headers/réponses directes. L’ancien `middleware` est déprécié. ([Next.js][1])
* Bon usage : garde **légère** (pas de fetch lents), mise en place d’entêtes de contexte, routage conditionnel.

### 2.2 Cache Components + directives

* Activer **`cacheComponents`** dans `next.config`. La mise en cache se pilote **au niveau composant/fonction** via `use cache`, `cacheTag()`, `cacheLife()`. Invalidation via `revalidateTag()` (Server Functions/Route Handlers). ([Next.js][2])
* S’appuyer sur le **guide Caching** et la page **Caching & Revalidating** pour arbitrer time-based vs on-demand. ([Next.js][3])

### 2.3 PPR (Partial Pre-Rendering)

* PPR fait partie du pipeline moderne (initial UI + parties dynamiques), à contrôler via le **caching** ci-dessus. ([Next.js][4])

### 2.4 Build & DX

* **React Compiler** (`reactCompiler`) pour limiter `useMemo/useCallback` manuels. ([Next.js][5])
* **Turbopack File System Cache** pour accélérer dev/build (beta : activer d’abord en dev). ([Next.js][6])
* **Codemod v16** : migre `middleware` → `proxy`, met à jour les options `turbopack`, retire des API instables. ([Next.js][7])

---

## 3) Structure des dossiers (canon)

```
src/
  proxy.ts                      # garde légère (Edge) : rewrites/redirects/headers
  app/
    (public|auth|marketing)/    # route groups + layouts dédiés
    api/                        # route handlers minces (I/O, validation)
      revalidate/route.ts       # POST -> revalidateTag/updateTag
    layout.tsx
    error.tsx
    not-found.tsx

  modules/
    fixtures/
      domain/                   # schémas Zod/TS, invariants
      server/                   # queries/actions (Server) + directives cache
      ui/                       # RSC + clients (.client.tsx), stories
      cache/                    # tags & profils (-life) propres au module
      tests/
    predictions/
    favorites/
    onboarding/

  core/
    config/                     # env typées, feature flags, runtime
    auth/                       # ports + guards (policies)
    http/                       # clients fetch/axios typés
    cache/                      # profils communs (cacheLife), helpers cacheTag
    validation/                 # parse/validate (Zod) transverses
    observability/              # Web Vitals, tracing, logs

  infra/
    services/
      supabase/                 # adapter SSR/Edge implémentant core/auth
      betlab-api/               # client typé vers FastAPI (OpenAPI/codegen)
      third-parties/
  shared/
    ui/                         # design system (primitives/composites)
    hooks/
    utils/
    i18n/

  tests/
    e2e/                        # Playwright
    contracts/                  # tests contrat API + schemas
```

---

## 4) Data fetching & cache (patterns)

### 4.1 Profilage du cache (central)

`core/cache/profiles.ts`

```ts
import { cacheLife, cacheTag } from 'next/cache';

export const TAGS = {
  fixturesLive: () => cacheTag('fixtures:live'),
  fixture: (id: number) => cacheTag(`fixture:${id}`),
  prediction: (id: number) => cacheTag(`prediction:${id}`),
};

export const LIFE = {
  live: cacheLife('short'),     // 15–60 s (ajuster)
  metadata: cacheLife('medium') // ex. 10–15 min
};
```

> Les valeurs précises (secondes) sont définies dans ce fichier, **pas** en dur dans les modules. (Voir API refs `cacheLife`, `cacheTag`.) ([Next.js][8])

### 4.2 Query serveur typique (RSC)

`modules/fixtures/server/queries.ts`

```ts
import 'server-only';
import { TAGS, LIFE } from '@/core/cache/profiles';
import { env } from '@/core/config/env';

export async function getTodayFixtures() {
  'use cache';                  // directive locale
  LIFE.live;                    // profil (pas obligatoire mais explicite)
  TAGS.fixturesLive();          // attache un tag

  const res = await fetch(`${env.API_URL}/fixtures/today`, {
    next: { tags: ['fixtures:live'] }
  });
  if (!res.ok) throw new Error('Failed to fetch fixtures');
  return res.json();
}
```

> La directive **`use cache`** + **tags** permet une invalidation sélective via `revalidateTag()`. ([Next.js][9])

### 4.3 Revalidation on-demand

`src/app/api/revalidate/route.ts`

```ts
import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(req: NextRequest) {
  const { tag } = await req.json();
  // TODO: Auth + signature
  await revalidateTag(tag);
  return NextResponse.json({ ok: true });
}
```

> **Note** : `revalidateTag()` n’est **pas** disponible dans `proxy.ts` (uniquement Server Functions/Route Handlers). ([Next.js][10])

### 4.4 Quand éviter le cache

* Requêtes **user-scoped** sensibles à cookies/headers → `use cache: private` ou `no-store`. ([Next.js][9])
* Proxies externes → segment/handler **dynamique** (ex. `revalidate = 0`) si nécessaire. ([Next.js][11])

---

## 5) Auth & sécurité

### 5.1 `proxy.ts` (Edge) — rôle

* Redirections (login/onboarding), **headers de contexte** (`x-tenant`, `x-locale`), A/B testing léger, blocage de routes publiques/privées de base.
* **Éviter** : fetch lents, appels DB, logique complexe d’auth (faites-la dans Server Functions/Route Handlers). ([Next.js][1])

### 5.2 Guards réutilisables (Node)

`core/auth/guards.ts` : `getSession()`, `requireRole()`, `hasCompletedOnboarding()`.
Adapter Supabase en `infra/services/supabase/*` (ports → adapters).

### 5.3 Sécurité technique

* `server-only` partout côté serveur.
* Cookies httpOnly pour tokens.
* Zod pour toutes entrées/sorties HTTP.
* Headers sécurité (CSP/Referrer/Permissions/HSTS).
* Rate-limiting sur `app/api/*`.

---

## 6) State management (priorités)

1. **Server state** → RSC + `use cache`
2. **URL state** → `searchParams`
3. **Local client** → `useState`/`useReducer`
4. **Global client** → Zustand (préférences UI)
5. **Remote client** → React Query **uniquement** pour polling temps réel / optimistic UI

---

## 7) Workflow dev — ajouter une feature

```bash
# 1) Squelette
mkdir -p src/modules/<feature>/{domain,server,ui,cache,tests}

# 2) Schémas & types (domain)
# 3) Queries/actions (server) avec 'use cache' + tags + profils LIFE
# 4) Composants UI (RSC par défaut, .client.tsx si nécessaire)
# 5) Route handler (optionnel) minces dans app/api/
# 6) Tests unit/contract + règles ESLint boundaries
```

---

## 8) Build & perf

* `next.config.ts` :

  * `cacheComponents: true` (piloter le rendu via directives/tags). ([Next.js][2])
  * `reactCompiler: true` (optim du rendu). ([Next.js][5])
  * `experimental.turbopackFileSystemCacheForDev: true` (d'abord en dev ; beta). ([Next.js][6])
  * ⚠️ **Note** : `turbopackFileSystemCacheForBuild` est **désactivé** car il nécessite la version canary de Next.js. Next.js 16.0.1 stable ne le supporte pas encore.
* Turbopack réglages complémentaires via `turbopack` (migration depuis `experimental.turbo`). ([Next.js][12])

---

## 9) Migration legacy (facultatif)

* `features/*` → `modules/*` (déplacer `components` → `ui`, hooks locaux → `ui` ou `shared/hooks` s’ils sont transverses).
* `server/services/*` → `modules/*/server` (+ `core/cache/profiles.ts`).
* Remplacer tout TTL **en clair** par `LIFE.*` et tags par `TAGS.*`.

---

## 10) Références

* **Proxy file convention** (remplace middleware) : Next.js docs. ([Next.js][1])
* **Cache Components / directives / tags / life / revalidateTag** : API & guides Next.js. ([Next.js][2])
* **PPR (pipeline)** : Getting started. ([Next.js][4])
* **React Compiler** : config Next. ([Next.js][5])
* **Turbopack FS cache** (beta) : docs + blog Next 16. ([Next.js][6])
* **Upgrading v16** (codemod, migration middleware→proxy) : guide officiel. ([Next.js][7])

---

### Checklist PR

* [ ] Types OK (`tsc --noEmit`)
* [ ] Build OK (`pnpm build`)
* [ ] Nouvelles queries → `use cache` + `TAGS` + `LIFE`
* [ ] Handlers/API minces, validation Zod
* [ ] Aucune import cross-module interdit (ESLint boundaries)
* [ ] Tests unit/contract ajoutés
* [ ] Docs mises à jour (ce fichier)

**Dernière mise à jour** : 2025-11-08
**Version architecture** : 3.0 (Next 16 + modules)

[1]: https://nextjs.org/docs/app/api-reference/file-conventions/proxy?utm_source=chatgpt.com "File-system conventions: proxy.js"
[2]: https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents?utm_source=chatgpt.com "next.config.js: cacheComponents"
[3]: https://nextjs.org/docs/app/guides/caching?utm_source=chatgpt.com "Guides: Caching"
[4]: https://nextjs.org/docs/app/getting-started/cache-components?utm_source=chatgpt.com "Getting Started: Cache Components"
[5]: https://nextjs.org/docs/app/api-reference/config/next-config-js/reactCompiler?utm_source=chatgpt.com "next.config.js: reactCompiler"
[6]: https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopackFileSystemCache?utm_source=chatgpt.com "next.config.js: turbopackFileSystemCache"
[7]: https://nextjs.org/docs/app/guides/upgrading/version-16?utm_source=chatgpt.com "Upgrading: Version 16"
[8]: https://nextjs.org/docs/app/api-reference/functions/cacheLife?utm_source=chatgpt.com "Functions: cacheLife"
[9]: https://nextjs.org/docs/app/api-reference/directives/use-cache?utm_source=chatgpt.com "Directives: use cache"
[10]: https://nextjs.org/docs/app/api-reference/functions/revalidateTag?utm_source=chatgpt.com "Functions: revalidateTag"
[11]: https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config?utm_source=chatgpt.com "File-system conventions: Route Segment Config"
[12]: https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack?utm_source=chatgpt.com "turbopack - next.config.js"
