/**
 * Onboarding domain types.
 */

export type OnboardingStep = 0 | 1 | 2 | 3;

export type RiskProfile = "conservative" | "balanced" | "aggressive";

export interface LeaguePreference {
  id: string;
  name: string;
  country: string;
  emoji: string;
}

export interface PredictionTypeOption {
  id: string;
  label: string;
  description?: string;
}

export interface RiskProfileOption {
  value: RiskProfile;
  label: string;
  description: string;
  icon: string;
  color: string;
}

export interface OnboardingData {
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  selectedLeagues: string[];
  selectedPredictionTypes: string[];
  riskProfile: RiskProfile | null;
}

export interface OnboardingValidationResult {
  isValid: boolean;
  errors: string[];
}
