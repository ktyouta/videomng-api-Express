import { NextFunction, Request, Response } from 'express';
import { ApiEndopoint } from "../../router/conf/ApiEndpoint";
import { RouteController } from "../../router/controller/RouteController";
import { HttpMethodType, RouteSettingModel } from "../../router/model/RouteSettingModel";
import { RepositoryType } from "../../util/const/CommonConst";
import { HTTP_STATUS_OK } from "../../util/const/HttpStatusConst";
import { ApiResponse } from "../../util/service/ApiResponse";
import { GetViewStatusListResponseModel } from "../model/GetViewStatusListResponseModel";
import { GetViewStatusListRepositorys } from "../repository/GetViewStatusListRepositorys";
import { GetViewStatusListService } from "../service/GetViewStatusListService";


export class GetViewStatusListController extends RouteController {

    private readonly getViewStatusListService = new GetViewStatusListService((new GetViewStatusListRepositorys()).get(RepositoryType.POSTGRESQL));

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.GET,
            this.doExecute,
            ApiEndopoint.VIEW_STATUS
        );
    }

    /**
     * 視聴状況リストリストを取得する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: Request, res: Response, next: NextFunction) {

        // 視聴状況リストを取得
        const viewStatusList = await this.getViewStatusListService.getViewStatusList();

        // レスポンスを作成
        const getViewStatusListResponse = new GetViewStatusListResponseModel(viewStatusList);

        return ApiResponse.create(res, HTTP_STATUS_OK, `視聴状況リストを取得しました。`, getViewStatusListResponse.data);
    }
}