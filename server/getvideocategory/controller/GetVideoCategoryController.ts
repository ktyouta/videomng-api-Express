import { Router, Request, Response, NextFunction } from 'express';
import { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_INTERNAL_SERVER_ERROR, HTTP_STATUS_OK, HTTP_STATUS_UNPROCESSABLE_ENTITY } from '../../util/const/HttpStatusConst';
import { RouteController } from '../../router/controller/RouteController';
import { AsyncErrorHandler } from '../../router/service/AsyncErrorHandler';
import { ZodIssue } from 'zod';
import { ApiResponse } from '../../util/service/ApiResponse';
import { SUCCESS_MESSAGE } from '../const/GetVideoCategoryConst';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { GetVideoCategoryService } from '../service/GetVideoCategoryService';
import { GetVideoCategoryResponseModel } from '../model/GetVideoCategoryResponseModel';


export class GetVideoCategoryController extends RouteController {

    private GetVideoCategoryService = new GetVideoCategoryService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.GET,
            this.doExecute,
            ApiEndopoint.VIDEO_CATEGORY
        );
    }


    /**
     * 動画カテゴリを取得する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: Request, res: Response) {

        // YouTube Data Apiから動画カテゴリを取得する
        const youTubeVideoCategoryApi = await this.GetVideoCategoryService.callYouTubeVideoCategoryApi();

        // レスポンスのYouTube動画
        const getVideoCategoryResponseModel = new GetVideoCategoryResponseModel(youTubeVideoCategoryApi);

        return ApiResponse.create(res, HTTP_STATUS_OK, SUCCESS_MESSAGE, getVideoCategoryResponseModel.data);
    }
}