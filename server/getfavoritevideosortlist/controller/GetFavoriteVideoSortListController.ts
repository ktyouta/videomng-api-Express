import { NextFunction, Request, Response } from 'express';
import { ApiEndopoint } from "../../router/conf/ApiEndpoint";
import { RouteController } from "../../router/controller/RouteController";
import { HttpMethodType, RouteSettingModel } from "../../router/model/RouteSettingModel";
import { HTTP_STATUS_OK } from "../../util/const/HttpStatusConst";
import { ApiResponse } from "../../util/service/ApiResponse";
import { GetFavoriteVideoSortListService } from "../service/GetFavoriteVideoSortListService";


export class GetFavoriteVideoSortListController extends RouteController {

    private readonly getFavoriteVideoSortListService = new GetFavoriteVideoSortListService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.GET,
            this.doExecute,
            ApiEndopoint.FAVORITE_VIDEO_SORT
        );
    }

    /**
     * お気に入り動画ソートリストリストを取得する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: Request, res: Response, next: NextFunction) {

        // お気に入り動画ソートリストを取得
        const viewStatusList = await this.getFavoriteVideoSortListService.getFavoriteVideoSortList();

        return ApiResponse.create(res, HTTP_STATUS_OK, `お気に入り動画ソートリストを取得しました。`, viewStatusList);
    }
}