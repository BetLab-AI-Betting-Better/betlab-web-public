export interface IFavoriteRepository {
  listByUser(userId: string): Promise<number[]>;
  isFavorited(userId: string, fixtureId: number): Promise<boolean>;
  add(userId: string, fixtureId: number): Promise<void>;
  remove(userId: string, fixtureId: number): Promise<void>;
}
