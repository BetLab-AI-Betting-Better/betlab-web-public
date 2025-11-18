/**
 * Onboarding Step 2: Leagues Selection
 * Sélection des ligues favorites (min 1)
 */

"use client";

import React from 'react';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/shared/utils';

interface LeaguesStepProps {
  selectedLeagues: string[];
  onLeaguesChange: (leagues: string[]) => void;
}

// Données des ligues disponibles
const AVAILABLE_LEAGUES = [
  {
    id: 'premier-league',
    name: 'Premier League',
    country: 'England',
    emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  },
  {
    id: 'la-liga',
    name: 'La Liga',
    country: 'Spain',
    emoji: '🇪🇸',
  },
  {
    id: 'serie-a',
    name: 'Serie A',
    country: 'Italy',
    emoji: '🇮🇹',
  },
  {
    id: 'bundesliga',
    name: 'Bundesliga',
    country: 'Germany',
    emoji: '🇩🇪',
  },
  {
    id: 'ligue-1',
    name: 'Ligue 1',
    country: 'France',
    emoji: '🇫🇷',
  },
  {
    id: 'champions-league',
    name: 'Champions League',
    country: 'UEFA',
    emoji: '🏆',
  },
  {
    id: 'europa-league',
    name: 'Europa League',
    country: 'UEFA',
    emoji: '🥈',
  },
  {
    id: 'nba',
    name: 'NBA',
    country: 'Basketball',
    emoji: '🏀',
  },
  {
    id: 'euroleague',
    name: 'EuroLeague',
    country: 'Basketball',
    emoji: '⛹️',
  },
];

export function LeaguesStep({ selectedLeagues, onLeaguesChange }: LeaguesStepProps) {
  const toggleLeague = (leagueId: string) => {
    if (selectedLeagues.includes(leagueId)) {
      onLeaguesChange(selectedLeagues.filter(id => id !== leagueId));
    } else {
      onLeaguesChange([...selectedLeagues, leagueId]);
    }
  };

  return (
    <div className="flex-1 flex flex-col px-6 py-8 space-y-6 max-w-2xl mx-auto w-full overflow-y-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Choisissez vos ligues</h1>
        <p className="text-muted-foreground">Sélectionnez au moins une ligue</p>
      </div>

      {/* Counter */}
      <div className="text-center">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lime/10 text-lime text-sm font-medium">
          {selectedLeagues.length} {selectedLeagues.length > 1 ? 'ligues sélectionnées' : 'ligue sélectionnée'}
        </span>
      </div>

      {/* Leagues Grid */}
      <div className="grid grid-cols-2 gap-4">
        {AVAILABLE_LEAGUES.map((league) => {
          const isSelected = selectedLeagues.includes(league.id);

          return (
            <button
              key={league.id}
              className={cn(
                "relative h-32 rounded-lg border-2 p-4 cursor-pointer transition-all",
                "flex flex-col items-center justify-center space-y-2",
                "active:scale-95 hover:shadow-md",
                isSelected
                  ? "border-lime bg-lime/10 shadow-lg shadow-lime/20"
                  : "border-muted bg-card hover:border-muted-foreground/30"
              )}
              onClick={() => toggleLeague(league.id)}
            >
              {/* Checkmark */}
              {isSelected && (
                <CheckCircle className="absolute top-2 right-2 w-5 h-5 text-lime fill-lime" />
              )}

              {/* League emoji/logo */}
              <div className="text-5xl mb-1">
                {league.emoji}
              </div>

              {/* League name */}
              <div className="text-center">
                <p className="text-sm font-semibold leading-tight">{league.name}</p>
                <p className="text-xs text-muted-foreground">{league.country}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Helper text */}
      <p className="text-xs text-muted-foreground text-center pt-4">
        Vous pourrez modifier vos préférences plus tard dans les paramètres
      </p>
    </div>
  );
}
