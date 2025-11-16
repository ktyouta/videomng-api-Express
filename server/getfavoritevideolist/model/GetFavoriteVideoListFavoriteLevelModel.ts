export class GetFavoriteVideoListFavoriteLevelModel {

    private readonly _favoriteLevel: string[];

    constructor(favoriteLevel: string) {

        const favoriteLevelList = favoriteLevel ? favoriteLevel.split(`,`) : [];

        this._favoriteLevel = favoriteLevelList;
    }

    get favoriteLevel() {
        return this._favoriteLevel;
    }
}