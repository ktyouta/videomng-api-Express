import { VideoIdModel } from '../../../../internaldata/common/properties/VideoIdModel';
import { envConfig } from '../../../../util/const/EnvConfig';
import { ApiClient } from '../../../../util/service/ApiClient';
import { QueryBuilder } from '../../../../util/service/QueryBuilder';
import { YouTubeDataApiBasePathModel } from '../../common/model/YouTubeDataApiBasePathModel';
import { YouTubeDataApiVideoListResponseType } from '../../videolist/type/YouTubeDataApiVideoListResponseType';
import { YouTubeDataApiCommentDetailResponseType } from '../type/YouTubeDataApiCommentDetailResponseType';
import { YouTubeDataApiCommentDetailEndPointModel } from './YouTubeDataApiCommentDetailEndPointModel';


export class YouTubeDataApiCommentDetailModel {

    // api通信用クラス
    private static readonly _apiClient: ApiClient = new ApiClient();
    // YouTube Data Apiの動画コメント詳細のレスポンス
    private readonly _response: YouTubeDataApiCommentDetailResponseType;


    private constructor(response: YouTubeDataApiCommentDetailResponseType) {

        this._response = response;
    }

    get response() {
        return this._response;
    }

    /**
     * YouTube Data Apiを呼び出す
     */
    static async call(youTubeDataApiCommentDetailEndPointModel: YouTubeDataApiCommentDetailEndPointModel) {

        const apiUrl = youTubeDataApiCommentDetailEndPointModel.endpoint;

        try {
            // YouTube Data Api(動画詳細)を呼び出す
            const response: YouTubeDataApiCommentDetailResponseType = await this._apiClient.get(apiUrl);
            return new YouTubeDataApiCommentDetailModel(response);
        } catch (err) {

            const errorDetails = {
                message: `YouTube Data Api(動画コメント詳細)の呼び出しでエラーが発生しました。`,
                url: apiUrl,
                error: err
            };

            throw Error(JSON.stringify(errorDetails));
        }
    }
}