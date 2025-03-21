import { YouTubeDataApiVideoListModel } from "../../external/youtubedataapi/videolist/model/YouTubeDataApiVideoListModel";
import { YouTubeDataApiVideoListItemType } from "../../external/youtubedataapi/videolist/type/YouTubeDataApiVideoListItemType";
import { YouTubeDataApiVideoListResponseType } from "../../external/youtubedataapi/videolist/type/YouTubeDataApiVideoListResponseType";
import { SearchCommentByKeywordResponseCommentType } from "../type/SearchCommentByKeywordResponseCommentType";

export class SearchCommentByKeywordResponseModel {

    private readonly _data: SearchCommentByKeywordResponseCommentType[];

    constructor(filterdCommentList: SearchCommentByKeywordResponseCommentType[]) {

        this._data = filterdCommentList;
    }

    get data() {
        return this._data;
    }
}