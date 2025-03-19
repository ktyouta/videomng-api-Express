import { YouTubeDataApiVideoListModel } from "../../external/youtubedataapi/videolist/model/YouTubeDataApiVideoListModel";
import { YouTubeDataApiVideoListResponseType } from "../../external/youtubedataapi/videolist/type/YouTubeDataApiVideoListResponseType";

export class GetVideoListResponseModel {

    private readonly _data: YouTubeDataApiVideoListResponseType;

    constructor(youTubeDataApiVideoListModel: YouTubeDataApiVideoListModel) {

        this._data = youTubeDataApiVideoListModel.response;
    }

    get data() {
        return this._data;
    }
}