import { Router, Request, Response, NextFunction } from 'express';
import ENV from '../../env.json';
import { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_INTERNAL_SERVER_ERROR, HTTP_STATUS_OK, HTTP_STATUS_UNPROCESSABLE_ENTITY } from '../../util/const/HttpStatusConst';
import { RouteController } from '../../router/controller/RouteController';
import { AsyncErrorHandler } from '../../router/service/AsyncErrorHandler';
import { ZodIssue } from 'zod';
import { ApiResponse } from '../../util/service/ApiResponse';
import { SUCCESS_MESSAGE } from '../const/GetVideoDetailConst';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { GetVideoDetailService } from '../service/GetVideoDetailService';
import { VideoIdModel } from '../../internaldata/common/properties/VideoIdModel';


export class GetVideoDetailController extends RouteController {

    private getVideoDetailService = new GetVideoDetailService();

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

        // レスポンス用に型を変換する
        let convertedVideoDetail = this.getVideoDetailService.convertVideoDetail(youTubeVideoDetailApi);

        // jwt取得
        const token = this.getVideoDetailService.getToken(req);

        // ログインしている場合はお気に入りチェックを実施
        if (token) {
            const jsonWebTokenUserModel = await this.getVideoDetailService.checkJwtVerify(req);

            // お気に入り登録チェック
            convertedVideoDetail = await this.getVideoDetailService.checkFavorite(convertedVideoDetail, jsonWebTokenUserModel);
        }

        return ApiResponse.create(res, HTTP_STATUS_OK, SUCCESS_MESSAGE, convertedVideoDetail);
    }
}