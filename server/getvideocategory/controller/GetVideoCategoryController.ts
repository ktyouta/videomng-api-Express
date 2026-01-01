import { Request, Response } from 'express';
import { HTTP_STATUS_OK } from '../../common/const/HttpStatusConst';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { RouteController } from '../../router/controller/RouteController';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { ApiResponse } from '../../util/ApiResponse';
import { SUCCESS_MESSAGE } from '../const/GetVideoCategoryConst';
import { GetVideoCategoryResponseModel } from '../model/GetVideoCategoryResponseModel';
import { GetVideoCategoryService } from '../service/GetVideoCategoryService';


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