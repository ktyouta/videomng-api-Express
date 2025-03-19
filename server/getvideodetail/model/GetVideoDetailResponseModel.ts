import { YouTubeDataApiVideoDetailResponseType } from "../../external/youtubedataapi/videodetail/model/YouTubeDataApiVideoDetailResponseType";
import { YoutubeVideoDetailApi } from "../../external/youtubedataapi/videodetail/service/YoutubeVideoDetailApi";

export class GetVideoDetailResponseModel {

    private readonly _data: YouTubeDataApiVideoDetailResponseType;

    constructor(youTubeVideoDetailApi: YoutubeVideoDetailApi) {

        this._data = youTubeVideoDetailApi.response;
    }

    get data() {
        return this._data;
    }
}