import { YouTubeDataApiVideoCategoryEndPointModel } from '../../external/youtubedataapi/videocategory/model/YouTubeDataApiVideoCategoryEndPointModel';
import { YouTubeDataApiVideoCategoryModel } from '../../external/youtubedataapi/videocategory/model/YouTubeDataApiVideoCategoryModel';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';


export class GetVideoCategoryService {


    /**
     * YouTube Data Apiを呼び出す
     * @param keyword 
     */
    public async callYouTubeVideoCategoryApi() {

        try {

            // YouTube Data APIのエンドポイント
            const youTubeDataApiVideoCategoryEndPointModel = new YouTubeDataApiVideoCategoryEndPointModel();

            // YouTube Data APIデータ取得
            const youTubeVideoCategoryApi = await YouTubeDataApiVideoCategoryModel.call(youTubeDataApiVideoCategoryEndPointModel);

            return youTubeVideoCategoryApi;

        } catch (err) {
            throw Error(`ERROR:${err} endpoint:${ApiEndopoint.VIDEO_CATEGORY}`);
        }
    }
}