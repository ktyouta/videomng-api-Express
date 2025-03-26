import { YouTubeDataApiCommentThreadModel } from "../../external/youtubedataapi/videocomment/model/YouTubeDataApiCommentThreadModel";
import { YouTubeDataApiCommentThreadResponseType } from "../../external/youtubedataapi/videocomment/type/YouTubeDataApiCommentThreadResponseType";
import { FavoriteVideoCommentResponseDataModel } from "./FavoriteVideoCommentResponseDataModel";

export class GetFavoriteVideoCommentResponseModel {

    private readonly _data: YouTubeDataApiCommentThreadResponseType;

    constructor(favoriteVideoCommentResponseDataModel: FavoriteVideoCommentResponseDataModel) {

        this._data = favoriteVideoCommentResponseDataModel.data;
    }

    get data() {
        return this._data;
    }
}