import { YouTubeDataApiVideoListRequestType } from '../../external/youtubedataapi/videolist/model/YouTubeDataApiVideoListRequestType';
import { YouTubeDataApiKeyword } from '../../external/youtubedataapi/videolist/properties/YouTubeDataApiKeyword';
import { YouTubeDataApiVideoType } from '../../external/youtubedataapi/videolist/properties/YouTubeDataApiVideoType';
import { YouTubeVideoListApi } from '../../external/youtubedataapi/videolist/serivce/YouTubeVideoListApi';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';


export class GetVideoListService {


    /**
     * YouTube Data Apiを呼び出す
     * @param keyword 
     */
    public async callYouTubeDataListApi(youTubeDataApiKeyword: YouTubeDataApiKeyword,
        youTubeDataApiVideoType: YouTubeDataApiVideoType
    ) {

        try {

            // YouTube Data APIのリクエスト
            const youTubeDataApiVideoListRequest = new YouTubeDataApiVideoListRequestType(
                youTubeDataApiKeyword,
                youTubeDataApiVideoType,
            );

            // YouTube Data Apiデータ取得
            const youTubeVideoListApi = await YouTubeVideoListApi.call(youTubeDataApiVideoListRequest);

            return youTubeVideoListApi;

        } catch (err) {
            throw Error(`ERROR:${err} endpoint:${ApiEndopoint.VIDEO_INFO}`);
        }
    }
}