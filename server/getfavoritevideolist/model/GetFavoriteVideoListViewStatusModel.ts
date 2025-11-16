import { VideoMemoModel } from "../../internaldata/favoritevideomemotransaction/properties/VideoMemoModel";
import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";
import { SummaryModel } from "../../internaldata/favoritevideotransaction/properties/SummaryModel";
import { ViewStatusModel } from "../../internaldata/common/properties/ViewStatusModel";
import { CategoryIdModel } from "../../internaldata/favoritevideocateorytransaction/properties/CategoryIdModel";

export class GetFavoriteVideoListViewStatusModel {

    // 視聴状況
    private readonly _viewStatus: string[];

    constructor(viewStatus: string) {

        const viewStatusList = viewStatus ? viewStatus.split(`,`) : [];

        this._viewStatus = viewStatusList;
    }

    public get viewStatus() {
        return this._viewStatus;
    }
}