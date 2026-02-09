"use client"

import { cn } from "@/shared/utils"
import type { MatchDetail } from "@/core/entities/match-detail/match-detail.entity"
import type { MatchResultPrediction, AsianHandicapPrediction, AsianTotalsPrediction, ExactGoalsPrediction } from "@/core/entities/predictions/prediction.entity"
import { TrendingUp, Heart, Shield, Clock, Zap, Users, Info } from "lucide-react"
import { OpportunitiesList } from "./smart-analysis/opportunities"
import { GoalsHeatmap } from "./smart-analysis/goals-heatmap"
import { AsianMarketsSummary } from "./smart-analysis/asian-markets"
import { ModelNarration } from "./model-narration"
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip
} from "recharts"

interface AnalysisTabProps {
  match: MatchDetail
  prediction?: MatchResultPrediction
}

export function AnalysisTab({ match, prediction }: AnalysisTabProps) {
  if (!prediction?.analytics) {
    return (
      <div className="p-4">
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Analyse indisponible</h3>
          <p className="text-muted-foreground">
            Les données d&apos;analyse avancée ne sont pas disponibles pour ce match.
          </p>
        </div>
      </div>
    )
  }

  const { analytics } = prediction

  // Prepare Radar Data
  const radarData = [
    {
      subject: 'Attaque (xG)',
      A: prediction.xG.home * 20, // Scale xG approx to 0-100 (assuming 5 goals max)
      B: prediction.xG.away * 20,
      fullMark: 100,
    },
    {
      subject: 'Forme',
      A: (analytics.formIndex?.home !== undefined ? (analytics.formIndex.home + 1) * 50 : 50), // -1..1 -> 0..100
      B: (analytics.formIndex?.away !== undefined ? (analytics.formIndex.away + 1) * 50 : 50),
      fullMark: 100,
    },
    {
      subject: 'Défense',
      A: (1 - (analytics.defenseFactor?.home || 0)) * 100 + 50, // Arbitrary scaling: lower factor is better? Context says >1 weaker defense. Let's assume inverse.
      B: (1 - (analytics.defenseFactor?.away || 0)) * 100 + 50,
      fullMark: 100,
    },
    {
      subject: 'Effectif',
      A: (analytics.injuryFactor?.home || 1) * 100,
      B: (analytics.injuryFactor?.away || 1) * 100,
      fullMark: 100,
    },
    {
      subject: 'Repos',
      A: Math.min(100, (analytics.fatigue?.restHours?.home || 0) / 1.68), // 168h = 1 week = 100%
      B: Math.min(100, (analytics.fatigue?.restHours?.away || 0) / 1.68),
      fullMark: 100,
    },
    {
      subject: 'Elo',
      A: ((analytics.ratings?.home || 1500) - 1000) / 10, // Scale 1000-2000 to 0-100
      B: ((analytics.ratings?.away || 1500) - 1000) / 10,
      fullMark: 100,
    },
  ];

  const asianHandicap = match.predictions?.find(p => p.type === "asian_handicap") as AsianHandicapPrediction
  const asianTotals = match.predictions?.find(p => p.type === "asian_totals") as AsianTotalsPrediction
  const exactGoals = match.predictions?.find(p => p.type === "exact_goals") as ExactGoalsPrediction

  return (
    <div className="p-4 space-y-8 max-w-4xl mx-auto animation-fade-in">

      {/* 1. Radar Chart Comparison */}
      <div className="bg-card border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <ActivityIcon /> Comparaison {match.homeTeam.name} vs {match.awayTeam.name}
          </h3>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'currentColor', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name={match.homeTeam.name}
                dataKey="A"
                stroke="var(--navy)"
                fill="var(--navy)"
                fillOpacity={0.5}
              />
              <Radar
                name={match.awayTeam.name}
                dataKey="B"
                stroke="var(--cyan)"
                fill="var(--cyan)"
                fillOpacity={0.5}
              />
              <Legend />
              <Tooltip
                contentStyle={{ backgroundColor: 'var(--background)', borderRadius: '8px', border: '1px solid var(--border)' }}
                itemStyle={{ color: 'var(--foreground)' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="text-center text-xs text-muted-foreground mt-2">
          Comparaison normalisée sur 6 axes (Plus c'est large, mieux c'est)
        </div>
      </div>

      {/* 2. Opportunities List */}
      <OpportunitiesList opportunities={analytics.opportunities || []} />

      {/* 3. Detailed Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* xG Card */}
        <MetricCard
          title="Potential Offensif (xG)"
          icon={<Zap className="text-yellow-500" />}
          homeValue={prediction.xG.home.toFixed(2)}
          awayValue={prediction.xG.away.toFixed(2)}
          homeLabel={match.homeTeam.name}
          awayLabel={match.awayTeam.name}
        />

        {/* Form Card */}
        {analytics.formIndex && (
          <MetricCard
            title="Forme Récente"
            icon={<TrendingUp className="text-green-500" />}
            homeValue={`${(analytics.formIndex.home * 100).toFixed(0)}%`}
            awayValue={`${(analytics.formIndex.away * 100).toFixed(0)}%`}
            homeLabel={match.homeTeam.name}
            awayLabel={match.awayTeam.name}
            homeColor={analytics.formIndex.home > 0 ? "text-green-500" : "text-red-500"}
            awayColor={analytics.formIndex.away > 0 ? "text-green-500" : "text-red-500"}
          />
        )}
      </div>

      {/* 4. Advanced Markets Analysis */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 px-1 border-b pb-2">
          <Info className="w-5 h-5 text-[var(--navy)]" />
          <h3 className="text-lg font-bold text-[var(--navy)] uppercase tracking-tight">Analyse de Marché</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {exactGoals && <GoalsHeatmap distribution={exactGoals.distribution} />}
          {asianHandicap && <AsianMarketsSummary type="Handicap" lines={asianHandicap.lines} />}
          {asianTotals && <AsianMarketsSummary type="Total" lines={asianTotals.lines} />}
        </div>
      </div>
    </div>
  )
}

function MetricCard({ title, icon, homeValue, awayValue, homeLabel, awayLabel, homeColor, awayColor }: any) {
  return (
    <div className="bg-card border rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4 text-muted-foreground">
        {icon}
        <h4 className="font-semibold text-sm uppercase">{title}</h4>
      </div>
      <div className="grid grid-cols-2 gap-8">
        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-1">{homeLabel}</div>
          <div className={cn("text-2xl font-black", homeColor)}>{homeValue}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-1">{awayLabel}</div>
          <div className={cn("text-2xl font-black", awayColor)}>{awayValue}</div>
        </div>
      </div>
    </div>
  )
}

function ActivityIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-activity w-5 h-5 text-[var(--navy)]"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  )
}
