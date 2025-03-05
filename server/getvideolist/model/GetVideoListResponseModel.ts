import { YouTubeDataApiVideoListResponseType } from "../../external/youtubedataapi/videolist/model/YouTubeDataApiVideoListResponseType";
import { YouTubeVideoListApi } from "../../external/youtubedataapi/videolist/serivce/YouTubeVideoListApi";

export class GetVideoListResponseModel {

    private readonly _data: YouTubeDataApiVideoListResponseType;

    constructor(youTubeVideoListApi: YouTubeVideoListApi) {

        this._data = youTubeVideoListApi.response;
    }

    get data() {
        return this._data;
    }
}