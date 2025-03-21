import { YouTubeDataApiCommentThreadEndPointModel } from '../../external/youtubedataapi/videocomment/model/YouTubeDataApiCommentThreadEndPointModel';
import { YouTubeDataApiCommentThreadModel } from '../../external/youtubedataapi/videocomment/model/YouTubeDataApiCommentThreadModel';
import { YouTubeDataApiCommentThreadMaxResult } from '../../external/youtubedataapi/videocomment/properties/YouTubeDataApiCommentThreadMaxResult';
import { YouTubeDataApiCommentThreadNextPageToken } from '../../external/youtubedataapi/videocomment/properties/YouTubeDataApiCommentThreadNextPageToken';
import { VideoIdModel } from '../../internaldata/favoritevideotransaction/properties/VideoIdModel';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';


export class GetVideoCommentService {


    /**
     * YouTube Data Apiを呼び出す
     * @param keyword 
     */
    public async callYouTubeDataCommentApi(videoIdModel: VideoIdModel) {

        try {

            // YouTube Data APIのエンドポイント
            const youTubeDataApiCommentThreadEndPointModel = new YouTubeDataApiCommentThreadEndPointModel(
                videoIdModel,
                new YouTubeDataApiCommentThreadMaxResult(),
                new YouTubeDataApiCommentThreadNextPageToken(),
            );

            // YouTube Data Apiデータ取得
            const youTubeDataApiCommentThreadModel = await YouTubeDataApiCommentThreadModel.call(youTubeDataApiCommentThreadEndPointModel);

            return youTubeDataApiCommentThreadModel;

        } catch (err) {
            throw Error(`ERROR:${err} endpoint:${ApiEndopoint.VIDEO_COMMENT_ID} id:${videoIdModel}`);
        }
    }

}