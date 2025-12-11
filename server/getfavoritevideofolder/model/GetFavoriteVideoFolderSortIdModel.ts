import { FavoriteVideoSortIdModel } from "../../internaldata/favoritevideosortmaster/properties/FavoriteVideoSortIdModel";

export class GetFavoriteVideoFolderSortIdModel {

    // ソートID
    private readonly _sortId: string;

    constructor(sortId: string) {

        this._sortId = sortId;
    }

    static async set(sortId: string) {

        if (!sortId) {
            return new GetFavoriteVideoFolderSortIdModel(sortId);
        }

        const favoriteVideoSortIdModel = await FavoriteVideoSortIdModel.reConstruct(sortId);

        return new GetFavoriteVideoFolderSortIdModel(favoriteVideoSortIdModel.sortId);
    }

    public get sortId() {
        return this._sortId;
    }
}