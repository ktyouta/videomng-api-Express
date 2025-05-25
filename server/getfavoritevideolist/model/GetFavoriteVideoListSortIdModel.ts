import { VideoMemoModel } from "../../internaldata/favoritevideomemotransaction/properties/VideoMemoModel";
import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";
import { SummaryModel } from "../../internaldata/favoritevideotransaction/properties/SummaryModel";
import { ViewStatusModel } from "../../internaldata/common/properties/ViewStatusModel";
import { CategoryIdModel } from "../../internaldata/favoritevideocateorytransaction/properties/CategoryIdModel";
import { FavoriteVideoSortIdModel } from "../../internaldata/favoritevideosortmaster/properties/FavoriteVideoSortIdModel";

export class GetFavoriteVideoListSortIdModel {

    // ソートID
    private readonly _sortId: string;

    constructor(sortId: string) {

        this._sortId = sortId;
    }

    static async set(sortId: string) {

        if (!sortId) {
            return new GetFavoriteVideoListSortIdModel(sortId);
        }

        const favoriteVideoSortIdModel = await FavoriteVideoSortIdModel.reConstruct(sortId);

        return new GetFavoriteVideoListSortIdModel(favoriteVideoSortIdModel.sortId);
    }

    public get sortId() {
        return this._sortId;
    }
}