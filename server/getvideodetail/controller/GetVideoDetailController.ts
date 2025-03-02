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
import { GetVideoDetailResponseModel } from '../model/GetVideoDetailResponseModel';
import { GetVideoDetailQueryParameterSchema } from '../model/GetVideoDetailQueryParameterSchema';
import { VideoIdModel } from '../../internaldata/favoritevideotransaction/properties/VideoIdModel';


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
    public async doExecute(req: Request, res: Response, id: string) {

        if (!id) {
            throw Error(`動画IDが指定されていません。`);
        }

        const videoIdModel = new VideoIdModel(id);

        // YouTube Data Apiから動画詳細を取得する
        const youTubeVideoDetailApi = await this.getVideoDetailService.callYouTubeDataDetailApi(videoIdModel);

        // レスポンスのYouTube動画
        const getVideoDetailResponseModel = new GetVideoDetailResponseModel(youTubeVideoDetailApi);

        return ApiResponse.create(res, HTTP_STATUS_OK, SUCCESS_MESSAGE, getVideoDetailResponseModel);
    }
}