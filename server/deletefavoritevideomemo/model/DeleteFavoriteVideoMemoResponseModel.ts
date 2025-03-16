import { FavoriteVideoMemoTransaction, FavoriteVideoTransaction } from "@prisma/client";
import { YouTubeDataApiVideoDetailItemType } from "../../external/youtubedataapi/videodetail/model/YouTubeDataApiVideoDetailItemType";

export class DeleteFavoriteVideoMemoResponseModel {

    private readonly _data: FavoriteVideoMemoTransaction;

    constructor(FavoriteVideoMemo: FavoriteVideoMemoTransaction) {

        this._data = FavoriteVideoMemo;
    }

    get data() {
        return this._data;
    }
}