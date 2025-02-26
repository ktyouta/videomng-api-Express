import { YouTubeDataApiKeyword } from '../../external/youtubedataapi/videolist/properties/YouTubeDataApiKeyword';
import { YouTubeVideoListApi } from '../../external/youtubedataapi/videolist/serivce/YouTubeVideoListApi';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';


export class GetVideoListService {


    /**
     * YouTube Data Apiを呼び出す
     * @param keyword 
     */
    public async callYouTubeDataListApi(youTubeDataApiKeyword: YouTubeDataApiKeyword) {

        try {

            // YouTube Data Apiデータ取得
            const youTubeVideoListApi = await YouTubeVideoListApi.call(youTubeDataApiKeyword);

            return youTubeVideoListApi;

        } catch (err) {
            throw Error(`ERROR:${err} endpoint:${ApiEndopoint.VIDEO_INFO} keyword:${youTubeDataApiKeyword}`);
        }
    }

}