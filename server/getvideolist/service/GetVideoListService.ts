import { YouTubeDataApiVideoList } from '../../external/youtubedataapi/videolist/serivce/YoutubeDataApiVideoList';
import { YouTubeDataApiKeyword } from '../../external/youtubedataapi/videolist/properties/YouTubeDataApiKeyword';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';


export class GetVideoListService {


    /**
     * YouTube Data Apiを呼び出す
     * @param keyword 
     */
    public async callYouTubeDataListApi(keyword: string) {

        try {

            const youTubeDataApiKeyword = new YouTubeDataApiKeyword(keyword);

            // YouTube Data Apiデータ取得
            const googleBookInfoApis = await YouTubeDataApiVideoList.call(youTubeDataApiKeyword);

            return googleBookInfoApis;

        } catch (err) {
            throw Error(`ERROR:${err} endpoint:${ApiEndopoint.VIDEO_INFO} keyword:${keyword}`);
        }
    }

}