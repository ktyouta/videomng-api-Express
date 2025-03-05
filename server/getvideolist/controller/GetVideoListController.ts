import { Router, Request, Response, NextFunction } from 'express';
import ENV from '../../env.json';
import { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_INTERNAL_SERVER_ERROR, HTTP_STATUS_OK, HTTP_STATUS_UNPROCESSABLE_ENTITY } from '../../util/const/HttpStatusConst';
import { RouteController } from '../../router/controller/RouteController';
import { AsyncErrorHandler } from '../../router/service/AsyncErrorHandler';
import { ZodIssue } from 'zod';
import { ApiResponse } from '../../util/service/ApiResponse';
import { GetVideoListService } from '../service/GetVideoListService';
import { SUCCESS_MESSAGE } from '../const/GetVideoListConst';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { GetVideoListQueryParameterSchema } from '../model/GetVideoListQueryParameterSchema';
import { GetVideoListResponseModel } from '../model/GetVideoListResponseModel';
import { YouTubeDataApiKeyword } from '../../external/youtubedataapi/videolist/properties/YouTubeDataApiKeyword';


export class GetVideoListController extends RouteController {

    private GetVideoListService = new GetVideoListService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.GET,
            this.doExecute,
            ApiEndopoint.VIDEO_INFO
        );
    }


    /**
     * 動画リストを取得する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: Request, res: Response) {

        // クエリパラメータを取得
        const query = req.query;

        // クエリパラメータのバリデーションチェック
        const validateResult = GetVideoListQueryParameterSchema.safeParse(query);

        // バリデーションエラー
        if (!validateResult.success) {

            // エラーメッセージを取得
            const validatErrMessage = validateResult.error.errors.map((e: ZodIssue) => {
                return e.message;
            }).join(`,`);

            return ApiResponse.create(res, HTTP_STATUS_UNPROCESSABLE_ENTITY, validatErrMessage);
        }

        // キーワードを取得
        const keyword = query[`q`] as string;
        const youTubeDataApiKeyword = new YouTubeDataApiKeyword(keyword);

        // YouTube Data Apiから動画を取得する
        const youTubeVideoListApi = await this.GetVideoListService.callYouTubeDataListApi(youTubeDataApiKeyword);

        // レスポンスのYouTube動画
        const getVideoListResponseModel = new GetVideoListResponseModel(youTubeVideoListApi);

        return ApiResponse.create(res, HTTP_STATUS_OK, SUCCESS_MESSAGE, getVideoListResponseModel.data);
    }
}