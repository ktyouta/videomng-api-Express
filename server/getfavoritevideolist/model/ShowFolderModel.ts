import { VideoMemoModel } from "../../internaldata/favoritevideomemotransaction/properties/VideoMemoModel";
import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";
import { SummaryModel } from "../../internaldata/favoritevideotransaction/properties/SummaryModel";
import { ViewStatusModel } from "../../internaldata/common/properties/ViewStatusModel";
import { CategoryIdModel } from "../../internaldata/favoritevideocateorytransaction/properties/CategoryIdModel";
import { FavoriteVideoSortIdModel } from "../../internaldata/favoritevideosortmaster/properties/FavoriteVideoSortIdModel";

export class ShowFolderModel {

    // フォルダ表示フラグ
    private readonly _value: string;
    private static readonly ON = `1`;

    constructor(value: string) {

        this._value = value;
    }

    get value() {
        return this._value;
    }

    /**
     * フォルダ表示判定
     * @returns 
     */
    isOn() {
        return !this._value || this._value === ShowFolderModel.ON;
    }
}