import { YouTubeDataApiVideoDetailResponseType } from "../../external/youtubedataapi/videodetail/model/YouTubeDataApiVideoDetailResponseType";
import { YoutubeVideoDetailApi } from "../../external/youtubedataapi/videodetail/service/YoutubeVideoDetailApi";
import { YouTubeDataApiVideoListResponseType } from "../../external/youtubedataapi/videolist/model/YouTubeDataApiVideoListResponseType";
import { YouTubeVideoListApi } from "../../external/youtubedataapi/videolist/serivce/YouTubeVideoListApi";

export class GetVideoDetailResponseModel {

    private readonly response: YouTubeDataApiVideoDetailResponseType;

    constructor(youTubeVideoDetailApi: YoutubeVideoDetailApi) {

        this.response = youTubeVideoDetailApi.response;
    }

}