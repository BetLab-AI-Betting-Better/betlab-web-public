/**
 * API Configuration
 * Basé sur lib/core/config/api_config.dart
 */

export const ApiConfig = {
  // Use local proxy in development to avoid CORS issues
  // In production, this should point to your actual API
  baseUrl: typeof window !== 'undefined'
    ? '/api/proxy'  // Client-side: use Next.js proxy
    : (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://fastapi-production-2b94.up.railway.app'), // Server-side: direct
  apiVersion: '', // Empty because proxy already includes /api
  defaultTimeout: 90000, // 90 seconds

  // Endpoints
  endpoints: {
    fixtures: '/api/fixtures',
    fixturesLive: '/api/fixtures/live',
    predictions: '/predictions',
    odds: '/odds',
    portfolio: '/portfolio',
    portfolioRecommendations: '/portfolio/recommendations',
    portfolioMatchOpportunities: '/portfolio/match-opportunities',
    teams: '/teams',
    standings: '/standings',
    venues: '/venues',
    metadata: '/metadata',
  },

  // Popular League IDs (hardcodées)
  popularLeagueIds: new Set([
    39,   // Premier League
    140,  // La Liga
    61,   // Ligue 1
    78,   // Bundesliga
    135,  // Serie A
    2,    // UEFA Champions League
    3,    // UEFA Europa League
    94,   // Primeira Liga
    88,   // Eredivisie
    203,  // Süper Lig
  ]),

  // Retry configuration
  retry: {
    maxRetries: 3,
    retryDelay: 1000, // 1 second
    retryOn: [408, 429, 500, 502, 503, 504],
  },
} as const;

export type ApiEndpoint = keyof typeof ApiConfig.endpoints;
