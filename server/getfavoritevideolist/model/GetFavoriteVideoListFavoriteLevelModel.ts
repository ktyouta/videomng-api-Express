export class GetFavoriteVideoListFavoriteLevelModel {

    private readonly _favoriteLevel: string;

    constructor(favoriteLevel: string) {

        if (Number.isNaN(favoriteLevel)) {
            favoriteLevel = ``;
        }

        this._favoriteLevel = favoriteLevel;
    }

    get favoriteLevel() {
        return this._favoriteLevel;
    }
}