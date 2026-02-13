"use client"

import { cn } from "@/shared/utils"
import { useState, useEffect } from "react"
import type { MatchDetail } from "@/core/entities/match-detail/match-detail.entity"
import type { MatchDetailVM } from "@/application/view-models/match-detail/match-detail.vm"
import {
    getMatch1x2,
    getMatchConfidence,
    getMatchFormIndex,
    getMatchPrediction,
} from "@/application/view-models/match-detail/match-detail.selectors"
import { TrendingUp, Activity, Target, Shield, Sparkles } from "lucide-react"

interface OverviewTabProps {
    match: MatchDetail
    vm?: MatchDetailVM
}

export function OverviewTab({ match, vm }: OverviewTabProps) {
    const [accuracy, setAccuracy] = useState<{ accuracy: number } | null>(null);
    const probabilities = match.probabilities
    const mainPrediction = getMatchPrediction(match)
    const analytics = mainPrediction?.analytics
    const reasoning = vm?.overview.reasoning ?? (mainPrediction?.reasoning ?? "")
    const headline = vm?.overview.headline ?? (reasoning.split(".")[0] || "Analyse en cours...")
    const probs = vm?.overview.probs ?? getMatch1x2(match, mainPrediction ?? undefined)
    const formIndex = vm?.analysis.formIndex ?? getMatchFormIndex(match, mainPrediction ?? undefined)
    const confidence = vm?.overview.confidence ?? getMatchConfidence(match, mainPrediction ?? undefined)

    useEffect(() => {
        const fetchAccuracy = async () => {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
                // Fetch global accuracy for now, potentially filter by league later
                const res = await fetch(`${baseUrl}/api/predictions/accuracy`);
                if (res.ok) {
                    const data = await res.json();
                    setAccuracy(data);
                }
            } catch (e) {
                console.error("Failed to fetch accuracy", e);
            }
        };
        fetchAccuracy();
    }, []);

    // Determine main confidence color
    const confidenceColor = confidence === "high"
        ? "text-green-500"
        : confidence === "medium"
            ? "text-yellow-500"
            : "text-red-500"

    const confidenceBg = confidence === "high"
        ? "bg-green-500/10 border-green-500/20"
        : confidence === "medium"
            ? "bg-yellow-500/10 border-yellow-500/20"
            : "bg-red-500/10 border-red-500/20"

    const topOpportunities = (vm?.analysis.opportunities ?? analytics?.opportunities ?? [])
        .slice()
        .sort((a, b) => b.prob - a.prob)
        .slice(0, 3)


    return (
        <div className="space-y-6 p-4 max-w-4xl mx-auto animation-fade-in">

            {/* 1. Hero: Main Prediction Insight */}
            {(mainPrediction || probabilities) && (
                <div className={cn("relative overflow-hidden rounded-2xl border p-6", confidenceBg)}>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">

                        {/* Left: Prediction Statement */}
                        <div className="flex-1 space-y-4 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-2">
                                <span className={cn("px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border", confidenceBg, confidenceColor)}>
                                    Confiance {confidence === "high" ? "Élevée" : confidence === "medium" ? "Moyenne" : "Faible"}
                                </span>
                                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                                    Moteur IA v2.1
                                </span>
                                {accuracy && (
                                    <span className={cn(
                                        "text-xs font-bold px-2 py-0.5 rounded-full border ml-2",
                                        accuracy.accuracy >= 70 ? "bg-green-100 text-green-700 border-green-200" : "bg-gray-100 text-gray-600 border-gray-200"
                                    )}>
                                        {accuracy.accuracy}% Précision
                                    </span>
                                )}
                            </div>

                            <div>
                                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
                                    {headline}
                                </h2>
                                <p className="mt-2 text-muted-foreground text-sm md:text-base max-w-xl">
                                    {reasoning || (probabilities ? `Basé sur le modèle ${probabilities.model_version}.` : "Analyse en cours...")}
                                </p>
                            </div>

                            {/* Probabilities Bar */}
                            <div className="w-full bg-background/50 h-3 rounded-full overflow-hidden flex shadow-inner">
                                <div
                                    className="bg-[var(--navy)] h-full transition-all duration-1000"
                                    style={{ width: `${(probs?.home ?? 0) * 100}%` }}
                                />
                                <div
                                    className="bg-gray-300 h-full transition-all duration-1000"
                                    style={{ width: `${(probs?.draw ?? 0) * 100}%` }}
                                />
                                <div
                                    className="bg-[var(--cyan)] h-full transition-all duration-1000"
                                    style={{ width: `${(probs?.away ?? 0) * 100}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-xs font-bold text-muted-foreground px-1">
                                <span>{match.homeTeam.name} {((probs?.home ?? 0) * 100).toFixed(0)}%</span>
                                <span>Nul {((probs?.draw ?? 0) * 100).toFixed(0)}%</span>
                                <span>{match.awayTeam.name} {((probs?.away ?? 0) * 100).toFixed(0)}%</span>
                            </div>
                        </div>

                        {/* Right: Key Stats Circle or Metric */}
                        {(formIndex?.home !== undefined && formIndex?.away !== undefined) && (
                            <div className="flex flex-col items-center gap-2 p-4 bg-background/60 rounded-xl backdrop-blur-sm border shadow-sm">
                                <Activity className="w-6 h-6 text-primary" />
                                <div className="text-2xl font-bold">
                                    {Math.abs(formIndex!.home - formIndex!.away).toFixed(2)}
                                </div>
                                <div className="text-[10px] uppercase font-bold text-muted-foreground">Delta Forme</div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* 2. Key Insights / Opportunities */}
            {analytics?.opportunities && analytics.opportunities.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analytics.opportunities.slice(0, 4).map((opp, i) => (
                        <div key={i} className="flex items-start gap-3 p-4 bg-card border rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <div className={cn(
                                "p-2 rounded-lg",
                                opp.type === "positive" ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                            )}>
                                {opp.type === "positive" ? <TrendingUp size={18} /> : <Target size={18} />}
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm">{opp.label}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
                                        <div className="h-full bg-primary" style={{ width: `${opp.prob * 100}%` }} />
                                    </div>
                                    <span className="text-xs font-bold text-muted-foreground">{(opp.prob * 100).toFixed(0)}%</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {topOpportunities.length > 0 && (
                <div className="rounded-2xl border bg-card p-4 md:p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-4 h-4 text-[var(--navy)]" />
                        <h3 className="text-sm font-bold">Top 3 propositions</h3>
                    </div>
                    <div className="space-y-2">
                        {topOpportunities.map((opportunity, index) => (
                            <div
                                key={`${opportunity.label}-${index}`}
                                className="flex items-center justify-between rounded-xl border bg-muted/30 px-3 py-2"
                            >
                                <div className="flex items-center gap-2 min-w-0">
                                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--navy)] text-white text-[10px] font-bold">
                                        {index + 1}
                                    </span>
                                    <span className="text-sm font-medium truncate">{opportunity.label}</span>
                                </div>
                                <span className="text-sm font-bold text-[var(--navy)] tabular-nums">
                                    {(opportunity.prob * 100).toFixed(1)}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 3. Quick Stats Comparison */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                    label="Ratings ELO"
                    home={analytics?.ratings?.home}
                    away={analytics?.ratings?.away}
                    icon={<Shield size={16} />}
                />
                <StatCard
                    label="xG (Moyen)"
                    home={analytics?.ratings ? 1.45 : 0} // Placeholder until xG is in analytics root properly or fetched
                    away={analytics?.ratings ? 1.20 : 0}
                    icon={<Target size={16} />}
                    isFloat
                />
                <StatCard
                    label="Fatigue (%)"
                    home={((analytics?.fatigue?.fatigueFactors?.home || 0) * 100)}
                    away={((analytics?.fatigue?.fatigueFactors?.away || 0) * 100)}
                    icon={<Activity size={16} />}
                    inverse // Higher fatigue is worse
                />
                <StatCard
                    label="Défense (%)"
                    home={((analytics?.defenseFactor?.home || 0) * 100)}
                    away={((analytics?.defenseFactor?.away || 0) * 100)}
                    icon={<Shield size={16} />}
                />
            </div>

        </div>
    )
}

interface StatCardProps {
    label: string
    home?: number
    away?: number
    icon: React.ReactNode
    isFloat?: boolean
    inverse?: boolean
}

function StatCard({ label, home, away, icon, isFloat, inverse }: StatCardProps) {
    if (home === undefined || away === undefined) return null

    const homeVal = Number(home)
    const awayVal = Number(away)

    // High value is good normally, unless inverse is true (e.g. fatigue)
    const homeIsBetter = inverse ? homeVal < awayVal : homeVal > awayVal

    return (
        <div className="bg-card border rounded-xl p-4 flex flex-col items-center text-center shadow-sm">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
                {icon}
                <span className="text-xs font-bold uppercase">{label}</span>
            </div>
            <div className="flex items-end gap-3 w-full justify-center">
                <div className="flex flex-col items-center">
                    <span className={cn("text-lg font-bold tabular-nums", homeIsBetter ? "text-primary" : "text-muted-foreground")}>
                        {isFloat ? homeVal.toFixed(2) : homeVal.toFixed(0)}
                    </span>
                    {homeIsBetter && <div className="h-1 w-8 bg-primary rounded-full mt-1" />}
                </div>
                <span className="text-muted-foreground/30 text-lg mx-1">vs</span>
                <div className="flex flex-col items-center">
                    <span className={cn("text-lg font-bold tabular-nums", !homeIsBetter ? "text-primary" : "text-muted-foreground")}>
                        {isFloat ? awayVal.toFixed(2) : awayVal.toFixed(0)}
                    </span>
                    {!homeIsBetter && <div className="h-1 w-8 bg-primary rounded-full mt-1" />}
                </div>
            </div>
        </div>
    )
}
