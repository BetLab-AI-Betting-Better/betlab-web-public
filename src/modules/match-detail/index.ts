// Domain types - safe for client components
export type { MatchDetail } from "./domain/types";

// UI components exports - safe for client components
export { MatchHeader } from "./ui/components/match-header";
export { TabsNavigation } from "./ui/components/tabs-navigation";
export { PredictionsTab } from "./ui/components/predictions-tab";
export { AnalysisTab } from "./ui/components/analysis-tab";
export { ValueBetsTab } from "./ui/components/value-bets-tab";
export type { TabId } from "./ui/components/tabs-navigation";

// Server queries should be imported directly from server/queries
// NOT exported here to avoid bundling server code in client
