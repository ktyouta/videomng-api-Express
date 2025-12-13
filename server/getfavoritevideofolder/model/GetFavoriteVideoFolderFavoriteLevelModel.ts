export class GetFavoriteVideoFolderFavoriteLevelModel {

    private readonly _favoriteLevel: number[];

    constructor(favoriteLevel: string) {

        const favoriteLevelList = favoriteLevel ? favoriteLevel.split(`,`).filter((e) => !Number.isNaN(e)).map((e) => parseInt(e)) : [];

        this._favoriteLevel = favoriteLevelList;
    }

    get favoriteLevel() {
        return this._favoriteLevel;
    }
}