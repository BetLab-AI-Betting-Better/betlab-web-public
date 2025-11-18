import type { IFavoriteRepository } from "@/core/repositories/favorite.repository";
import { ToggleFavoriteUseCase } from "@/core/use-cases/favorites/toggle-favorite.use-case";

export class FavoritesService {
  private readonly toggleFavoriteUseCase: ToggleFavoriteUseCase;

  constructor(private readonly favoriteRepository: IFavoriteRepository) {
    this.toggleFavoriteUseCase = new ToggleFavoriteUseCase(favoriteRepository);
  }

  listByUser(userId: string) {
    return this.favoriteRepository.listByUser(userId);
  }

  isFavorited(userId: string, fixtureId: number) {
    return this.favoriteRepository.isFavorited(userId, fixtureId);
  }

  toggleFavorite(userId: string, fixtureId: number, currentlyFavorited: boolean) {
    return this.toggleFavoriteUseCase.execute({ userId, fixtureId, currentlyFavorited });
  }
}
