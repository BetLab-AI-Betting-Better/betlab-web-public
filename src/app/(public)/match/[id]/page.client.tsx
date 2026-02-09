/**
 * Match Detail Client Component
 *
 * Interactive match detail page with tabs navigation
 */

"use client";

import { useState } from "react";
import {
  MatchHeader,
  TabsNavigation,
  OverviewTab,
  PredictionsTab,
  AnalysisTab,
  ValueBetsTab,
  StatsTab,
  LineupsTab,
  H2HTab,
  type TabId,
} from "@/presentation/components/features/match-detail";
import type { MatchDetail } from "@/core/entities/match-detail/match-detail.entity";

interface MatchDetailClientProps {
  match: MatchDetail;
}

export function MatchDetailClient({ match }: MatchDetailClientProps) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Match Header */}
      <MatchHeader match={match} />

      {/* Tabs Navigation */}
      <TabsNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <div className="container mx-auto">
        {activeTab === "overview" && (
          <OverviewTab match={match} />
        )}

        {activeTab === "predictions" && (
          <PredictionsTab match={match} predictions={match.predictions} />
        )}

        {activeTab === "analysis" && (
          <AnalysisTab
            match={match}
            prediction={match.predictions?.find(p => p.type === "match_result")}
          />
        )}

        {activeTab === "value" && (
          <ValueBetsTab match={match} predictions={match.predictions} />
        )}

        {activeTab === "stats" && (
          <StatsTab match={match} />
        )}

        {activeTab === "lineups" && (
          <LineupsTab match={match} />
        )}

        {activeTab === "h2h" && (
          <H2HTab match={match} />
        )}
      </div>
    </div>
  );
}
