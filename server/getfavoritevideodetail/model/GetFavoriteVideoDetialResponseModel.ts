import { FavoriteVideoTransaction } from "@prisma/client";
import { YouTubeDataApiVideoDetailItemType } from "../../external/youtubedataapi/videodetail/model/YouTubeDataApiVideoDetailItemType";
import { FavoriteVideoDetailMergedModel } from "./FavoriteVideoDetailMergedModel";

export class GetFavoriteVideoDetialResponseModel {

    private readonly _data: FavoriteVideoDetailMergedModel;

    constructor(favoriteVideoDetailMergedModel: FavoriteVideoDetailMergedModel) {

        this._data = favoriteVideoDetailMergedModel;
    }

    get data() {
        return this._data;
    }
}