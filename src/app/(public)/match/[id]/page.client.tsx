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
  PredictionsTab,
  AnalysisTab,
  ValueBetsTab,
  type TabId,
  type MatchDetail
} from "@/modules/match-detail";

interface MatchDetailClientProps {
  match: MatchDetail;
}

export function MatchDetailClient({ match }: MatchDetailClientProps) {
  const [activeTab, setActiveTab] = useState<TabId>("predictions");

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Match Header */}
      <MatchHeader match={match} />

      {/* Tabs Navigation */}
      <TabsNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <div className="container mx-auto">
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

        {activeTab === "h2h" && (
          <div className="p-4">
            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Historique (H2H)</h3>
              <p className="text-muted-foreground">
                L'historique des confrontations sera bientôt disponible
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
