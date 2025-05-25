import { FavoriteVideoTransaction, ViewStatusMaster } from "@prisma/client";
import { YouTubeDataApiCommentDetailModel } from "../../external/youtubedataapi/videocommentdetail/model/YouTubeDataApiCommentDetailModel";
import { YouTubeDataApiCommentDetailResponseType } from "../../external/youtubedataapi/videocommentdetail/type/YouTubeDataApiCommentDetailResponseType";

export class GetFavoriteVideoSortListResponseModel {

    private readonly _data: ViewStatusMaster[];

    constructor(viewStatusList: ViewStatusMaster[]) {

        this._data = viewStatusList;
    }

    get data() {
        return this._data;
    }
}