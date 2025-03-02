import { FavoriteVideoTransaction } from "@prisma/client";
import { YouTubeDataApiVideoDetailItemType } from "../../external/youtubedataapi/videodetail/model/YouTubeDataApiVideoDetailItemType";
import { FavoriteVideoDetailMergedModel } from "./FavoriteVideoDetailMergedModel";

export class GetFavoriteVideoDetialResponseModel {

    private readonly data: FavoriteVideoDetailMergedModel;

    constructor(favoriteVideoDetailMergedModel: FavoriteVideoDetailMergedModel) {

        this.data = favoriteVideoDetailMergedModel;
    }

}