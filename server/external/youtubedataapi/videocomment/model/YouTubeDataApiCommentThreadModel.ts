import ENV from '../../../../env.json';
import { VideoIdModel } from '../../../../internaldata/common/properties/VideoIdModel';
import { envConfig } from '../../../../util/const/EnvConfig';
import { ApiClient } from '../../../../util/service/ApiClient';
import { QueryBuilder } from '../../../../util/service/QueryBuilder';
import { YouTubeDataApiBasePathModel } from '../../common/model/YouTubeDataApiBasePathModel';
import { YouTubeDataApiVideoListResponseType } from '../../videolist/type/YouTubeDataApiVideoListResponseType';
import { YouTubeDataApiCommentThreadResponseType } from '../type/YouTubeDataApiCommentThreadResponseType';
import { YouTubeDataApiCommentThreadEndPointModel } from './YouTubeDataApiCommentThreadEndPointModel';


export class YouTubeDataApiCommentThreadModel {

    // api通信用クラス
    private static readonly _apiClient: ApiClient = new ApiClient();
    // YouTube Data Apiの動画コメントのレスポンス
    private readonly _response: YouTubeDataApiCommentThreadResponseType;


    private constructor(response: YouTubeDataApiCommentThreadResponseType) {

        this._response = response;
    }

    get response() {
        return this._response;
    }

    /**
     * YouTube Data Apiを呼び出す
     */
    static async call(youTubeDataApiCommentThreadEndPointModel: YouTubeDataApiCommentThreadEndPointModel) {

        const apiUrl = youTubeDataApiCommentThreadEndPointModel.endpoint;

        try {
            // YouTube Data Api(動画詳細)を呼び出す
            const response: YouTubeDataApiCommentThreadResponseType = await this._apiClient.get(apiUrl);
            return new YouTubeDataApiCommentThreadModel(response);
        } catch (err) {

            const errorDetails = {
                message: `YouTube Data Api(動画コメント)の呼び出しでエラーが発生しました。`,
                url: apiUrl,
                error: err
            };

            throw Error(JSON.stringify(errorDetails));
        }
    }
}