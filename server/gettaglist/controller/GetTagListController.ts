import { NextFunction, Response } from 'express';
import { HTTP_STATUS_CREATED } from "../../common/const/HttpStatusConst";
import { authMiddleware } from "../../middleware/authMiddleware/authMiddleware";
import { ApiEndopoint } from "../../router/conf/ApiEndpoint";
import { RouteController } from "../../router/controller/RouteController";
import { HttpMethodType, RouteSettingModel } from "../../router/model/RouteSettingModel";
import { AuthenticatedRequest } from "../../types/AuthenticatedRequest";
import { ApiResponse } from "../../util/ApiResponse";
import { GetTagListResponseModel } from "../model/GetTagListResponseModel";
import { GetTagListService } from "../service/GetTagListService";


export class GetTagListController extends RouteController {

    private readonly getTagListService = new GetTagListService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.GET,
            this.doExecute,
            ApiEndopoint.TAG_INFO,
            [authMiddleware]
        );
    }

    /**
     * タグを取得する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: AuthenticatedRequest, res: Response, next: NextFunction) {

        const frontUserIdModel = req.userInfo.frontUserIdModel;

        // 永続ロジック用オブジェクトを取得
        const getGetTagListRepository = this.getTagListService.getGetTagListRepository();

        // タグを取得する
        const tagListList = await this.getTagListService.getTagList(
            getGetTagListRepository,
            frontUserIdModel,);

        // レスポンスを作成
        const getTagListResponse = new GetTagListResponseModel(tagListList);

        return ApiResponse.create(res, HTTP_STATUS_CREATED, `タグを取得しました。`, getTagListResponse.data);
    }
}