import type { IFavoriteRepository } from "@/core/repositories/favorite.repository";

interface ToggleFavoriteInput {
  userId: string;
  fixtureId: number;
  currentlyFavorited: boolean;
}

export class ToggleFavoriteUseCase {
  constructor(private readonly favoriteRepository: IFavoriteRepository) {}

  async execute({
    userId,
    fixtureId,
    currentlyFavorited,
  }: ToggleFavoriteInput): Promise<void> {
    if (currentlyFavorited) {
      await this.favoriteRepository.remove(userId, fixtureId);
      return;
    }

    await this.favoriteRepository.add(userId, fixtureId);
  }
}
