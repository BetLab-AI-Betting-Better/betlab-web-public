export interface TeamStats {
  teamId: number;
  attack: number;
  defense: number;
  possession: number;
  passing: number;
  shots: number;
  discipline: number;
  avgGoalsScored: number;
  avgGoalsConceded: number;
  cleanSheets: number;
  form: ("W" | "D" | "L")[];
}
