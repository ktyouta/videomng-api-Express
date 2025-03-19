import { YoutubeVideoDetailApi } from '../../external/youtubedataapi/videodetail/service/YoutubeVideoDetailApi';
import { VideoIdModel } from '../../internaldata/favoritevideotransaction/properties/VideoIdModel';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';


export class GetVideoDetailService {


    /**
     * YouTube Data Apiを呼び出す
     * @param keyword 
     */
    public async callYouTubeDataDetailApi(videoIdModel: VideoIdModel) {

        try {

            // YouTube Data Apiデータ取得
            const youtubeVideoDetailApi = await YoutubeVideoDetailApi.call(videoIdModel);

            return youtubeVideoDetailApi;

        } catch (err) {
            throw Error(`ERROR:${err} endpoint:${ApiEndopoint.VIDEO_INFO_ID} id:${videoIdModel}`);
        }
    }

}