export class FavoriteLevelModel {

    private readonly _favoriteLevel: number;
    public static readonly MIN = 0;


    constructor(favoriteLevel: number) {

        if (!favoriteLevel) {
            favoriteLevel = FavoriteLevelModel.MIN;
        }

        if (favoriteLevel < FavoriteLevelModel.MIN) {
            favoriteLevel = FavoriteLevelModel.MIN;
        }

        this._favoriteLevel = favoriteLevel;
    }

    get favoriteLevel() {
        return this._favoriteLevel;
    }
}