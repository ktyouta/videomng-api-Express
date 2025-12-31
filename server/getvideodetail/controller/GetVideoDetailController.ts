import { Request, Response } from 'express';
import { AccessTokenError } from '../../accesstoken/model/AccessTokenError';
import { VideoIdModel } from '../../internaldata/common/properties/VideoIdModel';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { RouteController } from '../../router/controller/RouteController';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { RepositoryType } from '../../util/const/CommonConst';
import { HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK, HTTP_STATUS_UNAUTHORIZED } from '../../util/const/HttpStatusConst';
import { ApiResponse } from '../../util/service/ApiResponse';
import { SUCCESS_MESSAGE } from '../const/GetVideoDetailConst';
import { GetVideoDetialRepositorys } from '../repository/GetVideoDetialRepositorys';
import { GetVideoDetailService } from '../service/GetVideoDetailService';


export class GetVideoDetailController extends RouteController {

    private readonly getVideoDetailService = new GetVideoDetailService((new GetVideoDetialRepositorys()).get(RepositoryType.POSTGRESQL));

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.GET,
            this.doExecute,
            ApiEndopoint.VIDEO_INFO_ID
        );
    }


    /**
     * 動画詳細を取得する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: Request, res: Response) {

        const id = req.params.id;

        if (!id) {
            throw Error(`動画IDが指定されていません。`);
        }

        const videoIdModel = new VideoIdModel(id);

        // YouTube Data Apiから動画詳細を取得する
        const youTubeVideoDetailApi = await this.getVideoDetailService.callYouTubeDataDetailApi(videoIdModel);

        const response = youTubeVideoDetailApi.response;

        if (response.items.length === 0) {
            return ApiResponse.create(res, HTTP_STATUS_NOT_FOUND, `動画情報が取得できませんでした。`);
        }

        // レスポンス用に型を変換する
        let convertedVideoDetail = this.getVideoDetailService.convertVideoDetail(youTubeVideoDetailApi);

        try {

            // アクセストークン取得
            const accessTokenModel = this.getVideoDetailService.getAccessToken(req);

            // ログインしている場合はお気に入りチェックを実施
            if (accessTokenModel.token) {

                // お気に入り登録チェック
                convertedVideoDetail = await this.getVideoDetailService.checkFavorite(convertedVideoDetail, accessTokenModel);
            }
        } catch (err) {

            if (err instanceof AccessTokenError) {
                return ApiResponse.create(res, HTTP_STATUS_UNAUTHORIZED, `認証エラー`);
            }

            throw Error(`${err}`);
        }

        return ApiResponse.create(res, HTTP_STATUS_OK, SUCCESS_MESSAGE, convertedVideoDetail);
    }
}