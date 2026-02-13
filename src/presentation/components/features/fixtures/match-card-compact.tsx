"use client"

import * as React from "react"
import Image from "next/image"
import { useSwipeable } from "react-swipeable"
import { Star } from "lucide-react"
import { format, fr } from "@/shared/utils/date"
import { TEAM_LOGO_BLUR } from "@/shared/utils/image-loader"
import { cn } from "@/shared/utils"
import type { MatchCardVM } from "@/application/view-models/fixtures/match-card.vm"
import { formatBestMarketPercent } from "@/application/view-models/fixtures/match-card.vm"
import { PredictionValidationBadge } from "./prediction-validation-badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/presentation/components/ui/dialog"

type PropositionInfo = {
  title: string
  summary: string
  details?: string[]
}

function buildPropositionInfo(label: string, match: MatchCardVM): PropositionInfo {
  const lower = label.toLowerCase()
  const probLine = match.bestMarket?.prob
    ? `Probabilité estimée: ${formatBestMarketPercent(match.bestMarket.prob)}.`
    : undefined

  const ehcMatch = label.match(/\((\d+)\s*:\s*(\d+)\)\s*(v1|v2|x)/i)
  if (ehcMatch) {
    const homeH = Number(ehcMatch[1])
    const awayH = Number(ehcMatch[2])
    const outcome = ehcMatch[3].toUpperCase()
    return {
      title: `Handicap européen ${label}`,
      summary: `On applique un handicap au score avant de lire le résultat (${outcome}).`,
      details: [
        `Score ajusté = (domicile + ${homeH}) : (extérieur + ${awayH}).`,
        `Issue visée: ${outcome === "V1" ? "victoire domicile" : outcome === "V2" ? "victoire extérieur" : "match nul"}.`,
        probLine,
      ].filter(Boolean) as string[],
    }
  }

  if (lower.startsWith("plus de ") || lower.startsWith("moins de ")) {
    return {
      title: label,
      summary: lower.startsWith("plus de")
        ? "Le total de buts doit être strictement supérieur à la ligne."
        : "Le total de buts doit être strictement inférieur à la ligne.",
      details: [probLine].filter(Boolean) as string[],
    }
  }

  if (lower.includes("les deux marquent")) {
    return {
      title: label,
      summary: lower.includes("oui")
        ? "Les deux équipes doivent marquer au moins un but."
        : "Au moins une équipe ne doit pas marquer.",
      details: [probLine].filter(Boolean) as string[],
    }
  }

  if (lower.startsWith("double chance")) {
    const code = lower.replace("double chance", "").replace(/\s/g, "").toUpperCase()
    const meaning =
      code === "1X"
        ? "Victoire domicile ou match nul."
        : code === "X2"
          ? "Match nul ou victoire extérieur."
          : code === "12"
            ? "Victoire domicile ou extérieur (pas de nul)."
            : "Double chance."
    return {
      title: label,
      summary: meaning,
      details: [probLine].filter(Boolean) as string[],
    }
  }

  if (lower.startsWith("dnb ")) {
    return {
      title: label,
      summary: "Pari remboursé en cas de match nul.",
      details: [probLine].filter(Boolean) as string[],
    }
  }

  if (lower.startsWith("victoire ")) {
    return {
      title: label,
      summary: "L’équipe indiquée doit gagner le match (temps réglementaire).",
      details: [probLine].filter(Boolean) as string[],
    }
  }

  if (lower === "match nul") {
    return {
      title: label,
      summary: "Le match doit se terminer par un score nul.",
      details: [probLine].filter(Boolean) as string[],
    }
  }

  if (lower.includes("handicap asiatique")) {
    return {
      title: label,
      summary: "Le handicap asiatique ajuste le score avec possibilité de remboursement selon la ligne.",
      details: [probLine].filter(Boolean) as string[],
    }
  }

  return {
    title: label,
    summary: "Proposition issue du modèle, basée sur les données du match.",
    details: [probLine].filter(Boolean) as string[],
  }
}

export interface MatchCardCompactProps
  extends React.HTMLAttributes<HTMLDivElement> {
  match: MatchCardVM
  onFavoriteToggle?: () => void
}

function ProbabilityBar({
  homeProb,
  drawProb,
  awayProb,
  validationResult,
}: {
  homeProb: number
  drawProb: number
  awayProb: number
  validationResult?: {
    matchResultOutcome: "correct" | "incorrect" | "void" | "half-win" | "half-loss" | null
  } | null
}) {
  const maxProb = Math.max(homeProb, drawProb, awayProb)

  const segments = [
    { label: "V1", value: homeProb },
    { label: "X", value: drawProb },
    { label: "V2", value: awayProb },
  ]

  return (
    <div className="flex w-full gap-1">
      {segments.map((seg) => {
        const isMax = seg.value === maxProb
        const showBadge = isMax && validationResult?.matchResultOutcome
        return (
          <div
            key={seg.label}
            className={cn(
              "flex-1 flex items-center justify-center py-1.5 rounded-md transition-all duration-300",
              isMax
                ? (validationResult?.matchResultOutcome === "correct" || validationResult?.matchResultOutcome === "half-win"
                  ? "bg-success text-white font-bold"
                  : validationResult?.matchResultOutcome === "incorrect" || validationResult?.matchResultOutcome === "half-loss"
                    ? "bg-error text-white font-bold"
                    : "bg-lime text-navy-950 font-bold")
                : "bg-gray-100 text-gray-500",
              showBadge && "relative"
            )}
          >
            <span className="text-[10px] leading-none">
              {seg.label} <span className="tabular-nums">{seg.value.toFixed(1)}%</span>
            </span>
            {showBadge && (
              <PredictionValidationBadge
                outcome={validationResult.matchResultOutcome}
                variant="overlay"
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

const MatchCardCompact = React.forwardRef<HTMLDivElement, MatchCardCompactProps>(
  ({ match, onClick, onFavoriteToggle, className, ...props }, ref) => {
    const [isRippling, setIsRippling] = React.useState(false)
    const [ripplePosition, setRipplePosition] = React.useState({ x: 0, y: 0 })
    const [isPropositionOpen, setIsPropositionOpen] = React.useState(false)
    const internalRef = React.useRef<HTMLDivElement>(null)

    const validationResult = match.validation ?? null
    const propositionInfo = match.bestMarket ? buildPropositionInfo(match.bestMarket.label, match) : null

    const { ref: swipeRef, ...swipeHandlers } = useSwipeable({
      onSwipedLeft: (eventData) => {
        if (Math.abs(eventData.deltaX) > 50 && onFavoriteToggle) {
          onFavoriteToggle()
        }
      },
      trackTouch: true,
      delta: 50,
      preventScrollOnSwipe: false,
      trackMouse: false,
    })

    React.useEffect(() => {
      if (typeof swipeRef === "function") {
        swipeRef(internalRef.current)
      }
    }, [swipeRef])

    React.useImperativeHandle(ref, () => internalRef.current!)

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      setRipplePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
      setIsRippling(true)
      setTimeout(() => setIsRippling(false), 600)
      onClick?.(e)
    }

    return (
      <>
        <div
          ref={internalRef}
          {...swipeHandlers}
          onClick={handleClick}
          className={cn(
            "relative rounded-xl border overflow-hidden cursor-pointer",
            "bg-surface-elevated",
            "shadow-sm hover:shadow-md",
            "transition-all duration-200 ease-out",
            "hover:-translate-y-0.5",
            "active:translate-y-0 active:scale-[0.98] active:shadow-sm",
            "touch-manipulation select-none",
            match.isFavorite
              ? "border-lime/40 ring-1 ring-lime/20"
              : "border-gray-200",
            className
          )}
          role="button"
          tabIndex={0}
          aria-label={`Match ${match.home.name} vs ${match.away.name}`}
          {...props}
        >
          {isRippling && (
            <span
              className="absolute rounded-full bg-navy/10 pointer-events-none animate-ripple"
              style={{
                left: ripplePosition.x,
                top: ripplePosition.y,
                width: 0,
                height: 0,
              }}
            />
          )}

          {match.isFavorite && (
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-lime" aria-hidden="true" />
          )}

          <div className="flex items-center justify-between gap-2 px-4 pt-3 pb-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-3.5 h-3.5 shrink-0 relative">
              <Image
                src={match.league.logo}
                alt=""
                fill
                sizes="14px"
                className="object-contain"
                loading="lazy"
                quality={75}
              />
            </div>
            <span className="text-[11px] text-text-tertiary truncate font-medium">
              {match.league.name}
            </span>
          </div>

          {match.status === "scheduled" && (
            <span className="text-[11px] font-semibold text-navy tabular-nums shrink-0">
              {format(match.kickoffTime, "HH:mm", { locale: fr })}
            </span>
          )}

          {match.status === "live" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-live text-white text-[10px] font-bold animate-live-glow shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              EN DIRECT {match.elapsed ? `? ${match.elapsed}'` : ""}
            </span>
          )}

          {match.status === "finished" && (
            <span className="text-[10px] font-medium text-text-tertiary bg-gray-100 px-2 py-0.5 rounded-md shrink-0">
              Termin?
            </span>
          )}
        </div>

        <div className="flex items-center px-4 py-2 gap-3">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="w-9 h-9 shrink-0 relative rounded-lg bg-gray-50 p-1">
              <Image
                src={match.home.logo}
                alt={match.home.name}
                fill
                sizes="36px"
                className="object-contain p-0.5"
                loading="lazy"
                quality={75}
                placeholder="blur"
                blurDataURL={TEAM_LOGO_BLUR}
              />
            </div>
            <div className="min-w-0">
              <span className="text-sm font-semibold text-text-primary truncate block">
                {match.home.name}
              </span>
              {match.home.xgLabel && (
                <span className="text-[10px] text-text-tertiary tabular-nums">
                  {match.home.xgLabel}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center shrink-0 min-w-[48px]">
            {(match.status === "live" || match.status === "finished") && match.score ? (
              <span className="text-xl font-bold text-navy tabular-nums tracking-tight">
                {match.score.home ?? 0} - {match.score.away ?? 0}
              </span>
            ) : (
              <span className="text-xs text-text-tertiary font-medium">vs</span>
            )}
            {match.score?.halftime && (match.status === "live" || match.status === "finished") && (
              <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-gray-100 text-[10px] font-semibold text-gray-600 px-1.5 py-0.5 tabular-nums">
                MT {match.score.halftime.home} - {match.score.halftime.away}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5 flex-1 min-w-0 flex-row-reverse">
            <div className="w-9 h-9 shrink-0 relative rounded-lg bg-gray-50 p-1">
              <Image
                src={match.away.logo}
                alt={match.away.name}
                fill
                sizes="36px"
                className="object-contain p-0.5"
                loading="lazy"
                quality={75}
                placeholder="blur"
                blurDataURL={TEAM_LOGO_BLUR}
              />
            </div>
            <div className="min-w-0 text-right">
              <span className="text-sm font-semibold text-text-primary truncate block">
                {match.away.name}
              </span>
              {match.away.xgLabel && (
                <span className="text-[10px] text-text-tertiary tabular-nums">
                  {match.away.xgLabel}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="px-4 pb-2 flex justify-center">
          {match.probabilities ? (
            <ProbabilityBar
              homeProb={match.probabilities.home}
              drawProb={match.probabilities.draw}
              awayProb={match.probabilities.away}
              validationResult={validationResult}
            />
          ) : (
            <div className="flex w-full gap-1">
              {["V1", "X", "V2"].map((label) => (
                <div key={label} className="flex-1 flex items-center justify-center py-1.5 rounded-md bg-gray-100 text-gray-400">
                  <span className="text-[10px] leading-none">{label} --</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {match.bestMarket && (
          <div className="px-4 pb-3 flex justify-center items-center gap-1.5">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                setIsPropositionOpen(true)
              }}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md bg-lime-100 border border-lime/20 px-2.5 py-1 text-[11px] text-navy",
                "hover:bg-lime-200/70 transition-colors"
              )}
              aria-label={`Voir explication de la proposition ${match.bestMarket.label}`}
            >
              <span className="font-medium text-navy/60">Proposition</span>
              <span className="font-bold">{match.bestMarket.label}</span>
              <span className="tabular-nums font-semibold text-lime-600">
                {formatBestMarketPercent(match.bestMarket.prob)}
              </span>
            </button>
            <PredictionValidationBadge
              outcome={match.validation?.bestMarketOutcome ?? null}
              variant="inline"
            />
          </div>
        )}

        {onFavoriteToggle && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onFavoriteToggle()
            }}
            className={cn(
              "absolute top-2 right-2 p-2 rounded-full transition-all",
              "hover:bg-gray-100 active:scale-90",
              "min-w-[40px] min-h-[40px] flex items-center justify-center",
              "touch-manipulation"
            )}
            aria-label={
              match.isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"
            }
            type="button"
          >
            <Star
              className={cn(
                "w-[18px] h-[18px] transition-all",
                match.isFavorite
                  ? "fill-lime text-lime"
                  : "text-gray-300 hover:text-gray-400"
              )}
            />
          </button>
        )}
        </div>

        {propositionInfo && (
          <Dialog open={isPropositionOpen} onOpenChange={setIsPropositionOpen}>
            <DialogContent className="max-w-[520px]">
              <DialogHeader>
                <DialogTitle className="text-base font-bold text-navy-900">
                  {propositionInfo.title}
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-500">
                  {propositionInfo.summary}
                </DialogDescription>
              </DialogHeader>
              {propositionInfo.details && propositionInfo.details.length > 0 && (
                <div className="space-y-2 text-sm text-gray-600">
                  {propositionInfo.details.map((item, index) => (
                    <div key={`${item}-${index}`} className="flex gap-2">
                      <span className="text-lime-600 font-bold">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </DialogContent>
          </Dialog>
        )}
      </>
    )
  }
)

MatchCardCompact.displayName = "MatchCardCompact"

export { MatchCardCompact }
