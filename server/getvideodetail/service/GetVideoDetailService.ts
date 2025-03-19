import { YouTubeDataApiVideoDetailEndPointModel } from '../../external/youtubedataapi/videodetail/model/YouTubeDataApiVideoDetailEndPointModel';
import { YouTubeDataApiVideoDetailModel } from '../../external/youtubedataapi/videodetail/model/YouTubeDataApiVideoDetailModel';
import { VideoIdModel } from '../../internaldata/favoritevideotransaction/properties/VideoIdModel';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';


export class GetVideoDetailService {


    /**
     * YouTube Data Apiを呼び出す
     * @param keyword 
     */
    public async callYouTubeDataDetailApi(videoIdModel: VideoIdModel) {

        try {

            // YouTube Data APIのエンドポイント
            const youTubeDataApiVideoDetailEndPointModel = new YouTubeDataApiVideoDetailEndPointModel(
                videoIdModel,
            );

            // YouTube Data Apiデータ取得
            const youtubeVideoDetailApi = await YouTubeDataApiVideoDetailModel.call(youTubeDataApiVideoDetailEndPointModel);

            return youtubeVideoDetailApi;

        } catch (err) {
            throw Error(`ERROR:${err} endpoint:${ApiEndopoint.VIDEO_INFO_ID} id:${videoIdModel}`);
        }
    }

}