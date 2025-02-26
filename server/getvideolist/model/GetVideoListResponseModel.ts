import { YouTubeDataApiVideoListResponseType } from "../../external/youtubedataapi/videolist/model/YouTubeDataApiVideoListResponseType";
import { YouTubeDataApiVideoList } from "../../external/youtubedataapi/videolist/serivce/YoutubeDataApiVideoList";

export class GetVideoListResponseModel {

    private readonly response: YouTubeDataApiVideoListResponseType;

    constructor(youtubeDataList: YouTubeDataApiVideoList) {

        this.response = youtubeDataList.response;
    }

}