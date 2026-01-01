import { ApiClient } from '../../../../util/ApiClient';
import { YouTubeDataApiVideoCategoryResponseType } from '../type/YouTubeDataApiVideoCategoryResponseType';
import { YouTubeDataApiVideoCategoryEndPointModel } from './YouTubeDataApiVideoCategoryEndPointModel';


export class YouTubeDataApiVideoCategoryModel {

    // api通信用クラス
    private static readonly _apiClient: ApiClient = new ApiClient();
    // YouTube Data Apiの動画コメントのレスポンス
    private readonly _response: YouTubeDataApiVideoCategoryResponseType;


    private constructor(response: YouTubeDataApiVideoCategoryResponseType) {

        this._response = response;
    }

    get response() {
        return this._response;
    }

    /**
     * YouTube Data Apiを呼び出す
     */
    static async call(touTubeDataApiVideoCategoryEndPointModel: YouTubeDataApiVideoCategoryEndPointModel) {

        const apiUrl = touTubeDataApiVideoCategoryEndPointModel.endpoint;

        try {
            // YouTube Data Api(動画カテゴリ)を呼び出す
            const response: YouTubeDataApiVideoCategoryResponseType = await this._apiClient.get(apiUrl);
            return new YouTubeDataApiVideoCategoryModel(response);
        } catch (err) {

            const errorDetails = {
                message: `YouTube Data Api(動画カテゴリ)の呼び出しでエラーが発生しました。`,
                url: apiUrl,
                error: err
            };

            throw Error(JSON.stringify(errorDetails));
        }
    }
}