import ENV from '../../../../env.json';
import { envConfig } from '../../../../util/const/EnvConfig';
import { ApiClient } from '../../../../util/service/ApiClient';
import { QueryBuilder } from '../../../../util/service/QueryBuilder';
import { YouTubeDataApiBasePathModel } from '../../common/model/YouTubeDataApiBasePathModel';
import { YouTubeDataApiChannelResponseType } from '../type/YouTubeDataApiChannelResponseType';
import { YouTubeDataApiChannelEndPointModel } from './YouTubeDataApiChannelEndPointModel';


export class YouTubeDataApiChannelModel {

    // api通信用クラス
    private static readonly _apiClient: ApiClient = new ApiClient();
    // YouTube Data Apiのチャンネルのレスポンス
    private readonly _response: YouTubeDataApiChannelResponseType;


    private constructor(response: YouTubeDataApiChannelResponseType) {

        this._response = response;
    }

    get response() {
        return this._response;
    }

    /**
     * YouTube Data Apiを呼び出す
     */
    static async call(youTubeDataApiChannelEndPointModel: YouTubeDataApiChannelEndPointModel) {

        const apiUrl = youTubeDataApiChannelEndPointModel.endpoint;

        try {
            // YouTube Data Apiを呼び出す
            const response: YouTubeDataApiChannelResponseType = await this._apiClient.get(apiUrl);
            return new YouTubeDataApiChannelModel(response);
        } catch (err) {

            const errorDetails = {
                message: `YouTube Data Api(チャンネル)の呼び出しでエラーが発生しました。`,
                url: apiUrl,
                error: err
            };

            throw Error(JSON.stringify(errorDetails));
        }
    }
}