import { FavoriteVideoMemoTransaction, FavoriteVideoTransaction } from "@prisma/client";
import { YouTubeDataApiVideoDetailItemType } from "../../external/youtubedataapi/videodetail/model/YouTubeDataApiVideoDetailItemType";

export class GetFavoriteVideoMemoResponseModel {

    private readonly _data: FavoriteVideoMemoTransaction[];

    constructor(favoriteVideoMemoTransaction: FavoriteVideoMemoTransaction[]) {

        this._data = favoriteVideoMemoTransaction;
    }

    get data() {
        return this._data;
    }
}