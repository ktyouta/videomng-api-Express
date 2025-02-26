import { YouTubeDataApiVideoListResponseType } from "../../external/youtubedataapi/videolist/model/YouTubeDataApiVideoListResponseType";
import { YouTubeVideoListApi } from "../../external/youtubedataapi/videolist/serivce/YouTubeVideoListApi";

export class GetVideoListResponseModel {

    private readonly response: YouTubeDataApiVideoListResponseType;

    constructor(youTubeVideoListApi: YouTubeVideoListApi) {

        this.response = youTubeVideoListApi.response;
    }

}