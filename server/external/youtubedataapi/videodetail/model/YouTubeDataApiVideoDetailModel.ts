import ENV from '../../../../env.json';
import { VideoIdModel } from '../../../../internaldata/favoritevideotransaction/properties/VideoIdModel';
import { envConfig } from '../../../../util/const/EnvConfig';
import { ApiClient } from '../../../../util/service/ApiClient';
import { QueryBuilder } from '../../../../util/service/QueryBuilder';
import { YouTubeDataApiBasePathModel } from '../../common/model/YouTubeDataApiBasePathModel';
import { YouTubeDataApiVideoListResponseType } from '../../videolist/type/YouTubeDataApiVideoListResponseType';
import { YouTubeDataApiVideoDetailResponseType } from '../type/YouTubeDataApiVideoDetailResponseType';
import { YouTubeDataApiVideoDetailEndPointModel } from './YouTubeDataApiVideoDetailEndPointModel';


export class YouTubeDataApiVideoDetailModel {

    // api通信用クラス
    private static readonly _apiClient: ApiClient = new ApiClient();
    // YouTube Data Apiの動画詳細のレスポンス
    private readonly _response: YouTubeDataApiVideoDetailResponseType;


    private constructor(response: YouTubeDataApiVideoDetailResponseType) {

        this._response = response;
    }

    get response() {
        return this._response;
    }

    /**
     * YouTube Data Apiを呼び出す
     */
    static async call(youTubeDataApiVideoDetailEndPointModel: YouTubeDataApiVideoDetailEndPointModel) {

        const apiUrl = youTubeDataApiVideoDetailEndPointModel.endpoint;

        try {
            // YouTube Data Api(動画詳細)を呼び出す
            const response: YouTubeDataApiVideoDetailResponseType = await this._apiClient.get(apiUrl);
            return new YouTubeDataApiVideoDetailModel(response);
        } catch (err) {

            const errorDetails = {
                message: `YouTube Data Api(動画詳細)の呼び出しでエラーが発生しました。`,
                url: apiUrl,
                error: err
            };

            throw Error(JSON.stringify(errorDetails));
        }
    }
}