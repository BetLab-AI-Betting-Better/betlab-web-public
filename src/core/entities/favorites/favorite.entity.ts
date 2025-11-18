export interface Favorite {
  id: string;
  userId: string;
  fixtureId: number;
  createdAt: Date;
}

export interface FavoriteCreateInput {
  userId: string;
  fixtureId: number;
}

export interface FavoriteActionResult {
  success: boolean;
  error?: string;
}
