"use client"

import * as React from "react"
import Image from "next/image"
import { useSwipeable } from "react-swipeable"
import { Star } from "lucide-react"
import { format, fr } from "@/shared/utils/date"
import { TEAM_LOGO_BLUR } from "@/shared/utils/image-loader"
import type { PredictionData } from "@/core/entities/predictions/prediction.entity"
import { cn } from "@/shared/utils"
import { validatePrediction, validateBestMarket, type ValidationResult } from "./utils/prediction-validation"
import { PredictionValidationBadge } from "./prediction-validation-badge"

export interface Match {
  id: string
  homeTeam: {
    name: string
    logo: string
  }
  awayTeam: {
    name: string
    logo: string
  }
  league: {
    name: string
    logo: string
  }
  kickoffTime: Date
  status: "scheduled" | "live" | "finished"
  score?: {
    home: number
    away: number
  }
  prediction?: PredictionData
  isFavorite?: boolean
}

export interface MatchCardCompactProps
  extends React.HTMLAttributes<HTMLDivElement> {
  match: Match
  onFavoriteToggle?: () => void
}

function formatPercent(value?: number) {
  if (value === undefined || value === null || Number.isNaN(value)) return "--"
  return `${(value * 100).toFixed(1)}%`
}

type BestMarket = { label: string; rawLabel: string; prob: number }

function formatLine(raw: string) {
  const normalized = raw.replace(/_/g, ".").replace(/\s/g, "")
  if (normalized.includes(",")) {
    return normalized
  }
  return normalized.includes(".") ? normalized.replace(".", ",") : normalized
}

function extractLine(raw: string) {
  const matches = raw.match(/(\d+[._]?\d*)/g)
  if (!matches || matches.length === 0) return ""
  const last = matches[matches.length - 1] ?? ""
  return formatLine(last.replace(/_/g, "."))
}

function formatHandicapLine(raw: string) {
  let value = raw.replace(/_/g, ".").replace(/\s/g, "")
  let sign = ""

  if (value.startsWith("+") || value.startsWith("-")) {
    sign = value[0]
    value = value.slice(1)
  } else if (value.startsWith("p")) {
    sign = "+"
    value = value.slice(1)
  } else if (value.startsWith("m")) {
    sign = "-"
    value = value.slice(1)
  }

  if (/^\d+$/.test(value)) {
    const digits = value
    const num = digits.length === 1 ? Number(digits) : Number(digits) / 10
    value = num.toString()
  }

  value = value.replace(".", ",")
  return `${sign}${value}`
}

function formatMarketLabel(raw?: string, match?: Match) {
  if (!raw) return ""
  const key = raw.trim()
  const lower = key.toLowerCase()
  const normalized = lower.replace(/[.\s,]+/g, "_")
  const homeName = match?.homeTeam?.name || "Equipe domicile"
  const awayName = match?.awayTeam?.name || "Equipe exterieur"

  if (normalized.includes("ht") || normalized.includes("1h")) {
    const line = extractLine(lower)
    if (normalized.includes("under")) {
      return `1ère mi-temps : Moins de ${line} buts`
    }
    if (normalized.includes("over")) {
      return `1ère mi-temps : Plus de ${line} buts`
    }
  }

  const teamTotalsMatch = normalized.match(
    /^team_totals_(home|away)_(over|under)_(.+)$/
  )
  if (teamTotalsMatch) {
    const side = teamTotalsMatch[1] === "home" ? homeName : awayName
    const direction = teamTotalsMatch[2] === "over" ? "plus de" : "moins de"
    const line = extractLine(teamTotalsMatch[3])
    return `${side} ${direction} ${line} buts`
  }

  if (normalized.startsWith("over_")) {
    const line = extractLine(normalized.replace(/^over_/, ""))
    return `Plus de ${line} buts`
  }
  if (normalized.startsWith("under_")) {
    const line = extractLine(normalized.replace(/^under_/, ""))
    return `Moins de ${line} buts`
  }
  if (normalized.startsWith("ht_over_") || normalized.startsWith("1h_over_")) {
    const line = extractLine(normalized.replace(/^(ht|1h)_over_/, ""))
    return `1ère mi-temps : Plus de ${line} buts`
  }
  if (normalized.startsWith("ht_under_") || normalized.startsWith("1h_under_")) {
    const line = extractLine(normalized.replace(/^(ht|1h)_under_/, ""))
    return `1ère mi-temps : Moins de ${line} buts`
  }
  if (normalized.startsWith("over_ht_")) {
    const line = extractLine(normalized.replace(/^over_ht_/, ""))
    return `1ère mi-temps : Plus de ${line} buts`
  }
  if (normalized.startsWith("under_ht_")) {
    const line = extractLine(normalized.replace(/^under_ht_/, ""))
    return `1ère mi-temps : Moins de ${line} buts`
  }
  if (normalized.startsWith("total_ht_over_")) {
    const line = extractLine(normalized.replace(/^total_ht_over_/, ""))
    return `1ère mi-temps : Plus de ${line} buts`
  }
  if (normalized.startsWith("total_ht_under_")) {
    const line = extractLine(normalized.replace(/^total_ht_under_/, ""))
    return `1ère mi-temps : Moins de ${line} buts`
  }
  if (normalized.startsWith("home_over_")) {
    const line = extractLine(normalized.replace(/^home_over_/, ""))
    return `${homeName} plus de ${line} buts`
  }
  if (normalized.startsWith("home_under_")) {
    const line = extractLine(normalized.replace(/^home_under_/, ""))
    return `${homeName} moins de ${line} buts`
  }
  if (normalized.startsWith("away_over_")) {
    const line = extractLine(normalized.replace(/^away_over_/, ""))
    return `${awayName} plus de ${line} buts`
  }
  if (normalized.startsWith("away_under_")) {
    const line = extractLine(normalized.replace(/^away_under_/, ""))
    return `${awayName} moins de ${line} buts`
  }
  const asianHandicapMatch = normalized.match(/^(ah|asian_handicap|handicap_asian)_(home|away)_(.+)$/)
  if (asianHandicapMatch) {
    const side = asianHandicapMatch[2] === "home" ? homeName : awayName
    const line = formatHandicapLine(asianHandicapMatch[3])
    return `Handicap asiatique ${side} ${line}`
  }
  if (normalized.startsWith("asian_over_")) {
    const line = extractLine(normalized.replace(/^asian_over_/, ""))
    return `Total asiatique : Plus de ${line} buts`
  }
  if (normalized.startsWith("asian_under_")) {
    const line = extractLine(normalized.replace(/^asian_under_/, ""))
    return `Total asiatique : Moins de ${line} buts`
  }
  if (normalized.startsWith("totals_asian_over_")) {
    const line = extractLine(normalized.replace(/^totals_asian_over_/, ""))
    return `Total asiatique : Plus de ${line} buts`
  }
  if (normalized.startsWith("totals_asian_under_")) {
    const line = extractLine(normalized.replace(/^totals_asian_under_/, ""))
    return `Total asiatique : Moins de ${line} buts`
  }
  if (normalized.startsWith("team_over_")) {
    const line = extractLine(normalized.replace(/^team_over_/, ""))
    return `Equipe plus de ${line} buts`
  }
  if (normalized.startsWith("team_under_")) {
    const line = extractLine(normalized.replace(/^team_under_/, ""))
    return `Equipe moins de ${line} buts`
  }
  if (normalized.startsWith("double_chance_")) {
    const dc = normalized
      .replace(/^double_chance_/, "")
      .replace(/_/g, "")
      .toUpperCase()
    return `Double chance ${dc}`
  }
  if (normalized.startsWith("dc_")) {
    const dc = normalized.replace(/^dc_/, "").replace(/_/g, "").toUpperCase()
    return `Double chance ${dc}`
  }
  if (normalized === "dnb_home") return `DNB ${homeName}`
  if (normalized === "dnb_away") return `DNB ${awayName}`
  if (normalized === "btts_yes") return "Les deux marquent - Oui"
  if (normalized === "btts_no") return "Les deux marquent - Non"
  if (normalized === "btts") return "Les deux marquent"
  if (normalized === "1x2_home") return `Victoire ${homeName}`
  if (normalized === "1x2_draw") return "Match nul"
  if (normalized === "1x2_away") return `Victoire ${awayName}`

  if (lower.includes("team total")) {
    const side =
      lower.includes("home") ? homeName : lower.includes("away") ? awayName : "Equipe"
    const direction = lower.includes("under") ? "moins de" : lower.includes("over") ? "plus de" : "total"
    return `${side} ${direction} buts`
  }
  if (lower.includes("double chance")) {
    const dc = lower.replace(/[^0-9x]/g, "").toUpperCase()
    return dc ? `Double chance ${dc}` : "Double chance"
  }
  if (lower.includes("btts")) {
    if (lower.includes("yes") || lower.includes("oui")) return "Les deux marquent - Oui"
    if (lower.includes("no") || lower.includes("non")) return "Les deux marquent - Non"
    return "Les deux marquent"
  }
  if (lower.includes("total over")) return "Plus de buts"
  if (lower.includes("total under")) return "Moins de buts"

  const labelMap: Record<string, string> = {
    "total over (2-way)": "Plus de buts",
    "total over (2way)": "Plus de buts",
    "total under (2-way)": "Moins de buts",
    "total under (2way)": "Moins de buts",
  }
  return labelMap[lower] ?? raw
}

function getBestMarket(prediction?: PredictionData, match?: Match): BestMarket | null {
  if (!prediction) return null
  const anyPred = prediction as unknown as {
    best_market?: {
      label?: string
      market?: string
      prob?: number
      probability?: number
      rule?: { label?: string }
    }
    bestMarket?: {
      label?: string
      market?: string
      prob?: number
      probability?: number
      rule?: { label?: string }
    }
  }

  const direct = anyPred.best_market ?? anyPred.bestMarket
  if (direct && (direct.prob ?? direct.probability) !== undefined) {
    const raw = direct.market ?? direct.label ?? direct.rule?.label
    const label = formatMarketLabel(raw, match)
    if (label) {
      return { label, rawLabel: raw ?? "", prob: direct.prob ?? direct.probability ?? 0 }
    }
  }

  if (prediction.type === "match_result") {
    const p = prediction
    const opps = p.analytics?.opportunities ?? []
    if (opps.length > 0) {
      const best = opps.reduce((acc, cur) => (cur.prob > acc.prob ? cur : acc))
      const label = formatMarketLabel(best.label, match) || best.label
      return { label, rawLabel: best.label, prob: best.prob }
    }
    const home = p.homeWin?.probability ?? 0
    const draw = p.draw?.probability ?? 0
    const away = p.awayWin?.probability ?? 0
    const best = Math.max(home, draw, away)
    const label = best === home ? "V1" : best === draw ? "Nul" : "V2"
    const rawLabel = best === home ? "1x2_home" : best === draw ? "1x2_draw" : "1x2_away"
    return { label, rawLabel, prob: best }
  }

  return null
}

/** Segmented probability bar — equal-width segments with validation overlay */
function ProbabilityBar({
  homeProb,
  drawProb,
  awayProb,
  validationResult,
}: {
  homeProb: number
  drawProb: number
  awayProb: number
  validationResult?: ValidationResult | null
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
    const internalRef = React.useRef<HTMLDivElement>(null)
    const prediction = match.prediction
    const validationResult = React.useMemo(() => {
      if (match.status !== "finished") return null
      return validatePrediction(match.prediction, match.score, match.status)
    }, [match.status, match.prediction, match.score])
    const leagueLogo = (match.league?.logo || "").trim() || "/globe.svg"
    const homeLogo = (match.homeTeam?.logo || "").trim() || "/icon-32.png"
    const awayLogo = (match.awayTeam?.logo || "").trim() || "/icon-32.png"

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
      if (typeof swipeRef === 'function') {
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
        aria-label={`Match ${match.homeTeam.name} vs ${match.awayTeam.name}`}
        {...props}
      >
        {/* Ripple */}
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

        {/* Favorite indicator bar */}
        {match.isFavorite && (
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-lime" aria-hidden="true" />
        )}

        {/* Header: League + Time */}
        <div className="flex items-center justify-between gap-2 px-4 pt-3 pb-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-3.5 h-3.5 shrink-0 relative">
              <Image
                src={leagueLogo}
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
              EN DIRECT
            </span>
          )}

          {match.status === "finished" && (
            <span className="text-[10px] font-medium text-text-tertiary bg-gray-100 px-2 py-0.5 rounded-md shrink-0">
              Terminé
            </span>
          )}
        </div>

        {/* Teams + Score */}
        <div className="flex items-center px-4 py-2 gap-3">
          {/* Home Team */}
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="w-9 h-9 shrink-0 relative rounded-lg bg-gray-50 p-1">
              <Image
                src={homeLogo}
                alt={match.homeTeam.name}
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
                {match.homeTeam.name}
              </span>
              {match.prediction?.type === "match_result" && (
                <span className="text-[10px] text-text-tertiary tabular-nums">
                  xG {match.prediction.xG.home.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Score center */}
          <div className="flex flex-col items-center shrink-0 min-w-[48px]">
            {(match.status === "live" || match.status === "finished") && match.score ? (
              <span className="text-xl font-bold text-navy tabular-nums tracking-tight">
                {match.score.home ?? 0} - {match.score.away ?? 0}
              </span>
            ) : (
              <span className="text-xs text-text-tertiary font-medium">vs</span>
            )}
          </div>

          {/* Away Team */}
          <div className="flex items-center gap-2.5 flex-1 min-w-0 flex-row-reverse">
            <div className="w-9 h-9 shrink-0 relative rounded-lg bg-gray-50 p-1">
              <Image
                src={awayLogo}
                alt={match.awayTeam.name}
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
                {match.awayTeam.name}
              </span>
              {match.prediction?.type === "match_result" && (
                <span className="text-[10px] text-text-tertiary tabular-nums">
                  xG {match.prediction.xG.away.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Probability Bar V1/X/V2 */}
        <div className="px-4 pb-2 flex justify-center">
          {match.prediction?.type === "match_result" ? (() => {
            const pred = match.prediction as Extract<PredictionData, { type: "match_result" }>
            return (
              <ProbabilityBar
                homeProb={pred.homeWin.probability * 100}
                drawProb={pred.draw.probability * 100}
                awayProb={pred.awayWin.probability * 100}
                validationResult={validationResult}
              />
            )
          })() : (
            <div className="flex w-full gap-1">
              {["V1", "X", "V2"].map((label) => (
                <div key={label} className="flex-1 flex items-center justify-center py-1.5 rounded-md bg-gray-100 text-gray-400">
                  <span className="text-[10px] leading-none">{label} --</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Best market chip + validation badge */}
        {(() => {
          const bestMarket = getBestMarket(prediction, match)
          if (!bestMarket) return null
          const bestMarketOutcome = match.status === "finished" && match.score
            ? validateBestMarket(bestMarket.rawLabel, match.score)
            : null
          return (
            <div className="px-4 pb-3 flex justify-center items-center gap-1.5">
              <div className="inline-flex items-center gap-1.5 rounded-md bg-lime-100 border border-lime/20 px-2.5 py-1 text-[11px] text-navy">
                <span className="font-medium text-navy/60">Prono</span>
                <span className="font-bold">{bestMarket.label}</span>
                <span className="tabular-nums font-semibold text-lime-600">{formatPercent(bestMarket.prob)}</span>
              </div>
              <PredictionValidationBadge outcome={bestMarketOutcome} variant="inline" />
            </div>
          )
        })()}

        {/* Favorite button */}
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
    )
  }
)

MatchCardCompact.displayName = "MatchCardCompact"

export { MatchCardCompact }
