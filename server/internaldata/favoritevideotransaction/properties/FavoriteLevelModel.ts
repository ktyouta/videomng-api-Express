export class FavoriteLevelModel {

    private readonly _favoriteLevel: number;
    private static readonly MAX = 5;
    private static readonly MIN = 0;


    constructor(favoriteLevel: number) {

        if (!favoriteLevel) {
            favoriteLevel = FavoriteLevelModel.MIN;
        }

        if (favoriteLevel < FavoriteLevelModel.MIN || favoriteLevel > FavoriteLevelModel.MAX) {
            favoriteLevel = FavoriteLevelModel.MIN;
        }

        this._favoriteLevel = favoriteLevel;
    }

    get favoriteLevel() {
        return this._favoriteLevel;
    }
}