/**
 * Onboarding Step 3: Preferences
 * Types de prédictions + profil de risque
 */

"use client";

import React from 'react';
import { Shield, TrendingUp, Zap } from 'lucide-react';
import { cn } from '@/shared/utils';

interface PreferencesStepProps {
  selectedPredictionTypes: string[];
  riskProfile: 'conservative' | 'balanced' | 'aggressive' | null;
  onPredictionTypesChange: (types: string[]) => void;
  onRiskProfileChange: (profile: 'conservative' | 'balanced' | 'aggressive') => void;
}

// Types de prédictions disponibles
const PREDICTION_TYPES = [
  'Over 1.5',
  'BTTS',
  'Exact Score',
  'HT/FT',
  'Half Compare',
  'Clean Sheet',
  'Corners',
  'Internal',
];

// Profils de risque
const RISK_PROFILES = [
  {
    value: 'conservative' as const,
    label: 'Conservateur',
    description: 'Prédictions sûres, faible risque',
    icon: Shield,
    color: 'text-blue-500',
  },
  {
    value: 'balanced' as const,
    label: 'Équilibré',
    description: 'Équilibre entre risque et gain',
    icon: TrendingUp,
    color: 'text-lime',
  },
  {
    value: 'aggressive' as const,
    label: 'Agressif',
    description: 'Prédictions audacieuses, haut gain',
    icon: Zap,
    color: 'text-orange-500',
  },
];

export function PreferencesStep({
  selectedPredictionTypes,
  riskProfile,
  onPredictionTypesChange,
  onRiskProfileChange,
}: PreferencesStepProps) {
  const togglePredictionType = (type: string) => {
    if (selectedPredictionTypes.includes(type)) {
      onPredictionTypesChange(selectedPredictionTypes.filter(t => t !== type));
    } else {
      onPredictionTypesChange([...selectedPredictionTypes, type]);
    }
  };

  return (
    <div className="flex-1 flex flex-col px-6 py-8 space-y-8 max-w-2xl mx-auto w-full overflow-y-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Vos préférences</h1>
        <p className="text-muted-foreground">Personnalisez votre expérience</p>
      </div>

      {/* Section 1: Types de prédictions */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Types de prédictions</h2>
          <p className="text-sm text-muted-foreground">
            Sélectionnez au moins un type de prédiction
          </p>
        </div>

        {/* Chips */}
        <div className="flex flex-wrap gap-2">
          {PREDICTION_TYPES.map((type) => {
            const isSelected = selectedPredictionTypes.includes(type);

            return (
              <button
                key={type}
                className={cn(
                  "px-4 py-2 rounded-full border-2 transition-all text-sm font-medium",
                  "active:scale-95",
                  isSelected
                    ? "bg-lime text-navy border-lime"
                    : "border-muted text-foreground hover:border-muted-foreground/50"
                )}
                onClick={() => togglePredictionType(type)}
              >
                {type}
              </button>
            );
          })}
        </div>

        {/* Counter */}
        {selectedPredictionTypes.length > 0 && (
          <p className="text-xs text-lime">
            {selectedPredictionTypes.length} type{selectedPredictionTypes.length > 1 ? 's' : ''} sélectionné{selectedPredictionTypes.length > 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Section 2: Profil de risque */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Profil de risque</h2>
          <p className="text-sm text-muted-foreground">
            Choisissez votre stratégie de prédiction
          </p>
        </div>

        {/* Radio buttons */}
        <div className="space-y-3">
          {RISK_PROFILES.map((profile) => {
            const isSelected = riskProfile === profile.value;
            const Icon = profile.icon;

            return (
              <button
                key={profile.value}
                className={cn(
                  "w-full p-4 rounded-lg border-2 transition-all text-left",
                  "flex items-start gap-3 active:scale-[0.98]",
                  isSelected
                    ? "border-lime bg-lime/10 shadow-md shadow-lime/20"
                    : "border-muted bg-card hover:border-muted-foreground/30"
                )}
                onClick={() => onRiskProfileChange(profile.value)}
              >
                {/* Icon */}
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                  isSelected ? "bg-lime/20" : "bg-muted"
                )}>
                  <Icon className={cn("w-5 h-5", isSelected ? profile.color : "text-muted-foreground")} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold">{profile.label}</p>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-lime flex items-center justify-center shrink-0">
                        <div className="w-2 h-2 rounded-full bg-navy" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{profile.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Helper text */}
      <p className="text-xs text-muted-foreground text-center">
        Ces préférences vous aideront à recevoir des prédictions plus pertinentes
      </p>
    </div>
  );
}
