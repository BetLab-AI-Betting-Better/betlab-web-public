export function formatMarketLabel(
  raw: string | undefined,
  context: { homeName: string; awayName: string }
): string {
  if (!raw) return ""
  const key = raw.trim()
  const lower = key.toLowerCase()
  const normalized = lower.replace(/[.\s,]+/g, "_")
  const homeName = context.homeName || "Equipe domicile"
  const awayName = context.awayName || "Equipe exterieur"

  const formatLine = (value: string) => {
    const normalizedLine = value.replace(/_/g, ".").replace(/\s/g, "")
    if (normalizedLine.includes(",")) return normalizedLine
    return normalizedLine.includes(".")
      ? normalizedLine.replace(".", ",")
      : normalizedLine
  }

  const extractLine = (value: string) => {
    const matches = value.match(/(\d+[._]?\d*)/g)
    if (!matches || matches.length === 0) return ""
    const last = matches[matches.length - 1] ?? ""
    return formatLine(last.replace(/_/g, "."))
  }

  const formatHandicapLine = (value: string) => {
    let next = value.replace(/_/g, ".").replace(/\s/g, "")
    let sign = ""

    if (next.startsWith("+") || next.startsWith("-")) {
      sign = next[0]
      next = next.slice(1)
    } else if (next.startsWith("p")) {
      sign = "+"
      next = next.slice(1)
    } else if (next.startsWith("m")) {
      sign = "-"
      next = next.slice(1)
    }

    if (/^\d+$/.test(next)) {
      const digits = next
      const num = digits.length === 1 ? Number(digits) : Number(digits) / 10
      next = num.toString()
    }

    next = next.replace(".", ",")
    return `${sign}${next}`
  }

  if (normalized.includes("ht") || normalized.includes("1h")) {
    const line = extractLine(lower)
    if (normalized.includes("under")) {
      return `1ere mi-temps : Moins de ${line} buts`
    }
    if (normalized.includes("over")) {
      return `1ere mi-temps : Plus de ${line} buts`
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
    return `1ere mi-temps : Plus de ${line} buts`
  }
  if (normalized.startsWith("ht_under_") || normalized.startsWith("1h_under_")) {
    const line = extractLine(normalized.replace(/^(ht|1h)_under_/, ""))
    return `1ere mi-temps : Moins de ${line} buts`
  }
  if (normalized.startsWith("over_ht_")) {
    const line = extractLine(normalized.replace(/^over_ht_/, ""))
    return `1ere mi-temps : Plus de ${line} buts`
  }
  if (normalized.startsWith("under_ht_")) {
    const line = extractLine(normalized.replace(/^under_ht_/, ""))
    return `1ere mi-temps : Moins de ${line} buts`
  }
  if (normalized.startsWith("total_ht_over_")) {
    const line = extractLine(normalized.replace(/^total_ht_over_/, ""))
    return `1ere mi-temps : Plus de ${line} buts`
  }
  if (normalized.startsWith("total_ht_under_")) {
    const line = extractLine(normalized.replace(/^total_ht_under_/, ""))
    return `1ere mi-temps : Moins de ${line} buts`
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

  const asianHandicapMatch = normalized.match(
    /^(ah|asian_handicap|handicap_asian)_(home|away)_(.+)$/
  )
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

  // Corners
  if (normalized.startsWith("corners_over_")) {
    const line = extractLine(normalized.replace(/^corners_over_/, ""))
    return `Plus de ${line} corners`
  }
  if (normalized.startsWith("corners_under_")) {
    const line = extractLine(normalized.replace(/^corners_under_/, ""))
    return `Moins de ${line} corners`
  }
  if (normalized.startsWith("corners_home_over_")) {
    const line = extractLine(normalized.replace(/^corners_home_over_/, ""))
    return `Corners ${homeName} : Plus de ${line}`
  }
  if (normalized.startsWith("corners_home_under_")) {
    const line = extractLine(normalized.replace(/^corners_home_under_/, ""))
    return `Corners ${homeName} : Moins de ${line}`
  }
  if (normalized.startsWith("corners_away_over_")) {
    const line = extractLine(normalized.replace(/^corners_away_over_/, ""))
    return `Corners ${awayName} : Plus de ${line}`
  }
  if (normalized.startsWith("corners_away_under_")) {
    const line = extractLine(normalized.replace(/^corners_away_under_/, ""))
    return `Corners ${awayName} : Moins de ${line}`
  }

  // Cards
  if (normalized.startsWith("cards_over_")) {
    const line = extractLine(normalized.replace(/^cards_over_/, ""))
    return `Plus de ${line} cartons`
  }
  if (normalized.startsWith("cards_home_over_")) {
    const line = extractLine(normalized.replace(/^cards_home_over_/, ""))
    return `Cartons ${homeName} : Plus de ${line}`
  }
  if (normalized.startsWith("cards_away_over_")) {
    const line = extractLine(normalized.replace(/^cards_away_over_/, ""))
    return `Cartons ${awayName} : Plus de ${line}`
  }

  // Shots on Target (SOT)
  if (normalized.startsWith("sot_over_")) {
    const line = extractLine(normalized.replace(/^sot_over_/, ""))
    return `Plus de ${line} tirs cadrés`
  }
  if (normalized.startsWith("sot_home_over_")) {
    const line = extractLine(normalized.replace(/^sot_home_over_/, ""))
    return `Tirs cadrés ${homeName} : Plus de ${line}`
  }
  if (normalized.startsWith("sot_away_over_")) {
    const line = extractLine(normalized.replace(/^sot_away_over_/, ""))
    return `Tirs cadrés ${awayName} : Plus de ${line}`
  }

  // European Handicap (ehc_)
  const ehcMatch = normalized.match(/^ehc_(-?\d+)_([1x2])$/)
  if (ehcMatch) {
    const hc = formatHandicapLine(ehcMatch[1])
    const side = ehcMatch[2] === "1" ? homeName : ehcMatch[2] === "x" ? "Nul" : awayName
    return `Handicap (${hc}) : ${side}`
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
    const side = lower.includes("home")
      ? homeName
      : lower.includes("away")
        ? awayName
        : "Equipe"
    const direction = lower.includes("under")
      ? "moins de"
      : lower.includes("over")
        ? "plus de"
        : "total"
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
