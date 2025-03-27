import { FavoriteVideoTransaction } from "@prisma/client";
import { YouTubeDataApiCommentDetailModel } from "../../external/youtubedataapi/videocommentdetail/model/YouTubeDataApiCommentDetailModel";
import { YouTubeDataApiCommentDetailResponseType } from "../../external/youtubedataapi/videocommentdetail/type/YouTubeDataApiCommentDetailResponseType";

export class GetBlockCommentListResponseModel {

    private readonly _data: YouTubeDataApiCommentDetailResponseType;

    constructor(youTubeDataApiCommentDetailModel: YouTubeDataApiCommentDetailModel) {

        this._data = youTubeDataApiCommentDetailModel.response;
    }

    get data() {
        return this._data;
    }
}