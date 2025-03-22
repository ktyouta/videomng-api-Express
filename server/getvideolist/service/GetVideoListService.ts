import { YouTubeDataApiVideoListEndPointModel } from '../../external/youtubedataapi/videolist/model/YouTubeDataApiVideoListEndPointModel';
import { YouTubeDataApiVideoListModel } from '../../external/youtubedataapi/videolist/model/YouTubeDataApiVideoListModel';
import { YouTubeDataApiVideoListNextPageToken } from '../../external/youtubedataapi/videolist/properties/YouTubeDataApiCommentThreadNextPageToken';
import { YouTubeDataApiVideoListKeyword } from '../../external/youtubedataapi/videolist/properties/YouTubeDataApiVideoListKeyword';
import { YouTubeDataApiVideoListMaxResult } from '../../external/youtubedataapi/videolist/properties/YouTubeDataApiVideoListMaxResult';
import { YouTubeDataApiVideoListVideoType } from '../../external/youtubedataapi/videolist/properties/YouTubeDataApiVideoListVideoType';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';


export class GetVideoListService {


    /**
     * YouTube Data Apiを呼び出す
     * @param keyword 
     */
    public async callYouTubeDataListApi(youTubeDataApiVideoListKeyword: YouTubeDataApiVideoListKeyword,
        youTubeDataApiVideoListVideoType: YouTubeDataApiVideoListVideoType,
        youTubeDataApiVideoListNextPageToken: YouTubeDataApiVideoListNextPageToken,
    ) {

        try {

            // YouTube Data APIのエンドポイント
            const youTubeDataApiVideoListEndPointModel = new YouTubeDataApiVideoListEndPointModel(
                youTubeDataApiVideoListKeyword,
                youTubeDataApiVideoListVideoType,
                new YouTubeDataApiVideoListMaxResult(),
                youTubeDataApiVideoListNextPageToken,
            );

            // YouTube Data APIデータ取得
            const youTubeVideoListApi = await YouTubeDataApiVideoListModel.call(youTubeDataApiVideoListEndPointModel);

            return youTubeVideoListApi;

        } catch (err) {
            throw Error(`ERROR:${err} endpoint:${ApiEndopoint.VIDEO_INFO}`);
        }
    }
}