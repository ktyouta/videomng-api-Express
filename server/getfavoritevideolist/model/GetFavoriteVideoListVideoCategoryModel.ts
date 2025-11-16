import { VideoMemoModel } from "../../internaldata/favoritevideomemotransaction/properties/VideoMemoModel";
import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";
import { SummaryModel } from "../../internaldata/favoritevideotransaction/properties/SummaryModel";
import { ViewStatusModel } from "../../internaldata/common/properties/ViewStatusModel";
import { CategoryIdModel } from "../../internaldata/favoritevideocateorytransaction/properties/CategoryIdModel";

export class GetFavoriteVideoListVideoCategoryModel {

    // カテゴリ
    private readonly _videoCategory: string[];

    constructor(videoCategory: string) {

        const videoCategoryList = videoCategory ? videoCategory.split(`,`) : [];

        this._videoCategory = videoCategoryList;
    }

    public get videoCategory() {
        return this._videoCategory;
    }
}