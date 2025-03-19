import { YouTubeDataApiVideoDetailModel } from "../../external/youtubedataapi/videodetail/model/YouTubeDataApiVideoDetailModel";
import { YouTubeDataApiVideoDetailResponseType } from "../../external/youtubedataapi/videodetail/type/YouTubeDataApiVideoDetailResponseType";

export class GetVideoDetailResponseModel {

    private readonly _data: YouTubeDataApiVideoDetailResponseType;

    constructor(youTubeDataApiVideoDetailModel: YouTubeDataApiVideoDetailModel) {

        this._data = youTubeDataApiVideoDetailModel.response;
    }

    get data() {
        return this._data;
    }
}