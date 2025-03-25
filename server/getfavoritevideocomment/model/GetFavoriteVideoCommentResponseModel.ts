import { YouTubeDataApiCommentThreadModel } from "../../external/youtubedataapi/videocomment/model/YouTubeDataApiCommentThreadModel";
import { YouTubeDataApiCommentThreadResponseType } from "../../external/youtubedataapi/videocomment/type/YouTubeDataApiCommentThreadResponseType";

export class GetFavoriteVideoCommentResponseModel {

    private readonly _data: YouTubeDataApiCommentThreadResponseType;

    constructor(youTubeDataApiCommentThreadModel: YouTubeDataApiCommentThreadModel) {

        this._data = youTubeDataApiCommentThreadModel.response;
    }

    get data() {
        return this._data;
    }
}