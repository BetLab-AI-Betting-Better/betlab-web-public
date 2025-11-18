import { FixturesService } from "@/application/services/fixtures/fixtures.service";
import { FavoritesService } from "@/application/services/favorites/favorites.service";
import { BetlabFixtureRepository } from "@/infrastructure/repositories/fixtures/betlab-fixture.repository";
import { BetlabPredictionRepository } from "@/infrastructure/repositories/predictions/betlab-prediction.repository";
import { SupabaseFavoriteRepository } from "@/infrastructure/repositories/favorites/supabase-favorite.repository";
import { BetlabMatchDetailRepository } from "@/infrastructure/repositories/match-detail/betlab-match-detail.repository";

class DependencyContainer {
  private _fixtureRepository?: BetlabFixtureRepository;
  private _predictionRepository?: BetlabPredictionRepository;
  private _favoriteRepository?: SupabaseFavoriteRepository;

  get fixtureRepository() {
    if (!this._fixtureRepository) {
      this._fixtureRepository = new BetlabFixtureRepository();
    }
    return this._fixtureRepository;
  }

  get predictionRepository() {
    if (!this._predictionRepository) {
      this._predictionRepository = new BetlabPredictionRepository();
    }
    return this._predictionRepository;
  }

  get favoriteRepository() {
    if (!this._favoriteRepository) {
      this._favoriteRepository = new SupabaseFavoriteRepository();
    }
    return this._favoriteRepository;
  }

  createFixturesService() {
    return new FixturesService({
      fixtureRepository: this.fixtureRepository,
      predictionRepository: this.predictionRepository,
    });
  }

  createFavoritesService() {
    return new FavoritesService(this.favoriteRepository);
  }

  createMatchDetailRepository() {
    return new BetlabMatchDetailRepository(this.predictionRepository);
  }
}

export const container = new DependencyContainer();
